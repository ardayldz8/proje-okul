import { z } from "zod";

export const teacherCreateSchema = z.object({
  fullName: z.string().trim().min(2, "Hoca adi en az 2 karakter olmalidir."),
  email: z.string().trim().email("Gecerli bir e-posta girin."),
  password: z.string().min(8, "Sifre en az 8 karakter olmalidir."),
});

export const teacherUpdateSchema = z.object({
  teacherId: z.string().min(1, "Hoca bulunamadi."),
  fullName: z.string().trim().min(2, "Hoca adi en az 2 karakter olmalidir."),
  email: z.string().trim().email("Gecerli bir e-posta girin."),
  password: z.string().optional(),
  isActive: z.boolean(),
});

export const courseCreateSchema = z.object({
  title: z.string().trim().min(2, "Ders adi en az 2 karakter olmalidir."),
  slug: z.string().trim().min(2, "Slug en az 2 karakter olmalidir."),
  description: z.string().trim().optional(),
  iconName: z.string().trim().optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
});

export const courseUpdateSchema = courseCreateSchema.extend({
  courseId: z.string().min(1, "Ders bulunamadi."),
  isActive: z.boolean(),
});

export const teacherStudentAssignSchema = z.object({
  teacherId: z.string().min(1, "Hoca secimi zorunludur."),
  studentId: z.string().min(1, "Ogrenci secimi zorunludur."),
  note: z.string().trim().optional(),
});
