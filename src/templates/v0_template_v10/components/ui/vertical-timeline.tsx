"use client"
import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { GraduationCap, Edit2, Trash2, Settings, Image as ImageIcon, Upload, X } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ImageTransformEditor, type ImageTransform } from "@/components/ui/image-transform-editor"
import { TransformedImage } from "@/components/ui/transformed-image"

interface TimelineItemData {
  title: React.ReactNode
  degree: React.ReactNode
  years: React.ReactNode
  description: React.ReactNode
  imageUrl?: string
  imageAlt?: string
  imageTransform?: ImageTransform
}

interface VerticalTimelineProps {
  items: TimelineItemData[]
  onEdit?: (index: number) => void
  onDelete?: (index: number) => void
  onUpdateImage?: (index: number, imageUrl: string, imageAlt: string, imageTransform?: ImageTransform) => void
  isEditMode?: boolean
}

export const VerticalTimeline: React.FC<VerticalTimelineProps> = ({ items, onEdit, onDelete, onUpdateImage, isEditMode = false }) => {
  const [openSheets, setOpenSheets] = useState<{ [key: number]: boolean }>({})
  const [tempImages, setTempImages] = useState<{ [key: number]: { url: string; alt: string; transform?: ImageTransform } }>({})
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null)

  const handleOpenChange = (index: number, open: boolean) => {
    setOpenSheets(prev => ({ ...prev, [index]: open }))
    if (open) {
      setTempImages(prev => ({
        ...prev,
        [index]: {
          url: items[index].imageUrl || '',
          alt: items[index].imageAlt || '',
          transform: items[index].imageTransform || { crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 }
        }
      }))
    } else {
      // Auto-save when closing
      handleSaveImage(index)
    }
  }

  const handleSaveImage = (index: number) => {
    const tempImage = tempImages[index]
    if (tempImage && onUpdateImage) {
      onUpdateImage(index, tempImage.url, tempImage.alt, tempImage.transform)
      setOpenSheets(prev => ({ ...prev, [index]: false }))
    }
  }

  const handleRemoveImage = (index: number) => {
    if (onUpdateImage) {
      onUpdateImage(index, '', '', undefined)
      setTempImages(prev => ({
        ...prev,
        [index]: { url: '', alt: '', transform: undefined }
      }))
    }
  }

  return (
    <div className="relative max-w-5xl mx-auto px-2 sm:px-4">
      {/* Central vertical line - ALWAYS centered */}
      <div
        className="absolute left-1/2 top-0 h-full w-0.5 bg-accent -translate-x-1/2 shadow-[0_0_15px_hsl(var(--accent))]"
        aria-hidden="true"
      />

      <ul className="space-y-16">
        {items.map((item, i) => {
          const alignLeft = i % 2 === 0

          return (
            <motion.li
              key={i}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Dot on the timeline - ALWAYS centered */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-accent rounded-full p-2 ring-8 ring-background flex items-center justify-center z-10 shadow-lg shadow-accent/50">
                <GraduationCap className="h-5 w-5 text-accent-foreground" />
              </div>

              {/* Card and Connector Container - now responsive */}
              <div className={cn("w-1/2 relative", alignLeft ? "mr-auto pr-6 sm:pr-8" : "ml-auto pl-6 sm:pl-8")}>
                {/* Connector Line from dot to card - ALWAYS visible */}
                <div
                  className={cn("absolute top-10 h-0.5 bg-border w-4 sm:w-12", alignLeft ? "right-0" : "left-0")}
                  aria-hidden="true"
                />

                {/* Card Content with static border */}
                <div
                  className={cn(
                    "bg-card p-6 sm:p-8 rounded-xl border-2 border-accent shadow-lg relative group",
                    alignLeft ? "text-right" : "text-left",
                    isEditMode && "gradient-border-dashed"
                  )}
                >
                  {/* Settings button - visible on hover in edit mode only */}
                  {isEditMode && (
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Sheet open={openSheets[i] || false} onOpenChange={(open) => handleOpenChange(i, open)}>
                        <SheetTrigger asChild>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 shadow-md"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Timeline Card Settings</SheetTitle>
                          </SheetHeader>
                          <div className="mt-6 space-y-4">
                            {/* File Upload */}
                            <div className="space-y-2">
                              <Label>Upload Image</Label>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    const reader = new FileReader()
                                    reader.onloadend = () => {
                                      const base64String = reader.result as string
                                      setTempImages(prev => ({
                                        ...prev,
                                        [i]: { url: base64String, alt: prev[i]?.alt || '' }
                                      }))
                                    }
                                    reader.readAsDataURL(file)
                                  }
                                }}
                              />
                              {tempImages[i]?.url && tempImages[i]?.url.startsWith('data:') && (
                                <p className="text-xs text-muted-foreground">Image uploaded successfully</p>
                              )}
                            </div>
                            
                            {/* OR divider */}
                            {!tempImages[i]?.url && (
                              <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                  <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                                </div>
                              </div>
                            )}
                            
                            {/* Image URL */}
                            {!tempImages[i]?.url && (
                              <div className="space-y-2">
                                <Label>Image URL</Label>
                                <Input
                                  placeholder="https://example.com/image.jpg"
                                  value={tempImages[i]?.url || ''}
                                  onChange={(e) => setTempImages(prev => ({
                                    ...prev,
                                    [i]: { ...prev[i], url: e.target.value }
                                  }))}
                                />
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <Label>Image Alt Text</Label>
                              <Input
                                placeholder="Description of the image"
                                value={tempImages[i]?.alt || ''}
                                onChange={(e) => setTempImages(prev => ({
                                  ...prev,
                                  [i]: { ...prev[i], alt: e.target.value }
                                }))}
                              />
                            </div>
                            
                            {tempImages[i]?.url && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label>Preview</Label>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingImageIndex(i)}
                                  >
                                    <Edit2 className="h-3 w-3 mr-1" />
                                    Edit Image
                                  </Button>
                                </div>
                                <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
                                  <TransformedImage
                                    src={tempImages[i].url}
                                    alt={tempImages[i].alt || 'Preview'}
                                    transform={tempImages[i].transform || { crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 }}
                                    className="w-full h-full"
                                  />
                                  <Button
                                    size="icon"
                                    variant="destructive"
                                    className="absolute top-2 right-2 h-6 w-6"
                                    onClick={() => handleRemoveImage(i)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex gap-2 pt-4">
                              <Button 
                                variant="outline" 
                                onClick={() => handleOpenChange(i, false)}
                                className="flex-1"
                              >
                                Close
                              </Button>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  )}
                  
                  {/* Edit/Delete buttons - only visible in edit mode */}
                  {isEditMode && (
                    <div className={cn(
                      "absolute bottom-2 flex gap-1",
                      alignLeft ? "left-2" : "right-2"
                    )}>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-accent/20"
                        onClick={() => safeOnEdit?.(i)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
                        onClick={() => safeOnDelete?.(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div className={cn("flex gap-6", alignLeft ? "flex-row-reverse" : "flex-row")}>
                    {/* Text content */}
                    <div className="flex-1 space-y-2">
                      {item.title}
                      {item.degree}
                      {item.years}
                      <div className="mt-3">
                        {item.description}
                      </div>
                    </div>
                    
                    {/* Image alongside text */}
                    {item.imageUrl && (
                      <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
                        <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border-2 border-accent/20">
                          <TransformedImage
                            src={item.imageUrl}
                            alt={item.imageAlt || "Timeline image"}
                            transform={item.imageTransform || { crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.li>
          )
        })}
      </ul>
      
      {/* Image Editor Dialog */}
      <Dialog open={editingImageIndex !== null} onOpenChange={(open) => !open && setEditingImageIndex(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-6">
          <DialogTitle className="sr-only">Edit Image</DialogTitle>
          {editingImageIndex !== null && tempImages[editingImageIndex]?.url && (
            <ImageTransformEditor
              image={tempImages[editingImageIndex].url}
              initialTransform={tempImages[editingImageIndex].transform || { crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 }}
              aspectRatio={1}
              onSave={(transform) => {
                setTempImages(prev => ({
                  ...prev,
                  [editingImageIndex]: {
                    ...prev[editingImageIndex],
                    transform
                  }
                }))
                setEditingImageIndex(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
