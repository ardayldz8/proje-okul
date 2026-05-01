import { AttemptStatus } from "@prisma/client";

import { db } from "@/lib/db";

export async function getTeacherDashboardData(teacherId: string) {
  const [questionCount, testCount, completedAttemptCount, distinctStudents, recentAttempts] = await Promise.all([
    db.question.count({
      where: {
        ownerTeacherId: teacherId,
        isActive: true,
      },
    }),
    db.test.count({
      where: {
        ownerTeacherId: teacherId,
      },
    }),
    db.testAttempt.count({
      where: {
        status: AttemptStatus.COMPLETED,
        test: {
          ownerTeacherId: teacherId,
        },
      },
    }),
    db.testAttempt.findMany({
      where: {
        test: {
          ownerTeacherId: teacherId,
        },
      },
      distinct: ["studentId"],
      select: { studentId: true },
    }),
    db.testAttempt.findMany({
      where: {
        status: AttemptStatus.COMPLETED,
        test: {
          ownerTeacherId: teacherId,
        },
      },
      orderBy: { completedAt: "desc" },
      take: 5,
      select: {
        id: true,
        completedAt: true,
        score: true,
        correctCount: true,
        wrongCount: true,
        emptyCount: true,
        student: {
          select: {
            fullName: true,
            email: true,
          },
        },
        test: {
          select: {
            title: true,
            course: {
              select: { title: true },
            },
          },
        },
      },
    }),
  ]);

  return {
    stats: {
      questionCount,
      testCount,
      completedAttemptCount,
      studentCount: distinctStudents.length,
    },
    recentAttempts,
  };
}
