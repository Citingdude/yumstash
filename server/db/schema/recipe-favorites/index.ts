import { sql } from 'drizzle-orm'
import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core'

import { recipesTable } from '../recipes'
import { usersTable } from '../users'

export const recipeFavoritesTable = pgTable('recipe_favorites', {
  userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  recipeId: uuid('recipe_id').notNull().references(() => recipesTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
}, table => [
  primaryKey({ columns: [table.userId, table.recipeId], name: 'recipe_favorites_user_id_recipe_id_pk' }),
])
