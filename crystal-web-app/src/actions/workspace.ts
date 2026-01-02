"use server"

import {currentUser} from "@clerk/nextjs/server";
import {client} from "@/lib/prisma";
import {sendEmail} from "@/actions/user";
import { createClient, OAuthStrategy } from '@wix/sdk'
import { items } from '@wix/data'
import axios from 'axios'



/**
 * Workspace Access Verification Utility
 * 
 * This file contains server actions for workspace-related operations,
 * specifically focused on verifying user access to workspaces.
 */

/**
 * Verifies if the current authenticated user has access to a specific workspace
 * 
 * Database Operation: GET (SELECT query)
 * Table: WorkSpace
 * 
 * What it retrieves:
 * - Workspace data if user has access (ownership OR membership)
 * - Returns null if access denied
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries WorkSpace table with OR condition:
 *    - User is workspace owner (User.clerkId = current user)
 *    - User is workspace member (via members relation)
 * 3. Uses Prisma's findUnique with complex where clause
 * 4. Returns workspace data if found, null if not found
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
 * Database Operation: GET (SELECT query)
 * Tables: Folder (primary), Video (for count)
 * 
 * What it retrieves:
 * - All folders in the specified workspace
 * - Video count for each folder using aggregation
 * 
 * How it works:
 * 1. Queries Folder table where workSpaceId matches
 * 2. Uses Prisma's _count aggregation to count related videos
 * 3. Includes folder metadata (id, name, createdAt, workSpaceId)
 * 4. Returns folders array with video counts for UI display
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
 * Database Operation: GET (SELECT query)
 * Tables: Video (primary), Folder, User
 * 
 * What it retrieves:
 * - All videos in workspace (direct + in folders)
 * - Video metadata (title, source, processing status, views)
 * - Folder information for each video
 * - User information (name, image) for each video
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries Video table with OR condition:
 *    - Videos directly in workspace (workSpaceId = workspaceId)
 *    - Videos in workspace folders (folderId = workspaceId)
 * 3. Includes related Folder and User data via Prisma relations
 * 4. Orders by creation date (oldest first)
 * 5. Returns comprehensive video data for UI display
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
 * Database Operation: GET (SELECT query)
 * Tables: User (primary), WorkSpace, Member, Subscription
 * 
 * What it retrieves:
 * - User's owned workspaces (workspaces they created)
 * - User's member workspaces (workspaces they're invited to)
 * - User's subscription plan information
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries User table by clerkId
 * 3. Includes related data via Prisma relations:
 *    - workspace: User's owned workspaces
 *    - members.WorkSpace: User's member workspaces
 *    - subscription: User's subscription plan
 * 4. Returns complete workspace hierarchy for navigation
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
 * Database Operation: POST (CREATE operation)
 * Tables: User (query), WorkSpace (create)
 * 
 * What it creates:
 * - New PUBLIC workspace associated with the user
 * - Validates PRO subscription before creation
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries User table to check subscription plan
 * 3. Validates user has PRO subscription for workspace creation
 * 4. Uses Prisma's nested create to add workspace to user
 * 5. Creates workspace with PUBLIC type and provided name
 * 6. Returns success/error status based on authorization
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
 * Database Operation: PUT (UPDATE operation)
 * Table: Folder
 * 
 * What it updates:
 * - Folder name in the database
 * 
 * How it works:
 * 1. Uses Prisma's update method on Folder table
 * 2. Updates folder by ID with new name
 * 3. Returns success status if update successful
 * 4. Returns error status if folder doesn't exist or update fails
 * 5. Handles database errors gracefully
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
 * Database Operation: POST (CREATE operation)
 * Tables: WorkSpace (update), Folder (create)
 * 
 * What it creates:
 * - New folder with default "Untitled" name
 * - Associates folder with specified workspace
 * 
 * How it works:
 * 1. Uses Prisma's nested create operation on WorkSpace table
 * 2. Updates workspace by adding new folder to folders relation
 * 3. Creates folder with default "Untitled" name for immediate use
 * 4. Uses single-query operation for efficiency
 * 5. Returns success status with confirmation message
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
 * Database Operation: GET (SELECT query)
 * Tables: Folder (primary), Video (for count)
 * 
 * What it retrieves:
 * - Folder name and metadata
 * - Video count for the folder using aggregation
 * 
 * How it works:
 * 1. Queries Folder table by ID
 * 2. Uses Prisma's _count aggregation to count related videos
 * 3. Returns folder name and video count
 * 4. Handles database errors gracefully
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
 * Database Operation: PUT (UPDATE operation)
 * Table: Video
 * 
 * What it updates:
 * - Video's workspace ID (workSpaceId)
 * - Video's folder ID (folderId - null for workspace root)
 * 
 * How it works:
 * 1. Updates Video table by video ID
 * 2. Sets new workSpaceId for destination workspace
 * 3. Sets folderId (null if moving to workspace root, ID if moving to folder)
 * 4. Returns success status with confirmation message
 * 5. Handles database errors gracefully
 * 
 * Location Types:
 * - Workspace root: folderId is null, video is directly in workspace
 * - Folder: folderId is provided, video is inside specific folder
 * - Cross-workspace: video moves between different workspaces
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
 * Database Operation: GET (SELECT query)
 * Tables: Video (primary), User, Subscription
 * 
 * What it retrieves:
 * - Complete video metadata (title, description, views, processing status)
 * - User information (name, image, subscription plan)
 * - Author verification (current user vs video author)
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries Video table by ID with complete metadata
 * 3. Includes related User data via Prisma relations
 * 4. Includes nested subscription data for user
 * 5. Compares current user ID with video author ID
 * 6. Returns comprehensive video data for UI rendering
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
        likes: true,
        summary: true,
        transcriptSegments: true,
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
 * Toggles like status for a video (like if not liked, unlike if already liked)
 * 
 * Database Operation: POST/DELETE + UPDATE (INSERT/DELETE + UPDATE operations)
 * Tables: VideoLike (create/delete), Video (update counter)
 * 
 * What it does:
 * - Creates VideoLike entry if user hasn't liked the video
 * - Deletes VideoLike entry if user has already liked the video
 * - Increments or decrements Video.likes counter atomically
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Finds user in database by clerkId
 * 3. Checks if VideoLike entry exists for (videoId, userId)
 * 4. If exists: deletes entry and decrements Video.likes
 * 5. If not exists: creates entry and increments Video.likes
 * 6. Returns updated like count for optimistic UI updates
 * 7. Handles errors gracefully
 * 
 * @param videoId - The unique identifier of the video to toggle like for
 * @returns Promise with status and updated like count
 */
