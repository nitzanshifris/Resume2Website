/**
 * Integration Example
 * Shows how to use the JobFlow system in your main component
 */

import React, { useEffect } from 'react'
import { useJobFlow, FlowState, mapSemanticToVisual, PROGRESS_CONFIG, JobFlowProvider } from './index'

/**
 * Example of how to integrate JobFlow into your main app
 */
export const IntegrationExample: React.FC = () => {
  const { 
    context, 
    startPreviewFlow,
    startAuthenticatedFlow, 
    startPostSignupFlow,
    resumeFromStorage,
    isAuthenticated 
  } = useJobFlow()
  
  // CRITICAL: Check for existing portfolio on mount
  const shouldShowMacBook = React.useMemo(() => {
    // Show MacBook if we have a portfolio URL (even after completion)
    if (context.portfolioUrl) return true
    
    // Show MacBook during preview/processing states
    return [
      FlowState.Previewing,
      FlowState.WaitingAuth,
      FlowState.Claiming,
      FlowState.Extracting,
      FlowState.Generating,
      FlowState.Completed
    ].includes(context.state)
  }, [context.state, context.portfolioUrl])
  
  // Calculate progress for display
  const visualProgress = React.useMemo(() => {
    // Map internal progress to visual representation
    let semanticProgress = 0
    
    switch (context.state) {
      case FlowState.Idle:
        semanticProgress = 0
        break
      case FlowState.Validating:
        semanticProgress = 10
        break
      case FlowState.Previewing:
      case FlowState.WaitingAuth:
        semanticProgress = 20
        break
      case FlowState.Claiming:
        semanticProgress = 30
        break
      case FlowState.Extracting:
        semanticProgress = 40
        break
      case FlowState.Generating:
        semanticProgress = 50
        break
      case FlowState.Completed:
        semanticProgress = PROGRESS_CONFIG.SEMANTIC_READY // 60
        break
      case FlowState.Failed:
        // Keep whatever progress we had
        semanticProgress = 0
        break
    }
    
    return mapSemanticToVisual(semanticProgress)
  }, [context.state])
  
  // Handle file upload
  const handleFileSelect = async (file: File) => {
    // The orchestrators handle CLEAR_LOCK automatically for Completed state
    // No need to check currentJobId here - let the orchestrator handle it
    
    if (isAuthenticated) {
      // Authenticated users get full flow with extraction
      await startAuthenticatedFlow(file)
    } else {
      // Anonymous users get preview flow
      await startPreviewFlow(file)
    }
  }
  
  // Handle successful authentication
  const handleAuthSuccess = () => {
    if (context.currentJobId && context.state === FlowState.WaitingAuth) {
      // Continue with claim → extract → generate
      startPostSignupFlow(context.currentJobId)
    }
  }
  
  return (
    <div className="min-h-screen">
      {/* Show MacBook if we have portfolio OR in preview/processing states */}
      {shouldShowMacBook ? (
        <div className="macbook-container">
          {/* Progress indicator */}
          <div className="progress-circle">
            <div 
              className="progress-fill"
              style={{ height: `${visualProgress}%` }}
            />
            <span className="progress-label">{visualProgress}%</span>
          </div>
          
          {/* MacBook with portfolio */}
          <div className="macbook-frame">
            {context.portfolioUrl ? (
              <iframe 
                src={context.portfolioUrl}
                className="w-full h-full"
                title="Portfolio"
              />
            ) : (
              <div className="preview-placeholder">
                {context.state === FlowState.Extracting && 'Extracting CV data...'}
                {context.state === FlowState.Generating && 'Generating portfolio...'}
                {context.state === FlowState.Previewing && 'Preview mode'}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="upload-area">
          {/* Show upload UI when no portfolio */}
          <input 
            type="file"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            accept=".pdf,.doc,.docx"
          />
        </div>
      )}
      
      {/* Show auth modal when needed */}
      {context.state === FlowState.WaitingAuth && (
        <div className="auth-modal">
          <button onClick={handleAuthSuccess}>Sign Up to Continue</button>
        </div>
      )}
      
      {/* Show error if failed */}
      {context.state === FlowState.Failed && context.error && (
        <div className="error-toast">
          {context.error.message}
        </div>
      )}
    </div>
  )
}

/**
 * Main App wrapper with JobFlowProvider
 */
export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  
  // Check auth status on mount
  React.useEffect(() => {
    // Check your auth API
    fetch('/api/auth/me')
      .then(res => res.ok && setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
  }, [])
  
  return (
    <JobFlowProvider 
      isAuthenticated={isAuthenticated}
      onAuthRequired={() => {
        // Show auth modal
        console.log('Auth required')
      }}
    >
      <IntegrationExample />
    </JobFlowProvider>
  )
}

/**
 * Key Integration Points:
 * 
 * 1. ALWAYS check context.portfolioUrl first - if it exists, show MacBook
 * 2. Use context.state to determine what to display
 * 3. Block uploads when context.currentJobId exists
 * 4. Handle auth success by calling startPostSignupFlow
 * 5. Use mapSemanticToVisual for consistent progress display
 * 
 * The resumeFromStorage in JobFlowProvider will:
 * - Load saved state on mount
 * - Dispatch HYDRATE action
 * - Set context.portfolioUrl if it was saved
 * - UI will immediately show MacBook if portfolioUrl exists
 */