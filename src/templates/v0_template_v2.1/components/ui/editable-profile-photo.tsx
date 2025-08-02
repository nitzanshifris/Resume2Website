"use client"

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, X } from 'lucide-react'
import { useEditMode } from '@/contexts/edit-mode-context'
import { cn } from '@/lib/utils'

interface EditableProfilePhotoProps {
  initialPhotoUrl: string | null
  onPhotoChange: (url: string | null) => void
  name: string
}

export const EditableProfilePhoto = ({ initialPhotoUrl, onPhotoChange, name }: EditableProfilePhotoProps) => {
  const { isEditMode } = useEditMode()
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl)
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const url = reader.result as string
        setPhotoUrl(url)
        onPhotoChange(url)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoUrl(null)
    onPhotoChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (isEditMode && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  if (!photoUrl && !isEditMode) {
    return null
  }

  return (
    <motion.div 
      className="relative mt-8 mx-auto"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div
        onClick={handleClick}
        className={cn(
          "relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-neutral-800 shadow-lg",
          isEditMode && "cursor-pointer"
        )}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`Profile picture of ${name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <Camera className="w-12 h-12 text-neutral-600" />
          </div>
        )}
        
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering ? 1 : 0 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <Upload className="w-8 h-8 text-foreground mx-auto mb-2" />
              <span className="text-foreground text-sm">Change Photo</span>
            </div>
          </motion.div>
        )}
      </div>
      
      {isEditMode && photoUrl && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={(e) => {
            e.stopPropagation()
            handleRemovePhoto()
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-foreground shadow-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  )
}