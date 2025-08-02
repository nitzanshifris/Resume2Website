"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PricingModalProps {
  isOpen: boolean
  onPlanSelected: (planId: string) => void
  onClose?: () => void
}

const pricingTiers = [
  {
    id: "basic",
    title: "Website Portfolio Generation + 1 Month Online",
    price: 29,
    features: [
      "Professional website created",
      "1 month online access",
      "Basic support"
    ],
    buttonText: "Get Started",
    buttonVariant: "secondary" as const
  },
  {
    id: "popular",
    title: "Website Portfolio Generation + 6 Months Online (-25%)",
    price: 79,
    originalPrice: 105,
    badge: "Most Popular",
    badgeColor: "emerald" as const,
    features: [
      "Professional website created",
      "6 months online access",
      "Priority support",
      "Save $26 (25% off)"
    ],
    buttonText: "Choose Best Value",
    buttonVariant: "default" as const,
    isPopular: true
  },
  {
    id: "premium",
    title: "Website Portfolio Generation + Custom Domain + 12 Months Online (-33%)",
    price: 149,
    originalPrice: 223,
    badge: "Best Deal",
    badgeColor: "blue" as const,
    features: [
      "Professional website created",
      "Your own custom domain (johnsmith.com)",
      "12 months online access",
      "Premium support",
      "Save $74 (33% off)"
    ],
    buttonText: "Fully Customized",
    buttonVariant: "premium" as const,
    description: "Custom Domain = Your own web address"
  }
]

export default function PricingModal({ isOpen, onPlanSelected, onClose }: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showHostingInfo, setShowHostingInfo] = useState(false)

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
    setSelectedPlan(planId)
    setIsProcessing(true)

    await new Promise(resolve => setTimeout(resolve, 2000))
    
    onPlanSelected(planId)
    setIsProcessing(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-6xl mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-600 hover:text-gray-800" />
          </button>
        )}
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Almost Ready! Pick Your Plan
          </h1>
          
          <p className="text-lg text-gray-600 mb-4">
            Keeping your website secured & accessible 24/7
          </p>

          {/* Hosting Info */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setShowHostingInfo(!showHostingInfo)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Info className="w-4 h-4" />
              Why does keeping a website online cost money?
            </button>
          </div>

          {showHostingInfo && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 leading-relaxed">
                Just like rent for an apartment, websites need a place to live online. This covers the servers and technology that keep your website accessible 24/7.
              </p>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {pricingTiers.map((tier, index) => (
            <div
              key={tier.id}
              className={cn(
                "relative",
                tier.isPopular && "transform md:scale-105 md:-translate-y-2"
              )}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge 
                    className={cn(
                      "px-3 py-1 text-xs font-medium",
                      tier.badgeColor === "emerald" && "bg-emerald-500 text-white",
                      tier.badgeColor === "blue" && "bg-blue-500 text-white"
                    )}
                  >
                    {tier.badgeColor === "emerald" && <Star className="w-3 h-3 mr-1" />}
                    {tier.badgeColor === "blue" && <Crown className="w-3 h-3 mr-1" />}
                    {tier.badge}
                  </Badge>
                </div>
              )}

              <Card className={cn(
                "p-6 h-full transition-all duration-300 hover:shadow-xl",
                tier.isPopular && "border-2 border-emerald-200 shadow-lg",
                selectedPlan === tier.id && "ring-2 ring-blue-500"
              )}>
                {/* Card Header */}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 min-h-[3rem] flex items-center justify-center">
                    {tier.title}
                  </h3>
                  
                  <div className="mb-4">
                    {tier.originalPrice && (
                      <div className="text-sm text-gray-500 line-through mb-1">
                        ${tier.originalPrice}
                      </div>
                    )}
                    <div className="text-3xl font-bold text-gray-900">
                      ${tier.price}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Description */}
                {tier.description && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 text-center">
                      {tier.description}
                    </p>
                  </div>
                )}

                {/* Button */}
                <Button
                  onClick={() => handlePlanSelect(tier.id)}
                  disabled={isProcessing}
                  className={cn(
                    "w-full py-3 font-semibold transition-all duration-300",
                    tier.buttonVariant === "default" && "bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white border-0",
                    tier.buttonVariant === "secondary" && "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300",
                    tier.buttonVariant === "premium" && "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 text-white border-0",
                    selectedPlan === tier.id && isProcessing && "opacity-75"
                  )}
                >
                  {selectedPlan === tier.id && isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    tier.buttonText
                  )}
                </Button>
              </Card>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500">
          Choose a plan to continue. You can always upgrade later.
        </div>

        {/* Decorative gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 p-[1px] pointer-events-none -z-10">
          <div className="w-full h-full bg-white rounded-2xl"></div>
        </div>
      </div>
    </div>
  )
} 