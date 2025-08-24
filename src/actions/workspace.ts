"use server"

import {currentUser} from "@clerk/nextjs/server";
import {client} from "@/lib/prisma";

/**
 * Workspace Access Verification Utility
 * 
 * This file contains server actions for workspace-related operations,
 * specifically focused on verifying user access to workspaces.
 */

/**
 * Verifies if the current authenticated user has access to a specific workspace
 * 
 * This function performs workspace access verification:
 * 1. Gets current authenticated user from Clerk
 * 2. Checks if user is the workspace owner/creator
 * 3. Checks if user is a member of the workspace (for public workspaces)
 * 4. Uses OR condition to allow either ownership or membership
 * 5. Returns workspace data if access granted, null if denied
 * 
 * @param workspaceId - The UUID of the workspace to check access for
 * @returns Promise with status and workspace data or access denied
 */
export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 403 }
    
    // Check workspace access (ownership OR membership)
    const isUserInWorkspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          { User: { clerkId: user.id } }, // Workspace owner
          { members: { every: { User: { clerkId: user.id } } } }, // Workspace member
        ],
      },
    })
    
    return {
      status: 200,
      data: {workspace: isUserInWorkspace},
    }
  } catch (error) {
    console.log(error)
    return {
      status: 403,
      data: {workspace: null},
    }
  }
}


/**
 * Retrieves all folders within a specific workspace
 * 
 * This function fetches workspace folders with video counts:
 * 1. Queries database for all folders in the specified workspace
 * 2. Includes video count for each folder using _count aggregation
 * 3. Returns folders array with video counts for UI display
 * 4. Returns empty array if no folders found
 * 
 * @param workSpaceId - The workspace ID to fetch folders for
 * @returns Promise with folders data or empty array
 */
export const getWorkspaceFolders = async (workSpaceId: string) => {
  try {
    const isFolders = await client.folder.findMany({
      where: { workSpaceId },
      include: {
        _count: { select: { videos: true } }, // Include video count
      },
    })
    
    return isFolders && isFolders.length > 0 
      ? { status: 200, data: isFolders }
      : { status: 404, data: [] }
  } catch (error) {
    console.log(error);
    return { status: 403, data: [] }
  }
}


/**
 * Retrieves all videos in a workspace (both direct and in folders)
 * 
 * This function fetches comprehensive video data for a workspace:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries videos using OR condition to find:
 *    - Videos directly in the workspace
 *    - Videos inside workspace folders
 * 3. Includes folder and user information for each video
 * 4. Orders videos by creation date (oldest first)
 * 5. Returns videos with complete metadata for UI display
 * 
 * @param workSpaceId - The workspace ID to fetch videos for
 * @returns Promise with videos data or 404 if none found
 */
export const getAllUserVideos = async (workSpaceId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    const videos = await client.video.findMany({
      where: {
        OR: [
          { workSpaceId },      // Direct workspace videos
          { folderId: workSpaceId } // Folder videos
        ],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        Folder: { select: { id: true, name: true } },
        User: { select: { firstname: true, lastname: true, image: true } },
      },
      orderBy: { createdAt: 'asc' },
    })
    
    return videos && videos.length > 0 
      ? { status: 200, data: videos }
      : { status: 404 }
  } catch (error) {
    console.log(error)
    return { status: 400 }
  }
}

/**
 * Retrieves all workspaces for the current user (owned + member of)
 * 
 * This function fetches comprehensive workspace data for the user:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries user's owned workspaces (workspaces they created)
 * 3. Queries user's member workspaces (workspaces they're invited to)
 * 4. Includes subscription plan information
 * 5. Returns complete workspace hierarchy for navigation
 * 
 * @returns Promise with user's workspaces and subscription data
 */
export const getWorkSpaces = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    const workspaces = await client.user.findUnique({
      where: { clerkId: user.id },
      select: {
        subscription: { select: { plan: true } },
        workspace: { select: { id: true, name: true, type: true } }, // User's workspaces
        members: { 
          select: { 
            WorkSpace: { select: { id: true, name: true, type: true } } 
          } 
        }, // Member workspaces
      },
    })
    
    return workspaces ? { status: 200, data: workspaces } : { status: 404 }
  } catch (error) {
    console.log(error)
    return { status: 400 }
  }
}