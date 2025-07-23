"use client"
import Image from "next/image"
import { Quote } from "lucide-react"
import { EditableText } from "@/components/ui/editable-text"
import type { TestimonialItem } from "@/lib/data"

interface TestimonialCardProps {
  item: TestimonialItem
  onSave: (field: keyof TestimonialItem, value: string) => void
}

export function TestimonialCard({ item, onSave }: TestimonialCardProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-card p-8 shadow-lg border-2 border-border/50 flex flex-col justify-between">
      <Quote className="absolute top-4 right-4 h-16 w-16 text-accent/10" />
      <div className="relative z-10 flex-grow">
        <EditableText
          as="blockquote"
          textarea
          initialValue={item.quote}
          onSave={(v) => onSave("quote", v)}
          className="text-base font-sans italic text-card-foreground/90 leading-relaxed border-l-4 border-accent pl-4"
        />
      </div>
      <div className="relative z-10 mt-6 flex items-center gap-4">
        <Image
          src={item.authorImage || "/placeholder.svg"}
          alt={item.authorName}
          width={56}
          height={56}
          className="h-14 w-14 rounded-full object-cover ring-2 ring-accent"
        />
        <div>
          <EditableText
            as="p"
            initialValue={item.authorName}
            onSave={(v) => onSave("authorName", v)}
            className="font-serif text-lg font-bold text-card-foreground"
          />
          <EditableText
            as="p"
            initialValue={item.authorTitle}
            onSave={(v) => onSave("authorTitle", v)}
            className="font-sans text-sm text-muted-foreground"
          />
        </div>
      </div>
    </div>
  )
}
