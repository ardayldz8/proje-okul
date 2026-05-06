import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { hasStudentAttemptAccess } from "@/lib/student-attempt-access";

export const STUDENT_SESSION_COOKIE_NAME = "student_portal_session";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getSigningSecret() {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Student session secret is not configured.");
    }

    return "development-student-session-secret";
  }

  return secret;
}

function signStudentId(studentId: string) {
  return createHmac("sha256", getSigningSecret()).update(studentId).digest("base64url");
}

function createSessionValue(studentId: string) {
  return `${studentId}.${signStudentId(studentId)}`;
}

function signaturesMatch(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

function getStudentIdFromCookieValue(value: string) {
  const separatorIndex = value.lastIndexOf(".");

  if (separatorIndex <= 0) {
    return null;
  }

  const studentId = value.slice(0, separatorIndex);
  const signature = value.slice(separatorIndex + 1);

  if (!studentId || !signature) {
    return null;
  }

  return signaturesMatch(signature, signStudentId(studentId)) ? studentId : null;
}

export async function grantStudentSession(studentId: string) {
  const cookieStore = await cookies();

  cookieStore.set(STUDENT_SESSION_COOKIE_NAME, createSessionValue(studentId), {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getStudentSessionStudentId() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(STUDENT_SESSION_COOKIE_NAME)?.value;

  if (!cookieValue) {
    return null;
  }

  return getStudentIdFromCookieValue(cookieValue);
}

export async function getCurrentStudentSession() {
  const studentId = await getStudentSessionStudentId();

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
      createdAt: true,
    },
  });
}

export async function requireStudentSession() {
  const student = await getCurrentStudentSession();

  if (!student) {
    redirect("/student/login");
  }

  return student;
}

export async function canAccessStudentAttempt(attemptId: string) {
  if (await hasStudentAttemptAccess(attemptId)) {
    return true;
  }

  const studentId = await getStudentSessionStudentId();

  if (!studentId) {
    return false;
  }

  const attempt = await db.testAttempt.findFirst({
    where: {
      id: attemptId,
      studentId,
    },
    select: { id: true },
  });

  return Boolean(attempt);
}

export async function requireStudentAttemptPermission(attemptId: string) {
  if (!(await canAccessStudentAttempt(attemptId))) {
    throw new Error("Bu test denemesi icin erisim yetkiniz yok.");
  }
}
