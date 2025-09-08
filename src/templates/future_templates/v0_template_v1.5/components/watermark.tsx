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
      {/* Diagonal repeating pattern background */}
      <div className="fixed inset-0 z-40 pointer-events-none select-none overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 200px,
              rgba(0, 0, 0, 0.03) 200px,
              rgba(0, 0, 0, 0.03) 400px
            )`
          }}
        />
      </div>

      {/* Large central watermark with gradient */}
      <div 
        className="fixed top-1/2 left-1/2 z-50 pointer-events-none select-none transform -translate-x-1/2 -translate-y-1/2 -rotate-12"
        style={{ 
          filter: "drop-shadow(0 0 40px rgba(0,0,0,0.1))",
          width: "120%",
          textAlign: "center"
        }}
      >
        <div 
          className="font-black tracking-wider"
          style={{ 
            fontSize: "clamp(80px, 15vw, 200px)",
            background: "linear-gradient(135deg, rgba(100,100,100,0.15) 0%, rgba(150,150,150,0.25) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 80px rgba(0,0,0,0.05)"
          }}
        >
          RESUME2WEB
        </div>
        <div 
          className="font-medium tracking-widest mt-2"
          style={{ 
            fontSize: "clamp(16px, 3vw, 32px)",
            color: "rgba(100,100,100,0.2)"
          }}
        >
          PREVIEW MODE
        </div>
      </div>

      {/* Corner badges */}
      <div className="fixed top-8 right-8 z-50 pointer-events-none select-none">
        <div 
          className="bg-black/10 dark:bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-black/10 dark:border-white/10"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">DEMO VERSION</span>
          </div>
        </div>
      </div>

      {/* Floating watermark elements */}
      <div className="fixed top-1/4 left-10 z-50 pointer-events-none select-none opacity-10 transform rotate-[-25deg]">
        <div className="text-7xl font-black text-gray-800 dark:text-gray-200">
          R2W
        </div>
      </div>

      <div className="fixed bottom-1/4 right-10 z-50 pointer-events-none select-none opacity-10 transform rotate-[25deg]">
        <div className="text-7xl font-black text-gray-800 dark:text-gray-200">
          R2W
        </div>
      </div>

      {/* Bottom banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none select-none">
        <div 
          className="bg-gradient-to-t from-black/5 to-transparent dark:from-white/5 py-8"
          style={{ backdropFilter: "blur(2px)" }}
        >
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 opacity-60">
              This is a preview of your Resume2Web portfolio
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 opacity-50 mt-1">
              Upgrade to remove watermarks and unlock all features
            </p>
          </div>
        </div>
      </div>

      {/* Mobile optimized version */}
      <div className="md:hidden">
        <div 
          className="fixed top-1/2 left-1/2 z-50 pointer-events-none select-none transform -translate-x-1/2 -translate-y-1/2 -rotate-12"
          style={{ width: "100%", textAlign: "center" }}
        >
          <div 
            className="font-black"
            style={{ 
              fontSize: "60px",
              opacity: "0.15",
              color: "currentColor"
            }}
          >
            RESUME2WEB
          </div>
          <div className="text-sm font-medium opacity-20 mt-1">
            PREVIEW
          </div>
        </div>
      </div>
    </>
  )
}