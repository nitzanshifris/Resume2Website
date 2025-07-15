"use client"
import { motion } from "framer-motion"
import { AnimatedSection, itemVariants } from "@/components/ui/animated-section"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"

interface Publication {
  title: string
  journal: string
  date: string
  link: string
}

interface PublicationsSectionProps {
  title: string
  items: Publication[]
}

export const PublicationsSection = ({ title, items }: PublicationsSectionProps) => {
  const { getSizeClasses } = useFontSize()

  return (
    <AnimatedSection id="publications">
      <h2
        className={cn(
          "bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent font-bold mb-12 text-center",
          getSizeClasses("sectionTitle"),
        )}
      >
        {title}
      </h2>
      <div className="space-y-8">
        {items.map((pub, i) => (
          <motion.div variants={itemVariants} key={i}>
            <a
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group overflow-hidden block p-6 bg-neutral-900/50 border border-neutral-800 rounded-lg hover:border-accent/50 transition-colors shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)]"
            >
              <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-2xl"></div>
              <div className="relative">
                <h3 className={cn("font-bold text-neutral-100", getSizeClasses("timelineTitle"))}>{pub.title}</h3>
                <p className={cn("text-accent mt-2", getSizeClasses("timelineSubtitle"))}>{pub.journal}</p>
                <p className={cn("text-neutral-400 mt-1", getSizeClasses("timelinePeriod"))}>{pub.date}</p>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  )
}
