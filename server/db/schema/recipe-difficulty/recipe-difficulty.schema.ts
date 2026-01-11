import type { InferEnum, InferSelectModel } from 'drizzle-orm'
import { pgEnum, pgTable, uuid } from 'drizzle-orm/pg-core'

export const recipeDifficultyEnum = pgEnum('recipe_difficulty', ['easy', 'medium', 'hard'])

export const recipeDifficultiesTable = pgTable('recipe_difficulties', {
  id: uuid().primaryKey().defaultRandom(),
  name: recipeDifficultyEnum().notNull().unique(),
})

export type RecipeDifficultySelect = InferSelectModel<typeof recipeDifficultiesTable>
export type RecipeDifficultyInsert = InferSelectModel<typeof recipeDifficultiesTable>

export type RecipeDifficultyEnum = InferEnum<typeof recipeDifficultyEnum>
