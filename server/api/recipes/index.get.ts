import type { SQL } from 'drizzle-orm'
import type { RecipeSelectWithRelations } from '~~/server/db/schema/index'
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'
import { and, asc, eq, ilike, or } from 'drizzle-orm'
import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'
import { RecipeWithRelationsTransformer } from '~~/server/transformers/recipeWithRelations.transformer'
import { recipeIndexQuerySchema } from '~~/shared/types/recipe/recipeIndexQuery.type'

export default defineEventHandler<Promise<RecipeWithRelations[]>>(async (event) => {
  const db = useDB()

  const { search, categoryId } = await getValidatedQuery(event, recipeIndexQuerySchema.parse)

  const filters: SQL[] = buildFilters(search, categoryId)

  const dbRecipes: RecipeSelectWithRelations[] = await db.query.recipesTable.findMany({
    where: and(...filters),
    orderBy: [
      asc(recipesTable.name),
    ],
    with: {
      difficulty: true,
      category: true,
      author: true,
    },
  })

  const recipes: RecipeWithRelations[] = dbRecipes.map(RecipeWithRelationsTransformer.fromDb)

  return recipes
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
