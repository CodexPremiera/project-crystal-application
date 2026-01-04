import React from 'react';
import DashboardSkeleton from '@/components/global/dashboard/dashboard-skeleton';

/**
 * Workspace Dashboard Loading State
 * 
 * This component is automatically displayed by Next.js while the workspace
 * dashboard page is loading. It provides a skeleton UI that matches the
 * structure of the actual dashboard content.
 * 
 * Purpose: Provide loading state for workspace dashboard content
 * 
 * How it works:
 * 1. Next.js automatically shows this during page data fetching
 * 2. Layout (sidebar, infobar) is already rendered
 * 3. Only the page content area shows the skeleton
 * 4. Transitions smoothly to actual content when ready
 * 
 * @returns JSX element with dashboard content loading skeleton
 */
export default function Loading() {
  return <DashboardSkeleton />;
}

