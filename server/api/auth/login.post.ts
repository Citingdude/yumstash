import { useDB } from '~~/server/db'
import { handleApiError } from '~~/server/utils/error/error.util'
import { PasswordUtil } from '~~/server/utils/password/password.util'
import { createSession } from '~~/server/utils/session/session.util'
import { authLoginBodySchema } from '#shared/types/auth/login/authLogin.type'

export default defineEventHandler(async (event) => {
  try {
    const { email, password, remember } = await readValidatedBody(event, authLoginBodySchema.parse)

    const db = useDB()

    if (db === null) {
      throw createError('No DB')
    }

    const user = await db.query.usersTable.findFirst({
      where: {
        email,
      },
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

    const isValidPassword = await PasswordUtil.verify(password, user.passwordHash)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password',
      })
    }

    const session = await createSession(db, user.id)

    // 30 days or 1 day
    const maxAge = remember
      ? 60 * 60 * 24 * 30
      : 60 * 60 * 24

    setCookie(event, 'session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
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
  }
  catch (error) {
    throw handleApiError(error)
  }
})
