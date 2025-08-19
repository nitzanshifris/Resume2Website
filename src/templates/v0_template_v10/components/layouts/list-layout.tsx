"use client"
import { motion } from "framer-motion"
import { EditableText } from "@/components/ui/editable-text"
import { contentIconMap } from "@/lib/data"
import { renderIcon } from "@/lib/icon-utils"
import { IconSelector } from "@/components/ui/icon-selector"
import { IconWithZoom } from "@/components/ui/icon-with-zoom"
import { useEditMode } from "@/contexts/edit-mode-context"

export interface ListItem {
  icon: string | { type: 'library' | 'upload'; value: string }
  title: string
  description: string
  year?: string
}

interface ListLayoutProps {
  items: ListItem[]
  onSave: (index: number, field: keyof ListItem, value: string) => void
  onSaveMulti: (index: number, value: string) => void
  onSaveIcon?: (index: number, icon: { type: 'library' | 'upload'; value: string }) => void
}

export function ListLayout({ items, onSave, onSaveMulti, onSaveIcon }: ListLayoutProps) {
  const { isEditMode } = useEditMode()
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="flex items-start gap-6 p-4 rounded-lg hover:bg-secondary/50 transition-colors duration-200 group"
        >
          <div className="text-accent mt-1">
            {isEditMode && onSaveIcon ? (
              <IconWithZoom
                icon={typeof item.icon === 'object' ? item.icon : item.icon}
                onIconUpdate={(newIcon) => onSaveIcon(i, newIcon)}
                iconClassName="h-6 w-6 text-accent"
              />
            ) : (
              typeof item.icon === 'object' 
                ? renderIcon(item.icon, "h-6 w-6 text-accent") 
                : (contentIconMap[item.icon] || contentIconMap.Lightbulb)
            )}
          </div>
          <div className="flex-1">
            <EditableText
              as="h3"
              className="font-serif text-lg sm:text-2xl font-bold text-card-foreground"
              initialValue={item.title}
              onSave={(v) => onSave(i, "title", v)}
            />
            <EditableText
              as="p"
              className="font-sans text-sm sm:text-base text-muted-foreground mt-1"
              initialValue={item.description}
              onSave={(v) => onSaveMulti(i, v)}
            />
          </div>
          {item.year && (
            <EditableText
              as="p"
              className="font-sans text-lg text-muted-foreground"
              initialValue={item.year}
              onSave={(v) => onSave(i, "year", v)}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}
