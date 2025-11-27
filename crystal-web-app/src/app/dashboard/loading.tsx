import React from 'react';
import SidebarSkeleton from '@/components/global/sidebar/sidebar-skeleton';
import DashboardSkeleton from '@/components/global/dashboard/dashboard-skeleton';
import GlobalHeaderSkeleton from '@/components/global/global-header-skeleton';
import InfobarSkeleton from '@/components/global/infobar-skeleton';

/**
 * Dashboard Loading State
 * 
 * This component is automatically displayed by Next.js while the dashboard
 * page and layout are loading. It provides a complete skeleton UI that
 * matches the structure of the actual dashboard for a seamless loading experience.
 * 
 * Purpose: Provide loading state for entire dashboard layout
 * 
 * How it works:
 * 1. Next.js automatically shows this during server-side data fetching
 * 2. Displays skeleton for infobar (top navigation)
 * 3. Displays skeleton for sidebar navigation
 * 4. Displays skeleton for global header
 * 5. Displays skeleton for main dashboard content
 * 6. Transitions smoothly to actual content when ready
 * 
 * Features:
 * - Automatic integration with Next.js loading patterns
 * - Full layout skeleton including infobar, sidebar and main content
 * - Matches actual layout structure for smooth transition
 * - Improves perceived performance during initial load
 * 
 * Integration:
 * - Automatically used by Next.js for this route segment
 * - Shown during all async operations in page and layout
 * - Replaced with actual content when rendering completes
 * 
 * @returns JSX element with complete loading skeleton
 */
export default function Loading() {
  return (
    <>
      <InfobarSkeleton />
      <div className="flex h-screen">
        <SidebarSkeleton />
        <main className="w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden">
          <GlobalHeaderSkeleton />
          <DashboardSkeleton />
        </main>
      </div>
    </>
  );
}

