import React from 'react'
import { 
  Briefcase, Building2, Code, Palette, Users, Target, TrendingUp, Award, Settings, 
  Lightbulb, Rocket, Star, Heart, GraduationCap, Camera, Coffee, Globe, Mail, Phone,
  Quote
} from 'lucide-react'
import { contentIconMap } from '@/lib/data'

// Icon library that matches the one in IconSelector
export const ICON_LIBRARY = {
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
  quote: Quote,
} as const

export type IconName = keyof typeof ICON_LIBRARY

export interface CustomIcon {
  type: 'library' | 'upload'
  value: string
  scale?: number // Scale factor for uploaded images (0.5 to 2.0)
  fit?: 'cover' | 'contain' | 'fill' // How the image should fit in the container
}

/**
 * Renders an icon based on the icon configuration
 * Supports legacy string format, new custom icon format, and fallback to content icon map
 */
export function renderIcon(
  icon: CustomIcon | string | undefined, 
  className: string = "h-6 w-6",
  fallbackIcon?: string
): React.ReactNode {
  // Ensure we always return consistent JSX structure
  // Handle new custom icon format
  if (icon && typeof icon === 'object' && 'type' in icon) {
    if (icon.type === 'upload') {
      // Render uploaded image directly without extra container - default to maximum scale
      const scale = icon.scale !== undefined ? icon.scale : 2
      const fit = icon.fit || 'cover'
      const objectFitClass = fit === 'cover' ? 'object-cover' : fit === 'contain' ? 'object-contain' : 'object-fill'
      
      return (
        <img
          src={icon.value}
          alt="Custom icon"
          className={`${className} ${objectFitClass} rounded-md`}
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'center'
          }}
        />
      )
    } else if (icon.type === 'library') {
      // Render from library
      const IconComponent = ICON_LIBRARY[icon.value as IconName]
      if (IconComponent) {
        return <IconComponent className={className} />
      }
    }
  }
  
  // Handle legacy string format
  if (typeof icon === 'string') {
    // First try the new icon library
    const IconComponent = ICON_LIBRARY[icon as IconName]
    if (IconComponent) {
      return <IconComponent className={className} />
    }
    
    // Fallback to content icon map
    if (contentIconMap[icon]) {
      return React.cloneElement(contentIconMap[icon] as React.ReactElement, { className } as any)
    }
  }
  
  // Use fallback icon if provided
  if (fallbackIcon) {
    const FallbackIcon = ICON_LIBRARY[fallbackIcon as IconName]
    if (FallbackIcon) {
      return <FallbackIcon className={className} />
    }
  }
  
  // Final fallback to briefcase icon
  return <Briefcase className={className} />
}

/**
 * Converts legacy icon format to new custom icon format
 */
export function convertLegacyIcon(icon: string | CustomIcon | undefined): CustomIcon | undefined {
  if (!icon) return undefined
  
  if (typeof icon === 'object') {
    return icon // Already in new format
  }
  
  // Convert string to library format
  return {
    type: 'library',
    value: icon
  }
}