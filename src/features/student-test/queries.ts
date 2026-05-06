import { AttemptStatus, TestStatus, UserRole } from "@prisma/client";

import { db } from "@/lib/db";
import { canAccessStudentAttempt } from "@/lib/student-session";

function activeTestWhere(now: Date) {
  return {
    status: TestStatus.ACTIVE,
    OR: [{ startsAt: null }, { startsAt: { lte: now } }],
    AND: [{ OR: [{ endsAt: null }, { endsAt: { gt: now } }] }],
  };
}

export async function getPublicTestStartData(testId: string) {
  const now = new Date();

  const [test, teachers] = await Promise.all([
    db.test.findFirst({
      where: {
        id: testId,
        ...activeTestWhere(now),
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

  return { test, teachers };
}

export async function getAttemptForSolving(attemptId: string) {
  if (!(await canAccessStudentAttempt(attemptId))) {
    return null;
  }

  const attempt = await db.testAttempt.findFirst({
    where: {
      id: attemptId,
      status: AttemptStatus.IN_PROGRESS,
    },
    select: {
      id: true,
      startedAt: true,
      test: {
        select: {
          id: true,
          title: true,
          description: true,
          durationMinutes: true,
          course: {
            select: {
              title: true,
            },
          },
          testQuestions: {
            orderBy: { orderIndex: "asc" },
            select: {
              orderIndex: true,
              points: true,
              question: {
                select: {
                  id: true,
                  questionText: true,
                  optionA: true,
                  optionB: true,
                  optionC: true,
                  optionD: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!attempt) {
    return null;
  }

  return {
    ...attempt,
    remainingSeconds: getRemainingSeconds(attempt.startedAt, attempt.test.durationMinutes),
  };
}

export async function getAttemptResult(attemptId: string) {
  if (!(await canAccessStudentAttempt(attemptId))) {
    return null;
  }

  const attempt = await db.testAttempt.findFirst({
    where: {
      id: attemptId,
      status: AttemptStatus.COMPLETED,
    },
    select: {
      id: true,
      score: true,
      correctCount: true,
      wrongCount: true,
      emptyCount: true,
      startedAt: true,
      completedAt: true,
      durationSeconds: true,
      test: {
        select: {
          title: true,
          showResultImmediately: true,
          course: {
            select: { title: true },
          },
        },
      },
    },
  });

  if (!attempt || !attempt.test.showResultImmediately) {
    return attempt ? { ...attempt, answers: [] } : null;
  }

  return db.testAttempt.findFirst({
    where: {
      id: attemptId,
      status: AttemptStatus.COMPLETED,
    },
    select: {
      id: true,
      score: true,
      correctCount: true,
      wrongCount: true,
      emptyCount: true,
      startedAt: true,
      completedAt: true,
      durationSeconds: true,
      test: {
        select: {
          title: true,
          showResultImmediately: true,
          course: {
            select: { title: true },
          },
        },
      },
      answers: {
        orderBy: { answeredAt: "asc" },
        select: {
          selectedOption: true,
          isCorrect: true,
          questionTextSnapshot: true,
          optionASnapshot: true,
          optionBSnapshot: true,
          optionCSnapshot: true,
          optionDSnapshot: true,
          correctOptionSnapshot: true,
          question: {
            select: {
              questionText: true,
              optionA: true,
              optionB: true,
              optionC: true,
              optionD: true,
              correctOption: true,
            },
          },
        },
      },
    },
  });
}

function getRemainingSeconds(startedAt: Date, durationMinutes: number | null) {
  if (!durationMinutes) {
    return null;
  }

  const durationSeconds = durationMinutes * 60;
  const elapsedSeconds = Math.floor((Date.now() - startedAt.getTime()) / 1000);

  return Math.max(durationSeconds - elapsedSeconds, 0);
}
