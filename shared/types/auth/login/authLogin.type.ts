import z from 'zod'

export const authLoginFormDataSchema = z.object({
  email: z.email(),
  password: z.string(),
  remember: z.boolean(),
})

export const authLoginBodySchema = z.object({
  email: z.email(),
  password: z.string(),
  remember: z.boolean(),
})

export type LoginBody = z.infer<typeof authLoginBodySchema>
