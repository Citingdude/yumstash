import type { z } from 'zod'
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const recipeCategoriesTable = pgTable('recipe_categories', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
})

export const insertRecipeCategorySchema = createInsertSchema(recipeCategoriesTable, {
  name: schema => schema.min(1).max(255),
  slug: schema => schema.min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
}).omit({ id: true })
export const selectRecipeCategorySchema = createSelectSchema(recipeCategoriesTable)

export type RecipeCategoryInsert = z.infer<typeof insertRecipeCategorySchema>
export type RecipeCategorySelect = z.infer<typeof selectRecipeCategorySchema>
