"use client"
import { motion } from "framer-motion"
import { AnimatedSection, itemVariants } from "@/components/ui/animated-section"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { EditableText } from "@/components/ui/editable-text"
import { EditableSection } from "@/components/editable-section"
import { useEditMode } from "@/contexts/edit-mode-context"
import { useState } from "react"
import { SmartCard, ViewMode } from "@/components/smart-card"
import { BookOpen, ArrowUpRight } from "lucide-react"

interface Publication {
  title: string
  journal: string
  date: string
  link: string
  // SmartCard fields
  viewMode?: ViewMode
  images?: string[]
  codeSnippet?: string
  codeLanguage?: string
  githubUrl?: string
  videoUrl?: string
  linkUrl?: string
  [key: string]: any
}

interface PublicationsSectionProps {
  title: string
  items: Publication[]
}

export const PublicationsSection = ({ title, items }: PublicationsSectionProps) => {
  const { getSizeClasses } = useFontSize()
  const { isEditMode } = useEditMode()
  const [sectionTitle, setSectionTitle] = useState(title)
  const [publications, setPublications] = useState(items)

  const updatePublication = (index: number, field: string, value: any) => {
    const updated = [...publications]
    updated[index] = { ...updated[index], [field]: value }
    setPublications(updated)
  }

  const deletePublication = (index: number) => {
    const updated = publications.filter((_, i) => i !== index)
    setPublications(updated)
  }

  return (
    <EditableSection
      sectionTitle="Publications"
      showAddButton={isEditMode}
      showMoveButtons={false}
      onAddItem={() => {
        const newPub: Publication = {
          title: "New Publication Title",
          journal: "Journal Name",
          date: "2024",
          link: "#",
          viewMode: "text" as ViewMode
        }
        setPublications([...publications, newPub])
      }}
    >
      <AnimatedSection id="publications">
        <EditableText
          as="h2"
          initialValue={sectionTitle}
          onSave={setSectionTitle}
          className={cn(
            "font-bold mb-12 text-left text-foreground",
            getSizeClasses("sectionTitle"),
          )}
        />
        <div className="space-y-8">
          {publications.map((pub, i) => (
            <motion.div variants={itemVariants} key={i}>
              <SmartCard
                item={pub}
                onUpdate={(field, value) => updatePublication(i, field, value)}
                onDelete={() => deletePublication(i)}
                className="h-full"
              >
                <div className="relative group overflow-hidden block p-4 md:p-6 bg-card border border-border rounded-lg hover:border-accent/50 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative space-y-4">
                    <div className="space-y-2">
                      <EditableText
                        as="h3"
                        initialValue={pub.title}
                        onSave={(value) => updatePublication(i, 'title', value)}
                        className={cn("font-bold text-card-foreground leading-tight block mb-0", getSizeClasses("timelineTitle"))}
                        enableColorEdit={true}
                        initialColor={pub.titleColor || ''}
                        onColorChange={(color) => updatePublication(i, 'titleColor', color)}
                      />
                      {pub.journal && (
                        <EditableText
                          as="p"
                          initialValue={pub.journal}
                          onSave={(value) => updatePublication(i, 'journal', value)}
                          className={cn("text-accent font-medium italic block mt-1", getSizeClasses("timelineSubtitle"))}
                          enableColorEdit={true}
                          initialColor={pub.journalColor || ''}
                          onColorChange={(color) => updatePublication(i, 'journalColor', color)}
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <EditableText
                          as="span"
                          initialValue={pub.date}
                          onSave={(value) => updatePublication(i, 'date', value)}
                          className={cn("text-sm font-medium text-muted-foreground", getSizeClasses("timelinePeriod"))}
                          enableColorEdit={true}
                          initialColor={pub.dateColor || ''}
                          onColorChange={(color) => updatePublication(i, 'dateColor', color)}
                        />
                      </div>
                      {!isEditMode && pub.link && pub.link !== "#" && (
                        <ArrowUpRight className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    {!isEditMode && pub.link !== "#" && pub.viewMode === 'text' && (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 z-10"
                        aria-label={`View ${pub.title}`}
                      />
                    )}
                    {isEditMode && (
                      <EditableText
                        as="p"
                        initialValue={pub.link}
                        onSave={(value) => updatePublication(i, 'link', value)}
                        className={cn("text-muted-foreground mt-2 text-sm", getSizeClasses("small"))}
                        placeholder="Publication link"
                      />
                    )}
                  </div>
                </div>
              </SmartCard>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </EditableSection>
  )
}
