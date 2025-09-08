"use client"

import { useWatermark } from '@/contexts/watermark-context'
import { cn } from '@/lib/utils'

export function Watermark() {
  const { isWatermarkVisible } = useWatermark()

  if (!isWatermarkVisible) return null

  return (
    <div className={cn(
      "fixed bottom-4 left-4 z-40",
      "text-xs text-neutral-500",
      "pointer-events-none select-none"
    )}>
      <div className="flex items-center gap-1">
        <span>Powered by</span>
        <span className="font-semibold">RESUME2WEBSITE</span>
      </div>
    </div>
  )
}