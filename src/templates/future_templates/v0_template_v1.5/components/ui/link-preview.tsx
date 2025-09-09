"use client"

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface LinkPreviewProps {
  url: string
  children: React.ReactNode
  className?: string
}

export function LinkPreview({ url, children, className }: LinkPreviewProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute z-50 top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-xl max-w-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-gray-300 rounded-sm flex-shrink-0"></div>
            <p className="font-medium text-sm truncate">{getDomain(url)}</p>
          </div>
          <p className="text-xs text-gray-600">{url}</p>
          <div className="mt-3 p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">Preview loading...</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}