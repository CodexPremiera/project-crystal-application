import { client } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Processing API Route
 * 
 * Creates a new video record when upload processing begins.
 * Returns the video ID, workspace ID, and user plan for the front-end
 * to track processing status and enable navigation to the video.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json()
    const { id } = await params

    // Get the user's personal workspace
    const userData = await client.user.findUnique({
      where: {
        id,
      },
      select: {
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

    const workspaceId = userData.workspace[0].id

    // Create the video record and get its ID
    const createdVideo = await client.video.create({
      data: {
        source: body.filename,
        userId: id,
        workSpaceId: workspaceId,
      },
      select: {
        id: true,
      },
    })

    if (createdVideo) {
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