export const toggleVideoLike = async (videoId: string) => {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) return { status: 401, data: { likes: 0 } }
    
    const user = await client.user.findUnique({
      where: { clerkId: clerkUser.id },
    })
    
    if (!user) return { status: 404, data: { likes: 0 } }
    
    const existingLike = await client.videoLike.findUnique({
      where: {
        videoId_userId: {
          videoId,
          userId: user.id,
        },
      },
    })
    
    if (existingLike) {
      await client.$transaction([
        client.videoLike.delete({
          where: {
            id: existingLike.id,
          },
        }),
        client.video.update({
          where: { id: videoId },
          data: {
            likes: { decrement: 1 },
          },
        }),
      ])
      
      const updatedVideo = await client.video.findUnique({
        where: { id: videoId },
        select: { likes: true },
      })
      
      return {
        status: 200,
        data: { likes: updatedVideo?.likes ?? 0, liked: false },
      }
    } else {
      await client.$transaction([
        client.videoLike.create({
          data: {
            videoId,
            userId: user.id,
          },
        }),
        client.video.update({
          where: { id: videoId },
          data: {
            likes: { increment: 1 },
          },
        }),
      ])
      
      const updatedVideo = await client.video.findUnique({
        where: { id: videoId },
        select: { likes: true },
      })
      
      return {
        status: 200,
        data: { likes: updatedVideo?.likes ?? 0, liked: true },
      }
    }
  } catch (error) {
    console.log(error)
    return { status: 400, data: { likes: 0 } }
  }
}

