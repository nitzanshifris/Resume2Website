"use client"

import { motion } from "framer-motion"
import { itemVariants, sectionVariants } from "@/components/ui/animated-section"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { Heart, Paintbrush, Dumbbell, X } from "lucide-react"
import { EditableText } from "@/components/ui/editable-text"
import { EditableSection } from "@/components/editable-section"
import { useEditMode } from "@/contexts/edit-mode-context"
import { useState } from "react"

type HobbiesInput = string[] | { hobbies: string[] }

interface HobbiesSectionProps {
  title: string
  items: HobbiesInput
}

const getHobbyIcon = (hobby: string) => {
  const lowerHobby = hobby.toLowerCase()
  const iconClasses = "w-5 h-5 mr-3 flex-shrink-0 antialiased"
  const iconStyle = { 
    WebkitFontSmoothing: "antialiased",
    transform: "translateZ(0)",
    backfaceVisibility: "hidden"
  }
  
  if (lowerHobby.includes("art")) {
    return <Paintbrush className={iconClasses} style={iconStyle} />
  }
  if (lowerHobby.includes("rugby") || lowerHobby.includes("cricket")) {
    return <Dumbbell className={iconClasses} style={iconStyle} />
  }
  return <Heart className={iconClasses} style={iconStyle} />
}

export const HobbiesSection = ({ title, items }: HobbiesSectionProps) => {
  const { getSizeClasses } = useFontSize()
  const { isEditMode } = useEditMode()
  const [sectionTitle, setSectionTitle] = useState(title)
  
  const initialHobbies: string[] = Array.isArray(items) ? items : Array.isArray(items?.hobbies) ? items.hobbies : []
  const [hobbiesArray, setHobbiesArray] = useState(initialHobbies)

  const updateHobby = (index: number, value: string) => {
    const updated = [...hobbiesArray]
    updated[index] = value
    setHobbiesArray(updated)
  }

  const removeHobby = (index: number) => {
    setHobbiesArray(hobbiesArray.filter((_, i) => i !== index))
  }

  return (
    <EditableSection
      sectionTitle="Hobbies"
      showAddButton={isEditMode}
      showMoveButtons={false}
      onAddItem={() => {
        setHobbiesArray([...hobbiesArray, "New Hobby"])
      }}
    >
      <motion.section
        id="hobbies"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={itemVariants}>
          <EditableText
            as="h2"
            initialValue={sectionTitle}
            onSave={setSectionTitle}
            className={cn(
              "font-bold mb-12 text-left text-foreground",
              getSizeClasses("sectionTitle"),
              // Improve text rendering
              "antialiased",
              "text-rendering-optimizeLegibility",
              "transform-gpu",
              "will-change-transform"
            )}
            style={{
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              textRendering: "optimizeLegibility",
              backfaceVisibility: "hidden",
              transform: "translateZ(0)"
            }}
          />
        </motion.div>

      {hobbiesArray.filter(Boolean).length === 0 ? (
        <p className={cn("text-muted-foreground text-center antialiased", getSizeClasses("bentoDesc"))}>No hobbies provided.</p>
      ) : (
        <div 
          className="flex flex-wrap justify-center gap-6"
          style={{
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            textRendering: "optimizeLegibility"
          }}
        >
          {hobbiesArray.filter(Boolean).map((hobby, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className={cn(
                "relative group/hobby flex items-center justify-center rounded-full px-8 py-4 text-card-foreground overflow-hidden",
                "bg-card border border-border shadow-lg transition-all duration-300",
                "hover:border-accent/50 hover:shadow-accent/20 hover:scale-105",
                getSizeClasses("timelineSubtitle"),
                // Improve rendering quality
                "antialiased transform-gpu will-change-transform",
                "font-medium"
              )}
              style={{
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale",
                textRendering: "optimizeLegibility",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)",
                imageRendering: "crisp-edges"
              }}
            >
              <div className="absolute inset-0 w-0 bg-accent/20 transition-all duration-300 ease-out group-hover/hobby:w-full"></div>
              <div className="relative z-10 flex items-center">
                {getHobbyIcon(hobby)}
                {isEditMode ? (
                  <div className="flex items-center gap-2">
                    <EditableText
                      as="span"
                      initialValue={hobby}
                      onSave={(value) => updateHobby(i, value)}
                      className="inline"
                    />
                    <button
                      onClick={() => removeHobby(i)}
                      className="ml-2 text-red-500 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="font-medium antialiased" style={{ letterSpacing: "0.01em" }}>{hobby}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      </motion.section>
    </EditableSection>
  )
}
