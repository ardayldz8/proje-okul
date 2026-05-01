"use server";

import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { courseCreateSchema, courseUpdateSchema, teacherCreateSchema, teacherStudentAssignSchema, teacherUpdateSchema } from "@/features/admin/schemas";
import { getCurrentProfile, requireAdmin } from "@/lib/authorization";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase();
}

export async function createTeacher(formData: FormData) {
  await requireAdmin();

  const parsed = teacherCreateSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Hoca bilgilerini kontrol edin.");
  }

  const email = parsed.data.email.toLowerCase();
  const passwordHash = await hashPassword(parsed.data.password);

  await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        name: parsed.data.fullName,
      },
    });

    await tx.profile.create({
      data: {
        userId: user.id,
        fullName: parsed.data.fullName,
        email,
        passwordHash,
        role: UserRole.TEACHER,
      },
    });
  });

  revalidatePath("/admin");
}

export async function updateTeacher(formData: FormData) {
  await requireAdmin();

  const parsed = teacherUpdateSchema.safeParse({
    teacherId: formData.get("teacherId"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: String(formData.get("password") ?? "") || undefined,
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Hoca bilgilerini kontrol edin.");
  }

  const email = parsed.data.email.toLowerCase();
  const passwordHash = parsed.data.password ? await hashPassword(parsed.data.password) : undefined;

  await db.$transaction(async (tx) => {
    const profile = await tx.profile.update({
      where: { id: parsed.data.teacherId, role: UserRole.TEACHER },
      data: {
        fullName: parsed.data.fullName,
        email,
        isActive: parsed.data.isActive,
        ...(passwordHash ? { passwordHash } : {}),
      },
      select: { userId: true },
    });

    await tx.user.update({
      where: { id: profile.userId },
      data: {
        name: parsed.data.fullName,
        email,
      },
    });
  });

  revalidatePath("/admin");
}

export async function createCourse(formData: FormData) {
  await requireAdmin();

  const parsed = courseCreateSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    iconName: formData.get("iconName") || undefined,
    displayOrder: formData.get("displayOrder") ?? 0,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Ders bilgilerini kontrol edin.");
  }

  await db.course.create({
    data: {
      ...parsed.data,
      slug: normalizeSlug(parsed.data.slug),
    },
  });

  revalidatePath("/admin");
}

export async function updateCourse(formData: FormData) {
  await requireAdmin();

  const parsed = courseUpdateSchema.safeParse({
    courseId: formData.get("courseId"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    iconName: formData.get("iconName") || undefined,
    displayOrder: formData.get("displayOrder") ?? 0,
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Ders bilgilerini kontrol edin.");
  }

  const { courseId, ...data } = parsed.data;

  await db.course.update({
    where: { id: courseId },
    data: {
      ...data,
      slug: normalizeSlug(data.slug),
    },
  });

  revalidatePath("/admin");
}

export async function assignTeacherStudent(formData: FormData) {
  const admin = await getCurrentProfile();

  if (!admin || admin.role !== UserRole.ADMIN) {
    await requireAdmin();
  }

  const parsed = teacherStudentAssignSchema.safeParse({
    teacherId: formData.get("teacherId"),
    studentId: formData.get("studentId"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Eslestirme bilgilerini kontrol edin.");
  }

  const teacher = await db.profile.findFirst({
    where: {
      id: parsed.data.teacherId,
      role: UserRole.TEACHER,
      isActive: true,
    },
    select: { id: true },
  });

  if (!teacher) {
    throw new Error("Aktif hoca bulunamadi.");
  }

  await db.teacherStudent.upsert({
    where: {
      teacherId_studentId: {
        teacherId: parsed.data.teacherId,
        studentId: parsed.data.studentId,
      },
    },
    update: {
      note: parsed.data.note,
      assignedBy: admin?.id,
    },
    create: {
      teacherId: parsed.data.teacherId,
      studentId: parsed.data.studentId,
      assignedBy: admin?.id,
      note: parsed.data.note,
    },
  });

  revalidatePath("/admin");
}

export async function removeTeacherStudent(formData: FormData) {
  await requireAdmin();

  const assignmentId = String(formData.get("assignmentId") ?? "");

  if (!assignmentId) {
    throw new Error("Eslestirme bulunamadi.");
  }

  await db.teacherStudent.delete({
    where: { id: assignmentId },
  });

  revalidatePath("/admin");
}
