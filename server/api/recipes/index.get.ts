import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'
import type { RecipeUuid } from '~~/shared/types/recipe/recipeUuid.type'
import { and, asc, eq, ilike, or } from 'drizzle-orm'
import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'
import { recipeIndexQuerySchema } from '~~/shared/types/recipe/recipeIndexQuery.type'

export default defineEventHandler<Promise<RecipeWithRelations[]>>(async (event) => {
  const db = useDB()
  const { search, categoryId } = await getValidatedQuery(event, recipeIndexQuerySchema.parse)

  const conditions = []

  if (search) {
    conditions.push(
      or(
        ilike(recipesTable.name, `%${search}%`),
        ilike(recipesTable.description, `%${search}%`),
      ),
    )
  }

  if (categoryId) {
    conditions.push(eq(recipesTable.categoryId, categoryId))
  }

  const dbRecipes = await db.query.recipesTable.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: [
      asc(recipesTable.name),
    ],
    with: {
      difficulty: true,
      category: true,
      author: true,
    },
  })

  const recipes: RecipeWithRelations[] = dbRecipes.map((dbRecipe) => {
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
  })

  return recipes
})
