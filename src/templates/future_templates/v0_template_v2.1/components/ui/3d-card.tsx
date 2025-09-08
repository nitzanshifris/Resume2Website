"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { createContext, useState, useContext, useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

const MouseEnterContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined)

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMouseEntered, setIsMouseEntered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) / 25
    const y = (e.clientY - top - height / 2) / 25
    rotateX.set(y)
    rotateY.set(x)
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseEntered(true)
    if (!containerRef.current) return
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    setIsMouseEntered(false)
    rotateX.set(0)
    rotateY.set(0)
  }

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 20 }
  const rotateXSpring = useSpring(rotateX, springConfig)
  const rotateYSpring = useSpring(rotateY, springConfig)

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <motion.div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className={cn("flex items-center justify-center", containerClassName)}
        style={{
          perspective: "1000px",
        }}
      >
        <motion.div
          style={{
            rotateX: rotateXSpring,
            rotateY: rotateYSpring,
            transformStyle: "preserve-3d",
          }}
          className={cn(className)}
        >
          {children}
        </motion.div>
      </motion.div>
    </MouseEnterContext.Provider>
  )
}

export const CardBody = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("h-96 w-full [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]", className)}>
      {children}
    </div>
  )
}

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType
  children: React.ReactNode
  className?: string
  translateX?: number | string
  translateY?: number | string
  translateZ?: number | string
  rotateX?: number | string
  rotateY?: number | string
  rotateZ?: number | string
  [key: string]: any
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isMouseEntered] = useMouseEnter()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    if (isMouseEntered) {
      x.set(typeof translateX === "number" ? translateX : Number.parseFloat(translateX))
      y.set(typeof translateY === "number" ? translateY : Number.parseFloat(translateY))
    } else {
      x.set(0)
      y.set(0)
    }
  }, [isMouseEntered, translateX, translateY, x, y])

  const springConfig = { stiffness: 100, damping: 15, mass: 0.1 }
  const dx = useSpring(x, springConfig)
  const dy = useSpring(y, springConfig)

  return (
    <motion.div
      ref={ref}
      style={{
        transform: useTransform([dx, dy], ([newX, newY]) => `translateX(${newX}px) translateY(${newY}px)`),
        transformStyle: "preserve-3d",
        translateZ,
        rotateX,
        rotateY,
        rotateZ,
      }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

// Hook to use the context
export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext)
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider")
  }
  return context
}
