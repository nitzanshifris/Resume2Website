"use client"
import { motion } from "framer-motion"
import type React from "react"
import { useState, useEffect } from "react"

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { itemVariants, sectionVariants } from "@/components/ui/animated-section"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { X, Plus, Code, Database, Monitor, Cloud, Settings, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditableText } from "@/components/ui/editable-text"
import { EditableSection } from "@/components/editable-section"
import { useEditMode } from "@/contexts/edit-mode-context"

interface SkillCategory {
  categoryName: string
  skills: string[]
  icon: React.ReactNode
}

interface SkillsSectionProps {
  title: string
  items: SkillCategory[]
  onDataChange?: (items: SkillCategory[]) => void
}

export const SkillsSection = ({ title, items, onDataChange }: SkillsSectionProps) => {
  const { getSizeClasses } = useFontSize()
  const { isEditMode } = useEditMode()
  const [sectionTitle, setSectionTitle] = useState(title)
  const [skillItems, setSkillItems] = useState(items)
  
  // If no items provided, use default RAN LOTAN skills data
  const defaultSkillsData = [
    {
      categoryName: "Programming Languages",
      skills: ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go"],
      icon: <Code className="w-20 h-20 text-foreground transition-colors duration-300" />
    },
    {
      categoryName: "Backend Technologies", 
      skills: ["Node.js", "Django", "FastAPI", "Spring Boot", "Express.js", "GraphQL"],
      icon: <Database className="w-20 h-20 text-foreground transition-colors duration-300" />
    },
    {
      categoryName: "Frontend Technologies",
      skills: ["React", "Vue.js", "Angular", "Next.js", "Tailwind CSS", "Material-UI"],
      icon: <Monitor className="w-20 h-20 text-foreground transition-colors duration-300" />
    },
    {
      categoryName: "Cloud & DevOps",
      skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "GitHub Actions"],
      icon: <Cloud className="w-20 h-20 text-foreground transition-colors duration-300" />
    },
    {
      categoryName: "Tools & Platforms",
      skills: ["Git", "Linux", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
      icon: <Settings className="w-20 h-20 text-foreground transition-colors duration-300" />
    },
    {
      categoryName: "Security & Best Practices",
      skills: ["OAuth 2.0", "JWT", "SSL/TLS", "API Security", "Code Review", "Testing"],
      icon: <Shield className="w-20 h-20 text-foreground transition-colors duration-300" />
    }
  ]

  // Update internal state when items prop changes, use default if empty
  useEffect(() => {
    if (items && items.length > 0) {
      setSkillItems(items)
    } else {
      setSkillItems(defaultSkillsData)
    }
  }, [items])

  const updateCategory = (categoryIndex: number, field: string, value: any) => {
    const updated = [...skillItems]
    updated[categoryIndex] = { ...updated[categoryIndex], [field]: value }
    setSkillItems(updated)
    if (onDataChange) {
      onDataChange(updated)
    }
  }

  const updateSkill = (categoryIndex: number, skillIndex: number, value: string) => {
    const updated = [...skillItems]
    updated[categoryIndex].skills[skillIndex] = value
    setSkillItems(updated)
    if (onDataChange) {
      onDataChange(updated)
    }
  }

  const addSkill = (categoryIndex: number) => {
    const updated = [...skillItems]
    updated[categoryIndex].skills.push("New Skill")
    setSkillItems(updated)
    if (onDataChange) {
      onDataChange(updated)
    }
  }

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const updated = [...skillItems]
    updated[categoryIndex].skills.splice(skillIndex, 1)
    setSkillItems(updated)
    if (onDataChange) {
      onDataChange(updated)
    }
  }

  const addSkillCategory = () => {
    const newCategory: SkillCategory = {
      categoryName: "New Category",
      skills: ["New Skill"],
      icon: <div className="h-6 w-6 bg-accent rounded" />
    }
    const updated = [...skillItems, newCategory]
    setSkillItems(updated)
    if (onDataChange) {
      onDataChange(updated)
    }
  }

  const removeSkillCategory = (categoryIndex: number) => {
    const updated = skillItems.filter((_, i) => i !== categoryIndex)
    setSkillItems(updated)
    if (onDataChange) {
      onDataChange(updated)
    }
  }

  return (
    <EditableSection
      sectionTitle="Skills"
      showAddButton={isEditMode}
      showMoveButtons={false}
      onAddItem={addSkillCategory}
    >
      <motion.section
        id="skills"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <EditableText
          initialValue={sectionTitle}
          onSave={(value) => setSectionTitle(value)}
          as="h2"
          className={cn(
            "font-bold mb-12 text-center text-foreground",
            getSizeClasses("sectionTitle"),
          )}
        />

        <BentoGrid className="max-w-7xl mx-auto">
          {skillItems.filter(category => category.skills.some(Boolean)).map((category, i) => (
            <BentoGridItem
              key={i}
              title={
                <EditableText
                  initialValue={category.categoryName}
                  onSave={(value) => updateCategory(i, 'categoryName', value)}
                  as="h3"
                  className={cn("font-semibold", getSizeClasses("bentoTitle"))}
                />
              }
              icon={category.icon}
              onDelete={isEditMode ? () => removeSkillCategory(i) : undefined}
              description={
                <div className="w-full">
                  <ul
                    className={cn(
                      "list-none text-card-foreground space-y-2 text-left w-full",
                      getSizeClasses("bentoDesc"),
                    )}
                  >
                    {category.skills.filter(Boolean).map((skill, j) => (
                      <li key={j} className="group relative flex items-center">
                        <span className="text-accent mr-2">•</span>
                        <EditableText
                          initialValue={skill}
                          onSave={(value) => updateSkill(i, j, value)}
                          as="span"
                          className="flex-1"
                        />
                        {isEditMode && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeSkill(i, j)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 ml-2"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                  {isEditMode && (
                    <button
                      onClick={() => addSkill(i)}
                      className="mt-3 text-xs text-muted-foreground hover:text-card-foreground transition-colors flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add skill
                    </button>
                  )}
                </div>
              }
              className={"col-span-1"}
            />
          ))}
        </BentoGrid>
      </motion.section>
    </EditableSection>
  )
}