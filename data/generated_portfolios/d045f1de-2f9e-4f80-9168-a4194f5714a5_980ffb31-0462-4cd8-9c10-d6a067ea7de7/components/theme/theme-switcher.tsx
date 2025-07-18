"use client"

import { useTheme } from "@/components/theme/theme-provider"
import { cn } from "@/lib/utils"

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme()

  return (
    <div className="space-y-2 pt-4 border-t border-border">
      <h4 className="font-medium leading-none font-serif">Color Palette</h4>
      <div className="flex flex-wrap gap-2">
        {themes.map((t) => (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={cn(
              "h-8 w-8 rounded-full border-2 transition-all",
              theme.name === t.name
                ? "border-ring ring-2 ring-ring ring-offset-2 ring-offset-background"
                : "border-transparent",
            )}
            style={{ backgroundColor: `hsl(${t.colors.primary})` }}
            aria-label={`Select ${t.name} theme`}
          >
            <span
              className="h-full w-full block rounded-full"
              style={{
                background: `linear-gradient(135deg, hsl(${t.colors.accent}) 0%, hsl(${t.colors.background}) 100%)`,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
