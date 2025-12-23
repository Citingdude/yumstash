import { z } from 'zod'

export const recipeIndexQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
})

export type RecipeIndexQuery = z.infer<typeof recipeIndexQuerySchema>
