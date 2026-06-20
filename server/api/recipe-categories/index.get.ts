import type { RecipeCategorySelect } from '~~/server/db/schema/index'
import type { RecipeCategory } from '~~/shared/types/recipe-category/recipeCategory.type'
import type { RecipeCategoryUuid } from '~~/shared/types/recipe-category/recipeCategoryUuid.type'
import { useDB } from '~~/server/db'

export default defineEventHandler<Promise<RecipeCategory[]>>(async () => {
  const db = useDB()

  const dbCategories: RecipeCategorySelect[] = await db.query.recipeCategoriesTable.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  const categories: RecipeCategory[] = dbCategories.map((dbCategory) => {
    return {
      id: dbCategory.id as RecipeCategoryUuid,
      name: dbCategory.name,
      slug: dbCategory.slug,
    }
  })

  return categories
})
