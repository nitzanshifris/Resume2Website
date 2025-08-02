"use client"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import { AnimatedSection, itemVariants } from "@/components/ui/animated-section"
import { Trophy } from "lucide-react"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { EditableText } from "@/components/ui/editable-text"
import { EditableSection } from "@/components/editable-section"
import { useEditMode } from "@/contexts/edit-mode-context"
import { useState, useEffect } from "react"
import { SmartCard, ViewMode } from "@/components/smart-card"

interface Achievement {
  title: string
  description: string
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

interface AccomplishmentsSectionProps {
  title: string
  items: Achievement[]
  onDataChange?: (items: Achievement[]) => void
}

export const AccomplishmentsSection = ({ title, items, onDataChange }: AccomplishmentsSectionProps) => {
  const { getSizeClasses } = useFontSize()
  const { isEditMode } = useEditMode()
  const [sectionTitle, setSectionTitle] = useState(title)
  const [achievements, setAchievements] = useState(items)
  
  // Default RAN LOTAN achievements data
  const defaultAccomplishments = [
    {
      title: "Scaled Netflix Streaming Infrastructure",
      description: "Led the implementation of microservices architecture that improved system performance by 40% and reduced latency by 60%",
      metrics: "40% performance improvement, 60% latency reduction",
      date: "2023"
    },
    {
      title: "AWS Cost Optimization Initiative", 
      description: "Designed and implemented cloud infrastructure optimization strategies that reduced operational costs by $2M annually",
      metrics: "$2M annual cost savings",
      date: "2022"
    },
    {
      title: "Open Source Contribution Recognition",
      description: "Received recognition for significant contributions to major open-source projects with over 1000+ GitHub stars",
      metrics: "1000+ GitHub stars",
      date: "2022"
    },
    {
      title: "System Architecture Excellence Award",
      description: "Awarded for designing highly scalable distributed systems serving 50M+ daily active users",
      metrics: "50M+ daily active users",
      date: "2021"
    },
    {
      title: "Innovation Patent Achievement",
      description: "Filed and approved 2 technical patents for distributed system optimization and caching mechanisms",
      metrics: "2 approved patents",
      date: "2020"
    },
    {
      title: "Team Leadership Excellence",
      description: "Successfully led cross-functional teams of 15+ engineers delivering critical infrastructure projects on time",
      metrics: "15+ team members managed",
      date: "2019"
    }
  ]

  // Update internal state when items prop changes, use default if empty
  useEffect(() => {
    if (items && items.length > 0) {
      setAchievements(items)
    } else {
      setAchievements(defaultAccomplishments)
    }
  }, [items])

  const updateAchievement = (index: number, field: string, value: any) => {
    const updated = [...achievements]
    updated[index] = { ...updated[index], [field]: value }
    setAchievements(updated)
    if (onDataChange) {
      onDataChange(updated)
    }
  }

  const deleteAchievement = (index: number) => {
    const updated = achievements.filter((_, i) => i !== index)
    setAchievements(updated)
    if (onDataChange) {
      onDataChange(updated)
    }
  }

  const addAchievement = () => {
    const newAchievement: Achievement = {
      title: "New Achievement",
      description: "Achievement description",
      viewMode: "text" as ViewMode
    }
    const updated = [...achievements, newAchievement]
    setAchievements(updated)
    if (onDataChange) {
      onDataChange(updated)
    }
  }

  return (
    <EditableSection
      sectionTitle="Key Achievements"
      showAddButton={isEditMode}
      showMoveButtons={false}
      onAddItem={addAchievement}
    >
      <AnimatedSection id="accomplishments">
        <EditableText
          initialValue={sectionTitle}
          onSave={(value) => setSectionTitle(value)}
          as="h2"
          className={cn(
            "font-bold mb-12 text-center text-foreground",
            getSizeClasses("sectionTitle"),
          )}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {achievements.map((acc, i) => {
            const isTextMode = !acc.viewMode || acc.viewMode === 'text'
            
            return (
              <motion.div key={i} variants={itemVariants} className="h-full">
                {isTextMode ? (
                  <SmartCard
                    item={acc}
                    onUpdate={(field, value) => updateAchievement(i, field, value)}
                    onDelete={() => deleteAchievement(i)}
                    className="h-full"
                  >
                    <CardContainer containerClassName="h-full">
                      <CardBody className="bg-card relative group/card hover:shadow-2xl hover:shadow-accent/[0.2] border border-border w-full h-full rounded-xl p-6 flex flex-col justify-between shadow-lg">
                        <div>
                          <EditableText
                            initialValue={acc.title}
                            onSave={(value) => updateAchievement(i, 'title', value)}
                            as="h3"
                            className={cn("font-bold text-card-foreground", getSizeClasses("timelineSubtitle"))}
                          />
                          <EditableText
                            initialValue={acc.description}
                            onSave={(value) => updateAchievement(i, 'description', value)}
                            as="p"
                            textarea
                            className={cn("mt-2 text-card-foreground", getSizeClasses("bentoDesc"))}
                          />
                        </div>
                        <CardItem translateZ="100" className="w-full mt-4 flex justify-end">
                          <Trophy className="h-12 w-12 text-accent opacity-50 group-hover/card:opacity-100 transition-opacity duration-300" />
                        </CardItem>
                      </CardBody>
                    </CardContainer>
                  </SmartCard>
                ) : (
                  <SmartCard
                    item={acc}
                    onUpdate={(field, value) => updateAchievement(i, field, value)}
                    onDelete={() => deleteAchievement(i)}
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