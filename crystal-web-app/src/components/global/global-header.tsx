'use client'
import { WorkSpace } from '@prisma/client'
import React from 'react'
import { usePathname } from "next/navigation"
import { useQueryData } from '@/hooks/useQueryData'
import { getFolderInfo } from '@/actions/workspace'
import { FolderProps } from '@/types/index.type'

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
 * - Video pages: Shows empty title (handled by video player)
 * - Folder pages: Shows "My Library" as default
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
  
  const folderId = isFolderPage 
    ? pathName.split('/folder/')[1]?.split('/')[0] 
    : null
  
  const { data: folderData } = useQueryData(
    ['folder-info'],
    () => getFolderInfo(folderId!),
    !!folderId
  )
  
  const folder = (folderData as FolderProps)?.data
  
  const getSubtitle = () => {
    if (isVideoPage) return ''
    if (isFolderPage) return workspace.name
    if (pathName) return workspace.name
    return `${workspace.type} WORKSPACE`
  }
  
  const getTitle = () => {
    if (isVideoPage) return ''
    if (isFolderPage) return folder?.name || ''
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
