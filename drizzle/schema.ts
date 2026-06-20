import { pgEnum, pgTable, varchar, uuid, text, timestamp, integer, boolean, foreignKey, primaryKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const recipeDifficulty = pgEnum("recipe_difficulty", ["easy", "medium", "hard"])


export const passwordResetTokens = pgTable("password_reset_tokens", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid().notNull().references(() => users.id, { onDelete: "cascade" } ),
	token: varchar({ length: 255 }).notNull(),
	expiresAt: timestamp().notNull(),
	createdAt: timestamp().default(sql`now()`).notNull(),
}, (table) => [
	unique("password_reset_tokens_token_unique").on(table.token),]);

export const recipeCategories = pgTable("recipe_categories", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("recipe_categories_slug_unique").on(table.slug),]);

export const recipeDifficulties = pgTable("recipe_difficulties", {
	id: uuid().defaultRandom().primaryKey(),
	name: recipeDifficulty().notNull(),
}, (table) => [
	unique("recipe_difficulties_name_unique").on(table.name),]);

export const recipeFavorites = pgTable("recipe_favorites", {
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	recipeId: uuid("recipe_id").notNull().references(() => recipes.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
}, (table) => [
	primaryKey({ columns: [table.userId, table.recipeId], name: "recipe_favorites_user_id_recipe_id_pk"}),
]);

export const recipes = pgTable("recipes", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	time: integer().notNull(),
	servings: varchar({ length: 50 }).notNull(),
	emoji: varchar({ length: 10 }),
	isFavorite: boolean().default(false).notNull(),
	isCooked: boolean().default(false).notNull(),
	difficultyId: uuid().notNull().references(() => recipeDifficulties.id),
	categoryId: uuid().notNull().references(() => recipeCategories.id),
	authorId: uuid().notNull().references(() => users.id),
	createdAt: timestamp().default(sql`now()`).notNull(),
	updatedAt: timestamp().default(sql`now()`).notNull(),
});

export const sessions = pgTable("sessions", {
	id: varchar().primaryKey(),
	userId: uuid().notNull().references(() => users.id, { onDelete: "cascade" } ),
	secretHash: varchar().notNull(),
	createdAt: timestamp().default(sql`now()`).notNull(),
});

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	passwordHash: varchar({ length: 255 }),
	createdAt: timestamp().default(sql`now()`).notNull(),
	updatedAt: timestamp().default(sql`now()`).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),]);
