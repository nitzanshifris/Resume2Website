"use client"
import React from 'react'
import { useEditMode } from '@/contexts/edit-mode-context'

interface EditGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

/**
 * EditGuard - Only renders children when in edit mode
 * This is the primary defense against edit UI appearing in preview mode
 */
export function EditGuard({ children, fallback = null, className }: EditGuardProps) {
  const { isEditMode } = useEditMode()
  
  if (!isEditMode) {
    return fallback ? <div className={className}>{fallback}</div> : null
  }
  
  return <div className={className}>{children}</div>
}

/**
 * EditOnlyWrapper - Inline component for simple cases
 * Usage: <EditOnlyWrapper>{editContent}</EditOnlyWrapper>
 */
export function EditOnlyWrapper({ children }: { children: React.ReactNode }) {
  const { isEditMode } = useEditMode()
  return isEditMode ? <>{children}</> : null
}

/**
 * EditableSection - Wrapper for sections that need different behavior
 */
interface EditableSectionWrapperProps {
  children: React.ReactNode
  editContent?: React.ReactNode
  previewContent?: React.ReactNode
  className?: string
}

export function EditableSectionWrapper({ 
  children, 
  editContent, 
  previewContent, 
  className 
}: EditableSectionWrapperProps) {
  const { isEditMode } = useEditMode()
  
  return (
    <div className={className}>
      {children}
      {isEditMode && editContent}
      {!isEditMode && previewContent}
    </div>
  )
}

/**
 * Hook to conditionally return props based on edit mode
 */
export function useEditModeProps<T extends object>(editProps: T, previewProps: Partial<T> = {}): T {
  const { isEditMode } = useEditMode()
  return isEditMode ? editProps : { ...editProps, ...previewProps } as T
}

/**
 * Utility to sanitize props - removes edit-related props in preview mode
 */
export function sanitizeEditProps<T extends Record<string, any>>(
  props: T, 
  editPropNames: (keyof T)[]
): T {
  const { isEditMode } = useEditMode()
  
  if (isEditMode) {
    return props
  }
  
  const sanitized = { ...props }
  editPropNames.forEach(propName => {
    delete sanitized[propName]
  })
  
  return sanitized
}