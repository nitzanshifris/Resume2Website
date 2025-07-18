"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Pencil } from "lucide-react"

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

  const commonProps = {
    className: cn(
      "transition-all duration-200 p-1 -m-1 rounded-md hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold",
      className,
    ),
  }

  if (isEditing) {
    if (textarea) {
      return (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          {...commonProps}
          className={cn(commonProps.className, "w-full bg-white border border-gold")}
        />
      )
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        {...commonProps}
        className={cn(commonProps.className, "w-full bg-white border border-gold")}
      />
    )
  }

  return (
    <Component
      {...commonProps}
      onClick={() => setIsEditing(true)}
      className={cn(commonProps.className, "relative group")}
    >
      {value}
      <Pencil className="h-3 w-3 absolute top-1/2 right-0 -translate-y-1/2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </Component>
  )
}
