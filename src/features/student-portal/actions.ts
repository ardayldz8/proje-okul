"use server";

import { redirect } from "next/navigation";

import { studentLoginSchema, studentRegisterSchema } from "@/features/student-portal/schemas";
import { checkRateLimit } from "@/lib/rate-limit";
import { createStudentSession, clearStudentSession } from "@/lib/student-session";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

export type StudentAuthState = {
  error?: string;
};

function getRedirectPath(formData: FormData) {
  const next = formData.get("next");
  const value = typeof next === "string" && next.startsWith("/") ? next : "/student/dashboard";
  return value.startsWith("//") ? "/student/dashboard" : value;
}

export async function loginStudentPortal(_prevState: StudentAuthState, formData: FormData): Promise<StudentAuthState> {
  const parsed = studentLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Form bilgilerini kontrol edin." };
  }

  const email = parsed.data.email.toLowerCase();
  const rateLimit = await checkRateLimit("studentLogin", email);

  if (!rateLimit.success) {
    return { error: "Cok fazla giris denemesi yapildi. Lutfen biraz sonra tekrar deneyin." };
  }

  const student = await db.student.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  if (!student?.passwordHash) {
    return { error: "E-posta veya sifre hatali." };
  }

  const passwordMatches = await verifyPassword(parsed.data.password, student.passwordHash);

  if (!passwordMatches) {
    return { error: "E-posta veya sifre hatali." };
  }

  await createStudentSession(student.id);
  redirect(getRedirectPath(formData));
}

export async function registerStudentPortal(_prevState: StudentAuthState, formData: FormData): Promise<StudentAuthState> {
  const parsed = studentRegisterSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
    gradeLevel: formData.get("gradeLevel"),
    termsAccepted: formData.get("termsAccepted"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Form bilgilerini kontrol edin." };
  }

  const email = parsed.data.email.toLowerCase();
  const existingStudent = await db.student.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  if (existingStudent?.passwordHash) {
    return { error: "Bu e-posta ile kayitli bir ogrenci hesabi var. Giris yapmayi deneyin." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const student = existingStudent
    ? await db.student.update({
        where: { id: existingStudent.id },
        data: {
          fullName: parsed.data.fullName,
          gradeLevel: parsed.data.gradeLevel,
          passwordHash,
        },
        select: { id: true },
      })
    : await db.student.create({
        data: {
          fullName: parsed.data.fullName,
          email,
          gradeLevel: parsed.data.gradeLevel,
          passwordHash,
        },
        select: { id: true },
      });

  await createStudentSession(student.id);
  redirect("/student/dashboard");
}

export async function logoutStudentPortal() {
  await clearStudentSession();
  redirect("/");
}
