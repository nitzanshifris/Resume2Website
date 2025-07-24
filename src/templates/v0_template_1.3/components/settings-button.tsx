"use client"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SortableItem } from "@/components/ui/sortable-item"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"
import { Settings, ArrowUpDown } from "lucide-react"
import type { PortfolioData } from "@/lib/data"
import { useEditMode } from "@/contexts/edit-mode-context"
import { motion } from "framer-motion"

type SectionKey = keyof Omit<PortfolioData, "hero" | "contact">

interface SettingsButtonProps {
  showPhoto: boolean
  onShowPhotoChange: (checked: boolean) => void
  orderedSections: SectionKey[]
  sectionVisibility: Record<SectionKey, boolean>
  onToggleSection: (section: SectionKey) => void
  handleDragEnd: (event: DragEndEvent) => void
  onReorderSections?: (sections: SectionKey[]) => void
  data: PortfolioData
  formatLabel: (key: string) => string
}

export function SettingsButton({
  showPhoto,
  onShowPhotoChange,
  orderedSections,
  sectionVisibility,
  onToggleSection,
  handleDragEnd,
  onReorderSections,
  data,
  formatLabel,
}: SettingsButtonProps) {
  const { isEditMode } = useEditMode()
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleMoveUp = (index: number) => {
    if (index === 0 || !onReorderSections) return
    const newOrder = [...orderedSections]
    ;[newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]]
    onReorderSections(newOrder)
  }

  const handleMoveDown = (index: number) => {
    if (index === orderedSections.length - 1 || !onReorderSections) return
    const newOrder = [...orderedSections]
    ;[newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
    onReorderSections(newOrder)
  }

  return (
    <div className="fixed bottom-8 right-8 z-[5001]">
      {/* Edit mode hint */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute -left-48 top-0 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg whitespace-nowrap"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowUpDown className="h-4 w-4" />
            <span>Reorder sections here</span>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-border" />
          </div>
        </motion.div>
      )}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className={`rounded-full h-14 w-14 md:h-16 md:w-16 shadow-lg transition-all duration-300 ${
              isEditMode ? 'ring-2 ring-blue-500 ring-offset-2' : ''
            }`}
            aria-label="Open settings panel"
          >
            <Settings className="h-7 w-7" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 sm:w-64 bg-popover border-border mb-2">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none font-serif">Display Sections</h4>
              <p className="text-base text-muted-foreground">
                Toggle visibility and drag to reorder.
                {isEditMode && (
                  <span className="block mt-1 text-blue-500 font-medium">
                    ✨ Edit Mode Active - Drag sections to reorder!
                  </span>
                )}
              </p>
              <div className="grid gap-1 mt-2">
                <div className="flex items-center space-x-2 pl-9">
                  <Switch id="profile-photo" checked={showPhoto} onCheckedChange={onShowPhotoChange} />
                  <Label htmlFor="profile-photo" className="font-sans text-base">
                    Display Profile Photo
                  </Label>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={orderedSections} strategy={verticalListSortingStrategy}>
                    {orderedSections.map((key, index) => (
                      <SortableItem 
                        key={key} 
                        id={key}
                        onMoveUp={() => handleMoveUp(index)}
                        onMoveDown={() => handleMoveDown(index)}
                        isFirst={index === 0}
                        isLast={index === orderedSections.length - 1}
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <Switch
                            id={key}
                            checked={sectionVisibility[key]}
                            onCheckedChange={() => onToggleSection(key)}
                          />
                          <Label htmlFor={key} className="capitalize font-sans flex-grow text-base">
                            {formatLabel((data as any)[key]?.sectionTitle ?? key)}
                          </Label>
                        </div>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
            <ThemeSwitcher />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
