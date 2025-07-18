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
import { Settings } from "lucide-react"
import type { PortfolioData } from "@/lib/data"

type SectionKey = keyof Omit<PortfolioData, "hero" | "contact">

interface SettingsButtonProps {
  showPhoto: boolean
  onShowPhotoChange: (checked: boolean) => void
  orderedSections: SectionKey[]
  sectionVisibility: Record<SectionKey, boolean>
  onToggleSection: (section: SectionKey) => void
  handleDragEnd: (event: DragEndEvent) => void
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
  data,
  formatLabel,
}: SettingsButtonProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  return (
    <div className="fixed bottom-8 right-8 z-[5001]">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="rounded-full h-14 w-14 md:h-16 md:w-16 shadow-lg"
            aria-label="Open settings panel"
          >
            <Settings className="h-7 w-7" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 sm:w-64 bg-popover border-border mb-2">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none font-serif">Display Sections</h4>
              <p className="text-base text-muted-foreground">Toggle visibility and drag to reorder.</p>
              <div className="grid gap-1 mt-2">
                <div className="flex items-center space-x-2 pl-9">
                  <Switch id="profile-photo" checked={showPhoto} onCheckedChange={onShowPhotoChange} />
                  <Label htmlFor="profile-photo" className="font-sans text-base">
                    Display Profile Photo
                  </Label>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={orderedSections} strategy={verticalListSortingStrategy}>
                    {orderedSections.map((key) => (
                      <SortableItem key={key} id={key}>
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
