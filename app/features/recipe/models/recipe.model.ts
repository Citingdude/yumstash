import { z } from 'zod'
import { recipeCategorySchema } from '~/features/recipe/models/recipeCategory.model'
import { recipeDifficultySchema } from '~/features/recipe/models/recipeDifficulty.model'

export const recipeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  time: z.string(),
  servings: z.string(),
  difficulty: recipeDifficultySchema,
  category: recipeCategorySchema,
  emoji: z.emoji(),
})

export type Recipe = z.infer<typeof recipeSchema>
