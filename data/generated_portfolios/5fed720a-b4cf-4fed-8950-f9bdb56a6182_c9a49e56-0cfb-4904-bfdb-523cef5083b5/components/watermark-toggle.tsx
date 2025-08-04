"use client"

import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WatermarkToggleProps {
  isVisible: boolean
  onToggle: () => void
}

export function WatermarkToggle({ isVisible, onToggle }: WatermarkToggleProps) {
  return (
    <Button
      onClick={onToggle}
      size="icon"
      variant="outline"
      className={cn(
        "fixed bottom-8 left-8 z-50",
        "h-14 w-14 rounded-full",
        "bg-background dark:bg-background light:bg-white",
        "border-2 border-neutral-800 dark:border-neutral-800 light:border-gray-200",
        "text-foreground",
        "shadow-lg dark:shadow-lg light:shadow-xl",
        "hover:bg-background/80 dark:hover:bg-background/80 light:hover:bg-gray-100",
        "hover:scale-110 hover:shadow-2xl",
        "transition-all duration-200"
      )}
      title={isVisible ? "Hide watermark" : "Show watermark"}
    >
      {isVisible ? (
        <Eye className="h-5 w-5" />
      ) : (
        <EyeOff className="h-5 w-5" />
      )}
    </Button>
  )
}