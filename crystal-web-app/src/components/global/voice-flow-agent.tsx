'use client'
import React, { useEffect } from 'react'
import { LoadVoiceFlowAgent } from '@/lib/voiceflow'

/**
 * Voice Flow Agent Component
 * 
 * Invisible component that initializes the VoiceFlow AI agent.
 * Renders nothing visible but loads the VoiceFlow chatbot functionality.
 * 
 * Appearance:
 * - Completely invisible (renders empty fragment)
 * - No visual elements
 * - No user interface
 * 
 * Special Behavior:
 * - Loads VoiceFlow agent on component mount
 * - Runs only once when component is first rendered
 * - Provides AI chatbot functionality to the app
 * - Integrates with VoiceFlow service
 * 
 * Used in:
 * - Root layout (global chatbot functionality)
 * - AI-powered features throughout the app
 */

const VoiceFlowAgent = () => {
  useEffect(() => {
    LoadVoiceFlowAgent()
  }, [])
  return <></>
}

export default VoiceFlowAgent
