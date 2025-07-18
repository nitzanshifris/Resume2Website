"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Resume2WebBrandingProps {
  className?: string
  position?: "header" | "footer" | "watermark"
  size?: "small" | "medium" | "large"
}

export function Resume2WebBranding({ 
  className, 
  position = "footer",
  size = "medium" 
}: Resume2WebBrandingProps) {
  const sizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base"
  }

  const positionClasses = {
    header: "fixed top-4 right-4 z-50",
    footer: "fixed bottom-4 right-4 z-50",
    watermark: "fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className={cn(
        positionClasses[position],
        "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 border border-gray-200 dark:border-gray-700",
        className
      )}
    >
      <a
        href="https://cv2web.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "text-primary",
            size === "small" && "w-4 h-4",
            size === "medium" && "w-5 h-5",
            size === "large" && "w-6 h-6"
          )}
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={cn("font-medium", sizeClasses[size])}>
          Powered by <span className="font-bold">CV2WEB</span>
        </span>
      </a>
    </motion.div>
  )
}

// Alternative minimal branding for less intrusive display
export function Resume2WebMinimalBranding({ className }: { className?: string }) {
  return (
    <div className={cn("fixed bottom-2 right-2 z-50 opacity-60 hover:opacity-100 transition-opacity", className)}>
      <a
        href="https://cv2web.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
      >
        <span>Made with</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-semibold">CV2WEB</span>
      </a>
    </div>
  )
}