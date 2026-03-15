import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'
import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'
import { RecipeWithRelationsTransformer } from '~~/server/transformers/recipeWithRelations.transformer'
import { requireAuth } from '~~/server/utils/auth/auth.util'
import { createRecipeFormSchema } from '~~/shared/types/recipe/createRecipeForm.type'

export default defineEventHandler<Promise<RecipeWithRelations>>(async (event) => {
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

    return RecipeWithRelationsTransformer.fromDb(recipe)
  }
  catch (error) {
    console.error('Error creating recipe:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create recipe',
    })
  }
})
