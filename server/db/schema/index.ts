import { sql } from 'drizzle-orm'
import { boolean, integer, pgEnum, pgTable, primaryKey, text, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core'

export const recipeDifficulty = pgEnum('recipe_difficulty', ['easy', 'medium', 'hard'])

export type RecipeDifficultyEnum = typeof recipeDifficulty

export const usersTable = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  passwordHash: varchar({ length: 255 }),
  createdAt: timestamp().default(sql`now()`).notNull(),
  updatedAt: timestamp().default(sql`now()`).notNull(),
}, table => [
  unique('users_email_unique').on(table.email),
])

export type UserSelect = typeof usersTable.$inferSelect
export type UserInsert = typeof usersTable.$inferInsert

export const passwordResetTokensTable = pgTable('password_reset_tokens', {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid().notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  token: varchar({ length: 255 }).notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().default(sql`now()`).notNull(),
}, table => [
  unique('password_reset_tokens_token_unique').on(table.token),
])

export const recipeCategoriesTable = pgTable('recipe_categories', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull(),
}, table => [
  unique('recipe_categories_slug_unique').on(table.slug),
])

export type RecipeCategorySelect = typeof recipeCategoriesTable.$inferSelect
export type RecipeCategoryInsert = typeof recipeCategoriesTable.$inferInsert

export const recipeDifficultiesTable = pgTable('recipe_difficulties', {
  id: uuid().defaultRandom().primaryKey(),
  name: recipeDifficulty().notNull(),
}, table => [
  unique('recipe_difficulties_name_unique').on(table.name),
])

export type RecipeDifficultySelect = typeof recipeDifficultiesTable.$inferSelect
export type RecipeDifficultyInsert = typeof recipeDifficultiesTable.$inferInsert

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

export const recipeFavoritesTable = pgTable('recipe_favorites', {
  userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  recipeId: uuid('recipe_id').notNull().references(() => recipesTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
}, table => [
  primaryKey({ columns: [table.userId, table.recipeId], name: 'recipe_favorites_user_id_recipe_id_pk' }),
])

export const sessionsTable = pgTable('sessions', {
  id: varchar().primaryKey(),
  userId: uuid().notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  secretHash: varchar().notNull(),
  createdAt: timestamp().default(sql`now()`).notNull(),
})
