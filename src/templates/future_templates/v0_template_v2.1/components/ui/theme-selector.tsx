"use client"

import { useTheme, themeOptions } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-2">
      {themeOptions.map((option) => (
        <button
          key={option.name}
          onClick={() => setTheme(option.name)}
          className={cn(
            "w-6 h-6 rounded-full border-2 transition-transform duration-200",
            theme === option.name ? "border-neutral-700 dark:border-white scale-110" : "border-transparent hover:scale-110",
          )}
          style={{ backgroundColor: `hsl(${option.hsl})` }}
          aria-label={`Set theme to ${option.name}`}
        />
      ))}
    </div>
  )
}
