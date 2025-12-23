import z from 'zod'
import { recipeCategoryUuidSchema } from '~~/shared/types/recipe-category/recipeCategoryUuid.type'

export const recipeCategoryFilterItem = z.object({
  value: recipeCategoryUuidSchema.optional(),
  label: z.string(),
})

export type RecipeCategoryFilterItem = z.infer<typeof recipeCategoryFilterItem>
