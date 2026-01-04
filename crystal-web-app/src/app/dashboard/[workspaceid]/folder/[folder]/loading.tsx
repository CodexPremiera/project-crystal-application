import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Folder Page Loading State
 * 
 * This component is automatically displayed by Next.js while the folder
 * page is loading. It provides a skeleton UI that matches the structure
 * of the FolderHeader and Videos components.
 * 
 * Purpose: Provide loading state for folder content
 * 
 * How it works:
 * 1. Next.js automatically shows this during page data fetching
 * 2. Layout (sidebar, infobar) is already rendered
 * 3. Shows folder header skeleton (name, metadata, actions)
 * 4. Shows videos grid skeleton
 * 
 * @returns JSX element with folder page loading skeleton
 */
export default function Loading() {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
      
      <section className="py-9">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-xl border border-surface-border p-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

