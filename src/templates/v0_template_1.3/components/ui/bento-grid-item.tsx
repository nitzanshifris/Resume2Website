import type React from "react"
import { cn } from "@/lib/utils"
import { useEditMode } from "@/contexts/edit-mode-context"

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
}) => {
  const { isEditMode } = useEditMode()
  
  return (
    <div
      className={cn(
        "rounded-xl h-full transition-transform duration-200",
        !isEditMode && "hover:-translate-y-1", // Only apply hover effect in non-edit mode
        "p-6 flex flex-col space-y-4 justify-between",
        "border-2 border-accent",
        "shadow-lg",
        className,
      )}
    >
      {header}
      <div className="transition duration-200">
        <div className="flex items-center gap-2">
          {icon}
          <div className="font-serif font-bold text-card-foreground text-xl md:text-3xl">{title}</div>
        </div>
        <div className="font-sans font-normal text-muted-foreground text-sm sm:text-base mt-2">{description}</div>
      </div>
    </div>
  )
}
