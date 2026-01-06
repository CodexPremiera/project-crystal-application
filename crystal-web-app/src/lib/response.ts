/**
 * Response Factory Functions
 * 
 * Standardized response creators for server actions. These provide
 * consistent response structures across all server actions while
 * reducing boilerplate and ensuring type safety.
 * 
 * Benefits:
 * - Consistent response structure across all actions
 * - Type-safe status codes
 * - Reduced boilerplate in action functions
 * - Easy to modify response format globally
 */

export type SuccessResponse<T> = {
  status: 200
  data: T
}

export type CreatedResponse<T> = {
  status: 201
  data: T
}

export type ErrorResponse = {
  status: 400 | 403 | 404 | 500
  error?: string
  data?: undefined
}

export type ActionResponse<T> = SuccessResponse<T> | CreatedResponse<T> | ErrorResponse

/**
 * Creates a success response (200 OK)
 * 
 * @param data - The data to return
 * @returns Success response with status 200
 */
export const success = <T>(data: T): SuccessResponse<T> => ({
  status: 200,
  data,
})

/**
 * Creates a created response (201 Created)
 * 
 * @param data - The created resource data
 * @returns Created response with status 201
 */
export const created = <T>(data: T): CreatedResponse<T> => ({
  status: 201,
  data,
})

/**
 * Creates a not found response (404 Not Found)
 * 
 * @param message - Optional error message
 * @returns Not found response with status 404
 */
export const notFound = (message?: string): ErrorResponse => ({
  status: 404,
  error: message || 'Resource not found',
})

/**
 * Creates an unauthorized response (403 Forbidden)
 * 
 * @param message - Optional error message
 * @returns Forbidden response with status 403
 */
export const forbidden = (message?: string): ErrorResponse => ({
  status: 403,
  error: message || 'Access denied',
})

/**
 * Creates a bad request response (400 Bad Request)
 * 
 * @param message - Optional error message
 * @returns Bad request response with status 400
 */
export const badRequest = (message?: string): ErrorResponse => ({
  status: 400,
  error: message || 'Bad request',
})

/**
 * Creates a server error response (500 Internal Server Error)
 * 
 * @param error - The error object or message
 * @returns Server error response with status 500
 */
export const serverError = (error?: unknown): ErrorResponse => ({
  status: 500,
  error: error instanceof Error ? error.message : 'Internal server error',
})

/**
 * Checks if response is successful (status 200 or 201)
 * 
 * @param response - The action response to check
 * @returns True if response is successful
 */
export const isSuccess = <T>(
  response: ActionResponse<T>
): response is SuccessResponse<T> | CreatedResponse<T> => {
  return response.status === 200 || response.status === 201
}

/**
 * Checks if response is an error
 * 
 * @param response - The action response to check
 * @returns True if response is an error
 */
export const isError = <T>(
  response: ActionResponse<T>
): response is ErrorResponse => {
  return response.status >= 400
}

