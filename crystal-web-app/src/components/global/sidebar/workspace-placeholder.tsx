import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Workspace Placeholder Component
 * 
 * Displays workspace initials in a colored badge.
 * PRO workspaces get a purple gradient, others get a neutral gray.
 * 
 * Appearance:
 * - PRO: Purple gradient background with white text
 * - FREE/PERSONAL: Gray background with dark text
 * - Rounded corners with fixed sizing
 * 
 * @param children - The workspace initial(s) to display
 * @param type - The workspace type (PUBLIC = PRO, PERSONAL = free)
 */

type Props = { 
  children: React.ReactNode
  type?: 'PUBLIC' | 'PERSONAL'
}

const WorkspacePlaceholder = ({ children, type }: Props) => {
  const isPro = type === 'PUBLIC'
  
  return (
    <span 
      className={cn(
        "flex items-center font-bold justify-center w-8 px-2 h-7 rounded-sm",
        isPro 
          ? "bg-gradient-to-br from-[#a22fe0] to-[#7320dd] text-white" 
          : "bg-[#545454] text-[#1D1D1D]"
      )}
    >
      {children}
    </span>
  )
}

export default WorkspacePlaceholder