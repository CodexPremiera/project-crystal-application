'use client'
import React, { useState } from 'react';
import { UploadIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { useRouter, usePathname } from 'next/navigation';
import { UploadVideoDialog } from '@/components/global/upload-video-dialog';
import { DownloadAppModal } from '@/components/global/download-app-modal';
import { SearchDropdown } from '@/components/global/search/search-dropdown';
import { NotificationDropdown } from '@/components/global/notifications/notification-dropdown';
import { useDesktopApp } from '@/hooks/useDesktopApp';
import { extractWorkspaceIdFromPath } from '@/lib/utils';

/**
 * Infobar Component
 * 
 * Top navigation bar with smart search, upload/record buttons, and user menu.
 * Shows as a fixed header with real-time search suggestions and action buttons.
 * 
 * Features:
 * - Smart search with real-time suggestions dropdown
 * - Recent searches shown on focus
 * - Fuzzy matching for better results
 * - Upload button for manual video uploads
 * - Record button that launches desktop app or prompts download
 * - User authentication menu
 */

function Infobar() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  
  const { launchApp, isLaunching, showDownloadModal, closeDownloadModal } = useDesktopApp()
  
  const currentWorkspaceId = extractWorkspaceIdFromPath(pathname)

  return (
    <header className="pl-20 md:pl-[265px] fixed p-4 pr-8 w-full flex items-center justify-between gap-4 bg-surface-elevated/80 backdrop-blur-lg z-50">
      <SearchDropdown />
      <div className="flex items-center gap-4">
        <Button 
          className="bg-text-tertiary flex items-center gap-2"
          onClick={() => setUploadDialogOpen(true)}
        >
          <UploadIcon size={20} />
          <span className="flex items-center gap-2">Upload</span>
        </Button>
        <Button 
          className="bg-text-tertiary flex items-center gap-2"
          onClick={launchApp}
          disabled={isLaunching}
        >
          <Video />
          <span className="flex items-center gap-2">
            {isLaunching ? 'Launching...' : 'Record'}
          </span>
        </Button>
        <NotificationDropdown />
        <UserButton />
      </div>
      
      <UploadVideoDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        workspaceId={currentWorkspaceId}
        onUploadComplete={() => {
          router.refresh()
        }}
      />
      
      <DownloadAppModal
        open={showDownloadModal}
        onOpenChange={closeDownloadModal}
      />
    </header>
  )
}

export default Infobar;
