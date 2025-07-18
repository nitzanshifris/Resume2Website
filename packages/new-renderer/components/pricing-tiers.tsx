'use client'

import React from 'react'
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

interface PricingTier {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  limitations?: string[]
  badge?: string
  highlighted?: boolean
  buttonText: string
  hostingNote?: string
}

const pricingTiers: PricingTier[] = [
  {
    id: 'go-live',
    name: 'Go Live',
    price: 14.90,
    description: 'Perfect for getting online quickly with CV2WEB branding',
    features: [
      'Professional portfolio website',
      'Mobile responsive design',
      'SEO optimized',
      'Basic customization options',
      'Direct deploy to production',
      '1 generation attempt'
    ],
    limitations: [
      'CV2WEB branding included',
      'Limited template customization'
    ],
    buttonText: 'Start with Go Live',
    badge: 'Most Affordable'
  },
  {
    id: 'get-hired',
    name: 'Get Hired',
    price: 19.90,
    description: 'Stand out with a fully customized portfolio - no watermarks',
    features: [
      'Premium portfolio website',
      'No watermarks or branding',
      'Full template customization',
      '3 generation attempts',
      'Multiple template options',
      'Advanced SEO features',
      'Custom domain ready',
      'First month hosting FREE'
    ],
    limitations: [
      'Refund available if unsatisfied after 3 tries'
    ],
    highlighted: true,
    buttonText: 'Get Hired Now',
    badge: 'Most Popular',
    hostingNote: 'Then $7.90/month for hosting'
  },
  {
    id: 'turn-heads',
    name: 'Turn Heads',
    price: 89.90,
    description: 'Premium service with personalized design by our expert team',
    features: [
      'Custom designed by top web designers',
      'Recruiter-optimized content',
      'Unlimited revisions',
      'Priority support',
      'Custom animations & interactions',
      'Personal branding consultation',
      'LinkedIn optimization tips',
      'First year hosting FREE',
      'Premium domain assistance'
    ],
    buttonText: 'Turn Heads Today',
    badge: 'Premium',
    hostingNote: 'Then $7.90/year for hosting'
  }
]

interface PricingTiersProps {
  onSelectTier?: (tierId: string) => void
  className?: string
}

export const PricingTiers: React.FC<PricingTiersProps> = ({ onSelectTier, className }) => {
  const handleSelectTier = (tierId: string) => {
    if (onSelectTier) {
      onSelectTier(tierId)
    }
  }

  return (
    <div className={cn("grid gap-8 md:grid-cols-3", className)}>
      {pricingTiers.map((tier) => (
        <Card
          key={tier.id}
          className={cn(
            "relative flex flex-col transition-all duration-300",
            tier.highlighted && "border-primary shadow-lg scale-105 md:scale-110"
          )}
        >
          {tier.badge && (
            <Badge
              variant={tier.highlighted ? "default" : "secondary"}
              className="absolute -top-3 left-1/2 -translate-x-1/2"
            >
              {tier.badge}
            </Badge>
          )}
          
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              {tier.id === 'go-live' && <Zap className="h-5 w-5 text-primary" />}
              {tier.id === 'get-hired' && <Sparkles className="h-5 w-5 text-primary" />}
              {tier.id === 'turn-heads' && <Crown className="h-5 w-5 text-primary" />}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">${tier.price}</span>
              <span className="text-muted-foreground">one-time</span>
            </div>
            <CardDescription>{tier.description}</CardDescription>
          </CardHeader>

          <CardContent className="flex-1 space-y-4">
            <div className="space-y-2">
              {tier.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {tier.limitations && tier.limitations.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                {tier.limitations.map((limitation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{limitation}</span>
                  </div>
                ))}
              </div>
            )}

            {tier.hostingNote && (
              <p className="text-xs text-muted-foreground pt-2">
                {tier.hostingNote}
              </p>
            )}
          </CardContent>

          <CardFooter>
            <Button
              className="w-full"
              variant={tier.highlighted ? "default" : "outline"}
              onClick={() => handleSelectTier(tier.id)}
            >
              {tier.buttonText}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default PricingTiers