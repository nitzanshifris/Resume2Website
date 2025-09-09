"use client"

import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeSelector } from "@/components/ui/theme-selector"
import { FontSizeSelector } from "@/components/ui/font-size-selector"
import { useState } from "react"
import { Palette, X } from "lucide-react"

interface SectionControlsProps {
  isEditMode: boolean
}

export function SectionControls({ isEditMode }: SectionControlsProps) {
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Toggle Button - Only visible in edit mode */}
      <AnimatePresence>
        {isEditMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "fixed top-24 right-4 z-40",
              "p-3 rounded-lg",
              "bg-white dark:bg-background/90 backdrop-blur-md",
              "border border-neutral-300 dark:border-neutral-700",
              "hover:bg-neutral-50 dark:hover:bg-background/50 transition-all duration-200",
              "shadow-md dark:shadow-none"
            )}
            aria-label="Toggle settings panel"
          >
            <Palette className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence mode="wait">
        {isEditMode && isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed top-24 right-20 z-40",
              "w-80",
              "bg-white dark:bg-background/90 backdrop-blur-md",
              "border border-neutral-300 dark:border-neutral-700 rounded-lg",
              "shadow-lg",
              "p-4"
            )}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 p-1 rounded hover:bg-neutral-100 dark:hover:bg-background/50 transition-colors"
              aria-label="Close settings panel"
            >
              <X className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
            </button>

            <div className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">Theme</h4>
                  <button
                    onClick={() => setShowThemeSelector(!showThemeSelector)}
                    className={cn(
                      "p-2 rounded-lg transition-all duration-200",
                      "hover:bg-neutral-100 dark:hover:bg-background/50",
                      showThemeSelector && "bg-neutral-100 dark:bg-background/50"
                    )}
                    aria-label="Toggle theme selector"
                  >
                    <Palette className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
                  </button>
                </div>
                <AnimatePresence>
                  {showThemeSelector && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ThemeSelector />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Font Size</h4>
                <FontSizeSelector />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}