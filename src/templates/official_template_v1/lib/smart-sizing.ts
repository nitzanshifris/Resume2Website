/**
 * SmartCard Universal Sizing System
 * Quantity-based smart sizing logic for different section types
 */

export type CardSize = 'large' | 'medium' | 'small' | 'mini' | 'micro'
export type SectionTier = 'showcase' | 'professional' | 'supporting' | 'reference'
export type LayoutType = 'horizontal-carousel' | 'vertical-stack' | 'special-layout'

export interface SectionLayoutConfig {
  layoutType: LayoutType
  autoSizing: boolean  // Only for horizontal layouts
  manualSize?: CardSize  // When autoSizing false
  shape: 'very-tall' | 'tall' | 'square' | 'wide' | 'very-wide'
  height?: 'compact' | 'standard' | 'tall'  // Only for vertical layouts
}

/**
 * Get the appropriate card size based on item count, section importance, and shape constraints
 * 
 * @param itemCount Number of items in the section
 * @param sectionTier Importance tier of the section
 * @param shape Card shape that affects maximum allowed size
 * @returns Recommended card size
 */
export const getSmartSize = (
  itemCount: number, 
  sectionTier: SectionTier,
  shape: string
): CardSize => {
  // First get base size from tier and count
  let baseSize: CardSize
  switch (sectionTier) {
    case 'showcase': // Projects
      if (itemCount <= 8) baseSize = 'large'
      else if (itemCount <= 15) baseSize = 'medium'
      else baseSize = 'small'
      break
      
    case 'professional': // Achievements, Certifications, Publications, Speaking, Testimonials
      if (itemCount <= 12) baseSize = 'medium'
      else if (itemCount <= 20) baseSize = 'small'
      else baseSize = 'mini'
      break
      
    case 'supporting': // Volunteer, Hobbies, Courses
      if (itemCount <= 8) baseSize = 'medium'
      else if (itemCount <= 16) baseSize = 'small'
      else baseSize = 'mini'
      break
      
    case 'reference': // Memberships
      if (itemCount <= 10) baseSize = 'small'
      else baseSize = 'mini'
      break
  }
  
  // Apply shape constraints based on visual limits
  return applyShapeConstraints(baseSize, shape, itemCount)
}

/**
 * Apply shape-based size constraints based on visual limits and item count
 * 
 * @param baseSize The size suggested by section tier and item count
 * @param shape The card shape
 * @param itemCount Number of items (affects multi-card layouts)
 * @returns Size that respects visual constraints
 */
const applyShapeConstraints = (baseSize: CardSize, shape: string, itemCount: number): CardSize => {
  const sizeOrder: CardSize[] = ['large', 'medium', 'small', 'mini', 'micro']
  
  // Apply FINAL matrix: Real estate + visual dominance based constraints
  let maxAllowedSize: CardSize
  
  switch (shape) {
    case 'very-wide':
    case 'wide':
      // High/Medium horizontal space usage - can be large when alone
      if (itemCount === 1) maxAllowedSize = 'large'
      else if (itemCount === 2) maxAllowedSize = 'medium'
      else if (itemCount <= 4) maxAllowedSize = 'small'
      else maxAllowedSize = 'mini' // 5+ cards
      break
      
    case 'square':
      // Balanced reference shape
      if (itemCount === 1) maxAllowedSize = 'medium'
      else if (itemCount === 2) maxAllowedSize = 'medium'
      else if (itemCount <= 4) maxAllowedSize = 'small'
      else maxAllowedSize = 'mini' // 5+ cards
      break
      
    case 'tall':
    case 'very-tall':
      // High vertical space usage - visual dominance limits size
      if (itemCount <= 4) maxAllowedSize = 'small'
      else maxAllowedSize = 'mini' // 5+ cards
      break
      
    default:
      // Unknown shapes default to balanced behavior
      maxAllowedSize = 'medium'
      break
  }
  
  // Return the smaller of baseSize or maxAllowedSize
  const baseIndex = sizeOrder.indexOf(baseSize)
  const maxIndex = sizeOrder.indexOf(maxAllowedSize)
  
  // If baseSize is larger (smaller index) than allowed, use the max allowed
  return baseIndex < maxIndex ? maxAllowedSize : baseSize
}

/**
 * Determine the section tier based on section key
 * 
 * @param sectionKey The section identifier
 * @returns Section tier classification
 */
export const getSectionTier = (sectionKey: string): SectionTier => {
  if (['projects', 'projects_experimental', 'projects_experimental_beta2'].includes(sectionKey)) {
    return 'showcase'
  }
  if (['achievements', 'certifications', 'publications', 'speakingEngagements', 'testimonials'].includes(sectionKey)) {
    return 'professional'
  }
  if (['volunteer', 'hobbies', 'courses'].includes(sectionKey)) {
    return 'supporting'
  }
  return 'reference' // memberships and others
}

/**
 * Determine the layout type based on section key
 * 
 * @param sectionKey The section identifier
 * @returns Layout type classification
 */
export const getLayoutType = (sectionKey: string): LayoutType => {
  const horizontalSections = [
    'projects', 
    'projects_experimental',
    'projects_experimental_beta2',
    'achievements', 
    'certifications', 
    'volunteer', 
    'hobbies', 
    'courses', 
    'publications', 
    'speakingEngagements', 
    'memberships', 
    'testimonials',
    'education' // Education V2 Timeline should have same layout settings as horizontal sections
  ]
  
  const verticalSections = ['experience']
  
  if (horizontalSections.includes(sectionKey)) {
    return 'horizontal-carousel'
  }
  if (verticalSections.includes(sectionKey)) {
    return 'vertical-stack'
  }
  return 'special-layout'
}

