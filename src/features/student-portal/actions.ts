"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { checkRateLimit } from "@/lib/rate-limit";
import { grantStudentSession, STUDENT_SESSION_COOKIE_NAME } from "@/lib/student-session";

export type StudentPortalAuthState = {
  error?: string;
};

function getValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function registerStudentPortal(
  _prevState: StudentPortalAuthState,
  formData: FormData,
): Promise<StudentPortalAuthState> {
  const fullName = getValue(formData, "fullName");
  const email = getValue(formData, "email").toLowerCase();
  const password = getValue(formData, "password");
  const gradeLevel = getValue(formData, "gradeLevel");
  const schoolName = getValue(formData, "schoolName");
  const next = getValue(formData, "next");

  if (fullName.length < 2) {
    return { error: "Ad soyad en az 2 karakter olmalidir." };
  }

  if (!email.includes("@")) {
    return { error: "Gecerli bir e-posta girin." };
  }

  if (password.length < 8) {
    return { error: "Sifre en az 8 karakter olmalidir." };
  }

  if (!gradeLevel) {
    return { error: "Sinif seviyesi zorunludur." };
  }

  const existingStudent = await db.student.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  if (existingStudent?.passwordHash) {
    return { error: "Bu e-posta ile zaten ogrenci hesabi bulunuyor." };
  }

  const passwordHash = await hashPassword(password);

  const student = existingStudent
    ? await db.student.update({
        where: { email },
        data: {
          fullName,
          gradeLevel,
          schoolName: schoolName || null,
          passwordHash,
        },
        select: { id: true },
      })
    : await db.student.create({
        data: {
          fullName,
          email,
          gradeLevel,
          schoolName: schoolName || null,
          passwordHash,
        },
        select: { id: true },
      });

  await grantStudentSession(student.id);
  redirect(next || "/student/dashboard");
}

export async function loginStudentPortal(
  _prevState: StudentPortalAuthState,
  formData: FormData,
): Promise<StudentPortalAuthState> {
  const email = getValue(formData, "email").toLowerCase();
  const password = getValue(formData, "password");
  const next = getValue(formData, "next");

  if (!email.includes("@")) {
    return { error: "Gecerli bir e-posta girin." };
  }

  if (!password) {
    return { error: "Sifre zorunludur." };
  }

  const rateLimit = await checkRateLimit("studentLogin", email);

  if (!rateLimit.success) {
    return { error: "Cok fazla giris denemesi yapildi. Lutfen kisa bir sure sonra tekrar deneyin." };
  }

  const student = await db.student.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  if (!student?.passwordHash) {
    return { error: "Bu e-posta ile aktif ogrenci hesabi bulunamadi." };
  }

  const passwordMatches = await verifyPassword(password, student.passwordHash);

  if (!passwordMatches) {
    return { error: "E-posta veya sifre hatali." };
  }

  await grantStudentSession(student.id);
  redirect(next || "/student/dashboard");
}

export async function logoutStudentPortal() {
  const cookieStore = await cookies();

  cookieStore.delete(STUDENT_SESSION_COOKIE_NAME);
  redirect("/student/login");
}
