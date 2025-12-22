CREATE TYPE "public"."recipe_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TABLE "recipe_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	CONSTRAINT "recipe_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "recipe_difficulties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" "recipe_difficulty" NOT NULL,
	CONSTRAINT "recipe_difficulties_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"time" varchar(50) NOT NULL,
	"servings" varchar(50) NOT NULL,
	"emoji" varchar(10),
	"difficultyId" uuid NOT NULL,
	"categoryId" uuid NOT NULL,
	"authorId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_difficultyId_recipe_difficulties_id_fk" FOREIGN KEY ("difficultyId") REFERENCES "public"."recipe_difficulties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_categoryId_recipe_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."recipe_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;