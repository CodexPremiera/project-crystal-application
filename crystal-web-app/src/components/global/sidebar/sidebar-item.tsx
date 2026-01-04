import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

/**
 * Sidebar Item Component
 * 
 * Individual navigation item for sidebar menu.
 * Shows as a clickable link with icon, title, and optional notifications.
 * 
 * Appearance:
 * - Link with icon and title
 * - Hover effects with background color change
 * - Selected state with dark background
 * - Optional notification badge
 * - Rounded corners and padding
 * 
 * Special Behavior:
 * - Changes background color on hover
 * - Selected state shows different styling
 * - Truncates long titles with ellipsis
 * - Supports notification badges
 * - Navigates to specified href
 * 
 * Used in:
 * - Sidebar navigation menus
 * - Dashboard navigation
 * - Menu item components
 */

type Props = {
  icon: React.ReactNode
  title: string
  href: string
  selected: boolean
  notifications?: number
}

const SidebarItem = ({ href, icon, selected, title }: Props) => {
  return (
    <li className="cursor-pointer my-[5px]">
      <Link
        href={href}
        className={cn(
          'flex items-center justify-between group rounded-lg hover:bg-surface-overlay',
          selected ? 'bg-surface-overlay' : ''
        )}
      >
        <div className="flex w-full items-center gap-2 transition-all py-1 px-2 cursor-pointer">
          {icon}
          <span
            className={cn(
              'font-medium group-hover:text-text-tertiary transition-all truncate flex-1 min-w-0 pr-2',
              selected ? 'text-text-tertiary' : 'text-text-muted'
            )}
          >
            {title}
          </span>
        </div>
        {}
      </Link>
    </li>
  )
}

export default SidebarItem