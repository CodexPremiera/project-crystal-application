'use server'


import { client } from "@/lib/prisma";
import { onAuthenticateUser } from './user'

/**
 * Search Server Actions
 * 
 * This file contains server actions for searching across workspaces, folders, and videos.
 * All search operations are performed on the server side for security and performance.
 */

export interface SearchResult {
  id: string
  name: string
  type: 'workspace' | 'folder' | 'video'
  workspaceId?: string
  workspaceName?: string
  folderId?: string
  folderName?: string
  createdAt: Date
  description?: string
  videoData?: {
    id: string
    title: string | null
    source: string
    createdAt: Date
    workSpaceId: string | null
    folderId: string | null
    processing: boolean
    User: {
      firstname: string | null
      lastname: string | null
      image: string | null
    } | null
    Folder: {
      id: string
      name: string
    } | null
  }
}

export interface SearchResponse {
  status: number
  data?: SearchResult[]
  message?: string
}

/**
 * Search across workspaces, folders, and videos
 * 
 * This function performs a comprehensive search across all user-accessible content
 * including workspaces, folders, and videos. It searches for items that contain
 * the query string in their name or description.
 * 
 * Security Features:
 * - User authentication required
 * - Only searches user's own workspaces and accessible content
 * - Filters results based on user permissions
 * 
 * Search Scope:
 * - Workspaces: User's owned workspaces and workspaces they're a member of
 * - Folders: Folders within accessible workspaces
 * - Videos: Videos within accessible workspaces
 * 
 * @param query - Search query string
 * @returns Promise<SearchResponse> - Search results with status and data
 */
