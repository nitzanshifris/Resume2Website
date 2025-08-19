"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WatermarkToggleProps {
  isVisible: boolean
  onToggle: () => void
}

export function WatermarkToggle({ isVisible, onToggle }: WatermarkToggleProps) {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-[60]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Button
        onClick={onToggle}
        size="lg"
        className={cn(
          "rounded-full shadow-lg transition-all duration-300",
          "hover:scale-110 hover:shadow-xl",
          "bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white"
        )}
      >
        <AnimatePresence mode="wait">
          {isVisible ? (
            <motion.div
              key="hide"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <EyeOff className="h-5 w-5" />
              <span className="font-medium">Hide Watermark</span>
            </motion.div>
          ) : (
            <motion.div
              key="show"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <Eye className="h-5 w-5" />
              <span className="font-medium">Show Watermark</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {!isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-full mb-4 right-0 bg-card border border-border rounded-lg p-3 shadow-lg"
          >
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              Watermark hidden for preview
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}