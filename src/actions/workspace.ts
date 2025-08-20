"use server"

import {currentUser} from "@clerk/nextjs/server";
import {client} from "@/lib/prisma";

/**
 * Workspace Access Verification Utility
 * 
 * This file contains server actions for workspace-related operations,
 * specifically focused on verifying user access to workspaces.
 *
 * Verifies if the current authenticated user has access to a specific workspace
 * 
 * This function checks two types of access:
 * 1. Direct ownership: User is the creator/owner of the workspace
 * 2. Membership: User is a member of the workspace (for team workspaces)
 * 
 * @param workspaceId - The UUID of the workspace to check access for
 * @returns Promise with status and workspace data or access denied
 */
export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    // Step 1: Get current authenticated user from Clerk
    const user = await currentUser()
    if (!user) return { status: 403 }
    
    // Step 2: Check if user has access to the workspace
    // This query checks for two types of access:
    // - Direct ownership: User is the creator of the workspace
    // - Membership: User is a member of the workspace (for team workspaces)
    const isUserInWorkspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            // Check if user is the workspace owner/creator
            User: {
              clerkId: user.id,
            },
          },
          {
            // Check if user is a member of the workspace
            members: {
              every: {
                User: {
                  clerkId: user.id,
                },
              },
            },
          },
        ],
      },
    })
    
    // Step 3: Return access verification result
    return {
      status: 200,
      data: {workspace: isUserInWorkspace},
    }
  } catch (error) {
    // Step 4: Handle errors - deny access on any database/query errors
    console.log(error)
    return {
      status: 403,
      data: {workspace: null},
    }
  }
}