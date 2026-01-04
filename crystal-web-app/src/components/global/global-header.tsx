'use client'
import { WorkSpace } from '@prisma/client'
import React from 'react'
import { usePathname } from "next/navigation"

type Props = {
  workspace: WorkSpace
}

/**
 * Global Header Component
 * 
 * This component provides dynamic page headers throughout the dashboard,
 * displaying contextual information based on the current route and workspace.
 * It shows workspace name and page titles for sub-pages like settings, billing, etc.
 * 
 * Purpose: Provide consistent and contextual page headers for dashboard sub-pages
 * 
 * How it works:
 * 1. Extracts current pathname from Next.js router
 * 2. Parses pathname to determine current page section
 * 3. Returns null for pages with their own headers
 * 4. Shows workspace name and formatted page title for other routes
 * 
 * Route Handling:
 * - Main dashboard: Returns null (header handled in page.tsx)
 * - Video pages: Returns null (handled by video player)
 * - Folder pages: Returns null (handled by FolderHeader component)
 * - Other pages: Shows workspace name and capitalizes route name
 * 
 * Integration:
 * - Used by dashboard layout for consistent headers
 * - Connects to Next.js routing system
 * - Receives workspace data from parent components
 * - Part of global navigation and UI consistency
 * 
 * @param workspace - Workspace object containing type and ID information
 * @returns JSX element with dynamic header content, or null for special pages
 */
const GlobalHeader = ({ workspace }: Props) => {
  const pathName = usePathname().split(`/dashboard/${workspace.id}`)[1]
  
  const isFolderPage = pathName?.includes('folder')
  const isVideoPage = pathName?.includes('video')
  const isMainDashboard = !pathName || pathName === ''
  
  // Main dashboard, folder, and video pages have their own headers
  if (isFolderPage || isVideoPage || isMainDashboard) {
    return null
  }
  
  const getSubtitle = () => {
    if (pathName) return workspace.name
    return `${workspace.type} WORKSPACE`
  }
  
  const getTitle = () => {
    if (pathName) return pathName.charAt(1).toUpperCase() + pathName.slice(2).toLowerCase()
    return workspace.name
  }
  
  return (
    <article className="flex flex-col gap-2">
      <span className="text-[#707070] text-xs">
        {getSubtitle().toLocaleUpperCase()}
      </span>
      <h1 className="text-4xl font-bold">
        {getTitle()}
      </h1>
    </article>
  )
}

export default GlobalHeader
