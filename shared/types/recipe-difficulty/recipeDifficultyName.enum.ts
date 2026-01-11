import z from 'zod'

export const recipeDifficultNameEnum = z.enum(['easy', 'medium', 'hard'])

export type RecipeDifficultNameEnum = z.infer<typeof recipeDifficultNameEnum>
