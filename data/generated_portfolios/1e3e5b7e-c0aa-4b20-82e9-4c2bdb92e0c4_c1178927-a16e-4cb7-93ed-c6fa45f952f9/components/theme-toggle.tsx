"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Palette } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"
import { motion } from "framer-motion"

export function ThemeToggle() {
  return (
    <motion.div
      className="fixed bottom-8 left-8 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="lg"
            className="rounded-full shadow-lg h-14 w-14 p-0 bg-background border-2 border-border hover:border-accent transition-all duration-300 hover:scale-110"
            aria-label="Open theme selector"
          >
            <Palette className="h-6 w-6 text-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 ml-2 mb-2">
          <ThemeSwitcher />
        </PopoverContent>
      </Popover>
    </motion.div>
  )
}