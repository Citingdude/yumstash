import { authLoginBodySchema } from '#shared/types/auth/login/authLogin.type'
import { eq } from 'drizzle-orm'
import { useDB } from '~~/server/db'
import { usersTable } from '~~/server/db/schema'
import { verifyPassword } from '~~/server/utils/password/password.util'
import { createSession } from '~~/server/utils/session/session.util'

export default defineEventHandler(async (event) => {
  const { email, password, remember } = await readValidatedBody(event, authLoginBodySchema.parse)

  const db = useDB()

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password',
    })
  }

  if (!user.passwordHash) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password',
    })
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash)
  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password',
    })
  }

  const session = await createSession(db)

  // 30 days or 1 day
  const maxAge = remember
    ? 60 * 60 * 24 * 30
    : 60 * 60 * 24

  setCookie(event, 'session', session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  }
})
