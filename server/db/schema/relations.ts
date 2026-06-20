import { defineRelations } from 'drizzle-orm'
import * as schema from './index'

export const relations = defineRelations(schema, r => ({
  passwordResetTokensTable: {
    user: r.one.usersTable({
      from: r.passwordResetTokensTable.userId,
      to: r.usersTable.id,
    }),
  },
  usersTable: {
    passwordResetTokens: r.many.passwordResetTokensTable(),
    recipesViaRecipeFavorites: r.many.recipesTable({
      alias: 'recipes_id_users_id_via_recipeFavorites',
    }),
    recipesAuthorId: r.many.recipesTable({
      alias: 'recipes_authorId_users_id',
    }),
    sessions: r.many.sessionsTable(),
  },
  recipesTable: {
    users: r.many.usersTable({
      from: r.recipesTable.id.through(r.recipeFavoritesTable.recipeId),
      to: r.usersTable.id.through(r.recipeFavoritesTable.userId),
      alias: 'recipes_id_users_id_via_recipeFavorites',
    }),
    user: r.one.usersTable({
      from: r.recipesTable.authorId,
      to: r.usersTable.id,
      alias: 'recipes_authorId_users_id',
    }),
    recipeCategory: r.one.recipeCategoriesTable({
      from: r.recipesTable.categoryId,
      to: r.recipeCategoriesTable.id,
    }),
    recipeDifficulty: r.one.recipeDifficultiesTable({
      from: r.recipesTable.difficultyId,
      to: r.recipeDifficultiesTable.id,
    }),
  },
  recipeCategoriesTable: {
    recipes: r.many.recipesTable(),
  },
  recipeDifficultiesTable: {
    recipes: r.many.recipesTable(),
  },
  sessionsTable: {
    user: r.one.usersTable({
      from: r.sessionsTable.userId,
      to: r.usersTable.id,
    }),
  },
}))
