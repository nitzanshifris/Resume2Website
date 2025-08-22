"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LayoutGrid } from "lucide-react"
import type { SectionLayoutConfig } from "@/lib/smart-sizing"

interface SectionLayoutSettingsProps {
  sectionKey: string
  sectionTitle: string
  currentConfig: SectionLayoutConfig
  itemCount: number
  onConfigChange: (config: SectionLayoutConfig) => void
  children?: React.ReactNode
}

const getAvailableLayoutTypes = (sectionKey: string): ('horizontal-carousel' | 'vertical-stack' | 'special-layout')[] => {
  const smartCardSections = [
    'projects', 'achievements', 'certifications', 
    'volunteer', 'hobbies', 'courses', 'publications', 'speakingEngagements', 
    'memberships', 'testimonials', 'education'
  ]
  const verticalSections = ['experience']
  const specialSections = ['summary', 'skills', 'languages', 'hero', 'contact']
  
  if (smartCardSections.includes(sectionKey)) return ['horizontal-carousel']
  if (verticalSections.includes(sectionKey)) return ['vertical-stack']
  return ['special-layout']
}

const getDefaultLayoutType = (sectionKey: string): 'horizontal-carousel' | 'vertical-stack' | 'special-layout' => {
  const availableTypes = getAvailableLayoutTypes(sectionKey)
  return availableTypes[0] // Return first available type as default
}

const getSmartSize = (
  itemCount: number, 
  sectionTier: 'showcase' | 'professional' | 'supporting' | 'reference',
  sectionKey?: string
): 'large' | 'medium' | 'small' | 'mini' | 'micro' => {
  // Timeline sections ignore item count - always default to medium
  if (sectionKey === 'education') {
    return 'medium'
  }
  
  switch (sectionTier) {
    case 'showcase': // Projects
      if (itemCount <= 8) return 'large'
      if (itemCount <= 15) return 'medium'
      return 'small'
      
    case 'professional': // Achievements, Certifications, etc.
      if (itemCount <= 12) return 'medium'
      if (itemCount <= 20) return 'small'
      return 'mini'
      
    case 'supporting': // Volunteer, Hobbies, Courses
      if (itemCount <= 8) return 'medium'
      if (itemCount <= 16) return 'small'
      return 'mini'
      
    case 'reference': // Memberships
      if (itemCount <= 10) return 'small'
      return 'mini'
  }
}

const getSectionTier = (sectionKey: string): 'showcase' | 'professional' | 'supporting' | 'reference' => {
  if (['projects'].includes(sectionKey)) return 'showcase'
  if (['achievements', 'certifications', 'publications', 'speakingEngagements', 'testimonials'].includes(sectionKey)) return 'professional'
  if (['volunteer', 'hobbies', 'courses'].includes(sectionKey)) return 'supporting'
  return 'reference'
}

// Hook to track screen size with manual mobile simulation
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [mobileSimulation, setMobileSimulation] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || mobileSimulation)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Add global mobile simulation toggle for testing
    ;(window as any).toggleMobileSimulation = () => {
      setMobileSimulation(prev => {
        console.log('Mobile simulation toggled:', !prev)
        return !prev
      })
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      delete (window as any).toggleMobileSimulation
    }
  }, [mobileSimulation])
  
  return isMobile
}

