import { z } from 'zod'
import { MAX_RECIPE_PAGE_SIZE } from '~~/shared/constants/recipePagination.constant'
import { recipeCategoryUuidSchema } from '~~/shared/types/recipe-category/recipeCategoryUuid.type'

export const recipeIndexQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: recipeCategoryUuidSchema.optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(MAX_RECIPE_PAGE_SIZE).optional(),
})

export type RecipeIndexQuery = z.infer<typeof recipeIndexQuerySchema>
