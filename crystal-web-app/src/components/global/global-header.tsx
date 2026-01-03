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
 * It shows workspace type, page titles, and maintains consistent header
 * styling across different sections of the application.
 * 
 * Purpose: Provide consistent and contextual page headers for dashboard navigation
 * 
 * How it works:
 * 1. Extracts current pathname from Next.js router
 * 2. Parses pathname to determine current page section
 * 3. Displays workspace type (PUBLIC/PERSONAL) for non-video pages
 * 4. Shows appropriate page title based on current route
 * 5. Handles special cases for video and folder pages
 * 
 * Route Handling:
 * - Video pages: Shows empty (handled by video player)
 * - Folder pages: Shows empty (handled by FolderHeader component)
 * - Other pages: Capitalizes and formats route name
 * - Workspace type: Displayed for non-video pages
 * 
 * Integration:
 * - Used by dashboard layout for consistent headers
 * - Connects to Next.js routing system
 * - Receives workspace data from parent components
 * - Part of global navigation and UI consistency
 * 
 * @param workspace - Workspace object containing type and ID information
 * @returns JSX element with dynamic header content
 */
const GlobalHeader = ({ workspace }: Props) => {
  const pathName = usePathname().split(`/dashboard/${workspace.id}`)[1]
  
  const isFolderPage = pathName?.includes('folder')
  const isVideoPage = pathName?.includes('video')
  
  // Folder and video pages have their own headers
  if (isFolderPage || isVideoPage) {
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
