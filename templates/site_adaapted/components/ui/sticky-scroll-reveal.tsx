"use client"

import React, { useRef } from "react"
import { useMotionValueEvent, useScroll, motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string
    description: string
    content?: React.ReactNode | any
  }[]
  contentClassName?: string
}) => {
  const [activeCard, setActiveCard] = React.useState(0)
  const ref = useRef<any>(null)
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  })
  const cardLength = content.length

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength)
    const closestBreakpointIndex = cardsBreakpoints.reduce((acc, breakpoint, index) => {
      const distance = Math.abs(latest - breakpoint)
      if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
        return index
      }
      return acc
    }, 0)
    setActiveCard(closestBreakpointIndex)
  })

  return (
    <motion.div
      className="relative flex h-[30rem] justify-center space-x-10 overflow-y-auto rounded-md p-10 bg-[#0B0B0F]"
      ref={ref}
    >
      <div className="div relative flex items-start px-4">
        <div className="max-w-2xl bg-sky-700 opacity-95">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20 mx-0 px-10">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-white font-bold font-sans text-2xl"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-kg max-w-sm text-slate-300 mt-10 ml-20 text-lg"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div
        className={cn(
          "sticky top-10 hidden h-60 w-80 overflow-hidden rounded-md bg-[#0B0B0F] shadow-md lg:block",
          contentClassName,
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  )
}
