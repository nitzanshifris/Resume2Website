"use client"
import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Pencil } from "lucide-react"
import { useEditMode } from "@/contexts/edit-mode-context"

interface EditableTextProps {
  initialValue: string
  onSave: (value: string) => void
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
  textarea?: boolean
  id?: string // Optional unique identifier for this editable text
}

export const EditableText: React.FC<EditableTextProps> = ({
  initialValue,
  onSave,
  className,
  as: Component = "span",
  textarea = false,
  id,
}) => {
  const { isEditMode, currentlyEditing, startEditing, stopEditing } = useEditMode()
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue)
  
  // Generate a stable unique ID if not provided
  const elementId = useMemo(() => 
    id || `editable-${Math.random().toString(36).substr(2, 9)}`, 
    [id]
  )

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // Listen for global editing state changes
  useEffect(() => {
    // If another element started editing, exit our editing mode
    if (currentlyEditing && currentlyEditing !== elementId && isEditing) {
      setIsEditing(false)
      setValue(initialValue) // Reset to original value since we're cancelling
    }
  }, [currentlyEditing, elementId, isEditing, initialValue])

  const handleSave = () => {
    onSave(value)
    setIsEditing(false)
    stopEditing(elementId)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !textarea) {
      handleSave()
    } else if (e.key === "Escape") {
      setValue(initialValue)
      setIsEditing(false)
      stopEditing(elementId)
    }
  }

  const handleCancel = () => {
    setValue(initialValue)
    setIsEditing(false)
    stopEditing(elementId)
  }

  const handleStartEdit = () => {
    console.log(`🔄 Attempting to start edit for: ${elementId}`)
    console.log(`🔄 Currently editing: ${currentlyEditing}`)
    
    // Only start editing if allowed by global state
    if (startEditing(elementId)) {
      setIsEditing(true)
      console.log(`✅ Started editing: ${elementId}`)
    } else {
      // Another element is already being edited
      console.log(`❌ Edit BLOCKED for: ${elementId} (${currentlyEditing} is already editing)`)
    }
  }

  const commonProps = {
    className: cn(
      "transition-all duration-200 p-1 -m-1 rounded-md hover:bg-[#3b82f6]/10 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]",
      className,
    ),
  }

  if (isEditing) {
    // Simply use the original className but add our editing border/focus styles
    const inputClasses = cn(
      className, // Keep ALL original styles
      "!bg-background !border-2 !border-[#3b82f6] !shadow-lg !shadow-[#3b82f6]/30 focus:!outline-none focus:!ring-2 focus:!ring-[#3b82f6]",
      "!rounded-md !transition-all !duration-200"
    )
    
    if (textarea) {
      return (
        <div className="relative">
          <Component
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setValue(e.currentTarget.textContent || '')}
            onBlur={(e) => {
              // Check if clicking on hint text
              if (!e.relatedTarget?.classList?.contains('edit-hint')) {
                handleSave()
              }
            }}
            onKeyDown={(e) => {
              // For textarea mode, allow Enter to create new lines
              if (e.key === "Escape") {
                setValue(initialValue)
                setIsEditing(false)
                stopEditing(elementId)
              }
              // Don't handle Enter key for textarea mode - let it create new lines
            }}
            className={inputClasses}
            style={{ outline: 'none', whiteSpace: 'pre-wrap' }}
            ref={(el) => {
              if (el && value !== el.textContent) {
                el.textContent = value
              }
            }}
          />
          <div className="edit-hint absolute -bottom-6 right-0 text-xs text-muted-foreground bg-background px-2 py-1 rounded shadow-sm whitespace-nowrap z-50 pointer-events-none">
            Auto-saving enabled, Esc to cancel
          </div>
        </div>
      )
    }
    // Use contentEditable with the same component structure as the main headline
    return (
      <div className="relative">
        <Component
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setValue(e.currentTarget.textContent || '')}
          onBlur={(e) => {
            // Check if clicking on hint text
            if (!e.relatedTarget?.classList?.contains('edit-hint')) {
              handleSave()
            }
          }}
          onKeyDown={handleKeyDown}
          className={inputClasses}
          style={{ outline: 'none' }}
          ref={(el) => {
            if (el && value !== el.textContent) {
              el.textContent = value
            }
          }}
        />
        <div className="edit-hint absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background px-2 py-1 rounded shadow-sm whitespace-nowrap z-50 pointer-events-none">
          Auto-saving enabled, Esc to cancel
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
      onClick={handleStartEdit}
      className={cn(commonProps.className, "relative group cursor-pointer")}
    >
      {value}
      <Pencil className="h-3 w-3 absolute top-1/2 right-0 -translate-y-1/2 text-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </Component>
  )
}