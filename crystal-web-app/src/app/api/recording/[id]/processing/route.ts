import { client } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Processing API Route
 * 
 * Creates a new video record when upload processing begins and notifies
 * workspace members for public workspace uploads.
 * 
 * What it does:
 * - Creates video record in database
 * - For PUBLIC workspaces: notifies all members about the new upload
 * - Returns video ID, workspace ID, and user plan
 * 
 * How it works:
 * 1. Gets user data with workspace and subscription info
 * 2. Optionally uses provided workspaceId or falls back to personal workspace
 * 3. Creates video record
 * 4. If PUBLIC workspace: creates notifications for all members except uploader
 * 5. Returns success response with video/workspace IDs
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json()
    const { id } = await params
    const requestedWorkspaceId = body.workspaceId

    const userData = await client.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        workspace: {
          where: {
            type: 'PERSONAL',
          },
          select: {
            id: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })

    if (!userData?.workspace[0]?.id) {
      return NextResponse.json({ status: 400, error: 'No workspace found' })
    }

    let workspaceId = userData.workspace[0].id
    let workspaceType: 'PERSONAL' | 'PUBLIC' = 'PERSONAL'
    let workspaceOwnerId: string | null = null
    let workspaceMembers: { userId: string | null }[] = []

    if (requestedWorkspaceId) {
      const requestedWorkspace = await client.workSpace.findUnique({
        where: { id: requestedWorkspaceId },
        select: {
          id: true,
          type: true,
          userId: true,
          members: {
            where: { member: true },
            select: { userId: true },
          },
        },
      })
      
      if (requestedWorkspace) {
        workspaceId = requestedWorkspace.id
        workspaceType = requestedWorkspace.type
        workspaceOwnerId = requestedWorkspace.userId
        workspaceMembers = requestedWorkspace.members
      }
    }

    const createdVideo = await client.video.create({
      data: {
        source: body.filename,
        userId: id,
        workSpaceId: workspaceId,
        title: body.title || 'Untitled Video',
        description: body.description || 'No Description',
      },
      select: {
        id: true,
        title: true,
      },
    })

    if (createdVideo) {
      if (workspaceType === 'PUBLIC') {
        const uploaderName = [userData.firstname, userData.lastname].filter(Boolean).join(' ') || 'Someone'
        
        const usersToNotify = new Set<string>()
        
        if (workspaceOwnerId && workspaceOwnerId !== id) {
          usersToNotify.add(workspaceOwnerId)
        }
        
        for (const member of workspaceMembers) {
          if (member.userId && member.userId !== id) {
            usersToNotify.add(member.userId)
          }
        }
        
        const notificationPromises = Array.from(usersToNotify).map((userId) =>
          client.notification.create({
            data: {
              userId,
              actorId: id,
              videoId: createdVideo.id,
              type: 'VIDEO_UPLOAD',
              content: `${uploaderName} uploaded "${createdVideo.title}"`,
            },
          })
        )
        
        await Promise.all(notificationPromises)
      }

      return NextResponse.json({
        status: 200,
        plan: userData.subscription?.plan,
        videoId: createdVideo.id,
        workspaceId: workspaceId,
      })
    }
    return NextResponse.json({ status: 400 })
  } catch (error) {
    console.log('🔴 Error in processing video', error)
    return NextResponse.json({ status: 500, error: 'Internal server error' })
  }
}
