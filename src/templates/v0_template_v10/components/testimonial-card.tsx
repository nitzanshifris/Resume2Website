"use client"
import Image from "next/image"
import { Quote, Trash2, Camera } from "lucide-react"
import { EditableText } from "@/components/ui/editable-text"
import { Button } from "@/components/ui/button"
import { useEditMode } from "@/contexts/edit-mode-context"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import type { TestimonialItem } from "@/lib/data"
import { renderIcon } from "@/lib/icon-utils"
import { IconSelector } from "@/components/ui/icon-selector"
import { IconWithZoom } from "@/components/ui/icon-with-zoom"
import { EditGuard } from "@/components/ui/edit-guard"
import { SmartCardControls } from "@/components/ui/smart-card-controls"
import { useSmartCardContext } from "@/contexts/smart-card-context"

interface TestimonialCardProps {
  item: TestimonialItem
  onSave: (field: keyof TestimonialItem, value: string) => void
  onDelete?: () => void
}

export function TestimonialCard({ item, onSave, onDelete }: TestimonialCardProps) {
  const { isEditMode } = useEditMode()
  const { isInsideSmartCard } = useSmartCardContext()
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
      {/* Universal Smart Card Controls - only show if not inside SmartCard */}
      {!isInsideSmartCard && (
        <EditGuard>
          <SmartCardControls
            onDelete={onDelete}
            showSettings={false}
            variant="floating"
          />
        </EditGuard>
      )}
      
      <div className="absolute top-4 right-4 group/quote">
        <div className="relative">
          <div className="h-16 w-16 text-accent/10">
            {isEditMode ? (
              <IconWithZoom
                icon={item.quoteIcon}
                onIconUpdate={(newIcon) => {
                  onSave("quoteIcon", newIcon)
                }}
                iconClassName="h-16 w-16"
                className={cn(
                  isEditMode && "gradient-border-dashed rounded-lg p-1 transition-all duration-200"
                )}
              />
            ) : (
              item.quoteIcon ? renderIcon(item.quoteIcon, "h-16 w-16") : <Quote className="h-16 w-16" />
            )}
          </div>
        </div>
      </div>
      <div className="relative z-10 flex-grow">
        <EditableText
          as="div"
          textarea
          initialValue={item.quote}
          onSave={(v) => onSave("quote", v)}
          className="text-sm sm:text-base font-sans italic text-card-foreground/90 leading-relaxed border-l-4 border-accent pl-4"
        />
      </div>
      <div className="relative z-10 mt-6 flex items-center gap-4">
        <div className="relative group/image">
          <div className={cn(
            "relative rounded-full",
            isEditMode && "gradient-border-dashed p-1 transition-all duration-200"
          )}>
            <Image
              src={item.authorImage || "/placeholder.svg"}
              alt={item.authorName}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-accent"
            />
          </div>
          
          {/* Click overlay for direct image editing */}
          {isEditMode && (
            <div 
              className="absolute inset-1 rounded-full cursor-pointer flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
              title="Click to change image"
            />
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
