import type { UserSelect } from '~~/server/db/schema/index'
import { useDB } from '~~/server/db'
import { usersTable } from '~~/server/db/schema/index'
import { UserTransformer } from '~~/server/utils/user/tranformers/user.transformer'

export default defineEventHandler(async () => {
  const db = useDB()

  const usersSelect: UserSelect[] = await db.select().from(usersTable)

  const users = usersSelect.map(UserTransformer.fromDatabase)

  return {
    users,
  }
})
