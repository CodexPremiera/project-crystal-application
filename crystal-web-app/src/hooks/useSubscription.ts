import { useState } from 'react'
import axios from 'axios'

/**
 * Custom hook for handling subscription and payment processing
 * 
 * This hook manages the subscription flow by initiating payment sessions
 * through Stripe integration. It handles the redirect to Stripe's payment
 * portal for secure payment processing.
 * 
 * Purpose: Enable users to upgrade their subscription plan through secure payment
 * 
 * How it works:
 * 1. Makes API call to /api/payment endpoint
 * 2. Receives Stripe session URL from the server
 * 3. Redirects user to Stripe's payment portal
 * 4. Handles loading states during the process
 * 5. Provides error handling for failed requests
 * 
 * Integration:
 * - Connects to payment API route for Stripe integration
 * - Used by payment buttons and subscription components
 * - Manages loading states for UI feedback
 * - Handles browser redirects for payment flow
 * 
 * @returns Object containing subscription function and processing state
 */
export const useSubscription = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const onSubscribe = async () => {
    setIsProcessing(true)
    try {
      const response = await axios.get('/api/payment')
      if (response.data.status === 200) {
        return (window.location.href = `${response.data.session_url}`)
      }
      setIsProcessing(false)
    } catch (error) {
      console.log(error, '🔴')
    }
  }
  return { onSubscribe, isProcessing }
}
