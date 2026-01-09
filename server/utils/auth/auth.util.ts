import type { H3Event } from 'h3'
import { useDB } from '~~/server/db'
import { validateSessionToken } from '~~/server/utils/session/session.util'

/**
 * Gets the authenticated user ID from the session cookie.
 * Throws 401 error if not authenticated or session is invalid.
 *
 * @param event - The H3 event object
 * @returns The authenticated user ID
 * @throws 401 error if not authenticated
 */
export async function requireAuth(event: H3Event): Promise<string> {
  const sessionToken = getCookie(event, 'session')

  if (!sessionToken) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required',
    })
  }

  const db = useDB()
  const session = await validateSessionToken(db, sessionToken)

  if (!session || !session.userId) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired session',
    })
  }

  return session.userId
}
