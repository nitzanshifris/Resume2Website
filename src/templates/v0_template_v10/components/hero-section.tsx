"use client"
import { motion } from "framer-motion"
import { EditableText } from "@/components/ui/editable-text"
import { LampUnderline } from "@/components/ui/lamp-underline"
import { Sparkles } from "@/components/ui/sparkles"
import { Button } from "@/components/ui/button"
import { ArrowDown, Camera, Upload, X, Circle, Square, RectangleHorizontal, ZoomIn, ZoomOut } from "lucide-react"
import type { HeroData } from "@/lib/data"
import { useState, useRef, useEffect } from "react"
import { useEditMode } from "@/contexts/edit-mode-context"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeroSectionProps {
  data: HeroData
  onSave: (field: keyof HeroData, value: string) => void
  showPhoto: boolean
}

type ImageShape = 'circle' | 'square' | 'rounded'

export function HeroSection({ data, onSave, showPhoto }: HeroSectionProps) {
  const { isEditMode } = useEditMode()
  
  const [isUploading, setIsUploading] = useState(false)
  const [imageShape, setImageShape] = useState<ImageShape>('circle')
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [imageZoom, setImageZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file")
        return
      }
      
      setIsUploading(true)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        onSave("profilePhotoUrl", base64String)
        setIsUploading(false)
        setImagePosition({ x: 0, y: 0 }) // Reset position on new upload
        setImageZoom(1) // Reset zoom on new upload
      }
      reader.onerror = (error) => {
        console.error("FileReader error:", error)
        setIsUploading(false)
        alert("Error reading file")
      }
      reader.readAsDataURL(file)
    }
  }

  // Add global mouse event listeners for drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !isEditMode) return
      
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      
      // Limit movement within the image container bounds (smaller range for repositioning)
      const maxOffset = 30
      const limitedX = Math.max(-maxOffset, Math.min(maxOffset, newX))
      const limitedY = Math.max(-maxOffset, Math.min(maxOffset, newY))
      
      setImagePosition({ x: limitedX, y: limitedY })
    }

    const handleMouseUp = () => {
      console.log('Drag ended')
      setIsDragging(false)
    }

    if (isDragging) {
      console.log('Adding drag listeners')
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        console.log('Removing drag listeners')
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart, isEditMode])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode || !data.profilePhotoUrl) return
    
    // Check if click is on a button
    const target = e.target as HTMLElement
    if (target.closest('button')) return
    
    e.preventDefault()
    
    console.log('Starting drag at:', e.clientX, e.clientY)
    setIsDragging(true)
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y
    })
  }

  const getShapeClasses = () => {
    switch (imageShape) {
      case 'circle':
        return 'rounded-full'
      case 'square':
        return 'rounded-none'
      case 'rounded':
        return 'rounded-xl'
    }
  }

  return (
    <div className="h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden rounded-md py-8 px-4">
      <div className="flex flex-col items-center justify-center scale-125 transform-gpu"
        style={{ transformOrigin: 'center center' }}>
      {/* Profile Image - moved above name */}
      {showPhoto && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 relative"
        >
          <div className="relative group">
            <div className="relative" ref={imageContainerRef}>
              <div className={cn(
                "relative w-40 h-40 sm:w-48 sm:h-48 overflow-hidden shadow-xl transition-all duration-200",
                isEditMode 
                  ? "gradient-border-dashed-thick" 
                  : "border-4 border-white/20",
                getShapeClasses()
              )}>
                <div
                  className="relative w-full h-full cursor-move"
                  onMouseDown={handleMouseDown}
                  onWheel={(e) => {
                    if (isEditMode && data.profilePhotoUrl) {
                      e.preventDefault()
                      const delta = e.deltaY > 0 ? -0.1 : 0.1
                      setImageZoom(prev => Math.max(0.5, Math.min(3, prev + delta)))
                    }
                  }}
                >
                  {data.profilePhotoUrl ? (
                    <img
                      src={data.profilePhotoUrl}
                      alt={data.fullName ?? "Profile Photo"}
                      className="object-cover pointer-events-none"
                      draggable={false}
                      style={{
                        transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageZoom})`,
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                        objectPosition: '50% 50%',
                        width: '100%',
                        height: '100%',
                        transformOrigin: 'center'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Zoom indicator */}
            {isEditMode && data.profilePhotoUrl && imageZoom !== 1 && (
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {Math.round(imageZoom * 100)}%
              </div>
            )}
            
            {/* Edit controls */}
            {isEditMode && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {/* Remove image button - leftmost position */}
                {data.profilePhotoUrl && (
                  <Button
                    onClick={() => {
                      onSave("profilePhotoUrl", "")
                      setImagePosition({ x: 0, y: 0 })
                      setImageZoom(1)
                    }}
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 rounded-full shadow-lg bg-red-500 hover:bg-red-600 text-white"
                    title="Remove Image"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
                
                {/* Upload button */}
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 rounded-full shadow-lg"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="h-3 w-3 border border-t-transparent border-current rounded-full animate-spin" />
                  ) : (
                    <Upload className="h-3 w-3" />
                  )}
                </Button>
                
                {/* Zoom controls - only show when image exists */}
                {data.profilePhotoUrl && (
                  <>
                    <Button
                      onClick={() => setImageZoom(prev => Math.max(0.5, prev - 0.2))}
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 rounded-full shadow-lg"
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => setImageZoom(prev => Math.min(3, prev + 0.2))}
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 rounded-full shadow-lg"
                      title="Zoom In"
                    >
                      <ZoomIn className="h-3 w-3" />
                    </Button>
                  </>
                )}
                
                {/* Shape selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 rounded-full shadow-lg"
                    >
                      {imageShape === 'circle' && <Circle className="h-3 w-3" />}
                      {imageShape === 'square' && <Square className="h-3 w-3" />}
                      {imageShape === 'rounded' && <RectangleHorizontal className="h-3 w-3" />}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center">
                    {imageShape !== 'circle' && (
                      <DropdownMenuItem onClick={() => setImageShape('circle')}>
                        <Circle className="h-4 w-4 mr-2" />
                        Circle
                      </DropdownMenuItem>
                    )}
                    {imageShape !== 'square' && (
                      <DropdownMenuItem onClick={() => setImageShape('square')}>
                        <Square className="h-4 w-4 mr-2" />
                        Square
                      </DropdownMenuItem>
                    )}
                    {imageShape !== 'rounded' && (
                      <DropdownMenuItem onClick={() => setImageShape('rounded')}>
                        <RectangleHorizontal className="h-4 w-4 mr-2" />
                        Rounded
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Name with lamp underline animation */}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-4"
      >
        <LampUnderline>
          <div className="relative">
            <EditableText
              as="h1"
              initialValue={data.fullName ?? "Your Name"}
              onSave={(value) => onSave("fullName", value)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center text-foreground relative z-20 font-serif leading-tight whitespace-nowrap"
            />
          </div>
        </LampUnderline>
      </motion.div>
      {/* Professional title with animation */}
      <motion.div 
        className="w-full flex justify-center mb-4"
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.8, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
      >
        <div className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[600px] px-2 sm:px-4">
          <div className="relative">
            <EditableText
              as="h2"
              initialValue={data.professionalTitle ?? "Professional Title"}
              onSave={(value) => onSave("professionalTitle", value)}
              className="text-[22px] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-normal text-foreground/90 font-serif text-center tracking-tight leading-tight"
            />
          </div>
        </div>
      </motion.div>



      {/* Contact button - simple and smaller */}
      <div className="mt-6">
        <Button
          asChild
          className="px-6 py-3 text-base font-medium rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors duration-200 shadow-sm"
        >
          <a href="#contact" className="flex items-center">
            <ArrowDown className="mr-2 h-4 w-4" />
            Contact Me
          </a>
        </Button>
      </div>
      </div>
    </div>
  )
}
