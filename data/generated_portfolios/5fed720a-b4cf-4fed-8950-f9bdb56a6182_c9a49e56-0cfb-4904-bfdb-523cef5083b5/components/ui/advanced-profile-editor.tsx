"use client"

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, Square, Circle, RectangleHorizontal } from 'lucide-react'
import { useEditMode } from '@/contexts/edit-mode-context'
import { cn } from '@/lib/utils'
import Cropper from 'react-easy-crop'
import { Area, Point } from 'react-easy-crop/types'
import { Slider } from '@/components/ui/slider'

type ShapeType = 'circle' | 'square' | 'rounded'

interface AdvancedProfileEditorProps {
  initialPhotoUrl: string | null
  onPhotoChange: (url: string | null, settings?: PhotoSettings) => void
  name: string
  initialSettings?: PhotoSettings
}

interface PhotoSettings {
  shape: ShapeType
  zoom: number
  crop: Point
  croppedAreaPixels?: Area
}

const defaultSettings: PhotoSettings = {
  shape: 'circle',
  zoom: 1,
  crop: { x: 0, y: 0 }
}

export const AdvancedProfileEditor = ({ 
  initialPhotoUrl, 
  onPhotoChange, 
  name,
  initialSettings = defaultSettings 
}: AdvancedProfileEditorProps) => {
  const { isEditMode } = useEditMode()
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl)
  const [showControls, setShowControls] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [settings, setSettings] = useState<PhotoSettings>(initialSettings)
  const [crop, setCrop] = useState<Point>(initialSettings.crop)
  const [zoom, setZoom] = useState(initialSettings.zoom)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const url = reader.result as string
        setPhotoUrl(url)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setShowCropper(true)
        setShowControls(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleApplyPosition = useCallback(() => {
    const newSettings = {
      ...settings,
      crop,
      zoom,
      croppedAreaPixels: croppedAreaPixels || undefined
    }
    setSettings(newSettings)
    onPhotoChange(photoUrl, newSettings)
    setShowCropper(false)
  }, [settings, crop, zoom, croppedAreaPixels, photoUrl, onPhotoChange])

  const handleRemovePhoto = () => {
    setPhotoUrl(null)
    onPhotoChange(null)
    setShowControls(false)
    setShowCropper(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleShapeChange = (shape: ShapeType) => {
    const newSettings = { ...settings, shape }
    setSettings(newSettings)
    if (photoUrl) {
      onPhotoChange(photoUrl, newSettings)
    }
  }

  const getShapeClasses = () => {
    switch (settings.shape) {
      case 'circle':
        return 'rounded-full'
      case 'square':
        return 'rounded-none'
      case 'rounded':
        return 'rounded-3xl'
    }
  }

  const getCropperAspect = () => {
    return 1 // Always square for profile photos
  }

  const getCropperShape = () => {
    return settings.shape === 'circle' ? 'round' : 'rect'
  }

  if (!photoUrl && !isEditMode) {
    return null
  }

  return (
    <div className="relative mt-8 mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="relative">
        {/* Main Photo Display */}
        {!showCropper && (
          <div
            onClick={() => !photoUrl && isEditMode && fileInputRef.current?.click()}
            className={cn(
              "relative w-64 h-64 mx-auto overflow-hidden border-4 border-neutral-800 shadow-lg transition-all duration-300",
              getShapeClasses(),
              isEditMode && !photoUrl && "cursor-pointer hover:border-neutral-600"
            )}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={`Profile picture of ${name}`}
                className="w-full h-full object-cover"
                style={{
                  transform: `translate(${settings.crop.x}px, ${settings.crop.y}px) scale(${settings.zoom})`,
                  transformOrigin: 'center'
                }}
              />
            ) : (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors">
                <div className="text-center">
                  <Camera className="w-20 h-20 text-neutral-600 mx-auto mb-3" />
                  <span className="text-neutral-400 text-lg">Upload Photo</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cropper Interface */}
        {showCropper && photoUrl && (
          <div className="relative">
            <div className={cn(
              "relative w-96 h-96 mx-auto overflow-hidden shadow-lg",
              getShapeClasses()
            )}>
              <Cropper
                image={photoUrl}
                crop={crop}
                zoom={zoom}
                aspect={getCropperAspect()}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape={getCropperShape()}
                showGrid={false}
                style={{
                  containerStyle: {
                    backgroundColor: '#000'
                  }
                }}
              />
            </div>
            
            {/* Zoom Control */}
            <div className="mt-6 px-4">
              <label className="text-xs text-neutral-400 uppercase tracking-wider mb-2 block">
                Zoom
              </label>
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>
            
            {/* Done Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleApplyPosition}
                className="px-6 py-2 text-sm bg-purple-600 hover:bg-purple-500 text-foreground rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
        
        {/* Edit Buttons */}
        {isEditMode && photoUrl && !showCropper && (
          <>
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={handleRemovePhoto}
              className="absolute -top-3 right-2 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-foreground shadow-lg transition-colors z-10"
              title="Remove photo"
            >
              <X className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={() => fileInputRef.current?.click()}
              className="absolute -top-3 right-12 w-10 h-10 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center text-foreground shadow-lg transition-colors z-10"
              title="Change photo"
            >
              <Upload className="w-5 h-5" />
            </motion.button>
          </>
        )}
      </div>
      
      {/* Shape and Position Controls */}
      <AnimatePresence>
        {isEditMode && photoUrl && showControls && !showCropper && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 bg-black/80 backdrop-blur-sm rounded-lg border border-neutral-700"
          >
            {/* Shape Selector */}
            <div className="mb-4">
              <label className="text-xs text-neutral-400 uppercase tracking-wider mb-2 block">Shape</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShapeChange('circle')}
                  className={cn(
                    "p-2 rounded transition-all",
                    settings.shape === 'circle' 
                      ? "bg-purple-500 text-foreground" 
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                  )}
                  title="Circle"
                >
                  <Circle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShapeChange('square')}
                  className={cn(
                    "p-2 rounded transition-all",
                    settings.shape === 'square' 
                      ? "bg-purple-500 text-foreground" 
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                  )}
                  title="Square"
                >
                  <Square className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShapeChange('rounded')}
                  className={cn(
                    "p-2 rounded transition-all",
                    settings.shape === 'rounded' 
                      ? "bg-purple-500 text-foreground" 
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                  )}
                  title="Rounded"
                >
                  <RectangleHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Adjust Position Button */}
            <button
              onClick={() => setShowCropper(true)}
              className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-foreground rounded-lg transition-colors text-sm"
            >
              Adjust Position & Zoom
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}