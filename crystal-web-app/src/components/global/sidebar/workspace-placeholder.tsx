import React from 'react'

/**
 * Workspace Placeholder Component
 * 
 * Simple placeholder for workspace initials or names.
 * Shows as a small rounded badge with text content.
 * 
 * Appearance:
 * - Small rounded badge
 * - Dark background with light text
 * - Centered text content
 * - Fixed height and padding
 * 
 * Special Behavior:
 * - Displays workspace initials or names
 * - Used as fallback when workspace icons unavailable
 * - Consistent sizing across all instances
 * - Simple text display
 * 
 * Used in:
 * - Sidebar workspace indicators
 * - Workspace selection menus
 * - Workspace display components
 */

type Props = { children: React.ReactNode }

const WorkspacePlaceholder = ({ children }: Props) => {
  return (
    <span className="bg-[#545454] flex items-center font-bold justify-center w-8 px-2 h-7 rounded-sm text-[#1D1D1D]">
      {children}
    </span>
  )
}

export default WorkspacePlaceholder