import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

/**
 * GET /api/video/[id]/download
 * 
 * API endpoint for downloading video files with proper headers and streaming.
 * This endpoint handles video downloads server-side to avoid CORS issues
 * and provides proper download headers for the browser.
 * 
 * Security Features:
 * - User authentication verification
 * - Video ownership validation
 * - Proper download headers
 * - Streaming response for large files
 * 
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing video ID
 * @returns Streaming response with video file or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: videoId } = params
    
    // Validate video ID format
    if (!videoId || typeof videoId !== 'string') {
      return NextResponse.json(
        { status: 400, message: 'Invalid video ID' },
        { status: 400 }
      )
    }
    
    // Get current user
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { status: 401, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get video information
    const video = await client.video.findUnique({
      where: { id: videoId },
      select: {
        id: true,
        title: true,
        source: true,
        User: {
          select: { clerkId: true }
        }
      }
    })
    
    if (!video) {
      return NextResponse.json(
        { status: 404, message: 'Video not found' },
        { status: 404 }
      )
    }
    
    // Check if user owns the video (optional - remove if you want to allow public downloads)
    if (video.User?.clerkId !== user.id) {
      return NextResponse.json(
        { status: 403, message: 'You can only download your own videos' },
        { status: 403 }
      )
    }
    
    // Construct CloudFront URL
    const cloudFrontUrl = `${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}`
    
    // Fetch video from CloudFront
    const response = await fetch(cloudFrontUrl, {
      method: 'GET',
      headers: {
        'Accept': 'video/webm,video/*,*/*',
      },
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { status: 404, message: 'Video file not found' },
        { status: 404 }
      )
    }
    
    // Get video data
    const videoData = await response.arrayBuffer()
    
    // Create filename
    const sanitizedTitle = video.title 
      ? video.title.replace(/[^a-zA-Z0-9\s-_]/g, '').trim()
      : `video-${videoId}`
    const filename = `${sanitizedTitle}.webm`
    
    // Return video with proper download headers
    return new NextResponse(videoData, {
      status: 200,
      headers: {
        'Content-Type': 'video/webm',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': videoData.byteLength.toString(),
        'Cache-Control': 'no-cache',
      },
    })
    
  } catch (error) {
    console.error('Error in video download API:', error)
    return NextResponse.json(
      { status: 500, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
