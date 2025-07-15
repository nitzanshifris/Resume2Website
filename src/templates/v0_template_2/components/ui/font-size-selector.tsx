"use client"

import { useFontSize } from "@/contexts/font-size-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Type } from "lucide-react"

export const FontSizeSelector = () => {
  const { fontSize, setFontSize } = useFontSize()

  return (
    <div>
      <Select value={fontSize} onValueChange={(value) => setFontSize(value as any)}>
        <SelectTrigger className="w-[180px] bg-black/50 border-neutral-700 text-white backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <SelectValue placeholder="Select font size" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-black border-neutral-700 text-white">
          <SelectItem value="sm">Small</SelectItem>
          <SelectItem value="md">Medium (Default)</SelectItem>
          <SelectItem value="lg">Large</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
