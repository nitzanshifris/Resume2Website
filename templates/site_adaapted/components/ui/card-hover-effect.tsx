"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import type React from "react"

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string
    description: string
    link: string
  }[]
  className?: string
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn("grid grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item, idx) => (
        <a
          href={item?.link}
          key={item?.link}
          className="group relative block h-full w-full p-2"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 block h-full w-full rounded-3xl bg-sky-500/10"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </a>
      ))}
    </div>
  )
}

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "relative z-20 h-full w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#0B0B0F] p-4 group-hover:border-sky-500/50",
        className,
      )}
    >
      <div className="relative z-50">
        <div className="p-4 text-xl">{children}</div>
      </div>
    </div>
  )
}

export const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <h4 className={cn("mt-4 font-bold tracking-wide text-white", className)}>{children}</h4>
}

export const CardDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <p className={cn("mt-8 leading-relaxed tracking-wide text-slate-300 text-base", className)}>{children}</p>
}
