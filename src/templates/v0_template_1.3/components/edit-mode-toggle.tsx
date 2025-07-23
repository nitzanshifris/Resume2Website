"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Edit3, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEditMode } from "@/contexts/edit-mode-context"
import { cn } from "@/lib/utils"

export function EditModeToggle() {
  const { isEditMode, toggleEditMode } = useEditMode()

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Button
        onClick={toggleEditMode}
        size="lg"
        className={cn(
          "rounded-full shadow-lg transition-all duration-300",
          "hover:scale-110 hover:shadow-xl",
          isEditMode
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        )}
      >
        <AnimatePresence mode="wait">
          {isEditMode ? (
            <motion.div
              key="save"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <Save className="h-5 w-5" />
              <span className="font-medium">Save & Exit</span>
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <Edit3 className="h-5 w-5" />
              <span className="font-medium">Edit Mode</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-full mb-4 right-0 bg-card border border-border rounded-lg p-3 shadow-lg"
          >
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              Click on any section to edit • Drag to reorder
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}