import z from 'zod'

export const recipeCategorySchema = z.enum([
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snacks',
  'Beverages',
])

export type RecipeCategory = z.infer<typeof recipeCategorySchema>
