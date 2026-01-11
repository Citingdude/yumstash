import z from 'zod'
import { recipeCategoryUuidSchema } from '~~/shared/types/recipe-category/recipeCategoryUuid.type'

export const recipeCategorySchema = z.object({
  id: recipeCategoryUuidSchema,
  name: z.string(),
  slug: z.string(),
})

export type RecipeCategory = z.infer<typeof recipeCategorySchema>
