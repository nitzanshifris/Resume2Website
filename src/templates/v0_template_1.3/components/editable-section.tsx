"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEditMode } from "@/contexts/edit-mode-context"
import { cn } from "@/lib/utils"
import React from "react"

interface EditableSectionProps {
  children: React.ReactNode
  onAddItem?: () => void
  onRemoveSection?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  sectionTitle?: string
  className?: string
  showAddButton?: boolean
  showRemoveButton?: boolean
  showMoveButtons?: boolean
  isFirst?: boolean
  isLast?: boolean
}

export function EditableSection({
  children,
  onAddItem,
  onRemoveSection,
  onMoveUp,
  onMoveDown,
  sectionTitle,
  className,
  showAddButton = true,
  showRemoveButton = true,
  showMoveButtons = false,
  isFirst = false,
  isLast = false,
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
              {showMoveButtons && (
                <div className="flex gap-1">
                  <Button
                    onClick={onMoveUp}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white opacity-90 hover:opacity-100 disabled:opacity-40"
                    disabled={isFirst}
                    title="Move section up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={onMoveDown}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white opacity-90 hover:opacity-100 disabled:opacity-40"
                    disabled={isLast}
                    title="Move section down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {showAddButton && onAddItem && (
                <Button
                  onClick={onAddItem}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white opacity-90 hover:opacity-100"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add {sectionTitle || "Item"}
                </Button>
              )}
              
              {showRemoveButton && onRemoveSection && (
                <Button
                  onClick={onRemoveSection}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white opacity-90 hover:opacity-100"
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
              className="absolute inset-0 border-2 border-dashed border-blue-500/30 rounded-lg pointer-events-none"
            />
          </>
        )}
      </AnimatePresence>

      {children}
    </div>
  )
}