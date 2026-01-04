import { useDB } from '~~/server/db'
import { validateSessionToken } from '~~/server/utils/session/session.util'

export default defineEventHandler(async (event) => {
  const sessionToken = getCookie(event, 'session')

  if (!sessionToken) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated',
    })
  }

  try {
    const db = useDB()
    const session = await validateSessionToken(db, sessionToken)

    if (!session) {
      throw createError({
        statusCode: 401,
        message: 'Invalid session',
      })
    }

    return {
      authenticated: true,
    }
  }
  catch (error) {
    console.error('Session validation error:', error)
    throw createError({
      statusCode: 401,
      message: 'Invalid session',
    })
  }
})
