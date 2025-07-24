"use client"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { List, X, Hash, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEditMode } from "@/contexts/edit-mode-context"
import { cn } from "@/lib/utils"

interface Section {
  id: string
  title: string
}

interface SectionsNavigatorProps {
  sections: Section[]
}

export function SectionsNavigator({ sections }: SectionsNavigatorProps) {
  const { isEditMode } = useEditMode()
  const [isOpen, setIsOpen] = useState(false)

  if (!isEditMode) return null

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
      // Highlight the section briefly
      element.classList.add("ring-2", "ring-blue-500", "ring-offset-4")
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-blue-500", "ring-offset-4")
      }, 2000)
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="fixed right-8 top-24 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className={cn(
            "rounded-full shadow-lg transition-all duration-300",
            "hover:scale-110 hover:shadow-xl",
            "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white",
            "px-4 py-4"
          )}
        >
          <div className="flex items-center gap-2">
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <>
                <List className="h-5 w-5" />
                <span className="font-medium">Edit Sections</span>
              </>
            )}
          </div>
        </Button>
      </motion.div>

      {/* Sections panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-8 top-40 z-50 w-80"
          >
            <div className="bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Jump to Section
                </h3>
                <p className="text-sm opacity-90 mt-1">Click any section to edit</p>
              </div>

              {/* Sections list */}
              <div className="max-h-96 overflow-y-auto">
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSectionClick(section.id)}
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-accent/10 transition-colors",
                      "border-b border-border/50 last:border-0",
                      "group flex items-center justify-between"
                    )}
                  >
                    <div>
                      <p className="font-medium text-foreground group-hover:text-blue-500 transition-colors">
                        {section.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Click to navigate and edit
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  </motion.button>
                ))}
              </div>

              {/* Footer tip */}
              <div className="p-3 bg-muted/30 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  💡 Tip: Click any text in sections to edit directly
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}