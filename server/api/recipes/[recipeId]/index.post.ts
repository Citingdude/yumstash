import { eq } from 'drizzle-orm'
import z from 'zod'
import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'
import { requireAuth } from '~~/server/utils/auth/auth.util'
import { recipeUuidSchema } from '~~/shared/types/recipe/recipeUuid.type'
import { updateRecipeFormSchema } from '~~/shared/types/recipe/updateRecipeForm.type'

const paramsSchema = z.object({
  recipeId: recipeUuidSchema,
})

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()

  const params = await getValidatedRouterParams(event, paramsSchema.parse)
  const body = await readValidatedBody(event, updateRecipeFormSchema.parse)

  try {
    const [updatedRecipe] = await db
      .update(recipesTable)
      .set({
        categoryId: body.categoryId,
        description: body.description,
        name: body.name,
        time: body.time,
        servings: body.servings,
        emoji: body.emoji,
        difficultyId: body.difficultyId,
      })
      .where(eq(recipesTable.id, params.recipeId))
      .returning()

    if (!updatedRecipe) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update the recipe',
      })
    }

    const recipe = await db.query.recipesTable.findFirst({
      where: (recipes, { eq }) => eq(recipes.id, updatedRecipe.id),
      with: {
        difficulty: true,
        category: true,
        author: true,
      },
    })

    if (!recipe) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve created recipe',
      })
    }

    return {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      time: recipe.time,
      servings: recipe.servings,
      emoji: recipe.emoji,
      isFavorite: recipe.isFavorite,
      isCooked: recipe.isCooked,
      difficulty: {
        id: recipe.difficulty.id,
        name: recipe.difficulty.name,
      },
      category: {
        id: recipe.category.id,
        name: recipe.category.name,
        slug: recipe.category.slug,
      },
      author: {
        id: recipe.author.id,
        name: recipe.author.name,
        email: recipe.author.email,
      },
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: recipe.updatedAt.toISOString(),
    }
  }
  catch (error) {
    console.error('Error creating recipe:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create recipe',
    })
  }
})
