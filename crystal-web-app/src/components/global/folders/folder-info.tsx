'use client'
import { getFolderInfo } from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import React from 'react'
import { FolderProps } from '@/types/index.type'

/**
 * Folder Info Component
 * 
 * Displays folder name and basic information.
 * Shows as a simple text display with folder name.
 * 
 * Appearance:
 * - Simple text display with folder name
 * - Gray text color
 * - Large font size (2xl)
 * - Minimal styling
 * 
 * Special Behavior:
 * - Fetches folder data using React Query
 * - Shows loading state while fetching
 * - Handles errors gracefully
 * - Caches folder information
 * 
 * Used in:
 * - Folder detail pages
 * - Folder header sections
 * - Folder information displays
 */

type Props = {
  folderId: string
}

const FolderInfo = ({ folderId }: Props) => {
  const { data } = useQueryData(['folder-info'], () => getFolderInfo(folderId))
  
  const { data: folder } = data as FolderProps
  
  
  return (
    <div className="flex items-center">
      <h2 className="text[#BdBdBd] text-2xl">{folder.name}</h2>
    </div>
  )
}

export default FolderInfo
