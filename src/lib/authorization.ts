import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

export async function getCurrentProfile() {
  const session = await getCurrentSession();

  if (!session?.user.profileId) {
    return null;
  }

  return db.profile.findUnique({
    where: { id: session.user.profileId },
  });
}

export async function requireTeacher() {
  const session = await getCurrentSession();

  if (!session?.user.profileId || session.user.role !== UserRole.TEACHER) {
    redirect("/teacher/login");
  }

  return session;
}

export async function requireAdmin() {
  const session = await getCurrentSession();

  if (!session?.user.profileId || session.user.role !== UserRole.ADMIN) {
    redirect("/teacher/login");
  }

  return session;
}

export async function getTeacherProfile() {
  const session = await requireTeacher();

  return db.profile.findUniqueOrThrow({
    where: { id: session.user.profileId },
  });
}

export async function assertOwnsQuestion(questionId: string) {
  const session = await requireTeacher();
  const question = await db.question.findFirst({
    where: {
      id: questionId,
      ownerTeacherId: session.user.profileId,
    },
    select: { id: true },
  });

  if (!question) {
    throw new Error("Bu soru icin yetkiniz yok.");
  }
}

export async function assertOwnsTest(testId: string) {
  const session = await requireTeacher();
  const test = await db.test.findFirst({
    where: {
      id: testId,
      ownerTeacherId: session.user.profileId,
    },
    select: { id: true },
  });

  if (!test) {
    throw new Error("Bu test icin yetkiniz yok.");
  }
}

export async function assertCanViewAttempt(attemptId: string) {
  const session = await requireTeacher();
  const attempt = await db.testAttempt.findFirst({
    where: {
      id: attemptId,
      test: {
        ownerTeacherId: session.user.profileId,
      },
    },
    select: { id: true },
  });

  if (!attempt) {
    throw new Error("Bu sonuc icin yetkiniz yok.");
  }
}
