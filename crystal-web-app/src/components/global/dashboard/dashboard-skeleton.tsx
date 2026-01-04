import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Dashboard Page Skeleton Loader
 * 
 * Provides a loading state skeleton for the main dashboard page.
 * Displays placeholder elements matching the dashboard structure
 * including header, action buttons, folders, and video cards.
 * 
 * Purpose: Show loading placeholder for dashboard content
 * 
 * How it works:
 * 1. Displays skeleton for workspace header (type label + name)
 * 2. Shows skeleton for action buttons (invite, more)
 * 3. Displays skeleton for folders section
 * 4. Shows skeleton for video grid layout
 * 5. Maintains consistent layout during loading
 * 
 * @returns JSX element with dashboard loading skeleton
 */
export default function DashboardSkeleton() {
  return (
    <div>
      <div className="flex w-full justify-between items-end">
        <article className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-64" />
        </article>
        
        <div className="flex justify-end gap-2 items-end">
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
          
          <section className="flex items-center gap-4 overflow-x-auto w-full">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2 min-w-[200px]">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </section>
          
          <div className="mt-8 flex flex-col gap-4">
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
        </div>
      </section>
    </div>
  );
}
