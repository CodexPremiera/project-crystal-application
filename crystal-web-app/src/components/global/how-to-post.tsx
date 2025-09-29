import React from 'react'
import parse from 'html-react-parser'

/**
 * How To Post Component
 * 
 * Displays instructional content with HTML parsing for rich formatting.
 * Shows as a section with large title and parsed HTML content.
 * 
 * Appearance:
 * - Large title (5xl font size)
 * - HTML content parsed and displayed with custom styling
 * - Custom CSS classes for content formatting
 * - Responsive layout with gap spacing
 * 
 * Special Behavior:
 * - Parses HTML content safely using html-react-parser
 * - Applies custom CSS classes to parsed content
 * - Handles empty content gracefully
 * - Responsive design for different screen sizes
 * 
 * Used in:
 * - Help and tutorial pages
 * - Instructional content sections
 * - Documentation displays
 */

type Props = {
  title: string
  html: string
}

const HowToPost = ({ html, title }: Props) => {
  return (
    <div className="flex flex-col gap-y-10 lg:col-span-2 mt-10">
      <h2 className="text-5xl font-bold">{title}</h2>
      <div className="[&>h2]:text-3xl [&>h2]:mt-5 [&>h2]:mb-3 [&>p]:text-base [&>p]:my-2 post--container">
        {parse(html || '')}
      </div>
    </div>
  )
}

export default HowToPost
