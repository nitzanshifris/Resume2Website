/**
 * Smart Debug Panel - Not just shows state, but TELLS YOU what's wrong!
 */

import React, { useState, useEffect, useRef } from 'react'

interface SmartDebugPanelProps {
  jobFlowState: any
  user: any
  portfolioUrl: string | null
  currentJobId: string | null
  lastError?: any
}

interface Diagnostic {
  type: 'error' | 'warning' | 'info' | 'success'
  message: string
  action?: string
  fix?: () => void
}

export const SmartDebugPanel: React.FC<SmartDebugPanelProps> = ({
  jobFlowState,
  user,
  portfolioUrl,
  currentJobId,
  lastError
}) => {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null

  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('debugPanelOpen') !== 'false'
    }
    return true
  })

  // Track state history
  const [stateHistory, setStateHistory] = useState<Array<{state: string, timestamp: number}>>([])
  const [stuckTimer, setStuckTimer] = useState<number>(0)
  const stateRef = useRef<string>(jobFlowState)
  const lastStateChange = useRef<number>(Date.now())

  // Save open/close preference
  useEffect(() => {
    localStorage.setItem('debugPanelOpen', isOpen.toString())
  }, [isOpen])

  // Track state changes and detect stuck states
  useEffect(() => {
    if (stateRef.current !== jobFlowState) {
      stateRef.current = jobFlowState
      lastStateChange.current = Date.now()
      setStateHistory(prev => [...prev.slice(-9), {state: jobFlowState, timestamp: Date.now()}])
      setStuckTimer(0)
    }
  }, [jobFlowState])

  // Timer for stuck detection
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceChange = Date.now() - lastStateChange.current
      setStuckTimer(Math.floor(timeSinceChange / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen])

  // SMART DIAGNOSTICS ENGINE
  const getDiagnostics = (): Diagnostic[] => {
    const diagnostics: Diagnostic[] = []

    // Check if stuck in a state
    if (stuckTimer > 30 && jobFlowState !== 'Idle' && jobFlowState !== 'Completed') {
      diagnostics.push({
        type: 'warning',
        message: `Stuck in ${jobFlowState} for ${stuckTimer}s`,
        action: 'Something might be wrong. Check console for errors.',
        fix: () => window.location.reload()
      })
    }

    // Check common issues based on state
    switch (jobFlowState) {
      case 'Validating':
        if (stuckTimer > 10) {
          diagnostics.push({
            type: 'error',
            message: 'Validation taking too long',
            action: 'File might be too large or network is slow'
          })
        }
        break

      case 'WaitingAuth':
        if (!user) {
          diagnostics.push({
            type: 'info',
            message: 'Waiting for user to sign up',
            action: 'Show signup modal if not visible'
          })
        }
        break

      case 'Generating':
        if (stuckTimer > 60) {
          diagnostics.push({
            type: 'warning',
            message: 'Generation taking longer than usual',
            action: 'Check backend logs for Claude API issues'
          })
        }
        break

      case 'Completed':
        if (!portfolioUrl) {
          diagnostics.push({
            type: 'error',
            message: 'Completed but no portfolio URL!',
            action: 'Check if portfolio data was saved correctly',
            fix: () => {
              console.log('Attempting to restore portfolio...')
              const saved = localStorage.getItem('lastPortfolio')
              if (saved) {
                console.log('Found saved portfolio:', saved)
              }
            }
          })
        } else {
          diagnostics.push({
            type: 'success',
            message: 'Portfolio ready!',
            action: 'Everything working correctly'
          })
        }
        break

      case 'Error':
        diagnostics.push({
          type: 'error',
          message: lastError || 'Unknown error occurred',
          action: 'Check console for details',
          fix: () => {
            localStorage.clear()
            window.location.reload()
          }
        })
        break

      case 'Idle':
        if (currentJobId) {
          diagnostics.push({
            type: 'warning',
            message: 'Idle but has job ID',
            action: 'Might need to restart the flow'
          })
        }
        break
    }

    // Check for authentication issues
    if (jobFlowState === 'Extracting' && !user) {
      diagnostics.push({
        type: 'error',
        message: 'Extracting without user!',
        action: 'This should not happen - auth flow broken'
      })
    }

    // Check localStorage issues
    const localStorageKeys = Object.keys(localStorage)
    if (localStorageKeys.length > 20) {
      diagnostics.push({
        type: 'warning',
        message: `Too many localStorage keys (${localStorageKeys.length})`,
        action: 'Might have memory leak',
        fix: () => {
          const keysToKeep = ['debugPanelOpen', 'resume2website_session_id']
          localStorageKeys.forEach(key => {
            if (!keysToKeep.includes(key)) {
              localStorage.removeItem(key)
            }
          })
          window.location.reload()
        }
      })
    }

    // Check for common flow issues
    if (jobFlowState === 'Previewing' && user) {
      diagnostics.push({
        type: 'info',
        message: 'User logged in during preview',
        action: 'Should transition to extraction soon'
      })
    }

    return diagnostics
  }

  const diagnostics = getDiagnostics()
  const hasProblems = diagnostics.some(d => d.type === 'error' || d.type === 'warning')

  // Minimized state
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 p-2 rounded-full shadow-2xl z-[9999] transition-all ${
          hasProblems 
            ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
            : 'bg-black hover:bg-gray-800'
        } text-white`}
        title="Open Debug Panel (Cmd+D)"
      >
        {hasProblems ? (
          <span className="text-lg">⚠️</span>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        )}
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-2xl z-[9999] font-mono text-xs max-w-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-green-400 font-bold">
          🧠 SMART DEBUG {hasProblems && <span className="text-red-400">⚠️</span>}
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white transition-colors text-lg"
          title="Close (ESC)"
        >
          ✕
        </button>
      </div>
      
      {/* Current State with Timer */}
      <div className="mb-3 p-2 bg-gray-900 rounded">
        <div className="text-yellow-300 text-sm font-bold">
          State: <span className="text-lg">{jobFlowState || 'NO STATE'}</span>
          {stuckTimer > 5 && jobFlowState !== 'Idle' && jobFlowState !== 'Completed' && (
            <span className="text-orange-400 ml-2">({stuckTimer}s)</span>
          )}
        </div>
      </div>

      {/* Smart Diagnostics */}
      {diagnostics.length > 0 && (
        <div className="mb-3 space-y-1">
          <div className="text-xs text-gray-400 mb-1">DIAGNOSTICS:</div>
          {diagnostics.map((diag, i) => (
            <div 
              key={i} 
              className={`p-2 rounded text-xs ${
                diag.type === 'error' ? 'bg-red-900/50 border border-red-600' :
                diag.type === 'warning' ? 'bg-yellow-900/50 border border-yellow-600' :
                diag.type === 'success' ? 'bg-green-900/50 border border-green-600' :
                'bg-blue-900/50 border border-blue-600'
              }`}
            >
              <div className="font-bold">
                {diag.type === 'error' ? '❌' : 
                 diag.type === 'warning' ? '⚠️' :
                 diag.type === 'success' ? '✅' : 'ℹ️'} {diag.message}
              </div>
              {diag.action && (
                <div className="text-gray-300 mt-1">→ {diag.action}</div>
              )}
              {diag.fix && (
                <button 
                  onClick={diag.fix}
                  className="mt-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                >
                  Fix Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="bg-gray-900 p-2 rounded">
          <div className="text-gray-400">User:</div>
          <div className={user ? 'text-green-400' : 'text-red-400'}>
            {user ? `✅ ${user.email}` : '❌ Not logged'}
          </div>
        </div>
        
        <div className="bg-gray-900 p-2 rounded">
          <div className="text-gray-400">Portfolio:</div>
          <div className={portfolioUrl ? 'text-green-400' : 'text-gray-500'}>
            {portfolioUrl ? '✅ Ready' : '⭕ None'}
          </div>
        </div>
        
        <div className="bg-gray-900 p-2 rounded">
          <div className="text-gray-400">Job ID:</div>
          <div className={currentJobId ? 'text-blue-400' : 'text-gray-500'}>
            {currentJobId ? currentJobId.slice(0, 8) : 'None'}
          </div>
        </div>
        
        <div className="bg-gray-900 p-2 rounded">
          <div className="text-gray-400">Storage:</div>
          <div className={Object.keys(localStorage).length > 15 ? 'text-yellow-400' : 'text-gray-300'}>
            {Object.keys(localStorage).length} keys
          </div>
        </div>
      </div>

      {/* State History */}
      <div className="mb-3">
        <div className="text-xs text-gray-400 mb-1">STATE FLOW:</div>
        <div className="flex flex-wrap gap-1">
          {stateHistory.slice(-5).map((h, i) => (
            <span key={i} className="text-xs bg-gray-800 px-1 py-0.5 rounded">
              {h.state}
              {i < stateHistory.length - 1 && <span className="text-gray-500"> →</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Last Error */}
      {lastError && (
        <div className="mb-3 p-2 bg-red-900/30 border border-red-600 rounded">
          <div className="text-red-400 text-xs font-bold">Last Error:</div>
          <div className="text-xs mt-1">{lastError}</div>
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="flex gap-2">
        <button 
          onClick={() => {
            console.log('=== FULL DEBUG DUMP ===')
            console.log('State:', jobFlowState)
            console.log('User:', user)
            console.log('Portfolio:', portfolioUrl)
            console.log('Job ID:', currentJobId)
            console.log('localStorage:', {...localStorage})
            console.log('State History:', stateHistory)
            console.log('Diagnostics:', diagnostics)
            console.log('====================')
            alert('Full debug info logged to console!')
          }}
          className="bg-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-700 flex-1"
        >
          📋 Dump All
        </button>
        
        <button 
          onClick={() => {
            if (confirm('Reset everything and start fresh?')) {
              localStorage.clear()
              sessionStorage.clear()
              window.location.reload()
            }
          }}
          className="bg-red-600 px-2 py-1 rounded text-xs hover:bg-red-700 flex-1"
        >
          🔄 Hard Reset
        </button>

        <button 
          onClick={() => {
            const debugData = {
              state: jobFlowState,
              user: user?.email,
              portfolio: portfolioUrl,
              jobId: currentJobId,
              localStorage: Object.keys(localStorage),
              timestamp: new Date().toISOString()
            }
            navigator.clipboard.writeText(JSON.stringify(debugData, null, 2))
            alert('Debug data copied to clipboard!')
          }}
          className="bg-green-600 px-2 py-1 rounded text-xs hover:bg-green-700 flex-1"
        >
          📋 Copy
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-xs text-gray-500 mt-2 text-center">
        ESC to close • Cmd+D to toggle
      </div>
    </div>
  )
}