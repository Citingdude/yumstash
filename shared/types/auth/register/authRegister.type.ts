import z from 'zod'

export const authRegisterFormDataSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: 'You must accept the terms and privacy policy',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const authRegisterBodySchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
})

export type RegisterFormData = z.infer<typeof authRegisterFormDataSchema>
export type RegisterBody = z.infer<typeof authRegisterBodySchema>
