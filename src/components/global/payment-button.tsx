import { Button } from '@/components/ui/button'
import React from 'react'
import Loader from "@/components/global/loader/loader";
import {useSubscription} from "@/hooks/useSubscription";

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
