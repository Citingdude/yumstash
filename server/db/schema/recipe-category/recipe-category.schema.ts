import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

export const recipeCategoriesTable = pgTable('recipe_categories', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
})

export type RecipeCategorySelect = InferSelectModel<typeof recipeCategoriesTable>
export type RecipeCategoryInsert = InferInsertModel<typeof recipeCategoriesTable>
