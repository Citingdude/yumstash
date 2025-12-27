import { z } from 'zod'
import { recipeWithRelationsSchema } from '~~/shared/types/recipe/recipe.type'

export const recipeIndexResultSchema = z.object({
  items: z.array(recipeWithRelationsSchema),
  meta: z.object({
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(1),
  }),
})

export type RecipeIndexResult = z.infer<typeof recipeIndexResultSchema>
