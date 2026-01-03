'use client'

import React, { useState } from 'react'
import { useQueryData } from '@/hooks/useQueryData'
import { getFolderInfo } from '@/actions/workspace'
import { FolderProps } from '@/types/index.type'
import { Button } from '@/components/ui/button'
import { EditDuotone } from '@/components/icons/editDuotone'
import { Download, MoreHorizontal, Link2, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import EditFolderNameForm from '@/components/forms/edit-folder/edit-folder-name'
import { useDownloadFolder } from '@/hooks/useDownloadFolder'

type Props = {
  folderId: string
  workspaceId: string
  workspaceName: string
}

/**
 * Folder Header Component
 * 
 * Displays the folder page header matching the video preview layout.
 * Shows folder name with edit capability, workspace info, creation date,
 * and action buttons for download and more options.
 * 
 * Features:
 * - Large folder name title with modal edit
 * - Workspace name and relative creation date
 * - Download button (placeholder)
 * - More button with copy link and delete options
 * 
 * @param folderId - The folder's unique identifier
 * @param workspaceId - The workspace's unique identifier
 * @param workspaceName - The workspace name to display
 */
function FolderHeader({ folderId, workspaceId, workspaceName }: Props) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  
  const { data: folderData } = useQueryData(
    ['folder-info'],
    () => getFolderInfo(folderId)
  )
  
  const folder = (folderData as FolderProps)?.data
  
  const { downloadFolder, isDownloading } = useDownloadFolder(
    folderId,
    folder?.name || ''
  )
  
  const daysAgo = folder?.createdAt
    ? Math.floor((new Date().getTime() - new Date(folder.createdAt).getTime()) / (24 * 60 * 60 * 1000))
    : 0
  
  const onCopyLink = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_HOST_URL}/dashboard/${workspaceId}/folder/${folderId}`
    )
    toast('Copied', {
      description: 'Folder link copied to clipboard',
    })
  }
  
  if (!folder) return null
  
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold text-white">{folder.name}</h1>
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost">
                <EditDuotone />
              </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <EditFolderNameForm
                folderId={folderId}
                name={folder.name}
                onSuccess={() => setEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[#9D9D9D] capitalize">{workspaceName}</span>
          <span className="text-[#707070]">
            {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          className="rounded-full pl-3 pr-6 flex"
          onClick={downloadFolder}
          disabled={isDownloading}
        >
          <Download className="h-4 w-4" />
          <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full" variant="secondary" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="gap-1">
            <DropdownMenuItem onClick={onCopyLink}>
              <Link2 size={16} />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem 
              disabled
              className="text-red-500 focus:text-red-500"
            >
              <Trash2 size={16} />
              Delete Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default FolderHeader

