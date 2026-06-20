import { sql } from 'drizzle-orm'
import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

import { recipeCategoriesTable } from '../recipe-categories'
import { recipeDifficultiesTable } from '../recipe-difficulties'
import { usersTable } from '../users'

export const recipesTable = pgTable('recipes', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  time: integer().notNull(),
  servings: varchar({ length: 50 }).notNull(),
  emoji: varchar({ length: 10 }),
  isFavorite: boolean().default(false).notNull(),
  isCooked: boolean().default(false).notNull(),
  difficultyId: uuid().notNull().references(() => recipeDifficultiesTable.id),
  categoryId: uuid().notNull().references(() => recipeCategoriesTable.id),
  authorId: uuid().notNull().references(() => usersTable.id),
  createdAt: timestamp().default(sql`now()`).notNull(),
  updatedAt: timestamp().default(sql`now()`).notNull(),
})

export type RecipeSelect = typeof recipesTable.$inferSelect
export type RecipeInsert = typeof recipesTable.$inferInsert

export type RecipeSelectWithRelations = RecipeSelect & {
  recipeDifficulty: {
    id: string
    name: 'easy' | 'medium' | 'hard'
  } | null
  user: {
    id: string
    name: string
    email: string
    passwordHash: string | null
    createdAt: Date
    updatedAt: Date
  } | null
  recipeCategory: {
    id: string
    name: string
    slug: string
  } | null
}
