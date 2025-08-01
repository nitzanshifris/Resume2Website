"use client"

import { useTheme } from "@/components/theme/theme-provider"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme()

  return (
    <div className="space-y-3">
      <h4 className="font-medium leading-none font-serif text-sm">Color Themes</h4>
      <p className="text-xs text-muted-foreground">Choose your portfolio style</p>
      <TooltipProvider>
        <div className="flex flex-wrap gap-2">
          {themes.map((t) => (
            <Tooltip key={t.name}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setTheme(t.name)}
                  className={cn(
                    "h-10 w-10 rounded-full border-2 transition-all hover:scale-110",
                    theme.name === t.name
                      ? "border-ring ring-2 ring-ring ring-offset-2 ring-offset-background shadow-lg"
                      : "border-transparent hover:border-border",
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
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{t.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  )
}