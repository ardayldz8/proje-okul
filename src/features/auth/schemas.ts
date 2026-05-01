import { z } from "zod";

export const teacherLoginSchema = z.object({
  email: z.string().trim().email("Gecerli bir e-posta girin."),
  password: z.string().min(1, "Sifre zorunludur."),
});

export type TeacherLoginInput = z.infer<typeof teacherLoginSchema>;
