"use server";

import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { teacherRegisterSchema } from "@/features/auth/schemas";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export type TeacherRegisterState = {
  error?: string;
};

export async function registerTeacherAccount(_prevState: TeacherRegisterState, formData: FormData): Promise<TeacherRegisterState> {
  const parsed = teacherRegisterSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
    termsAccepted: formData.get("termsAccepted"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Form bilgilerini kontrol edin." };
  }

  const email = parsed.data.email.toLowerCase();
  const existingProfile = await db.profile.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingProfile) {
    return { error: "Bu e-posta ile kayitli bir ogretmen hesabi var. Giris yapmayi deneyin." };
  }

  const existingUser = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return { error: "Bu e-posta ile kayitli bir kullanici var. Giris yapmayi deneyin." };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await db.user.create({
    data: {
      email,
      name: parsed.data.fullName,
      profile: {
        create: {
          fullName: parsed.data.fullName,
          email,
          passwordHash,
          role: UserRole.TEACHER,
          isActive: true,
        },
      },
    },
  });

  redirect("/teacher/login?registered=1");
}
