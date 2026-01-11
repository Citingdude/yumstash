import z from 'zod'

export const forgotPasswordBodySchema = z.object({
  email: z.email(),
})

export type ForgotPasswordBody = z.infer<typeof forgotPasswordBodySchema>
