"use client"

import React, { useState } from "react"
import { X } from "lucide-react"
import { SimplePricingWithThreeTiers, PricingPlan } from "@/components/ui/pricing-tiers"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface PricingModalProps {
  isOpen: boolean
  onPlanSelected: (planId: string) => void
  onClose?: () => void
  jobId?: string
}

export default function PricingModal({ isOpen, onPlanSelected, onClose, jobId }: PricingModalProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handlePlanSelect = async (planId: string) => {
    setIsProcessing(true)
    
    try {
      // TODO: Integrate with payment processor (Stripe/PayPal)
      toast.info(`Processing ${planId} plan selection...`)
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // TODO: Call backend API to process payment and unlock features
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'
      const response = await fetch(`${apiUrl}/api/v1/payments/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": localStorage.getItem("sessionId") || "",
        },
        body: JSON.stringify({
          planId,
          jobId,
        }),
      })

      if (!response.ok) {
        throw new Error("Payment processing failed")
      }

      const data = await response.json()
      
      // Handle different plans
      switch (planId) {
        case PricingPlan.goLive:
          toast.success("Go Live plan activated! Your portfolio will include CV2WEB branding.")
          // Redirect to portfolio generation with branded template
          router.push(`/dashboard/my-website?template=resume2web_branded&jobId=${jobId}`)
          break
          
        case PricingPlan.getHired:
          toast.success("Get Hired plan activated! You have 3 generation attempts.")
          // Redirect to template selection
          router.push(`/dashboard/my-website?jobId=${jobId}`)
          break
          
        case PricingPlan.turnHeads:
          toast.success("Turn Heads plan activated! Our team will contact you shortly.")
          // Redirect to premium onboarding
          router.push(`/dashboard/premium-onboarding?jobId=${jobId}`)
          break
      }
      
      onPlanSelected(planId)
      if (onClose) onClose()
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Payment processing failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-7xl mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {/* Content */}
        <div className="p-4 md:p-8">
          <SimplePricingWithThreeTiers 
            onSelectPlan={handlePlanSelect}
          />
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>All plans include instant portfolio generation</p>
            <p>Questions? Contact us at support@cv2web.com</p>
          </div>
        </div>
      </div>
    </div>
  )
} 