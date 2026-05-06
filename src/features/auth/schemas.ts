import { z } from "zod";

export const teacherLoginSchema = z.object({
  email: z.string().trim().email("Gecerli bir e-posta girin."),
  password: z.string().min(1, "Sifre zorunludur."),
});

export const teacherRegisterSchema = z.object({
  fullName: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalidir."),
  email: z.string().trim().email("Gecerli bir e-posta girin."),
  password: z.string().min(8, "Sifre en az 8 karakter olmalidir."),
});

export type TeacherLoginInput = z.infer<typeof teacherLoginSchema>;
export type TeacherAuthState = {
  error?: string;
  success?: boolean;
};
