"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

interface MagicalTextProps {
  text: string
  className?: string
}

export function MagicalText({ text, className = "" }: MagicalTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Split text into individual characters for animation
  const characters = text.split("")

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: index * 0.05,
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            },
          }}
          whileHover={{
            scale: 1.2,
            color: "#60a5fa",
            transition: { duration: 0.2 },
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}

      {/* Magical glow effect */}
      <motion.div
        className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [0.8, 1.1, 0.8],
          transition: {
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          },
        }}
      />
    </motion.div>
  )
}
