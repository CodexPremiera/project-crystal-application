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
 * - Optional prefix element before tabs
 * 
 * Special Behavior:
 * - Tabs are capitalized automatically
 * - Active tab styling changes background
 * - Content switches based on selected tab
 * - Maintains state between tab switches
 * - Supports prefix for badges or labels
 * 
 * Used in:
 * - Video preview pages (Transcript, Activity)
 * - Settings pages with multiple sections
 * - Content organization throughout the app
 */

type Props = {
  triggers: string[]
  children: React.ReactNode
  defaultValue: string
  prefix?: React.ReactNode
}

const TabMenu = ({ children, defaultValue, triggers, prefix }: Props) => {
  return (
    <Tabs
      defaultValue={defaultValue}
      className="w-full"
    >
      <TabsList className="flex justify-between bg-transparent mb-2 gap-2 w-full">
        {<div className="flex gap-2">
          {triggers.map((trigger) => (
            <TabsTrigger
              key={trigger}
              value={trigger}
              className="capitalize text-base data-[state=active]:bg-surface-overlay data-[state=active]:border-l-2 data-[state=active]:border-brand-hover"
            >
              {trigger}
            </TabsTrigger>
          ))}
        </div>}
        {prefix}
      </TabsList>
      {children}
    </Tabs>
  )
}

export default TabMenu
