import { z } from 'zod'
import { recipeCategoryUuidSchema } from '~~/shared/types/recipe-category/recipeCategoryUuid.type'

export const recipeIndexQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: recipeCategoryUuidSchema.optional(),
})

export type RecipeIndexQuery = z.infer<typeof recipeIndexQuerySchema>
