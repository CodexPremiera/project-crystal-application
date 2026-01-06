/**
 * Server Action Helpers
 * 
 * Common utility functions for server actions that handle authentication,
 * error handling, and database user retrieval. These helpers reduce
 * boilerplate and ensure consistent behavior across all server actions.
 */

import { currentUser } from "@clerk/nextjs/server"
import { client } from "@/lib/prisma"
import { 
  ActionResponse, 
  success, 
  forbidden, 
  notFound, 
  serverError 
} from "@/lib/response"

export type ClerkUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>

export type DbUser = {
  id: string
  clerkId: string
  email: string
  firstname: string | null
  lastname: string | null
  image: string | null
}

/**
 * Wraps a server action handler with authentication check
 * 
 * Automatically handles:
 * - Getting the current Clerk user
 * - Returning 403 if not authenticated
 * - Catching and logging errors
 * - Returning consistent error responses
 * 
 * @param handler - The async function to execute if authenticated
 * @returns Promise with ActionResponse
 * 
 * @example
 * export const getNotifications = async () => {
 *   return withAuth(async (clerkUser) => {
 *     const notifications = await client.notification.findMany({
 *       where: { userId: clerkUser.id }
 *     })
 *     return notifications
 *   })
 * }
 */
export async function withAuth<T>(
  handler: (clerkUser: ClerkUser) => Promise<T>
): Promise<ActionResponse<T>> {
  try {
    const user = await currentUser()
    if (!user) {
      return forbidden('Authentication required')
    }
    
    const result = await handler(user)
    return success(result)
  } catch (error) {
    console.error('[Server Action Error]:', error)
    return serverError(error)
  }
}

/**
 * Wraps a server action handler with authentication and database user check
 * 
 * Automatically handles:
 * - Getting the current Clerk user
 * - Fetching the corresponding database user
 * - Returning 403 if not authenticated
 * - Returning 404 if database user not found
 * - Catching and logging errors
 * 
 * @param handler - The async function to execute with both users
 * @returns Promise with ActionResponse
 * 
 * @example
 * export const updateProfile = async (data: ProfileData) => {
 *   return withDbUser(async (clerkUser, dbUser) => {
 *     const updated = await client.user.update({
 *       where: { id: dbUser.id },
 *       data
 *     })
 *     return updated
 *   })
 * }
 */
export async function withDbUser<T>(
  handler: (clerkUser: ClerkUser, dbUser: DbUser) => Promise<T>
): Promise<ActionResponse<T>> {
  try {
    const user = await currentUser()
    if (!user) {
      return forbidden('Authentication required')
    }
    
    const dbUser = await client.user.findUnique({
      where: { clerkId: user.id },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstname: true,
        lastname: true,
        image: true,
      },
    })
    
    if (!dbUser) {
      return notFound('User not found in database')
    }
    
    const result = await handler(user, dbUser)
    return success(result)
  } catch (error) {
    console.error('[Server Action Error]:', error)
    return serverError(error)
  }
}

/**
 * Gets the database user ID for the current authenticated user
 * 
 * Useful when you only need the user ID for a query.
 * 
 * @returns Promise with the database user ID or null
 */
export async function getCurrentDbUserId(): Promise<string | null> {
  try {
    const user = await currentUser()
    if (!user) return null
    
    const dbUser = await client.user.findUnique({
      where: { clerkId: user.id },
      select: { id: true },
    })
    
    return dbUser?.id || null
  } catch (error) {
    console.error('[getCurrentDbUserId Error]:', error)
    return null
  }
}

/**
 * Gets full database user for the current authenticated user
 * 
 * @returns Promise with the database user or null
 */
export async function getCurrentDbUser(): Promise<DbUser | null> {
  try {
    const user = await currentUser()
    if (!user) return null
    
    const dbUser = await client.user.findUnique({
      where: { clerkId: user.id },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstname: true,
        lastname: true,
        image: true,
      },
    })
    
    return dbUser
  } catch (error) {
    console.error('[getCurrentDbUser Error]:', error)
    return null
  }
}

/**
 * Executes a handler with error catching and consistent response
 * 
 * Use this when you don't need authentication but want
 * consistent error handling.
 * 
 * @param handler - The async function to execute
 * @returns Promise with ActionResponse
 */
export async function withErrorHandling<T>(
  handler: () => Promise<T>
): Promise<ActionResponse<T>> {
  try {
    const result = await handler()
    return success(result)
  } catch (error) {
    console.error('[Server Action Error]:', error)
    return serverError(error)
  }
}

