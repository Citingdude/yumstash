import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'
import { createRecipeFormSchema } from '~~/shared/types/recipe/createRecipeForm.type'
import { recipeUuidSchema } from '~~/shared/types/recipe/recipeUuid.type'

const updateParamsSchema = z.object({
  recipeId: recipeUuidSchema,
})

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()

  const params = await getValidatedRouterParams(event, updateParamsSchema.parse)

  const body = await readValidatedBody(event, createRecipeFormSchema.parse)

  const [existingRecipe] = await db
    .select({ id: recipesTable.id, authorId: recipesTable.authorId })
    .from(recipesTable)
    .where(eq(recipesTable.id, params.recipeId))
    .limit(1)

  if (!existingRecipe) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Recipe not found',
    })
  }

  if (existingRecipe.authorId !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You are not authorized to edit this recipe',
    })
  }

  const [updatedRecipe] = await db
    .update(recipesTable)
    .set({ ...body, updatedAt: new Date() })
    .where(and(
      eq(recipesTable.id, params.recipeId),
      eq(recipesTable.authorId, userId),
    ))
    .returning()

  if (updatedRecipe === undefined) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update recipe',
    })
  }

  return {
    success: true,
    id: updatedRecipe.id,
  }
})
