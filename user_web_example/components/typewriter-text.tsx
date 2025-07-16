"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

interface TypewriterTextProps {
  text: string
  delay?: number
  startDelay?: number
  className?: string
  showCheckmark?: boolean
  colorSegments?: { text: string; color: string }[]
}

export function TypewriterText({
  text,
  delay = 50,
  startDelay = 0,
  className = "",
  showCheckmark = false,
  colorSegments = [],
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [index, setIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (startDelay > 0 && !hasStarted) {
      const startTimeout = setTimeout(() => {
        setHasStarted(true)
      }, startDelay)
      return () => clearTimeout(startTimeout)
    } else if (startDelay === 0) {
      setHasStarted(true)
    }
  }, [startDelay, hasStarted])

  useEffect(() => {
    if (hasStarted && index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index])
        setIndex((prev) => prev + 1)
      }, delay)

      return () => clearTimeout(timeout)
    } else if (hasStarted && index >= text.length) {
      setIsComplete(true)
    }
  }, [index, text, delay, hasStarted])

  // Function to render text with colored segments
  const renderColoredText = (text: string) => {
    if (colorSegments.length === 0) {
      return text
    }

    let result = text
    colorSegments.forEach(({ text: segmentText, color }) => {
      result = result.replace(segmentText, `<span style="color: ${color}; font-weight: bold;">${segmentText}</span>`)
    })

    return <span dangerouslySetInnerHTML={{ __html: result }} />
  }

  return (
    <div className="relative inline-flex items-center">
      {showCheckmark && isComplete && (
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5 },
          }}
        >
          <CheckCircle className="w-6 h-6 text-green-500" />
        </motion.div>
      )}
      <span className={`font-bold ${className}`}>
        {colorSegments.length > 0 ? renderColoredText(displayText) : displayText}
      </span>
    </div>
  )
}
