"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useColorMode } from "@/contexts/color-mode-context"

export function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleColorMode}
      className="fixed top-4 right-20 z-50 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-border/40 hover:bg-background/90"
      aria-label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
    >
      {colorMode === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}