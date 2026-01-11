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
      difficulty: {
        id: dbRecipe.difficulty.id,
        name: dbRecipe.difficulty.name,
      },
      category: {
        id: dbRecipe.category.id,
        name: dbRecipe.category.name,
        slug: dbRecipe.category.slug,
      },
      author: {
        id: dbRecipe.author.id,
        name: dbRecipe.author.name,
        email: dbRecipe.author.email,
      },
      createdAt: dbRecipe.createdAt.toISOString(),
      updatedAt: dbRecipe.updatedAt.toISOString(),
      authorId: dbRecipe.authorId,
      categoryId: dbRecipe.categoryId,
      difficultyId: dbRecipe.difficultyId,
      isFavorite: dbRecipe.isFavorite,
      isCooked: dbRecipe.isCooked,
    }
  }
}
