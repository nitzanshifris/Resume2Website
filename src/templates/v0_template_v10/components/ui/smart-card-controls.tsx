"use client"

import React from 'react'
import { Settings, Trash2, ExternalLink, X, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useEditMode } from '@/contexts/edit-mode-context'
import { ClientOnly } from './client-only'

export interface SmartCardControlsProps {
  // Core functionality
  onDelete?: () => void
  onSettings?: () => void
  onExpand?: () => void
  externalLink?: string
  
  // Settings panel content
  settingsContent?: React.ReactNode
  settingsTitle?: string
  
  // Behavior options
  showSettings?: boolean
  showDelete?: boolean
  showExternal?: boolean
  showExpand?: boolean
  hideOnViewMode?: boolean // Hide controls in view mode vs edit mode
  
  // Styling options
  className?: string
  variant?: 'default' | 'minimal' | 'card' | 'floating' // Different visual styles
}

export function SmartCardControls({
  onDelete,
  onSettings,
  onExpand,
  externalLink,
  settingsContent,
  settingsTitle = "Settings",
  showSettings = true,
  showDelete = true,
  showExternal = false,
  showExpand = false,
  hideOnViewMode = true,
  className = "",
  variant = 'floating'
}: SmartCardControlsProps) {
  const { isEditMode } = useEditMode()
  
  // Don't render if in view mode and hideOnViewMode is true
  if (hideOnViewMode && !isEditMode) {
    return null
  }
  
  // Don't render if no actions are available
  const hasAnyAction = (showDelete && onDelete) || (showSettings && (onSettings || settingsContent)) || (showExternal && externalLink) || (showExpand && onExpand)
  if (!hasAnyAction) {
    return null
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return "bg-black/50 backdrop-blur-sm rounded-md p-0.5"
      case 'card':
        return "bg-card border border-border shadow-md rounded-lg p-1"
      case 'floating':
        return "" // No container background for floating buttons
      default:
        return "bg-background/90 backdrop-blur-sm rounded-lg p-1 shadow-sm"
    }
  }

  const getHoverStyles = () => {
    return isEditMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
  }

  // Special rendering for floating variant - individual positioned buttons
  if (variant === 'floating') {
    const buttons = []
    let buttonIndex = 0

    // Delete Button (rightmost)
    if (showDelete && onDelete) {
      buttons.push(
        <Button 
          key="delete"
          size="icon" 
          variant="destructive" 
          className={`absolute top-2 right-2 h-8 w-8 shadow-md z-50 border border-black/20 ${getHoverStyles()} transition-opacity duration-200`}
          onClick={onDelete}
          title="Delete"
        >
          <X className="h-4 w-4" />
        </Button>
      )
      buttonIndex++
    }

    // Settings Button (next to delete)
    if (showSettings && (onSettings || settingsContent)) {
      const rightOffset = buttonIndex * 40 + 8 // 32px button + 8px gap
      
      buttons.push(
        settingsContent ? (
          <Sheet key="settings">
            <SheetTrigger asChild>
              <Button 
                size="icon" 
                variant="secondary" 
                className={`absolute top-2 h-8 w-8 shadow-md z-50 border border-black/20 ${getHoverStyles()} transition-opacity duration-200`}
                style={{ right: `${rightOffset}px` }}
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{settingsTitle}</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                {settingsContent}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Button 
            key="settings"
            size="icon" 
            variant="secondary" 
            className={`absolute top-2 h-8 w-8 shadow-md z-50 border border-black/20 ${getHoverStyles()} transition-opacity duration-200`}
            style={{ right: `${rightOffset}px` }}
            onClick={onSettings}
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )
      )
      buttonIndex++
    }

    // External Link Button
    if (showExternal && externalLink) {
      const rightOffset = buttonIndex * 40 + 8
      
      buttons.push(
        <Button 
          key="external"
          size="icon" 
          variant="secondary" 
          className={`absolute top-2 h-8 w-8 shadow-md z-50 border border-black/20 ${getHoverStyles()} transition-opacity duration-200`}
          style={{ right: `${rightOffset}px` }}
          onClick={() => {
            if (externalLink) {
              window.open(externalLink, '_blank')
            }
          }}
          title="Open in new tab"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      )
      buttonIndex++
    }

    // Expand Button (leftmost)
    if (showExpand && onExpand) {
      const rightOffset = buttonIndex * 40 + 8
      
      buttons.push(
        <Button 
          key="expand"
          size="icon" 
          variant="secondary" 
          className={`absolute top-2 h-8 w-8 shadow-md z-50 border border-black/20 ${getHoverStyles()} transition-opacity duration-200`}
          style={{ right: `${rightOffset}px` }}
          onClick={onExpand}
          title="Full view"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      )
    }

    return <ClientOnly>{buttons}</ClientOnly>
  }

  // Default container-based rendering for other variants
  return (
    <ClientOnly>
      <div className={`
        absolute top-2 right-2 z-50 flex gap-2 
        ${getVariantStyles()}
        ${getHoverStyles()}
        transition-opacity duration-200
        ${className}
      `}>
        
        {/* External Link Button */}
        {showExternal && externalLink && (
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-8 w-8 shadow-sm"
            onClick={() => {
              if (externalLink) {
                window.open(externalLink, '_blank')
              }
            }}
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}

        {/* Expand Button */}
        {showExpand && onExpand && (
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-8 w-8 shadow-sm"
            onClick={onExpand}
            title="Full view"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}

        {/* Settings Button */}
        {showSettings && (onSettings || settingsContent) && (
          <>
            {settingsContent ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8 shadow-sm"
                    title="Settings"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>{settingsTitle}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    {settingsContent}
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button 
                size="icon" 
                variant="secondary" 
                className="h-8 w-8 shadow-sm"
                onClick={onSettings}
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
        
        {/* Delete Button */}
        {showDelete && onDelete && (
          <Button 
            size="icon" 
            variant="destructive" 
            className="h-8 w-8 shadow-sm"
            onClick={onDelete}
            title="Delete"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </ClientOnly>
  )
}