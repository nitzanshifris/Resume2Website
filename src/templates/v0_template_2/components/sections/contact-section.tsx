"use client"
import { motion } from "framer-motion"
import { AnimatedSection, itemVariants } from "@/components/ui/animated-section"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import type React from "react"

interface ContactInfo {
  label: string
  value: string
  icon: React.ElementType
  href?: string
  className?: string
}

interface ContactSectionProps {
  title: string
  items: ContactInfo[]
}

export const ContactSection = ({ title, items }: ContactSectionProps) => {
  const { getSizeClasses } = useFontSize()

  return (
    <AnimatedSection id="contact">
      <h2
        className={cn(
          "bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent font-bold mb-12 text-center",
          getSizeClasses("sectionTitle"),
        )}
      >
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, i) => {
          const Icon = item.icon
          const content = item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("text-neutral-100 hover:text-white break-all", getSizeClasses("contactValue"))}
            >
              {item.value}
            </a>
          ) : (
            <p className={cn("text-neutral-100", getSizeClasses("contactValue"))}>{item.value}</p>
          )

          return (
            <motion.div
              variants={itemVariants}
              key={i}
              className={cn(
                "bg-neutral-900/50 border border-neutral-800 p-6 rounded-lg flex items-center gap-6 hover:border-accent/50 transition-colors shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)] relative group overflow-hidden",
                item.className,
              )}
            >
              <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-2xl"></div>
              <div className="relative">
                <Icon className="h-8 w-8 text-accent flex-shrink-0" />
                <div>
                  <h3
                    className={cn(
                      "text-neutral-400 font-semibold uppercase tracking-wider",
                      getSizeClasses("contactLabel"),
                    )}
                  >
                    {item.label}
                  </h3>
                  {content}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </AnimatedSection>
  )
}
