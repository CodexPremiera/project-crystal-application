'use client'
import React, { useEffect } from 'react'
import { LoadVoiceFlowAgent } from '@/lib/voiceflow'

const VoiceFlowAgent = () => {
  useEffect(() => {
    LoadVoiceFlowAgent()
  }, [])
  return <></>
}

export default VoiceFlowAgent
