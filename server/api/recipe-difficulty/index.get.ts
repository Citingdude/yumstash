import type { RecipeDifficulty } from '~~/shared/types/recipe-difficulty/recipeDifficulty.type'
import type { RecipeDifficultyUuid } from '~~/shared/types/recipe-difficulty/recipeDifficultyUuid.type'
import { useDB } from '~~/server/db'

export default defineEventHandler<Promise<RecipeDifficulty[]>>(async () => {
  const db = useDB()

  const dbDifficulties = await db.query.recipeDifficultiesTable.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  const difficulties: RecipeDifficulty[] = dbDifficulties.map((dbDifficulty) => {
    return {
      id: dbDifficulty.id as RecipeDifficultyUuid,
      name: dbDifficulty.name,
    }
  })

  return difficulties
})
