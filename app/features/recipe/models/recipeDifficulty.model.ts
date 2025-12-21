import z from 'zod'

export const recipeDifficultySchema = z.enum([
  'easy',
  'medium',
  'hard',
])

export type RecipeDifficulty = z.infer<typeof recipeDifficultySchema>
