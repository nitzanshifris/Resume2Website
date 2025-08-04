// Content Security Policy Configuration
// This file contains different CSP configurations for various environments

export const CSP_CONFIGS = {
  // Strict CSP for production (requires nonce implementation)
  strict: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'strict-dynamic'"],
    'style-src': ["'self'"],
    'img-src': ["'self'", 'blob:', 'data:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["*"],
  },

  // Balanced CSP (recommended for this portfolio)
  balanced: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https:'],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'img-src': ["'self'", 'blob:', 'data:', 'https://www.google.com/s2/favicons', 'https:'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'connect-src': ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["*"],
  },

  // Relaxed CSP for development
  development: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https:', 'http:'],
    'style-src': ["'self'", "'unsafe-inline'", 'https:', 'http:'],
    'img-src': ["'self'", 'blob:', 'data:', 'https:', 'http:'],
    'font-src': ["'self'", 'https:', 'http:'],
    'connect-src': ["'self'", 'https:', 'http:', 'ws:', 'wss:'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["*"],
  }
}

// Helper function to build CSP string
export function buildCSPString(config: Record<string, string[]>): string {
  return Object.entries(config)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ')
}

// Get appropriate CSP config based on environment
export function getCSPConfig() {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const config = isDevelopment ? CSP_CONFIGS.development : CSP_CONFIGS.balanced
  return buildCSPString(config)
}

// Additional security headers
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  // X-Frame-Options removed to allow iframe embedding
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  // Only in production
  ...(process.env.NODE_ENV === 'production' && {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  })
}