'use client'
import { getFolderInfo } from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import React from 'react'

type Props = {
  folderId: string
}

const FolderInfo = ({ folderId }: Props) => {
  const { data } = useQueryData(['folder-info'], () => getFolderInfo(folderId))
  
  // Handle loading and error states
  if (!data || data.status !== 200) {
    return (
      <div className="flex items-center">
        <h2 className="text-[#BdBdBd] text-2xl">Loading folder...</h2>
      </div>
    )
  }
  
  const folder = data.data
  
  return (
    <div className="flex items-center">
      <h2 className="text-[#BdBdBd] text-2xl">{folder?.name || 'Untitled Folder'}</h2>
      {folder?._count?.videos !== undefined && (
        <span className="ml-2 text-sm text-gray-500">
          ({folder._count.videos} videos)
        </span>
      )}
    </div>
  )
}

export default FolderInfo
