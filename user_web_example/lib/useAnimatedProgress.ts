/**
 * Hook for smoothly animating progress values
 * Ensures linear progression without jumps
 */

import { useState, useEffect, useRef } from 'react'

interface AnimatedProgressOptions {
  duration?: number // Animation duration in ms (default: 30000 for 30 seconds)
  targetProgress: number // Target progress value (0-100)
  enabled: boolean // Whether animation should run
  onComplete?: () => void // Callback when target is reached
}

export function useAnimatedProgress({
  duration = 30000, // 30 seconds to reach 80%
  targetProgress,
  enabled,
  onComplete
}: AnimatedProgressOptions) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const lastProgressRef = useRef(0)
  
  useEffect(() => {
    if (!enabled) {
      // Reset when disabled
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      return
    }
    
    // Start animation
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }
      
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min((elapsed / duration) * targetProgress, targetProgress)
      
      // Only update if progress increased (never go backwards)
      if (progress > lastProgressRef.current) {
        lastProgressRef.current = progress
        setAnimatedProgress(progress)
      }
      
      if (progress < targetProgress) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Animation complete
        if (onComplete) {
          onComplete()
        }
      }
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [enabled, targetProgress, duration, onComplete])
  
  // If portfolio is ready early, jump to target
  const jumpToTarget = () => {
    if (animatedProgress < targetProgress) {
      setAnimatedProgress(targetProgress)
      lastProgressRef.current = targetProgress
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      if (onComplete) {
        onComplete()
      }
    }
  }
  
  return {
    progress: animatedProgress,
    jumpToTarget
  }
}