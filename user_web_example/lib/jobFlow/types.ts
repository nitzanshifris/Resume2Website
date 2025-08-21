/**
 * Job Flow State Machine Types
 * Central types for the unified upload/generation flow
 */

// Version for persistence - increment when schema changes
export const FLOW_STATE_VERSION = 1

// Flow states - single source of truth
export enum FlowState {
  Idle = 'idle',
  Validating = 'validating',
  Previewing = 'previewing',
  WaitingAuth = 'waiting_auth',
  Claiming = 'claiming',
  Extracting = 'extracting',
  Generating = 'generating',
  Completed = 'completed',
  Failed = 'failed'
}

// Actions that can transition the state
export enum FlowAction {
  UploadRequested = 'UPLOAD_REQUESTED',
  UploadSucceeded = 'UPLOAD_SUCCEEDED',
  UploadFailed = 'UPLOAD_FAILED',
  AuthRequested = 'AUTH_REQUESTED',
  AuthSucceeded = 'AUTH_SUCCEEDED',
  ClaimStarted = 'CLAIM_STARTED',
  ClaimSucceeded = 'CLAIM_SUCCEEDED',
  ClaimFailed = 'CLAIM_FAILED',
  ExtractStarted = 'EXTRACT_STARTED',
  ExtractSucceeded = 'EXTRACT_SUCCEEDED',
  ExtractFailed = 'EXTRACT_FAILED',
  GenerateStarted = 'GENERATE_STARTED',
  GenerateSucceeded = 'GENERATE_SUCCEEDED',
  GenerateFailed = 'GENERATE_FAILED',
  PortfolioReady = 'PORTFOLIO_READY', // Semantic alias for GenerateSucceeded
  Reset = 'RESET',
  ClearLock = 'CLEAR_LOCK',
  Hydrate = 'HYDRATE'
}

// The complete flow context
export interface JobFlowContext {
  // Current state
  state: FlowState
  
  // Job tracking
  currentJobId: string | null
  
  // Portfolio result
  portfolioUrl: string | null
  portfolioId: string | null
  
  // File metadata (for UI display only)
  uploadedFile: {
    name: string
    size: number
    lastModified: number
  } | null
  
  // Error tracking
  error: {
    code: string
    message: string
    details?: any
  } | null
  
  // Timestamps
  startedAt: number | null
  completedAt: number | null
  
  // Persistence version
  version: number
}

// Action payloads
export type FlowActionPayload = 
  | { type: FlowAction.UploadRequested; file: File }
  | { type: FlowAction.UploadSucceeded; jobId: string }
  | { type: FlowAction.UploadFailed; error: any }
  | { type: FlowAction.AuthRequested }
  | { type: FlowAction.AuthSucceeded }
  | { type: FlowAction.ClaimStarted }
  | { type: FlowAction.ClaimSucceeded }
  | { type: FlowAction.ClaimFailed; error: any }
  | { type: FlowAction.ExtractStarted }
  | { type: FlowAction.ExtractSucceeded }
  | { type: FlowAction.ExtractFailed; error: any }
  | { type: FlowAction.GenerateStarted }
  | { type: FlowAction.GenerateSucceeded; portfolioUrl: string; portfolioId?: string }
  | { type: FlowAction.GenerateFailed; error: any }
  | { type: FlowAction.PortfolioReady; portfolioUrl: string; portfolioId?: string } // Alias for UI clarity
  | { type: FlowAction.Reset }
  | { type: FlowAction.ClearLock }
  | { type: FlowAction.Hydrate; context: JobFlowContext }

// Persisted state in localStorage
export interface PersistedFlowState {
  context: JobFlowContext
  version: number
  lastUpdatedAt: number
}

// Progress constants
export const PROGRESS_CONFIG = {
  SEMANTIC_READY: 60,
  VISUAL_READY: 80,
  ROUND_EPSILON: 0.5
} as const

// Structured log format
export interface FlowLog {
  timestamp: number
  jobId: string | null
  userId?: string
  action: string
  state: FlowState
  details?: Record<string, any>
}