// Smart size constraints based on shape, quantity, and screen size
const getSmartConstraints = (shape: string, itemCount: number, isMobile: boolean, sectionKey?: string, isManualMode: boolean = false): string[] => {
  
  // Block inappropriate shapes for timeline sections
  if (sectionKey === 'education') {
    // Timeline sections only allow: wide, very-wide (content-optimized shapes)
    const allowedTimelineShapes = ['wide', 'very-wide']
    if (!allowedTimelineShapes.includes(shape)) {
      return [] // Return empty array to disable non-timeline shapes
    }
  }
  
  // Mobile-first: enforce smaller sizes for tall shapes to prevent viewport overflow
  if (isMobile) {
    let mobileSizes: string[]
    
    switch (shape) {
      case 'very-tall':
      case 'tall':
      case 'square':
        mobileSizes = ['mini'] // Force mini on mobile for other tall shapes
        break
      
      case 'wide':
        mobileSizes = itemCount <= 2 ? ['small', 'mini'] : ['mini']
        break
      
      case 'very-wide':
        mobileSizes = itemCount <= 2 ? ['medium', 'small', 'mini'] : ['small', 'mini']
        break
      
      default:
        mobileSizes = ['small', 'mini']
    }
    
    // Filter mobile sizes for timeline sections - only allow small and medium
    if (sectionKey === 'education') {
      mobileSizes = mobileSizes.filter(size => size === 'small' || size === 'medium')
      // If no valid sizes after filtering, default to small
      if (mobileSizes.length === 0) {
        mobileSizes = ['small']
      }
    }
    
    return mobileSizes
  }
  
  // Desktop: Apply constraints based on mode
  let allowedSizes: string[]
  
  if (isManualMode) {
    // Manual mode: Allow more user choice, only block truly problematic combinations
    switch (shape) {
      case 'very-wide':
      case 'wide':
        // Allow all reasonable sizes in manual mode
        allowedSizes = ['large', 'medium', 'small', 'mini']
        break
        
      case 'square':
        // Allow all reasonable sizes in manual mode  
        allowedSizes = ['medium', 'small', 'mini']
        break
        
      case 'tall':
      case 'very-tall':
        // Allow small and mini - user can choose if they want mini for 3 cards
        allowedSizes = ['small', 'mini']
        break
      
      default:
        allowedSizes = ['medium', 'small', 'mini']
    }
  } else {
    // Auto mode: Apply optimal constraints from final matrix
    switch (shape) {
    case 'very-wide':
    case 'wide':
      // FINAL MATRIX: High/Medium horizontal space usage
      if (itemCount === 1) allowedSizes = ['large', 'medium', 'small', 'mini']
      else if (itemCount === 2) allowedSizes = ['medium', 'small', 'mini']
      else if (itemCount <= 4) allowedSizes = ['small', 'mini']
      else allowedSizes = ['mini'] // 5+ cards
      break
      
    case 'square':
      // FINAL MATRIX: Balanced reference shape  
      if (itemCount === 1) allowedSizes = ['medium', 'small', 'mini']
      else if (itemCount === 2) allowedSizes = ['medium', 'small', 'mini']
      else if (itemCount <= 4) allowedSizes = ['small', 'mini']
      else allowedSizes = ['mini'] // 5+ cards
      break
      
    case 'tall':
    case 'very-tall':
      // FINAL MATRIX: High vertical space usage - visual dominance limits
      if (itemCount <= 4) allowedSizes = ['small', 'mini']
      else allowedSizes = ['mini'] // 5+ cards
      break
    
    default:
      // Unknown shapes default to balanced behavior
      allowedSizes = ['medium', 'small', 'mini']
    }
  }
  
  // Filter sizes for timeline sections - only allow small and medium
  if (sectionKey === 'education') {
    allowedSizes = allowedSizes.filter(size => size === 'small' || size === 'medium')
  }
  
  return allowedSizes
}

