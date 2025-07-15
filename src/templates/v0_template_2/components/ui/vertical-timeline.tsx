"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type React from "react"

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
  return <div className={cn("relative border-l-2 border-neutral-800 pl-8 space-y-12", className)}>{children}</div>
}

export const VerticalTimelineItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      className="relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={timelineItemContainerVariants}
    >
      <motion.div
        className="absolute -left-[3.0rem] top-1.5 h-4 w-4 rounded-full bg-neutral-700 border-2 border-neutral-800"
        variants={{
          hidden: { scale: 0 },
          visible: {
            scale: 1,
            transition: {
              duration: 0.3,
              ease: [0.43, 0.13, 0.23, 0.96],
            },
          },
        }}
      />
      {children}
    </motion.div>
  )
}
