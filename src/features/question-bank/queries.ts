import { Difficulty } from "@prisma/client";

import { db } from "@/lib/db";

type QuestionFilters = {
  courseId?: string;
  difficulty?: Difficulty;
};

export async function getTeacherQuestionBank(teacherId: string, filters: QuestionFilters = {}) {
  const [courses, questions] = await Promise.all([
    db.course.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { title: "asc" }],
      select: { id: true, title: true },
    }),
    db.question.findMany({
      where: {
        ownerTeacherId: teacherId,
        isActive: true,
        courseId: filters.courseId || undefined,
        difficulty: filters.difficulty || undefined,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        questionText: true,
        difficulty: true,
        topic: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        correctOption: true,
        explanation: true,
        courseId: true,
        createdAt: true,
        course: { select: { title: true } },
      },
    }),
  ]);

  return { courses, questions };
}
