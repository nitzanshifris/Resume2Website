import type React from "react"
import { cn } from "@/lib/utils"
import { useEditMode } from "@/contexts/edit-mode-context"

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  titleTextSize = 'text-lg sm:text-2xl',
  descriptionTextSize = 'text-sm sm:text-base',
  titleFontWeight = 'font-bold',
  descriptionFontWeight = 'font-normal',
  titleFontFamily = 'font-serif',
  descriptionFontFamily = 'font-sans',
  titleColor = 'text-card-foreground',
  descriptionColor = 'text-muted-foreground',
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
  titleTextSize?: string
  descriptionTextSize?: string
  titleFontWeight?: string
  descriptionFontWeight?: string
  titleFontFamily?: string
  descriptionFontFamily?: string
  titleColor?: string
  descriptionColor?: string
}) => {
  const { isEditMode } = useEditMode()
  
  return (
    <div
      className={cn(
        "group relative rounded-2xl h-full min-h-[200px] transition-all duration-300 ease-out",
        !isEditMode && "hover:-translate-y-1 hover:shadow-2xl", // Enhanced hover effect
        "p-8 flex flex-col justify-between",
        "border-2 border-accent", // Golden border
        "shadow-sm hover:shadow-xl",
        "bg-transparent", // Transparent background
        "backdrop-blur-sm", // Subtle blur effect
        "overflow-hidden",
        className,
      )}
    >
      {/* Very subtle background tint */}
      <div className="absolute inset-0 bg-white/5" />
      
      {/* Accent glow on hover */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        "bg-gradient-to-br from-accent/5 via-transparent to-accent/5"
      )} />
      
      {header}
      <div className="relative z-10 space-y-4">
        <div className="flex items-start gap-4">
          {icon && (
            <div className={cn(
              "flex-shrink-0 p-3 rounded-xl transition-all duration-300",
              "bg-white/10 backdrop-blur-sm",
              "border border-accent/30",
              "group-hover:bg-accent/10 group-hover:border-accent/50",
              "shadow-sm group-hover:shadow-md"
            )}>
              {icon}
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <div className={cn(
                "transition-colors duration-300",
                titleTextSize,
                titleFontWeight,
                titleFontFamily,
                titleColor,
                "group-hover:text-primary",
                "leading-tight"
              )}>{title}</div>
              {description && (
                <div className={cn(
                  "transition-all duration-300",
                  descriptionTextSize,
                  descriptionFontWeight,
                  descriptionFontFamily,
                  descriptionColor,
                  "leading-relaxed",
                  "group-hover:text-foreground"
                )}>{description}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom accent border */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0",
        "transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
      )} />
    </div>
  )
}
