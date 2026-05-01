import { z } from "zod";

export const studentStartSchema = z.object({
  testId: z.string().min(1),
  fullName: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalidir."),
  email: z.string().trim().email("Gecerli bir e-posta girin."),
  phone: z.string().trim().optional(),
  gradeLevel: z.string().trim().min(1, "Sinif seviyesi zorunludur."),
  schoolName: z.string().trim().optional(),
  teacherId: z.string().trim().optional(),
  kvkkAccepted: z.literal("on", { error: "KVKK onayi zorunludur." }),
  privacyAccepted: z.literal("on", { error: "Gizlilik onayi zorunludur." }),
  termsAccepted: z.literal("on", { error: "Kullanim kosullari onayi zorunludur." }),
});

export const studentAttemptStartSchema = studentStartSchema.extend({
  otpCode: z.string().trim().regex(/^\d{6}$/, "6 haneli dogrulama kodunu girin."),
});

export type StudentStartInput = z.infer<typeof studentStartSchema>;
export type StudentAttemptStartInput = z.infer<typeof studentAttemptStartSchema>;
