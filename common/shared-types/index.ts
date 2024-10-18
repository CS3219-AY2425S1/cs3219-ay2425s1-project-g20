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

export const questionFormSchema = questionDocSchema.extend({
  id: z.string().min(1).optional(),
});

export type QuestionDoc = z.infer<typeof questionDocSchema>;
export type Question = z.infer<typeof questionSchema>;
export type QuestionFormValues = z.infer<typeof questionFormSchema>;

// [User]
export const userSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  isAdmin: z.boolean(),
  createdAt: z.date(),
});

export const sensitiveUserSchema = userSchema.extend({
  password: z.string().min(1),
});

export const loginFormSchema = sensitiveUserSchema.pick({
  email: true,
  password: true,
});

export const registerFormSchema = sensitiveUserSchema.pick({
  username: true,
  email: true,
  password: true,
});

export const extractedUserSchema = userSchema
  .pick({
    username: true,
    email: true,
    isAdmin: true,
  })
  .extend({
    id: z.string().min(1),
  });

export const updatePrivilegeSchema = userSchema.pick({
  isAdmin: true,
});

export type User = z.infer<typeof userSchema>;
export type SensitiveUser = z.infer<typeof sensitiveUserSchema>;
export type LoginFormValue = z.infer<typeof loginFormSchema>;
export type RegisterFormValue = z.infer<typeof registerFormSchema>;
export type ExtractedUser = z.infer<typeof extractedUserSchema>;
export type UpdatePrivilegeRequest = z.infer<typeof updatePrivilegeSchema>;

// [Match]
export const matchFormSchema = questionDocSchema
  .pick({
    complexity: true,
  })
  .extend({ category: z.string().min(1) });
export type matchFormSchema = z.infer<typeof matchFormSchema>;
