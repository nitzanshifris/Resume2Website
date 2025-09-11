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
  restorePortfolio: (url: string, id?: string) => void  // New restoration function
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
    // ALWAYS clear any existing job to allow new upload (user is starting fresh)
    if (context.currentJobId) {
      console.log('🔓 Clearing previous job lock to allow new upload (was in state:', context.state, ')')
      dispatch({ type: FlowAction.ClearLock })
      // Clear from tracking set as well
      startedForJobIds.current.delete(context.currentJobId)
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    
    // CRITICAL GUARD - Check again after potential clear
    if (context.currentJobId) {
      console.log('🛑 BLOCKED: Preview flow blocked, currentJobId still exists:', context.currentJobId)
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
      
      console.log('⏱️ Setting auth timer for 13 seconds from now (animation takes ~6s + 7s to appreciate)...')
      authTimerRef.current = setTimeout(() => {
        console.log('⏰ Auth timer fired! Current state:', context.state)
        // Don't check state here - we know we just set it to Previewing
        // The timer was set right after upload succeeded, so we should show auth
        dispatch({ type: FlowAction.AuthRequested })
        if (onAuthRequired) {
          console.log('🔔 Calling onAuthRequired callback...')
          onAuthRequired()
        } else {
          console.log('⚠️ onAuthRequired callback is not defined!')
        }
        authTimerRef.current = null
      }, 13000) // Increased to 13000ms (animation ~6s + 7s viewing time)
      
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
    
    // DON'T block based on startedForJobIds - this is a continuation, not a new start
    // The job was already started in startPreviewFlow, now we're continuing it after auth
    console.log('📤 Continuing job after signup:', jobId)
    
    logFlowAction({
      timestamp: Date.now(),
      jobId,
      action: 'START_POST_SIGNUP_FLOW',
      state: context.state,
      details: {}
    })
    
    // CRITICAL: If we're in WaitingAuth state, dispatch AuthSucceeded first to transition properly
    if (context.state === FlowState.WaitingAuth) {
      console.log('🔑 Dispatching AuthSucceeded to transition from WaitingAuth to Claiming')
      dispatch({ type: FlowAction.AuthSucceeded })
      // Small delay to ensure state updates before continuing
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    
    // Claim -> Extract -> Generate
    await performClaim(jobId)
  }
  
  /**
   * Perform claim operation
   */
  const performClaim = async (jobId: string) => {
    try {
      // Don't dispatch ClaimStarted if we're already in Claiming state
      if (context.state !== FlowState.Claiming) {
        dispatch({ type: FlowAction.ClaimStarted })
      }
      
      await api.claim(jobId)
      
      dispatch({ type: FlowAction.ClaimSucceeded })
      
      // Continue to extract
      await performExtract(jobId)
      
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || 'Failed to claim job'
      console.error('Claim failed:', errorMessage, error)
      
      // If claim failed due to ownership (403), clear the job and don't show error
      if (error?.status === 403 || error?.response?.status === 403 || errorMessage?.includes('owned by another user')) {
        console.log('🔓 Clearing job due to ownership conflict - this CV belongs to another user')
        dispatch({ type: FlowAction.ClearLock })
        // Clear from localStorage too
        localStorage.removeItem('pendingJobId')
        // Clear from tracking
        startedForJobIds.current.delete(jobId)
      } else {
        dispatch({ type: FlowAction.ClaimFailed, error: { message: errorMessage, code: error?.code, details: error } })
      }
    }
  }
  
  /**
   * Perform extract operation
   */
  const performExtract = async (jobId: string) => {
    try {
      // ExtractStarted is not needed - we're already in Extracting state from ClaimSucceeded
      // dispatch({ type: FlowAction.ExtractStarted })
      
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
      // GenerateStarted is not needed - we're already in Generating state from ExtractSucceeded
      // dispatch({ type: FlowAction.GenerateStarted })
      
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
   * Restore portfolio from previous session
   * Used when user logs back in and has existing portfolio
   * Can be called from any state (bypasses state machine)
   */
  const restorePortfolio = (url: string, id?: string) => {
    console.log('🔄 Restoring portfolio:', { url, id })
    
    // Use the new RestorePortfolio action that works from any state
    dispatch({ 
      type: FlowAction.RestorePortfolio, 
      portfolioUrl: url, 
      portfolioId: id 
    })
    
    logFlowAction({
      timestamp: Date.now(),
      jobId: null,
      action: 'PORTFOLIO_RESTORED',
      state: FlowState.Completed,
      details: { url, id }
    })
    
    // Save to localStorage for future restoration
    const sessionId = localStorage.getItem('resume2website_session_id')
    if (sessionId) {
      localStorage.setItem('lastPortfolio', JSON.stringify({
        url,
        id,
        userId: sessionId,
        timestamp: Date.now()
      }))
      console.log('💾 Restored portfolio saved to localStorage')
    }
  }
  
  /**
   * Start authenticated upload flow
   * For authenticated users: Upload → Extract → Generate (no claim needed)
   */
  const startAuthenticatedFlow = async (file: File) => {
    // ALWAYS clear any existing job to allow new upload (user is starting fresh)
    if (context.currentJobId) {
      console.log('🔓 Clearing previous job lock to allow new upload (was in state:', context.state, ')')
      dispatch({ type: FlowAction.ClearLock })
      // Clear from tracking set as well
      startedForJobIds.current.delete(context.currentJobId)
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    
    // CRITICAL GUARD - Check again after potential clear
    if (context.currentJobId) {
      console.log('🛑 BLOCKED: Authenticated flow blocked, currentJobId still exists:', context.currentJobId)
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
      const errorMessage = error?.message || error?.error || 'Failed to process file'
      console.error('Authenticated flow failed:', errorMessage, error)
      dispatch({ type: FlowAction.UploadFailed, error: { message: errorMessage, code: error?.code, details: error } })
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
      restorePortfolio,  // Export the new restoration function
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