import type { RecipeDifficulty } from '~~/shared/types/recipe-difficulty/recipeDifficulty.type'
import type { RecipeDifficultyUuid } from '~~/shared/types/recipe-difficulty/recipeDifficultyUuid.type'
import { asc } from 'drizzle-orm'
import { useDB } from '~~/server/db'
import { recipeDifficultiesTable } from '~~/server/db/schema/index'

export default defineEventHandler<Promise<RecipeDifficulty[]>>(async () => {
  const db = useDB()

  const dbDifficulties = await db.query.recipeDifficultiesTable.findMany({
    orderBy: [
      asc(recipeDifficultiesTable.name),
    ],
  })

  const difficulties: RecipeDifficulty[] = dbDifficulties.map((dbDifficulty) => {
    return {
      id: dbDifficulty.id as RecipeDifficultyUuid,
      name: dbDifficulty.name,
    }
  })

  return difficulties
})
