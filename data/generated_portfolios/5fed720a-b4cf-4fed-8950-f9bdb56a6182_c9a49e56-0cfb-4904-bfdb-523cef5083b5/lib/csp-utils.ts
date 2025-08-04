// CSP Utilities for testing and monitoring

/**
 * Enable CSP in report-only mode for testing
 * This allows you to see violations without breaking functionality
 */
export function enableCSPReportOnly(cspString: string): string {
  // You can set up a reporting endpoint here if needed
  // For now, we'll just use browser console reporting
  return cspString
}

/**
 * Common CSP issues and solutions for Next.js portfolios
 */
export const CSP_TROUBLESHOOTING = {
  'Inline styles blocked': {
    issue: 'Framer Motion and dynamic styles require unsafe-inline',
    solution: "Use 'unsafe-inline' in style-src or implement nonce-based approach",
    severity: 'medium'
  },
  'Google Fonts blocked': {
    issue: 'Next.js font optimization loads from Google Fonts',
    solution: 'Add https://fonts.googleapis.com and https://fonts.gstatic.com to appropriate directives',
    severity: 'low'
  },
  'Favicon service blocked': {
    issue: 'Google favicon service used for external links',
    solution: 'Add https://www.google.com/s2/favicons to img-src',
    severity: 'low'
  },
  'Development hot reload blocked': {
    issue: 'Next.js development server uses WebSocket connections',
    solution: 'Use relaxed CSP in development mode with ws: and wss: in connect-src',
    severity: 'development-only'
  },
  'Chart rendering blocked': {
    issue: 'Recharts may use inline scripts or eval',
    solution: "Add 'unsafe-eval' to script-src if using complex chart libraries",
    severity: 'medium'
  }
}

/**
 * Test CSP configuration without breaking the app
 */
export function testCSPConfiguration() {
  if (typeof window !== 'undefined') {
    // Listen for CSP violations
    document.addEventListener('securitypolicyviolation', (e) => {
      console.warn('CSP Violation:', {
        directive: e.violatedDirective,
        blocked: e.blockedURI,
        policy: e.originalPolicy,
        sourceFile: e.sourceFile,
        lineNumber: e.lineNumber
      })
    })
  }
}

/**
 * Generate a CSP report for your specific needs
 */
export function generateCSPReport(violations: SecurityPolicyViolationEvent[]): string {
  const report = violations.reduce((acc, violation) => {
    const key = violation.violatedDirective
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(violation.blockedURI)
    return acc
  }, {} as Record<string, string[]>)

  return Object.entries(report)
    .map(([directive, uris]) => `${directive}: ${[...new Set(uris)].join(', ')}`)
    .join('\n')
}