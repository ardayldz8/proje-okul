"use server";

import { TestStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { testFormSchema, testUpdateSchema } from "@/features/test-builder/schemas";
import { assertOwnsTest, requireTeacher } from "@/lib/authorization";
import { db } from "@/lib/db";

export type TestActionState = {
  error?: string;
  message?: string;
};

export async function createTest(_prevState: TestActionState, formData: FormData): Promise<TestActionState> {
  const session = await requireTeacher();

  if (!session.user.profileId) {
    return { error: "Hoca profili bulunamadi." };
  }

  const parsed = testFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    courseId: formData.get("courseId"),
    durationMinutes: formData.get("durationMinutes") ?? "",
    status: formData.get("status"),
    showResultImmediately: formData.get("showResultImmediately") === "on",
    questionIds: formData.getAll("questionIds"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Test bilgilerini kontrol edin." };
  }

  const ownedQuestions = await db.question.findMany({
    where: {
      id: { in: parsed.data.questionIds },
      ownerTeacherId: session.user.profileId,
      courseId: parsed.data.courseId,
      isActive: true,
    },
    select: { id: true },
  });

  if (ownedQuestions.length !== parsed.data.questionIds.length) {
    return { error: "Secilen sorularin tamami size ait ve aktif olmalidir." };
  }

  await db.test.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      courseId: parsed.data.courseId,
      ownerTeacherId: session.user.profileId,
      durationMinutes: parsed.data.durationMinutes,
      status: parsed.data.status,
      showResultImmediately: parsed.data.showResultImmediately,
      testQuestions: {
        create: parsed.data.questionIds.map((questionId, index) => ({
          questionId,
          orderIndex: index + 1,
          points: 1,
        })),
      },
    },
  });

  revalidatePath("/teacher/tests");
  return { message: "Test olusturuldu." };
}

export async function updateTestStatus(formData: FormData) {
  const testId = String(formData.get("testId") ?? "");
  const status = formData.get("status");

  if (!testId || !Object.values(TestStatus).includes(status as TestStatus)) {
    throw new Error("Test durumu guncellenemedi.");
  }

  await assertOwnsTest(testId);
  await db.test.update({
    where: { id: testId },
    data: { status: status as TestStatus },
  });

  revalidatePath("/teacher/tests");
}

export async function updateTest(formData: FormData) {
  const testId = String(formData.get("testId") ?? "");

  if (!testId) {
    throw new Error("Test bulunamadi.");
  }

  await assertOwnsTest(testId);

  const parsed = testUpdateSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    courseId: formData.get("courseId"),
    durationMinutes: formData.get("durationMinutes") ?? "",
    status: formData.get("status"),
    showResultImmediately: formData.get("showResultImmediately") === "on",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Test bilgilerini kontrol edin.");
  }

  const session = await requireTeacher();
  const course = await db.course.findFirst({
    where: { id: parsed.data.courseId, isActive: true },
    select: { id: true },
  });

  if (!course || !session.user.profileId) {
    throw new Error("Test guncellenemedi.");
  }

  const hasForeignCourseQuestion = await db.testQuestion.findFirst({
    where: {
      testId,
      question: {
        ownerTeacherId: session.user.profileId,
        courseId: { not: parsed.data.courseId },
      },
    },
    select: { id: true },
  });

  if (hasForeignCourseQuestion) {
    throw new Error("Testteki sorular farkli derse ait oldugu icin ders degistirilemez.");
  }

  await db.test.update({
    where: { id: testId },
    data: parsed.data,
  });

  revalidatePath("/teacher/tests");
}

export async function deleteTest(formData: FormData) {
  const testId = String(formData.get("testId") ?? "");

  if (!testId) {
    throw new Error("Test bulunamadi.");
  }

  await assertOwnsTest(testId);
  await db.test.delete({ where: { id: testId } });
  revalidatePath("/teacher/tests");
}
