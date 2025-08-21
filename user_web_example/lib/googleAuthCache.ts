/**
 * Cache for Google OAuth status to prevent excessive API calls
 */

interface GoogleAuthStatus {
  available: boolean
  message: string
  client_secret_configured: boolean
}

// Module-level cache
let cachedStatus: GoogleAuthStatus | null = null
let cacheTimestamp: number | null = null
const CACHE_DURATION_MS = 5 * 60 * 1000 // Cache for 5 minutes

// Promise to prevent concurrent fetches
let fetchPromise: Promise<GoogleAuthStatus> | null = null

/**
 * Get Google OAuth status with caching to prevent excessive API calls
 */
export async function getGoogleAuthStatus(): Promise<GoogleAuthStatus> {
  const now = Date.now()
  
  // Return cached value if still valid
  if (cachedStatus && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION_MS)) {
    console.log('📦 Using cached Google auth status')
    return cachedStatus
  }
  
  // If already fetching, wait for that promise
  if (fetchPromise) {
    console.log('⏳ Waiting for existing Google auth status fetch')
    return fetchPromise
  }
  
  // Start new fetch
  console.log('🔄 Fetching fresh Google auth status')
  fetchPromise = fetchGoogleAuthStatus()
  
  try {
    const status = await fetchPromise
    cachedStatus = status
    cacheTimestamp = now
    return status
  } finally {
    fetchPromise = null
  }
}

async function fetchGoogleAuthStatus(): Promise<GoogleAuthStatus> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'
    const response = await fetch(`${apiUrl}/api/v1/auth/google/status`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to check Google OAuth availability:', error)
    return {
      available: false,
      message: 'Could not check Google OAuth status',
      client_secret_configured: false
    }
  }
}

/**
 * Clear the cache (useful for testing or when config changes)
 */
export function clearGoogleAuthCache() {
  cachedStatus = null
  cacheTimestamp = null
  fetchPromise = null
}