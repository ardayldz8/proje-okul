import { z } from "zod";

export const studentAttemptStartSchema = z.object({
  testId: z.string().min(1),
  teacherId: z.string().trim().optional(),
  kvkkAccepted: z.literal("on", { error: "KVKK onayi zorunludur." }),
  privacyAccepted: z.literal("on", { error: "Gizlilik onayi zorunludur." }),
  termsAccepted: z.literal("on", { error: "Kullanim kosullari onayi zorunludur." }),
});

export type StudentAttemptStartInput = z.infer<typeof studentAttemptStartSchema>;
