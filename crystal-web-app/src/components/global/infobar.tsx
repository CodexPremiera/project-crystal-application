import React from 'react';
import {Search, UploadIcon, Video} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {UserButton} from "@clerk/nextjs";

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
  return (
    <header className="pl-20 md:pl-[265px] fixed p-4 pr-8 w-full flex items-center justify-between gap-4 bg-[#171717]/80 backdrop-blur-lg">
      <div className="flex gap-4 justify-center items-center border-2 rounded-full px-4 w-full max-w-lg">
        <Search
          size={25}
          className="text-[#707070]"
        />
        <Input
          className="!bg-transparent border-none !px-0 !placeholder-neutral-500"
          placeholder="Search for people, projects, tags & folders"
        />
      </div>
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