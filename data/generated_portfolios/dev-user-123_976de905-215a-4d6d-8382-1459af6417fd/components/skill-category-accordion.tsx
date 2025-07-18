"use client"
import { EditableText } from "@/components/ui/editable-text"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Skill } from "@/lib/data"

interface SkillCategoryAccordionProps {
  category: { categoryName: string; skills: Skill[] }
  onSave: (skillIndex: number, value: string) => void
}

export function SkillCategoryAccordion({ category, onSave }: SkillCategoryAccordionProps) {
  return (
    <div className="rounded-xl bg-card border-2 border-accent shadow-lg">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={category.categoryName} className="border-none">
          <AccordionTrigger className="px-6 py-5 text-lg sm:text-2xl font-serif text-card-foreground hover:no-underline rounded-xl w-full text-left justify-between">
            {category.categoryName}
          </AccordionTrigger>
          <AccordionContent className="px-6">
            <ul className="space-y-3 pt-2 pb-4">
              {category.skills.map((skill, skillIndex) => (
                <li key={skillIndex} className="text-sm sm:text-base text-muted-foreground">
                  <EditableText initialValue={skill.name} onSave={(value) => onSave(skillIndex, value)} />
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
