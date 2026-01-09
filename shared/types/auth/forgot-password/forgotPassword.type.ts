import { z } from 'zod'

export const forgotPasswordBodySchema = z.object({
  email: z.email('Please enter a valid email address'),
})

export type ForgotPasswordBody = z.infer<typeof forgotPasswordBodySchema>
