"use client"
import { motion } from "framer-motion"
import { AnimatedSection, itemVariants } from "@/components/ui/animated-section"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { Lightbulb, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditableText } from "@/components/ui/editable-text"
import { EditableSection } from "@/components/editable-section"
import { useEditMode } from "@/contexts/edit-mode-context"
import { useState } from "react"

interface Patent {
  title: string
  office: string
  date: string
  link: string
}

interface PatentsSectionProps {
  title: string
  items: Patent[]
}

export const PatentsSection = ({ title, items }: PatentsSectionProps) => {
  const { getSizeClasses } = useFontSize()
  const { isEditMode } = useEditMode()
  const [sectionTitle, setSectionTitle] = useState(title)
  const [patents, setPatents] = useState(items)

  const updatePatent = (index: number, field: keyof Patent, value: string) => {
    const updated = [...patents]
    updated[index] = { ...updated[index], [field]: value }
    setPatents(updated)
  }

  const deletePatent = (index: number) => {
    const updated = patents.filter((_, i) => i !== index)
    setPatents(updated)
  }

  return (
    <EditableSection
      sectionTitle="Patents"
      showAddButton={isEditMode}
      showMoveButtons={false}
      onAddItem={() => {
        const newPatent: Patent = {
          title: "New Patent Title",
          office: "Patent Office",
          date: "2024",
          link: "#"
        }
        setPatents([...patents, newPatent])
      }}
    >
      <AnimatedSection id="patents">
        <EditableText
          as="h2"
          initialValue={sectionTitle}
          onSave={setSectionTitle}
          className={cn(
            "font-bold mb-12 text-center text-foreground",
            getSizeClasses("sectionTitle"),
          )}
        />
        <div className="space-y-8">
          {patents.map((patent, i) => (
            <motion.div variants={itemVariants} key={i}>
              <div className="block p-6 bg-background/50 dark:bg-background/50 light:bg-gray-100 border border-neutral-800 dark:border-neutral-800 light:border-gray-300 rounded-lg hover:border-accent/50 transition-colors shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)] dark:shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)] light:shadow-none relative group overflow-hidden">
                <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-2xl"></div>
                
                {/* Delete Button */}
                {isEditMode && (
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 shadow-md"
                    onClick={() => deletePatent(i)}
                    title="Delete patent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <Lightbulb className="h-8 w-8 text-accent mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <EditableText
                        as="h3"
                        initialValue={patent.title}
                        onSave={(value) => updatePatent(i, 'title', value)}
                        className={cn("font-bold text-foreground", getSizeClasses("timelineTitle"))}
                      />
                      <EditableText
                        as="p"
                        initialValue={patent.office}
                        onSave={(value) => updatePatent(i, 'office', value)}
                        className={cn("text-accent mt-2", getSizeClasses("timelineSubtitle"))}
                      />
                      <EditableText
                        as="p"
                        initialValue={patent.date}
                        onSave={(value) => updatePatent(i, 'date', value)}
                        className={cn("text-neutral-400 dark:text-neutral-400 light:text-gray-600 mt-1", getSizeClasses("timelinePeriod"))}
                      />
                      {!isEditMode && patent.link !== "#" && (
                        <a
                          href={patent.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 z-10"
                          aria-label={`View ${patent.title}`}
                        />
                      )}
                      {isEditMode && (
                        <EditableText
                          as="p"
                          initialValue={patent.link}
                          onSave={(value) => updatePatent(i, 'link', value)}
                          className={cn("text-neutral-500 dark:text-neutral-500 light:text-gray-500 mt-2 text-sm", getSizeClasses("small"))}
                          placeholder="Patent link"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </EditableSection>
  )
}
