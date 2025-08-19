"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Palette } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"
import { motion, AnimatePresence } from "framer-motion"
import { useEditMode } from "@/contexts/edit-mode-context"

export function ThemeToggle() {
  const { isEditMode } = useEditMode()

  return (
    <AnimatePresence>
      {isEditMode && (
        <motion.div
          className="fixed top-8 left-60 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="lg"
                className="rounded-full shadow-lg h-14 w-14 p-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 border-0 transition-all duration-300 hover:scale-110 hover:shadow-xl"
                aria-label="Open theme selector"
              >
                <Palette className="h-6 w-6 text-white" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 ml-2 mt-2">
              <ThemeSwitcher />
            </PopoverContent>
          </Popover>
        </motion.div>
      )}
    </AnimatePresence>
  )
}