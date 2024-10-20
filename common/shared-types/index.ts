import z from "zod";

// [Common]

export const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"] as const;

// [Question]
export const questionDocSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  categories: z.string().min(1).array().min(1),
  complexity: z.enum(DIFFICULTY_LEVELS),
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

export const userMatchingDataSchema = z.object({
  userId: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.enum(DIFFICULTY_LEVELS),
});

export const userMatchingRequestSchema = userMatchingDataSchema.pick({
  topic: true,
  difficulty: true,
});

export const userMatchDoneDataSchema = userMatchingDataSchema
  .pick({
    topic: true,
    difficulty: true,
  })
  .extend({
    userIds: z.string().min(1).array().min(1),
    ticketIds: z.string().min(1).array().min(1),
  });

export const userTicketSchema = z.object({
  ticketId: z.string().min(1),
  data: userMatchingDataSchema,
});

export const userTicketPayloadSchema = z.object({
  ticketId: z.string().min(1),
  data: userMatchingRequestSchema,
});

export type UserMatchingData = z.infer<typeof userMatchingDataSchema>;
export type UserMatchingRequest = z.infer<typeof userMatchingRequestSchema>;
export type UserMatchDoneData = z.infer<typeof userMatchDoneDataSchema>;
export type UserTicket = z.infer<typeof userTicketSchema>;
export type UserTicketPayload = z.infer<typeof userTicketPayloadSchema>;

export enum MessageType {
  MATCH_REQUEST = "MATCH_REQUEST",
  MATCH_REQUEST_QUEUED = "MATCH_REQUEST_QUEUED",
  MATCH_FOUND = "MATCH_FOUND",
  MATCH_CANCEL = "MATCH_CANCEL",
  MATCH_CANCELLED = "MATCH_CANCELLED",
  MATCH_REQUEST_FAILED = "MATCH_REQUEST_FAILED",
  AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
}
