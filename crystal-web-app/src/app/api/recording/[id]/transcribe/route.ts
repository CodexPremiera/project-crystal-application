import { client } from '@/lib/prisma'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    //WIRE UP AI AGENT
    const body = await req.json()
    const { id } = await params

    // Handle content whether it's already parsed or still a string
    let content
    try {
      content = typeof body.content === 'string' 
        ? JSON.parse(body.content) 
        : body.content
    } catch (parseError) {
      console.log('🔴 Error parsing content JSON:', parseError)
      return NextResponse.json({ 
        status: 400, 
        error: 'Invalid content format' 
      })
    }

    // Validate required fields
    if (!content.title || !content.summary) {
      console.log('🔴 Missing required fields: title or summary')
      return NextResponse.json({ 
        status: 400, 
        error: 'Missing title or summary in content' 
      })
    }

    const transcribed = await client.video.update({
      where: {
        userId: id,
        source: body.filename,
      },
      data: {
        title: content.title,
        description: content.summary,
        summary: body.transcript,
        transcriptSegments: body.segments ?? null,
      },
    })

    if (transcribed) {
      console.log('🟢 Transcribed successfully:', content.title)
      
      // Update Voiceflow knowledge base
      try {
        const options = {
          method: 'POST',
          url: process.env.VOICEFLOW_KNOWLEDGE_BASE_API,
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: process.env.VOICEFLOW_API_KEY,
          },
          data: {
            data: {
              schema: {
                searchableFields: ['title', 'transcript'],
                metadataFields: ['title', 'transcript'],
              },
              name: content.title,
              items: [
                {
                  title: content.title,
                  transcript: body.transcript,
                },
              ],
            },
          },
        }

        const updateKB = await axios.request(options)
        console.log('🟢 Voiceflow KB updated:', updateKB.status)
      } catch (kbError) {
        // Don't fail the entire request if KB update fails
        console.log('⚠️ Voiceflow KB update failed (non-critical):', kbError instanceof Error ? kbError.message : String(kbError))
      }

      return NextResponse.json({ status: 200 })
    }

    console.log('🔴 Transcription update failed')
    return NextResponse.json({ status: 400, error: 'Failed to update video' })

  } catch (error) {
    console.log('🔴 Transcription endpoint error:', error)
    return NextResponse.json({ 
      status: 500, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
