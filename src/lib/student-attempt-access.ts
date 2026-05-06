import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_PREFIX = "student_attempt_access_";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;

function getSigningSecret() {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Student attempt access secret is not configured.");
    }

    return "development-student-attempt-access-secret";
  }

  return secret;
}

function getCookieName(attemptId: string) {
  return `${COOKIE_PREFIX}${attemptId}`;
}

function signAttemptId(attemptId: string) {
  return createHmac("sha256", getSigningSecret()).update(attemptId).digest("base64url");
}

function signaturesMatch(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export async function grantStudentAttemptAccess(attemptId: string) {
  const cookieStore = await cookies();

  cookieStore.set(getCookieName(attemptId), signAttemptId(attemptId), {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function hasStudentAttemptAccess(attemptId: string) {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(getCookieName(attemptId))?.value;

  if (!cookieValue) {
    return false;
  }

  return signaturesMatch(cookieValue, signAttemptId(attemptId));
}

export async function requireStudentAttemptAccess(attemptId: string) {
  const hasAccess = await hasStudentAttemptAccess(attemptId);

  if (!hasAccess) {
    throw new Error("Bu test denemesi icin erisim yetkiniz yok.");
  }
}
