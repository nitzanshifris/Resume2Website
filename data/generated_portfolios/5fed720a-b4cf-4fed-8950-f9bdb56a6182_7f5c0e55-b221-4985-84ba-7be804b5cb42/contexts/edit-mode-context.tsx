"use client"
import React, { createContext, useContext, useState, useCallback } from 'react'

interface EditModeContextType {
  isEditMode: boolean
  toggleEditMode: () => void
  setEditMode: (value: boolean) => void
  currentlyEditing: string | null
  startEditing: (id: string) => boolean
  stopEditing: (id: string) => void
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined)

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentlyEditing, setCurrentlyEditing] = useState<string | null>(null)

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => {
      // If turning off edit mode, stop any current editing
      if (prev) {
        setCurrentlyEditing(null)
      }
      return !prev
    })
  }, [])

  const setEditMode = useCallback((value: boolean) => {
    setIsEditMode(value)
    // If turning off edit mode, stop any current editing
    if (!value) {
      setCurrentlyEditing(null)
    }
  }, [])

  const startEditing = useCallback((id: string) => {
    console.log(`🎯 Context: startEditing called for ${id}`)
    console.log(`🎯 Context: currentlyEditing is ${currentlyEditing}`)
    
    // Only allow editing if no other element is currently being edited
    if (currentlyEditing && currentlyEditing !== id) {
      console.log(`🚫 Context: BLOCKING edit for ${id} (${currentlyEditing} is active)`)
      return false // Editing blocked
    }
    
    setCurrentlyEditing(id)
    console.log(`✅ Context: ALLOWING edit for ${id}`)
    return true // Editing allowed
  }, [currentlyEditing])

  const stopEditing = useCallback((id: string) => {
    console.log(`🛑 Context: stopEditing called for ${id}`)
    console.log(`🛑 Context: currentlyEditing is ${currentlyEditing}`)
    
    // Only stop editing if this element is the one currently being edited
    if (currentlyEditing === id) {
      setCurrentlyEditing(null)
      console.log(`✅ Context: STOPPED editing for ${id}`)
    } else {
      console.log(`⚠️ Context: IGNORED stop request for ${id} (not currently editing)`)
    }
  }, [currentlyEditing])

  return (
    <EditModeContext.Provider value={{ 
      isEditMode, 
      toggleEditMode, 
      setEditMode, 
      currentlyEditing, 
      startEditing, 
      stopEditing 
    }}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode() {
  const context = useContext(EditModeContext)
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider')
  }
  return context
}