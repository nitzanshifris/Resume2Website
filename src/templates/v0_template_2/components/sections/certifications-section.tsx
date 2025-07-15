"use client"
import { motion } from "framer-motion"
import { AnimatedSection, itemVariants } from "@/components/ui/animated-section"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { Award } from "lucide-react"

interface Certification {
  title: string
  subtitle: string
  date: string
}

interface CertificationsSectionProps {
  title: string
  items: Certification[]
}

export const CertificationsSection = ({ title, items }: CertificationsSectionProps) => {
  const { getSizeClasses } = useFontSize()

  return (
    <AnimatedSection id="certifications">
      <h2
        className={cn(
          "bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent font-bold mb-12 text-center",
          getSizeClasses("sectionTitle"),
        )}
      >
        {title}
      </h2>
      <div className="space-y-8">
        {items.map((cert, i) => (
          <motion.div
            variants={itemVariants}
            key={i}
            className="relative group overflow-hidden block p-6 bg-neutral-900/50 border border-neutral-800 rounded-lg hover:border-accent/50 transition-colors shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)]"
          >
            <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-2xl"></div>
            <div className="relative">
              <div className="flex items-start gap-4">
                <Award className="h-8 w-8 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h3 className={cn("font-bold text-neutral-100", getSizeClasses("timelineTitle"))}>{cert.title}</h3>
                  <p className={cn("text-accent mt-1", getSizeClasses("timelineSubtitle"))}>{cert.subtitle}</p>
                  <p className={cn("text-neutral-400 mt-1", getSizeClasses("timelinePeriod"))}>{cert.date}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  )
}
