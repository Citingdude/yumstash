import type { FetchError } from 'ofetch'

export interface AppError {
  message: string
  statusCode?: number
  validationErrors?: Record<string, string[]>
}

/**
 * Composable for handling API errors consistently across the application.
 * Extracts error information from various error types (FetchError, Error, unknown).
 */
export function useApiError() {
  /**
   * Extracts error information from various error types
   * @param error - The caught error
   * @returns Normalized error information
   */
  const extractError = (error: unknown): AppError => {
    // Nuxt FetchError (from $fetch)
    if (isFetchError(error)) {
      return {
        message: error.data?.message || error.message || 'Request failed',
        statusCode: error.statusCode,
        validationErrors: error.data?.errors,
      }
    }

    // Standard Error
    if (error instanceof Error) {
      return {
        message: error.message,
      }
    }

    // Unknown error
    return {
      message: 'An unexpected error occurred',
    }
  }

  return {
    extractError,
  }
}

/**
 * Type guard to check if an error is a FetchError
 */
function isFetchError(error: unknown): error is FetchError {
  return typeof error === 'object'
    && error !== null
    && 'statusCode' in error
}
