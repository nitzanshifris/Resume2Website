"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEditMode } from "@/contexts/edit-mode-context"
import { cn } from "@/lib/utils"
import React from "react"

interface EditableSectionProps {
  children: React.ReactNode
  onAddItem?: () => void
  onRemoveSection?: () => void
  sectionTitle?: string
  className?: string
  showAddButton?: boolean
  showRemoveButton?: boolean
  isDraggable?: boolean
}

export function EditableSection({
  children,
  onAddItem,
  onRemoveSection,
  sectionTitle,
  className,
  showAddButton = true,
  showRemoveButton = true,
  isDraggable = false,
}: EditableSectionProps) {
  const { isEditMode } = useEditMode()

  return (
    <div
      className={cn(
        "relative group/section",
        isEditMode && "transition-all duration-300",
        className
      )}
    >
      <AnimatePresence>
        {isEditMode && (
          <>
            {/* Section Controls */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-12 right-0 flex items-center gap-2 z-30"
            >
              {isDraggable && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="cursor-move opacity-70 hover:opacity-100"
                >
                  <GripVertical className="h-4 w-4" />
                </Button>
              )}
              
              {showAddButton && onAddItem && (
                <Button
                  onClick={onAddItem}
                  size="sm"
                  variant="secondary"
                  className="opacity-70 hover:opacity-100"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add {sectionTitle || "Item"}
                </Button>
              )}
              
              {showRemoveButton && onRemoveSection && (
                <Button
                  onClick={onRemoveSection}
                  size="sm"
                  variant="destructive"
                  className="opacity-70 hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </motion.div>

            {/* Edit Mode Border */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-lg pointer-events-none"
            />
          </>
        )}
      </AnimatePresence>

      {children}
    </div>
  )
}