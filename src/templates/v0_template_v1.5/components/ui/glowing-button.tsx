"use client"
import type React from "react"
import { cn } from "@/lib/utils"

interface GlowingButtonProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
}

export const GlowingButton: React.FC<GlowingButtonProps> = ({ children, className, containerClassName }) => {
  return (
    <div className={cn("p-[1px] rounded-full relative group", containerClassName)}>
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-accent/50 to-accent/30 rounded-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "blur-md",
        )}
      />
      <button
        className={cn(
          "relative z-10 w-full h-full bg-card text-card-foreground px-8 py-4 rounded-full",
          "transition-colors duration-200 group-hover:bg-card/90",
          className,
        )}
      >
        {children}
      </button>
    </div>
  )
}
