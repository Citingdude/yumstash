import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import type { RecipeDifficultyEnum } from '../recipe-difficulty/recipe-difficulty.schema'
import { relations } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { recipeCategoriesTable } from '../recipe-category/recipe-category.schema'
import { recipeDifficultiesTable } from '../recipe-difficulty/recipe-difficulty.schema'
import { usersTable } from '../user/user.schema'

export const recipesTable = pgTable('recipes', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  time: varchar({ length: 50 }).notNull(),
  servings: varchar({ length: 50 }).notNull(),
  emoji: varchar({ length: 10 }),
  isFavorite: boolean().default(false).notNull(),
  isCooked: boolean().default(false).notNull(),
  difficultyId: uuid()
    .notNull()
    .references(() => recipeDifficultiesTable.id),
  categoryId: uuid()
    .notNull()
    .references(() => recipeCategoriesTable.id),
  authorId: uuid()
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
})

// Relations
export const recipesRelations = relations(recipesTable, ({ one }) => ({
  difficulty: one(recipeDifficultiesTable, {
    fields: [recipesTable.difficultyId],
    references: [recipeDifficultiesTable.id],
  }),
  category: one(recipeCategoriesTable, {
    fields: [recipesTable.categoryId],
    references: [recipeCategoriesTable.id],
  }),
  author: one(usersTable, {
    fields: [recipesTable.authorId],
    references: [usersTable.id],
  }),
}))

export const recipeDifficultiesRelations = relations(recipeDifficultiesTable, ({ many }) => ({
  recipes: many(recipesTable),
}))

export const recipeCategoriesRelations = relations(recipeCategoriesTable, ({ many }) => ({
  recipes: many(recipesTable),
}))

export type RecipeSelect = InferSelectModel<typeof recipesTable>
export type RecipeInsert = InferInsertModel<typeof recipesTable>

export type RecipeSelectWithRelations = RecipeSelect & {
  difficulty: {
    id: string
    name: RecipeDifficultyEnum
  }
  category: {
    id: string
    name: string
    slug: string
  }
  author: {
    id: string
    name: string
    email: string
  }
}
