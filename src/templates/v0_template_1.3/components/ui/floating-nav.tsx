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
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null)

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious()
      
      // Set scrolling state
      setIsScrolling(true)
      
      // Clear previous timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      
      // Set new timeout to reset scrolling state
      const timeout = setTimeout(() => {
        setIsScrolling(false)
      }, 1000)
      setScrollTimeout(timeout)
      
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
          opacity: 0.8,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? (isScrolling ? 0.3 : 0.8) : 0,
        }}
        whileHover={{
          opacity: 1,
        }}
        transition={{
          duration: 0.2,
          opacity: { duration: 0.3 }
        }}
        className={cn(
          "flex max-w-fit fixed top-4 inset-x-0 mx-auto border border-border/30 rounded-full bg-background/50 shadow-sm z-[5000] px-2 py-1 items-center justify-center gap-0.5 backdrop-blur-md",
          className,
        )}
      >
        {visibleItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative text-muted-foreground items-center flex space-x-1 hover:text-foreground transition-all duration-200 px-2 py-0.5 rounded-full hover:bg-accent/10 text-xs",
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-xs font-medium">{navItem.name}</span>
          </Link>
        ))}

        {hiddenItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-0.5 text-xs font-medium rounded-full px-2 py-0.5 h-auto">
                More
                <ChevronDown className="h-2.5 w-2.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-popover border-border">
              {hiddenItems.map((navItem, idx) => (
                <DropdownMenuItem key={`hidden-link-${idx}`} asChild>
                  <Link href={navItem.link} className="text-xs font-medium">
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
