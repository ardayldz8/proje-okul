"use server";

import { revalidatePath } from "next/cache";

import { requireTeacher } from "@/lib/authorization";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

export type TeacherSettingsState = {
  error?: string;
  message?: string;
};

export async function updateTeacherProfile(_prevState: TeacherSettingsState, formData: FormData): Promise<TeacherSettingsState> {
  const session = await requireTeacher();
  const profileId = session.user.profileId;

  if (!profileId) {
    return { error: "Hoca profili bulunamadi." };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!fullName || fullName.length < 2) {
    return { error: "Ad soyad en az 2 karakter olmalidir." };
  }

  if (!email || !email.includes("@")) {
    return { error: "Gecerli bir e-posta adresi giriniz." };
  }

  const existing = await db.profile.findFirst({
    where: { email, NOT: { id: profileId } },
    select: { id: true },
  });

  if (existing) {
    return { error: "Bu e-posta adresi baska bir hesap tarafindan kullaniliyor." };
  }

  await db.profile.update({
    where: { id: profileId },
    data: { fullName, email },
  });

  await db.user.update({
    where: { id: session.user.id },
    data: { name: fullName, email },
  });

  revalidatePath("/teacher/settings");
  return { message: "Profil guncellendi." };
}

export async function updateTeacherPassword(_prevState: TeacherSettingsState, formData: FormData): Promise<TeacherSettingsState> {
  const session = await requireTeacher();
  const profileId = session.user.profileId;

  if (!profileId) {
    return { error: "Hoca profili bulunamadi." };
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const newPasswordConfirm = String(formData.get("newPasswordConfirm") ?? "");

  if (!currentPassword || !newPassword || !newPasswordConfirm) {
    return { error: "Tum sifre alanlarini doldurunuz." };
  }

  if (newPassword.length < 6) {
    return { error: "Yeni sifre en az 6 karakter olmalidir." };
  }

  if (newPassword !== newPasswordConfirm) {
    return { error: "Yeni sifreler eslesmiyor." };
  }

  const profile = await db.profile.findUnique({
    where: { id: profileId },
    select: { passwordHash: true },
  });

  if (!profile) {
    return { error: "Profil bulunamadi." };
  }

  const matches = await verifyPassword(currentPassword, profile.passwordHash);

  if (!matches) {
    return { error: "Mevcut sifre yanlis." };
  }

  const newHash = await hashPassword(newPassword);

  await db.profile.update({
    where: { id: profileId },
    data: { passwordHash: newHash },
  });

  return { message: "Sifre guncellendi." };
}
