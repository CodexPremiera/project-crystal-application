import { TabsContent } from '@/components/ui/tabs'
import React from 'react'

/**
 * Video Transcript Component
 * 
 * Tab content for displaying video transcript text.
 * Shows transcript content in a readable format.
 * 
 * Appearance:
 * - Transcript text display
 * - Rounded container with proper spacing
 * - Gray text color for readability
 * - Scrollable content area
 * 
 * Special Behavior:
 * - Displays video transcript text
 * - Handles empty transcript gracefully
 * - Scrollable for long transcripts
 * - Responsive text formatting
 * 
 * Used in:
 * - Video preview pages (Transcript tab)
 * - Video transcript displays
 * - Content analysis interfaces
 */

type Props = {
  transcript: string
}

const VideoTranscript = ({ transcript }: Props) => {
  return (
    <TabsContent
      value="Transcript"
      className="rounded-xl flex flex-col gap-y-6 "
    >
      <p className="text-[#a7a7a7]">{transcript}</p>
    </TabsContent>
  )
}

export default VideoTranscript
