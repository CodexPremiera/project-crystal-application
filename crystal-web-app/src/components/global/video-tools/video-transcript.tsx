'use client'

import { TabsContent } from '@/components/ui/tabs'
import { TranscriptSegment } from '@/types/index.type'
import React, { useEffect, useRef, useState } from 'react'

/**
 * Video Transcript Component
 * 
 * Displays video transcripts with YouTube-style timestamped segments.
 * Provides interactive features for enhanced video navigation.
 * 
 * Key Features:
 * - Timestamped segments with clickable timestamps
 * - Auto-scrolling to follow current playback position
 * - Visual highlighting of the active segment
 * - Click-to-seek functionality for quick navigation
 * - Fallback to plain text for videos without segments
 * 
 * The component syncs with the video player via the videoRef,
 * listening to timeupdate events to track playback position
 * and automatically scrolling to keep the current segment visible.
 */

type Props = {
  transcript: string
  segments?: TranscriptSegment[] | null
  videoRef: React.RefObject<HTMLVideoElement | null>
}

/**
 * Formats seconds into MM:SS or H:MM:SS format for display.
 * 
 * @param seconds - Time in seconds to format
 * @returns Formatted time string (e.g., "1:23" or "1:05:30")
 */
const formatTimestamp = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const VideoTranscript = ({ transcript, segments, videoRef }: Props) => {
  const [currentTime, setCurrentTime] = useState(0)
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([])

  // Listen to video timeupdate events to track playback position
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }
    
    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [videoRef])

  // Determine which segment is currently active based on playback time
  useEffect(() => {
    if (!segments || segments.length === 0) return
    
    const index = segments.findIndex(
      (seg, i) => {
        const nextSeg = segments[i + 1]
        const isAfterStart = currentTime >= seg.start
        const isBeforeEnd = nextSeg ? currentTime < nextSeg.start : currentTime <= seg.end
        return isAfterStart && isBeforeEnd
      }
    )
    
    setActiveSegmentIndex(index)
  }, [currentTime, segments])

  // Auto-scroll to keep active segment visible
  useEffect(() => {
    if (activeSegmentIndex < 0 || !segmentRefs.current[activeSegmentIndex]) return
    
    const activeElement = segmentRefs.current[activeSegmentIndex]
    const container = containerRef.current
    
    if (activeElement && container) {
      const containerRect = container.getBoundingClientRect()
      const elementRect = activeElement.getBoundingClientRect()
      
      // Only scroll if element is outside visible area
      const isAbove = elementRect.top < containerRect.top
      const isBelow = elementRect.bottom > containerRect.bottom
      
      if (isAbove || isBelow) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }
  }, [activeSegmentIndex])

  /**
   * Handles clicking on a timestamp to seek the video to that position.
   * 
   * @param time - Target time in seconds to seek to
   */
  const handleSeek = (time: number) => {
    const video = videoRef.current
    if (video) {
      video.currentTime = time
      video.play()
    }
  }

  // Empty state: No transcript available
  if (!transcript && (!segments || segments.length === 0)) {
    return (
      <TabsContent
        value="Transcript"
        className="rounded-xl flex flex-col items-center justify-center py-12 gap-4"
      >
        <div className="p-4 rounded-full bg-[#1D1D1D]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6e6e6e"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M13 8H7" />
            <path d="M17 12H7" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-[#a7a7a7] text-lg font-medium">No transcript available</p>
          <p className="text-[#6e6e6e] text-sm mt-1">
            This video doesn&apos;t have a transcript yet
          </p>
        </div>
      </TabsContent>
    )
  }

  // Fallback: Display plain transcript if no segments available
  if (!segments || segments.length === 0) {
    return (
      <TabsContent
        value="Transcript"
        className="rounded-xl flex flex-col gap-y-6"
      >
        <p className="text-[#a7a7a7]">{transcript}</p>
      </TabsContent>
    )
  }

  return (
    <TabsContent
      value="Transcript"
      className="rounded-xl flex flex-col gap-y-2"
    >
      <div 
        ref={containerRef}
        className="max-h-[400px] overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-[#3a3a3a] scrollbar-track-transparent"
      >
        {segments.map((segment, index) => {
          const isActive = index === activeSegmentIndex
          
          return (
            <div
              key={index}
              ref={(el) => { segmentRefs.current[index] = el }}
              className={`
                flex gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200
                ${isActive 
                  ? 'bg-[#252525] border-l-2 border-[#9D50BB]' 
                  : 'hover:bg-[#1a1a1a]'
                }
              `}
              onClick={() => handleSeek(segment.start)}
            >
              <span 
                className={`
                  text-sm font-mono shrink-0 min-w-[50px]
                  ${isActive ? 'text-[#9D50BB]' : 'text-[#6e6e6e]'}
                `}
              >
                {formatTimestamp(segment.start)}
              </span>
              <p 
                className={`
                  text-sm leading-relaxed
                  ${isActive ? 'text-white' : 'text-[#a7a7a7]'}
                `}
              >
                {segment.text}
              </p>
            </div>
          )
        })}
      </div>
    </TabsContent>
  )
}

export default VideoTranscript
