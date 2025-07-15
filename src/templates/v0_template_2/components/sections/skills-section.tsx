"use client"
import { motion } from "framer-motion"
import type React from "react"

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { itemVariants, sectionVariants } from "@/components/ui/animated-section"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"

interface SkillCategory {
  categoryName: string
  skills: string[]
  icon: React.ReactNode
}

interface SkillsSectionProps {
  title: string
  items: SkillCategory[]
}

export const SkillsSection = ({ title, items }: SkillsSectionProps) => {
  const { getSizeClasses } = useFontSize()

  return (
    <motion.section
      id="skills"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <motion.h2
        variants={itemVariants}
        className={cn(
          "bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent font-bold mb-12 text-center",
          getSizeClasses("sectionTitle"),
        )}
      >
        {title}
      </motion.h2>

      <BentoGrid className="max-w-7xl mx-auto">
        {items.map((category, i) => (
          <BentoGridItem
            key={i}
            title={category.categoryName}
            icon={category.icon}
            description={
              <ul
                className={cn(
                  "list-disc list-inside text-neutral-300 space-y-1 text-left w-full mt-2 pl-2 md:pl-4 text-xs md:text-sm",
                  getSizeClasses("bentoDesc"),
                )}
              >
                {category.skills.slice(0, 4).map((skill, j) => (
                  <li key={j}>{skill}</li>
                ))}
              </ul>
            }
            className={"col-span-1"}
          />
        ))}
      </BentoGrid>
    </motion.section>
  )
}
