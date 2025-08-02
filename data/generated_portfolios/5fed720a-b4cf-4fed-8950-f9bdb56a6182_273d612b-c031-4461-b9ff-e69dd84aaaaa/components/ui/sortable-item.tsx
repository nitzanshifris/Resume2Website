"use client"
import type React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

export function SortableItem({
  id,
  children,
  className,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: { 
  id: string
  children: React.ReactNode
  className?: string
  onMoveUp?: () => void
  onMoveDown?: () => void
  isFirst?: boolean
  isLast?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("flex items-center gap-2", isDragging && "bg-secondary/50 rounded-md", className)}
      {...attributes}
      {...listeners}
    >
      <div className="flex flex-col gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-muted-foreground hover:text-foreground disabled:opacity-50"
          onClick={(e) => {
            e.stopPropagation()
            onMoveUp?.()
          }}
          disabled={isFirst}
          aria-label="Move up"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-muted-foreground hover:text-foreground disabled:opacity-50"
          onClick={(e) => {
            e.stopPropagation()
            onMoveDown?.()
          }}
          disabled={isLast}
          aria-label="Move down"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  )
}
