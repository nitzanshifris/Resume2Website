"use client"
import React, { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, MoveUpDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEditMode } from "@/contexts/edit-mode-context"
import { cn } from "@/lib/utils"

interface DraggableSectionProps {
  id: string
  children: React.ReactNode
}

export function DraggableSection({ id, children }: DraggableSectionProps) {
  const { isEditMode } = useEditMode()
  const [isHovered, setIsHovered] = useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Format section name for display
  const sectionName = id.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())

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
      {/* Enhanced drag handle - only visible in edit mode */}
      <AnimatePresence>
        {isEditMode && (
          <>
            {/* Section overlay when dragging */}
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-blue-500/10 rounded-lg z-30 pointer-events-none"
              />
            )}
            
            {/* Drag handle button */}
            <motion.div
              initial={{ opacity: 0, x: -40, scale: 0.8 }}
              animate={{ 
                opacity: isHovered || isDragging ? 1 : 0.7, 
                x: 0,
                scale: 1
              }}
              exit={{ opacity: 0, x: -40, scale: 0.8 }}
              transition={{ 
                duration: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="absolute left-2 top-20 z-40"
            >
              <div className="relative">
                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && !isDragging && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap"
                    >
                      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
                        <p className="text-sm font-medium text-foreground">Drag to reorder</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{sectionName}</p>
                      </div>
                      {/* Arrow */}
                      <div className="absolute left-full top-1/2 -translate-y-1/2 -translate-x-px">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-border" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Drag button */}
                <button
                  {...attributes}
                  {...listeners}
                  className={cn(
                    "group flex items-center gap-2 px-3 py-3",
                    "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                    "text-white rounded-lg shadow-lg hover:shadow-xl",
                    "cursor-grab active:cursor-grabbing",
                    "transition-all duration-200 transform hover:scale-105",
                    "border border-white/20",
                    isDragging && "cursor-grabbing scale-110 shadow-2xl from-blue-600 to-blue-700"
                  )}
                  aria-label={`Drag to reorder ${sectionName} section`}
                >
                  <GripVertical className="h-5 w-5" />
                  <MoveUpDown className="h-4 w-4 opacity-70" />
                </button>
                
                {/* Pulse effect when not dragging */}
                {!isDragging && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-blue-400/30"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0, 0.3],
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
            
            {/* Section border highlight in edit mode */}
            {(isHovered || isDragging) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none z-20"
              >
                <div className={cn(
                  "absolute inset-0 rounded-lg border-2 border-dashed",
                  isDragging ? "gradient-border-dashed" : "gradient-border-dashed opacity-70"
                )} />
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
      
      {children}
    </div>
  )
}