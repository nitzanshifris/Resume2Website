"use client"

import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Area, Point } from 'react-easy-crop/types'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { RotateCw, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ImageTransform {
  crop: Point
  zoom: number
  rotation: number
}

interface ImageTransformEditorProps {
  image: string
  initialTransform?: ImageTransform
  onSave: (transform: ImageTransform) => void
  aspectRatio?: number
  className?: string
}

export function ImageTransformEditor({ 
  image, 
  initialTransform,
  onSave, 
  aspectRatio = 4 / 3, 
  className 
}: ImageTransformEditorProps) {
  const [crop, setCrop] = useState<Point>(initialTransform?.crop || { x: 0, y: 0 })
  const [zoom, setZoom] = useState(initialTransform?.zoom || 1)
  const [rotation, setRotation] = useState(initialTransform?.rotation || 0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = useCallback(() => {
    // Convert pixel-based crop to percentage-based for responsive display
    const percentageCrop = croppedAreaPixels ? {
      x: (croppedAreaPixels.x / croppedAreaPixels.width) * 100,
      y: (croppedAreaPixels.y / croppedAreaPixels.height) * 100
    } : crop

    onSave({
      crop: percentageCrop,
      zoom,
      rotation
    })
  }, [crop, zoom, rotation, croppedAreaPixels, onSave])

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleReset = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
  }

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <div className="relative h-[400px] bg-gray-100 rounded-lg overflow-hidden">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          showGrid
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <ZoomOut className="w-5 h-5 text-muted-foreground" />
          <Slider
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            max={3}
            min={1}
            step={0.1}
            className="flex-1"
          />
          <ZoomIn className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Rotate
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          
          <Button onClick={handleSave}>
            Apply Changes
          </Button>
        </div>
      </div>
    </div>
  )
}