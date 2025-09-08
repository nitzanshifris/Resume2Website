"use client"

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/theme-context'
import { Palette, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface ColorPickerProps {
  value?: string
  onChange: (color: string) => void
  className?: string
}

// Extended color palette using theme colors plus common text colors
const getColorPalette = (themeColors: string[]) => [
  // Theme colors
  ...themeColors,
  // Light text colors (good on dark backgrounds)
  '#ffffff', // white
  '#f5f5f5', // gray-100
  '#e5e5e5', // gray-200
  '#d4d4d4', // gray-300
  '#a3a3a3', // gray-400
  '#737373', // gray-500
  '#525252', // gray-600
  // Bright accent colors
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#a855f7', // purple
  '#14b8a6', // teal
  '#f59e0b', // amber
  '#84cc16', // lime
]

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const { wavyColors } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  
  const colorPalette = getColorPalette(wavyColors)
  
  // Convert RGB to hex if needed
  const normalizeColor = (color: string) => {
    if (color.startsWith('rgb')) {
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
      if (match) {
        const [, r, g, b] = match
        return `#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`
      }
    }
    return color
  }

  const currentColor = normalizeColor(value || '#ffffff')

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 border-2 hover:scale-110 transition-transform",
            className
          )}
          style={{ backgroundColor: currentColor }}
        >
          <Palette className="h-3 w-3 text-foreground mix-blend-difference" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 bg-black border-neutral-700">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Choose Color</h4>
          <div className="grid grid-cols-8 gap-2">
            {colorPalette.map((color, index) => (
              <button
                key={index}
                className={cn(
                  "h-8 w-8 rounded-md border-2 border-neutral-600 hover:scale-110 transition-all duration-200 relative",
                  currentColor.toLowerCase() === color.toLowerCase() && "ring-2 ring-accent ring-offset-2 ring-offset-black"
                )}
                style={{ backgroundColor: color }}
                onClick={() => {
                  onChange(color)
                  setIsOpen(false)
                }}
              >
                {currentColor.toLowerCase() === color.toLowerCase() && (
                  <Check className="h-4 w-4 text-foreground mix-blend-difference absolute inset-0 m-auto" />
                )}
              </button>
            ))}
          </div>
          
          {/* Custom color input */}
          <div className="pt-2 border-t border-neutral-700">
            <label className="text-xs text-neutral-400 mb-1 block">Custom Color</label>
            <input
              type="color"
              value={currentColor}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-8 rounded border border-neutral-600 bg-transparent cursor-pointer"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}