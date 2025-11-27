import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Infobar Skeleton Loader
 * 
 * Provides a loading state skeleton for the top navigation bar (Infobar).
 * Displays placeholder elements matching the infobar structure including
 * search bar, action buttons, and user menu area.
 * 
 * Purpose: Show loading placeholder for top navigation bar
 * 
 * How it works:
 * 1. Displays skeleton for search input area
 * 2. Shows skeleton for action buttons (Upload, Record)
 * 3. Displays skeleton for user button area
 * 4. Maintains consistent header layout during loading
 * 
 * Features:
 * - Fixed positioning matching actual infobar
 * - Matches exact infobar dimensions and layout
 * - Animated pulse effect for loading indication
 * - Smooth transition to actual infobar content
 * - Responsive design with proper spacing
 * 
 * @returns JSX element with infobar loading skeleton
 */
export default function InfobarSkeleton() {
  return (
    <header className="pl-20 md:pl-[265px] fixed p-4 pr-8 w-full flex items-center justify-between gap-4 bg-[#171717]/80 backdrop-blur-lg z-50">
      <div className="flex gap-4 justify-center items-center border-2 rounded-full px-4 w-full max-w-lg h-12">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 flex-1" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </header>
  );
}

