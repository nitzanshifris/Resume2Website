"use client"
import { useState } from "react"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { JSX } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export const FloatingNav = ({
  navItems,
  className,
  maxVisibleItems = 6,
}: {
  navItems: {
    name: string
    link: string
    icon?: JSX.Element
  }[]
  className?: string
  maxVisibleItems?: number
}) => {
  const { scrollYProgress } = useScroll()
  const [visible, setVisible] = useState(true)

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious()
      if (scrollYProgress.get() < 0.05) {
        setVisible(true)
      } else {
        if (direction < 0) {
          setVisible(true)
        } else {
          setVisible(false)
        }
      }
    }
  })

  const visibleItems = navItems.slice(0, maxVisibleItems)
  const hiddenItems = navItems.slice(maxVisibleItems)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-black/[0.2] rounded-full bg-background/80 shadow-lg z-[5000] pl-4 pr-2 py-2 items-center justify-center space-x-4 backdrop-blur-sm",
          className,
        )}
      >
        {visibleItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative text-neutral-700 items-center flex space-x-1 hover:text-gold transition-colors font-serif",
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-xl md:text-2xl">{navItem.name}</span>
          </Link>
        ))}

        {hiddenItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 text-xl md:text-2xl font-serif rounded-full">
                More
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-popover border-border">
              {hiddenItems.map((navItem, idx) => (
                <DropdownMenuItem key={`hidden-link-${idx}`} asChild>
                  <Link href={navItem.link} className="text-xl md:text-2xl font-serif">
                    {navItem.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
