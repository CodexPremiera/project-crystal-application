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

/**
 * Creates a new workspace for the current authenticated user
 * 
 * This function handles workspace creation with subscription validation:
 * 1. Gets current authenticated user from Clerk
 * 2. Validates user has PRO subscription plan for workspace creation
 * 3. Creates new PUBLIC workspace associated with the user
 * 4. Returns success status with confirmation message
 * 5. Returns unauthorized status if user doesn't have PRO plan
 * 
 * @param name - The name for the new workspace
 * @returns Promise with creation status and confirmation/error message
 */
export const createWorkspace = async (name: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const authorized = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })
    
    if (authorized?.subscription?.plan === 'PRO') {
      const workspace = await client.user.update({
        where: {
          clerkId: user.id,
        },
        data: {
          workspace: {
            create: {
              name,
              type: 'PUBLIC',
            },
          },
        },
      })
      if (workspace) {
        return { status: 201, data: 'Workspace Created' }
      }
    }
    return {
      status: 401,
      data: 'You are not authorized to create a workspace.',
    }
  } catch (error) {
    return { status: 400 }
  }
}

/**
 * Renames an existing folder within a workspace
 * 
 * This function handles folder renaming operations:
 * 1. Updates the folder name in the database using the provided folder ID
 * 2. Returns success status with confirmation message if update successful
 * 3. Returns error status if folder doesn't exist or update fails
 * 4. Handles database errors gracefully with appropriate error messages
 * 
 * @param folderId - The unique identifier of the folder to rename
 * @param name - The new name for the folder
 * @returns Promise with update status and confirmation/error message
 */
export const renameFolders = async (folderId: string, name: string) => {
  try {
    const folder = await client.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name,
      },
    })
    if (folder) {
      return { status: 200, data: 'Folder Renamed' }
    }
    return { status: 400, data: 'Folder does not exist' }
  } catch (error) {
    return { status: 500, data: 'Opps! something went wrong' }
  }
}


/**
 * Creates a new folder within a specified workspace
 * 
 * This server action handles folder creation in the database:
 * 1. Uses Prisma's nested create operation to add a folder to the workspace
 * 2. Creates folder with default "Untitled" name for immediate use
 * 3. Returns success status with confirmation message if creation succeeds
 * 4. Handles database errors gracefully with appropriate error responses
 * 
 * Purpose: Provide a server-side function for creating folders that can be
 * called from client components through React Query mutations.
 * 
 * How it works:
 * - Updates the workspace record by adding a new folder to its folders relation
 * - Uses Prisma's nested create syntax for efficient single-query operation
 * - Returns standardized response format for consistent error handling
 * - Integrates with the useCreateFolders hook for complete folder creation flow
 * 
 * @param workspaceId - The UUID of the workspace where the folder will be created
 * @returns Promise with creation status and confirmation/error message
 */
export const createFolder = async (workspaceId: string) => {
  try {
    // Create new folder within the specified workspace using nested create
    const isNewFolder = await client.workSpace.update({
      where: {
        id: workspaceId,
      },
      data: {
        folders: {
          create: { name: 'Untitled' }, // Create folder with default name
        },
      },
    })
    
    // Return success response if folder creation was successful
    if (isNewFolder) {
      return { status: 200, message: 'New Folder Created' }
    }
  } catch (error) {
    // Handle database errors and return appropriate error response
    return { status: 500, message: 'Something went wrong when creating folder' }
  }
}

export const getFolderInfo = async (folderId: string) => {
  try {
    const folder = await client.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        name: true,
        _count: {
          select: {
            videos: true,
          },
        },
      },
    })
    if (folder)
      return {
        status: 200,
        data: folder,
      }
    return {
      status: 400,
      data: null,
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
    }
  }
}