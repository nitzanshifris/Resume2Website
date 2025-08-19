"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { JSX } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronRight } from "lucide-react"

export const SidebarNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string
    link: string
    icon?: JSX.Element
  }[]
  className?: string
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<string>("")
  const [isExpanded, setIsExpanded] = useState(false)

  // Set active item based on scroll position
  const handleNavClick = (link: string, name: string) => {
    setActiveItem(name)
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Sidebar - Left side vertical */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={cn(
          "hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 z-[5000]",
          "flex-col gap-1",
          "transition-all duration-300 ease-out cursor-pointer",
          isExpanded ? "w-[240px]" : "w-[40px]",
          className
        )}
        style={{
          height: "500px",
          maxHeight: "80vh"
        }}
      >
        {/* Collapsed state - thin indicator bar */}
        {!isExpanded && (
          <div className="absolute inset-0 bg-gradient-to-b from-accent/30 via-accent/20 to-accent/30 dark:from-accent/40 dark:via-accent/30 dark:to-accent/40 rounded-r-xl border-r-2 border-accent/30 dark:border-accent/40 shadow-lg backdrop-blur-sm">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col gap-2 py-4">
                {navItems.slice(0, Math.min(10, navItems.length)).map((_, idx) => (
                  <motion.div
                    key={`dot-${idx}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05, type: "spring" }}
                    className="w-1.5 h-1.5 bg-accent-foreground/50 dark:bg-accent-foreground/70 rounded-full shadow-sm"
                  />
                ))}
                {navItems.length > 10 && (
                  <div className="flex flex-col gap-0.5 mt-1">
                    <div className="w-1 h-1 bg-accent-foreground/30 dark:bg-accent-foreground/50 rounded-full mx-auto" />
                    <div className="w-1 h-1 bg-accent-foreground/30 dark:bg-accent-foreground/50 rounded-full mx-auto" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Expanded state - full menu */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex flex-col bg-background/95 backdrop-blur-md rounded-r-2xl border-r border-border/30 shadow-xl overflow-hidden"
              >
              {/* Header indicator */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20 flex-shrink-0">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground">Navigation</span>
              </div>

              {/* Scrollable nav items container */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2">
                <div className="space-y-1">
                  {navItems.map((navItem, idx) => (
                <motion.div
                  key={`desktop-link-${idx}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Link
                    href={navItem.link}
                    onClick={() => handleNavClick(navItem.link, navItem.name)}
                    className={cn(
                      "relative group flex items-center gap-3 px-4 py-3 rounded-xl",
                      "text-muted-foreground hover:text-foreground transition-all duration-200",
                      "hover:bg-accent/20 hover:shadow-sm",
                      activeItem === navItem.name && "bg-accent/30 text-accent-foreground"
                    )}
                  >
                    {/* Icon */}
                    <span className="flex-shrink-0 w-5 h-5">
                      {navItem.icon}
                    </span>
                    
                    {/* Text */}
                    <span className="text-sm font-medium whitespace-nowrap">
                      {navItem.name}
                    </span>
                    
                    {/* Active indicator */}
                    {activeItem === navItem.name && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full"
                      />
                    )}
                    
                    {/* Hover indicator */}
                    <ChevronRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                  </Link>
                </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile Hamburger Button - Right side */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={cn(
          "lg:hidden fixed right-4 top-4 z-[5001]",
          "p-3 rounded-full",
          "bg-background/90 backdrop-blur-md border border-border",
          "shadow-lg hover:shadow-xl transition-shadow"
        )}
      >
        <AnimatePresence mode="wait">
          {mobileMenuOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-background/50 dark:bg-black/50 backdrop-blur-sm z-[4999]"
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "lg:hidden fixed right-0 top-0 bottom-0 w-[280px] z-[5000]",
                "bg-background/95 backdrop-blur-md border-l border-border shadow-2xl",
                "overflow-y-auto"
              )}
            >
              {/* Header */}
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Navigation</h2>
              </div>
              
              {/* Nav Items */}
              <div className="p-4 space-y-1">
                {navItems.map((navItem, idx) => (
                  <motion.div
                    key={`mobile-link-${idx}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={navItem.link}
                      onClick={() => handleNavClick(navItem.link, navItem.name)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl",
                        "text-muted-foreground hover:text-foreground transition-all duration-200",
                        "hover:bg-accent/20",
                        activeItem === navItem.name && "bg-accent/30 text-accent-foreground"
                      )}
                    >
                      {/* Icon */}
                      <span className="flex-shrink-0 w-5 h-5">
                        {navItem.icon}
                      </span>
                      
                      {/* Text */}
                      <span className="text-sm font-medium">
                        {navItem.name}
                      </span>
                      
                      {/* Arrow */}
                      <ChevronRight className="ml-auto w-4 h-4 opacity-50" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}