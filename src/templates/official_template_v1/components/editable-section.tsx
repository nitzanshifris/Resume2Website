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
            {/* AddItem Button - Below the button line */}
            {showAddButton && onAddItem && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-36 right-0 flex items-center gap-2 z-30"
              >
                <Button
                  onClick={onAddItem}
                  className="flex items-center gap-2 px-3 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add {sectionTitle || "Item"}
                </Button>
              </motion.div>
            )}

            {/* Up/Down and Remove Buttons - Right Side */}
            {(showMoveButtons || (showRemoveButton && onRemoveSection)) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-20 right-24 flex items-center gap-2 z-30"
              >
                
                {showRemoveButton && onRemoveSection && (
                  <Button
                    onClick={onRemoveSection}
                    className="flex items-center justify-center px-3 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </motion.div>
            )}

            {/* Edit Mode Border */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 gradient-border-dashed rounded-lg pointer-events-none"
            />
          </>
        )}
      </AnimatePresence>

      {children}
    </div>
  )
}