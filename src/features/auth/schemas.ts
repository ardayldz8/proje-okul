import { z } from "zod";

export const teacherLoginSchema = z.object({
  email: z.string().trim().email("Gecerli bir e-posta girin."),
  password: z.string().min(1, "Sifre zorunludur."),
});

export const teacherRegisterSchema = z
  .object({
    fullName: z.string().trim().min(2, "Ad soyad zorunludur."),
    email: z.string().trim().email("Gecerli bir e-posta girin."),
    password: z.string().min(8, "Sifre en az 8 karakter olmalidir."),
    passwordConfirm: z.string().min(1, "Sifre tekrarini girin."),
    termsAccepted: z.literal("on", { error: "KVKK ve kullanim kosullarini kabul edin." }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Sifreler eslesmiyor.",
    path: ["passwordConfirm"],
  });

export type TeacherLoginInput = z.infer<typeof teacherLoginSchema>;
export type TeacherRegisterInput = z.infer<typeof teacherRegisterSchema>;
