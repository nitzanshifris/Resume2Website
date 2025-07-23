"use client"
import type React from "react"
import { cn } from "@/lib/utils"
import { GraduationCap } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface TimelineItemData {
  title: React.ReactNode
  degree: React.ReactNode
  years: React.ReactNode
  description: React.ReactNode
  imageUrl?: string
}

interface VerticalTimelineProps {
  items: TimelineItemData[]
}

export const VerticalTimeline: React.FC<VerticalTimelineProps> = ({ items }) => {
  return (
    <div className="relative max-w-5xl mx-auto px-4">
      {/* Central vertical line - ALWAYS centered */}
      <div
        className="absolute left-1/2 top-0 h-full w-0.5 bg-accent -translate-x-1/2 shadow-[0_0_15px_hsl(var(--accent))]"
        aria-hidden="true"
      />

      <ul className="space-y-16">
        {items.map((item, i) => {
          const alignLeft = i % 2 === 0

          return (
            <motion.li
              key={i}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Dot on the timeline - ALWAYS centered */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-accent rounded-full p-2 ring-8 ring-background flex items-center justify-center z-10 shadow-lg shadow-accent/50">
                <GraduationCap className="h-5 w-5 text-accent-foreground" />
              </div>

              {/* Card and Connector Container - now responsive */}
              <div className={cn("w-1/2 relative", alignLeft ? "mr-auto pr-8" : "ml-auto pl-8")}>
                {/* Connector Line from dot to card - ALWAYS visible */}
                <div
                  className={cn("absolute top-10 h-0.5 bg-border w-12", alignLeft ? "right-0" : "left-0")}
                  aria-hidden="true"
                />

                {/* Card Content with static border */}
                <div className={cn("bg-card p-6 rounded-xl border-2 border-accent shadow-lg")}>
                  <div className={cn(alignLeft ? "text-right" : "text-left")}>
                    <div className="space-y-1">
                      {item.title}
                      {item.degree}
                      {item.years}
                      {item.description}
                    </div>
                  </div>
                  {item.imageUrl && (
                    <div className="relative w-full h-48 mt-4 rounded-lg overflow-hidden border border-border/50">
                      <Image src={item.imageUrl || "/placeholder.svg"} alt="" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
