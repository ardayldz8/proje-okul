import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

const COOKIE_NAME = "student_portal_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getSessionSecret() {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NEXTAUTH_SECRET or AUTH_SECRET is required for student sessions.");
    }

    return "development-student-session-secret";
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function encodeSession(studentId: string) {
  const payload = Buffer.from(JSON.stringify({ studentId }), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeSession(value: string | undefined) {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expected = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { studentId?: unknown };
    return typeof parsed.studentId === "string" ? parsed.studentId : null;
  } catch {
    return null;
  }
}

export async function createStudentSession(studentId: string) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, encodeSession(studentId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearStudentSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentStudentSession() {
  const cookieStore = await cookies();
  const studentId = decodeSession(cookieStore.get(COOKIE_NAME)?.value);

  if (!studentId) {
    return null;
  }

  return db.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      gradeLevel: true,
      schoolName: true,
    },
  });
}

export async function requireStudentSession() {
  const student = await getCurrentStudentSession();

  if (!student) {
    redirect("/login");
  }

  return student;
}
