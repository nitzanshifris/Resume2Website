"use client"

import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEditMode } from '@/contexts/edit-mode-context'
import { useTheme } from '@/contexts/theme-context'
import { GripVertical, ArrowUpDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DraggableSectionProps {
  id: string
  children: React.ReactNode
}

export function DraggableSection({ id, children }: DraggableSectionProps) {
  const { isEditMode } = useEditMode()
  const { theme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })
  
  // Get theme-specific gradients
  const getThemeColors = () => {
    switch (theme) {
      case "blue":
        return {
          gradient: "from-blue-600 to-cyan-600",
          pulseGradient: "from-blue-400 to-cyan-400",
          shadowColor: "rgba(59,130,246,0.5)",
          shadowColorHover: "rgba(59,130,246,0.8)",
          borderColor: "border-blue-500"
        }
      case "green":
        return {
          gradient: "from-green-600 to-emerald-600",
          pulseGradient: "from-green-400 to-emerald-400",
          shadowColor: "rgba(34,197,94,0.5)",
          shadowColorHover: "rgba(34,197,94,0.8)",
          borderColor: "border-green-500"
        }
      case "orange":
        return {
          gradient: "from-orange-600 to-red-600",
          pulseGradient: "from-orange-400 to-red-400",
          shadowColor: "rgba(249,115,22,0.5)",
          shadowColorHover: "rgba(249,115,22,0.8)",
          borderColor: "border-orange-500"
        }
      case "purple":
      default:
        return {
          gradient: "from-purple-600 to-pink-600",
          pulseGradient: "from-purple-400 to-pink-400",
          shadowColor: "rgba(168,85,247,0.5)",
          shadowColorHover: "rgba(168,85,247,0.8)",
          borderColor: "border-purple-500"
        }
    }
  }
  
  const themeColors = getThemeColors()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Format section name for display
  const sectionName = id.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())

  if (!isEditMode) {
    return <>{children}</>
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        isDragging && "z-50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section overlay when dragging */}
      <AnimatePresence mode="wait">
        {isDragging && (
          <motion.div
            key={`overlay-${id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-accent/10 rounded-lg z-30 pointer-events-none"
          />
        )}
      </AnimatePresence>
      
      {/* Glowing bar indicator */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ 
          opacity: isHovered || isDragging ? 1 : 0.7, 
          scaleY: 1
        }}
        transition={{ 
          duration: 0.2,
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        className="absolute left-0 top-20 z-40 h-16"
      >
        {/* Glowing vertical bar */}
        <div className="relative h-full">
          <div 
            className={cn(
              "h-full w-1 bg-gradient-to-b rounded-full",
              themeColors.gradient
            )}
            style={{
              boxShadow: isDragging 
                ? `0 0 20px ${themeColors.shadowColorHover}` 
                : `0 0 10px ${themeColors.shadowColor}`
            }}
          />
          
          {/* Pulse effect on the bar */}
          {!isDragging && (
            <motion.div
              className={cn("absolute inset-0 rounded-full bg-gradient-to-b pointer-events-none", themeColors.pulseGradient)}
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          )}
        </div>
      </motion.div>
      
      {/* Drag handle button - positioned to the left of the glowing bar */}
      <motion.div
        initial={{ opacity: 0, x: -60, scale: 0.8 }}
        animate={{ 
          opacity: isHovered || isDragging ? 1 : 0, 
          x: isHovered || isDragging ? -50 : -40,
          scale: 1
        }}
        transition={{ 
          duration: 0.2,
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        className="absolute left-0 top-20 z-40"
      >
        <div className="relative">
          {/* Tooltip */}
          <AnimatePresence mode="wait">
            {isHovered && !isDragging && (
              <motion.div
                key={`tooltip-${id}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <div className="bg-background/95 backdrop-blur-sm border border-neutral-700 rounded-lg px-3 py-2 shadow-lg">
                  <p className="text-sm font-medium text-foreground">Drag to reorder</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{sectionName}</p>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-px">
                  <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-neutral-700" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Drag button */}
          <button
            {...attributes}
            {...listeners}
            className={cn(
              "group flex items-center gap-1 p-2",
              cn("bg-gradient-to-r", themeColors.gradient),
              "text-foreground rounded-lg shadow-lg hover:shadow-xl",
              "cursor-grab active:cursor-grabbing",
              "transition-all duration-200 transform hover:scale-105",
              "border border-white/20",
              isDragging && "cursor-grabbing scale-110 shadow-2xl"
            )}
            aria-label={`Drag to reorder ${sectionName} section`}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
      
      {/* Section border highlight in edit mode */}
      <AnimatePresence mode="wait">
        {(isHovered || isDragging) && (
          <motion.div
            key={`border-${id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-20"
          >
            <div className={cn(
              "absolute inset-0 rounded-lg border-2 border-dashed",
              isDragging ? themeColors.borderColor : "border-accent/50"
            )} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {children}
    </div>
  )
}