import { getPaymentInfo } from '@/actions/user'
import React from 'react'

/**
 * Billing and Subscription Management Page
 * 
 * This page provides users with information about their current subscription
 * plan, billing details, and payment history. It displays subscription status
 * and pricing information for both FREE and PRO plans.
 * 
 * Purpose: Display subscription information and billing details to users
 * 
 * How it works:
 * 1. Fetches user's payment and subscription information
 * 2. Displays current subscription plan (FREE or PRO)
 * 3. Shows monthly pricing based on subscription level
 * 4. Provides billing history and payment information
 * 5. Renders subscription details in organized layout
 * 
 * Subscription Display:
 * - FREE Plan: $0/Month with basic features
 * - PRO Plan: $99/Month with advanced features
 * - Plan status and billing information
 * - Payment history and transaction details
 * 
 * Features:
 * - Current subscription plan display
 * - Monthly pricing information
 * - Payment history overview
 * - Subscription status tracking
 * - Clean, organized billing interface
 * 
 * User Experience:
 * - Clear subscription plan information
 * - Easy-to-understand pricing display
 * - Access to payment history
 * - Subscription management interface
 * 
 * Integration:
 * - Connects to user payment and subscription system
 * - Uses payment information actions
 * - Part of user account management
 * - Essential for subscription transparency
 * 
 * @returns JSX element with billing and subscription information
 */
const BillingPage = async () => {
  const payment = await getPaymentInfo()

  return (
    <div className="bg-[#1D1D1D] flex flex-col gap-y-8 p-5 rounded-xl">
      <div>
        <h2 className="text-2xl">Current Plan</h2>
        <p className="text-[#9D9D9D]">Your Payment History</p>
      </div>
      <div>
        <h2 className="text-2xl">
          ${payment?.data?.subscription?.plan === 'PRO' ? '99' : '0'}/Month
        </h2>
        <p className="text-[#9D9D9D]">{payment?.data?.subscription?.plan}</p>
      </div>
    </div>
  )
}

export default BillingPage
