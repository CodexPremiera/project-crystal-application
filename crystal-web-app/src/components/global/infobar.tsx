'use client'
import React, { useState } from 'react';
import { UploadIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { useRouter, usePathname } from 'next/navigation';
import { UploadVideoDialog } from '@/components/global/upload-video-dialog';
import { SearchDropdown } from '@/components/global/search/search-dropdown';

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
 * - Upload and Record buttons
 * - User authentication menu
 */

function Infobar() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Extract workspace ID from current path for upload dialog navigation
  const getWorkspaceId = (): string | null => {
    const pathSegments = pathname.split('/')
    const dashboardIndex = pathSegments.indexOf('dashboard')
    if (dashboardIndex !== -1 && pathSegments[dashboardIndex + 1]) {
      return pathSegments[dashboardIndex + 1]
    }
    return null
  }

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
        <Button className="bg-text-tertiary flex items-center gap-2">
          <Video />
          <span className="flex items-center gap-2">Record</span>
        </Button>
        <UserButton />
      </div>
      
      <UploadVideoDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        workspaceId={getWorkspaceId()}
        onUploadComplete={() => {
          router.refresh()
        }}
      />
    </header>
  )
}

export default Infobar;
