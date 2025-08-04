"use client"
import { motion } from "framer-motion"
import { AnimatedSection, itemVariants } from "@/components/ui/animated-section"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { Award } from "lucide-react"
import { EditableText } from "@/components/ui/editable-text"
import { EditableSection } from "@/components/editable-section"
import { useEditMode } from "@/contexts/edit-mode-context"
import { useState } from "react"
import { SmartCard, ViewMode } from "@/components/smart-card"

interface Certification {
  title: string
  subtitle: string
  date: string
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

interface CertificationsSectionProps {
  title: string
  items: Certification[]
}

export const CertificationsSection = ({ title, items }: CertificationsSectionProps) => {
  const { getSizeClasses } = useFontSize()
  const { isEditMode } = useEditMode()
  const [sectionTitle, setSectionTitle] = useState(title)
  const [certifications, setCertifications] = useState(items)

  const updateCertification = (index: number, field: string, value: any) => {
    const updated = [...certifications]
    updated[index] = { ...updated[index], [field]: value }
    setCertifications(updated)
  }

  const deleteCertification = (index: number) => {
    const updated = certifications.filter((_, i) => i !== index)
    setCertifications(updated)
  }

  return (
    <EditableSection
      sectionTitle="Certifications"
      showAddButton={isEditMode}
      showMoveButtons={false}
      onAddItem={() => {
        const newCert: Certification = {
          title: "New Certification",
          subtitle: "Issuing Organization",
          date: "2024",
          viewMode: "text" as ViewMode
        }
        setCertifications([...certifications, newCert])
      }}
    >
      <AnimatedSection id="certifications">
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
          {certifications.map((cert, i) => {
            const isTextMode = !cert.viewMode || cert.viewMode === 'text'
            
            return (
              <motion.div
                variants={itemVariants}
                key={i}
              >
                {isTextMode ? (
                  <SmartCard
                    item={cert}
                    onUpdate={(field, value) => updateCertification(i, field, value)}
                    onDelete={() => deleteCertification(i)}
                    className="h-full"
                  >
                    <div className="relative group overflow-hidden block p-4 md:p-6 bg-card border border-border rounded-lg hover:border-accent/50 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="flex items-start gap-3 md:gap-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-accent rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <Award className="h-8 w-8 md:h-10 md:w-10 text-accent relative z-10" />
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="space-y-1">
                              <EditableText
                                as="h3"
                                initialValue={cert.title}
                                onSave={(value) => updateCertification(i, 'title', value)}
                                className={cn("font-bold text-card-foreground leading-tight block mb-0", getSizeClasses("timelineTitle"))}
                                enableColorEdit={true}
                                initialColor={cert.titleColor || ''}
                                onColorChange={(color) => updateCertification(i, 'titleColor', color)}
                              />
                              {cert.subtitle && (
                                <EditableText
                                  as="p"
                                  initialValue={cert.subtitle}
                                  onSave={(value) => updateCertification(i, 'subtitle', value)}
                                  className={cn("text-accent font-medium italic block mt-1", getSizeClasses("timelineSubtitle"))}
                                  enableColorEdit={true}
                                  initialColor={cert.subtitleColor || ''}
                                  onColorChange={(color) => updateCertification(i, 'subtitleColor', color)}
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-px flex-1 bg-border/50"></div>
                              <EditableText
                                as="span"
                                initialValue={cert.date}
                                onSave={(value) => updateCertification(i, 'date', value)}
                                className={cn("text-sm font-medium text-accent px-3 py-1 bg-accent/10 rounded-full", getSizeClasses("timelinePeriod"))}
                                enableColorEdit={true}
                                initialColor={cert.dateColor || ''}
                                onColorChange={(color) => updateCertification(i, 'dateColor', color)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SmartCard>
                ) : (
                  <SmartCard
                    item={cert}
                    onUpdate={(field, value) => updateCertification(i, field, value)}
                    onDelete={() => deleteCertification(i)}
                    className="h-full"
                    fullRender={true}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </AnimatedSection>
    </EditableSection>
  )
}
