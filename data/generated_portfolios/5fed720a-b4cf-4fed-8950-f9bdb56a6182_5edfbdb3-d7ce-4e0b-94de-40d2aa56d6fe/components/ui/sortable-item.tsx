"use client"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface SortableItemProps {
  id: string
  title: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export const SortableItem = ({ id, title, checked, onCheckedChange }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
    opacity: isDragging ? 0.8 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between space-x-2 p-2 rounded-md",
        isDragging ? "bg-neutral-700 shadow-lg" : "bg-transparent",
      )}
    >
      <div className="flex items-center gap-2">
        <button {...attributes} {...listeners} className="cursor-grab touch-none p-1">
          <GripVertical className="h-5 w-5 text-neutral-400" />
        </button>
        <Label htmlFor={id} className="capitalize font-sans cursor-pointer">
          {title}
        </Label>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
