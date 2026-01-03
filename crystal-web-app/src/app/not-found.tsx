'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

/**
 * Global 404 Not Found Page
 * 
 * This page is displayed when a user navigates to a route that doesn't exist
 * or when a resource (video, folder, workspace) is not found.
 * 
 * Features:
 * - Clear 404 error message
 * - Helpful description
 * - Navigation options to go back or return home
 * - Consistent dark theme styling
 */
export default function NotFound() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-primary mb-2">404</h1>
          <div className="h-1 w-24 bg-primary/50 mx-auto rounded-full" />
        </div>
        
        <h2 className="text-2xl font-semibold text-white mb-4">
          Page Not Found
        </h2>
        
        <p className="text-[#9D9D9D] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          This could be a deleted video, folder, or an invalid link.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="secondary"
            className="gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button
            className="gap-2"
            asChild
          >
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

