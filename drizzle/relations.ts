import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	passwordResetTokens: {
		user: r.one.users({
			from: r.passwordResetTokens.userId,
			to: r.users.id
		}),
	},
	users: {
		passwordResetTokens: r.many.passwordResetTokens(),
		recipesViaRecipeFavorites: r.many.recipes({
			alias: "recipes_id_users_id_via_recipeFavorites"
		}),
		recipesAuthorId: r.many.recipes({
			alias: "recipes_authorId_users_id"
		}),
		sessions: r.many.sessions(),
	},
	recipes: {
		users: r.many.users({
			from: r.recipes.id.through(r.recipeFavorites.recipeId),
			to: r.users.id.through(r.recipeFavorites.userId),
			alias: "recipes_id_users_id_via_recipeFavorites"
		}),
		user: r.one.users({
			from: r.recipes.authorId,
			to: r.users.id,
			alias: "recipes_authorId_users_id"
		}),
		recipeCategory: r.one.recipeCategories({
			from: r.recipes.categoryId,
			to: r.recipeCategories.id
		}),
		recipeDifficulty: r.one.recipeDifficulties({
			from: r.recipes.difficultyId,
			to: r.recipeDifficulties.id
		}),
	},
	recipeCategories: {
		recipes: r.many.recipes(),
	},
	recipeDifficulties: {
		recipes: r.many.recipes(),
	},
	sessions: {
		user: r.one.users({
			from: r.sessions.userId,
			to: r.users.id
		}),
	},
}))