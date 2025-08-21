/**
 * Job Flow API Layer
 * Clean API with exponential backoff and full jitter
 */

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'

// Get session ID from localStorage
const getSessionId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('resume2website_session_id')
  }
  return null
}

// Retry configuration
const MAX_RETRIES = 3
const BASE_DELAY_MS = 1000
const MAX_DELAY_MS = 10000

// Response types
export interface UploadResponse {
  job_id: string
}

export interface ClaimResponse {
  success: boolean
}

export interface ExtractResponse {
  success: boolean
  cached?: boolean
}

export interface GenerateResponse {
  portfolio_url: string
  portfolio_id?: string
}

/**
 * Calculate delay with exponential backoff and full jitter
 * This prevents thundering herd problem
 */
const calculateDelay = (attempt: number): number => {
  const exponentialDelay = Math.min(BASE_DELAY_MS * Math.pow(2, attempt), MAX_DELAY_MS)
  const jitteredDelay = Math.random() * exponentialDelay
  return Math.floor(jitteredDelay)
}

/**
 * Sleep helper
 */
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * Retry wrapper for API calls
 */
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  retryOn: (error: any) => boolean = () => true
): Promise<T> => {
  let lastError: any
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      
      // Check if we should retry
      if (!retryOn(error) || attempt === MAX_RETRIES - 1) {
        throw error
      }
      
      // Calculate and apply delay
      const delay = calculateDelay(attempt)
      console.log(`⏳ Retrying after ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`)
      await sleep(delay)
    }
  }
  
  throw lastError
}

/**
 * Should we retry this error?
 */
const shouldRetry = (error: any): boolean => {
  // Network errors
  if (error.code === 'NETWORK_ERROR') return true
  
  // Specific gateway/service errors (explicit for clarity)
  if (error.status === 502) return true  // Bad Gateway
  if (error.status === 503) return true  // Service Unavailable
  if (error.status === 504) return true  // Gateway Timeout
  
  // General server errors (5xx)
  if (error.status >= 500) return true
  
  // Rate limiting - retry with backoff
  if (error.status === 429) return true
  
  // Timeout
  if (error.status === 408) return true
  
  // Don't retry client errors (4xx except above)
  if (error.status >= 400 && error.status < 500) return false
  
  return true
}

// API Error type for consistency
export interface APIError {
  status: number
  code: string
  message: string
  details?: any
}

/**
 * Parse and normalize error response
 */
const parseError = async (response: Response): Promise<APIError> => {
  let error: APIError
  
  try {
    const data = await response.json()
    error = {
      status: response.status,
      code: data.error || data.code || response.statusText,
      message: data.message || data.detail || response.statusText,
      details: data
    }
  } catch {
    error = {
      status: response.status,
      code: response.statusText,
      message: `HTTP ${response.status}: ${response.statusText}`
    }
  }
  
  // Normalize specific error codes
  if (error.status === 403) {
    if (error.message?.toLowerCase().includes('not claimed') || 
        error.message?.toLowerCase().includes('must claim')) {
      error.code = 'NOT_CLAIMED'
    } else if (error.message?.toLowerCase().includes('not own') || 
               error.message?.toLowerCase().includes('do not own')) {
      error.code = 'NOT_OWNED'
    }
  }
  
  return error
}

/**
 * Upload file for anonymous user (validation only)
 */
export const uploadAnonymous = async (file: File): Promise<UploadResponse> => {
  return retryWithBackoff(async () => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE_URL}/api/v1/upload-anonymous`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
    
    if (!response.ok) {
      throw await parseError(response)
    }
    
    const data = await response.json()
    
    if (!data.job_id) {
      throw new Error('No job_id in response')
    }
    
    console.log('✅ Anonymous upload successful:', data.job_id)
    return { job_id: data.job_id }
  }, shouldRetry)
}

/**
 * Upload file for authenticated user (with extraction)
 */
export const uploadAuthenticated = async (file: File): Promise<UploadResponse> => {
  return retryWithBackoff(async () => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE_URL}/api/v1/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
    
    if (!response.ok) {
      throw await parseError(response)
    }
    
    const data = await response.json()
    
    if (!data.job_id) {
      throw new Error('No job_id in response')
    }
    
    console.log('✅ Authenticated upload successful:', data.job_id)
    return { job_id: data.job_id }
  }, shouldRetry)
}

/**
 * Claim an anonymous job after authentication
 * Treat "already_owned" as success (idempotent)
 */
export const claim = async (jobId: string): Promise<ClaimResponse> => {
  return retryWithBackoff(async () => {
    const sessionId = getSessionId()
    if (!sessionId) {
      throw new Error('Authentication required to claim CV')
    }
    
    const response = await fetch(`${API_BASE_URL}/api/v1/claim`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId
      },
      body: JSON.stringify({ job_id: jobId })
    })
    
    if (!response.ok) {
      const error = await parseError(response)
      
      // Treat "already owned" as success
      if (error.status === 200 || 
          error.code === 'already_owned' || 
          error.message?.includes('already own')) {
        console.log('✅ Job already owned (idempotent success):', jobId)
        return { success: true }
      }
      
      throw error
    }
    
    console.log('✅ Job claimed successfully:', jobId)
    return { success: true }
  }, shouldRetry)
}

/**
 * Extract CV data from uploaded file
 */
export const extract = async (jobId: string): Promise<ExtractResponse> => {
  return retryWithBackoff(async () => {
    const sessionId = getSessionId()
    if (!sessionId) {
      throw new Error('Authentication required to extract CV data')
    }
    
    const response = await fetch(`${API_BASE_URL}/api/v1/extract/${jobId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-Session-ID': sessionId
      }
    })
    
    if (!response.ok) {
      const error = await parseError(response)
      
      // Special handling for ownership errors
      if (error.status === 403) {
        if (error.message?.includes('not claimed')) {
          throw { ...error, code: 'NOT_CLAIMED' }
        }
        if (error.message?.includes('not own')) {
          throw { ...error, code: 'NOT_OWNED' }
        }
      }
      
      throw error
    }
    
    const data = await response.json()
    console.log('✅ Extraction successful:', { 
      jobId, 
      cached: data.cached || false 
    })
    
    return { 
      success: true, 
      cached: data.cached || false 
    }
  }, shouldRetry)
}

/**
 * Generate portfolio from extracted CV data
 */
export const generate = async (jobId: string): Promise<GenerateResponse> => {
  return retryWithBackoff(async () => {
    const sessionId = getSessionId()
    if (!sessionId) {
      throw new Error('Authentication required to generate portfolio')
    }
    
    const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/generate/${jobId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-Session-ID': sessionId
      }
    })
    
    if (!response.ok) {
      throw await parseError(response)
    }
    
    const data = await response.json()
    
    // Try multiple possible URL fields
    const portfolioUrl = data.url || 
                        data.portfolio_url || 
                        data.local_url || 
                        data.custom_domain_url
    
    if (!portfolioUrl) {
      throw new Error('No portfolio URL in response')
    }
    
    console.log('✅ Portfolio generated:', {
      jobId,
      url: portfolioUrl,
      id: data.portfolio_id
    })
    
    return {
      portfolio_url: portfolioUrl,
      portfolio_id: data.portfolio_id
    }
  }, shouldRetry)
}