import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

/**
 * Tab Menu Component
 * 
 * Reusable tab navigation with customizable triggers and content.
 * Shows as a horizontal tab bar with clickable tabs and content area.
 * 
 * Appearance:
 * - Horizontal tab bar with rounded triggers
 * - Active tab has dark background
 * - Inactive tabs are transparent
 * - Content area below tabs
 * - Responsive design
 * 
 * Special Behavior:
 * - Tabs are capitalized automatically
 * - Active tab styling changes background
 * - Content switches based on selected tab
 * - Maintains state between tab switches
 * 
 * Used in:
 * - Video preview pages (AI Tools, Transcript, Activity)
 * - Settings pages with multiple sections
 * - Content organization throughout the app
 */

type Props = {
  triggers: string[]
  children: React.ReactNode
  defaultValue: string
}

const TabMenu = ({ children, defaultValue, triggers }: Props) => {
  return (
    <Tabs
      defaultValue={defaultValue}
      className="w-full"
    >
      <TabsList className="flex justify-start bg-transparent">
        {triggers.map((trigger) => (
          <TabsTrigger
            key={trigger}
            value={trigger}
            className="capitalize text-base data-[state=active]:bg-[#1D1D1D]"
          >
            {trigger}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  )
}

export default TabMenu
