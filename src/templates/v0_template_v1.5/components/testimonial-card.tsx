"use client"
import Image from "next/image"
import { Quote, Trash2, Camera } from "lucide-react"
import { EditableText } from "@/components/ui/editable-text"
import { Button } from "@/components/ui/button"
import { useEditMode } from "@/contexts/edit-mode-context"
import { useState, useRef } from "react"
import type { TestimonialItem } from "@/lib/data"

interface TestimonialCardProps {
  item: TestimonialItem
  onSave: (field: keyof TestimonialItem, value: string) => void
  onDelete?: () => void
}

export function TestimonialCard({ item, onSave, onDelete }: TestimonialCardProps) {
  const { isEditMode } = useEditMode()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        onSave("authorImage", base64String)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }
  
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-card p-8 shadow-lg border-2 border-border/50 flex flex-col justify-between group">
      {/* Delete Button - only visible in edit mode */}
      {isEditMode && onDelete && (
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button 
            size="icon" 
            variant="destructive" 
            className="h-8 w-8 shadow-md"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <Quote className="absolute top-4 right-4 h-16 w-16 text-accent/10" />
      <div className="relative z-10 flex-grow">
        <EditableText
          as="blockquote"
          textarea
          initialValue={item.quote}
          onSave={(v) => onSave("quote", v)}
          className="text-sm sm:text-base font-sans italic text-card-foreground/90 leading-relaxed border-l-4 border-accent pl-4"
        />
      </div>
      <div className="relative z-10 mt-6 flex items-center gap-4">
        <div className="relative group/image">
          <Image
            src={item.authorImage || "/placeholder.svg"}
            alt={item.authorName}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-accent"
          />
          
          {/* Upload overlay - visible in edit mode */}
          {isEditMode && (
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        <div>
          <EditableText
            as="p"
            initialValue={item.authorName}
            onSave={(v) => onSave("authorName", v)}
            className="font-serif text-lg sm:text-2xl font-bold text-card-foreground"
          />
          <EditableText
            as="p"
            initialValue={item.authorTitle}
            onSave={(v) => onSave("authorTitle", v)}
            className="font-sans text-sm sm:text-base text-muted-foreground"
          />
        </div>
      </div>
    </div>
  )
}
