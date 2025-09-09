"use client"
import React from "react"
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  type DragEndEvent,
  DragOverlay,
  type Active
} from "@dnd-kit/core"
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  rectSortingStrategy 
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditMode } from "@/contexts/edit-mode-context"

interface DraggableListProps<T> {
  items: T[]
  onReorder: (newItems: T[]) => void
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor: (item: T, index: number) => string
  className?: string
  itemWrapperClassName?: string
  handlePosition?: 'left' | 'right' | 'top-right'
  strategy?: 'vertical' | 'grid'
}

interface DraggableItemProps {
  id: string
  children: React.ReactNode
  index: number
  handlePosition?: 'left' | 'right' | 'top-right'
}

function DraggableItem({ id, children, index, handlePosition = 'left' }: DraggableItemProps) {
  const { isEditMode } = useEditMode()
  const [isMobile, setIsMobile] = React.useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Keep cards in same position as preview mode (centered)
  const getPositionClass = () => {
    // No special positioning - let cards stay in their natural centered position
    return ""
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        isDragging && "z-50 opacity-50",
        getPositionClass()
      )}
    >
      {isEditMode && !isMobile && (
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
            handlePosition === 'left' && "-left-12 top-8 w-10 h-10",
            handlePosition === 'right' && "right-2 top-1/2 -translate-y-1/2 w-8 h-8",
            handlePosition === 'top-right' && "right-2 w-8 h-8"
          )}
          style={handlePosition === 'top-right' ? { top: '74px' } : {}}
        >
          <GripVertical className={cn(
            handlePosition === 'left' ? "h-5 w-5" : "h-4 w-4"
          )} />
        </div>
      )}
      {/* Mobile: Show disabled drag handle as indicator */}
      {isEditMode && isMobile && (
        <div
          className={cn(
            "absolute z-40",
            "flex items-center justify-center",
            "rounded-lg",
            "bg-gray-400/50",
            "text-white shadow-lg",
            "cursor-not-allowed",
            handlePosition === 'left' && "-left-12 top-8 w-10 h-10",
            handlePosition === 'right' && "right-2 top-1/2 -translate-y-1/2 w-8 h-8",
            handlePosition === 'top-right' && "right-2 w-8 h-8"
          )}
          style={handlePosition === 'top-right' ? { top: '74px' } : {}}
        >
          <GripVertical className={cn(
            "opacity-50",
            handlePosition === 'left' ? "h-5 w-5" : "h-4 w-4"
          )} />
        </div>
      )}
      {children}
    </div>
  )
}

export function DraggableList<T>({ 
  items, 
  onReorder, 
  renderItem, 
  keyExtractor,
  className,
  itemWrapperClassName,
  handlePosition = 'left',
  strategy = 'vertical'
}: DraggableListProps<T>) {
  const [activeId, setActiveId] = React.useState<string | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: { active: Active }) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((_, index) => keyExtractor(items[index], index) === active.id)
      const newIndex = items.findIndex((_, index) => keyExtractor(items[index], index) === over.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex)
        onReorder(newItems)
      }
    }
    
    setActiveId(null)
  }

  const activeIndex = activeId 
    ? items.findIndex((_, index) => keyExtractor(items[index], index) === activeId)
    : -1

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item, index) => keyExtractor(item, index))}
        strategy={strategy === 'grid' ? rectSortingStrategy : verticalListSortingStrategy}
      >
        <div className={cn("relative group/list", className)}>
          {items.map((item, index) => (
            <div key={keyExtractor(item, index)} className={itemWrapperClassName || "w-full h-full"}>
              <DraggableItem
                id={keyExtractor(item, index)}
                index={index}
                handlePosition={handlePosition}
              >
                {renderItem(item, index)}
              </DraggableItem>
            </div>
          ))}
        </div>
      </SortableContext>
      
      <DragOverlay>
        {activeId && activeIndex !== -1 ? (
          <div className="opacity-90 shadow-2xl transform scale-105">
            <div className="bg-background rounded-lg border-2 border-primary">
              {renderItem(items[activeIndex], activeIndex)}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}