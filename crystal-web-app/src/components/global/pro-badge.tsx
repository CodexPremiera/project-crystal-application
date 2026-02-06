import React from 'react'
import { Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * PRO Badge Component
 * 
 * Displays a purple gradient PRO badge with optional crown icon.
 * Used to indicate premium/PRO subscription status across the application.
 * 
 * Features:
 * - Purple gradient background matching brand colors
 * - Optional crown icon
 * - Consistent styling across all uses
 * - Flexible sizing options
 * 
 * @param showCrown - Whether to display the crown icon (default: true)
 * @param className - Additional CSS classes to apply
 */

type Props = {
  showCrown?: boolean
  className?: string
}

const ProBadge = ({ showCrown = true, className }: Props) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-br from-[#a22fe0] to-[#7320dd]",
        className
      )}
    >
      {showCrown && <Crown className="h-3.5 w-3.5 text-white" />}
      <span className="text-xs font-semibold text-white">PRO</span>
    </div>
  )
}

export default ProBadge