/**
 * Get CSS classes for a specific size
 * 
 * @param size The card size
 * @returns CSS class name
 */
export const getSizeClassName = (size: CardSize): string => {
  return `smartcard-${size}`
}

/**
 * Get CSS classes for a specific shape
 * 
 * @param shape The card shape
 * @returns CSS class name
 */
export const getShapeClassName = (shape: string): string => {
  return `smartcard-shape-${shape}`
}

/**
 * Get CSS classes for vertical height
 * 
 * @param height The card height
 * @returns CSS class name
 */
export const getHeightClassName = (height: string): string => {
  return `smartcard-height-${height}`
}

/**
 * Generate complete CSS classes for a card based on configuration
 * 
 * @param config The section layout configuration
 * @param itemCount Number of items (for auto-sizing)
 * @param sectionKey Section identifier (for tier determination)
 * @returns Object with CSS classes and size info
 */
export const generateCardClasses = (
  config: SectionLayoutConfig,
  itemCount: number,
  sectionKey: string
) => {
  const classes: string[] = []
  let appliedSize: CardSize
  
  if (config.layoutType === 'horizontal-carousel') {
    // Determine size
    if (config.autoSizing) {
      const tier = getSectionTier(sectionKey)
      appliedSize = getSmartSize(itemCount, tier, config.shape)
      classes.push('smartcard-auto-sizing')
    } else {
      appliedSize = config.manualSize || 'medium'
      classes.push('smartcard-manual-sizing')
    }
    
    classes.push(getSizeClassName(appliedSize))
    classes.push(getShapeClassName(config.shape))
    
  } else if (config.layoutType === 'vertical-stack') {
    // Vertical layouts use height classes
    const height = config.height || 'standard'
    classes.push(getHeightClassName(height))
    
    // Only certain shapes make sense for vertical layouts
    const allowedShapes = ['square', 'wide', 'very-wide']
    if (allowedShapes.includes(config.shape)) {
      classes.push(getShapeClassName(config.shape))
    }
    
    appliedSize = 'medium' // Not really applicable for vertical
  } else {
    // Special layouts don't use sizing classes
    appliedSize = 'medium'
  }
  
  // Add transition classes for smooth changes
  classes.push('smartcard-transition')
  
  return {
    classes: classes.join(' '),
    appliedSize,
    isAutoSized: config.autoSizing && config.layoutType === 'horizontal-carousel'
  }
}

/**
 * Get default layout configuration for a section
 * 
 * @param sectionKey Section identifier
 * @returns Default configuration
 */
export const getDefaultLayoutConfig = (sectionKey: string): SectionLayoutConfig => {
  const layoutType = getLayoutType(sectionKey)
  
  return {
    layoutType,
    autoSizing: layoutType === 'horizontal-carousel', // Auto-size by default for horizontal layouts
    manualSize: 'medium',
    shape: 'wide', // Default to current wide shape (5:3)
    height: 'standard' // Default height for vertical layouts
  }
}

/**
 * Calculate the number of visible cards based on size and screen width
 * 
 * @param size Card size
 * @param screenWidth Screen width in pixels
 * @returns Number of visible cards
 */
export const getVisibleCardCount = (size: CardSize, screenWidth: number): number => {
  // Mobile (< 768px): Always 1 card visible
  if (screenWidth < 768) return 1
  
  // Tablet (768px - 1024px)
  if (screenWidth < 1024) {
    switch (size) {
      case 'large': return 1.7 // basis-3/5 = ~60%
      case 'medium': return 2   // basis-1/2 = 50%
      case 'small': return 3    // basis-1/3 = 33%
      case 'mini': return 4     // basis-1/4 = 25%
    }
  }
  
  // Desktop (>= 1024px)
  switch (size) {
    case 'large': return 2.5   // basis-2/5 = 40%
    case 'medium': return 3    // basis-1/3 = 33%
    case 'small': return 4     // basis-1/4 = 25%
    case 'mini': return 5      // basis-1/5 = 20%
  }
  
  return 3 // fallback
}

/**
 * Get human-readable description of card configuration
 * 
 * @param config Layout configuration
 * @param itemCount Number of items
 * @param sectionKey Section identifier
 * @returns Description object
 */
export const getConfigDescription = (
  config: SectionLayoutConfig,
  itemCount: number,
  sectionKey: string
) => {
  const { appliedSize, isAutoSized } = generateCardClasses(config, itemCount, sectionKey)
  
  if (config.layoutType === 'horizontal-carousel') {
    const visibleCount = getVisibleCardCount(appliedSize, 1024) // Use desktop count
    return {
      layout: 'Horizontal Carousel',
      sizing: isAutoSized ? `Auto (${appliedSize})` : `Manual (${appliedSize})`,
      visible: `${Math.floor(visibleCount)} cards visible`,
      shape: config.shape.replace('-', ' '),
      recommendation: isAutoSized ? `Based on ${itemCount} items` : 'User selected'
    }
  } else if (config.layoutType === 'vertical-stack') {
    const height = config.height || 'standard'
    return {
      layout: 'Vertical Stack',
      sizing: `${height} height`,
      visible: 'Full width, unlimited growth',
      shape: config.shape.replace('-', ' '),
      recommendation: 'Optimized for detailed content'
    }
  } else {
    return {
      layout: 'Custom Layout',
      sizing: 'Section-specific',
      visible: 'Layout optimized',
      shape: 'N/A',
      recommendation: 'Specialized for this content type'
    }
  }
}