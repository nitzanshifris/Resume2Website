"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface DesktopEffectsProps {
  children: ReactNode
  stage: string
}

export function DesktopEffects({ children, stage }: DesktopEffectsProps) {
  const getStageEffects = () => {
    switch (stage) {
      case "morphing":
        return {
          filter: "blur(2px) brightness(1.2) contrast(1.1)",
          transform: "perspective(1000px) rotateX(5deg) rotateY(2deg)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }
      case "dissolving":
        return {
          filter: "blur(1px) brightness(0.8) saturate(1.5)",
          transform: "perspective(1000px) rotateX(-2deg)",
          boxShadow: "0 35px 60px -12px rgba(59, 130, 246, 0.3)",
        }
      case "materializing":
        return {
          filter: "blur(0px) brightness(1) contrast(1)",
          transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
          boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.3)",
        }
      default:
        return {
          filter: "none",
          transform: "none",
          boxShadow: "0 10px 30px -12px rgba(0, 0, 0, 0.2)",
        }
    }
  }

  return (
    <motion.div
      animate={getStageEffects()}
      transition={{
        duration: 1.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  )
}
