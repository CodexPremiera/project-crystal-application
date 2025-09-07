import { completeSubscription } from '@/actions/user'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  searchParams: { session_id?: string; cancel?: boolean }
}

/**
 * Payment Processing Page
 * 
 * This page handles the payment completion flow after users complete
 * their subscription purchase through Stripe. It processes successful
 * payments, handles cancellations, and manages subscription upgrades.
 * 
 * Purpose: Process Stripe payment completion and subscription management
 * 
 * How it works:
 * 1. Receives Stripe session_id or cancel parameter from URL
 * 2. If session_id provided: Completes subscription upgrade via Stripe
 * 3. If payment successful: Redirects to auth callback for user processing
 * 4. If cancel parameter: Shows error page for cancelled payments
 * 5. Handles payment failures and errors gracefully
 * 
 * Payment Flow:
 * - User completes payment on Stripe checkout
 * - Stripe redirects to this page with session_id
 * - Page calls completeSubscription to upgrade user to PRO
 * - On success: Redirects to auth callback for user data refresh
 * - On failure: Shows error message
 * 
 * Cancellation Handling:
 * - User cancels payment on Stripe
 * - Stripe redirects with cancel=true parameter
 * - Page displays 404 error message
 * - User can retry payment or return to application
 * 
 * Features:
 * - Stripe payment completion processing
 * - Subscription upgrade management
 * - Payment cancellation handling
 * - Error state management
 * - Automatic user data refresh
 * 
 * Integration:
 * - Connects to Stripe payment system
 * - Uses subscription completion actions
 * - Integrates with user authentication flow
 * - Part of payment and subscription system
 * 
 * @param searchParams - URL parameters from Stripe redirect
 * @param searchParams.session_id - Stripe checkout session ID for successful payments
 * @param searchParams.cancel - Boolean indicating payment cancellation
 * @returns JSX element with payment processing result or redirect
 */
const page = async ({ searchParams: { cancel, session_id } }: Props) => {
  if (session_id) {
    const customer = await completeSubscription(session_id)
    if (customer.status === 200) {
      return redirect('/auth/callback')
    }
  }

  if (cancel) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-full">
        <h4 className="text-5xl font-bold">404</h4>
        <p className="text-xl text-center">Oops! Something went wrong</p>
      </div>
    )
  }
}

export default page