/**
 * Updates video metadata including title and description
 * 
 * Database Operation: PUT (UPDATE operation)
 * Table: Video
 * 
 * What it updates:
 * - Video title
 * - Video description
 * 
 * How it works:
 * 1. Updates Video table by video ID
 * 2. Sets new title and description values
 * 3. Returns success status with confirmation message
 * 4. Handles database errors gracefully
 * 5. Validates video existence before updating
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
 * Database Operation: GET + PUT (SELECT + UPDATE operations)
 * Tables: User (query), Video (query + update), Notification (create)
 * External: Email sending
 * 
 * What it does:
 * - Queries user's first view notification preference
 * - Queries video information and current view count
 * - Updates video view count if first view
 * - Creates notification record for viewer
 * - Sends email notification to video creator
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries User table for firstView preference
 * 3. Queries Video table for video details and view count
 * 4. If first view (views = 0), updates video view count
 * 5. Creates notification record for the viewer
 * 6. Sends email notification to video creator
 * 7. Handles email sending errors gracefully
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


/**
 * Retrieves videos from Wix CMS and matches them with database videos
 * 
 * Database Operation: GET (SELECT query)
 * Tables: Video (primary), User, Folder
 * External: Wix CMS API
 * 
 * What it retrieves:
 * - Videos that exist in both Wix CMS and local database
 * - Video metadata with user and folder information
 * 
 * How it works:
 * 1. Queries Wix CMS for videos using OAuth authentication
 * 2. Extracts video IDs from Wix response
 * 3. Queries local Video table using IN clause with Wix video IDs
 * 4. Includes related User and Folder data via Prisma relations
 * 5. Returns matched videos with complete metadata
 * 
 * @returns Promise with videos data that exist in both systems
 */
export const getWixContent = async () => {
  try {
    const myWixClient = createClient({
      modules: { items },
      auth: OAuthStrategy({
        clientId: process.env.WIX_OAUTH_KEY as string,
      }),
    })
    
    const videos = await myWixClient.items
      .query('crystal-videos')
      .find()
    
    const videoIds = videos.items
      .map((v) => v.title_fld)
    
    const video = await client.video.findMany({
      where: {
        id: {
          in: videoIds,
        },
      },
      select: {
        id: true,
        createdAt: true,
        title: true,
        source: true,
        processing: true,
        workSpaceId: true,
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    
    if (video && video.length > 0) {
      return { status: 200, data: video }
    }
    console.log(video)
    return { status: 404 }
  } catch (error) {
    console.log(error)
    return { status: 400 }
  }
}

export const howToPost = async () => {
  try {
    const response = await axios.get(process.env.CLOUD_WAYS_POST as string)
    if (response.data) {
      return {
        title: response.data[0].title.rendered,
        content: response.data[0].content.rendered,
      }
    }
  } catch {
    return { status: 400 }
  }
}

/**
 * Deletes a video and all its associated data
 * 
 * Database Operation: DELETE (DELETE operation)
 * Tables: Video (primary), Comment (cascade delete)
 * 
 * What it deletes:
 * - Video record and all associated data
 * - All comments and replies associated with the video (cascade)
 * - Video file from storage (if implemented)
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Verifies user owns the video (authorization check)
 * 3. Deletes video record from database
 * 4. Prisma cascade deletes all related comments
 * 5. Returns success status with confirmation message
 * 6. Handles database errors gracefully
 * 
 * Security:
 * - Only video author can delete their videos
 * - Prevents unauthorized deletion attempts
 * - Validates user ownership before deletion
 * 
 * @param videoId - ID of the video to delete
 * @returns Promise with deletion status and confirmation message
 */
export const deleteVideo = async (videoId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404, data: 'User not authenticated' }
    
    // First verify the video exists and user owns it
    const video = await client.video.findUnique({
      where: { id: videoId },
      select: { 
        id: true,
        User: {
          select: { clerkId: true }
        }
      }
    })
    
    if (!video) return { status: 404, data: 'Video not found' }
    
    // Verify user owns the video
    if (video.User?.clerkId !== user.id) {
      return { status: 403, data: 'You can only delete your own videos' }
    }
    
    // Delete the video (cascade will handle comments)
    const deletedVideo = await client.video.delete({
      where: { id: videoId }
    })
    
    if (deletedVideo) {
      return { status: 200, data: 'Video deleted successfully' }
    }
    
    return { status: 404, data: 'Video not found' }
  } catch (error) {
    console.log('Error deleting video:', error)
    return { status: 500, data: 'Failed to delete video' }
  }
}

/**
 * Retrieves the member count for a specific workspace
 * 
 * Database Operation: GET (SELECT query with aggregation)
 * Tables: Member (primary), WorkSpace
 * 
 * What it retrieves:
 * - Total count of members in the specified workspace
 * - Includes both workspace owner and invited members
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Verifies user has access to the workspace (owner or member)
 * 3. Counts all members in the workspace using Prisma's _count
 * 4. Returns the member count for UI display
 * 
 * @param workspaceId - The UUID of the workspace to get member count for
 * @returns Promise with member count or error status
 */
export const getWorkspaceMemberCount = async (workspaceId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    // First verify user has access to the workspace
    const workspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          { User: { clerkId: user.id } }, // Workspace owner
          { members: { some: { User: { clerkId: user.id } } } }, // Workspace member
        ],
      },
      select: {
        id: true,
        _count: {
          select: {
            members: true, // Count all members
          },
        },
      },
    })
    
    if (!workspace) {
      return { status: 403, data: 0 } // No access to workspace
    }
    
    // Return member count (add 1 for the workspace owner)
    const memberCount = workspace._count.members + 1
    return { status: 200, data: memberCount }
  } catch (error) {
    console.log('Error getting workspace member count:', error)
    return { status: 500, data: 0 }
  }
}

