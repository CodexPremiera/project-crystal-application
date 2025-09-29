import { Button } from '@/components/ui/button'
import React from 'react'
import Loader from "@/components/global/loader/loader";
import {useSubscription} from "@/hooks/useSubscription";

/**
 * Payment Button Component
 * 
 * Button that triggers subscription upgrade process.
 * Shows as a button with loading state during payment processing.
 * 
 * Appearance:
 * - Standard button with "Upgrade" text
 * - Shows loading spinner when processing
 * - Full width button
 * - Standard button styling
 * 
 * Special Behavior:
 * - Shows loading state during payment processing
 * - Triggers Stripe payment flow when clicked
 * - Disabled during processing to prevent double-clicks
 * - Redirects to payment completion after success
 * 
 * Used in:
 * - Subscription upgrade pages
 * - Payment flow interfaces
 * - Billing management pages
 */

const PaymentButton = () => {
  const { onSubscribe, isProcessing } = useSubscription()

  return (
    <Button
      className="text-sm w-full "
      onClick={onSubscribe}
    >
      <Loader
        color="#000"
        state={isProcessing}
      >
        Upgrade
      </Loader>
    </Button>
  )
}

export default PaymentButton
