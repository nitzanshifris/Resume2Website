"use client"
import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Briefcase, 
  Building2, 
  Code, 
  Palette, 
  Users, 
  Target, 
  TrendingUp, 
  Award,
  Settings,
  Lightbulb,
  Rocket,
  Star,
  Heart,
  Upload,
  Edit,
  GraduationCap,
  Camera,
  Coffee,
  Globe,
  Mail,
  Phone
} from "lucide-react"

// Icon library - can be expanded later
const ICON_LIBRARY = {
  briefcase: Briefcase,
  building: Building2,
  code: Code,
  palette: Palette,
  users: Users,
  target: Target,
  trending: TrendingUp,
  award: Award,
  settings: Settings,
  lightbulb: Lightbulb,
  rocket: Rocket,
  star: Star,
  heart: Heart,
  graduation: GraduationCap,
  camera: Camera,
  coffee: Coffee,
  globe: Globe,
  mail: Mail,
  phone: Phone,
}

interface IconSelectorProps {
  currentIcon?: {
    type: 'library' | 'upload'
    value: string
  }
  onIconSelect: (icon: { type: 'library' | 'upload'; value: string }) => void
  className?: string
}

export function IconSelector({ currentIcon, onIconSelect, className }: IconSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB")
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
        onIconSelect({ type: 'upload', value: base64String })
        setIsUploading(false)
      }
      reader.onerror = () => {
        setIsUploading(false)
        alert("Error reading file")
      }
      reader.readAsDataURL(file)
    }
  }

  const renderCurrentIcon = () => {
    if (!currentIcon) {
      return <Briefcase className="h-6 w-6" />
    }

    if (currentIcon.type === 'upload') {
      return (
        <img 
          src={currentIcon.value} 
          alt="Custom icon" 
          className="h-6 w-6 object-cover rounded"
        />
      )
    }

    const IconComponent = ICON_LIBRARY[currentIcon.value as keyof typeof ICON_LIBRARY] || Briefcase
    return <IconComponent className="h-6 w-6" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`p-0 h-auto hover:bg-transparent relative group ${className}`}
        >
          {renderCurrentIcon()}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
            <Edit className="h-3 w-3 text-white" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-64">
        <div className="p-2">
          <p className="text-sm font-medium mb-2">Choose Icon</p>
          
          {/* Icon Library Grid */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {Object.entries(ICON_LIBRARY).map(([key, IconComponent]) => (
              <Button
                key={key}
                variant="ghost"
                size="sm"
                className={`p-2 h-10 w-10 ${
                  currentIcon?.type === 'library' && currentIcon?.value === key 
                    ? 'bg-blue-100 border-blue-300' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => onIconSelect({ type: 'library', value: key })}
                title={key}
              >
                <IconComponent className="h-5 w-5" />
              </Button>
            ))}
          </div>
          
          <DropdownMenuSeparator />
          
          {/* Upload Custom Image */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Custom Image'}
          </Button>
          
          {currentIcon?.type === 'upload' && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
              Custom image selected
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}