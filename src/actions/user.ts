'use server'

import {currentUser} from "@clerk/nextjs/server";
import {client} from "@/lib/prisma";

/**
 * Authenticates and manages user data in the database
 * 
 * This function handles the complete user authentication flow:
 * 1. Checks if user is authenticated via Clerk
 * 2. Verifies if user exists in our database
 * 3. Creates new user record if they don't exist
 * 4. Sets up initial workspace, subscription, and studio data
 * 
 * @returns Promise with status and user data or error information
 */
export const onAuthenticateUser = async () => {
  try {
    // Step 1: Get current authenticated user from Clerk
    const user = await currentUser()
    if (!user) {
      return {status: 403}; // User not authenticated
    }
    
    // Step 2: Check if user already exists in our database
    const userExist = await client.user.findUnique({
      where: {
        clerkid: user.id, // Search by Clerk user ID
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
      },
    })
    
    // Step 3: If user exists, return their data
    if (userExist) {
      return { status: 200, user: userExist }
    }
    
    // Step 4: Create new user if they don't exist in our database
    const newUser = await client.user.create({
      data: {
        // Basic user information from Clerk
        clerkid: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        
        // Create associated studio settings
        studio: {
          create: {},
        },
        
        // Create subscription with default FREE plan
        subscription: {
          create: {},
        },
        
        // Create default personal workspace for the user
        workspace: {
          create: {
            name: `${user.firstName}'s Workspace`,
            type: 'PERSONAL',
          },
        },
      },
      include: {
        // Include workspace data for the created user
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
        // Include subscription plan information
        subscription: {
          select: {
            plan: true, // Only select the plan type
          },
        },
      },
    })
    
    // Step 5: Return the newly created user data
    if (newUser) {
      return { status: 201, user: newUser }
    }
    
    // Fallback: User creation failed
    return { status: 400, message: 'User creation failed' }
  } catch (error: any) {
    // Error handling: Return error message with 500 status
    return { status: 500, error: error.message }
  }
}