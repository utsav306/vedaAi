import { z } from "zod";

export const questionTypeInputSchema = z.object({
  type: z.string().min(1),
  count: z.coerce.number().int().min(1),
  marks: z.coerce.number().int().min(1),
});

export const generateAssignmentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  dueDate: z.string().optional(),
  additionalInfo: z.string().max(4000).optional(),
  subject: z.string().min(1),
  className: z.string().min(1),
  questionTypes: z.array(questionTypeInputSchema).min(1),
  file: z
    .object({
      originalName: z.string().min(1),
      mimeType: z.string().optional(),
      sizeBytes: z.number().int().positive().optional(),
    })
    .optional(),
});

export type GenerateAssignmentInput = z.infer<typeof generateAssignmentSchema>;

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});
