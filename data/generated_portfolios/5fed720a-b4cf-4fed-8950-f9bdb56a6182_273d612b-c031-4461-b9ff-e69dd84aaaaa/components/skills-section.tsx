"use client"
import type { SkillsData } from "@/lib/data"
import { SkillCategoryAccordion } from "./skill-category-accordion"
import { CardCarousel } from "@/components/card-carousel"

interface SkillsSectionProps {
  data: SkillsData
  onSaveSkill: (categoryIndex: number, skillIndex: number, value: string) => void
  onSaveUngroupedSkill: (skillIndex: number, value: string) => void
}

export function SkillsSection({ data, onSaveSkill, onSaveUngroupedSkill }: SkillsSectionProps) {
  const allCategories = [
    ...data.skillCategories,
    ...(data.ungroupedSkills.length > 0 ? [{ categoryName: "Additional Skills", skills: data.ungroupedSkills }] : []),
  ]

  return (
    <CardCarousel
      items={allCategories}
      itemClassName="basis-full px-2 md:px-4" // Ensure only one item is visible and add some padding
      carouselOpts={{ loop: true, align: "center" }}
      containerClassName="max-w-3xl" // Adjust width for a single item view
      renderItem={(category, index) => (
        <SkillCategoryAccordion
          key={category.categoryName}
          category={category}
          onSave={(skillIndex, value) => {
            // The `index` from renderItem corresponds to the index in `allCategories`.
            // This logic correctly distinguishes between regular categories and the "Additional Skills" category.
            if (category.categoryName === "Additional Skills") {
              onSaveUngroupedSkill(skillIndex, value)
            } else {
              onSaveSkill(index, skillIndex, value)
            }
          }}
        />
      )}
    />
  )
}
