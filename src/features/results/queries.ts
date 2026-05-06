import { AttemptStatus } from "@prisma/client";

import { db } from "@/lib/db";

export async function getTeacherResults(teacherId: string) {
  return db.testAttempt.findMany({
    where: {
      status: AttemptStatus.COMPLETED,
      test: {
        ownerTeacherId: teacherId,
      },
    },
    orderBy: { completedAt: "desc" },
    select: {
      id: true,
      completedAt: true,
      durationSeconds: true,
      score: true,
      correctCount: true,
      wrongCount: true,
      emptyCount: true,
      student: {
        select: {
          fullName: true,
          email: true,
          gradeLevel: true,
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
  });
}

export async function getTeacherStudents(teacherId: string) {
  return db.teacherStudent.findMany({
    where: { teacherId },
    orderBy: { assignedAt: "desc" },
    select: {
      id: true,
      assignedAt: true,
      note: true,
      student: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          gradeLevel: true,
          schoolName: true,
          attempts: {
            where: {
              test: {
                ownerTeacherId: teacherId,
              },
            },
            orderBy: { completedAt: "desc" },
            select: {
              id: true,
              status: true,
              completedAt: true,
              score: true,
              test: {
                select: {
                  title: true,
                  course: {
                    select: { title: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getTeacherResultDetail(teacherId: string, attemptId: string) {
  return db.testAttempt.findFirst({
    where: {
      id: attemptId,
      status: AttemptStatus.COMPLETED,
      test: {
        ownerTeacherId: teacherId,
      },
    },
    select: {
      id: true,
      startedAt: true,
      completedAt: true,
      durationSeconds: true,
      score: true,
      correctCount: true,
      wrongCount: true,
      emptyCount: true,
      student: {
        select: {
          fullName: true,
          email: true,
          phone: true,
          gradeLevel: true,
          schoolName: true,
        },
      },
      test: {
        select: {
          title: true,
          description: true,
          durationMinutes: true,
          course: {
            select: { title: true },
          },
        },
      },
      answers: {
        orderBy: { answeredAt: "asc" },
        select: {
          id: true,
          selectedOption: true,
          isCorrect: true,
          questionTextSnapshot: true,
          optionASnapshot: true,
          optionBSnapshot: true,
          optionCSnapshot: true,
          optionDSnapshot: true,
          correctOptionSnapshot: true,
          explanationSnapshot: true,
          question: {
            select: {
              questionText: true,
              optionA: true,
              optionB: true,
              optionC: true,
              optionD: true,
              correctOption: true,
              explanation: true,
            },
          },
        },
      },
    },
  });
}
