"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Pencil } from "lucide-react"
import { useEditMode } from "@/contexts/edit-mode-context"

interface EditableTextProps {
  initialValue: string
  onSave: (value: string) => void
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
  textarea?: boolean
}

export const EditableText: React.FC<EditableTextProps> = ({
  initialValue,
  onSave,
  className,
  as: Component = "span",
  textarea = false,
}) => {
  const { isEditMode } = useEditMode()
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleSave = () => {
    onSave(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !textarea) {
      handleSave()
    } else if (e.key === "Escape") {
      setValue(initialValue)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setValue(initialValue)
    setIsEditing(false)
  }

  const commonProps = {
    className: cn(
      "transition-all duration-200 p-1 -m-1 rounded-md hover:bg-[#3b82f6]/10 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]",
      className,
    ),
  }

  if (isEditing) {
    const inputClasses = cn(
      commonProps.className,
      "w-full bg-background border-2 border-[#3b82f6] shadow-lg shadow-[#3b82f6]/30 text-foreground",
      // Preserve text alignment
      className?.includes('text-center') && 'text-center',
      className?.includes('text-right') && 'text-right'
    )
    
    if (textarea) {
      return (
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={(e) => {
              // Check if clicking on hint text
              if (!e.relatedTarget?.classList?.contains('edit-hint')) {
                handleSave()
              }
            }}
            onKeyDown={handleKeyDown}
            autoFocus
            className={inputClasses}
          />
          <div className="edit-hint absolute -bottom-6 right-0 text-xs text-muted-foreground bg-background px-2 py-1 rounded shadow-sm">
            Press Enter to save, Esc to cancel
          </div>
        </div>
      )
    }
    return (
      <div className="relative inline-block w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={(e) => {
            // Check if clicking on hint text
            if (!e.relatedTarget?.classList?.contains('edit-hint')) {
              handleSave()
            }
          }}
          onKeyDown={handleKeyDown}
          autoFocus
          className={inputClasses}
        />
        <div className="edit-hint absolute -bottom-6 left-0 text-xs text-muted-foreground bg-background px-2 py-1 rounded shadow-sm whitespace-nowrap z-50">
          Press Enter to save, Esc to cancel
        </div>
      </div>
    )
  }

  // Only allow editing in edit mode
  if (!isEditMode) {
    return (
      <Component className={className}>
        {value}
      </Component>
    )
  }

  return (
    <Component
      {...commonProps}
      onClick={() => setIsEditing(true)}
      className={cn(commonProps.className, "relative group cursor-pointer")}
    >
      {value}
      <Pencil className="h-3 w-3 absolute top-1/2 right-0 -translate-y-1/2 text-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </Component>
  )
}

