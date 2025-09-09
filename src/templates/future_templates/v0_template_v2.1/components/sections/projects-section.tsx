"use client"

import { motion } from "framer-motion"
import { AnimatedSection, itemVariants } from "@/components/ui/animated-section"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import { Link } from "lucide-react"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { EditableText } from "@/components/ui/editable-text"
import { SmartCard } from "@/components/smart-card"
import { EditableSection } from "@/components/editable-section"
import { useEditMode } from "@/contexts/edit-mode-context"
import { useState } from "react"

interface Project {
  title: string
  description: string
  link: string
  viewMode?: string
  [key: string]: any
}

interface ProjectsSectionProps {
  title: string
  items: Project[]
  onUpdate?: (index: number, field: string, value: any) => void
  onAddItem?: () => void
  onDeleteItem?: (index: number) => void
}

export const ProjectsSection = ({ title, items, onUpdate, onAddItem, onDeleteItem }: ProjectsSectionProps) => {
  const { getSizeClasses } = useFontSize()
  const { isEditMode } = useEditMode()
  const [sectionTitle, setSectionTitle] = useState(title)
  const [projectItems, setProjectItems] = useState(items)

  const handleUpdate = (index: number, field: string, value: any) => {
    const updatedItems = [...projectItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setProjectItems(updatedItems)
    onUpdate?.(index, field, value)
  }

  const handleAddItem = () => {
    const newItem: Project = {
      title: 'New Project',
      description: 'Project description',
      link: '#',
      viewMode: 'text'
    }
    setProjectItems([...projectItems, newItem])
    onAddItem?.()
  }

  const handleDeleteItem = (index: number) => {
    const updatedItems = projectItems.filter((_, i) => i !== index)
    setProjectItems(updatedItems)
    onDeleteItem?.(index)
  }

  return (
    <EditableSection
      sectionTitle="Projects"
      onAddItem={handleAddItem}
      showAddButton={isEditMode}
      showMoveButtons={false}
    >
      <AnimatedSection id="projects">
        <EditableText
          as="h2"
          initialValue={sectionTitle}
          onSave={setSectionTitle}
          className={cn(
            "font-bold mb-12 text-center text-foreground",
            getSizeClasses("sectionTitle"),
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {projectItems.map((project, i) => {
            const isTextMode = !project.viewMode || project.viewMode === 'text'
            const shouldDisableLink = isEditMode || !isTextMode
            
            return (
              <motion.div variants={itemVariants} key={i}>
                {isTextMode ? (
                  <SmartCard
                    item={project}
                    onUpdate={(field, value) => handleUpdate(i, field, value)}
                    onDelete={() => handleDeleteItem(i)}
                    className="h-full"
                  >
                    <div className={cn(
                      "h-full block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl",
                      !shouldDisableLink && "cursor-pointer"
                    )}>
                      <CardContainer containerClassName="h-full">
                        <CardBody className="bg-card relative group/card hover:shadow-2xl hover:shadow-accent/[0.2] border border-border w-full h-full rounded-xl p-6 flex flex-col justify-between shadow-lg">
                          <div>
                            <EditableText
                              as="h3"
                              initialValue={project.title}
                              onSave={(value) => handleUpdate(i, 'title', value)}
                              className={cn("font-bold text-card-foreground", getSizeClasses("timelineSubtitle"))}
                              enableColorEdit={true}
                              initialColor={project.titleColor || ''}
                              onColorChange={(color) => handleUpdate(i, 'titleColor', color)}
                            />
                            <EditableText
                              as="p"
                              initialValue={project.description}
                              onSave={(value) => handleUpdate(i, 'description', value)}
                              textarea
                              className={cn("mt-2 text-card-foreground", getSizeClasses("bentoDesc"))}
                              enableColorEdit={true}
                              initialColor={project.descriptionColor || ''}
                              onColorChange={(color) => handleUpdate(i, 'descriptionColor', color)}
                            />
                            {isEditMode && (
                              <EditableText
                                as="p"
                                initialValue={project.link || ""}
                                onSave={(value) => handleUpdate(i, 'link', value)}
                                className={cn("mt-2 text-sm text-muted-foreground", getSizeClasses("small"))}
                                placeholder="Project link"
                                enableColorEdit={true}
                                initialColor={project.linkColor || ''}
                                onColorChange={(color) => handleUpdate(i, 'linkColor', color)}
                              />
                            )}
                          </div>
                          <CardItem translateZ="100" className="w-full mt-4 flex justify-end">
                            <Link className="h-12 w-12 text-accent opacity-50 group-hover/card:opacity-100 transition-opacity duration-300" />
                          </CardItem>
                          {!shouldDisableLink && !isEditMode && project.link && project.link !== "#" && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 z-10 rounded-xl"
                              aria-label={`View ${project.title}`}
                            />
                          )}
                        </CardBody>
                      </CardContainer>
                    </div>
                  </SmartCard>
                ) : (
                  <SmartCard
                    item={project}
                    onUpdate={(field, value) => handleUpdate(i, field, value)}
                    onDelete={() => handleDeleteItem(i)}
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
