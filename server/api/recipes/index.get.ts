import type { SQL } from 'drizzle-orm'
import type { RecipeSelectWithRelations } from '~~/server/db/schema/index'
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'
import type { RecipeIndexResult } from '~~/shared/types/recipe/recipeIndexResult.type'
import { and, asc, count, eq, ilike, or } from 'drizzle-orm'
import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'
import { RecipeWithRelationsTransformer } from '~~/server/transformers/recipeWithRelations.transformer'
import { DEFAULT_RECIPE_PAGE_SIZE } from '~~/shared/constants/recipePagination.constant'
import { recipeIndexQuerySchema } from '~~/shared/types/recipe/recipeIndexQuery.type'

export default defineEventHandler<Promise<RecipeIndexResult>>(async (event) => {
  const db = useDB()

  const {
    search,
    categoryId,
    page: rawPage,
    pageSize: rawPageSize,
  } = await getValidatedQuery(event, recipeIndexQuerySchema.parse)

  const pageSize = rawPageSize ?? DEFAULT_RECIPE_PAGE_SIZE
  const requestedPage = rawPage ?? 1

  const filters: SQL[] = buildFilters(search, categoryId)
  const whereClause = filters.length > 0 ? and(...filters) : undefined

  const countQuery = db.select({ value: count() }).from(recipesTable)
  const totalResult = whereClause
    ? await countQuery.where(whereClause)
    : await countQuery

  const total = Number(totalResult.at(0)?.value ?? 0)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(requestedPage, totalPages)
  const offset = (page - 1) * pageSize

  const dbRecipes: RecipeSelectWithRelations[] = await db.query.recipesTable.findMany({
    where: whereClause,
    orderBy: [
      asc(recipesTable.name),
    ],
    with: {
      difficulty: true,
      category: true,
      author: true,
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

function buildFilters(
  search: string | undefined,
  categoryId: string | undefined,
): SQL[] {
  const filters: SQL[] = []

  if (search) {
    const searchFilter = or(
      ilike(recipesTable.name, `%${search}%`),
      ilike(recipesTable.description, `%${search}%`),
    )

    if (searchFilter) {
      filters.push(searchFilter)
    }
  }

  if (categoryId) {
    filters.push(eq(recipesTable.categoryId, categoryId))
  }

  return filters
}
