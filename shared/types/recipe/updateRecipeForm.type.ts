import { z } from 'zod'
import { recipeCategoryUuidSchema } from '~~/shared/types/recipe-category/recipeCategoryUuid.type'

export const updateRecipeFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  time: z.number().min(0),
  servings: z.string().min(1),
  difficultyId: z.uuid(),
  categoryId: recipeCategoryUuidSchema,
  emoji: z.string().min(1),
})

export type UpdateRecipeForm = z.infer<typeof updateRecipeFormSchema>
