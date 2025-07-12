"use client"

import { useState, useEffect, memo } from "react"
import { motion } from "framer-motion"

const TypingAnimationComponent = ({
  text,
  duration = 50,
  className,
}: {
  text: string
  duration?: number
  className?: string
}) => {
  const [displayedText, setDisplayedText] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    setDisplayedText("")
    setIsCompleted(false)
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
        setIsCompleted(true)
      }
    }, duration)

    return () => {
      clearInterval(typingInterval)
    }
  }, [text, duration])

  return (
    <span className={className}>
      {displayedText}
      {!isCompleted && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="inline-block h-5 w-0.5 bg-foreground/80 ml-1"
          style={{ transform: "translateY(4px)" }}
        />
      )}
    </span>
  )
}

export const TypingAnimation = memo(TypingAnimationComponent)
