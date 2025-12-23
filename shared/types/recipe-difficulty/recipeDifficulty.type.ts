import z from 'zod'
import { recipeDifficultNameEnum } from '~~/shared/types/recipe-difficulty/recipeDifficultyName.enum'
import { recipeDifficultyUuidSchema } from '~~/shared/types/recipe-difficulty/recipeDifficultyUuid.type'

export const recipeDifficultySchema = z.object({
  id: recipeDifficultyUuidSchema,
  name: recipeDifficultNameEnum,
})

export type RecipeDifficulty = z.infer<typeof recipeDifficultySchema>
