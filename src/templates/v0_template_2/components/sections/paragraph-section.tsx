"use client"
import { AnimatedSection } from "@/components/ui/animated-section"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { useState, useLayoutEffect, useRef } from "react"

interface ParagraphSectionProps {
  title: string
  description: string
}

export const ParagraphSection = ({ title, description }: ParagraphSectionProps) => {
  const { getSizeClasses, fontSize } = useFontSize()
  const [containerHeight, setContainerHeight] = useState<number | "auto">("auto")
  const measurementRef = useRef<HTMLDivElement>(null)

  const words = description.split(" ").map((word) => ({
    text: word,
  }))

  // Measure the full height of the text on mount and when font size changes
  useLayoutEffect(() => {
    if (measurementRef.current) {
      setContainerHeight(measurementRef.current.offsetHeight)
    }
  }, [description, fontSize])

  const textClasses = cn("text-neutral-300 leading-relaxed text-left", getSizeClasses("profileDesc"))

  return (
    <AnimatedSection id="professionalSummary">
      <h2
        className={cn(
          "bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent font-bold text-center mb-12",
          getSizeClasses("sectionTitle"),
        )}
      >
        {title}
      </h2>

      {/* This wrapper reserves the required height to prevent layout shift */}
      <div style={{ minHeight: containerHeight || "auto" }} className="relative w-full">
        {/* This hidden div is used only for measurement */}
        <div ref={measurementRef} className={cn(textClasses, "opacity-0 absolute -z-10 w-full select-none")}>
          {description}
        </div>

        {/* The typewriter is only rendered after the height is calculated */}
        {containerHeight !== "auto" && <TypewriterEffect words={words} className={textClasses} />}
      </div>
    </AnimatedSection>
  )
}
