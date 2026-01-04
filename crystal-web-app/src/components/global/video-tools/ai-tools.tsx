import { Button } from '@/components/ui/button'
import { TabsContent } from '@/components/ui/tabs'
import React from 'react'

/**
 * AI Tools Component
 * 
 * Tab content for AI-powered video tools and features.
 * Shows AI tools interface for video analysis and processing.
 * 
 * Appearance:
 * - AI tools interface
 * - Rounded container with proper spacing
 * - Tool buttons and controls
 * - Responsive layout
 * 
 * Special Behavior:
 * - Provides AI-powered video analysis
 * - Shows different tools based on user plan
 * - Handles trial and subscription states
 * - Integrates with AI services
 * 
 * Used in:
 * - Video preview pages (AI Tools tab)
 * - AI-powered video features
 * - Video analysis interfaces
 */

import {
  Bot,
  FileTextIcon,
  Pencil,
  StarsIcon,
} from 'lucide-react'
import Loader from "@/components/global/loader/loader";

type Props = {
  plan: 'PRO' | 'FREE'
  trial: boolean
  videoId: string
}

const AiTools = ({ plan }: Props) => {
  // Only show AI Tools promotional content for FREE plan users
  if (plan === 'PRO') {
    return (
      <TabsContent value="AI Tools">
        <div className="p-5 bg-surface-overlay rounded-xl flex flex-col gap-y-6">
          <div className="flex items-center gap-4">
            <div className="w-full">
              <h2 className="text-3xl font-bold">AI Tools</h2>
              <p className="text-text-secondary">
                You have full access to all AI features with your PRO plan!
              </p>
            </div>
          </div>
          <div className="border rounded-xl p-4 gap-4 flex flex-col bg-brand-surface/50">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-brand">Crystal Ai</h2>
              <StarsIcon className="text-brand fill-brand" />
            </div>
            <p className="text-muted-foreground">
              AI features are automatically applied to your videos. Check the Transcript tab for AI-generated summaries.
            </p>
          </div>
        </div>
      </TabsContent>
    )
  }
  
  return (
    <TabsContent value="AI Tools">
      <div className="p-5 bg-surface-overlay rounded-xl flex flex-col gap-y-6">
        <div className="flex items-center gap-4">
          <div className="w-full">
            <h2 className="text-3xl font-bold">AI Tools</h2>
            <p className="text-text-secondary">
              Taking your video to the next step with the power of AI!
            </p>
          </div>
          
          <div className="flex gap-4 w-full justify-end">
            <Button className="mt-2 text-sm">
              <Loader
                state={false}
                color="#000"
              >
                Try now
              </Loader>
            </Button>
            <Button
              className="mt-2 text-sm"
              variant={'secondary'}
            >
              <Loader
                state={false}
                color="#000"
              >
                Pay Now
              </Loader>
            </Button>
          </div>
        </div>
        <div className="border rounded-xl p-4 gap-4 flex flex-col bg-brand-surface/50">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-brand">Crystal Ai</h2>
            <StarsIcon className="text-brand fill-brand" />
          </div>
          <div className="flex gap-2 items-start">
            <div className="p-2 rounded-full border-surface-hover border-2 bg-surface-hover">
              <Pencil className="text-brand" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-md">Summary</h3>
              <p className="text-muted-foreground text-sm">
                Generate a description for your video using AI.
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-start">
            <div className="p-2 rounded-full border-surface-hover border-2 bg-surface-hover">
              <FileTextIcon className="text-brand" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-md">Summary</h3>
              <p className="text-muted-foreground text-sm">
                Generate a description for your video using AI.
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-start">
            <div className="p-2 rounded-full border-surface-hover border-2 bg-surface-hover">
              <Bot className="text-brand" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-md">AI Agent</h3>
              <p className="text-muted-foreground text-sm">
                Viewers can ask questions on your video and our ai agent will
                respond.
              </p>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}

export default AiTools
