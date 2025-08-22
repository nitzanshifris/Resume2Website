"use client"

import React, { useState, useEffect } from 'react'
import { Briefcase } from 'lucide-react'
import { renderIcon } from '@/lib/icon-utils'
import { useEditMode } from '@/contexts/edit-mode-context'
import { ClientOnly } from './client-only'

interface IconWithZoomProps {
  icon?: any
  onIconUpdate?: (newIcon: any) => void
  className?: string
  isCurrentRole?: boolean
  iconClassName?: string
}

export function IconWithZoom({ 
  icon, 
  onIconUpdate, 
  className = "",
  isCurrentRole = false,
  iconClassName = "h-6 w-6"
}: IconWithZoomProps) {
  const { isEditMode } = useEditMode()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const renderIconContent = () => {
    if (icon) {
      return renderIcon(icon, `${iconClassName} ${isCurrentRole ? 'text-white' : 'text-muted-foreground'}`)
    } else {
      return <Briefcase className={`${iconClassName} ${isCurrentRole ? 'text-white' : 'text-muted-foreground'}`} />
    }
  }

  return (
    <div className={`relative group/icon-container ${className}`}>
      <div className={`relative p-3 rounded-xl transition-all duration-200 ease-out ${
        isCurrentRole 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 ring-4 ring-blue-200/50' 
          : 'bg-gradient-to-br from-slate-100 to-slate-200/80 group-hover:from-slate-200 group-hover:to-slate-300/80 shadow-sm'
      } ${isEditMode ? 'gradient-border-dashed cursor-pointer' : ''}`}>
        {renderIconContent()}
        
        {/* Zoom Controls for Uploaded Icons */}
        <ClientOnly>
          {isEditMode && icon && typeof icon === 'object' && icon?.type === 'upload' && onIconUpdate && (
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex gap-1 z-[9999]">
              <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const currentScale = icon.scale !== undefined ? icon.scale : 2
                const newScale = Math.max(0.5, currentScale - 0.2)
                onIconUpdate({ ...icon, scale: newScale })
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className="w-5 h-5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md transition-colors"
              title="Zoom out"
              style={{ pointerEvents: 'all' }}
            >
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 pointer-events-none">−</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const currentScale = icon.scale !== undefined ? icon.scale : 2
                const newScale = Math.min(2, currentScale + 0.2)
                onIconUpdate({ ...icon, scale: newScale })
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className="w-5 h-5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md transition-colors"
              title="Zoom in"
              style={{ pointerEvents: 'all' }}
            >
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 pointer-events-none">+</span>
            </button>
          </div>
        )}
        </ClientOnly>
      </div>
    </div>
  )
}