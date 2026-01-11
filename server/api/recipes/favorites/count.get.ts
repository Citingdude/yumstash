import { count, eq } from 'drizzle-orm'
import { useDB } from '~~/server/db'
import { recipesTable } from '~~/server/db/schema/index'

export default defineEventHandler(async () => {
  const db = useDB()

  const [result] = await db
    .select({ count: count() })
    .from(recipesTable)
    .where(eq(recipesTable.isFavorite, true))

  return {
    count: Number(result?.count ?? 0),
  }
})
