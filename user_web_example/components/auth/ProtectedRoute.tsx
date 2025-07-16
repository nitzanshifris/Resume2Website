"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AuthModal from '../auth-modal'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectToAuth?: boolean
}

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: any
}

export default function ProtectedRoute({ 
  children, 
  fallback,
  redirectToAuth = true 
}: ProtectedRouteProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null
  })
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const sessionId = localStorage.getItem('cv2web_session_id')
        const userData = localStorage.getItem('cv2web_user')
        
        if (!sessionId || !userData) {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null
          })
          return
        }

        // Validate session with backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/current-user-info`, {
          headers: {
            'X-Session-ID': sessionId
          }
        })

        if (response.ok) {
          const userInfo = await response.json()
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: userInfo
          })
        } else {
          // Session is invalid, clear it
          localStorage.removeItem('cv2web_session_id')
          localStorage.removeItem('cv2web_user')
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null
          })
        }
      } catch (error) {
        console.error('Authentication check failed:', error)
        // Clear potentially corrupted auth data
        localStorage.removeItem('cv2web_session_id')
        localStorage.removeItem('cv2web_user')
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null
        })
      }
    }

    checkAuth()

    // Listen for storage changes (e.g., auth in another tab)
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Handle authentication success
  const handleAuthSuccess = (userData: any) => {
    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      user: userData
    })
    setShowAuthModal(false)
  }

  // Show loading state
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying your session...</h2>
          <p className="text-gray-600">Please wait while we check your authentication.</p>
        </motion.div>
      </div>
    )
  }

  // Show authentication required state
  if (!authState.isAuthenticated) {
    if (redirectToAuth) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full mx-4"
          >
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
              <p className="text-gray-600 mb-6">
                You need to sign in to access the dashboard and create your portfolio.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg"
              >
                Sign In / Sign Up
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
                className="w-full mt-3 text-gray-600 hover:text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Back to Home
              </motion.button>
            </div>
          </motion.div>

          {/* Auth Modal */}
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        </div>
      )
    }
    
    // Return fallback component if provided
    return fallback || null
  }

  // User is authenticated, render children
  return <>{children}</>
}