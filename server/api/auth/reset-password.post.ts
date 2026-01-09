import type { ApiSuccessResponse } from '#shared/types/api/apiResponse.type'
import { resetPasswordBodySchema } from '#shared/types/auth/reset-password/resetPassword.type'
import { and, eq, gt } from 'drizzle-orm'
import { useDB } from '~~/server/db'
import { passwordResetTokensTable, usersTable } from '~~/server/db/schema'
import { handleApiError } from '~~/server/utils/error/error.util'
import { PasswordUtil } from '~~/server/utils/password/password.util'

export default defineEventHandler(async (event): Promise<ApiSuccessResponse> => {
  try {
    const {
      token,
      password,
    } = await readValidatedBody(event, resetPasswordBodySchema.parse)

    const db = useDB()

    const resetToken = await db.query.passwordResetTokensTable.findFirst({
      where: and(
        eq(passwordResetTokensTable.token, token),
        gt(passwordResetTokensTable.expiresAt, new Date()),
      ),
      with: {
        user: true,
      },
    })

    if (!resetToken) {
      throw createError({
        statusCode: 400,
        message: 'Invalid or expired password reset token',
      })
    }

    const passwordHash = await PasswordUtil.hash(password)

    await db.update(usersTable)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, resetToken.userId))

    await db.delete(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.id, resetToken.id))

    return {
      success: true,
      message: 'Password has been reset successfully',
    }
  }
  catch (error) {
    throw handleApiError(error)
  }
})
