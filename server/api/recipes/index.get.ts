import type { RecipeWithRelations } from '~~/types/recipe'
import { asc, ilike, or } from 'drizzle-orm'
import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'

export default defineEventHandler<Promise<RecipeWithRelations[]>>(async (event) => {
  const db = useDB()
  const query = getQuery(event)
  const search = query.search as string | undefined

  const dbRecipes = await db.query.recipesTable.findMany({
    where: search
      ? or(
          ilike(recipesTable.name, `%${search}%`),
          ilike(recipesTable.description, `%${search}%`),
        )
      : undefined,
    orderBy: [
      asc(recipesTable.createdAt),
    ],
    with: {
      difficulty: true,
      category: true,
      author: true,
    },
  })

  const recipes: RecipeWithRelations[] = dbRecipes.map((dbRecipe) => {
    return {
      id: dbRecipe.id,
      name: dbRecipe.name,
      description: dbRecipe.description,
      time: dbRecipe.time,
      servings: dbRecipe.servings,
      emoji: dbRecipe.emoji,
      difficulty: {
        id: dbRecipe.difficulty.id,
        name: dbRecipe.difficulty.name,
      },
      category: {
        id: dbRecipe.category.id,
        name: dbRecipe.category.name,
        slug: dbRecipe.category.slug,
      },
      author: {
        id: dbRecipe.author.id,
        name: dbRecipe.author.name,
        email: dbRecipe.author.email,
      },
      createdAt: dbRecipe.createdAt.toISOString(),
      updatedAt: dbRecipe.updatedAt.toISOString(),
      authorId: dbRecipe.authorId,
      categoryId: dbRecipe.categoryId,
      difficultyId: dbRecipe.difficultyId,
    }
  })

  return recipes
})
