import z from 'zod'
import { recipeCategoryUuidSchema } from '~~/shared/types/recipe-category/recipeCategoryUuid.type'

export const recipeCategorySelectItem = z.object({
  value: recipeCategoryUuidSchema,
  label: z.string(),
})

export type RecipeCategorySelectItem = z.infer<typeof recipeCategorySelectItem>
