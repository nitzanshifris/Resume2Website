"use client"
import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { useEditMode } from "@/contexts/edit-mode-context"
import { cn } from "@/lib/utils"

interface DraggableSectionProps {
  id: string
  children: React.ReactNode
}

export function DraggableSection({ id, children }: DraggableSectionProps) {
  const { isEditMode } = useEditMode()
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        isDragging && "z-50 opacity-50"
      )}
    >
      {/* Simple drag handle - only visible in edit mode */}
      {isEditMode && (
        <div className="absolute left-0 top-20 z-40">
          <button
            {...attributes}
            {...listeners}
            className="flex items-center gap-2 px-3 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg shadow-lg cursor-grab active:cursor-grabbing transition-colors"
            aria-label={`Drag to reorder ${id} section`}
          >
            <GripVertical className="h-5 w-5" />
            <span className="text-sm font-medium">Drag</span>
          </button>
        </div>
      )}
      
      {children}
    </div>
  )
}