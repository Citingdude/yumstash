CREATE TABLE "recipe_cooked" (
	"user_id" uuid,
	"recipe_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recipe_cooked_user_id_recipe_id_pk" PRIMARY KEY("user_id","recipe_id")
);
--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "isFavorite";--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "isCooked";--> statement-breakpoint
ALTER TABLE "recipe_cooked" ADD CONSTRAINT "recipe_cooked_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "recipe_cooked" ADD CONSTRAINT "recipe_cooked_recipe_id_recipes_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE;