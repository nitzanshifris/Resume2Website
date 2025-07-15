"use client"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import { AnimatedSection, itemVariants } from "@/components/ui/animated-section"
import { Trophy } from "lucide-react"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface Achievement {
  value: string
  label: string
  contextOrDetail?: string
  timeframe?: string
}

interface AccomplishmentsSectionProps {
  title: string
  items: Achievement[]
}

export const AccomplishmentsSection = ({ title, items }: AccomplishmentsSectionProps) => {
  const { getSizeClasses } = useFontSize()

  const formatAchievement = (acc: Achievement) => {
    let text = `${acc.label} ${acc.value}`
    if (acc.contextOrDetail) {
      text += ` ${acc.contextOrDetail}`
    }
    if (acc.timeframe) {
      text += ` (${acc.timeframe})`
    }
    return text
  }

  return (
    <AnimatedSection id="accomplishments">
      <h2
        className={cn(
          "bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent font-bold mb-12 text-center",
          getSizeClasses("sectionTitle"),
        )}
      >
        {title}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {items.map((acc, i) => (
          <motion.div key={i} variants={itemVariants} className="h-full">
            <CardContainer containerClassName="h-full">
              <CardBody className="bg-black relative group/card hover:shadow-2xl hover:shadow-accent/[0.2] border-white/[0.2] w-full h-full rounded-xl p-6 border flex flex-col justify-between shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)]">
                <CardItem
                  translateZ="50"
                  className={cn("font-medium text-neutral-200", getSizeClasses("accomplishmentCard"))}
                >
                  {formatAchievement(acc)}
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4 flex justify-end">
                  <Trophy className="h-12 w-12 text-accent opacity-50 group-hover/card:opacity-100 transition-opacity duration-300" />
                </CardItem>
              </CardBody>
            </CardContainer>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  )
}
