"use client"
import { EditableText } from "@/components/ui/editable-text"
import { cn } from "@/lib/utils"
import type React from "react"

interface MembershipCardProps {
  organization: string
  role: string
  period: string
  onSaveOrganization: (value: string) => void
  onSaveRole: (value: string) => void
  onSavePeriod: (value: string) => void
  style?: React.CSSProperties
}

export function MembershipCard({
  organization,
  role,
  period,
  onSaveOrganization,
  onSaveRole,
  onSavePeriod,
  style,
}: MembershipCardProps) {
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
      <div className="relative z-10 space-y-2">
        <EditableText
          as="h3"
          initialValue={organization}
          onSave={onSaveOrganization}
          className="text-xl sm:text-3xl font-bold font-serif text-card-foreground [text-shadow:_0_1px_2px_hsl(var(--background)_/_80%)] hover:bg-transparent focus:bg-black/20 focus:ring-accent"
        />
        <EditableText
          as="p"
          initialValue={role}
          onSave={onSaveRole}
          className="text-base sm:text-xl font-sans text-card-foreground/80 [text-shadow:_0_1px_2px_hsl(var(--background)_/_60%)] hover:bg-transparent focus:bg-black/20 focus:ring-accent"
        />
        <EditableText
          as="p"
          initialValue={period}
          onSave={onSavePeriod}
          className="text-sm font-sans text-card-foreground/60 [text-shadow:_0_1px_2px_hsl(var(--background)_/_40%)] hover:bg-transparent focus:bg-black/20 focus:ring-accent"
        />
      </div>
    </div>
  )
}
