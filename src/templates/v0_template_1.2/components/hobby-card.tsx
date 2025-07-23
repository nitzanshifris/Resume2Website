"use client"
import { EditableText } from "@/components/ui/editable-text"
import { cn } from "@/lib/utils"
import type React from "react"

interface HobbyCardProps {
  title: string
  onSave: (value: string) => void
  style?: React.CSSProperties
}

export function HobbyCard({ title, onSave, style }: HobbyCardProps) {
  return (
    <div
      className={cn(
        "relative h-64 w-full overflow-hidden rounded-xl group p-6 flex flex-col justify-center items-center text-center",
        "bg-card",
        "border-2 border-border/50 shadow-lg",
        "transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-border",
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0" style={style} />

      {/* Content */}
      <div className="relative z-10">
        <EditableText
          as="h3"
          initialValue={title}
          onSave={onSave}
          className="text-3xl font-bold font-serif text-card-foreground [text-shadow:_0_1px_2px_hsl(var(--background)_/_80%)] hover:bg-transparent focus:bg-black/20 focus:ring-accent"
        />
      </div>
    </div>
  )
}
