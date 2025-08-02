"use client"
import { AnimatedSection } from "@/components/ui/animated-section"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { useState, useLayoutEffect, useRef } from "react"
import { EditableText } from "@/components/ui/editable-text"
import { EditableSection } from "@/components/editable-section"
import { useEditMode } from "@/contexts/edit-mode-context"

interface ParagraphSectionProps {
  title: string
  description: string
}

export const ParagraphSection = ({ title, description }: ParagraphSectionProps) => {
  const { getSizeClasses, fontSize } = useFontSize()
  const { isEditMode } = useEditMode()
  const [containerHeight, setContainerHeight] = useState<number | "auto">("auto")
  const measurementRef = useRef<HTMLDivElement>(null)
  const [sectionTitle, setSectionTitle] = useState(title)
  const [sectionDescription, setSectionDescription] = useState(description)

  const words = sectionDescription.split(" ").map((word) => ({
    text: word,
  }))

  // Measure the full height of the text on mount and when font size changes
  useLayoutEffect(() => {
    if (measurementRef.current) {
      setContainerHeight(measurementRef.current.offsetHeight)
    }
  }, [sectionDescription, fontSize])

  const textClasses = cn("text-foreground leading-relaxed text-left", getSizeClasses("profileDesc"))

  return (
    <EditableSection
      sectionTitle="Professional Summary"
      showAddButton={false}
      showMoveButtons={false}
    >
      <AnimatedSection id="professionalSummary">
        <EditableText
          as="h2"
          initialValue={sectionTitle}
          onSave={setSectionTitle}
          className={cn(
            "font-bold text-center mb-12 text-foreground",
            getSizeClasses("sectionTitle"),
          )}
        />

        {/* Edit mode shows editable text, non-edit mode shows typewriter */}
        {isEditMode ? (
          <EditableText
            as="p"
            initialValue={sectionDescription}
            onSave={setSectionDescription}
            className={textClasses}
            multiline
          />
        ) : (
          <div style={{ minHeight: containerHeight || "auto" }} className="relative w-full">
            {/* This hidden div is used only for measurement */}
            <div ref={measurementRef} className={cn(textClasses, "opacity-0 absolute -z-10 w-full select-none")}>
              {sectionDescription}
            </div>

            {/* The typewriter is only rendered after the height is calculated */}
            {containerHeight !== "auto" && <TypewriterEffect words={words} className={textClasses} />}
          </div>
        )}
      </AnimatedSection>
    </EditableSection>
  )
}
