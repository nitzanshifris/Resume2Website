"use client"

import { motion } from "framer-motion"
import { itemVariants, sectionVariants } from "@/components/ui/animated-section"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { Heart, Paintbrush, Dumbbell } from "lucide-react"

type HobbiesInput = string[] | { hobbies: string[] }

interface HobbiesSectionProps {
  title: string
  items: HobbiesInput
}

const getHobbyIcon = (hobby: string) => {
  const lowerHobby = hobby.toLowerCase()
  if (lowerHobby.includes("art")) {
    return <Paintbrush className="w-5 h-5 mr-3" />
  }
  if (lowerHobby.includes("rugby") || lowerHobby.includes("cricket")) {
    return <Dumbbell className="w-5 h-5 mr-3" />
  }
  return <Heart className="w-5 h-5 mr-3" />
}

export const HobbiesSection = ({ title, items }: HobbiesSectionProps) => {
  const { getSizeClasses } = useFontSize()

  const hobbiesArray: string[] = Array.isArray(items) ? items : Array.isArray(items?.hobbies) ? items.hobbies : []

  return (
    <motion.section
      id="hobbies"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
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

      {hobbiesArray.length === 0 ? (
        <p className={cn("text-neutral-400 text-center", getSizeClasses("bentoDesc"))}>No hobbies provided.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {hobbiesArray.map((hobby, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className={cn(
                "relative group flex items-center justify-center rounded-full px-8 py-4 text-neutral-200 overflow-hidden",
                "bg-black border border-white/[0.1] shadow-lg transition-all duration-300",
                "hover:border-accent/50 hover:shadow-accent/20",
                getSizeClasses("timelineSubtitle"),
              )}
            >
              <div className="absolute inset-0 w-0 bg-accent/20 transition-all duration-300 ease-out group-hover:w-full"></div>
              <div className="relative z-10 flex items-center">
                {getHobbyIcon(hobby)}
                <span>{hobby}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  )
}
