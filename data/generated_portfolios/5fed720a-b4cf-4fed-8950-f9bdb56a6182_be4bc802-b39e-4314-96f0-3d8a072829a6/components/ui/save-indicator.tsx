"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Clock, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface SaveIndicatorProps {
  status: SaveStatus
  className?: string
  message?: string
}

const statusConfig = {
  idle: {
    icon: null,
    text: '',
    color: 'text-neutral-500',
    bgColor: 'bg-neutral-100',
  },
  saving: {
    icon: Clock,
    text: 'Saving...',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  saved: {
    icon: Check,
    text: 'All changes saved',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  error: {
    icon: AlertTriangle,
    text: 'Save failed',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
}

export function SaveIndicator({ status, className, message }: SaveIndicatorProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  if (status === 'idle') return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'fixed top-20 right-4 z-50',
          'flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg',
          'backdrop-blur-sm border border-white/20',
          config.bgColor,
          className
        )}
        role="status"
        aria-live="polite"
      >
        {Icon && (
          <motion.div
            animate={status === 'saving' ? { rotate: 360 } : {}}
            transition={status === 'saving' ? { 
              duration: 1, 
              repeat: Infinity, 
              ease: "linear" 
            } : {}}
          >
            <Icon className={cn('h-4 w-4', config.color)} />
          </motion.div>
        )}
        <span className={cn('text-sm font-medium', config.color)}>
          {message || config.text}
        </span>
      </motion.div>
    </AnimatePresence>
  )
}

// Hook for managing save status with auto-hide
export function useSaveStatus(autoHideDelay = 2000) {
  const [status, setStatus] = React.useState<SaveStatus>('idle')
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const updateStatus = React.useCallback((newStatus: SaveStatus) => {
    setStatus(newStatus)
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Auto-hide success and error states
    if (newStatus === 'saved' || newStatus === 'error') {
      timeoutRef.current = setTimeout(() => {
        setStatus('idle')
      }, autoHideDelay)
    }
  }, [autoHideDelay])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { status, updateStatus }
}