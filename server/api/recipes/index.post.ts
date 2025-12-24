import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'
import { createRecipeFormSchema } from '~~/shared/types/recipe/createRecipeForm.type'

export default defineEventHandler(async (event) => {
  const db = useDB()

  const body = await readBody(event)
  const validationResult = createRecipeFormSchema.safeParse(body)

  if (!validationResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: validationResult.error.format(),
    })
  }

  const data = validationResult.data

  try {
    const [newRecipe] = await db
      .insert(recipesTable)
      .values({
        name: data.name,
        description: data.description,
        time: data.time,
        servings: data.servings,
        emoji: data.emoji,
        difficultyId: data.difficultyId,
        categoryId: data.categoryId,
        authorId: '160d5ddd-a48c-4107-917c-2d65ffb82538',
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
