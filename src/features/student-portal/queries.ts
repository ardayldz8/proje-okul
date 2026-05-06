import { AttemptStatus, TestStatus, UserRole } from "@prisma/client";

import { db } from "@/lib/db";

export async function getStudentDashboardData(studentId: string) {
  const [student, assignedTeachers, attempts] = await Promise.all([
    db.student.findUniqueOrThrow({
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
    }),
    db.teacherStudent.findMany({
      where: { studentId },
      orderBy: { assignedAt: "desc" },
      select: {
        id: true,
        assignedAt: true,
        note: true,
        teacher: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    }),
    db.testAttempt.findMany({
      where: { studentId },
      orderBy: [{ completedAt: "desc" }, { startedAt: "desc" }],
      select: {
        id: true,
        status: true,
        startedAt: true,
        completedAt: true,
        durationSeconds: true,
        score: true,
        correctCount: true,
        wrongCount: true,
        emptyCount: true,
        test: {
          select: {
            title: true,
            showResultImmediately: true,
            course: {
              select: { title: true, slug: true },
            },
            ownerTeacher: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const completedAttempts = attempts.filter((attempt) => attempt.status === AttemptStatus.COMPLETED);
  const averageScore = completedAttempts.length > 0 ? Math.round(completedAttempts.reduce((sum, attempt) => sum + (attempt.score ?? 0), 0) / completedAttempts.length) : 0;
  const bestScore = completedAttempts.reduce((max, attempt) => Math.max(max, Math.round(attempt.score ?? 0)), 0);

  return {
    student,
    assignedTeachers,
    attempts,
    stats: {
      completedAttemptCount: completedAttempts.length,
      inProgressAttemptCount: attempts.filter((attempt) => attempt.status === AttemptStatus.IN_PROGRESS).length,
      teacherCount: assignedTeachers.length,
      averageScore,
      bestScore,
    },
  };
}

export async function getStudentTestStartData(studentId: string, testId: string) {
  const now = new Date();

  const [student, test, teachers] = await Promise.all([
    db.student.findUniqueOrThrow({
      where: { id: studentId },
      select: {
        id: true,
        fullName: true,
        email: true,
        gradeLevel: true,
        schoolName: true,
      },
    }),
    db.test.findFirst({
      where: {
        id: testId,
        status: TestStatus.ACTIVE,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gt: now } }] }],
      },
      select: {
        id: true,
        title: true,
        description: true,
        durationMinutes: true,
        showResultImmediately: true,
        course: {
          select: {
            title: true,
            slug: true,
          },
        },
        _count: {
          select: {
            testQuestions: true,
          },
        },
      },
    }),
    db.profile.findMany({
      where: {
        role: UserRole.TEACHER,
        isActive: true,
      },
      orderBy: { fullName: "asc" },
      select: {
        id: true,
        fullName: true,
      },
    }),
  ]);

  return { student, test, teachers };
}
