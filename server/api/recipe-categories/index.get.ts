import type { RecipeCategory } from '~~/shared/types/recipe-category/recipeCategory.type'
import type { RecipeCategoryUuid } from '~~/shared/types/recipe-category/recipeCategoryUuid.type'
import { asc } from 'drizzle-orm'
import { useDB } from '~~/server/db'
import { recipeCategoriesTable } from '~~/server/db/schema/index'

export default defineEventHandler<Promise<RecipeCategory[]>>(async () => {
  const db = useDB()

  const dbCategories = await db.query.recipeCategoriesTable.findMany({
    orderBy: [
      asc(recipeCategoriesTable.name),
    ],
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
