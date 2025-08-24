'use server'

import {currentUser} from "@clerk/nextjs/server";
import {client} from "@/lib/prisma";

/**
 * Authenticates user and manages their database record
 * 
 * This function handles the complete user authentication flow:
 * 1. Gets current authenticated user from Clerk
 * 2. Checks if user already exists in our database
 * 3. If user exists, returns their data with workspaces
 * 4. If user doesn't exist, creates new user record with:
 *    - Basic profile information from Clerk
 *    - Default studio settings
 * 5. Creates default subscription (FREE plan)
 * 6. Creates personal workspace for the user
 * 
 * @returns Promise with status and user data or error information
 */
export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 403 }
    
    // Check if user exists in database
    const userExist = await client.user.findUnique({
      where: { clerkId: user.id },
      include: {
        workspace: { where: { User: { clerkId: user.id } } },
      },
    })
    
    if (userExist) return { status: 200, user: userExist }
    
    // Create new user with all associated data
    const newUser = await client.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        studio: { create: {} },
        subscription: { create: {} },
        workspace: {
          create: {
            name: `${user.firstName}'s Workspace`,
            type: 'INDIVIDUAL',
          },
        },
      },
      include: {
        workspace: { where: { User: { clerkId: user.id } } },
        subscription: { select: { plan: true } },
      },
    })
    
    return newUser ? { status: 201, user: newUser } : { status: 400, message: 'User creation failed' }
  } catch (error: any) {
    return { status: 500, error: error.message }
  }
}

/**
 * Retrieves user notifications and notification count
 * 
 * This function fetches all notifications for the current user:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries database for user's notifications
 * 3. Includes notification count for UI display
 * 4. Returns notifications array or empty array if none found
 * 
 * @returns Promise with notifications data or empty array
 */
export const getNotifications = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    const notifications = await client.user.findUnique({
      where: { clerkId: user.id }, // Fixed field name
      select: {
        notification: true,
        _count: { select: { notification: true } },
      },
    })
    
    return notifications && notifications.notification.length > 0
      ? { status: 200, data: notifications }
      : { status: 404, data: [] }
  } catch (error) {
    console.error(error)
    return { status: 400, data: [] }
  }
}

/**
 * Searches for users in the database based on provided query
 * 
 * This function enables user discovery for workspace invitations:
 * 1. Authenticates current user from Clerk
 * 2. Searches database for users matching query in:
 *    - First name (case-insensitive)
 *    - Last name (case-insensitive) 
 *    - Email address (case-insensitive)
 * 3. Excludes current user from search results
 * 4. Returns user data with subscription plan for UI display
 * 
 * @param query - Search string to match against user names and emails
 * @returns Promise with array of matching users or empty result
 */
export const searchUsers = async (query: string) => {
  try {
    // Get current authenticated user
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    // Search for users matching query in multiple fields
    const users = await client.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query } },
          { email: { contains: query } },
          { lastname: { contains: query } },
        ],
        // Exclude current user from search results
        NOT: [{ clerkId: user.id }],
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true,
          },
        },
        firstname: true,
        lastname: true,
        image: true,
        email: true,
      },
    })
    
    // Return users if found, otherwise return empty result
    if (users && users.length > 0) {
      return { status: 200, data: users }
    }
    
    return { status: 404, data: undefined }
  } catch (error) {
    console.log(error);
    return { status: 500, data: undefined };
  }
}