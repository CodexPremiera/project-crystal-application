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
    return { status: 400, data: [] }
  }
}