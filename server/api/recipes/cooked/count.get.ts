import { count, eq } from 'drizzle-orm'
import { useDB } from '~~/server/db'
import { recipeCookedTable } from '~~/server/db/schema/index'
import { requireAuth } from '~~/server/utils/auth/auth.util'

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()

  const [result] = await db
    .select({ count: count() })
    .from(recipeCookedTable)
    .where(eq(recipeCookedTable.userId, userId))

  return {
    count: Number(result?.count ?? 0),
  }
})
