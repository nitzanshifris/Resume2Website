"use client"
import { motion } from "framer-motion"
import { EditableText } from "@/components/ui/editable-text"
import { Sparkles } from "@/components/ui/sparkles"
import { Button } from "@/components/ui/button"
import { ArrowDown, Camera, Upload, X, Circle, Square, RectangleHorizontal } from "lucide-react"
import type { HeroData } from "@/lib/data"
import Image from "next/image"
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
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        onSave("profilePhotoUrl", base64String)
        setIsUploading(false)
        setImagePosition({ x: 0, y: 0 }) // Reset position on new upload
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
      
      // Limit movement within container bounds
      const maxOffset = 50
      const limitedX = Math.max(-maxOffset, Math.min(maxOffset, newX))
      const limitedY = Math.max(-maxOffset, Math.min(maxOffset, newY))
      
      console.log('Dragging to:', limitedX, limitedY)
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
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden rounded-md py-24 px-4">
      {/* Name with animation */}
      <motion.div
        initial={{ y: "200%", opacity: 0, rotateZ: 10 }}
        animate={{ y: 0, opacity: 1, rotateZ: 0 }}
        transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
        className="overflow-hidden"
      >
        <EditableText
          as="h1"
          initialValue={data.fullName ?? "Your Name"}
          onSave={(value) => onSave("fullName", value)}
          className="text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-bold text-center text-foreground relative z-20 font-serif text-glow leading-[0.9]"
        />
      </motion.div>
      {/* Animated divider line */}
      <motion.div 
        className="w-full h-16 relative -mt-2 mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 h-[3px] w-full max-w-[90vw] blur-sm"
          style={{ backgroundImage: "linear-gradient(to right, transparent, hsl(var(--accent)), transparent)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
        />
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 h-[1px] w-full max-w-[90vw]"
          style={{ backgroundImage: "linear-gradient(to right, transparent, hsl(var(--accent)), transparent)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
        />
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 h-[8px] w-3/4 max-w-[70vw] blur-md"
          style={{ backgroundImage: "linear-gradient(to right, transparent, hsl(var(--accent)), transparent)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        />
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 h-[2px] w-3/4 max-w-[70vw]"
          style={{ backgroundImage: "linear-gradient(to right, transparent, hsl(var(--accent)), transparent)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        />
        <Sparkles
          background="transparent"
          minSize={0.6}
          maxSize={1.5}
          particleDensity={800}
          className="w-full h-full"
          particleColor="hsl(var(--accent))"
        />
      </motion.div>
      {/* Professional title with animation */}
      <motion.div 
        className="mx-auto font-normal text-foreground font-serif text-center -mt-2"
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.8, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
      >
        <EditableText
          as="h2"
          initialValue={data.professionalTitle ?? "Professional Title"}
          onSave={(value) => onSave("professionalTitle", value)}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-normal text-foreground/90 font-serif text-center tracking-tight"
        />
      </motion.div>

      {/* Summary tagline with animation */}
      <motion.div 
        className="mx-auto max-w-4xl px-6 mt-8 mb-8"
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 1, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
      >
        <EditableText
          as="p"
          initialValue={data.summaryTagline ?? "Creating amazing experiences through innovation and dedication"}
          onSave={(value) => onSave("summaryTagline", value)}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-foreground/70 text-center leading-relaxed"
        />
      </motion.div>

      {showPhoto && (
        <motion.div
          initial={{ opacity: 0, scale: 0, rotateY: 180, y: 50 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            rotateY: 0,
            y: 0,
            transition: {
              delay: 1.5,
              duration: 1,
              ease: [0.215, 0.61, 0.355, 1],
              opacity: { duration: 0.8 },
              scale: { type: "spring", stiffness: 200, damping: 15 }
            }
          }}
          className="mt-16 relative"
        >
          <div className="relative group">
            {/* Glow effect behind photo */}
            <motion.div
              className={cn(
                "absolute inset-0 bg-accent/40 blur-2xl scale-110",
                getShapeClasses()
              )}
              animate={{
                scale: [1.1, 1.3, 1.1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            />
            
            {/* Image container with overflow hidden */}
            <div 
              ref={imageContainerRef}
              className={cn(
                "relative w-80 h-80 md:w-96 md:h-96 overflow-hidden ring-4 ring-offset-8 ring-offset-background ring-accent shadow-2xl z-10 transition-all duration-200",
                getShapeClasses(),
                isEditMode && "group-hover:ring-blue-500 group-hover:ring-offset-4"
              )}
            >
              <div
                style={{
                  transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(1.2)`,
                  cursor: isEditMode ? (isDragging ? 'grabbing' : 'grab') : 'default',
                  userSelect: 'none',
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                }}
                onMouseDown={handleMouseDown}
                className="relative w-full h-full"
              >
                <Image
                  src={data.profilePhotoUrl || "/placeholder.svg"}
                  alt={data.fullName ?? "Profile Photo"}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                  priority
                  draggable={false}
                />
              </div>
            </div>
            
            {/* Upload buttons - positioned outside the draggable area */}
            {isEditMode && (
              <div className={cn(
                "absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 transition-opacity duration-200 z-20",
                isDragging ? "opacity-0 pointer-events-none" : "opacity-0 group-hover:opacity-100"
              )}>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  className="bg-black/70 hover:bg-black/80 text-white backdrop-blur-sm"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-1" />
                      Change
                    </>
                  )}
                </Button>
                {data.profilePhotoUrl && (
                  <Button
                    onClick={() => onSave("profilePhotoUrl", "")}
                    size="sm"
                    variant="destructive"
                    className="bg-red-600/70 hover:bg-red-600/80 backdrop-blur-sm"
                    title="Remove photo"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            
            {/* Shape selector - visible in edit mode */}
            {isEditMode && (
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-20">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-background/90 backdrop-blur-sm"
                    >
                      {imageShape === 'circle' && <Circle className="h-4 w-4 mr-2" />}
                      {imageShape === 'square' && <Square className="h-4 w-4 mr-2" />}
                      {imageShape === 'rounded' && <RectangleHorizontal className="h-4 w-4 mr-2" />}
                      Shape
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setImageShape('circle')}>
                      <Circle className="h-4 w-4 mr-2" />
                      Circle
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setImageShape('square')}>
                      <Square className="h-4 w-4 mr-2" />
                      Square
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setImageShape('rounded')}>
                      <RectangleHorizontal className="h-4 w-4 mr-2" />
                      Rounded
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            
            {/* Drag hint - visible in edit mode when image exists */}
            {isEditMode && data.profilePhotoUrl && !isDragging && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full border border-border"
              >
                ✋ Drag image to reposition
              </motion.div>
            )}
          </div>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          {/* Upload hint for edit mode */}
          {isEditMode && !data.profilePhotoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-lg text-muted-foreground whitespace-nowrap"
            >
              <Upload className="h-5 w-5 inline mr-2" />
              Click to upload photo
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Contact button with scale and blur animation */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.8, filter: "blur(20px)" }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          filter: "blur(0px)",
          transition: {
            delay: 1.2,
            duration: 0.8,
            ease: [0.215, 0.61, 0.355, 1],
          }
        }}
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
        className="mt-20"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            delay: 2,
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          <Button
            asChild
            className="relative px-8 py-6 text-xl sm:px-12 sm:py-10 sm:text-3xl md:text-4xl font-semibold rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl overflow-hidden group"
          >
            <a href="#contact" className="relative">
              {/* Shimmer effect on hover */}
              <motion.div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <span className="relative flex items-center">
                <motion.div
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <ArrowDown className="mr-4 h-8 w-8 md:h-10 md:w-10" />
                </motion.div>
                Contact Me
              </span>
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
