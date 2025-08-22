import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useEditMode } from "@/contexts/edit-mode-context"
import { ClientOnly } from "./client-only"

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
  iconData,
  onIconUpdate,
  onIconClick,
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
  iconData?: any // The raw icon data object
  onIconUpdate?: (newIcon: any) => void // Function to update icon
  onIconClick?: () => void // Function to handle icon clicks
}) => {
  const { isEditMode } = useEditMode()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <div
      className={cn(
        "group relative rounded-2xl h-full min-h-[120px] transition-all duration-300 ease-out",
        !isEditMode && "hover:shadow-2xl", // Enhanced hover effect without translation
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
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />
      
      {/* Accent glow on hover */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
        "bg-gradient-to-br from-accent/5 via-transparent to-accent/5"
      )} />
      
      {header}
      <div className="relative z-10 space-y-4">
        <div className="flex items-start gap-4">
          {icon && (
            <div 
              className={cn(
                "flex-shrink-0 p-3 rounded-xl transition-all duration-300 relative group/icon-container",
                "bg-white/10 backdrop-blur-sm",
                "shadow-sm",
                "flex items-center justify-center",
                isEditMode ? "gradient-border-dashed cursor-pointer" : "border border-accent/30",
                onIconClick && isEditMode && "cursor-pointer hover:bg-white/20"
              )}
              onClick={onIconClick && isEditMode ? (e) => {
                e.preventDefault()
                e.stopPropagation()
                onIconClick()
              } : undefined}
              title={onIconClick && isEditMode ? "Click to edit icon" : undefined}
            >
              {icon}
              
              {/* Zoom Controls for Uploaded Icons */}
              <ClientOnly>
                {isEditMode && iconData && typeof iconData === 'object' && iconData?.type === 'upload' && onIconUpdate && (
                  <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex gap-1 z-[99999]">
                    <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      e.nativeEvent?.stopImmediatePropagation?.()
                      const currentScale = iconData.scale !== undefined ? iconData.scale : 2
                      const newScale = Math.max(0.5, currentScale - 0.2)
                      onIconUpdate({ ...iconData, scale: newScale })
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      e.nativeEvent?.stopImmediatePropagation?.()
                    }}
                    onPointerDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    className="w-6 h-6 bg-white dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-500 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 shadow-xl transition-colors relative z-[99999]"
                    title="Zoom out"
                    style={{ pointerEvents: 'all' }}
                  >
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 pointer-events-none select-none">−</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      e.nativeEvent?.stopImmediatePropagation?.()
                      const currentScale = iconData.scale !== undefined ? iconData.scale : 2
                      const newScale = Math.min(2, currentScale + 0.2)
                      onIconUpdate({ ...iconData, scale: newScale })
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      e.nativeEvent?.stopImmediatePropagation?.()
                    }}
                    onPointerDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    className="w-6 h-6 bg-white dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-500 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 shadow-xl transition-colors relative z-[99999]"
                    title="Zoom in"
                    style={{ pointerEvents: 'all' }}
                  >
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 pointer-events-none select-none">+</span>
                  </button>
                </div>
              )}
              </ClientOnly>
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
                "group-hover:!text-accent",
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

// Add displayName for React dev tools and component identification
BentoGridItem.displayName = 'BentoGridItem'
