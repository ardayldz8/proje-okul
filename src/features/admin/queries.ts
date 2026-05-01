import { UserRole } from "@prisma/client";

import { db } from "@/lib/db";

export async function getAdminDashboardData() {
  const [teachers, courses, students, assignments] = await Promise.all([
    db.profile.findMany({
      where: { role: UserRole.TEACHER },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            ownedQuestions: true,
            ownedTests: true,
            teacherStudents: true,
          },
        },
      },
    }),
    db.course.findMany({
      orderBy: [{ displayOrder: "asc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        iconName: true,
        displayOrder: true,
        isActive: true,
        _count: {
          select: {
            questions: true,
            tests: true,
          },
        },
      },
    }),
    db.student.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        gradeLevel: true,
        schoolName: true,
      },
    }),
    db.teacherStudent.findMany({
      orderBy: { assignedAt: "desc" },
      select: {
        id: true,
        assignedAt: true,
        note: true,
        teacher: {
          select: {
            fullName: true,
            email: true,
          },
        },
        student: {
          select: {
            fullName: true,
            email: true,
            gradeLevel: true,
          },
        },
      },
    }),
  ]);

  return { teachers, courses, students, assignments };
}
