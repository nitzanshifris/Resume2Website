"use client"
import { AnimatedSection } from "@/components/ui/animated-section"
import { VerticalTimeline, VerticalTimelineItem, timelineContentVariants } from "@/components/ui/vertical-timeline"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface TimelineItem {
  period: string
  title: string
  subtitle: string
  details?: string[]
  gpa?: string
}

interface TimelineSectionProps {
  id: string
  title: string
  items: TimelineItem[]
}

export const TimelineSection = ({ id, title, items }: TimelineSectionProps) => {
  const { getSizeClasses } = useFontSize()

  return (
    <AnimatedSection id={id}>
      <h2
        className={cn(
          "bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent font-bold mb-12 text-center",
          getSizeClasses("sectionTitle"),
        )}
      >
        {title}
      </h2>
      <VerticalTimeline>
        {items.map((item, i) => (
          <VerticalTimelineItem key={i}>
            <motion.p
              variants={timelineContentVariants}
              className={cn("text-neutral-400 mb-2", getSizeClasses("timelinePeriod"))}
            >
              {item.period}
            </motion.p>
            <motion.h3
              variants={timelineContentVariants}
              className={cn("font-bold text-neutral-100 my-2.5", getSizeClasses("timelineTitle"))}
            >
              {item.title}
            </motion.h3>
            <motion.p
              variants={timelineContentVariants}
              className={cn("text-accent mb-4", getSizeClasses("timelineSubtitle"))}
            >
              {item.subtitle}
            </motion.p>
            {item.gpa && (
              <motion.p
                variants={timelineContentVariants}
                className={cn("text-neutral-300", getSizeClasses("timelineList"))}
              >
                GPA: {item.gpa}
              </motion.p>
            )}
            {item.details && (
              <motion.ul
                variants={timelineContentVariants}
                className={cn("list-disc list-inside text-neutral-300 space-y-2 mt-4", getSizeClasses("timelineList"))}
              >
                {item.details.map((detail, j) => (
                  <li key={j}>{detail}</li>
                ))}
              </motion.ul>
            )}
          </VerticalTimelineItem>
        ))}
      </VerticalTimeline>
    </AnimatedSection>
  )
}
