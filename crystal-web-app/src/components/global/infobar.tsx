'use client'
import React, { useState } from 'react';
import {Search, UploadIcon, Video} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {UserButton} from "@clerk/nextjs";
import { useRouter, usePathname } from 'next/navigation';

/**
 * Infobar Component
 * 
 * Top navigation bar with search, upload/record buttons, and user menu.
 * Shows as a fixed header with search input and action buttons.
 * 
 * Appearance:
 * - Fixed header at top of page
 * - Search input with search icon
 * - Upload and Record buttons
 * - User button (Clerk authentication)
 * - Responsive layout with proper spacing
 * 
 * Special Behavior:
 * - Fixed positioning (stays at top when scrolling)
 * - Search input is currently non-functional (placeholder)
 * - Upload and Record buttons are currently non-functional
 * - User button provides authentication menu
 * 
 * Used in:
 * - All dashboard pages
 * - Main application header
 */

function Infobar() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  // Extract workspace ID from current pathname
  const getWorkspaceId = () => {
    const pathSegments = pathname.split('/')
    const dashboardIndex = pathSegments.indexOf('dashboard')
    if (dashboardIndex !== -1 && pathSegments[dashboardIndex + 1]) {
      return pathSegments[dashboardIndex + 1]
    }
    return null
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const workspaceId = getWorkspaceId()
      if (workspaceId) {
        router.push(`/dashboard/${workspaceId}/search?query=${encodeURIComponent(searchQuery.trim())}`)
      } else {
        // Fallback to general search if no workspace context
        router.push(`/dashboard/search?query=${encodeURIComponent(searchQuery.trim())}`)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  return (
    <header className="pl-20 md:pl-[265px] fixed p-4 pr-8 w-full flex items-center justify-between gap-4 bg-[#171717]/80 backdrop-blur-lg">
      <form onSubmit={handleSearch} className="flex gap-4 justify-center items-center border-2 rounded-full px-4 w-full max-w-lg">
        <Search
          size={25}
          className="text-[#707070]"
        />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="!bg-transparent border-none !px-0 !placeholder-neutral-500"
          placeholder="Search for people, projects, tags & folders"
        />
      </form>
      <div className="flex items-center gap-4">
        <Button className="bg-[#9D9D9D] flex items-center gap-2">
          <UploadIcon size={20} />
          <span className="flex items-center gap-2">Upload</span>
        </Button>
        <Button className="bg-[#9D9D9D] flex items-center gap-2">
          <Video />
          <span className="flex items-center gap-2">Record</span>
        </Button>
        <UserButton />
      </div>
    </header>
  )
}

export default Infobar;