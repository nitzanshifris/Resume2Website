"use client"
import { EditableText } from "@/components/ui/editable-text"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DraggableList } from "@/components/draggable-list"
import { useEditMode } from "@/contexts/edit-mode-context"
import type { Skill } from "@/lib/data"

interface SkillCategoryAccordionProps {
  category: { categoryName: string; skills: Skill[] }
  onSave: (skillIndex: number, value: string) => void
  onReorderSkills?: (newSkills: Skill[]) => void
}

export function SkillCategoryAccordion({ category, onSave, onReorderSkills }: SkillCategoryAccordionProps) {
  const { isEditMode } = useEditMode()
  return (
    <div className="rounded-xl bg-card border-2 border-accent shadow-lg">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={category.categoryName} className="border-none">
          <AccordionTrigger className="px-6 py-5 text-lg sm:text-2xl font-serif text-card-foreground hover:no-underline rounded-xl w-full text-left justify-between">
            {category.categoryName}
          </AccordionTrigger>
          <AccordionContent className="px-6">
            <div className="pt-2 pb-4">
              {onReorderSkills && isEditMode ? (
                <DraggableList
                  items={category.skills}
                  onReorder={onReorderSkills}
                  renderItem={(skill, skillIndex) => (
                    <div className="text-sm sm:text-base text-muted-foreground py-1.5">
                      {skill.detailedDisplayText ? (
                        <EditableText 
                          initialValue={skill.detailedDisplayText} 
                          onSave={(value) => onSave(skillIndex, value)} 
                          className="block"
                        />
                      ) : (
                        <EditableText 
                          initialValue={skill.name} 
                          onSave={(value) => onSave(skillIndex, value)} 
                        />
                      )}
                    </div>
                  )}
                  keyExtractor={(skill, index) => `skill-${category.categoryName}-${index}`}
                  className="space-y-1"
                />
              ) : (
                <ul className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <li key={skillIndex} className="text-sm sm:text-base text-muted-foreground">
                      {skill.detailedDisplayText ? (
                        <EditableText 
                          initialValue={skill.detailedDisplayText} 
                          onSave={(value) => onSave(skillIndex, value)} 
                          className="block"
                        />
                      ) : (
                        <EditableText 
                          initialValue={skill.name} 
                          onSave={(value) => onSave(skillIndex, value)} 
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
