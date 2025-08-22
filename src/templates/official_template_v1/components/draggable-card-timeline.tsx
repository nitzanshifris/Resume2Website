"use client"
import type React from "react"
import { cn } from "@/lib/utils"
import { useEditMode } from "@/contexts/edit-mode-context"
import { DraggableList } from "@/components/draggable-list"
import { motion } from "framer-motion"
import { Calendar, GripVertical } from "lucide-react"

interface TimelineItem<T> {
  data: T
  side: 'left' | 'right'
}

interface DraggableCardTimelineProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  onReorder?: (newItems: T[]) => void
  keyExtractor?: (item: T, index: number) => string
  containerClassName?: string
  getYearFromItem?: (item: T) => string
}

export function DraggableCardTimeline<T>({
  items,
  renderItem,
  onReorder,
  keyExtractor = (item, index) => `timeline-item-${index}`,
  containerClassName,
  getYearFromItem,
}: DraggableCardTimelineProps<T>) {
  const { isEditMode } = useEditMode()

  if (!items || items.length === 0) {
    return null
  }

  // Convert items to timeline format with alternating sides
  const timelineItems: TimelineItem<T>[] = items.map((item, index) => ({
    data: item,
    side: index % 2 === 0 ? 'left' : 'right'
  }))

  // Timeline Item Component
  const TimelineItemRow = ({ 
    item,
    index,
    year
  }: { 
    item: TimelineItem<T>
    index: number
    year?: string
  }) => {
    const isLeft = item.side === 'left'
    
    return (
      <div className="relative">
        {/* Desktop Layout - 2 columns with center timeline */}
        <div className="hidden md:grid md:grid-cols-[1fr,auto,1fr] gap-8 items-start">
          {/* Left Column */}
          <div className={cn(
            "relative",
            !isLeft && "opacity-0 pointer-events-none"
          )}>
            {isLeft && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative"
              >
                {/* Year badge on the right edge for left cards */}
                {year && (
                  <div className="absolute -right-24 top-4 text-sm font-bold text-accent/60 whitespace-nowrap">
                    {year}
                  </div>
                )}
                {renderItem(item.data, index)}
              </motion.div>
            )}
          </div>

          {/* Center Timeline */}
          <div className="relative flex flex-col items-center w-12">
            {/* Timeline Dot */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3, type: "spring" }}
              className="relative z-20"
            >
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-full bg-accent/20 blur-md scale-150" />
              
              {/* Main dot */}
              <div className={cn(
                "relative flex h-12 w-12 items-center justify-center rounded-full",
                "bg-accent shadow-xl border-4 border-background",
                "transition-all duration-300",
                "hover:scale-110 hover:shadow-2xl"
              )}>
                <div className="h-3 w-3 rounded-full bg-accent-foreground" />
              </div>
            </motion.div>

            {/* Connecting Line */}
            {index < items.length - 1 && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                className="absolute top-12 w-0.5 bg-gradient-to-b from-accent/40 via-accent/20 to-accent/40"
                style={{ height: "calc(100% + 3rem)" }}
              />
            )}
          </div>

          {/* Right Column */}
          <div className={cn(
            "relative",
            isLeft && "opacity-0 pointer-events-none"
          )}>
            {!isLeft && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative"
              >
                {/* Year badge on the left edge for right cards */}
                {year && (
                  <div className="absolute -left-24 top-4 text-sm font-bold text-accent/60 whitespace-nowrap">
                    {year}
                  </div>
                )}
                {renderItem(item.data, index)}
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Layout - Single column */}
        <div className="md:hidden">
          <div className="relative flex gap-4">
            {/* Mobile Timeline on the left */}
            <div className="relative flex flex-col items-center flex-shrink-0">
              {/* Timeline Dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-accent shadow-lg border-4 border-background"
              >
                <div className="h-2.5 w-2.5 rounded-full bg-accent-foreground" />
              </motion.div>
              
              {/* Connecting Line */}
              {index < items.length - 1 && (
                <div className="absolute top-10 h-full w-0.5 bg-gradient-to-b from-accent/40 to-accent/20" />
              )}
            </div>

            {/* Card Content */}
            <div className="flex-1">
              {year && (
                <div className="text-sm font-bold text-accent/60 mb-2">
                  {year}
                </div>
              )}
              {renderItem(item.data, index)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isEditMode && onReorder) {
    // Edit Mode with drag handles
    return (
      <div className={cn("w-full max-w-7xl mx-auto px-4", containerClassName)}>
        <div className="space-y-8">
          {timelineItems.map((item, index) => (
            <div key={keyExtractor(item.data, index)} className="group relative">
              {/* Drag Handle Overlay */}
              {isEditMode && (
                <div className="absolute -left-2 top-4 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                    <span className="text-xs font-medium">Drag to reorder</span>
                  </div>
                </div>
              )}
              
              <TimelineItemRow
                item={item}
                index={index}
                year={getYearFromItem?.(item.data)}
              />
            </div>
          ))}
        </div>
        
        {/* Continuous Timeline Line for Edit Mode */}
        <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-0.5 bg-gradient-to-b from-accent/20 via-accent/10 to-transparent -translate-x-1/2" />
      </div>
    )
  }

  // Preview mode
  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4 relative", containerClassName)}>
      {/* Continuous Timeline Line - Desktop */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="hidden md:block absolute left-1/2 top-6 bottom-6 w-0.5 bg-gradient-to-b from-accent/20 via-accent/10 to-transparent -translate-x-1/2 z-0"
      />
      
      {/* Timeline Items */}
      <div className="relative space-y-8 md:space-y-12">
        {timelineItems.map((item, index) => (
          <TimelineItemRow
            key={keyExtractor(item.data, index)}
            item={item}
            index={index}
            year={getYearFromItem?.(item.data)}
          />
        ))}
      </div>
    </div>
  )
}