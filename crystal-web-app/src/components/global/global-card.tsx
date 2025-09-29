import React from 'react'
import {
  Card,
  CardDescription, CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

/**
 * Global Card Component
 * 
 * Reusable card wrapper with consistent styling for content sections.
 * Shows as a transparent card with title, description, and optional content/footer.
 * 
 * Appearance:
 * - Transparent background card
 * - Title in header section
 * - Description text below title
 * - Optional content area in middle
 * - Optional footer area at bottom
 * - Consistent padding and spacing
 * 
 * Special Behavior:
 * - Content and footer are optional (only render if provided)
 * - Maintains consistent styling across all card usage
 * - Transparent background for overlay effects
 * 
 * Used in:
 * - Settings pages
 * - Information displays
 * - Content sections throughout the app
 */

type Props = {
  title: string
  description: string
  children?: React.ReactNode
  footer?: React.ReactNode
}

const GlobalCard = ({ title, children, description, footer }: Props) => {
  return (
    <Card className="bg-transparent w-full !py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-md text-[#9D9D9D]">{title}</CardTitle>
        <CardDescription className="text-[#707070]">
          {description}
        </CardDescription>
      </CardHeader>
      {children && <div className="p-4">{children}</div>}
      {footer && <CardFooter className="p-4">{footer}</CardFooter>}
    </Card>
  )
}

export default GlobalCard