import { pgTable, unique, uuid, varchar } from 'drizzle-orm/pg-core'

export const recipeCategoriesTable = pgTable('recipe_categories', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull(),
}, table => [
  unique('recipe_categories_slug_unique').on(table.slug),
])

export type RecipeCategorySelect = typeof recipeCategoriesTable.$inferSelect
export type RecipeCategoryInsert = typeof recipeCategoriesTable.$inferInsert
