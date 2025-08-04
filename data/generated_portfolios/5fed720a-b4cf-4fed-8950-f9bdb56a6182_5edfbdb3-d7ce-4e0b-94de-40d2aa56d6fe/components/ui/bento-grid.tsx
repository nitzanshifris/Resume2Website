"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { motion } from "framer-motion"
import { itemVariants } from "./animated-section"
import { EvervaultCard } from "./evervault-card"
import { Trash2 } from "lucide-react"
import { useEditMode } from "@/contexts/edit-mode-context"
import { Button } from "@/components/ui/button"

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return <div className={cn("grid auto-rows-min grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-7xl mx-auto ", className)}>{children}</div>
}

export const BentoGridItem = ({
  className,
  title,
  description,
  icon,
  onDelete,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  onDelete?: () => void
}) => {
  const { isEditMode } = useEditMode()
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "rounded-xl group/bento transition-all duration-300 flex flex-col justify-start p-4 md:p-6 relative",
        "bg-card border border-border shadow-lg",
        "hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/[0.15] hover:border-accent/30",
        "min-h-[320px]",
        className,
      )}
    >
      {/* Delete Button */}
      {isEditMode && onDelete && (
        <Button 
          size="icon" 
          variant="destructive" 
          className="absolute top-2 right-2 z-10 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-200 h-8 w-8 shadow-md"
          onClick={onDelete}
          title="Delete skill category"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      <div className="relative h-24 md:h-28 lg:h-36 w-full flex-shrink-0">
        <EvervaultCard icon={icon} />
      </div>
      <div className="mt-3 md:mt-4 flex flex-col flex-grow">
        <div className="font-bold text-card-foreground text-left mb-2 md:mb-3 text-base md:text-lg lg:text-xl">{title}</div>
        <div className="flex-grow overflow-y-auto">
          {description}
        </div>
      </div>
    </motion.div>
  )
}
