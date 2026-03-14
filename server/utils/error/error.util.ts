import { H3Error } from 'h3'
import { ZodError } from 'zod'

interface ErrorBody {
  message: string
  errors?: Record<string, string[]>
}

/**
 * Converts any error into a standardized H3Error.
 * Handles Zod validation errors, standard errors, and unknown errors.
 *
 * @param error - The error to handle
 * @returns A properly formatted H3Error
 */
export function handleApiError(error: unknown): H3Error<ErrorBody> {
  if (error instanceof H3Error) {
    return createError<ErrorBody>(error)
  }

  if (error instanceof ZodError) {
    const validationErrors: Record<string, string[]> = {}
    error.issues.forEach((issue) => {
      const path = issue.path.join('.')
      if (!validationErrors[path]) {
        validationErrors[path] = []
      }
      validationErrors[path].push(issue.message)
    })

    return createError({
      statusCode: 422,
      message: 'Validation failed',
      data: {
        errors: validationErrors,
        message: error.message,
      },
    })
  }

  // Standard JavaScript Error
  if (error instanceof Error) {
    return createError({
      statusCode: 500,
      message: error.message,
    })
  }

  // Unknown error type
  return createError({
    statusCode: 500,
    message: 'An unexpected error occurred',
  })
}
