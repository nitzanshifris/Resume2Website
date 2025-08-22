"use client"
import React from "react"
import { cn } from "@/lib/utils"
import { useEditMode } from "@/contexts/edit-mode-context"
import { motion } from "framer-motion"
import type { SectionLayoutConfig } from "@/lib/smart-sizing"
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  type DragEndEvent,
  DragOverlay,
  type Active,
  useDroppable,
  useDraggable
} from "@dnd-kit/core"
import { GripVertical, Plus } from "lucide-react"


interface TimelinePosition {
  row: number
  side: 'left' | 'right'
}

interface DraggableCardTimelineV2Props<T> {
  items: T[]
  renderSmartCard: (item: T, index: number, position: TimelinePosition) => React.ReactNode
  onReorder?: (newItems: T[], newPositions: TimelinePosition[]) => void
  keyExtractor?: (item: T, index: number) => string
  containerClassName?: string
  getYearFromItem?: (item: T) => string
  getIconFromItem?: (item: T) => React.ReactNode
  onAddItem?: () => void
  maxItems?: number
  layoutConfig?: SectionLayoutConfig
}

// Droppable Container Component
function DropZone({ 
  id, 
  children, 
  position, 
  isEmpty,
  cardClasses
}: { 
  id: string
  children?: React.ReactNode
  position: TimelinePosition
  isEmpty: boolean
  cardClasses?: string
}) {
  const { isEditMode } = useEditMode()
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative min-h-[200px]",
        isEmpty && isEditMode && "gradient-border-dashed rounded-2xl",
        isOver && "bg-accent/10 border-accent border-2 rounded-2xl",
        cardClasses // Apply same sizing classes as filled cards
      )}
    >
      {children}
    </div>
  )
}

// Draggable SmartCard Wrapper
function DraggableSmartCard({ 
  id, 
  children, 
  position 
}: { 
  id: string
  children: React.ReactNode
  position: TimelinePosition
}) {
  const { isEditMode } = useEditMode()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({ id })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "z-50 opacity-50"
      )}
    >
      {/* Drag Handle */}
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className={cn(
            "absolute z-40",
            "flex items-center justify-center",
            "rounded-lg",
            "bg-gradient-to-r from-blue-500 to-blue-600",
            "text-white shadow-lg",
            "cursor-grab active:cursor-grabbing",
            "transition-all duration-200 hover:scale-105",
            "right-2 w-8 h-8"
          )}
          style={{ top: '74px' }}
        >
          <GripVertical className="h-4 w-4" />
        </div>
      )}
      {children}
    </div>
  )
}

