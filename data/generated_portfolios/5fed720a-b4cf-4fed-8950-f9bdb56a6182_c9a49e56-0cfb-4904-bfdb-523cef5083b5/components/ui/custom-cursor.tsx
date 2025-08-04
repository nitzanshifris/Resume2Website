"use client"

import { useState, useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export const CustomCursor = () => {
  const [isHoveringLink, setIsHoveringLink] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 500, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("a, button, [role='button'], input, select, textarea")) {
        setIsHoveringLink(true)
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("a, button, [role='button'], input, select, textarea")) {
        setIsHoveringLink(false)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mouseout", handleMouseOut)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseout", handleMouseOut)
    }
  }, [cursorX, cursorY])

  const glowVariants = {
    default: {
      width: 32,
      height: 32,
      opacity: 0.3,
    },
    hover: {
      width: 64,
      height: 64,
      opacity: 0.5,
    },
  }

  const dotVariants = {
    default: {
      opacity: 1,
      scale: 1,
    },
    hover: {
      opacity: 0,
      scale: 0,
    },
  }

  return (
    <>
      {/* Outer glowing orb */}
      <motion.div
        variants={glowVariants}
        animate={isHoveringLink ? "hover" : "default"}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          x: "-50%",
          y: "-50%",
          background: `radial-gradient(circle, hsla(var(--accent-hsl), 0.4) 0%, hsla(var(--accent-hsl), 0) 70%)`,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      {/* Inner dot */}
      <motion.div
        variants={dotVariants}
        animate={isHoveringLink ? "hover" : "default"}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-accent pointer-events-none z-[9999]"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          x: "-50%",
          y: "-50%",
        }}
        transition={{ type: "spring", stiffness: 800, damping: 40 }}
      />
    </>
  )
}
