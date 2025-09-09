/**
 * Progress Helper Functions
 * Maps flow states to semantic progress values
 */

import { FlowState, PROGRESS_CONFIG } from './types'

/**
 * Get semantic progress for a given flow state
 * Returns 0-60 scale (semantic scale)
 */
export const getSemanticProgressForState = (state: FlowState): number => {
  switch (state) {
    case FlowState.Idle:
      return 0
    
    case FlowState.Validating:
      return 5 // Starting
    
    case FlowState.Previewing:
      return 0 // Keep at 0% during preview (before auth)
    
    case FlowState.WaitingAuth:
      return 0 // Keep at 0% while waiting for auth
    
    case FlowState.Claiming:
      return 20 // Claiming job
    
    case FlowState.Extracting:
      return 30 // Extracting CV data
    
    case FlowState.Generating:
      return 45 // Generating portfolio
    
    case FlowState.Completed:
      return PROGRESS_CONFIG.SEMANTIC_READY // 60 = READY
    
    case FlowState.Failed:
      return 0 // Reset on failure
    
    default:
      return 0
  }
}

/**
 * Get progress for animation/transition states
 * Can be used for smooth transitions between states
 */
export const getTransitionProgress = (
  fromState: FlowState,
  toState: FlowState,
  transitionPercent: number // 0-100
): number => {
  const fromProgress = getSemanticProgressForState(fromState)
  const toProgress = getSemanticProgressForState(toState)
  
  // Linear interpolation
  return fromProgress + (toProgress - fromProgress) * (transitionPercent / 100)
}

/**
 * Determine if portfolio is ready for interaction
 * Based on semantic progress threshold
 */
export const isPortfolioReady = (semanticProgress: number): boolean => {
  return semanticProgress >= PROGRESS_CONFIG.SEMANTIC_READY
}

/**
 * Get progress color based on semantic progress
 */
export const getProgressColor = (semanticProgress: number): string => {
  if (semanticProgress >= PROGRESS_CONFIG.SEMANTIC_READY) {
    return 'green' // Ready
  } else if (semanticProgress >= 30) {
    return 'blue' // Processing
  } else if (semanticProgress > 0) {
    return 'gray' // Starting
  }
  return 'transparent'
}

/**
 * Format progress for display
 * Always uses visual scale for UI
 */
export const formatProgressDisplay = (semanticProgress: number): string => {
  const visual = Math.round((semanticProgress / PROGRESS_CONFIG.SEMANTIC_READY) * PROGRESS_CONFIG.VISUAL_READY)
  return `${visual}%`
}

/**
 * Calculate ETA based on current progress
 * Returns estimated seconds remaining
 */
export const estimateTimeRemaining = (
  semanticProgress: number,
  elapsedSeconds: number
): number | null => {
  if (semanticProgress <= 0 || semanticProgress >= PROGRESS_CONFIG.SEMANTIC_READY) {
    return null
  }
  
  const progressRate = semanticProgress / elapsedSeconds // progress per second
  const remainingProgress = PROGRESS_CONFIG.SEMANTIC_READY - semanticProgress
  
  return Math.round(remainingProgress / progressRate)
}

/**
 * Example Usage in Component:
 * 
 * const MyComponent = () => {
 *   const { context } = useJobFlow()
 *   const semanticProgress = getSemanticProgressForState(context.state)
 *   const visualProgress = mapSemanticToVisual(semanticProgress)
 *   
 *   return (
 *     <div>
 *       <ProgressCircle semanticProgress={semanticProgress} />
 *       <p>Progress: {visualProgress}%</p>
 *       {isPortfolioReady(semanticProgress) && <button>View Portfolio</button>}
 *     </div>
 *   )
 * }
 */