export const searchContent = async (query: string): Promise<SearchResponse> => {
  try {
    // Authenticate user
    const auth = await onAuthenticateUser()
    if (!auth.user) {
      return { status: 401, message: 'Unauthorized' }
    }

    if (!query || query.trim().length === 0) {
      return { status: 400, message: 'Query is required' }
    }

    const searchQuery = query.trim()

    // Get user's accessible workspaces
    const userWorkspaces = await client.workSpace.findMany({
      where: {
        OR: [
          { userId: auth.user.id }, // User's owned workspaces
          { 
            members: {
              some: {
                userId: auth.user.id,
                member: true
              }
            }
          } // Workspaces user is a member of
        ]
      },
      select: {
        id: true,
        name: true
      }
    })

    const workspaceIds = userWorkspaces.map(ws => ws.id)

    // Search workspaces
    const workspaceResults = await client.workSpace.findMany({
      where: {
        id: { in: workspaceIds },
        name: {
          contains: searchQuery,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        type: true
      }
    })

    // Search folders
    const folderResults = await client.folder.findMany({
      where: {
        workSpaceId: { in: workspaceIds },
        name: {
          contains: searchQuery,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        workSpaceId: true,
        WorkSpace: {
          select: {
            name: true
          }
        }
      }
    })

    // Search videos
    const videoResults = await client.video.findMany({
      where: {
        workSpaceId: { in: workspaceIds },
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: searchQuery,
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        id: true,
        title: true,
        description: true,
        source: true,
        createdAt: true,
        workSpaceId: true,
        folderId: true,
        processing: true,
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true
          }
        },
        WorkSpace: {
          select: {
            name: true
          }
        },
        Folder: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Transform results to consistent format
    const results: SearchResult[] = []

    // Add workspace results
    workspaceResults.forEach(workspace => {
      results.push({
        id: workspace.id,
        name: workspace.name,
        type: 'workspace',
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        createdAt: workspace.createdAt
      })
    })

    // Add folder results
    folderResults.forEach(folder => {
      results.push({
        id: folder.id,
        name: folder.name,
        type: 'folder',
        workspaceId: folder.workSpaceId ?? undefined,
        workspaceName: folder.WorkSpace?.name,
        createdAt: folder.createdAt
      })
    })

    // Add video results
    videoResults.forEach(video => {
      results.push({
        id: video.id,
        name: video.title || 'Untitled Video',
        type: 'video',
        workspaceId: video.workSpaceId ?? undefined,
        workspaceName: video.WorkSpace?.name,
        folderId: video.folderId ?? undefined,
        folderName: video.Folder?.name,
        description: video.description ?? undefined,
        createdAt: video.createdAt,
        // Include full video data for VideoCard component
        videoData: {
          id: video.id,
          title: video.title,
          source: video.source,
          createdAt: video.createdAt,
          workSpaceId: video.workSpaceId,
          folderId: video.folderId,
          processing: video.processing,
          User: video.User,
          Folder: video.Folder
        }
      })
    })

    // Sort results by creation date (newest first)
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return {
      status: 200,
      data: results
    }

  } catch (error) {
    console.error('Search error:', error)
    return {
      status: 500,
      message: 'Internal server error'
    }
  }
}

/**
 * Search workspaces only
 * 
 * Searches only within user's accessible workspaces.
 * 
 * @param query - Search query string
 * @returns Promise<SearchResponse> - Workspace search results
 */
export const searchWorkspaces = async (query: string): Promise<SearchResponse> => {
  try {
    const auth = await onAuthenticateUser()
    if (!auth.user) {
      return { status: 401, message: 'Unauthorized' }
    }

    if (!query || query.trim().length === 0) {
      return { status: 400, message: 'Query is required' }
    }

    const searchQuery = query.trim()

    const workspaces = await client.workSpace.findMany({
      where: {
        OR: [
          { userId: auth.user.id },
          { 
            members: {
              some: {
                userId: auth.user.id,
                member: true
              }
            }
          }
        ],
        name: {
          contains: searchQuery,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        type: true
      }
    })

    const results: SearchResult[] = workspaces.map(workspace => ({
      id: workspace.id,
      name: workspace.name,
      type: 'workspace',
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      createdAt: workspace.createdAt
    }))

    return {
      status: 200,
      data: results
    }

  } catch (error) {
    console.error('Workspace search error:', error)
    return {
      status: 500,
      message: 'Internal server error'
    }
  }
}

/**
 * Search folders only
 * 
 * Searches only within user's accessible folders.
 * 
 * @param query - Search query string
 * @returns Promise<SearchResponse> - Folder search results
 */
export const searchFolders = async (query: string): Promise<SearchResponse> => {
  try {
    const auth = await onAuthenticateUser()
    if (!auth.user) {
      return { status: 401, message: 'Unauthorized' }
    }

    if (!query || query.trim().length === 0) {
      return { status: 400, message: 'Query is required' }
    }

    const searchQuery = query.trim()

    // Get user's accessible workspaces
    const userWorkspaces = await client.workSpace.findMany({
      where: {
        OR: [
          { userId: auth.user.id },
          { 
            members: {
              some: {
                userId: auth.user.id,
                member: true
              }
            }
          }
        ]
      },
      select: { id: true }
    })

    const workspaceIds = userWorkspaces.map(ws => ws.id)

    const folders = await client.folder.findMany({
      where: {
        workSpaceId: { in: workspaceIds },
        name: {
          contains: searchQuery,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        workSpaceId: true,
        WorkSpace: {
          select: {
            name: true
          }
        }
      }
    })

    const results: SearchResult[] = folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      type: 'folder',
      workspaceId: folder.workSpaceId ?? undefined,
      workspaceName: folder.WorkSpace?.name,
      createdAt: folder.createdAt
    }))

    return {
      status: 200,
      data: results
    }

  } catch (error) {
    console.error('Folder search error:', error)
    return {
      status: 500,
      message: 'Internal server error'
    }
  }
}

/**
 * Search videos only
 * 
 * Searches only within user's accessible videos.
 * 
 * @param query - Search query string
 * @returns Promise<SearchResponse> - Video search results
 */
export const searchVideos = async (query: string): Promise<SearchResponse> => {
  try {
    const auth = await onAuthenticateUser()
    if (!auth.user) {
      return { status: 401, message: 'Unauthorized' }
    }

    if (!query || query.trim().length === 0) {
      return { status: 400, message: 'Query is required' }
    }

    const searchQuery = query.trim()

    // Get user's accessible workspaces
    const userWorkspaces = await client.workSpace.findMany({
      where: {
        OR: [
          { userId: auth.user.id },
          { 
            members: {
              some: {
                userId: auth.user.id,
                member: true
              }
            }
          }
        ]
      },
      select: { id: true }
    })

    const workspaceIds = userWorkspaces.map(ws => ws.id)

    const videos = await client.video.findMany({
      where: {
        workSpaceId: { in: workspaceIds },
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: searchQuery,
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        workSpaceId: true,
        folderId: true,
        WorkSpace: {
          select: {
            name: true
          }
        },
        Folder: {
          select: {
            name: true
          }
        }
      }
    })

    const results: SearchResult[] = videos.map(video => ({
      id: video.id,
      name: video.title || 'Untitled Video',
      type: 'video',
      workspaceId: video.workSpaceId ?? undefined,
      workspaceName: video.WorkSpace?.name,
      folderId: video.folderId ?? undefined,
      folderName: video.Folder?.name,
      description: video.description ?? undefined,
      createdAt: video.createdAt
    }))

    return {
      status: 200,
      data: results
    }

  } catch (error) {
    console.error('Video search error:', error)
    return {
      status: 500,
      message: 'Internal server error'
    }
  }
}

/**
 * Quick Search Result (lightweight for dropdown)
 */
export interface QuickSearchResult {
  id: string
  name: string
  type: 'workspace' | 'folder' | 'video'
  workspaceId: string
  thumbnail?: string
}

export interface QuickSearchResponse {
  status: number
  data?: QuickSearchResult[]
  message?: string
}

/**
 * Quick Search for Dropdown Suggestions
 * 
 * Lightweight search that returns max 8 results for real-time dropdown.
 * Optimized for speed with minimal data payload.
 * 
 * @param query - Search query string
 * @returns Promise<QuickSearchResponse> - Limited search results
 */
export const quickSearch = async (query: string): Promise<QuickSearchResponse> => {
  try {
    const auth = await onAuthenticateUser()
    if (!auth.user) {
      return { status: 401, message: 'Unauthorized' }
    }

    if (!query || query.trim().length < 2) {
      return { status: 200, data: [] }
    }

    const searchQuery = query.trim()

    // Get user's accessible workspaces
    const userWorkspaces = await client.workSpace.findMany({
      where: {
        OR: [
          { userId: auth.user.id },
          { 
            members: {
              some: {
                userId: auth.user.id,
                member: true
              }
            }
          }
        ]
      },
      select: { id: true, name: true }
    })

    const workspaceIds = userWorkspaces.map(ws => ws.id)
    const results: QuickSearchResult[] = []

    // Search videos (priority)
    const videos = await client.video.findMany({
      where: {
        workSpaceId: { in: workspaceIds },
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        title: true,
        source: true,
        workSpaceId: true
      },
      take: 5
    })

    videos.forEach(video => {
      results.push({
        id: video.id,
        name: video.title || 'Untitled Video',
        type: 'video',
        workspaceId: video.workSpaceId || '',
        thumbnail: video.source ? `${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}` : undefined
      })
    })

    // Search folders
    const folders = await client.folder.findMany({
      where: {
        workSpaceId: { in: workspaceIds },
        name: { contains: searchQuery, mode: 'insensitive' }
      },
      select: {
        id: true,
        name: true,
        workSpaceId: true
      },
      take: 3
    })

    folders.forEach(folder => {
      results.push({
        id: folder.id,
        name: folder.name,
        type: 'folder',
        workspaceId: folder.workSpaceId || ''
      })
    })

    // Search workspaces (if room)
    if (results.length < 8) {
      const workspaces = await client.workSpace.findMany({
        where: {
          id: { in: workspaceIds },
          name: { contains: searchQuery, mode: 'insensitive' }
        },
        select: {
          id: true,
          name: true
        },
        take: 8 - results.length
      })

      workspaces.forEach(workspace => {
        results.push({
          id: workspace.id,
          name: workspace.name,
          type: 'workspace',
          workspaceId: workspace.id
        })
      })
    }

    return {
      status: 200,
      data: results.slice(0, 8)
    }

  } catch (error) {
    console.error('Quick search error:', error)
    return {
      status: 500,
      message: 'Internal server error'
    }
  }
}