export function DraggableCardTimelineV2<T>({
  items,
  renderSmartCard,
  onReorder,
  keyExtractor = (item, index) => `timeline-item-${index}`,
  containerClassName,
  getYearFromItem,
  getIconFromItem,
  onAddItem,
  maxItems = 12,
  layoutConfig
}: DraggableCardTimelineV2Props<T>) {
  const { isEditMode } = useEditMode()
  
  // Timeline-specific shape-only logic - content-optimized dimensions
  const getTimelineCardClasses = (config: SectionLayoutConfig) => {
    const classes: string[] = []
    
    // Timeline uses only shape classes - no size classes needed
    const getShapeClassName = (shape: string) => `timeline-shape-${shape}`
    
    classes.push(getShapeClassName(config.shape))
    classes.push('smartcard-transition')
    
    return {
      classes: classes.join(' ')
    }
  }
  
  const { classes: cardClasses } = layoutConfig ? 
    getTimelineCardClasses(layoutConfig) :
    { classes: 'timeline-shape-wide' } // Default to wide shape
  
  // Create position mapping - items can be at any of the 6 positions
  const [positions, setPositions] = React.useState<TimelinePosition[]>([])

  // Update positions when items change
  React.useEffect(() => {
    if (items.length !== positions.length) {
      // Recalculate positions for all items when the length changes
      const newPositions = items.map((_, index) => ({
        row: index, // Each item gets its own row for timeline layout
        side: (index % 2 === 0 ? 'left' : 'right') as 'left' | 'right'
      }))
      console.log('Timeline positions updated:', newPositions)
      setPositions(newPositions)
    }
  }, [items.length, positions.length])

  const [activeId, setActiveId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )

  // Calculate required rows dynamically based on items and positions
  const maxRowFromPositions = positions.reduce((max, pos) => Math.max(max, pos ? pos.row : -1), -1)
  const maxRowFromItems = Math.floor((items.length - 1) / 1) // One item per row initially
  const requiredRows = Math.max(maxRowFromPositions + 1, maxRowFromItems + 1, items.length > 0 ? items.length : 1)
  
  // Generate drop zones dynamically based on required rows
  const dropZones = []
  for (let row = 0; row < requiredRows; row++) {
    for (const side of ['left', 'right'] as const) {
      dropZones.push({ row, side })
    }
  }

  // Map items to their positions
  const itemsWithPositions = items.map((item, index) => ({
    item,
    index,
    id: keyExtractor(item, index),
    position: positions[index] || { row: index, side: index % 2 === 0 ? 'left' : 'right' }
  }))

  const handleDragStart = (event: { active: Active }) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && onReorder) {
      // Parse the drop zone ID to get row and side
      const dropZoneMatch = over.id.toString().match(/dropzone-(\d+)-(left|right)/)
      if (dropZoneMatch) {
        const targetRow = parseInt(dropZoneMatch[1])
        const targetSide = dropZoneMatch[2] as 'left' | 'right'
        
        // Find the dragged item
        const draggedIndex = itemsWithPositions.findIndex(item => item.id === active.id)
        if (draggedIndex !== -1) {
          // Update positions
          const newPositions = [...positions]
          newPositions[draggedIndex] = { row: targetRow, side: targetSide }
          
          setPositions(newPositions)
          onReorder(items, newPositions)
        }
      }
    }
    
    setActiveId(null)
  }

  const activeItem = activeId ? itemsWithPositions.find(item => item.id === activeId) : null

  // Timeline Row Component
  const TimelineRow = ({ rowIndex }: { rowIndex: number }) => {
    // Get items for this row
    const leftItem = itemsWithPositions.find(item => item.position.row === rowIndex && item.position.side === 'left')
    const rightItem = itemsWithPositions.find(item => item.position.row === rowIndex && item.position.side === 'right')
    
    // Get icon for timeline dot (prefer left item, fallback to right item)
    const timelineIcon = leftItem && getIconFromItem ? getIconFromItem(leftItem.item) : 
                        rightItem && getIconFromItem ? getIconFromItem(rightItem.item) : null

    return (
      <div className="relative">
        {/* Flexbox Layout - Support smartcard sizing with directional growth */}
        <div className="flex items-start">
          {/* Left Container - grows to the left */}
          <div className="flex justify-end flex-1 pr-3 md:pr-6">
            <DropZone
              id={`dropzone-${rowIndex}-left`}
              position={{ row: rowIndex, side: 'left' }}
              isEmpty={!leftItem}
              cardClasses={cardClasses}
            >
              {leftItem && (
                <div className={cn("flex", cardClasses)}>
                  <DraggableSmartCard 
                    id={leftItem.id} 
                    position={leftItem.position}
                  >
                    {renderSmartCard(leftItem.item, leftItem.index, leftItem.position)}
                  </DraggableSmartCard>
                </div>
              )}
            </DropZone>
          </div>

          {/* Center Timeline - Fixed width */}
          <div className="relative flex flex-col items-center w-12 flex-shrink-0">
            {/* Timeline Dot */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: rowIndex * 0.1, duration: 0.3, type: "spring" }}
              className="relative z-20"
            >
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-full bg-accent/20 blur-md scale-150" />
              
              {/* Main dot with icon */}
              <div className={cn(
                "relative flex h-12 w-12 items-center justify-center rounded-full",
                "bg-accent shadow-xl border-4 border-background",
                "transition-all duration-300",
                "hover:scale-110 hover:shadow-2xl"
              )}>
                {timelineIcon || (
                  <div className="h-3 w-3 rounded-full bg-accent-foreground" />
                )}
              </div>
            </motion.div>

            {/* Connecting Line */}
            {rowIndex < requiredRows - 1 && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ delay: rowIndex * 0.1 + 0.3, duration: 0.5 }}
                className="absolute top-12 w-0.5 bg-gradient-to-b from-accent/40 via-accent/20 to-accent/40"
                style={{ height: "calc(100% + 3rem)" }}
              />
            )}
          </div>

          {/* Right Container - grows to the right */}
          <div className="flex justify-start flex-1 pl-3 md:pl-6">
            <DropZone
              id={`dropzone-${rowIndex}-right`}
              position={{ row: rowIndex, side: 'right' }}
              isEmpty={!rightItem}
              cardClasses={cardClasses}
            >
              {rightItem && (
                <div className={cn("flex", cardClasses)}>
                  <DraggableSmartCard 
                    id={rightItem.id} 
                    position={rightItem.position}
                  >
                    {renderSmartCard(rightItem.item, rightItem.index, rightItem.position)}
                  </DraggableSmartCard>
                </div>
              )}
            </DropZone>
          </div>
        </div>
      </div>
    )
  }

  if (isEditMode && onReorder) {
    // Edit Mode - Drag & Drop enabled
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={cn("w-full mx-auto px-4 relative", containerClassName)}>
          {/* Continuous Timeline Line */}
          <div className="absolute left-1/2 top-6 bottom-6 w-0.5 bg-gradient-to-b from-accent/20 via-accent/10 to-transparent -translate-x-1/2 z-0" />
          
          {/* Timeline Rows */}
          <div className="relative space-y-8 md:space-y-12">
            {Array.from({ length: requiredRows }, (_, index) => (
              <TimelineRow key={`row-${index}`} rowIndex={index} />
            ))}
          </div>
          
          {/* Add Item Button - only in edit mode and under maxItems limit */}
          {onAddItem && (
            <div className="relative mt-8 md:mt-12">
              <div className="flex flex-col items-center gap-2">
                {items.length < maxItems ? (
                  <button
                    onClick={onAddItem}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-accent hover:bg-accent/80 text-accent-foreground transition-colors duration-200 shadow-lg hover:shadow-xl"
                    title={`Add new education item (${items.length}/${maxItems})`}
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground cursor-not-allowed"
                       title={`Maximum limit reached (${maxItems} items)`}>
                    <Plus className="h-6 w-6 opacity-50" />
                  </div>
                )}
                
                {/* Limit achieved message - only show when at max */}
                {items.length >= maxItems && (
                  <div className="text-xs text-muted-foreground">
                    Limit achieved
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DragOverlay>
          {activeItem ? (
            <div className="opacity-90 shadow-2xl transform scale-105">
              <div className="bg-background rounded-lg border-2 border-primary">
                {renderSmartCard(activeItem.item, activeItem.index, activeItem.position)}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    )
  }

  // Preview mode - same visual layout but no drag functionality
  return (
    <div className={cn("w-full mx-auto px-4 relative", containerClassName)}>
      {/* Continuous Timeline Line */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute left-1/2 top-6 bottom-6 w-0.5 bg-gradient-to-b from-accent/20 via-accent/10 to-transparent -translate-x-1/2 z-0"
      />
      
      {/* Timeline Rows */}
      <div className="relative space-y-8 md:space-y-12">
        {Array.from({ length: requiredRows }, (_, index) => (
          <TimelineRow key={`row-${index}`} rowIndex={index} />
        ))}
      </div>
    </div>
  )
}