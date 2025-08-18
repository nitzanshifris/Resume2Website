"use client"
import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { GraduationCap, Settings, Image as ImageIcon } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimelineItemData {
  title: React.ReactNode
  degree: React.ReactNode
  years: React.ReactNode
  description: React.ReactNode
  image?: string
  displayMode?: 'classic' | 'image'
}

interface VerticalTimelineProps {
  items: TimelineItemData[]
  onUpdateItem?: (index: number, field: string, value: any) => void
}

export const VerticalTimeline: React.FC<VerticalTimelineProps> = ({ items, onUpdateItem }) => {
  const [localItems, setLocalItems] = useState<TimelineItemData[]>(
    items.map(item => ({
      ...item,
      displayMode: item.displayMode || 'classic',
      image: item.image || ''
    }))
  )

  const handleUpdateItem = (index: number, field: string, value: any) => {
    setLocalItems(prev => {
      const newItems = [...prev]
      newItems[index] = { ...newItems[index], [field]: value }
      return newItems
    })
    onUpdateItem?.(index, field, value)
  }

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      handleUpdateItem(index, 'image', base64String)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="relative max-w-6xl mx-auto px-2 sm:px-4">
      {/* Central vertical line */}
      <div
        className="absolute left-1/2 top-0 h-full w-0.5 bg-accent -translate-x-1/2 shadow-[0_0_15px_hsl(var(--accent))]"
        aria-hidden="true"
      />

      <ul className="space-y-16">
        {localItems.map((item, i) => {
          const alignLeft = i % 2 === 0
          const isImageMode = item.displayMode === 'image' && item.image

          return (
            <motion.li
              key={i}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Dot on the timeline */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-accent rounded-full p-2 ring-8 ring-background flex items-center justify-center z-10 shadow-lg shadow-accent/50">
                <GraduationCap className="h-5 w-5 text-accent-foreground" />
              </div>

              {/* Card Container */}
              <div className={cn(
                "relative",
                "w-1/2",
                alignLeft ? "mr-auto pr-3 sm:pr-4" : "ml-auto pl-3 sm:pl-4"
              )}>
                {/* Connector Line */}
                <div
                  className={cn("absolute top-10 h-0.5 bg-border w-4 sm:w-12", alignLeft ? "right-0" : "left-0")}
                  aria-hidden="true"
                />

                {/* Card Content */}
                <div className="relative group">
                  {/* Settings Button */}
                  <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                          <SheetTitle>Timeline Card Settings</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6 space-y-6">
                          {/* Display Mode Selector */}
                          <div className="space-y-2">
                            <Label>Display Mode</Label>
                            <Select
                              value={item.displayMode || 'classic'}
                              onValueChange={(v) => handleUpdateItem(i, 'displayMode', v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="classic">
                                  <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    <span>Classic Timeline</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="image">
                                  <div className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" />
                                    <span>Image Card</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Image Upload/URL (only show when image mode is selected) */}
                          {item.displayMode === 'image' && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Image Source</Label>
                                <div className="space-y-4">
                                  {/* URL Input */}
                                  <div className="space-y-2">
                                    <Label className="text-sm">Image URL</Label>
                                    <Input
                                      value={!item.image?.startsWith('data:') ? item.image || '' : ''}
                                      onChange={(e) => handleUpdateItem(i, 'image', e.target.value)}
                                      placeholder="https://example.com/image.jpg"
                                    />
                                  </div>
                                  
                                  {/* OR Divider */}
                                  <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                      <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                                    </div>
                                  </div>
                                  
                                  {/* File Upload */}
                                  <div className="space-y-2">
                                    <Label className="text-sm">Upload Image</Label>
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                          handleImageUpload(i, file)
                                        }
                                      }}
                                    />
                                  </div>

                                  {/* Image Preview */}
                                  {item.image && (
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                                      <img
                                        src={item.image}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>

                  {/* Render based on display mode */}
                  {isImageMode ? (
                    <div className={cn(
                      "bg-card rounded-xl border-2 border-accent shadow-lg overflow-hidden",
                      "transform transition-all duration-300 hover:scale-[1.02]"
                    )}>
                      <div className={cn(
                        "flex flex-col md:flex-row",
                        alignLeft ? "md:flex-row-reverse" : ""
                      )}>
                        {/* Image Section */}
                        <div className="md:w-2/5 relative h-64 md:h-auto md:min-h-[280px]">
                          <img
                            src={item.image}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                        </div>
                        
                        {/* Content Section */}
                        <div className={cn(
                          "md:w-3/5 p-5 md:p-6",
                          alignLeft ? "text-right" : "text-left"
                        )}>
                          <div className="space-y-2">
                            {item.title}
                            {item.degree}
                            {item.years}
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "bg-card p-4 sm:p-6 rounded-xl border-2 border-accent shadow-lg",
                        alignLeft ? "text-right" : "text-left",
                      )}
                    >
                      <div className="space-y-1">
                        {item.title}
                        {item.degree}
                        {item.years}
                        {item.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
