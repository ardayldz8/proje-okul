"use server";

import { TestStatus, UserRole } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { studentAttemptStartSchema } from "@/features/student-test/schemas";
import { calculateTestResult } from "@/features/student-test/scoring";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireStudentAttemptPermission, requireStudentSession } from "@/lib/student-session";
import { grantStudentAttemptAccess } from "@/lib/student-attempt-access";

async function getClientIp() {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return headerList.get("x-real-ip") ?? "unknown";
}

export type StartAttemptState = {
  error?: string;
};

export async function startStudentAttempt(_prevState: StartAttemptState, formData: FormData): Promise<StartAttemptState> {
  const student = await requireStudentSession();
  const parsed = studentAttemptStartSchema.safeParse({
    testId: formData.get("testId"),
    teacherId: formData.get("teacherId") || undefined,
    kvkkAccepted: formData.get("kvkkAccepted"),
    privacyAccepted: formData.get("privacyAccepted"),
    termsAccepted: formData.get("termsAccepted"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Form bilgilerini kontrol edin." };
  }

  const rateLimit = await checkRateLimit("testStart", await getClientIp());

  if (!rateLimit.success) {
    return { error: "Cok fazla test baslatma denemesi yapildi. Lutfen kisa bir sure sonra tekrar deneyin." };
  }

  const now = new Date();
  const test = await db.test.findFirst({
    where: {
      id: parsed.data.testId,
      status: TestStatus.ACTIVE,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gt: now } }] }],
    },
    select: { id: true },
  });

  if (!test) {
    return { error: "Test aktif degil veya artik erisilemiyor." };
  }

  const transactionResult = await db
    .$transaction(async (tx) => {
    const existingAttempt = await tx.testAttempt.findUnique({
      where: {
        testId_studentId: {
          testId: parsed.data.testId,
          studentId: student.id,
        },
      },
      select: { id: true },
    });

      if (existingAttempt) {
        return { error: "Bu testi daha once cozdunuz." } as const;
      }

      if (parsed.data.teacherId) {
        const teacher = await tx.profile.findFirst({
          where: {
            id: parsed.data.teacherId,
            role: UserRole.TEACHER,
            isActive: true,
          },
          select: { id: true },
        });

        if (!teacher) {
          return { error: "Secilen hoca bulunamadi veya aktif degil." } as const;
        }

        await tx.teacherStudent.upsert({
          where: {
            teacherId_studentId: {
              teacherId: parsed.data.teacherId,
              studentId: student.id,
            },
          },
          update: {},
          create: {
            teacherId: parsed.data.teacherId,
            studentId: student.id,
          },
        });
      }

      const attempt = await tx.testAttempt.create({
        data: {
          testId: parsed.data.testId,
          studentId: student.id,
          kvkkAcceptedAt: now,
          privacyAcceptedAt: now,
          termsAcceptedAt: now,
        },
        select: { id: true },
      });

      return { attemptId: attempt.id } as const;
    })
    .catch(() => ({ error: "Test baslatilirken bir sorun olustu. Lutfen tekrar deneyin." }) as const);

  if ("error" in transactionResult) {
    return { error: transactionResult.error };
  }

  await grantStudentAttemptAccess(transactionResult.attemptId);
  redirect(`/test/${transactionResult.attemptId}`);
}

export async function completeStudentAttempt(formData: FormData) {
  const attemptId = String(formData.get("attemptId") ?? "");

  if (!attemptId) {
    throw new Error("Test denemesi bulunamadi.");
  }

  await requireStudentAttemptPermission(attemptId);

  const now = new Date();
  const attempt = await db.testAttempt.findFirst({
    where: {
      id: attemptId,
      status: "IN_PROGRESS",
    },
    select: {
      id: true,
      startedAt: true,
      test: {
        select: {
          durationMinutes: true,
          testQuestions: {
            orderBy: { orderIndex: "asc" },
            select: {
              question: {
                select: {
                  id: true,
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
      },
    },
  });

  if (!attempt) {
    throw new Error("Test zaten tamamlanmis veya bulunamadi.");
  }

  const durationSeconds = attempt.test.durationMinutes ? attempt.test.durationMinutes * 60 : null;
  const elapsedSeconds = Math.floor((now.getTime() - attempt.startedAt.getTime()) / 1000);
  const isExpired = durationSeconds !== null && elapsedSeconds > durationSeconds;

  const answers = attempt.test.testQuestions.map((testQuestion) => {
    const selectedOption = isExpired ? null : formData.get(`answer-${testQuestion.question.id}`);

    return {
      questionId: testQuestion.question.id,
      correctOption: testQuestion.question.correctOption,
      selectedOption: typeof selectedOption === "string" ? selectedOption : null,
    };
  });

  const result = calculateTestResult(answers);
  const questionSnapshots = new Map(
    attempt.test.testQuestions.map((testQuestion) => [testQuestion.question.id, testQuestion.question]),
  );

  await db.$transaction(async (tx) => {
    await tx.studentAnswer.deleteMany({
      where: { attemptId: attempt.id },
    });

    if (result.answerResults.length > 0) {
      await tx.studentAnswer.createMany({
        data: result.answerResults.map((answer) => ({
          attemptId: attempt.id,
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect: answer.isCorrect,
          answeredAt: now,
          questionTextSnapshot: questionSnapshots.get(answer.questionId)?.questionText,
          optionASnapshot: questionSnapshots.get(answer.questionId)?.optionA,
          optionBSnapshot: questionSnapshots.get(answer.questionId)?.optionB,
          optionCSnapshot: questionSnapshots.get(answer.questionId)?.optionC,
          optionDSnapshot: questionSnapshots.get(answer.questionId)?.optionD,
          correctOptionSnapshot: questionSnapshots.get(answer.questionId)?.correctOption,
          explanationSnapshot: questionSnapshots.get(answer.questionId)?.explanation,
        })),
      });
    }

    await tx.testAttempt.update({
      where: { id: attempt.id },
      data: {
        status: "COMPLETED",
        completedAt: now,
        durationSeconds: Math.min(elapsedSeconds, durationSeconds ?? elapsedSeconds),
        score: result.score,
        correctCount: result.correctCount,
        wrongCount: result.wrongCount,
        emptyCount: result.emptyCount,
      },
    });
  });

  redirect(`/test/${attempt.id}/result`);
}
