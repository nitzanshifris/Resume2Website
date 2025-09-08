"use client"

import type { ReactNode } from "react"
import { useEffect, useRef } from "react"
import { motion, useMotionValue, animate } from "framer-motion"
import { cn } from "@/lib/utils"

export function MovingBorder({
  children,
  duration = 2000,
  rx = "28",
  ry = "28",
  ...props
}: {
  children: ReactNode
  duration?: number
  rx?: string
  ry?: string
  className?: string
}) {
  const progress = useMotionValue(0)
  const rectRef = useRef<SVGRectElement | null>(null)

  // Start infinite animation of the dash offset
  useEffect(() => {
    const length = rectRef.current?.getTotalLength() || 0
    const controls = animate(progress, [0, length], {
      duration,
      ease: "linear",
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
    })

    return () => controls.stop()
  }, [duration, progress])

  return (
    <div {...props} className={cn("relative inline-block", props.className)}>
      {/* Animated dashed border */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* המלבן היחיד שמשמש גם למדידה וגם לאנימציה */}
        <motion.rect
          ref={rectRef}
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx={rx}
          ry={ry}
          fill="none"
          stroke="hsl(var(--accent-hsl))"
          strokeWidth="2"
          strokeDasharray="10 5"
          strokeDashoffset={progress}
        />
      </svg>

      {/* תוכן הכפתור / אלמנט עטוף */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
