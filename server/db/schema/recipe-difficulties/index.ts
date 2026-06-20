import { pgEnum, pgTable, unique, uuid } from 'drizzle-orm/pg-core'

export const recipeDifficulty = pgEnum('recipe_difficulty', ['easy', 'medium', 'hard'])

export type RecipeDifficultyEnum = typeof recipeDifficulty

export const recipeDifficultiesTable = pgTable('recipe_difficulties', {
  id: uuid().defaultRandom().primaryKey(),
  name: recipeDifficulty().notNull(),
}, table => [
  unique('recipe_difficulties_name_unique').on(table.name),
])

export type RecipeDifficultySelect = typeof recipeDifficultiesTable.$inferSelect
export type RecipeDifficultyInsert = typeof recipeDifficultiesTable.$inferInsert
