import { db } from "@/lib/db";

export async function getTeacherTestBuilderData(teacherId: string) {
  const [courses, questions, tests] = await Promise.all([
    db.course.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { title: "asc" }],
      select: { id: true, title: true },
    }),
    db.question.findMany({
      where: { ownerTeacherId: teacherId, isActive: true },
      orderBy: [{ course: { title: "asc" } }, { createdAt: "desc" }],
      select: {
        id: true,
        questionText: true,
        difficulty: true,
        courseId: true,
        course: { select: { title: true } },
      },
    }),
    db.test.findMany({
      where: { ownerTeacherId: teacherId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        durationMinutes: true,
        status: true,
        showResultImmediately: true,
        createdAt: true,
        courseId: true,
        course: { select: { title: true } },
        _count: { select: { testQuestions: true, attempts: true } },
      },
    }),
  ]);

  return { courses, questions, tests };
}
