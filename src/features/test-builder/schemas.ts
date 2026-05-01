import { TestStatus } from "@prisma/client";
import { z } from "zod";

export const testFormSchema = z.object({
  title: z.string().trim().min(3, "Test adi en az 3 karakter olmalidir."),
  description: z.string().trim().optional(),
  courseId: z.string().min(1, "Ders secimi zorunludur."),
  durationMinutes: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  status: z.enum(TestStatus),
  showResultImmediately: z.boolean().default(true),
  questionIds: z.array(z.string()).min(1, "En az bir soru secilmelidir."),
});

export type TestFormInput = z.infer<typeof testFormSchema>;
