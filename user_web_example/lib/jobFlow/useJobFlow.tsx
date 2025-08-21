/**
 * Job Flow Hook
 * Main orchestrator for the unified upload/generation flow
 */

import React, { useReducer, useEffect, useRef, useCallback, createContext, useContext } from 'react'
import { 
  JobFlowContext, 
  FlowState, 
  FlowAction,
  FlowLog,
  PROGRESS_CONFIG 
} from './types'
import { jobFlowReducer, createInitialContext } from './reducer'
import { 
  saveFlowState, 
  loadFlowState, 
  clearFlowState,
  shouldClearJobId,
  getRecoveryAction 
} from './persistence'
import * as api from './api'

// Context for global access
const JobFlowContextReact = createContext<{
  context: JobFlowContext
  dispatch: (action: any) => void
  startPreviewFlow: (file: File) => Promise<void>
  startAuthenticatedFlow: (file: File) => Promise<void>  // Added!
  startPostSignupFlow: (jobId: string) => Promise<void>
  resumeFromStorage: () => void
  finalizePortfolioReady: (url: string, id?: string) => void
  isAuthenticated: boolean
  setIsAuthenticated: (auth: boolean) => void
} | null>(null)

// Structured logging
const logFlowAction = (log: FlowLog) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔄 [${new Date(log.timestamp).toISOString()}] ${log.action}`, {
      state: log.state,
      jobId: log.jobId,
      ...log.details
    })
  }
}

// Progress mapping helper (semantic to visual)
export const mapSemanticToVisual = (semantic: number): number => {
  const { SEMANTIC_READY, VISUAL_READY, ROUND_EPSILON } = PROGRESS_CONFIG
  
  // Apply rounding epsilon to avoid 59.5 showing as 79%
  const rounded = Math.round(semantic + ROUND_EPSILON)
  
  // Map to visual scale
  if (rounded >= SEMANTIC_READY) {
    return VISUAL_READY
  }
  
  return Math.round((semantic / SEMANTIC_READY) * VISUAL_READY)
}

// Provider component
export const JobFlowProvider: React.FC<{ 
  children: React.ReactNode
  isAuthenticated: boolean
  onAuthRequired?: () => void
}> = ({ children, isAuthenticated: initialAuth, onAuthRequired }) => {
  const [context, dispatch] = useReducer(jobFlowReducer, createInitialContext())
  const [isAuthenticated, setIsAuthenticated] = React.useState(initialAuth)
  
  // Track processed jobs to prevent duplicates
  const startedForJobIds = useRef<Set<string>>(new Set())
  
  // Track if we've initialized from storage
  const hasInitialized = useRef(false)
  
  // Track auth timer to clean up
  const authTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Save state changes to localStorage
  useEffect(() => {
    if (context.state !== FlowState.Idle) {
      saveFlowState(context)
    }
    
    // Clear jobId lock when appropriate (but keep portfolio visible)
    if (shouldClearJobId(context.state) && context.currentJobId) {
      console.log('🔓 Clearing jobId lock only')
      dispatch({ type: FlowAction.ClearLock })
    }
    
    // Clean up completed/failed jobs from tracking set
    if ([FlowState.Completed, FlowState.Failed].includes(context.state) && context.currentJobId) {
      startedForJobIds.current.delete(context.currentJobId)
    }
    
    // Clear entire tracking set on Reset or ClearLock
    if (context.state === FlowState.Idle || !context.currentJobId) {
      startedForJobIds.current.clear()
    }
  }, [context])
  
  // Initialize from storage on mount
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      resumeFromStorage()
    }
    
    // Cleanup on unmount
    return () => {
      if (authTimerRef.current) {
        clearTimeout(authTimerRef.current)
      }
    }
  }, [])
  
  /**
   * Resume from stored state
   */
  const resumeFromStorage = useCallback(() => {
    const stored = loadFlowState()
    if (!stored) return
    
    const action = getRecoveryAction(stored, isAuthenticated)
    
    logFlowAction({
      timestamp: Date.now(),
      jobId: stored.currentJobId,
      action: 'RESUME_FROM_STORAGE',
      state: stored.state,
      details: { recoveryAction: action }
    })
    
    switch (action) {
      case 'show':
        // Restore context via dispatch (no mutation!)
        dispatch({ type: FlowAction.Hydrate, context: stored })
        break
      
      case 'claim':
        // Need to claim then extract/generate
        if (stored.currentJobId) {
          startPostSignupFlow(stored.currentJobId)
        }
        break
      
      case 'resume':
        // Restore context via dispatch, then continue
        dispatch({ type: FlowAction.Hydrate, context: stored })
        if (stored.currentJobId) {
          // Use setTimeout to ensure state is updated before continuing
          setTimeout(() => continueFlow(stored.currentJobId!, stored.state), 0)
        }
        break
      
      case 'reset':
      default:
        clearFlowState()
        dispatch({ type: FlowAction.Reset })
    }
  }, [isAuthenticated])
  
  /**
   * Continue flow from a specific state
   */
  const continueFlow = async (jobId: string, fromState: FlowState) => {
    switch (fromState) {
      case FlowState.Claiming:
        await performClaim(jobId)
        break
      case FlowState.Extracting:
        await performExtract(jobId)
        break
      case FlowState.Generating:
        await performGenerate(jobId)
        break
    }
  }
  
  /**
   * Start preview flow for anonymous users
   */
  const startPreviewFlow = async (file: File) => {
    // If completed with a portfolio, clear lock to allow new upload
    if (context.state === FlowState.Completed && context.currentJobId) {
      console.log('🔓 Clearing previous job lock to allow new upload')
      dispatch({ type: FlowAction.ClearLock })
      // Clear from tracking set as well
      startedForJobIds.current.delete(context.currentJobId)
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    
    // CRITICAL GUARD - Check again after potential clear
    if (context.currentJobId) {
      console.log('🛑 BLOCKED: Preview flow blocked, currentJobId exists:', context.currentJobId)
      return
    }
    
    try {
      dispatch({ type: FlowAction.UploadRequested, file })
      
      logFlowAction({
        timestamp: Date.now(),
        jobId: null,
        action: 'START_PREVIEW_FLOW',
        state: FlowState.Validating,
        details: { fileName: file.name, fileSize: file.size }
      })
      
      // Upload for validation only (anonymous)
      const { job_id } = await api.uploadAnonymous(file)
      
      dispatch({ type: FlowAction.UploadSucceeded, jobId: job_id })
      startedForJobIds.current.add(job_id)
      
      // Move to waiting for auth after a delay (show preview first)
      // Clear any existing timer first
      if (authTimerRef.current) {
        clearTimeout(authTimerRef.current)
      }
      
      authTimerRef.current = setTimeout(() => {
        if (context.state === FlowState.Previewing) {
          dispatch({ type: FlowAction.AuthRequested })
          onAuthRequired?.()
        }
        authTimerRef.current = null
      }, 6000)
      
    } catch (error: any) {
      console.error('Preview flow failed:', error)
      dispatch({ type: FlowAction.UploadFailed, error })
    }
  }
  
  /**
   * Start post-signup flow
   */
  const startPostSignupFlow = async (jobId: string) => {
    // Clear auth timer if it's still running (early auth)
    if (authTimerRef.current) {
      clearTimeout(authTimerRef.current)
      authTimerRef.current = null
      console.log('⏰ Cleared auth timer due to early authentication')
    }
    
    // Prevent duplicate processing
    if (startedForJobIds.current.has(jobId)) {
      console.log('✋ Already processing job:', jobId)
      return
    }
    
    startedForJobIds.current.add(jobId)
    
    logFlowAction({
      timestamp: Date.now(),
      jobId,
      action: 'START_POST_SIGNUP_FLOW',
      state: context.state,
      details: {}
    })
    
    // Claim -> Extract -> Generate
    await performClaim(jobId)
  }
  
  /**
   * Perform claim operation
   */
  const performClaim = async (jobId: string) => {
    try {
      dispatch({ type: FlowAction.ClaimStarted })
      
      await api.claim(jobId)
      
      dispatch({ type: FlowAction.ClaimSucceeded })
      
      // Continue to extract
      await performExtract(jobId)
      
    } catch (error: any) {
      console.error('Claim failed:', error)
      dispatch({ type: FlowAction.ClaimFailed, error })
    }
  }
  
  /**
   * Perform extract operation
   */
  const performExtract = async (jobId: string) => {
    try {
      dispatch({ type: FlowAction.ExtractStarted })
      
      const { cached } = await api.extract(jobId)
      
      dispatch({ type: FlowAction.ExtractSucceeded })
      
      logFlowAction({
        timestamp: Date.now(),
        jobId,
        action: 'EXTRACT_SUCCEEDED',
        state: FlowState.Extracting,
        details: { cached }
      })
      
      // Continue to generate
      await performGenerate(jobId)
      
    } catch (error: any) {
      console.error('Extract failed:', error)
      
      // Special handling for ownership errors
      if (error.code === 'NOT_CLAIMED') {
        // Try to claim first
        await performClaim(jobId)
        return
      }
      
      dispatch({ type: FlowAction.ExtractFailed, error })
    }
  }
  
  /**
   * Perform generate operation
   */
  const performGenerate = async (jobId: string) => {
    try {
      dispatch({ type: FlowAction.GenerateStarted })
      
      const { portfolio_url, portfolio_id } = await api.generate(jobId)
      
      finalizePortfolioReady(portfolio_url, portfolio_id)
      
    } catch (error: any) {
      console.error('Generate failed:', error)
      dispatch({ type: FlowAction.GenerateFailed, error })
    }
  }
  
  /**
   * Centralized portfolio ready handler
   * IDEMPOTENT - safe to call multiple times
   */
  const finalizePortfolioReady = (url: string, id?: string) => {
    // Already completed? Skip
    if (context.state === FlowState.Completed && context.portfolioUrl === url) {
      console.log('✅ Portfolio already finalized')
      return
    }
    
    // Use the semantic PortfolioReady action for clarity
    dispatch({ 
      type: FlowAction.PortfolioReady, 
      portfolioUrl: url, 
      portfolioId: id 
    })
    
    logFlowAction({
      timestamp: Date.now(),
      jobId: context.currentJobId,
      action: 'PORTFOLIO_READY',
      state: FlowState.Completed,
      details: { url, id }
    })
    
    // Stop any running timers/animations
    // This would be done in the UI components that use this context
  }
  
  /**
   * Start authenticated upload flow
   * For authenticated users: Upload → Extract → Generate (no claim needed)
   */
  const startAuthenticatedFlow = async (file: File) => {
    // If completed with a portfolio, clear lock to allow new upload
    if (context.state === FlowState.Completed && context.currentJobId) {
      console.log('🔓 Clearing previous job lock to allow new upload')
      dispatch({ type: FlowAction.ClearLock })
      // Clear from tracking set as well
      startedForJobIds.current.delete(context.currentJobId)
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    
    // CRITICAL GUARD - Check again after potential clear
    if (context.currentJobId) {
      console.log('🛑 BLOCKED: Authenticated flow blocked, currentJobId exists:', context.currentJobId)
      return
    }
    
    try {
      dispatch({ type: FlowAction.UploadRequested, file })
      
      logFlowAction({
        timestamp: Date.now(),
        jobId: null,
        action: 'START_AUTHENTICATED_FLOW',
        state: FlowState.Validating,
        details: { fileName: file.name, fileSize: file.size }
      })
      
      // For authenticated users, use the full upload endpoint (includes extraction)
      const { job_id } = await api.uploadAuthenticated(file)
      
      dispatch({ type: FlowAction.UploadSucceeded, jobId: job_id })
      startedForJobIds.current.add(job_id)
      
      // Skip claim, go straight to extraction (authenticated users own their jobs)
      await performExtract(job_id)
      
    } catch (error: any) {
      console.error('Authenticated flow failed:', error)
      dispatch({ type: FlowAction.UploadFailed, error })
    }
  }
  
  return (
    <JobFlowContextReact.Provider value={{
      context,
      dispatch,
      startPreviewFlow,
      startAuthenticatedFlow,  // Now properly exported!
      startPostSignupFlow,
      resumeFromStorage,
      finalizePortfolioReady,
      isAuthenticated,
      setIsAuthenticated
    }}>
      {children}
    </JobFlowContextReact.Provider>
  )
}

// Hook to use the context
export const useJobFlow = () => {
  const ctx = useContext(JobFlowContextReact)
  if (!ctx) {
    throw new Error('useJobFlow must be used within JobFlowProvider')
  }
  return ctx
}

// Export everything from types for convenience
export * from './types'