"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEditMode } from '@/contexts/edit-mode-context'
import { useTheme } from '@/components/theme/theme-provider'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function ThemeToggleButton() {
  const { isEditMode } = useEditMode()
  const { theme, setTheme, themes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  if (!isEditMode) return null

  return (
    <>
      {/* Floating Theme Button - Positioned higher to avoid watermark */}
      <motion.div
        className="fixed bottom-32 left-8 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className={cn(
            "group rounded-full shadow-2xl transition-all duration-300",
            "hover:scale-110 hover:shadow-xl",
            "px-6 py-6",
            "bg-gradient-to-r from-violet-600 to-indigo-600",
            "hover:from-violet-700 hover:to-indigo-700",
            "text-white border-0",
            "ring-4 ring-white/20"
          )}
        >
          <Palette className="h-6 w-6 transition-transform group-hover:rotate-12" />
          <span className="ml-2 font-semibold">Themes</span>
        </Button>
      </motion.div>

      {/* Theme Selection Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <Palette className="h-6 w-6 text-primary" />
              Choose Your Theme
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            <p className="text-muted-foreground">
              Select a theme to instantly transform your portfolio's appearance
            </p>
            
            {/* Theme Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {themes.map((t) => {
                const isActive = theme.name === t.name
                return (
                  <button
                    key={t.name}
                    onClick={() => {
                      setTheme(t.name)
                      setIsOpen(false)
                    }}
                    className={cn(
                      "relative group rounded-lg overflow-hidden transition-all duration-200",
                      "hover:scale-105 hover:shadow-lg",
                      "ring-2 ring-transparent",
                      isActive && "ring-primary shadow-lg scale-105"
                    )}
                  >
                    {/* Theme Preview */}
                    <div 
                      className="h-32 w-full relative"
                      style={{
                        background: `linear-gradient(135deg, ${t.colors["gradient-1"]} 0%, ${t.colors["gradient-2"]} 50%, ${t.colors["gradient-3"]} 100%)`
                      }}
                    >
                      {/* Color Palette Preview */}
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white/50"
                          style={{ backgroundColor: `hsl(${t.colors.background})` }}
                        />
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white/50"
                          style={{ backgroundColor: `hsl(${t.colors.accent})` }}
                        />
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white/50"
                          style={{ backgroundColor: `hsl(${t.colors.primary})` }}
                        />
                      </div>
                      
                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded text-xs font-semibold">
                          Active
                        </div>
                      )}
                    </div>
                    
                    {/* Theme Name */}
                    <div className="p-3 bg-background border-t">
                      <h3 className={cn(
                        "font-semibold text-sm",
                        isActive ? "text-primary" : "text-foreground"
                      )}>
                        {t.name}
                      </h3>
                    </div>
                  </button>
                )
              })}
            </div>
            
            {/* Current Theme Info */}
            <div className="mt-4 p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Current theme:</span> {theme.name}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}