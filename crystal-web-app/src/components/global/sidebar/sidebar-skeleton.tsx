import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Sidebar Skeleton Loader
 * 
 * Provides a loading state skeleton for the sidebar navigation.
 * Displays placeholder elements matching the sidebar structure
 * to improve perceived performance during data loading.
 * 
 * Purpose: Show loading placeholder for sidebar navigation
 * 
 * How it works:
 * 1. Displays skeleton for logo and branding area
 * 2. Shows skeleton menu items matching the menu structure
 * 3. Displays skeleton for workspace section
 * 4. Shows skeleton for subscription card area
 * 5. Maintains consistent layout during loading
 * 
 * Features:
 * - Matches exact sidebar dimensions and layout
 * - Animated pulse effect for loading indication
 * - Responsive design matching main sidebar
 * - Smooth transition to actual content
 * 
 * @returns JSX element with sidebar loading skeleton
 */
export default function SidebarSkeleton() {
  return (
    <div className="bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden">
      <div className="bg-[#111111] p-4 flex gap-3 justify-center items-center mb-4 absolute top-0 left-0 right-0">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-6 w-20" />
      </div>
      
      <Skeleton className="w-full h-4 mt-16" />
      <nav className="w-full flex flex-col gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </nav>
      
      <div className="w-4/5 h-[1px] bg-[#252525] my-2" />
      
      <div className="flex flex-col items-center gap-2 overflow-hidden w-full">
        <div className="flex gap-3 items-center justify-between w-full">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        
        <div className="flex flex-col gap-2 w-full h-fit mt-2">
          <div className="flex items-center gap-3 p-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 flex-1" />
          </div>
        </div>
        
        <nav className="w-full gap-2 mt-2">
          <div className="h-[300px]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </nav>
      </div>
      
      <div className="w-4/5 h-[1px] bg-[#252525] my-2" />
      
      <div className="w-full p-4 rounded-xl bg-[#252525]">
        <Skeleton className="h-4 w-28 mb-2" />
        <Skeleton className="h-3 w-full mb-3" />
        <Skeleton className="h-9 w-full rounded-full" />
      </div>
    </div>
  );
}

