import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'
import { recipeUuidSchema } from '~~/shared/types/recipe/recipeUuid.type'

const favoriteBodySchema = z.object({
  isFavorite: z.boolean(),
})

export default defineEventHandler(async (event) => {
  const db = useDB()
  const recipeIdParam = getRouterParam(event, 'recipeId')
  const parsedRecipeId = recipeUuidSchema.safeParse(recipeIdParam)

  if (!parsedRecipeId.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid recipe id',
    })
  }

  const body = await readBody(event)
  const parsedBody = favoriteBodySchema.safeParse(body)

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: z.treeifyError(parsedBody.error),
    })
  }

  const [updatedRecipe] = await db
    .update(recipesTable)
    .set({
      isFavorite: !parsedBody.data.isFavorite,
      updatedAt: new Date(),
    })
    .where(eq(recipesTable.id, parsedRecipeId.data))
    .returning()

  if (!updatedRecipe) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Recipe not found',
    })
  }

  return {
    id: updatedRecipe.id,
    isFavorite: updatedRecipe.isFavorite,
    updatedAt: updatedRecipe.updatedAt.toISOString(),
  }
})
