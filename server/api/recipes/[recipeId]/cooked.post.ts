import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'
import { recipeUuidSchema } from '~~/shared/types/recipe/recipeUuid.type'

const cookedBodySchema = z.object({
  isCooked: z.boolean(),
})

const cookedParamsSchema = z.object({
  recipeId: recipeUuidSchema,
})

export default defineEventHandler(async (event) => {
  const db = useDB()

  const params = await getValidatedRouterParams(event, cookedParamsSchema.parse)
  const body = await readValidatedBody(event, cookedBodySchema.parse)

  const [updatedRecipe] = await db
    .update(recipesTable)
    .set({
      isCooked: !body.isCooked,
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
    isCooked: updatedRecipe.isCooked,
    updatedAt: updatedRecipe.updatedAt.toISOString(),
  }
})
