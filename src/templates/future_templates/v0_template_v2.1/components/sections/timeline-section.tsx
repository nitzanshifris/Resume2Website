"use client"
import { AnimatedSection } from "@/components/ui/animated-section"
import { VerticalTimeline, VerticalTimelineItem, timelineContentVariants } from "@/components/ui/vertical-timeline"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { EditableText } from "@/components/ui/editable-text"
import { EditableSection } from "@/components/editable-section"
import { useEditMode } from "@/contexts/edit-mode-context"
import { useState, useEffect } from "react"
import { SmartCard, ViewMode } from "@/components/smart-card"

interface TimelineItem {
  period: string
  title: string
  subtitle: string
  details?: string[]
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

interface TimelineSectionProps {
  id: string
  title: string
  items: TimelineItem[]
  onDataChange?: (items: TimelineItem[]) => void
}

export const TimelineSection = ({ id, title, items, onDataChange }: TimelineSectionProps) => {
  const { getSizeClasses } = useFontSize()
  const { isEditMode } = useEditMode()
  const [sectionTitle, setSectionTitle] = useState(title)
  
  // Default education data for RAN LOTAN
  const defaultEducationData = [
    {
      title: "Master of Science, Computer Science",
      subtitle: "Carnegie Mellon University, Pittsburgh, PA, United States",
      period: "2010 - 2012",
      details: ["Advanced Algorithms", "Distributed Systems", "Machine Learning"]
    },
    {
      title: "Bachelor of Science, Computer Engineering", 
      subtitle: "Stanford University, Stanford, CA, United States",
      period: "2006 - 2010",
      details: ["Summa Cum Laude", "Computer Systems Design", "Software Engineering"]
    },
    {
      title: "Advanced Cloud Architecture Certification",
      subtitle: "Amazon Web Services, Online",
      period: "2022",
      details: ["Solutions Architect Professional", "DevOps Engineer Professional"]
    },
    {
      title: "Full Stack Development Bootcamp",
      subtitle: "General Assembly, San Francisco, CA, United States", 
      period: "2019",
      details: ["React.js", "Node.js", "Database Design"]
    }
  ]
  
  const [timelineItems, setTimelineItems] = useState(items)

  // Update internal state when items prop changes, use default education data if empty and this is education section
  useEffect(() => {
    if (items && items.length > 0) {
      setTimelineItems(items)
    } else if (id === 'education') {
      setTimelineItems(defaultEducationData)
    } else {
      setTimelineItems(items || [])
    }
  }, [items, id])

  const updateItem = (index: number, field: keyof TimelineItem, value: string | string[]) => {
    const updated = [...timelineItems]
    updated[index] = { ...updated[index], [field]: value }
    setTimelineItems(updated)
    if (onDataChange) {
      onDataChange(updated)
    }
  }

  const updateDetail = (itemIndex: number, detailIndex: number, value: string) => {
    const updated = [...timelineItems]
    const details = [...(updated[itemIndex].details || [])]
    details[detailIndex] = value
    updated[itemIndex] = { ...updated[itemIndex], details }
    setTimelineItems(updated)
    if (onDataChange) {
      onDataChange(updated)
    }
  }

  const addDetail = (itemIndex: number) => {
    const updated = [...timelineItems]
    const details = [...(updated[itemIndex].details || []), "New detail"]
    updated[itemIndex] = { ...updated[itemIndex], details }
    setTimelineItems(updated)
    if (onDataChange) {
      onDataChange(updated)
    }
  }

  const deleteDetail = (itemIndex: number, detailIndex: number) => {
    const updated = [...timelineItems]
    const details = updated[itemIndex].details?.filter((_, i) => i !== detailIndex) || []
    updated[itemIndex] = { ...updated[itemIndex], details }
    setTimelineItems(updated)
    if (onDataChange) {
      onDataChange(updated)
    }
  }

  const deleteItem = (index: number) => {
    const updated = timelineItems.filter((_, i) => i !== index)
    setTimelineItems(updated)
    if (onDataChange) {
      onDataChange(updated)
    }
  }

  const addItem = () => {
    const newItem: TimelineItem = {
      period: "2024 - Present",
      title: "New Position",
      subtitle: "Company Name",
      details: ["New responsibility"],
      viewMode: "text" as ViewMode
    }
    const updated = [...timelineItems, newItem]
    setTimelineItems(updated)
    if (onDataChange) {
      onDataChange(updated)
    }
  }

  return (
    <AnimatedSection id={id}>
      <EditableText
        initialValue={sectionTitle}
        onSave={(value) => setSectionTitle(value)}
        as="h2"
        className={cn("font-bold mb-12 text-foreground", getSizeClasses("sectionTitle"))}
      />
      <VerticalTimeline>
        {timelineItems.map((item, i) => {
          const isTextMode = !item.viewMode || item.viewMode === 'text'
          
          return (
            <VerticalTimelineItem key={i}>
              {isTextMode ? (
                <SmartCard
                  item={item}
                  onUpdate={(field, value) => updateItem(i, field as keyof TimelineItem, value)}
                  onDelete={() => deleteItem(i)}
                  className="w-full"
                >
                  <motion.div
                    className="group relative w-full"
                    variants={timelineContentVariants}
                  >
                    <motion.div variants={timelineContentVariants}>
                      <EditableText
                        initialValue={item.period}
                        onSave={(value) => updateItem(i, 'period', value)}
                        as="p"
                        className={cn("text-sm text-muted-foreground mb-2", getSizeClasses("body"))}
                      />
                    </motion.div>
                    <motion.div variants={timelineContentVariants}>
                      <EditableText
                        initialValue={item.title}
                        onSave={(value) => updateItem(i, 'title', value)}
                        as="h3"
                        className={cn("font-bold text-foreground my-2.5", getSizeClasses("timelineTitle"))}
                      />
                    </motion.div>
                    <motion.div variants={timelineContentVariants}>
                      <EditableText
                        initialValue={item.subtitle}
                        onSave={(value) => updateItem(i, 'subtitle', value)}
                        as="p"
                        className={cn("text-accent mb-4", getSizeClasses("timelineSubtitle"))}
                      />
                    </motion.div>
                    {item.details && item.details.length > 0 && (
                      <motion.div variants={timelineContentVariants}>
                        <ul className={cn("list-disc list-inside text-foreground space-y-2", getSizeClasses("timelineList"))}>
                          {item.details.map((detail, j) => (
                            <li key={j} className="relative group">
                              <EditableText
                                initialValue={detail}
                                onSave={(value) => updateDetail(i, j, value)}
                                as="span"
                                className="inline"
                              />
                              {isEditMode && (
                                <button
                                  onClick={() => deleteDetail(i, j)}
                                  className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Delete detail"
                                >
                                  ×
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                        {isEditMode && (
                          <button
                            onClick={() => addDetail(i)}
                            className="mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            + Add detail
                          </button>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </SmartCard>
              ) : (
                <SmartCard
                  item={item}
                  onUpdate={(field, value) => updateItem(i, field as keyof TimelineItem, value)}
                  onDelete={() => deleteItem(i)}
                  className="w-full"
                  fullRender={true}
                />
              )}
            </VerticalTimelineItem>
          )
        })}
      </VerticalTimeline>
    </AnimatedSection>
  )
}