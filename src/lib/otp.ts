import { OtpPurpose } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

import { db } from "@/lib/db";

const OTP_TTL_MINUTES = 5;
const OTP_RATE_LIMIT_WINDOW_MINUTES = 5;
const OTP_RATE_LIMIT_MAX_REQUESTS = 3;

function generateOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export async function createStudentTestOtp(email: string) {
  const normalizedEmail = email.toLowerCase();
  const now = new Date();
  const windowStart = addMinutes(now, -OTP_RATE_LIMIT_WINDOW_MINUTES);

  const recentOtpCount = await db.otpVerification.count({
    where: {
      email: normalizedEmail,
      purpose: OtpPurpose.STUDENT_TEST_START,
      createdAt: { gte: windowStart },
    },
  });

  if (recentOtpCount >= OTP_RATE_LIMIT_MAX_REQUESTS) {
    return { ok: false as const, error: "Cok fazla kod istendi. Lutfen birkac dakika sonra tekrar deneyin." };
  }

  const code = generateOtpCode();
  const codeHash = await bcrypt.hash(code, 12);

  await db.otpVerification.create({
    data: {
      email: normalizedEmail,
      codeHash,
      purpose: OtpPurpose.STUDENT_TEST_START,
      expiresAt: addMinutes(now, OTP_TTL_MINUTES),
    },
  });

  await sendOtpEmail(normalizedEmail, code);

  return { ok: true as const };
}

export async function verifyStudentTestOtp(email: string, code: string) {
  const normalizedEmail = email.toLowerCase();
  const now = new Date();

  const otp = await db.otpVerification.findFirst({
    where: {
      email: normalizedEmail,
      purpose: OtpPurpose.STUDENT_TEST_START,
      consumedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    return { ok: false as const, error: "Dogrulama kodu bulunamadi. Lutfen yeni kod isteyin." };
  }

  if (otp.expiresAt <= now) {
    return { ok: false as const, error: "Dogrulama kodunun suresi doldu. Lutfen yeni kod isteyin." };
  }

  if (otp.attemptCount >= 5) {
    return { ok: false as const, error: "Cok fazla hatali deneme yapildi. Lutfen yeni kod isteyin." };
  }

  const isValid = await bcrypt.compare(code, otp.codeHash);

  if (!isValid) {
    await db.otpVerification.update({
      where: { id: otp.id },
      data: { attemptCount: { increment: 1 } },
    });

    return { ok: false as const, error: "Dogrulama kodu hatali." };
  }

  await db.otpVerification.update({
    where: { id: otp.id },
    data: { consumedAt: now },
  });

  return { ok: true as const };
}

async function sendOtpEmail(email: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes("placeholder") || apiKey.includes("change_me")) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[dev otp] ${email}: ${code}`);
      return;
    }

    throw new Error("RESEND_API_KEY is not configured.");
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: "Online Test <noreply@example.com>",
    to: email,
    subject: "Online Test dogrulama kodunuz",
    text: `Dogrulama kodunuz: ${code}. Bu kod ${OTP_TTL_MINUTES} dakika gecerlidir.`,
  });
}
