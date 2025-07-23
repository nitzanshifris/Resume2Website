"use client"
import { motion } from "framer-motion"
import { EditableText } from "@/components/ui/editable-text"

export interface EmbedItem {
  title: string
  url: string
  _key: string | number
}

interface EmbedLayoutProps {
  items: EmbedItem[]
  onSave: (key: string | number, field: "title" | "url", value: string) => void
}

export function EmbedLayout({ items, onSave }: EmbedLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {items.map((item, i) => (
        <motion.div
          key={item._key}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="bg-card rounded-xl border-2 border-border/50 shadow-lg"
        >
          <div className="p-4 border-b border-border">
            <EditableText
              as="h3"
              initialValue={item.title}
              onSave={(v) => onSave(item._key, "title", v)}
              className="font-serif text-lg font-bold text-card-foreground"
            />
          </div>
          <div className="aspect-video bg-muted/50">
            <iframe
              src={item.url}
              title={item.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
