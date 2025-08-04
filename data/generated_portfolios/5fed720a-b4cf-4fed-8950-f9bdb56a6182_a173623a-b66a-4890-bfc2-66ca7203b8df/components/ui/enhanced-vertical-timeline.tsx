"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import type React from "react"
import { useRef, useState } from "react"
import { Calendar, Building2, ChevronDown, ChevronUp } from "lucide-react"

const timelineItemContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const timelineContentVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

// Enhanced Timeline Container with animated line
export const EnhancedVerticalTimeline = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"]
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <div ref={containerRef} className={cn("relative pl-8 pr-8 lg:pr-0 space-y-16 overflow-visible", className)}>
      {/* Static Line */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-background" />
      
      {/* Animated Line */}
      <motion.div 
        className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500"
        style={{ height: lineHeight }}
      />
      
      {children}
    </div>
  )
}

// Enhanced Timeline Item with expand/collapse and better visual hierarchy
export const EnhancedVerticalTimelineItem = ({ 
  children, 
  period, 
  company,
  logo,
  isFirst = false,
  isLast = false 
}: { 
  children: React.ReactNode
  period: string
  company?: string
  logo?: React.ReactNode
  isFirst?: boolean
  isLast?: boolean
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  
  return (
    <motion.div
      className="relative group overflow-visible"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={timelineItemContainerVariants}
    >
      {/* Timeline Node - Enhanced with gradient and pulse */}
      <motion.div
        className="absolute -left-[3.2rem] top-6 z-10"
        variants={{
          hidden: { scale: 0 },
          visible: {
            scale: 1,
            transition: {
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            },
          },
        }}
      >
        <div className="relative">
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-20" />
          
          {/* Main node */}
          <div className="relative h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-background shadow-lg">
            {/* Inner dot */}
            <div className="absolute inset-1 rounded-full bg-white dark:bg-background" />
          </div>
        </div>
      </motion.div>

      {/* Date Badge - Floating design */}
      <motion.div
        className="absolute -left-[8rem] top-4 w-20"
        variants={{
          hidden: { opacity: 0, x: -20 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.5,
              delay: 0.2,
            },
          },
        }}
      >
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 backdrop-blur-sm rounded-lg p-2 border border-purple-500/20 dark:border-purple-500/30">
          <Calendar className="w-3 h-3 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
          <p className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">{period}</p>
        </div>
      </motion.div>

      {/* Content Container */}
      <motion.div 
        className="ml-8 relative"
        variants={timelineContentVariants}
      >
        <div className={cn(
          "bg-white dark:bg-background/50 rounded-xl p-6 border shadow-lg transition-all duration-300",
          "border-gray-200 dark:border-neutral-800",
          "hover:shadow-xl hover:border-purple-500/30 dark:hover:border-purple-500/30",
          "group-hover:translate-x-1"
        )}>
          {/* Header with company logo */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {logo && (
                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-background flex items-center justify-center overflow-hidden">
                  {logo}
                </div>
              )}
              <div>
                {company && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Building2 className="w-3 h-3" />
                    <span>{company}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Expand/Collapse button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>

          {/* Collapsible Content */}
          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0
            }}
            transition={{
              height: { duration: 0.3, ease: "easeInOut" },
              opacity: { duration: 0.2 }
            }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        </div>

        {/* Connection line to next item */}
        {!isLast && (
          <div className="absolute left-[-2.5rem] top-full h-16 w-[2px] bg-gradient-to-b from-gray-200 to-transparent dark:from-neutral-800" />
        )}
      </motion.div>
    </motion.div>
  )
}

// Company Logo Component
export const CompanyLogo = ({ src, alt, name }: { src?: string; alt?: string; name?: string }) => {
  if (src) {
    return <img src={src} alt={alt || name} className="w-full h-full object-contain" />
  }
  
  // Fallback to company initial
  if (name) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-lg">
        {name.charAt(0).toUpperCase()}
      </div>
    )
  }
  
  return <Building2 className="w-6 h-6 text-gray-400" />
}