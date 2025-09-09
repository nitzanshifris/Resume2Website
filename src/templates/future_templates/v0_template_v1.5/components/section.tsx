"use client"
import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EditableText } from "@/components/ui/editable-text"
import { cn } from "@/lib/utils"
import { useEditMode } from "@/contexts/edit-mode-context"

interface SectionProps {
  id: string
  title: string
  onSaveTitle: (value: string) => void
  isVisible: boolean
  className?: string
  children: React.ReactNode
  fullWidth?: boolean
}

const sectionAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 },
}

export function Section({ id, title, onSaveTitle, isVisible, className, children, fullWidth = false }: SectionProps) {
  const { isEditMode } = useEditMode()
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section 
          id={id} 
          {...sectionAnimation} 
          className={cn(
            "py-12 sm:py-16 relative",
            className
          )}
        >
          <div className={cn(!fullWidth && "max-w-5xl mx-auto px-4")}>
            <div className="max-w-5xl mx-auto px-4">
              <EditableText
                as="h2"
                initialValue={title}
                onSave={onSaveTitle}
                className="text-[3rem] sm:text-6xl md:text-7xl font-bold text-center mb-10 sm:mb-12 font-serif text-glow"
              />
            </div>
            {children}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
