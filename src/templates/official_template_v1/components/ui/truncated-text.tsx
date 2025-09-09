"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { X, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TruncatedTextProps {
  text: string
  maxLines?: number
  className?: string
  expandButtonClassName?: string
  expandButtonText?: string
  modalTitle?: string
}

export function TruncatedText({
  text,
  maxLines = 3,
  className,
  expandButtonClassName,
  expandButtonText = "Read more",
  modalTitle = "Full Text"
}: TruncatedTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        // Get the actual container height available in the card
        const container = textRef.current.closest('.smart-card-content') || textRef.current.parentElement
        if (container) {
          // Use the container's available height minus some padding
          const containerHeight = container.clientHeight
          const availableHeight = Math.max(containerHeight - 80, 120) // Reserve space for read more button + padding
          setIsTruncated(textRef.current.scrollHeight > availableHeight)
        } else {
          // Fallback to line-based calculation if container not found
          const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight)
          const maxHeight = lineHeight * maxLines
          setIsTruncated(textRef.current.scrollHeight > maxHeight)
        }
      }
    }

    checkTruncation()
    window.addEventListener('resize', checkTruncation)
    return () => window.removeEventListener('resize', checkTruncation)
  }, [text, maxLines])

  return (
    <>
      <div className="relative">
        <div
          ref={textRef}
          className={cn(
            "overflow-y-auto custom-scrollbar h-full",
            className
          )}
        >
          {text}
        </div>
        
        {isTruncated && (
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className={cn(
                "p-0 h-auto font-medium text-primary hover:text-primary/80",
                expandButtonClassName
              )}
            >
              <Maximize2 className="h-3 w-3 mr-1" />
              {expandButtonText}
            </Button>
            <span className="text-xs text-muted-foreground">or scroll in card</span>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <h2 className="text-2xl font-semibold">{modalTitle}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {text}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}