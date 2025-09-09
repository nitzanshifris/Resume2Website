"use client"

import { motion } from "framer-motion"
import { AnimatedSection, itemVariants } from "@/components/ui/animated-section"
import { LanguagesIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { EditableText } from "@/components/ui/editable-text"
import { EditableSection } from "@/components/editable-section"
import { useEditMode } from "@/contexts/edit-mode-context"
import { useState } from "react"

interface LanguageItem {
  name: string
  proficiency: string
}

interface LanguagesSectionProps {
  title: string
  items: LanguageItem[]
}

export const LanguagesSection = ({ title, items }: LanguagesSectionProps) => {
  const { getSizeClasses } = useFontSize()
  const { isEditMode } = useEditMode()
  const [sectionTitle, setSectionTitle] = useState(title)
  const [languages, setLanguages] = useState(items)

  const updateLanguage = (index: number, field: keyof LanguageItem, value: string) => {
    const updated = [...languages]
    updated[index] = { ...updated[index], [field]: value }
    setLanguages(updated)
  }

  const deleteLanguage = (index: number) => {
    const updated = languages.filter((_, i) => i !== index)
    setLanguages(updated)
  }

  return (
    <EditableSection
      sectionTitle="Languages"
      showAddButton={isEditMode}
      showMoveButtons={false}
      onAddItem={() => {
        const newLanguage: LanguageItem = {
          name: "New Language",
          proficiency: "Proficiency Level"
        }
        setLanguages([...languages, newLanguage])
      }}
    >
      <AnimatedSection id="languages">
        <EditableText
          as="h2"
          initialValue={sectionTitle}
          onSave={setSectionTitle}
          className={cn(
            "font-bold mb-12 text-left text-foreground",
            getSizeClasses("sectionTitle"),
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {languages.map((lang, i) => (
            <motion.div
              variants={itemVariants}
              key={i}
              className="relative group overflow-hidden bg-card border border-border p-6 rounded-lg flex items-center gap-6 hover:border-accent/50 transition-colors shadow-lg"
            >
              <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-2xl"></div>
              
              {/* Delete Button */}
              {isEditMode && (
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 shadow-md"
                  onClick={() => deleteLanguage(i)}
                  title="Delete language"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              
              <div className="relative flex items-start gap-4 w-full">
                <LanguagesIcon className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <EditableText
                    as="h3"
                    initialValue={lang.name}
                    onSave={(value) => updateLanguage(i, 'name', value)}
                    className={cn("text-card-foreground font-bold", getSizeClasses("timelineTitle"))}
                  />
                  <EditableText
                    as="p"
                    initialValue={lang.proficiency}
                    onSave={(value) => updateLanguage(i, 'proficiency', value)}
                    className={cn("text-muted-foreground", getSizeClasses("timelineSubtitle"))}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </EditableSection>
  )
}
