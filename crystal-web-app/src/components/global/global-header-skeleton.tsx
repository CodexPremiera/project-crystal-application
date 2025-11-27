import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Global Header Skeleton Loader
 * 
 * Provides a loading state skeleton for the global header component.
 * Displays placeholder elements matching the header structure including
 * workspace type label and page title.
 * 
 * Purpose: Show loading placeholder for page header
 * 
 * How it works:
 * 1. Displays skeleton for workspace type label
 * 2. Shows skeleton for page title
 * 3. Maintains consistent header layout during loading
 * 4. Matches GlobalHeader component structure
 * 
 * Features:
 * - Matches exact header dimensions and layout
 * - Animated pulse effect for loading indication
 * - Smooth transition to actual header content
 * - Consistent spacing with actual header
 * 
 * @returns JSX element with header loading skeleton
 */
export default function GlobalHeaderSkeleton() {
  return (
    <article className="flex flex-col gap-2">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-10 w-64" />
    </article>
  );
}

