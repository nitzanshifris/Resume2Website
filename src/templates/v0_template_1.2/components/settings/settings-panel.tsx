"use client"
import { Settings, ImageIcon, FileText, LinkIcon, Github, Code, GalleryHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"
import { useSettings, type ViewMode } from "@/components/settings/settings-provider"

interface SettingsPanelProps {
  sections: {
    key: string
    title: string
    items: any[]
  }[]
}

const viewModeOptions = [
  { value: "text", label: "Text-Centric", icon: FileText },
  { value: "image", label: "3D Image Card", icon: ImageIcon },
  { value: "image-carousel", label: "Image Scroller", icon: GalleryHorizontal },
  { value: "url", label: "URL Embed", icon: LinkIcon },
  { value: "github", label: "GitHub Card", icon: Github },
  { value: "code", label: "Code Block", icon: Code },
]

export function SettingsPanel({ sections }: SettingsPanelProps) {
  const { itemViewModes, setItemViewMode } = useSettings()

  const getItemTitle = (item: any): string => {
    return item.title || item.role || item.institution || item.organization || "Untitled Item"
  }

  return (
    <div className="fixed bottom-8 right-8 z-[6000]">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="rounded-full h-14 w-14 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Settings className="h-6 w-6" />
            <span className="sr-only">Open Settings</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-card border-border flex flex-col w-full sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="font-serif text-2xl">Display Settings</SheetTitle>
          </SheetHeader>
          <div className="flex-grow overflow-y-auto pr-4 -mr-4">
            <div className="py-4 space-y-8">
              <div>
                <h4 className="font-medium leading-none font-serif text-lg">Item Layouts</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Choose a presentation style for each individual item.
                </p>
                <Accordion type="multiple" className="w-full">
                  {sections
                    .filter((s) => s.items.length > 0)
                    .map(({ key: sectionKey, title, items }) => (
                      <AccordionItem value={sectionKey} key={sectionKey}>
                        <AccordionTrigger>{title}</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          {items.map((item) => (
                            <div key={item._key} className="p-2 rounded-md border border-border/50">
                              <Label htmlFor={`view-mode-${sectionKey}-${item._key}`} className="text-sm font-medium">
                                {getItemTitle(item)}
                              </Label>
                              <Select
                                value={itemViewModes[sectionKey]?.[item._key] || "text"}
                                onValueChange={(value: ViewMode) => setItemViewMode(sectionKey, item._key, value)}
                              >
                                <SelectTrigger id={`view-mode-${sectionKey}-${item._key}`} className="w-full mt-1">
                                  <SelectValue placeholder="Select a layout style" />
                                </SelectTrigger>
                                <SelectContent>
                                  {viewModeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      <div className="flex items-center gap-2">
                                        <option.icon className="h-4 w-4" />
                                        <span>{option.label}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>
              <ThemeSwitcher />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
