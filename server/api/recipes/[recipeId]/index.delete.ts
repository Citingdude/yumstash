import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'
import { recipeUuidSchema } from '~~/shared/types/recipe/recipeUuid.type'

const deleteParamsSchema = z.object({
  recipeId: recipeUuidSchema,
})

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()

  const params = await getValidatedRouterParams(event, deleteParamsSchema.parse)

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
      statusMessage: 'You are not authorized to delete this recipe',
    })
  }

  const [deletedRecipe] = await db
    .delete(recipesTable)
    .where(and(
      eq(recipesTable.id, params.recipeId),
      eq(recipesTable.authorId, userId),
    ))
    .returning()

  return {
    success: true,
    id: deletedRecipe.id,
  }
})
