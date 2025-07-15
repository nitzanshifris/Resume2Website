"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { motion } from "framer-motion"
import { itemVariants } from "./animated-section"
import { EvervaultCard } from "./evervault-card"

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return <div className={cn("grid auto-rows-[18rem] grid-cols-3 gap-4 max-w-7xl mx-auto ", className)}>{children}</div>
}

export const BentoGridItem = ({
  className,
  title,
  description,
  icon,
}: {
  className?: string
  title?: string
  description?: React.ReactNode
  icon?: React.ReactNode
}) => {
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "row-span-1 rounded-xl group/bento transition-all duration-300 flex flex-col justify-start p-2 md:p-4",
        "bg-black border-white/[0.1] border shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)]",
        "hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/[0.15] hover:border-white/[0.2]",
        className,
      )}
    >
      <div className="relative h-32 md:h-44 w-full flex-shrink-0">
        <EvervaultCard icon={icon} />
      </div>
      <div className="mt-2 md:mt-4 flex flex-col">
        <div className="font-bold text-white text-center mb-2 text-sm md:text-base">{title}</div>
        {description}
      </div>
    </motion.div>
  )
}
