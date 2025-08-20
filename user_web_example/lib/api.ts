// API utility functions for RESUME2WEBSITE backend integration

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'

export const API_ENDPOINTS = {
  UPLOAD_CV: '/api/v1/upload-cv',
  PROCESS_CV: '/api/v1/process-cv',
  TEMPLATES: '/api/v1/templates',
  GENERATE_PORTFOLIO: '/api/v1/generate-portfolio',
  SSE_PROGRESS: '/api/v1/sse/cv/extract-streaming',
  HEALTH: '/health'
}

// Types
export interface UploadResponse {
  message: string
  job_id: string
  session_id?: string
}

export interface ProcessingStatus {
  job_id?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  message: string
  result?: any
  error?: string
  phase?: string
}

export interface Template {
  id: string
  name: string
  description: string
  preview_url?: string
  thumbnail?: string
}

// Generic API request function
export async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// File upload function
export async function uploadFile(file: File): Promise<UploadResponse> {
  // Safety check for null/undefined file
  if (!file) {
    throw new Error('No file provided for upload')
  }
  
  const sessionId = getSessionId()
  console.log('🔑 Session ID retrieved for upload:', sessionId)
  console.log('📦 localStorage content:', {
    session: localStorage.getItem('resume2website_session_id'),
    user: localStorage.getItem('resume2website_user')
  })
  
  // Allow upload without authentication for demo purposes
  
  const formData = new FormData()
  formData.append('file', file)
  
  // IMPORTANT: Use anonymous upload endpoint if no session
  // This allows users to upload and validate files before signing up
  const uploadUrl = sessionId 
    ? `${API_BASE_URL}/api/v1/upload`
    : `${API_BASE_URL}/api/v1/upload-anonymous`
  console.log('Uploading to:', uploadUrl)
  console.log('Session ID:', sessionId || 'anonymous')
  console.log('File:', file.name, file.size, file.type)
  
  try {
    const headers: HeadersInit = {}
    if (sessionId) {
      headers['X-Session-ID'] = sessionId
    }
    // Don't set Content-Type header, let the browser set it with boundary
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      headers,
      mode: 'cors'
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      // Only log in development, not in production
      if (window.location.hostname === 'localhost' && process.env.NODE_ENV === 'development') {
        console.log('Upload validation failed:', response.status)
      }
      
      // Check if this is an authentication error
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Authentication required (${response.status}): ${errorData.message || 'Please sign in to continue'}`)
      }
      
      // Check if this is a Resume Gate rejection
      if (response.status === 400 && errorData.detail) {
        // Handle Resume Gate detailed error
        if (typeof errorData.detail === 'object') {
          const { error, score, reason, suggestion } = errorData.detail
          let message = error || 'Please upload a valid resume/CV file'
          
          if (reason) {
            message += `\n\n${reason}`
          }
          
          if (suggestion) {
            message += `\n\n💡 ${suggestion}`
          }
          
          // Don't show debug score in the error message
          
          throw new Error(message)
        }
        throw new Error(errorData.detail)
      }
      
      throw new Error(`Upload failed: ${errorData.message || errorData.detail || response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Upload error:', error)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

// Multiple file upload function
export async function uploadMultipleFiles(files: File[]): Promise<UploadResponse> {
  const sessionId = getSessionId()
  if (!sessionId) {
    throw new Error('Authentication required: Please sign in to upload multiple files')
  }
  
  const formData = new FormData()
  // Append all files to the same form data
  files.forEach((file) => {
    formData.append('files', file)
  })
  
  const uploadUrl = `${API_BASE_URL}/api/v1/upload-multiple`
  console.log('Uploading multiple files to:', uploadUrl)
  console.log('Session ID:', sessionId)
  console.log('Files:', files.map(f => `${f.name} (${f.size} bytes, ${f.type})`))
  
  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Session-ID': sessionId,
        // Don't set Content-Type header, let the browser set it with boundary
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Multiple upload error response:', response.status, errorData)
      
      // Check if this is an authentication error
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Authentication required (${response.status}): ${errorData.message || 'Please sign in to continue'}`)
      }
      
      // Check if this is a Resume Gate rejection
      if (response.status === 400 && errorData.detail) {
        // Handle Resume Gate detailed error
        if (typeof errorData.detail === 'object') {
          const { error, score, reason, suggestion } = errorData.detail
          let message = error || 'Please upload valid resume/CV files'
          
          if (reason) {
            message += `\n\n${reason}`
          }
          
          if (suggestion) {
            message += `\n\n💡 ${suggestion}`
          }
          
          // Don't show debug score in the error message
          
          throw new Error(message)
        }
        throw new Error(errorData.detail)
      }
      
      throw new Error(`Upload failed: ${errorData.message || errorData.detail || response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Multiple upload error:', error)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

// Process CV function
export async function processCV(jobId: string): Promise<ProcessingStatus> {
  return apiRequest<ProcessingStatus>(API_ENDPOINTS.PROCESS_CV, {
    method: 'POST',
    body: JSON.stringify({ job_id: jobId })
  })
}

// Get available templates
export async function getTemplates(): Promise<Template[]> {
  return apiRequest<Template[]>(API_ENDPOINTS.TEMPLATES)
}

// Generate portfolio with template
export async function generatePortfolio(
  jobId: string, 
  templateId: string
): Promise<{ success: boolean; portfolio_url?: string; message: string }> {
  return apiRequest(API_ENDPOINTS.GENERATE_PORTFOLIO, {
    method: 'POST',
    body: JSON.stringify({ 
      job_id: jobId, 
      template_id: templateId 
    })
  })
}

// SSE connection for real-time progress updates
export function createSSEConnection(
  jobId: string,
  onMessage: (data: ProcessingStatus) => void,
  onError?: (error: Error) => void
): EventSource {
  const sessionId = typeof window !== 'undefined' ? localStorage.getItem('resume2website_session_id') : null
  
  // EventSource doesn't support custom headers, so we'll append session ID as query param
  const url = `${API_BASE_URL}${API_ENDPOINTS.SSE_PROGRESS}/${jobId}?session_id=${sessionId}`
  const eventSource = new EventSource(url)
  
  // Listen for different event types
  eventSource.addEventListener('progress', (event) => {
    try {
      const data = JSON.parse(event.data)
      onMessage({
        status: 'processing',
        progress: data.progress || 0,
        message: data.message || 'Processing...',
        phase: data.step || 'processing'
      })
    } catch (error) {
      console.error('Failed to parse progress event:', error)
    }
  })
  
  eventSource.addEventListener('complete', (event) => {
    try {
      const data = JSON.parse(event.data)
      onMessage({
        status: 'completed',
        progress: 100,
        message: 'Processing complete!',
        phase: 'completed',
        result: data.result
      })
    } catch (error) {
      console.error('Failed to parse complete event:', error)
    }
  })
  
  eventSource.addEventListener('error', (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      onError?.(new Error(data.message || 'Processing error'))
    } catch (error) {
      console.error('Failed to parse error event:', error)
    }
  })
  
  eventSource.onerror = (event) => {
    console.error('SSE connection error:', event)
    onError?.(new Error('SSE connection failed'))
  }
  
  return eventSource
}

// Health check function
export async function healthCheck(): Promise<{ status: string }> {
  return apiRequest<{ status: string }>(API_ENDPOINTS.HEALTH)
}

// Session management
export function getSessionId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('resume2website_session_id')
  }
  return null
}

export function setSessionId(sessionId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('resume2website_session_id', sessionId)
  }
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('resume2website_session_id')
    localStorage.removeItem('resume2website_user')
    // CRITICAL: Clear portfolio data to prevent showing to next user
    localStorage.removeItem('lastPortfolio')
  }
}

