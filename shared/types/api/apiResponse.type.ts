/**
 * Standard success response structure for API endpoints.
 * @template T - The type of data being returned (if any)
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data?: T
  message?: string
}

/**
 * Standard error response structure for API endpoints.
 */
export interface ApiErrorResponse {
  success: false
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

/**
 * Union type for all API responses.
 * @template T - The type of data being returned on success
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse
