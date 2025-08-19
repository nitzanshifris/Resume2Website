"use client"

import { useEffect, useState } from "react"
import { useWatermark } from "@/contexts/watermark-context"

export function Watermark() {
  const [mounted, setMounted] = useState(false)
  const { isWatermarkVisible } = useWatermark()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isWatermarkVisible) return null

  return (
    <>
      {/* Desktop - Small R2W watermark (keep existing) */}
      <div className="hidden md:block fixed top-1/4 left-10 z-50 pointer-events-none select-none opacity-10 transform rotate-[-25deg]">
        <div className="text-7xl font-black text-gray-800 dark:text-gray-200">
          R2W
        </div>
      </div>

      {/* Desktop - Small Resume2Website.com text on left side */}
      <div className="hidden md:block fixed bottom-10 left-6 z-50 pointer-events-none select-none opacity-15 transform rotate-[-90deg] origin-left">
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
          Resume2Website.com
        </div>
      </div>

      {/* Mobile optimized version - Single R2W */}
      <div className="md:hidden">
        {/* Single R2W logo - top right */}
        <div className="fixed top-20 right-4 z-50 pointer-events-none select-none opacity-15 transform rotate-[-15deg]">
          <div className="text-4xl font-black text-gray-800 dark:text-gray-200">
            R2W
          </div>
        </div>
        
        {/* Resume2Website.com text - bottom center */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none select-none">
          <div className="text-xs font-medium opacity-20 text-gray-800 dark:text-gray-200">
            Resume2Website.com
          </div>
        </div>
      </div>
    </>
  )
}