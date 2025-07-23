"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { createContext, useContext, useRef } from "react"
import { motion, useMotionValue, useTransform, useSpring, type MotionValue } from "framer-motion"

interface CardContextProps {
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
}

const CardContext = createContext<CardContextProps | null>(null)

export const useCard = () => {
  const context = useContext(CardContext)
  if (context === null) {
    throw new Error("useCard must be used within a CardContainer")
  }
  return context
}

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
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), {
    stiffness: 300,
    damping: 30,
    mass: 0.5,
  })
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), {
    stiffness: 300,
    damping: 30,
    mass: 0.5,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    x.set(e.clientX - left - width / 2)
    y.set(e.clientY - top - height / 2)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <CardContext.Provider value={{ rotateX, rotateY }}>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn("p-4 [perspective:1000px]", containerClassName)}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
          }}
          className={cn("relative transition-transform duration-200 ease-linear", className)}
        >
          {children}
        </motion.div>
      </div>
    </CardContext.Provider>
  )
}

export const CardBody = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("h-96 w-96 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]", className)}>
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
  translateX?: number | MotionValue<number>
  translateY?: number | MotionValue<number>
  translateZ?: number | MotionValue<number>
  rotateX?: number | MotionValue<number>
  rotateY?: number | MotionValue<number>
  rotateZ?: number | MotionValue<number>
  [key: string]: any
}) => {
  const { rotateX: cardRotateX, rotateY: cardRotateY } = useCard()
  const itemRotateX = useTransform(cardRotateX, [-20, 20], [rotateX, -rotateX])
  const itemRotateY = useTransform(cardRotateY, [-20, 20], [rotateY, -rotateY])
  const itemTranslateX = useTransform(cardRotateX, [-20, 20], [translateX, -translateX])
  const itemTranslateY = useTransform(cardRotateY, [-20, 20], [translateY, -translateY])

  return (
    <motion.div
      style={{
        transformStyle: "preserve-3d",
        transform: `
          translateX(${itemTranslateX}px) 
          translateY(${itemTranslateY}px) 
          translateZ(${translateZ}px) 
          rotateX(${itemRotateX}deg) 
          rotateY(${itemRotateY}deg)
          rotateZ(${rotateZ}deg)
        `,
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
