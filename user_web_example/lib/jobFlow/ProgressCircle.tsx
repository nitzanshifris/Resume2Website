/**
 * Progress Circle Component
 * Consistent progress display using mapSemanticToVisual
 */

import React from 'react'
import { mapSemanticToVisual, PROGRESS_CONFIG } from './index'

interface ProgressCircleProps {
  semanticProgress: number // 0-60 semantic scale
  className?: string
  size?: number // Circle diameter in pixels
  strokeWidth?: number
}

/**
 * Unified Progress Circle Component
 * ALWAYS uses mapSemanticToVisual for ALL visual elements
 */
export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  semanticProgress,
  className = '',
  size = 120,
  strokeWidth = 8
}) => {
  // SINGLE source of truth for visual progress
  const visualProgress = mapSemanticToVisual(semanticProgress)
  
  // Calculate circle dimensions
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  
  // Calculate stroke offset for progress
  // Progress goes from bottom (0%) to top (100%) clockwise
  const strokeDashoffset = circumference - (visualProgress / 100) * circumference
  
  // Position for progress indicator dot (optional)
  // Angle in radians (starting from bottom, going clockwise)
  const angle = (visualProgress / 100) * 2 * Math.PI - Math.PI / 2
  const dotX = size / 2 + radius * Math.cos(angle)
  const dotY = size / 2 + radius * Math.sin(angle)
  
  // Determine if clickable (semantic 60 = visual 80)
  const isClickable = semanticProgress >= PROGRESS_CONFIG.SEMANTIC_READY
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* SVG Circle */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90" // Start from top
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`
            transition-all duration-500 ease-out
            ${isClickable ? 'text-green-500' : 'text-blue-500'}
          `}
        />
        
        {/* Optional progress dot at current position */}
        {visualProgress > 0 && (
          <circle
            cx={dotX}
            cy={dotY}
            r={4}
            fill="currentColor"
            className={`
              transition-all duration-500 ease-out
              ${isClickable ? 'text-green-500' : 'text-blue-500'}
            `}
          />
        )}
      </svg>
      
      {/* Center label - USES SAME visualProgress */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`
            text-2xl font-bold
            ${isClickable ? 'text-green-500' : 'text-gray-700'}
          `}>
            {visualProgress}%
          </div>
          {isClickable && (
            <div className="text-xs text-green-500 mt-1">
              Ready
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Vertical Progress Bar with Beautiful Glassmorphism Design
 * Preserves the exact design from the original but with correct 80% completion logic from the start
 */
export const ProgressBarVertical: React.FC<{
  semanticProgress: number
  className?: string
  isClickable?: boolean
  onCircleClick?: () => void
  onProgressChange?: (percentage: number) => void
}> = ({
  semanticProgress,
  className = '',
  isClickable = false,
  onCircleClick,
  onProgressChange
}) => {
  // Use the centralized mapping - 60 semantic = 80 visual (READY)
  const visualProgress = mapSemanticToVisual(semanticProgress)
  const isReady = semanticProgress >= PROGRESS_CONFIG.SEMANTIC_READY
  
  // Notify parent of progress changes
  React.useEffect(() => {
    onProgressChange?.(visualProgress)
  }, [visualProgress, onProgressChange])
  
  return (
    <div className={`relative flex items-center justify-center h-full ${className}`}>
      {/* Ambient glow effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/30 via-sky-400/30 to-blue-600/30 blur-3xl rounded-full animate-pulse" />
      </div>
      
      {/* Glass container with centered elements */}
      <div className="relative w-20 h-96">
        {/* Progress Track - Narrower, centered within container */}
        <div className="absolute left-1/2 -translate-x-1/2 w-12 h-full rounded-full overflow-hidden">
          {/* Glass background */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full" />
          
          {/* Inner shadow for depth */}
          <div className="absolute inset-[2px] bg-black/10 rounded-full" />
          
          {/* Progress Fill - uses correct visual progress */}
          <div
            className="absolute bottom-0 left-0 right-0 rounded-full overflow-hidden transition-all duration-300 ease-out"
            style={{ height: `${visualProgress}%` }}
          >
            {/* Gradient fill */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500 via-sky-400 to-blue-600">
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-shine" />
            </div>
          </div>
          
          {/* Subtle milestone marks at 20%, 40%, 60% visual */}
          {[20, 40, 60].map((milestone) => (
            <div
              key={milestone}
              className="absolute left-1 right-1 h-[1px] bg-white/20"
              style={{ bottom: `${milestone}%` }}
            />
          ))}
        </div>
        
        {/* Traveling Percentage Button - centered on same axis as bar */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-20 h-20 z-30 transition-all duration-300 ease-out"
          style={{ 
            bottom: `calc(${visualProgress}% - 40px)` // Center the 80px button at progress level
          }}
        >
          {/* Glow effect behind button */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 blur-xl opacity-70" />
          
          {/* Glass button */}
          <div 
            className={`relative w-full h-full rounded-full bg-white/30 backdrop-blur-lg border-2 border-white/40 shadow-2xl flex items-center justify-center ${
              isClickable && isReady ? 'cursor-pointer hover:scale-110 transition-transform' : ''
            }`}
            onClick={() => {
              if (isClickable && isReady && onCircleClick) {
                onCircleClick()
              }
            }}
          >
            {/* Inner glass layer */}
            <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-white/30 to-white/10" />
            
            {/* Percentage text - shows visual progress */}
            <span className="relative z-10 text-2xl font-bold text-white drop-shadow-lg">
              {visualProgress}%
            </span>
            
            {/* Click indicator when ready (80%) */}
            {isClickable && isReady && (
              <div className="absolute inset-0 rounded-full border-2 border-white animate-ping-slow" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Horizontal Progress Bar
 * Consistent with vertical, just different orientation
 */
export const ProgressBarHorizontal: React.FC<{
  semanticProgress: number
  className?: string
  height?: number
}> = ({
  semanticProgress,
  className = '',
  height = 8
}) => {
  const visualProgress = mapSemanticToVisual(semanticProgress)
  const isReady = semanticProgress >= PROGRESS_CONFIG.SEMANTIC_READY
  
  return (
    <div className={`w-full ${className}`}>
      {/* Progress bar container */}
      <div 
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          className={`
            h-full transition-all duration-500 ease-out
            ${isReady ? 'bg-green-500' : 'bg-blue-500'}
          `}
          style={{ 
            width: `${visualProgress}%` // USES visualProgress
          }}
        />
      </div>
      
      {/* Label below */}
      <div className="mt-2 text-center">
        <span className={`
          text-sm font-semibold
          ${isReady ? 'text-green-500' : 'text-gray-600'}
        `}>
          {visualProgress}% {isReady && '- Ready!'}
        </span>
      </div>
    </div>
  )
}

/**
 * Usage Example:
 * 
 * import { ProgressCircle } from './lib/jobFlow/ProgressCircle'
 * import { useJobFlow } from './lib/jobFlow'
 * 
 * function MyComponent() {
 *   const { context } = useJobFlow()
 *   
 *   // Calculate semantic progress based on state
 *   const semanticProgress = getSemanticProgressForState(context.state)
 *   
 *   return (
 *     <ProgressCircle 
 *       semanticProgress={semanticProgress}
 *       size={120}
 *       strokeWidth={8}
 *     />
 *   )
 * }
 * 
 * CRITICAL: 
 * - ALWAYS pass semantic progress (0-60 scale)
 * - Component handles ALL visual mapping internally
 * - Visual 80% = Semantic 60% (READY state)
 */