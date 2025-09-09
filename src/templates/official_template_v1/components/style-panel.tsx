"use client"

import React, { useState } from "react"
import { Palette, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTheme } from "@/components/theme/theme-provider"
import { useFont, type FontCategory } from "@/contexts/font-context"
import { useEditMode } from "@/contexts/edit-mode-context"
import { cn } from "@/lib/utils"

export function StylePanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"colors" | "typography">("colors")
  const [fontCategory, setFontCategory] = useState<FontCategory>("professional")
  const { theme, setTheme, themes } = useTheme()
  const { currentFont, setFont, fontsByCategory } = useFont()
  const { isEditMode } = useEditMode()

  // Only show in edit mode
  if (!isEditMode) {
    return null
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed top-8 left-72 z-50 h-12 w-12 rounded-full shadow-lg border-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-purple-400/50 backdrop-blur-sm transition-all duration-200 hover:scale-105"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Style</h3>
          </div>

          {/* Tabs */}
          <div className="flex bg-muted rounded-lg p-1">
            <button
              className={cn(
                "flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                activeTab === "colors"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab("colors")}
            >
              <Palette className="h-3 w-3 inline mr-1.5" />
              Colors
            </button>
            <button
              className={cn(
                "flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                activeTab === "typography"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab("typography")}
            >
              <Type className="h-3 w-3 inline mr-1.5" />
              Typography
            </button>
          </div>

          {/* Content */}
          {activeTab === "colors" && (
            <div>
              <h4 className="text-sm font-medium mb-3">Themes</h4>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((themeOption, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-2 rounded-lg border cursor-pointer transition-all duration-200 hover:border-primary/50",
                      theme.name === themeOption.name
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent/50"
                    )}
                    onClick={() => setTheme(themeOption.name)}
                  >
                    <div className="flex gap-1 justify-center">
                      {Object.entries(themeOption.colors)
                        .filter(([key]) => key.startsWith('gradient-'))
                        .slice(0, 3)
                        .map(([key, color]) => (
                          <div
                            key={key}
                            className="w-5 h-5 rounded-full border border-white/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "typography" && (
            <div className="space-y-4">
              {/* Font Categories */}
              <div>
                <h4 className="text-sm font-medium mb-3">Categories</h4>
                <div className="flex bg-muted rounded-lg p-1">
                  <button
                    className={cn(
                      "flex-1 px-2 py-1 text-xs font-medium rounded-md transition-all duration-200",
                      fontCategory === "professional"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setFontCategory("professional")}
                  >
                    Professional
                  </button>
                  <button
                    className={cn(
                      "flex-1 px-2 py-1 text-xs font-medium rounded-md transition-all duration-200",
                      fontCategory === "premium"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setFontCategory("premium")}
                  >
                    Premium
                  </button>
                  <button
                    className={cn(
                      "flex-1 px-2 py-1 text-xs font-medium rounded-md transition-all duration-200",
                      fontCategory === "unique"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setFontCategory("unique")}
                  >
                    Unique
                  </button>
                </div>
              </div>

              {/* Font List */}
              <div>
                <h4 className="text-sm font-medium mb-3">Fonts</h4>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {fontsByCategory[fontCategory].map((font) => (
                    <div
                      key={font.name}
                      className={cn(
                        "px-3 py-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-accent/50 text-center",
                        currentFont.name === font.name
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-accent/50"
                      )}
                      onClick={() => setFont(font)}
                    >
                      <span className="text-sm" style={{ fontFamily: font.cssName }}>
                        {font.displayName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}