// Portfolio management functions
export async function listUserPortfolios(): Promise<any> {
  const sessionId = getSessionId()
  if (!sessionId) {
    throw new Error('Not authenticated')
  }
  
  return apiRequest('/api/v1/portfolio/list', {
    headers: {
      'X-Session-ID': sessionId
    }
  })
}

export async function deletePortfolio(portfolioId: string): Promise<any> {
  const sessionId = getSessionId()
  if (!sessionId) {
    throw new Error('Not authenticated')
  }
  
  return apiRequest(`/api/v1/portfolio/${portfolioId}`, {
    method: 'DELETE',
    headers: {
      'X-Session-ID': sessionId
    }
  })
}

export async function deleteAllUserPortfolios(): Promise<void> {
  try {
    const response = await listUserPortfolios()
    if (response.portfolios && response.portfolios.length > 0) {
      // Delete all portfolios in parallel
      await Promise.all(
        response.portfolios.map((portfolio: any) => 
          deletePortfolio(portfolio.portfolio_id).catch(err => 
            console.error(`Failed to delete portfolio ${portfolio.portfolio_id}:`, err)
          )
        )
      )
      console.log(`✅ Deleted ${response.portfolios.length} existing portfolios`)
    }
  } catch (error) {
    console.error('Failed to delete existing portfolios:', error)
  }
}

// Utility function to check if backend is available
export async function checkBackendHealth(): Promise<boolean> {
  try {
    await healthCheck()
    return true
  } catch {
    return false
  }
}