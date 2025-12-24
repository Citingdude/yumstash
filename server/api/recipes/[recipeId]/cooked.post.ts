import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'
import { recipeUuidSchema } from '~~/shared/types/recipe/recipeUuid.type'

const cookedBodySchema = z.object({
  isCooked: z.boolean(),
})

type CookedRequestBody = z.infer<typeof cookedBodySchema>

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

  const body = await readBody<CookedRequestBody>(event)
  const parsedBody = cookedBodySchema.safeParse(body)

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: parsedBody.error.format(),
    })
  }

  const [updatedRecipe] = await db
    .update(recipesTable)
    .set({
      isCooked: !parsedBody.data.isCooked,
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
    isCooked: updatedRecipe.isCooked,
    updatedAt: updatedRecipe.updatedAt.toISOString(),
  }
})
