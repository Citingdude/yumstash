import { z } from 'zod'
import { recipeCategoryUuidSchema } from '~~/shared/types/recipe-category/recipeCategoryUuid.type'

export const createRecipeFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  time: z.string().min(1),
  servings: z.string().min(1),
  difficultyId: z.uuid(),
  categoryId: recipeCategoryUuidSchema,
  emoji: z.string().min(1),
})

export type CreateRecipeForm = z.infer<typeof createRecipeFormSchema>
