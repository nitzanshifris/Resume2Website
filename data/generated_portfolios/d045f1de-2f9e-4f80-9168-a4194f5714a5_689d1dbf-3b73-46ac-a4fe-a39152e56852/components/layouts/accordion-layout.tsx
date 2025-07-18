"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { EditableText } from "@/components/ui/editable-text"
import type { ExperienceItem } from "@/lib/data"

interface AccordionLayoutProps {
  items: ExperienceItem[]
  onSave: (index: number, field: keyof ExperienceItem, value: string) => void
}

export function AccordionLayout({ items, onSave }: AccordionLayoutProps) {
  return (
    <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`} className="border-b-2 border-accent/20">
          <AccordionTrigger className="text-left hover:no-underline py-6">
            <div className="flex flex-row justify-between w-full pr-4">
              <div className="flex-1 mb-0">
                <EditableText
                  as="h3"
                  className="font-serif text-lg sm:text-2xl font-bold text-card-foreground"
                  initialValue={item.title}
                  onSave={(v) => onSave(i, "title", v)}
                />
                <EditableText
                  as="p"
                  className="font-sans text-base sm:text-lg font-semibold text-accent mt-1"
                  initialValue={item.company}
                  onSave={(v) => onSave(i, "company", v)}
                />
              </div>
              <EditableText
                as="p"
                className="font-sans text-lg text-muted-foreground text-left md:text-right"
                initialValue={`${item.startDate} - ${item.endDate}`}
                onSave={(v) => {
                  const [start = "", end = ""] = v.split(" - ")
                  onSave(i, "startDate", start.trim())
                  onSave(i, "endDate", end.trim())
                }}
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <EditableText
              textarea
              as="p"
              className="font-sans text-sm sm:text-base text-muted-foreground"
              initialValue={item.description}
              onSave={(v) => onSave(i, "description", v)}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
