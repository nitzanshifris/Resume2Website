"use client"

import React from 'react'
import { ChevronUp, ChevronDown, Plus, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEditMode } from '@/contexts/edit-mode-context'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface EditableSectionProps {
  children: React.ReactNode
  sectionTitle?: string
  onMoveUp?: () => void
  onMoveDown?: () => void
  onAddItem?: () => void
  onToggleVisibility?: () => void
  showMoveButtons?: boolean
  showAddButton?: boolean
  isFirst?: boolean
  isLast?: boolean
  isVisible?: boolean
}

export function EditableSection({
  children,
  sectionTitle,
  onMoveUp,
  onMoveDown,
  onAddItem,
  onToggleVisibility,
  showMoveButtons = true,
  showAddButton = true,
  isFirst = false,
  isLast = false,
  isVisible = true,
}: EditableSectionProps) {
  const { isEditMode } = useEditMode()

  return (
    <motion.div 
      className="relative group"
      layout
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute -right-16 top-4 flex flex-col gap-1",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            )}
          >
            {onToggleVisibility && (
              <Button
                size="icon"
                variant="outline"
                onClick={onToggleVisibility}
                className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                title={isVisible ? "Hide section" : "Show section"}
              >
                {isVisible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {showMoveButtons && onMoveUp && (
              <Button
                size="icon"
                variant="outline"
                onClick={onMoveUp}
                disabled={isFirst}
                className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                title="Move section up"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            )}
            
            {showMoveButtons && onMoveDown && (
              <Button
                size="icon"
                variant="outline"
                onClick={onMoveDown}
                disabled={isLast}
                className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                title="Move section down"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
            
            {showAddButton && onAddItem && (
              <Button
                size="icon"
                variant="outline"
                onClick={onAddItem}
                className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                title={`Add new item to ${sectionTitle || 'section'}`}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        layout
        className={cn(
          "transition-all duration-300 ease-in-out",
          isEditMode ? "relative ring-1 ring-primary/10 rounded-lg -mx-2 px-2 py-1 hover:ring-primary/20" : ""
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}