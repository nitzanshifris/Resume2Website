"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEditMode } from "@/contexts/edit-mode-context"
import { cn } from "@/lib/utils"

export function EditModeToggle() {
  const { isEditMode, toggleEditMode } = useEditMode()

  return (
    <>

      {/* Main toggle button */}
      <motion.div
        className="fixed top-8 left-8 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="relative">
          {/* Glow effect */}
          {!isEditMode && (
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          )}
          
          <Button
            onClick={toggleEditMode}
            size="lg"
            className={cn(
              "relative rounded-full shadow-lg transition-all duration-300",
              "hover:scale-110 hover:shadow-xl",
              "px-6 py-6",
              isEditMode
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            )}
          >
            <div className="flex items-center gap-2">
              <Edit3 className="h-6 w-6" />
              <span className="font-semibold text-base">
                {isEditMode ? "Preview Changes" : "Edit Mode"}
              </span>
            </div>
          </Button>
        </div>

        {/* Tooltip for non-edit mode */}
        <AnimatePresence>
          {!isEditMode && (
            <motion.div
              initial={{ opacity: 0, y: -10, x: "0%" }}
              animate={{ opacity: 1, y: 0, x: "0%" }}
              exit={{ opacity: 0, y: -10, x: "0%" }}
              transition={{ duration: 0.3, delay: 1 }}
              className="absolute -bottom-16 left-0 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg"
            >
              <p className="text-sm font-medium text-foreground whitespace-nowrap">
                ✨ Click to customize your portfolio
              </p>
              {/* Arrow */}
              <div className="absolute left-6 -translate-x-1/2 bottom-full translate-y-px">
                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-border" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}