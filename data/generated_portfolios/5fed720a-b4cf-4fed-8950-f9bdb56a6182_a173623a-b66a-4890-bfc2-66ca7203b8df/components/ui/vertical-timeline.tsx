"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import type React from "react"
import { useRef } from "react"

const timelineItemContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
}

export const timelineContentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
}

export const VerticalTimeline = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"]
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <div ref={containerRef} className={cn("relative pl-6 md:pl-8 pr-4 md:pr-8 lg:pr-0 space-y-8 md:space-y-12 overflow-visible", className)}>
      {/* Static theme-aware decorative line */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent/20 via-accent/40 to-accent/20" />
      
      {children}
    </div>
  )
}

export const VerticalTimelineItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      className="relative group overflow-visible"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={timelineItemContainerVariants}
    >
      <motion.div
        className="absolute -left-[2.75rem] top-2 z-10"
        variants={{
          hidden: { scale: 0, opacity: 0 },
          visible: {
            scale: 1,
            opacity: 1,
            transition: {
              duration: 0.4,
              ease: [0.43, 0.13, 0.23, 0.96],
            },
          },
        }}
      >
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-full bg-accent blur-md opacity-40 scale-150" />
        
        {/* Timeline dot */}
        <div className="relative h-3 w-3 rounded-full bg-accent shadow-sm">
          <div className="absolute inset-0 rounded-full bg-accent animate-pulse opacity-50" />
        </div>
      </motion.div>
      {children}
    </motion.div>
  )
}
