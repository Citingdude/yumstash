import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'
import { recipeUuidSchema } from '~~/shared/types/recipe/recipeUuid.type'

const favoriteBodySchema = z.object({
  isFavorite: z.boolean(),
})

const favoriteParamsSchema = z.object({
  recipeId: recipeUuidSchema,
})

export default defineEventHandler(async (event) => {
  const db = useDB()

  const params = await getValidatedRouterParams(event, favoriteParamsSchema.parse)
  const body = await readValidatedBody(event, favoriteBodySchema.parse)

  const [updatedRecipe] = await db
    .update(recipesTable)
    .set({
      isFavorite: !body.isFavorite,
      updatedAt: new Date(),
    })
    .where(eq(recipesTable.id, params.recipeId))
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
