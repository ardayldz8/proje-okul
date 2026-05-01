"use server";

import { revalidatePath } from "next/cache";

import { questionFormSchema } from "@/features/question-bank/schemas";
import { assertOwnsQuestion, requireTeacher } from "@/lib/authorization";
import { db } from "@/lib/db";

export type QuestionActionState = {
  error?: string;
  message?: string;
};

export async function createQuestion(_prevState: QuestionActionState, formData: FormData): Promise<QuestionActionState> {
  const session = await requireTeacher();

  if (!session.user.profileId) {
    return { error: "Hoca profili bulunamadi." };
  }

  const parsed = questionFormSchema.safeParse({
    courseId: formData.get("courseId"),
    questionText: formData.get("questionText"),
    optionA: formData.get("optionA"),
    optionB: formData.get("optionB"),
    optionC: formData.get("optionC"),
    optionD: formData.get("optionD"),
    correctOption: formData.get("correctOption"),
    difficulty: formData.get("difficulty"),
    topic: formData.get("topic") || undefined,
    explanation: formData.get("explanation") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Soru bilgilerini kontrol edin." };
  }

  const course = await db.course.findFirst({
    where: { id: parsed.data.courseId, isActive: true },
    select: { id: true },
  });

  if (!course) {
    return { error: "Secilen ders bulunamadi." };
  }

  await db.question.create({
    data: {
      ...parsed.data,
      ownerTeacherId: session.user.profileId,
    },
  });

  revalidatePath("/teacher/questions");
  return { message: "Soru eklendi." };
}

export async function deactivateQuestion(formData: FormData) {
  const questionId = String(formData.get("questionId") ?? "");

  if (!questionId) {
    throw new Error("Soru bulunamadi.");
  }

  await assertOwnsQuestion(questionId);
  await db.question.update({
    where: { id: questionId },
    data: { isActive: false },
  });

  revalidatePath("/teacher/questions");
}
