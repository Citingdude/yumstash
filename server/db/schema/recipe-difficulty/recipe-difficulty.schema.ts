import type { z } from 'zod'
import { pgEnum, pgTable, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const recipeDifficultyEnum = pgEnum('recipe_difficulty', ['easy', 'medium', 'hard'])

export const recipeDifficultiesTable = pgTable('recipe_difficulties', {
  id: uuid().primaryKey().defaultRandom(),
  name: recipeDifficultyEnum().notNull().unique(),
})

export const insertRecipeDifficultySchema = createInsertSchema(recipeDifficultiesTable).omit({ id: true })
export const selectRecipeDifficultySchema = createSelectSchema(recipeDifficultiesTable)

export type RecipeDifficultyInsert = z.infer<typeof insertRecipeDifficultySchema>
export type RecipeDifficultySelect = z.infer<typeof selectRecipeDifficultySchema>