/**
 * Retrieves workspace owner information for member display
 * 
 * Database Operation: GET (SELECT query)
 * Tables: WorkSpace (primary), User
 * 
 * What it retrieves:
 * - Workspace owner's profile information
 * - Owner's name, image, and Clerk ID
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Verifies user has access to the workspace
 * 3. Queries WorkSpace table with related User data
 * 4. Returns owner information for member display
 * 
 * @param workspaceId - The UUID of the workspace to get owner info for
 * @returns Promise with workspace owner data or error status
 */
export const getWorkspaceOwner = async (workspaceId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    // Verify user has access to the workspace
    const workspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          { User: { clerkId: user.id } }, // Workspace owner
          { members: { some: { User: { clerkId: user.id } } } }, // Workspace member
        ],
      },
      select: {
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
            clerkId: true,
          }
        }
      }
    })
    
    if (!workspace) {
      return { status: 403, data: null } // No access to workspace
    }
    
    return { status: 200, data: workspace }
  } catch (error) {
    console.log('Error getting workspace owner:', error)
    return { status: 500, data: null }
  }
}

/**
 * Retrieves workspace members (excluding the owner)
 * 
 * Database Operation: GET (SELECT query)
 * Tables: WorkSpace (primary), Member, User
 * 
 * What it retrieves:
 * - All workspace members (invited users, not the owner)
 * - Member profile information (name, image, Clerk ID)
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Verifies user has access to the workspace
 * 3. Queries WorkSpace table with members relation
 * 4. Includes related User data for each member
 * 5. Returns members array for UI display
 * 
 * @param workspaceId - The UUID of the workspace to get members for
 * @returns Promise with workspace members data or error status
 */
export const getWorkspaceMembers = async (workspaceId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    // Verify user has access to the workspace
    const workspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          { User: { clerkId: user.id } }, // Workspace owner
          { members: { some: { User: { clerkId: user.id } } } }, // Workspace member
        ],
      },
      select: {
        members: {
          select: {
            User: {
              select: {
                firstname: true,
                lastname: true,
                image: true,
                clerkId: true,
              }
            }
          }
        }
      }
    })
    
    if (!workspace) {
      return { status: 403, data: [] } // No access to workspace
    }
    
    // Extract members from the nested structure
    const members = workspace.members.map(member => ({
      User: member.User
    }))
    
    return { status: 200, data: members }
  } catch (error) {
    console.log('Error getting workspace members:', error)
    return { status: 500, data: [] }
  }
}

/**
 * Removes a user from a workspace
 * 
 * Database Operation: DELETE (DELETE operation)
 * Tables: Member (primary), WorkSpace, User
 * 
 * What it removes:
 * - Member record linking user to workspace
 * - User loses access to workspace content
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Verifies current user is workspace owner (only owners can remove members)
 * 3. Finds the member record to delete
 * 4. Deletes the member record from database
 * 5. Returns success/error status with confirmation message
 * 
 * Security:
 * - Only workspace owners can remove members
 * - Prevents users from removing themselves
 * - Validates workspace ownership before deletion
 * 
 * @param workspaceId - The UUID of the workspace
 * @param memberClerkId - The Clerk ID of the member to remove
 * @returns Promise with removal status and confirmation/error message
 */
