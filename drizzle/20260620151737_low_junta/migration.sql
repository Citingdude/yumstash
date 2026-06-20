CREATE TYPE "recipe_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" uuid NOT NULL,
	"token" varchar(255) NOT NULL CONSTRAINT "password_reset_tokens_token_unique" UNIQUE,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL CONSTRAINT "recipe_categories_slug_unique" UNIQUE
);
--> statement-breakpoint
CREATE TABLE "recipe_difficulties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" "recipe_difficulty" NOT NULL CONSTRAINT "recipe_difficulties_name_unique" UNIQUE
);
--> statement-breakpoint
CREATE TABLE "recipe_favorites" (
	"user_id" uuid,
	"recipe_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recipe_favorites_user_id_recipe_id_pk" PRIMARY KEY("user_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"time" integer NOT NULL,
	"servings" varchar(50) NOT NULL,
	"emoji" varchar(10),
	"isFavorite" boolean DEFAULT false NOT NULL,
	"isCooked" boolean DEFAULT false NOT NULL,
	"difficultyId" uuid NOT NULL,
	"categoryId" uuid NOT NULL,
	"authorId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar PRIMARY KEY,
	"userId" uuid NOT NULL,
	"secretHash" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL CONSTRAINT "users_email_unique" UNIQUE,
	"passwordHash" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_users_id_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "recipe_favorites" ADD CONSTRAINT "recipe_favorites_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "recipe_favorites" ADD CONSTRAINT "recipe_favorites_recipe_id_recipes_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_difficultyId_recipe_difficulties_id_fkey" FOREIGN KEY ("difficultyId") REFERENCES "recipe_difficulties"("id");--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_categoryId_recipe_categories_id_fkey" FOREIGN KEY ("categoryId") REFERENCES "recipe_categories"("id");--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_authorId_users_id_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;