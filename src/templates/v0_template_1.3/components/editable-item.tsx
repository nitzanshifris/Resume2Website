"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, GripVertical, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEditMode } from "@/contexts/edit-mode-context"
import { cn } from "@/lib/utils"
import React from "react"

interface EditableItemProps {
  children: React.ReactNode
  onRemove?: () => void
  onSettings?: () => void
  className?: string
  isDraggable?: boolean
}

export function EditableItem({
  children,
  onRemove,
  onSettings,
  className,
  isDraggable = false,
}: EditableItemProps) {
  const { isEditMode } = useEditMode()

  return (
    <div
      className={cn(
        "relative group/item",
        isEditMode && "hover:ring-2 hover:ring-primary/50 rounded-lg transition-all duration-200",
        className
      )}
    >
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-2 -right-2 flex items-center gap-1 z-20"
          >
            {isDraggable && (
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 cursor-move shadow-md"
              >
                <GripVertical className="h-4 w-4" />
              </Button>
            )}
            
            {onSettings && (
              <Button
                onClick={onSettings}
                size="icon"
                variant="secondary"
                className="h-8 w-8 shadow-md"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
            
            {onRemove && (
              <Button
                onClick={onRemove}
                size="icon"
                variant="destructive"
                className="h-8 w-8 shadow-md"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  )
}