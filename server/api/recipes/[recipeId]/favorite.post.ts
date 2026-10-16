import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { useDB } from '~~/server/db'
import { recipeFavoritesTable } from '~~/server/db/schema'
import { requireAuth } from '~~/server/utils/auth/auth.util'
import { recipeUuidSchema } from '~~/shared/types/recipe/recipeUuid.type'

const bodySchema = z.object({
  isFavorite: z.boolean(),
})

const paramsSchema = z.object({
  recipeId: recipeUuidSchema,
})

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()
  const { recipeId } = await getValidatedRouterParams(event, paramsSchema.parse)
  const body = await readValidatedBody(event, bodySchema.parse)

  const recipe = await db.query.recipesTable.findFirst({
    where: { id: recipeId },
  })

  if (!recipe) {
    throw createError({ statusCode: 404, statusMessage: 'Recipe not found' })
  }

  // Match the access policy of the recipe detail endpoint.
  if (recipe.authorId !== userId) {
    throw createError({ statusCode: 403, statusMessage: 'You do not have permission to update this recipe' })
  }

  const isFavorite = !body.isFavorite
  if (isFavorite) {
    await db.insert(recipeFavoritesTable).values({ userId, recipeId }).onConflictDoNothing()
  }
  else {
    await db.delete(recipeFavoritesTable).where(and(
      eq(recipeFavoritesTable.userId, userId),
      eq(recipeFavoritesTable.recipeId, recipeId),
    ))
  }

  return { id: recipeId, isFavorite }
})
