"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { JSX } from "react/jsx-runtime"

export const FloatingNav = ({
  navItems,
  className,
  activeSection,
}: {
  navItems: {
    name: string
    link: string
    icon?: JSX.Element
  }[]
  className?: string
  activeSection?: string
}) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show nav when user scrolls past the hero section (approx 600px)
    const handleScroll = () => {
      setVisible(window.scrollY > 600)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    e.preventDefault()
    const element = document.getElementById(link.substring(1))
    if (element) {
      // We calculate the position to scroll to, accounting for some top offset
      const topPos = element.getBoundingClientRect().top + window.scrollY - 80 // 80px offset from top
      window.scrollTo({
        top: topPos,
        behavior: "smooth",
      })
    }
  }

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{
            opacity: 0,
            y: -100,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: -100,
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className={cn(
            "flex max-w-fit fixed top-6 inset-x-0 mx-auto border border-white/[0.2] rounded-full bg-black/80 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-50 px-6 py-3 items-center justify-center space-x-6 backdrop-blur-sm",
            className,
          )}
        >
          {navItems.map((navItem: any, idx: number) => (
            <a
              key={`link=${idx}`}
              href={navItem.link}
              onClick={(e) => handleNavClick(e, navItem.link)}
              className={cn(
                "relative text-neutral-50 items-center flex space-x-1 hover:text-accent transition-colors",
                activeSection === navItem.link.substring(1) ? "text-accent" : "text-neutral-50",
              )}
            >
              <span className="text-sm !cursor-pointer">{navItem.name}</span>
            </a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
