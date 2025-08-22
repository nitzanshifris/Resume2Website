"use client"
import React from 'react'
import { useEditMode } from '@/contexts/edit-mode-context'

/**
 * Higher-Order Component that automatically strips edit functionality in preview mode
 */
export function withEditProtection<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  options: {
    // Props to remove in preview mode
    editProps?: (keyof P)[]
    // Props to set to specific values in preview mode
    overrideProps?: Partial<P>
    // Component name for debugging
    name?: string
  } = {}
) {
  const {
    editProps = [],
    overrideProps = {},
    name = Component.displayName || Component.name || 'Component'
  } = options

  return React.forwardRef<any, P>((props, ref) => {
    const { isEditMode, isEditAllowed } = useEditMode()
    
    // Check if editing is allowed for this component
    if (!isEditAllowed(name)) {
      // Strip edit-related props and apply overrides
      const sanitizedProps = { ...props }
      
      // Remove edit-specific props
      editProps.forEach(propName => {
        delete sanitizedProps[propName]
      })
      
      // Apply preview mode overrides
      Object.assign(sanitizedProps, overrideProps)
      
      // Log for debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🛡️ EditProtection: ${name} - Edit props stripped in preview mode`)
      }
      
      return <Component {...sanitizedProps} ref={ref} />
    }
    
    // In edit mode, pass through all props
    return <Component {...props} ref={ref} />
  })
}

/**
 * Pre-configured HOC for SmartCard components
 */
export const withSmartCardProtection = <P extends Record<string, any>>(
  Component: React.ComponentType<P>
) => withEditProtection(Component, {
  editProps: ['onUpdate', 'onDelete', 'showIconEditor'],
  overrideProps: {
    showIconEditor: false,
    disableHoverEffects: true,
  } as Partial<P>,
  name: 'SmartCard'
})

/**
 * Pre-configured HOC for Timeline components
 */
export const withTimelineProtection = <P extends Record<string, any>>(
  Component: React.ComponentType<P>
) => withEditProtection(Component, {
  editProps: ['onEdit', 'onDelete', 'onUpdateImage'],
  overrideProps: {
    isEditMode: false
  } as Partial<P>,
  name: 'Timeline'
})

/**
 * Pre-configured HOC for Card components
 */
export const withCardProtection = <P extends Record<string, any>>(
  Component: React.ComponentType<P>
) => withEditProtection(Component, {
  editProps: ['onSave', 'onDelete', 'onEdit', 'onUpdate'],
  name: 'Card'
})

/**
 * Component that enforces edit mode restrictions at the JSX level
 */
interface EditEnforcerProps {
  children: React.ReactNode
  blockAll?: boolean
  allowedComponents?: string[]
}

export function EditEnforcer({ children, blockAll = false, allowedComponents = [] }: EditEnforcerProps) {
  const { isEditMode } = useEditMode()
  
  if (!isEditMode && blockAll) {
    // In preview mode with blockAll=true, render a static version
    return <div className="pointer-events-none select-none">{children}</div>
  }
  
  return <>{children}</>
}