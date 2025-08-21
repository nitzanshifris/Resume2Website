/**
 * Job Flow State Machine Reducer
 * Pure function that handles all state transitions
 */

import { 
  FlowState, 
  FlowAction, 
  JobFlowContext, 
  FlowActionPayload,
  FLOW_STATE_VERSION 
} from './types'

// Initial state factory
export const createInitialContext = (): JobFlowContext => ({
  state: FlowState.Idle,
  currentJobId: null,
  portfolioUrl: null,
  portfolioId: null,
  uploadedFile: null,
  error: null,
  startedAt: null,
  completedAt: null,
  version: FLOW_STATE_VERSION
})

// State transition validator
const canTransition = (from: FlowState, action: FlowAction): boolean => {
  // Always allow these actions
  if ([FlowAction.Reset, FlowAction.ClearLock, FlowAction.Hydrate].includes(action)) {
    return true
  }
  
  const transitions: Record<FlowState, FlowAction[]> = {
    [FlowState.Idle]: [FlowAction.UploadRequested],
    [FlowState.Validating]: [FlowAction.UploadSucceeded, FlowAction.UploadFailed],
    [FlowState.Previewing]: [FlowAction.AuthRequested, FlowAction.ClaimStarted],
    [FlowState.WaitingAuth]: [FlowAction.AuthSucceeded],
    [FlowState.Claiming]: [FlowAction.ClaimSucceeded, FlowAction.ClaimFailed],
    [FlowState.Extracting]: [FlowAction.ExtractSucceeded, FlowAction.ExtractFailed],
    [FlowState.Generating]: [FlowAction.GenerateSucceeded, FlowAction.GenerateFailed],
    [FlowState.Completed]: [],
    [FlowState.Failed]: [FlowAction.UploadRequested]
  }
  
  return transitions[from]?.includes(action) ?? false
}

// Main reducer
export const jobFlowReducer = (
  context: JobFlowContext, 
  action: FlowActionPayload
): JobFlowContext => {
  // Always allow reset
  if (action.type === FlowAction.Reset) {
    return createInitialContext()
  }
  
  // Validate transition
  if (!canTransition(context.state, action.type)) {
    console.warn(`Invalid transition: ${context.state} -> ${action.type}`)
    return context
  }
  
  // Handle actions
  switch (action.type) {
    case FlowAction.UploadRequested:
      return {
        ...context,
        state: FlowState.Validating,
        uploadedFile: {
          name: action.file.name,
          size: action.file.size,
          lastModified: action.file.lastModified
        },
        startedAt: Date.now(),
        error: null
      }
    
    case FlowAction.UploadSucceeded:
      return {
        ...context,
        state: FlowState.Previewing,
        currentJobId: action.jobId,
        error: null
      }
    
    case FlowAction.UploadFailed:
      return {
        ...context,
        state: FlowState.Failed,
        error: {
          code: action.error.code || 'UPLOAD_FAILED',
          message: action.error.message || 'Upload failed',
          details: action.error
        }
      }
    
    case FlowAction.AuthRequested:
      return {
        ...context,
        state: FlowState.WaitingAuth
      }
    
    case FlowAction.AuthSucceeded:
      return {
        ...context,
        state: FlowState.Claiming
      }
    
    case FlowAction.ClaimStarted:
      return {
        ...context,
        state: FlowState.Claiming
      }
    
    case FlowAction.ClaimSucceeded:
      return {
        ...context,
        state: FlowState.Extracting
      }
    
    case FlowAction.ClaimFailed:
      return {
        ...context,
        state: FlowState.Failed,
        error: {
          code: action.error.code || 'CLAIM_FAILED',
          message: action.error.message || 'Failed to claim job',
          details: action.error
        }
      }
    
    case FlowAction.ExtractStarted:
      return {
        ...context,
        state: FlowState.Extracting
      }
    
    case FlowAction.ExtractSucceeded:
      return {
        ...context,
        state: FlowState.Generating
      }
    
    case FlowAction.ExtractFailed:
      return {
        ...context,
        state: FlowState.Failed,
        error: {
          code: action.error.code || 'EXTRACT_FAILED',
          message: action.error.message || 'Failed to extract CV data',
          details: action.error
        }
      }
    
    case FlowAction.GenerateStarted:
      return {
        ...context,
        state: FlowState.Generating
      }
    
    case FlowAction.GenerateSucceeded:
    case FlowAction.PortfolioReady: // Handles both as the same action
      return {
        ...context,
        state: FlowState.Completed,
        portfolioUrl: action.portfolioUrl,
        portfolioId: action.portfolioId || null,
        completedAt: Date.now(),
        error: null
      }
    
    case FlowAction.GenerateFailed:
      return {
        ...context,
        state: FlowState.Failed,
        error: {
          code: action.error.code || 'GENERATE_FAILED',
          message: action.error.message || 'Failed to generate portfolio',
          details: action.error
        }
      }
    
    case FlowAction.ClearLock:
      // Only clear the jobId lock, keep portfolio data
      return {
        ...context,
        currentJobId: null,
        startedAt: null
      }
    
    case FlowAction.Hydrate:
      // Restore from persisted state (no mutation!)
      return {
        ...action.context,
        version: FLOW_STATE_VERSION
      }
    
    default:
      return context
  }
}