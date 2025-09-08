"use client"
import React, { useState, useEffect } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react"
import { useEditMode } from "@/contexts/edit-mode-context"
import { cn } from "@/lib/utils"

interface DraggableSectionProps {
  id: string
  children: React.ReactNode
  onMoveUp?: () => void
  onMoveDown?: () => void
  isFirst?: boolean
  isLast?: boolean
}

export function DraggableSection({ 
  id, 
  children, 
  onMoveUp, 
  onMoveDown, 
  isFirst = false, 
  isLast = false 
}: DraggableSectionProps) {
  const { isEditMode } = useEditMode()
  const [isMobile, setIsMobile] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        isDragging && "z-50 opacity-50"
      )}
    >
      {/* Mobile: Up/Down buttons, Desktop: Drag handle */}
      {isEditMode && (
        <>
          {isMobile ? (
            // Mobile controls: Always visible up/down buttons
            <div className="absolute right-2 -top-14 z-[70] flex gap-2">
              <button
                onClick={onMoveUp}
                disabled={isFirst}
                className={cn(
                  "flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-lg shadow-lg transition-all",
                  "active:scale-95",
                  isFirst ? "opacity-30 cursor-not-allowed" : "active:bg-blue-700"
                )}
                aria-label={`Move ${id} section up`}
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                onClick={onMoveDown}
                disabled={isLast}
                className={cn(
                  "flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-lg shadow-lg transition-all",
                  "active:scale-95",
                  isLast ? "opacity-30 cursor-not-allowed" : "active:bg-blue-700"
                )}
                aria-label={`Move ${id} section down`}
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          ) : (
            // Desktop controls: Drag handle
            <div className="absolute right-0 top-20 z-40">
              <button
                {...attributes}
                {...listeners}
                className="flex items-center gap-2 px-3 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-l-lg shadow-lg cursor-grab active:cursor-grabbing transition-colors"
                aria-label={`Drag to reorder ${id} section`}
              >
                <GripVertical className="h-5 w-5" />
                <span className="text-sm font-medium">Drag</span>
              </button>
            </div>
          )}
        </>
      )}
      
      {children}
    </div>
  )
}