import type { RecipeSelectWithRelations } from '~~/server/db/schema/index'
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'
import { RecipeWithRelationsTransformer } from '~~/server/transformers/recipeWithRelations.transformer'
import { requireAuth } from '~~/server/utils/auth/auth.util'
import { recipeUuidSchema } from '~~/shared/types/recipe/recipeUuid.type'

const recipeParamsSchema = z.object({
  recipeId: recipeUuidSchema,
})

export default defineEventHandler<Promise<RecipeWithRelations>>(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()

  const params = await getValidatedRouterParams(event, recipeParamsSchema.parse)

  const dbRecipe: RecipeSelectWithRelations | undefined = await db.query.recipesTable.findFirst({
    where: eq(recipesTable.id, params.recipeId),
    with: {
      difficulty: true,
      category: true,
      author: true,
    },
  })

  if (!dbRecipe) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Recipe not found',
    })
  }

  // Ensure the user owns this recipe
  if (dbRecipe.authorId !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have permission to view this recipe',
    })
  }

  return RecipeWithRelationsTransformer.fromDb(dbRecipe)
})
