import type { SQL } from 'drizzle-orm'
import type { RecipeSelectWithRelations } from '~~/server/db/schema/index'
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'
import type { RecipeIndexResult } from '~~/shared/types/recipe/recipeIndexResult.type'
import { and, count, eq, ilike, or } from 'drizzle-orm'
import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'
import { RecipeWithRelationsTransformer } from '~~/server/transformers/recipeWithRelations.transformer'
import { requireAuth } from '~~/server/utils/auth/auth.util'
import { DEFAULT_RECIPE_PAGE_SIZE } from '~~/shared/constants/recipePagination.constant'
import { recipeIndexQuerySchema } from '~~/shared/types/recipe/recipeIndexQuery.type'

export default defineEventHandler<Promise<RecipeIndexResult>>(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()

  const {
    search,
    categoryId,
    page: rawPage,
    pageSize: rawPageSize,
  } = await getValidatedQuery(event, recipeIndexQuerySchema.parse)

  const pageSize = rawPageSize ?? DEFAULT_RECIPE_PAGE_SIZE
  const requestedPage = rawPage ?? 1

  const countWhereClause = buildSqlWhere(search, categoryId, userId)

  const totalResult = await db
    .select({ value: count() })
    .from(recipesTable)
    .where(countWhereClause)

  const total = Number(totalResult.at(0)?.value ?? 0)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(requestedPage, totalPages)
  const offset = (page - 1) * pageSize

  const dbRecipes: RecipeSelectWithRelations[] = await db.query.recipesTable.findMany({
    where: {
      categoryId,
      authorId: userId,
      OR: search
        ? [
            { name: { ilike: `%${search}%` } },
            { description: { ilike: `%${search}%` } },
          ]
        : undefined,
    },
    orderBy: {
      createdAt: 'desc',
    },
    with: {
      recipeDifficulty: true,
      recipeCategory: true,
      user: true,
    },
    limit: pageSize,
    offset,
  })

  const recipes: RecipeWithRelations[] = dbRecipes.map(RecipeWithRelationsTransformer.fromDb)

  return {
    items: recipes,
    meta: {
      page,
      pageSize,
      total,
      totalPages,
    },
  }
})

function buildSqlWhere(
  search: string | undefined,
  categoryId: string | undefined,
  userId: string,
): SQL {
  return and(
    eq(recipesTable.authorId, userId),
    search
      ? or(
          ilike(recipesTable.name, `%${search}%`),
          ilike(recipesTable.description, `%${search}%`),
        )
      : undefined,
    categoryId ? eq(recipesTable.categoryId, categoryId) : undefined,
  )!
}
