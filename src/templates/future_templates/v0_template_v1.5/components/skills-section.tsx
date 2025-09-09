"use client"
import type { SkillsData } from "@/lib/data"
import { SkillCategoryAccordion } from "./skill-category-accordion"
import { CardCarousel } from "@/components/card-carousel"
import { DraggableList } from "@/components/draggable-list"
import { useEditMode } from "@/contexts/edit-mode-context"

interface SkillsSectionProps {
  data: SkillsData
  onSaveSkill: (categoryIndex: number, skillIndex: number, value: string) => void
  onSaveUngroupedSkill: (skillIndex: number, value: string) => void
  onReorderCategories?: (newCategories: any[]) => void
}

export function SkillsSection({ data, onSaveSkill, onSaveUngroupedSkill, onReorderCategories }: SkillsSectionProps) {
  const { isEditMode } = useEditMode()
  const allCategories = [
    ...data.skillCategories,
    ...(data.ungroupedSkills.length > 0 ? [{ categoryName: "Additional Skills", skills: data.ungroupedSkills }] : []),
  ]

  if (isEditMode && onReorderCategories) {
    return (
      <DraggableList
        items={allCategories}
        onReorder={(newCategories) => {
          // Separate the actual skill categories from the "Additional Skills" category
          const actualCategories = newCategories.filter(cat => cat.categoryName !== "Additional Skills")
          
          // Only update the skillCategories, not ungroupedSkills
          onReorderCategories(actualCategories)
        }}
        renderItem={(category, index) => (
          <SkillCategoryAccordion
            category={category}
            onSave={(skillIndex, value) => {
              // Find the actual index in the original data
              const originalIndex = data.skillCategories.findIndex(
                cat => cat.categoryName === category.categoryName
              )
              if (category.categoryName === "Additional Skills") {
                onSaveUngroupedSkill(skillIndex, value)
              } else if (originalIndex !== -1) {
                onSaveSkill(originalIndex, skillIndex, value)
              }
            }}
          />
        )}
        keyExtractor={(category, index) => `${category.categoryName}-${index}`}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto"
        handlePosition="top-right"
        strategy="grid"
      />
    )
  }

  return (
    <CardCarousel
      items={allCategories}
      itemClassName="basis-full md:basis-1/2 lg:basis-1/3 px-2 md:px-4" // Show 1 on mobile, 2 on tablet, 3 on desktop
      carouselOpts={{ loop: true, align: "start" }}
      containerClassName="max-w-6xl" // Wider container to fit 3 items
      renderItem={(category, index) => (
        <SkillCategoryAccordion
          key={`${category.categoryName}-${index}`}
          category={category}
          onSave={(skillIndex, value) => {
            // Find the actual index in the original data
            const originalIndex = data.skillCategories.findIndex(
              cat => cat.categoryName === category.categoryName
            )
            if (category.categoryName === "Additional Skills") {
              onSaveUngroupedSkill(skillIndex, value)
            } else if (originalIndex !== -1) {
              onSaveSkill(originalIndex, skillIndex, value)
            }
          }}
        />
      )}
    />
  )
}
