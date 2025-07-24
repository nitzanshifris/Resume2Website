"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { useMotionValue, useMotionTemplate } from "framer-motion"

export interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  showRadialGradient?: boolean
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return
    const { left, top } = currentTarget.getBoundingClientRect()

    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      className={cn(
        "relative flex flex-col h-full items-center justify-center bg-background text-foreground transition-bg",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--accent-glow)_0%,var(--accent-glow)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--accent-glow)_16%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter_saturate-200_contrast-150
            after:content-[""] after:absolute after:inset-0 after:bg-background after:[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,
          )}
          style={{
            transform: "translate(-50%,-50%)",
            top: "50%",
            left: "50%",
          }}
        />
      </div>
      {showRadialGradient && (
        <div
          className="pointer-events-none absolute inset-0 z-10"
          onMouseMove={handleMouseMove}
          style={{
            background: useMotionTemplate`
              radial-gradient(
                200px circle at ${mouseX}px ${mouseY}px,
                var(--accent-glow),
                transparent 80%
              )
            `,
          }}
        />
      )}
      <div className="relative z-20">{children}</div>
    </div>
  )
}
