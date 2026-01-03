import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { client } from '@/lib/prisma'
import archiver from 'archiver'

/**
 * Folder Download API Route
 * 
 * This API endpoint handles folder download requests by creating a ZIP file
 * containing all videos in the specified folder. It streams the ZIP file
 * directly to the client for download.
 * 
 * How it works:
 * 1. Validates user authentication and folder ownership
 * 2. Fetches all videos in the folder from database
 * 3. For each video, fetches the file from CloudFront
 * 4. Uses archiver to create a ZIP stream with all videos
 * 5. Returns the ZIP file with proper download headers
 * 
 * Security:
 * - Requires authenticated user
 * - Verifies user owns the folder's workspace
 * - Only includes videos the user has access to
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing folder ID
 * @returns ZIP file stream or error response
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: folderId } = await params
    
    if (!folderId) {
      return NextResponse.json(
        { status: 400, message: 'Invalid folder ID' },
        { status: 400 }
      )
    }
    
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { status: 401, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get folder with its workspace and videos
    const folder = await client.folder.findUnique({
      where: { id: folderId },
      select: {
        id: true,
        name: true,
        WorkSpace: {
          select: {
            userId: true,
            User: {
              select: { clerkId: true }
            }
          }
        },
        videos: {
          select: {
            id: true,
            title: true,
            source: true,
          }
        }
      }
    })
    
    if (!folder) {
      return NextResponse.json(
        { status: 404, message: 'Folder not found' },
        { status: 404 }
      )
    }
    
    // Verify user owns the workspace
    if (folder.WorkSpace?.User?.clerkId !== user.id) {
      return NextResponse.json(
        { status: 403, message: 'You can only download your own folders' },
        { status: 403 }
      )
    }
    
    if (folder.videos.length === 0) {
      return NextResponse.json(
        { status: 400, message: 'Folder has no videos to download' },
        { status: 400 }
      )
    }
    
    // Create ZIP archive
    const archive = archiver('zip', { zlib: { level: 5 } })
    
    // Collect chunks and set up completion promise BEFORE adding files
    const chunks: Buffer[] = []
    
    const archiveComplete = new Promise<Buffer>((resolve, reject) => {
      archive.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })
      
      archive.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
      
      archive.on('error', (err) => {
        reject(err)
      })
    })
    
    // Add each video to the archive
    for (const video of folder.videos) {
      try {
        const cloudFrontUrl = `${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}`
        
        const response = await fetch(cloudFrontUrl, {
          method: 'GET',
          headers: { 'Accept': 'video/webm,video/*,*/*' },
        })
        
        if (response.ok) {
          const videoBuffer = Buffer.from(await response.arrayBuffer())
          const sanitizedTitle = video.title 
            ? video.title.replace(/[^a-zA-Z0-9\s-_]/g, '').trim()
            : `video-${video.id}`
          const filename = `${sanitizedTitle}.webm`
          
          archive.append(videoBuffer, { name: filename })
        }
      } catch (error) {
        console.error(`Failed to fetch video ${video.id}:`, error)
      }
    }
    
    // Finalize the archive and wait for completion
    archive.finalize()
    const zipBuffer = await archiveComplete
    
    // Create filename for the ZIP
    const sanitizedFolderName = folder.name
      ? folder.name.replace(/[^a-zA-Z0-9\s-_]/g, '').trim()
      : `folder-${folderId}`
    const zipFilename = `${sanitizedFolderName}.zip`
    
    // Return ZIP file with download headers
    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    })
    
  } catch (error) {
    console.error('Folder download error:', error)
    return NextResponse.json(
      { status: 500, message: 'Failed to create download' },
      { status: 500 }
    )
  }
}

