"use client"

import { motion } from "framer-motion"
import { Globe } from "lucide-react"
import type { ReactNode } from "react"

interface MacBookFrameProps {
  children: ReactNode
  isComplete: boolean
}

export function MacBookFrame({ children, isComplete }: MacBookFrameProps) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
    >
      {/* MacBook Frame */}
      <div className="relative">
        {/* Screen Bezel */}
        <div className="bg-gray-600 rounded-t-2xl p-3 shadow-xl">
          {/* Screen */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            {/* Browser Bar */}
            <div className="h-9 bg-secondary flex items-center px-3 border-b border-border">
              {/* Traffic Light Buttons */}
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>

              {/* URL Bar */}
              <div className="flex-1 mx-4">
                <div className="bg-secondary rounded-md px-3 py-1 flex items-center justify-center max-w-md mx-auto">
                  <Globe className="w-3 h-3 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground text-xs">nitzanshifris.com</span>
                </div>
              </div>

              {/* Right side placeholder */}
              <div className="w-16"></div>
            </div>

            {/* Content */}
            <div className="bg-white w-full relative" style={{ aspectRatio: "20/12" }}>
              {children}
            </div>
          </div>
        </div>

        {/* Base */}
        <div className="bg-gray-600 h-3 rounded-b-lg"></div>

        {/* Bottom part */}
        <div className="bg-gray-700 h-[18px] mx-auto rounded-b-3xl" style={{ width: "70%" }}></div>
      </div>
    </motion.div>
  )
}
