import type { RecipeSelectWithRelations } from '~~/server/db/schema'
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'
import type { RecipeUuid } from '~~/shared/types/recipe/recipeUuid.type'

export class RecipeWithRelationsTransformer {
  public static fromDb(dbRecipe: RecipeSelectWithRelations): RecipeWithRelations {
    return {
      id: dbRecipe.id as RecipeUuid,
      name: dbRecipe.name,
      description: dbRecipe.description,
      time: dbRecipe.time,
      servings: dbRecipe.servings,
      emoji: dbRecipe.emoji,
      difficulty: dbRecipe.recipeDifficulty
        ? {
            id: dbRecipe.recipeDifficulty.id,
            name: dbRecipe.recipeDifficulty.name,
          }
        : null,
      category: dbRecipe.recipeCategory
        ? {
            id: dbRecipe.recipeCategory.id,
            name: dbRecipe.recipeCategory.name,
            slug: dbRecipe.recipeCategory.slug,
          }
        : null,
      author: dbRecipe.user
        ? {
            id: dbRecipe.user.id,
            name: dbRecipe.user.name,
            email: dbRecipe.user.email,
          }
        : null,
      createdAt: dbRecipe.createdAt.toISOString(),
      updatedAt: dbRecipe.updatedAt.toISOString(),
      authorId: dbRecipe.authorId,
      categoryId: dbRecipe.categoryId,
      difficultyId: dbRecipe.difficultyId,
      isFavorite: false,
      isCooked: dbRecipe.isCooked,
    }
  }
}
