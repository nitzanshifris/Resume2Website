"use client"

import confetti from "canvas-confetti"
import { forwardRef, useImperativeHandle } from "react"

export interface ConfettiRef {
  fire: (options?: confetti.Options) => void
}

interface ConfettiProps {
  className?: string
  manualstart?: boolean
}

export const Confetti = forwardRef<ConfettiRef, ConfettiProps>(
  ({ className, manualstart = false }, ref) => {
    const fire = (options?: confetti.Options) => {
      const defaults = {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      }
      
      confetti({
        ...defaults,
        ...options,
      })
    }

    useImperativeHandle(ref, () => ({
      fire,
    }))

    return null
  }
)

Confetti.displayName = "Confetti"