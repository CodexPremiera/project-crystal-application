import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Video Page Loading State
 * 
 * This component is automatically displayed by Next.js while the video
 * preview page is loading. It provides a skeleton UI that matches the
 * structure of the VideoPreview component.
 * 
 * Purpose: Provide loading state for video preview content
 * 
 * How it works:
 * 1. Next.js automatically shows this during page data fetching
 * 2. Layout (sidebar, infobar) is already rendered
 * 3. Shows 3-column grid skeleton matching VideoPreview layout
 * 4. Left side: video player, title, metadata, description
 * 5. Right side: action buttons and tab menu
 * 
 * @returns JSX element with video page loading skeleton
 */
export default function Loading() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 lg:py-10 overflow-y-auto gap-5">
      <div className="flex flex-col lg:col-span-2 gap-y-10">
        <div>
          <div className="flex gap-x-5 items-center">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <span className="flex gap-x-3 mt-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </span>
        </div>
        
        <Skeleton className="w-full aspect-video rounded-xl" />
        
        <div className="flex flex-col text-2xl gap-y-4">
          <div className="flex gap-x-5 items-center justify-between">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1 flex flex-col gap-y-16">
        <div className="flex justify-end gap-2 items-center">
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
          <div className="space-y-4 mt-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

