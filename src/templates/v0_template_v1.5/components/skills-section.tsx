"use client"
import type { SkillsData } from "@/lib/data"
import { SkillCategoryAccordion } from "./skill-category-accordion"
import { CardCarousel } from "@/components/card-carousel"

interface SkillsSectionProps {
  data: SkillsData
  onSaveSkill: (categoryIndex: number, skillIndex: number, value: string) => void
  onSaveUngroupedSkill: (skillIndex: number, value: string) => void
  onReorderCategories?: (newCategories: any[]) => void
  onReorderSkills?: (categoryIndex: number, newSkills: any[]) => void
}

export function SkillsSection({ data, onSaveSkill, onSaveUngroupedSkill, onReorderCategories, onReorderSkills }: SkillsSectionProps) {
  const allCategories = [
    ...data.skillCategories,
    ...(data.ungroupedSkills.length > 0 ? [{ categoryName: "Additional Skills", skills: data.ungroupedSkills }] : []),
  ]

  return (
    <CardCarousel
      items={allCategories}
      itemClassName="basis-full md:basis-1/2 lg:basis-1/3 px-2 md:px-4" // Show 1 on mobile, 2 on tablet, 3 on desktop
      carouselOpts={{ loop: true, align: "start" }}
      containerClassName="max-w-6xl" // Wider container to fit 3 items
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
          onReorderSkills={onReorderSkills ? (newSkills) => onReorderSkills(index, newSkills) : undefined}
        />
      )}
    />
  )
}
