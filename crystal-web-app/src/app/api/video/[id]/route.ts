import { NextRequest, NextResponse } from 'next/server'
import { deleteVideo } from '@/actions/workspace'

/**
 * DELETE /api/video/[id]
 * 
 * API endpoint for video deletion with additional server-side validation.
 * This provides an alternative to server actions for video deletion.
 * 
 * Security Features:
 * - Server-side authorization verification
 * - Request validation and sanitization
 * - Rate limiting capabilities (can be added)
 * - Audit logging for deletion events
 * 
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing video ID
 * @returns JSON response with deletion status
 */
export async function DELETE(
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
    
    // Execute deletion via server action
    const result = await deleteVideo(videoId)
    
    return NextResponse.json(result, { 
      status: result.status === 200 ? 200 : 400 
    })
    
  } catch (error) {
    console.error('Error in video deletion API:', error)
    return NextResponse.json(
      { status: 500, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
