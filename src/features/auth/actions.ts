"use server";

import { UserRole } from "@prisma/client";

import { teacherRegisterSchema, type TeacherAuthState } from "@/features/auth/schemas";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function registerTeacherAccount(
  _prevState: TeacherAuthState,
  formData: FormData,
): Promise<TeacherAuthState> {
  const parsed = teacherRegisterSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Form bilgilerini kontrol edin.",
    };
  }

  const email = parsed.data.email.toLowerCase();
  const [existingProfile, existingUser] = await Promise.all([
    db.profile.findUnique({ where: { email }, select: { id: true } }),
    db.user.findUnique({ where: { email }, select: { id: true } }),
  ]);

  if (existingProfile || existingUser) {
    return { error: "Bu e-posta ile zaten bir hesap bulunuyor." };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  try {
    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name: parsed.data.fullName,
        },
        select: { id: true },
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
  } catch {
    return { error: "Hoca hesabi olusturulamadi. Lutfen tekrar deneyin." };
  }

  return { success: true };
}
