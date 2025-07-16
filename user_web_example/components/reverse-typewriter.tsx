"use client"

import { useState, useEffect } from "react"

interface ReverseTypewriterProps {
  text: string
  onComplete?: () => void
  delay?: number
  className?: string
}

export function ReverseTypewriter({ text, onComplete, delay = 60, className = "" }: ReverseTypewriterProps) {
  const [displayText, setDisplayText] = useState(text)
  const [index, setIndex] = useState(text.length)

  useEffect(() => {
    if (index > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(text.substring(0, index - 1))
        setIndex((prev) => prev - 1)
      }, delay)

      return () => clearTimeout(timeout)
    } else if (onComplete) {
      // Add small delay before calling onComplete for smoother transition
      setTimeout(onComplete, 100)
    }
  }, [index, text, delay, onComplete])

  return <span className={className}>{displayText}</span>
}
