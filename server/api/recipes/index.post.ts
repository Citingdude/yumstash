import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'
import { requireAuth } from '~~/server/utils/auth/auth.util'
import { createRecipeFormSchema } from '~~/shared/types/recipe/createRecipeForm.type'

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()

  const body = await readValidatedBody(event, createRecipeFormSchema.parse)

  try {
    const [newRecipe] = await db
      .insert(recipesTable)
      .values({
        name: body.name,
        description: body.description,
        time: body.time,
        servings: body.servings,
        emoji: body.emoji,
        difficultyId: body.difficultyId,
        categoryId: body.categoryId,
        authorId: userId,
      })
      .returning()

    if (!newRecipe) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create new recipe',
      })
    }

    const recipe = await db.query.recipesTable.findFirst({
      where: {
        id: newRecipe.id,
      },
      with: {
        recipeDifficulty: true,
        recipeCategory: true,
        user: true,
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
      isFavorite: false,
      isCooked: recipe.isCooked,
      difficulty: recipe.recipeDifficulty
        ? {
            id: recipe.recipeDifficulty.id,
            name: recipe.recipeDifficulty.name,
          }
        : null,
      category: recipe.recipeCategory
        ? {
            id: recipe.recipeCategory.id,
            name: recipe.recipeCategory.name,
            slug: recipe.recipeCategory.slug,
          }
        : null,
      user: recipe.user
        ? {
            id: recipe.user.id,
            name: recipe.user.name,
            email: recipe.user.email,
          }
        : null,
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
