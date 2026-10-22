import { z } from 'zod'
import { recipeCategoryUuidSchema } from '~~/shared/types/recipe-category/recipeCategoryUuid.type'

import { hasRecipeContent, sanitizeRecipeContent } from '~~/shared/utils/recipeContent'

export const createRecipeFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().transform(sanitizeRecipeContent).refine(hasRecipeContent, 'Add ingredients or instructions for your recipe'),
  time: z.number().min(0),
  servings: z.string().min(1),
  difficultyId: z.uuid(),
  categoryId: recipeCategoryUuidSchema,
  emoji: z.string().min(1),
})

export type CreateRecipeForm = z.infer<typeof createRecipeFormSchema>
