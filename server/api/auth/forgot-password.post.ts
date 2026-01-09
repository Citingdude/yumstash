import { forgotPasswordBodySchema } from '#shared/types/auth/forgot-password/forgotPassword.type'
import { generateSecureRandomString } from '#shared/utils/crypto/crypto.util'
import { eq } from 'drizzle-orm'
import { useDB } from '~~/server/db'
import { passwordResetTokensTable, usersTable } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const {
    email,
  } = await readValidatedBody(event, forgotPasswordBodySchema.parse)

  const db = useDB()

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  })

  if (!user) {
    return {
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
    }
  }

  const token = generateSecureRandomString()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

  await db.delete(passwordResetTokensTable)
    .where(eq(passwordResetTokensTable.userId, user.id))

  await db.insert(passwordResetTokensTable).values({
    userId: user.id,
    token,
    expiresAt,
  })

  // TODO: Send email with reset link
  // In a real application, you would send an email here with a link like:
  // const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`
  // await sendPasswordResetEmail(user.email, resetLink)

  // For development, log the token
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Password reset token for ${email}: ${token}`)
    console.warn(`Reset link: http://localhost:3000/reset-password?token=${token}`)
  }

  return {
    success: true,
    message: 'If an account exists with that email, a password reset link has been sent.',
  }
})
