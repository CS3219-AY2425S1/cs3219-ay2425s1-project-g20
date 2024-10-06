import z from "zod";

// [Question]
export const questionDocSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  categories: z.string().min(1).array().min(1),
  complexity: z.enum(["Easy", "Medium", "Hard"]),
});

export const questionSchema = questionDocSchema.extend({
  id: z.string().min(1),
});

export type QuestionDoc = z.infer<typeof questionDocSchema>;
export type Question = z.infer<typeof questionSchema>;

// [User]
//TODO #48 retire dupes in services\user\src\model.ts
export const userSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  isAdmin: z.boolean(),
  createdAt: z.date(),
});

export const sensitiveUserSchema = userSchema.extend({
  password: z.string().min(1),
});

export type User = z.infer<typeof userSchema>;
export type SensitiveUser = z.infer<typeof sensitiveUserSchema>;
