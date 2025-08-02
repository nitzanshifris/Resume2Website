"use client"
import { motion } from "framer-motion"
import { EditableText } from "@/components/ui/editable-text"
import { contentIconMap } from "@/lib/data"

export interface ListItem {
  icon: string
  title: string
  description: string
  year?: string
}

interface ListLayoutProps {
  items: ListItem[]
  onSave: (index: number, field: keyof ListItem, value: string) => void
  onSaveMulti: (index: number, value: string) => void
}

export function ListLayout({ items, onSave, onSaveMulti }: ListLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="flex items-start gap-6 p-4 rounded-lg hover:bg-secondary/50 transition-colors duration-200"
        >
          <div className="text-accent mt-1">{contentIconMap[item.icon]}</div>
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
