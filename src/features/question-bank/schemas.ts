import { Difficulty } from "@prisma/client";
import { z } from "zod";

const optionSchema = z.string().trim().min(1, "Sik bos olamaz.");

export const questionFormSchema = z.object({
  courseId: z.string().min(1, "Ders secimi zorunludur."),
  questionText: z.string().trim().min(3, "Soru metni en az 3 karakter olmalidir."),
  optionA: optionSchema,
  optionB: optionSchema,
  optionC: optionSchema,
  optionD: optionSchema,
  correctOption: z.enum(["A", "B", "C", "D"], { error: "Dogru sik secimi zorunludur." }),
  difficulty: z.enum(Difficulty, { error: "Zorluk secimi zorunludur." }),
  topic: z.string().trim().optional(),
  explanation: z.string().trim().optional(),
});

export type QuestionFormInput = z.infer<typeof questionFormSchema>;
