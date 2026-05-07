import { TestStatus } from "@prisma/client";

import { db } from "@/lib/db";

function activeTestWhere(now: Date) {
  return {
    status: TestStatus.ACTIVE,
    OR: [{ startsAt: null }, { startsAt: { lte: now } }],
    AND: [{ OR: [{ endsAt: null }, { endsAt: { gt: now } }] }],
  };
}

export async function getActiveCourses() {
  const now = new Date();

  return db.course.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: "asc" }, { title: "asc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      iconName: true,
      _count: {
        select: {
          tests: {
            where: activeTestWhere(now),
          },
        },
      },
    },
  });
}

export async function getActiveTestsByCourseSlug(slug: string) {
  const now = new Date();

  return db.course.findFirst({
    where: {
      slug,
      isActive: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      tests: {
        where: activeTestWhere(now),
        orderBy: [{ startsAt: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          title: true,
          description: true,
          durationMinutes: true,
          showResultImmediately: true,
          _count: {
            select: { testQuestions: true },
          },
        },
      },
    },
  });
}
