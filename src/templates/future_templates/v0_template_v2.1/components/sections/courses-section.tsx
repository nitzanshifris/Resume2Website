"use client"
import { motion } from "framer-motion"
import { AnimatedSection, itemVariants } from "@/components/ui/animated-section"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { BookOpenCheck, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditableText } from "@/components/ui/editable-text"
import { EditableSection } from "@/components/editable-section"
import { useEditMode } from "@/contexts/edit-mode-context"
import { useState } from "react"

interface Course {
  title: string
  institution: string
  date: string
}

interface CoursesSectionProps {
  title: string
  items: Course[]
}

export const CoursesSection = ({ title, items }: CoursesSectionProps) => {
  const { getSizeClasses } = useFontSize()
  const { isEditMode } = useEditMode()
  const [sectionTitle, setSectionTitle] = useState(title)
  const [courses, setCourses] = useState(items)

  const updateCourse = (index: number, field: keyof Course, value: string) => {
    const updated = [...courses]
    updated[index] = { ...updated[index], [field]: value }
    setCourses(updated)
  }

  const deleteCourse = (index: number) => {
    const updated = courses.filter((_, i) => i !== index)
    setCourses(updated)
  }

  return (
    <EditableSection
      sectionTitle="Courses"
      showAddButton={isEditMode}
      showMoveButtons={false}
      onAddItem={() => {
        const newCourse: Course = {
          title: "New Course",
          institution: "Institution Name",
          date: "2024"
        }
        setCourses([...courses, newCourse])
      }}
    >
      <AnimatedSection id="courses">
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
        {courses.map((course, i) => (
          <motion.div
            variants={itemVariants}
            key={i}
            className="relative group overflow-hidden block p-6 bg-background/50 dark:bg-background/50 light:bg-gray-100 border border-neutral-800 dark:border-neutral-800 light:border-gray-300 rounded-lg hover:border-accent/50 transition-colors shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)] dark:shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)] light:shadow-none"
          >
            <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-2xl"></div>
            
            {/* Delete Button */}
            {isEditMode && (
              <Button 
                size="icon" 
                variant="destructive" 
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 shadow-md"
                onClick={() => deleteCourse(i)}
                title="Delete course"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            
            <div className="relative">
              <div className="flex items-start gap-4">
                <BookOpenCheck className="h-8 w-8 text-accent mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <EditableText
                    as="h3"
                    initialValue={course.title}
                    onSave={(value) => updateCourse(i, 'title', value)}
                    className={cn("font-bold text-foreground", getSizeClasses("timelineTitle"))}
                  />
                  <EditableText
                    as="p"
                    initialValue={course.institution}
                    onSave={(value) => updateCourse(i, 'institution', value)}
                    className={cn("text-accent mt-1", getSizeClasses("timelineSubtitle"))}
                  />
                  <EditableText
                    as="p"
                    initialValue={course.date}
                    onSave={(value) => updateCourse(i, 'date', value)}
                    className={cn("text-neutral-400 dark:text-neutral-400 light:text-gray-600 mt-1", getSizeClasses("timelinePeriod"))}
                  />
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
