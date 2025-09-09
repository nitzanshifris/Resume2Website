/**
 * Job Flow Persistence Layer
 * Handles localStorage with versioning and migration
 */

import { 
  JobFlowContext, 
  PersistedFlowState, 
  FLOW_STATE_VERSION,
  FlowState 
} from './types'
import { createInitialContext } from './reducer'

const STORAGE_KEY = 'jobFlowState'
const MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Save context to localStorage with versioning
 */
export const saveFlowState = (context: JobFlowContext): void => {
  if (typeof window === 'undefined') return
  
  try {
    const persisted: PersistedFlowState = {
      context,
      version: FLOW_STATE_VERSION,
      lastUpdatedAt: Date.now()
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
    
    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('💾 Saved flow state:', {
        state: context.state,
        jobId: context.currentJobId,
        portfolioUrl: context.portfolioUrl
      })
    }
  } catch (error) {
    console.error('Failed to save flow state:', error)
  }
}

/**
 * Load and migrate context from localStorage
 */
export const loadFlowState = (): JobFlowContext | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    
    const persisted: PersistedFlowState = JSON.parse(stored)
    
    // Check age
    if (Date.now() - persisted.lastUpdatedAt > MAX_AGE_MS) {
      console.log('🗑️ Flow state too old, clearing')
      clearFlowState()
      return null
    }
    
    // Handle version migration
    if (persisted.version !== FLOW_STATE_VERSION) {
      console.log(`🔄 Migrating flow state from v${persisted.version} to v${FLOW_STATE_VERSION}`)
      return migrateFlowState(persisted)
    }
    
    // Validate state integrity
    if (!isValidContext(persisted.context)) {
      console.warn('⚠️ Invalid flow state, clearing')
      clearFlowState()
      return null
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📂 Loaded flow state:', {
        state: persisted.context.state,
        jobId: persisted.context.currentJobId,
        portfolioUrl: persisted.context.portfolioUrl
      })
    }
    
    return persisted.context
  } catch (error) {
    console.error('Failed to load flow state:', error)
    clearFlowState()
    return null
  }
}

/**
 * Clear persisted state
 */
export const clearFlowState = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Migrate old state versions
 */
const migrateFlowState = (persisted: PersistedFlowState): JobFlowContext => {
  // For now, just reset if version mismatch
  // In future, add specific migration logic here
  console.warn('Version mismatch, resetting flow state')
  return createInitialContext()
}

/**
 * Validate context integrity
 */
const isValidContext = (context: JobFlowContext): boolean => {
  // Basic validation
  if (!context || typeof context !== 'object') return false
  if (!Object.values(FlowState).includes(context.state)) return false
  
  // State-specific validation
  switch (context.state) {
    case FlowState.Extracting:
    case FlowState.Generating:
    case FlowState.Completed:
      // These states all require a jobId
      if (!context.currentJobId) return false
      // Completed also requires portfolio URL
      if (context.state === FlowState.Completed && !context.portfolioUrl) {
        return false
      }
      break
  }
  
  return true
}

/**
 * Should we clear the currentJobId lock?
 * Only clear on Failed state (Completed keeps jobId for reference)
 */
export const shouldClearJobId = (state: FlowState): boolean => {
  // Only clear on failure - completed portfolios keep their jobId
  return state === FlowState.Failed
}

/**
 * Get recovery action based on stored state
 */
export const getRecoveryAction = (
  context: JobFlowContext, 
  isAuthenticated: boolean
): 'resume' | 'claim' | 'show' | 'reset' => {
  // If completed with portfolio, just show it
  if (context.state === FlowState.Completed && context.portfolioUrl) {
    return 'show'
  }
  
  // If failed, reset
  if (context.state === FlowState.Failed) {
    return 'reset'
  }
  
  // Anonymous user cases
  if (!isAuthenticated) {
    if (context.currentJobId && context.state === FlowState.Previewing) {
      return 'show' // Show preview, wait for auth
    }
    return 'reset'
  }
  
  // Authenticated user cases
  if (context.currentJobId) {
    switch (context.state) {
      case FlowState.WaitingAuth:
      case FlowState.Previewing:
        return 'claim' // Need to claim the anonymous job
      
      case FlowState.Claiming:
      case FlowState.Extracting:
      case FlowState.Generating:
        return 'resume' // Continue where we left off
      
      default:
        return 'reset'
    }
  }
  
  return 'reset'
}