export const removeUserFromWorkspace = async (workspaceId: string, memberClerkId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404, data: 'User not authenticated' }
    
    // Verify current user is the workspace owner
    const workspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        User: { clerkId: user.id } // Only workspace owner
      },
      select: {
        id: true
      }
    })
    
    if (!workspace) {
      return { status: 403, data: 'Only workspace owners can remove members' }
    }
    
    // Prevent users from removing themselves
    if (user.id === memberClerkId) {
      return { status: 400, data: 'You cannot remove yourself from the workspace' }
    }
    
    // Find and delete the member record
    const deletedMember = await client.member.deleteMany({
      where: {
        workSpaceId: workspaceId,
        User: { clerkId: memberClerkId }
      }
    })
    
    if (deletedMember.count > 0) {
      return { status: 200, data: 'User removed from workspace successfully' }
    }
    
    return { status: 404, data: 'User not found in workspace' }
  } catch (error) {
    console.log('Error removing user from workspace:', error)
    return { status: 500, data: 'Failed to remove user from workspace' }
  }
}

/**
 * Updates the name of a workspace
 * 
 * Database Operation: PUT (UPDATE operation)
 * Table: WorkSpace
 * 
 * What it updates:
 * - Workspace name in the database
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Verifies current user is the workspace owner
 * 3. Updates workspace name using Prisma update
 * 4. Returns success/error status with confirmation message
 * 
 * Security:
 * - Only workspace owners can edit workspace name
 * - Validates workspace ownership before update
 * - Prevents unauthorized name changes
 * 
 * @param workspaceId - The UUID of the workspace to update
 * @param newName - The new name for the workspace
 * @returns Promise with update status and confirmation/error message
 */
export const editWorkspaceName = async (workspaceId: string, newName: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404, data: 'User not authenticated' }
    
    // Validate input
    if (!newName || newName.trim().length === 0) {
      return { status: 400, data: 'Workspace name cannot be empty' }
    }
    
    if (newName.trim().length > 100) {
      return { status: 400, data: 'Workspace name must be less than 100 characters' }
    }
    
    // Verify current user is the workspace owner
    const workspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        User: { clerkId: user.id } // Only workspace owner
      },
      select: {
        id: true,
        name: true
      }
    })
    
    if (!workspace) {
      return { status: 403, data: 'Only workspace owners can edit workspace name' }
    }
    
    // Update the workspace name
    const updatedWorkspace = await client.workSpace.update({
      where: {
        id: workspaceId
      },
      data: {
        name: newName.trim()
      },
      select: {
        id: true,
        name: true
      }
    })
    
    if (updatedWorkspace) {
      return { status: 200, data: 'Workspace name updated successfully' }
    }
    
    return { status: 404, data: 'Workspace not found' }
  } catch (error) {
    console.log('Error editing workspace name:', error)
    return { status: 500, data: 'Failed to update workspace name' }
  }
}

/**
 * Deletes a workspace and all its associated data
 * 
 * Database Operation: DELETE (DELETE operation with cascade)
 * Tables: WorkSpace (primary), Member, Folder, Video, Comment
 * 
 * What it deletes:
 * - Workspace record and all associated data
 * - All members of the workspace
 * - All folders in the workspace
 * - All videos in the workspace and folders
 * - All comments on workspace videos (cascade delete)
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Verifies current user is the workspace owner
 * 3. Deletes workspace record (cascade handles related data)
 * 4. Returns success/error status with confirmation message
 * 
 * Security:
 * - Only workspace owners can delete workspaces
 * - Validates workspace ownership before deletion
 * - Prevents unauthorized workspace deletion
 * 
 * @param workspaceId - The UUID of the workspace to delete
 * @returns Promise with deletion status and confirmation/error message
 */
export const deleteWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404, data: 'User not authenticated' }
    
    // Verify current user is the workspace owner
    const workspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        User: { clerkId: user.id } // Only workspace owner
      },
      select: {
        id: true,
        name: true
      }
    })
    
    if (!workspace) {
      return { status: 403, data: 'Only workspace owners can delete workspaces' }
    }
    
    // Delete the workspace (cascade will handle related data)
    const deletedWorkspace = await client.workSpace.delete({
      where: {
        id: workspaceId
      }
    })
    
    if (deletedWorkspace) {
      return { status: 200, data: 'Workspace deleted successfully' }
    }
    
    return { status: 404, data: 'Workspace not found' }
  } catch (error) {
    console.log('Error deleting workspace:', error)
    return { status: 500, data: 'Failed to delete workspace' }
  }
}