/**
 * TypeScript interfaces for RESUME2WEBSITE SSE integration
 * Use these types in your frontend application
 */

// Message Types
export type SSEMessageType = "progress" | "step" | "complete" | "error" | "warning" | "heartbeat" | "sentinel";
export type SentinelType = "CLOSED" | "TIMEOUT" | "ERROR" | "COMPLETE";

// Base SSE Message Structure
export interface SSEMessage {
  id: string;
  type: SSEMessageType;
  timestamp: string;
  data: any;
}

// Progress Message Data
export interface ProgressData {
  step: string;
  progress: number; // 0-100
  message: string;
  duration?: number;
  current?: number;
  total?: number;
  extra?: string;
}

// Step Message Data
export interface StepData {
  stepName: string;
  stepNumber: number;
  totalSteps: number;
  details?: Record<string, any>;
}

// Complete Message Data
export interface CompleteData {
  result: {
    message: string;
    details?: Record<string, any>;
    performance_metrics?: {
      total_time: string;
      steps_completed: number;
      warnings_count: number;
      errors_count: number;
    };
    [key: string]: any;
  };
}

// Error Message Data
export interface ErrorData {
  message: string;
  errorCode: string;
  isCritical: boolean;
  timestamp: string;
  recoverySuggestion?: string;
  stackTrace?: string;
  headers?: Record<string, string>;
}

// Warning Message Data
export interface WarningData {
  message: string;
  details?: Record<string, any>;
}

// Heartbeat Message Data
export interface HeartbeatData {
  timestamp: string;
  connections: number;
}

// Sentinel Message Data
export interface SentinelData {
  sentinelType: SentinelType;
  reason: string;
  timestamp: string;
  details: Record<string, any>;
}

// CV Processing Result
export interface CVProcessingResult {
  job_id: string;
  cv_data: any; // Use your CV data type here
  filename: string;
  file_size: number;
  extraction_method: "OCR" | "Text Extraction";
  extracted_sections: number;
  processing_time: number;
}

// Portfolio Generation Result
export interface PortfolioGenerationResult {
  job_id: string;
  portfolio_url: string;
  status: string;
  processing_time: number;
}

// Sandbox Status Result
export interface SandboxStatusResult {
  sandbox_id: string;
  status: "creating" | "building" | "starting" | "running" | "stopped" | "error";
  preview_url?: string;
  created_at: string;
  expires_at?: string;
}

// Rate Limit Info
export interface RateLimitInfo {
  user_limits: {
    user_id: string;
    active_connections: number;
    max_connections: number;
    connection_tokens_remaining: number;
    requests_this_minute: number;
    requests_this_hour: number;
    event_tokens_remaining: number;
    is_blocked: boolean;
    block_until?: number;
    violation_count: number;
    global_connections: number;
    global_max_connections: number;
  };
  global_stats: {
    global_connections: number;
    max_global_connections: number;
    active_users: number;
    total_tracked_users: number;
    blocked_users: number;
    connection_utilization: number;
  };
  timestamp: string;
}

// SSE Client Configuration
export interface SSEClientConfig {
  baseUrl: string;
  sessionId?: string;
  connectionToken?: string;
  autoReconnect: boolean;
  maxReconnectAttempts: number;
  reconnectDelay: number;
  heartbeatTimeout: number;
}

// SSE Event Handlers
export interface SSEEventHandlers {
  onProgress?: (data: ProgressData) => void;
  onStep?: (data: StepData) => void;
  onComplete?: (data: CompleteData) => void;
  onError?: (data: ErrorData) => void;
  onWarning?: (data: WarningData) => void;
  onHeartbeat?: (data: HeartbeatData) => void;
  onSentinel?: (data: SentinelData) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onReconnect?: (attempt: number) => void;
}

// SSE Client Class Interface
export interface ISSEClient {
  connect(): void;
  disconnect(): void;
  isConnected(): boolean;
  getConnectionId(): string | null;
  addEventListener(type: SSEMessageType, handler: (data: any) => void): void;
  removeEventListener(type: SSEMessageType, handler: (data: any) => void): void;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Upload Response
export interface UploadResponse {
  message: string;
  job_id: string;
}

// Error Response
export interface ErrorResponse {
  detail: string;
  status_code: number;
}