import React from 'react';
import { cn } from '@/lib/utils'
import {Spinner} from "@/components/global/loader/spinner";

/**
 * Loader Component
 * 
 * Conditional loading component that shows spinner or content.
 * Shows loading spinner when state is true, otherwise shows children.
 * 
 * Appearance:
 * - Shows spinner when loading (state = true)
 * - Shows children content when not loading
 * - Customizable className for styling
 * - Uses Spinner component for loading indicator
 * 
 * Special Behavior:
 * - Conditionally renders based on state prop
 * - Passes through className to spinner
 * - Wraps children when not loading
 * - Provides consistent loading experience
 * 
 * Used in:
 * - All components with loading states
 * - Form submissions
 * - Data fetching operations
 * - Button loading states
 */

type Props = {
  state: boolean
  className?: string
  color?: string
  children?: React.ReactNode
}

const Loader = ({ state, className, children }: Props) => {
  return state ? (
    <div className={cn(className)}>
      <Spinner />
    </div>
  ) : (
    children
  )
}

export default Loader