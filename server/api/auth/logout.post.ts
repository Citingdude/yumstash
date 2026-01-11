import { eq } from 'drizzle-orm'
import { useDB } from '~~/server/db'
import { sessionsTable } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const sessionToken = getCookie(event, 'session')

  if (sessionToken) {
    const tokenParts = sessionToken.split('.')
    const sessionId = tokenParts[0]

    if (sessionId) {
      const db = useDB()
      await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId))
    }
  }

  deleteCookie(event, 'session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  })

  return {
    success: true,
  }
})
