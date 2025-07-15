"use client"
import { motion } from "framer-motion"
import { AnimatedSection, itemVariants } from "@/components/ui/animated-section"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { BadgeCheck } from "lucide-react"

interface Membership {
  organization: string
  role: string
  period: string
}

interface MembershipsSectionProps {
  title: string
  items: Membership[]
}

export const MembershipsSection = ({ title, items }: MembershipsSectionProps) => {
  const { getSizeClasses } = useFontSize()

  return (
    <AnimatedSection id="memberships">
      <h2
        className={cn(
          "bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent font-bold mb-12 text-center",
          getSizeClasses("sectionTitle"),
        )}
      >
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, i) => (
          <motion.div
            variants={itemVariants}
            key={i}
            className="relative group overflow-hidden bg-neutral-900/50 border border-neutral-800 p-6 rounded-lg flex items-center gap-6 hover:border-accent/50 transition-colors shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)]"
          >
            <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-2xl"></div>
            <div className="relative">
              <BadgeCheck className="h-8 w-8 text-accent flex-shrink-0" />
              <div>
                <h3 className={cn("text-neutral-100 font-bold", getSizeClasses("timelineTitle"))}>
                  {item.organization}
                </h3>
                {item.role && <p className={cn("text-accent", getSizeClasses("timelineSubtitle"))}>{item.role}</p>}
                {item.period && (
                  <p className={cn("text-neutral-400 mt-1", getSizeClasses("timelinePeriod"))}>{item.period}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  )
}
