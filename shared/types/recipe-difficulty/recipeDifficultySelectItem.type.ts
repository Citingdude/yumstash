import z from 'zod'
import { recipeDifficultNameEnum } from '~~/shared/types/recipe-difficulty/recipeDifficultyName.enum'
import { recipeDifficultyUuidSchema } from '~~/shared/types/recipe-difficulty/recipeDifficultyUuid.type'

export const recipeDifficultySelectItem = z.object({
  value: recipeDifficultyUuidSchema,
  label: recipeDifficultNameEnum,
})

export type RecipeDifficultySelectItem = z.infer<typeof recipeDifficultySelectItem>
