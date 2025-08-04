"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedSubtitleProps {
  words: string
  className?: string
}

export const AnimatedSubtitle = ({ words, className }: AnimatedSubtitleProps) => {
  const letters = words.split("")

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: -20,
      y: 10,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", justifyContent: "center" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn("relative", className)}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-3xl"
        animate={{
          x: [0, 100, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      {letters.map((letter, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  )
}