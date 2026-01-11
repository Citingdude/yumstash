import { authRegisterBodySchema } from '#shared/types/auth/register/authRegister.type'
import { eq } from 'drizzle-orm'
import { useDB } from '~~/server/db'
import { usersTable } from '~~/server/db/schema'
import { handleApiError } from '~~/server/utils/error/error.util'
import { PasswordUtil } from '~~/server/utils/password/password.util'
import { createSession } from '~~/server/utils/session/session.util'

export default defineEventHandler(async (event) => {
  try {
    const {
      name,
      email,
      password,
    } = await readValidatedBody(event, authRegisterBodySchema.parse)

    const db = useDB()

    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'Email already registered',
      })
    }

    const passwordHash = await PasswordUtil.hash(password)

    const [newUser] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        passwordHash,
      })
      .returning()

    if (!newUser) {
      throw createError({
        statusCode: 500,
        message: 'Failed to create user',
      })
    }

    const session = await createSession(db, newUser.id)

    setCookie(event, 'session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    }
  }
  catch (error) {
    throw handleApiError(error)
  }
})
