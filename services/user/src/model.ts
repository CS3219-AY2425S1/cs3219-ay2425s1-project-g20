import z from 'zod'

export const userSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  isAdmin: z.boolean(),
  createdAt: z.date(),
})

export const sensitiveUserSchema = userSchema.extend({
  password: z.string().min(1),
})

export const loginFormSchema = sensitiveUserSchema.pick({
  email: true,
  password: true,
})

export const registerFormSchema = sensitiveUserSchema.pick({
  username: true,
  email: true,
  password: true,
})

export const extractedUserSchema = userSchema
  .pick({
    username: true,
    email: true,
    isAdmin: true,
  })
  .extend({
    id: z.string().min(1),
  })

export const updatePrivilegeSchema = userSchema.pick({
  isAdmin: true,
})

export type User = z.infer<typeof userSchema>

export type SensitiveUser = z.infer<typeof sensitiveUserSchema>

export type LoginForm = z.infer<typeof loginFormSchema>

export type registerForm = z.infer<typeof registerFormSchema>

export type ExtractedUser = z.infer<typeof extractedUserSchema>

export type UpdatePrivilegeRequest = z.infer<typeof updatePrivilegeSchema>
