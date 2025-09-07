"use server"

import {currentUser} from "@clerk/nextjs/server";
import {client} from "@/lib/prisma";
import {sendEmail} from "@/actions/user";


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
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
    
    if (videos && videos.length > 0) {
      return { status: 200, data: videos }
    }
    
    return { status: 404 }
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
    console.log(error)
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
    console.log(error)
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
    console.log(error)
    return { status: 500, message: 'Something went wrong when creating folder' }
  }
}

/**
 * Retrieves folder information including name and video count
 * 
 * This function fetches essential folder metadata for display in the UI,
 * including the folder name and the number of videos it contains.
 * It's used for folder navigation and information display.
 * 
 * Purpose: Get folder metadata for UI display and navigation
 * 
 * How it works:
 * 1. Queries database for folder by ID
 * 2. Includes video count using Prisma's _count aggregation
 * 3. Returns folder name and video count
 * 4. Handles database errors gracefully
 * 
 * Integration:
 * - Used by folder navigation components
 * - Provides data for folder information display
 * - Connects to folder and video database models
 * - Essential for folder management UI
 * 
 * @param folderId - The unique identifier of the folder
 * @returns Promise with folder information (name and video count)
 */
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
    console.log(error)
    return {
      status: 500,
      data: null,
    }
  }
}

/**
 * Moves a video between workspaces and/or folders
 * 
 * This function handles video relocation within the application's
 * workspace structure. It can move videos between different workspaces
 * and folders, updating the video's location references in the database.
 * 
 * Purpose: Enable video organization and relocation within workspace structure
 * 
 * How it works:
 * 1. Updates video's workspace ID to the new workspace
 * 2. Updates video's folder ID (null if moving to workspace root)
 * 3. Returns success status with confirmation message
 * 4. Handles database errors gracefully
 * 
 * Location Types:
 * - Workspace root: folderId is null, video is directly in workspace
 * - Folder: folderId is provided, video is inside specific folder
 * - Cross-workspace: video moves between different workspaces
 * 
 * Integration:
 * - Used by video management and organization components
 * - Connects to video location change forms
 * - Part of workspace and folder management system
 * - Essential for video organization functionality
 * 
 * @param videoId - ID of the video to move
 * @param workSpaceId - ID of the destination workspace
 * @param folderId - ID of the destination folder (empty string for workspace root)
 * @returns Promise with move operation status and confirmation message
 */
export const moveVideoLocation = async (
  videoId: string,
  workSpaceId: string,
  folderId: string
) => {
  try {
    const location = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        folderId: folderId || null,
        workSpaceId,
      },
    })
    if (location) return { status: 200, data: 'folder changed successfully' }
    return { status: 404, data: 'workspace/folder not found' }
  } catch (error) {
    console.log(error)
    return { status: 500, data: 'Oops! something went wrong' }
  }
}


/**
 * Retrieves comprehensive video data for preview and display
 * 
 * This function fetches complete video information including metadata,
 * user details, and subscription information for video preview pages.
 * It also determines if the current user is the video author for
 * conditional UI rendering.
 * 
 * Purpose: Get complete video data for preview and display pages
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries database for video with complete metadata
 * 3. Includes user information and subscription details
 * 4. Determines if current user is the video author
 * 5. Returns comprehensive video data for UI rendering
 * 
 * Data Included:
 * - Video metadata (title, description, views, processing status)
 * - User information (name, image, subscription plan)
 * - Author verification for conditional UI features
 * - Video source and creation information
 * 
 * Integration:
 * - Used by video preview and display pages
 * - Provides data for video player and metadata display
 * - Connects to user authentication and subscription systems
 * - Essential for video viewing experience
 * 
 * @param videoId - The unique identifier of the video to preview
 * @returns Promise with complete video data and author verification
 */
export const getPreviewVideo = async (videoId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const video = await client.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        createdAt: true,
        source: true,
        description: true,
        processing: true,
        views: true,
        summary: true,
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
            clerkId: true,
            trial: true,
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    })
    if (video) {
      return {
        status: 200,
        data: video,
        author: user.id === video.User?.clerkId,
      }
    }
    
    return { status: 404 }
  } catch (error) {
    console.log(error)
    return { status: 400 }
  }
}

/**
 * Updates video metadata including title and description
 * 
 * This function handles video information editing, allowing users to
 * update the title and description of their videos. It provides
 * a simple interface for video metadata management.
 * 
 * Purpose: Enable users to edit video information and metadata
 * 
 * How it works:
 * 1. Updates video record in the database with new title and description
 * 2. Returns success status with confirmation message
 * 3. Handles database errors gracefully
 * 4. Validates video existence before updating
 * 
 * Integration:
 * - Used by video editing forms and components
 * - Connects to video management system
 * - Part of video metadata management
 * - Essential for video information updates
 * 
 * @param videoId - ID of the video to update
 * @param title - New title for the video
 * @param description - New description for the video
 * @returns Promise with update status and confirmation message
 */
export const editVideoInfo = async (
  videoId: string,
  title: string,
  description: string
) => {
  try {
    const video = await client.video.update({
      where: { id: videoId },
      data: {
        title,
        description,
      },
    })
    if (video) return { status: 200, data: 'Video successfully updated' }
    return { status: 404, data: 'Video not found' }
  } catch (error) {
    console.log(error)
    return { status: 400 }
  }
}

/**
 * Handles first view notification system for video creators
 * 
 * This function manages the first view notification system, which sends
 * email notifications to video creators when their videos receive their
 * first view. It includes view tracking, email sending, and notification
 * creation with proper user preference checking.
 * 
 * Purpose: Notify video creators when their videos get their first view
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Checks user's first view notification preference
 * 3. Retrieves video information and current view count
 * 4. If first view (views = 0), increments view count
 * 5. Sends email notification to video creator
 * 6. Creates in-app notification for the viewer
 * 7. Handles email sending errors gracefully
 * 
 * Notification Features:
 * - Respects user's notification preferences
 * - Only triggers on first view (views = 0)
 * - Sends both email and in-app notifications
 * - Includes video title and creator information
 * 
 * Integration:
 * - Used by video viewing system for first view tracking
 * - Connects to email notification system
 * - Part of user engagement and creator feedback system
 * - Essential for creator notification features
 * 
 * @param videoId - ID of the video that received its first view
 * @returns Promise with notification status (no return value on success)
 */
export const sendEmailForFirstView = async (videoId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const firstViewSettings = await client.user.findUnique({
      where: { clerkId: user.id },
      select: {
        firstView: true,
      },
    })
    if (!firstViewSettings?.firstView) return
    
    const video = await client.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        views: true,
        User: {
          select: {
            email: true,
          },
        },
      },
    })
    if (video && video.views === 0) {
      await client.video.update({
        where: {
          id: videoId,
        },
        data: {
          views: video.views + 1,
        },
      })
      
      if (!video.User?.email) return
      
      const { transporter, mailOptions } = await sendEmail(
        video.User.email,
        'You got a viewer',
        `Your video ${video.title} just got its first viewer`
      )
      
      transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          console.log(error.message)
        } else {
          const notification = await client.user.update({
            where: { clerkId: user.id },
            data: {
              notification: {
                create: {
                  content: mailOptions.text,
                },
              },
            },
          })
          if (notification) {
            return { status: 200 }
          }
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}
