"use server";

import { TestStatus } from "@prisma/client";
import { redirect } from "next/navigation";

import { studentAttemptStartSchema, studentStartSchema } from "@/features/student-test/schemas";
import { calculateTestResult } from "@/features/student-test/scoring";
import { db } from "@/lib/db";
import { createStudentTestOtp, verifyStudentTestOtp } from "@/lib/otp";

export type RequestOtpState = {
  ok?: boolean;
  message?: string;
  error?: string;
};

export async function requestStudentOtp(_prevState: RequestOtpState, formData: FormData): Promise<RequestOtpState> {
  const parsed = studentStartSchema.safeParse({
    testId: formData.get("testId"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    gradeLevel: formData.get("gradeLevel"),
    schoolName: formData.get("schoolName") || undefined,
    teacherId: formData.get("teacherId") || undefined,
    kvkkAccepted: formData.get("kvkkAccepted"),
    privacyAccepted: formData.get("privacyAccepted"),
    termsAccepted: formData.get("termsAccepted"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Form bilgilerini kontrol edin." };
  }

  const result = await createStudentTestOtp(parsed.data.email);

  if (!result.ok) {
    return { error: result.error };
  }

  return { ok: true, message: "Dogrulama kodu e-posta adresinize gonderildi." };
}

export type StartAttemptState = {
  error?: string;
};

export async function startStudentAttempt(_prevState: StartAttemptState, formData: FormData): Promise<StartAttemptState> {
  const parsed = studentAttemptStartSchema.safeParse({
    testId: formData.get("testId"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    gradeLevel: formData.get("gradeLevel"),
    schoolName: formData.get("schoolName") || undefined,
    teacherId: formData.get("teacherId") || undefined,
    kvkkAccepted: formData.get("kvkkAccepted"),
    privacyAccepted: formData.get("privacyAccepted"),
    termsAccepted: formData.get("termsAccepted"),
    otpCode: formData.get("otpCode"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Form bilgilerini kontrol edin." };
  }

  const otpResult = await verifyStudentTestOtp(parsed.data.email, parsed.data.otpCode);

  if (!otpResult.ok) {
    return { error: otpResult.error };
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
    const student = await tx.student.upsert({
      where: { email: parsed.data.email.toLowerCase() },
      update: {
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        gradeLevel: parsed.data.gradeLevel,
        schoolName: parsed.data.schoolName,
      },
      create: {
        fullName: parsed.data.fullName,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone,
        gradeLevel: parsed.data.gradeLevel,
        schoolName: parsed.data.schoolName,
      },
    });

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

  redirect(`/test/${transactionResult.attemptId}`);
}

export async function completeStudentAttempt(formData: FormData) {
  const attemptId = String(formData.get("attemptId") ?? "");

  if (!attemptId) {
    throw new Error("Test denemesi bulunamadi.");
  }

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
                  correctOption: true,
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