const HorizontalLayoutControls: React.FC<{
  config: SectionLayoutConfig
  sectionKey: string
  itemCount: number
  onConfigChange: (config: SectionLayoutConfig) => void
}> = ({ config, sectionKey, itemCount, onConfigChange }) => {
  const sectionTier = getSectionTier(sectionKey)
  const recommendedSize = getSmartSize(itemCount, sectionTier, config.shape)
  const isMobile = useIsMobile()
  const allowedSizes = getSmartConstraints(config.shape, itemCount, isMobile, sectionKey, !config.autoSizing)
  
  // Debug: Log current config when component renders
  console.log('Current layout config:', {
    sectionKey,
    config,
    isMobile,
    allowedSizes,
    recommendedSize
  })
  
  return (
    <TooltipProvider>
      <div className="space-y-3">
        {/* Shape Selection - First Priority */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Card Shape</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'very-tall', label: 'V.Tall', aspectRatio: '9/16', width: 'w-3', height: 'h-5' },
                { value: 'tall', label: 'Tall', aspectRatio: '11/16', width: 'w-4', height: 'h-5' },
                { value: 'square', label: 'Square', aspectRatio: '1/1', width: 'w-4', height: 'h-4' },
                { value: 'wide', label: 'Wide', aspectRatio: '16/11', width: 'w-5', height: 'h-3' },
                { value: 'very-wide', label: 'V.Wide', aspectRatio: '21/9', width: 'w-8', height: 'h-3' }
              ].map((shape) => {
                const isSelected = config.shape === shape.value
                const isBlocked = getSmartConstraints(shape.value, itemCount, isMobile, sectionKey, !config.autoSizing).length === 0
                return (
                  <Button
                    key={shape.value}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`h-12 flex flex-col items-center justify-center gap-1 p-2 ${isBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isBlocked}
                    onClick={() => {
                      if (isBlocked) return
                      
                      // When changing shape, check if current size is still valid
                      const newAllowedSizes = getSmartConstraints(shape.value, itemCount, isMobile, sectionKey, !config.autoSizing)
                      const currentSize = config.autoSizing ? recommendedSize : (config.manualSize || 'medium')
                      const needsSizeChange = !newAllowedSizes.includes(currentSize)
                      
                      // Debug: Log the transition details
                      console.log('Shape change debug:', {
                        newShape: shape.value,
                        isMobile,
                        itemCount,
                        newAllowedSizes,
                        currentSize,
                        needsSizeChange
                      })
                      
                      // Find the best fallback size: first try to find closest, otherwise use first allowed
                      let fallbackSize = newAllowedSizes[0] // Default to first allowed
                      
                      if (needsSizeChange) {
                        // Try to find the closest allowed size
                        const sizeOrder = ['large', 'medium', 'small', 'mini', 'micro']
                        const currentIndex = sizeOrder.indexOf(currentSize)
                        
                        if (currentIndex !== -1) {
                          // Look for closest allowed size
                          for (let i = currentIndex; i < sizeOrder.length; i++) {
                            if (newAllowedSizes.includes(sizeOrder[i])) {
                              fallbackSize = sizeOrder[i]
                              break
                            }
                          }
                          // If no smaller size found, look for larger ones
                          if (!newAllowedSizes.includes(fallbackSize)) {
                            for (let i = currentIndex - 1; i >= 0; i--) {
                              if (newAllowedSizes.includes(sizeOrder[i])) {
                                fallbackSize = sizeOrder[i]
                                break
                              }
                            }
                          }
                        }
                      }
                      
                      const newConfig = { 
                        ...config, 
                        shape: shape.value as 'very-tall' | 'tall' | 'square' | 'wide' | 'very-wide',
                        // Always set manual size when changing shape to ensure it takes effect
                        manualSize: needsSizeChange ? fallbackSize as 'large' | 'medium' | 'small' | 'mini' | 'micro' : (config.manualSize || currentSize as 'large' | 'medium' | 'small' | 'mini' | 'micro'),
                        autoSizing: false // Always switch to manual mode when changing shape to ensure size change is visible
                      }
                      
                      console.log('Saving new config:', newConfig)
                      onConfigChange(newConfig)
                    }}
                  >
                    <div className={`${shape.width} ${shape.height} bg-current opacity-30 rounded-sm`}></div>
                    <span className="text-xs leading-none">{shape.label}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Card Size - Hide for education timeline (content-optimized shapes only) */}
        {sectionKey !== 'education' && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Card Size</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {config.autoSizing ? 'Auto' : 'Manual'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'large', label: 'Large (2)' },
                  { value: 'medium', label: 'Medium (3)' },
                  { value: 'small', label: 'Small (4)' },
                  { value: 'mini', label: 'Mini (5+)' },
                  { value: 'micro', label: 'Micro (6+)' }
                ].map((size) => {
                  // Calculate the actual applied size (constrained by shape)
                  const actualAppliedSize = config.autoSizing ? 
                    (allowedSizes.includes(recommendedSize) ? recommendedSize : allowedSizes[0]) : 
                    (config.manualSize || 'medium')
                  
                  const isSelected = actualAppliedSize === size.value
                  const isDisabled = !allowedSizes.includes(size.value)
                  
                  const button = (
                    <Button
                      key={size.value}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className={`h-8 relative overflow-hidden ${isDisabled ? 'opacity-50' : ''}`}
                      disabled={isDisabled}
                      onClick={() => {
                        if (!isDisabled) {
                          const isChangingFromAuto = config.autoSizing && size.value !== recommendedSize
                          const newConfig = { 
                            ...config, 
                            autoSizing: false, // Always switch to manual when clicking a size
                            manualSize: size.value as 'large' | 'medium' | 'small' | 'mini' | 'micro'
                          }
                          
                          console.log('Size button clicked:', {
                            sizeValue: size.value,
                            oldConfig: config,
                            newConfig,
                            isChangingFromAuto
                          })
                          
                          onConfigChange(newConfig)
                        }
                      }}
                    >
                      {size.label}
                      {isDisabled && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-12 h-[1px] bg-foreground/50 rotate-45 absolute"></div>
                        </div>
                      )}
                    </Button>
                  )
                  
                  if (isDisabled) {
                    return (
                      <Tooltip key={size.value}>
                        <TooltipTrigger asChild>
                          {button}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Not available for {config.shape} shape</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  }
                  
                  return button
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}

const VerticalLayoutControls: React.FC<{
  config: SectionLayoutConfig
  onConfigChange: (config: SectionLayoutConfig) => void
}> = ({ config, onConfigChange }) => {
  const allowedShapes = ['square', 'wide', 'very-wide'] as const
  
  return (
    <div className="space-y-6">
      {/* Height Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Card Height</CardTitle>
          <CardDescription>
            Affects how much vertical space each item takes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={config.height || 'standard'}
            onValueChange={(value) => 
              onConfigChange({ 
                ...config, 
                height: value as 'compact' | 'standard' | 'tall' 
              })
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="compact" />
              <Label htmlFor="compact">Compact (~120px)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard">Standard (~180px)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tall" id="tall" />
              <Label htmlFor="tall">Tall (~240px)</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Shape Selection (Limited) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Card Proportions</CardTitle>
          <CardDescription>
            Width is always full, this affects height proportions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={config.shape}
            onValueChange={(value) => 
              onConfigChange({ 
                ...config, 
                shape: value as 'square' | 'wide' | 'very-wide' 
              })
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="square" id="v-square" />
              <Label htmlFor="v-square">Square (1:1)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wide" id="v-wide" />
              <Label htmlFor="v-wide">Wide (5:3)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="very-wide" id="v-very-wide" />
              <Label htmlFor="v-very-wide">Very Wide (16:10)</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  )
}

const LayoutTypeSelector: React.FC<{
  sectionKey: string
  currentType: 'horizontal-carousel' | 'vertical-stack' | 'special-layout'
  onTypeChange: (type: 'horizontal-carousel' | 'vertical-stack' | 'special-layout') => void
}> = ({ sectionKey, currentType, onTypeChange }) => {
  const availableTypes = getAvailableLayoutTypes(sectionKey)
  
  if (availableTypes.length <= 1) return null // Don't show selector if only one option
  
  const typeLabels = {
    'horizontal-carousel': 'Carousel',
    'vertical-stack': 'Vertical Stack',
    'special-layout': 'Custom'
  }
  
  const typeDescriptions = {
    'horizontal-carousel': 'Horizontally scrolling cards',
    'vertical-stack': 'Cards stacked vertically',
    'special-layout': 'Custom section layout'
  }
  
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Layout Type</Label>
      <RadioGroup 
        value={currentType} 
        onValueChange={onTypeChange}
        className="grid grid-cols-2 gap-2"
      >
        {availableTypes.map((type) => (
          <div key={type} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent/50 cursor-pointer">
            <RadioGroupItem value={type} id={type} />
            <Label htmlFor={type} className="flex-1 cursor-pointer">
              <div className="font-medium text-sm">{typeLabels[type]}</div>
              <div className="text-xs text-muted-foreground">{typeDescriptions[type]}</div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}


const SpecialLayoutMessage: React.FC<{ sectionTitle: string }> = ({ sectionTitle }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm">Custom Layout</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        This section uses a specialized layout optimized for {sectionTitle.toLowerCase()}. 
        No card sizing options are available for this layout type.
      </p>
    </CardContent>
  </Card>
)

export const SectionLayoutSettings: React.FC<SectionLayoutSettingsProps> = ({
  sectionKey,
  sectionTitle,
  currentConfig,
  itemCount,
  onConfigChange,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const layoutType = currentConfig.layoutType || getDefaultLayoutType(sectionKey)
  const availableTypes = getAvailableLayoutTypes(sectionKey)
  
  const handleLayoutTypeChange = (newType: 'horizontal-carousel' | 'vertical-stack' | 'special-layout') => {
    const newConfig = {
      ...currentConfig,
      layoutType: newType
    }
    onConfigChange(newConfig)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button className="flex items-center gap-2 px-3 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors">
            <LayoutGrid className="h-4 w-4 mr-1" />
            Cards Layout
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4 max-h-[500px]" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <span>🔳</span>
            <h3 className="font-medium">{sectionTitle} Layout Settings</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure how cards are displayed in this section
          </p>

          <div className="mb-4">
            <Badge variant="outline" className="mb-2">
              {layoutType === 'horizontal-carousel' && 'Horizontal Carousel'}
              {layoutType === 'vertical-stack' && 'Vertical Stack'}
              {layoutType === 'special-layout' && 'Custom Layout'}
            </Badge>
            {layoutType === 'horizontal-carousel' && (
              <p className="text-sm text-muted-foreground">
                Cards arranged horizontally with responsive width controls
              </p>
            )}
            {layoutType === 'vertical-stack' && (
              <p className="text-sm text-muted-foreground">
                Width: Full width (fixed) • Cards stacked vertically
              </p>
            )}
          </div>

          {availableTypes.length > 1 && (
            <>
              <LayoutTypeSelector
                sectionKey={sectionKey}
                currentType={layoutType}
                onTypeChange={handleLayoutTypeChange}
              />
              <Separator className="my-4" />
            </>
          )}

          {layoutType === 'horizontal-carousel' && (
            <HorizontalLayoutControls
              config={currentConfig}
              sectionKey={sectionKey}
              itemCount={itemCount}
              onConfigChange={onConfigChange}
            />
          )}


          {layoutType === 'vertical-stack' && (
            <VerticalLayoutControls
              config={currentConfig}
              onConfigChange={onConfigChange}
            />
          )}

          {layoutType === 'special-layout' && (
            <SpecialLayoutMessage sectionTitle={sectionTitle} />
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default SectionLayoutSettings