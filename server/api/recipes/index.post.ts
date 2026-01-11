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
      where: (recipes, { eq }) => eq(recipes.id, newRecipe.id),
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
