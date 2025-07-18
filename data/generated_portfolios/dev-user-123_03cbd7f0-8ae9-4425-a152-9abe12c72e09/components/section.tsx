"use client"
import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EditableText } from "@/components/ui/editable-text"
import { cn } from "@/lib/utils"

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
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section id={id} {...sectionAnimation} className={cn("py-12 sm:py-16", className)}>
          <div className={cn(!fullWidth && "max-w-5xl mx-auto px-4")}>
            <EditableText
              as="h2"
              initialValue={title}
              onSave={onSaveTitle}
              className="text-[2.5rem] sm:text-5xl md:text-6xl font-bold text-center mb-10 sm:mb-12 font-serif text-glow max-w-5xl mx-auto px-4"
            />
            {children}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
