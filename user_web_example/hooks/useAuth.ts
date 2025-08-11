"use client"

import { useState, useEffect, useCallback } from 'react'

interface User {
  id: string
  email: string
  name: string
  // Add other user properties as needed
}

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  sessionId: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    sessionId: null
  })

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      const sessionId = localStorage.getItem('resume2website_session_id')
      const userData = localStorage.getItem('resume2website_user')
      
      if (!sessionId || !userData) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          sessionId: null
        })
        return false
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
          user: userInfo,
          sessionId
        })
        return true
      } else {
        // Session is invalid, clear it
        localStorage.removeItem('resume2website_session_id')
        localStorage.removeItem('resume2website_user')
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          sessionId: null
        })
        return false
      }
    } catch (error) {
      console.error('Authentication check failed:', error)
      // Clear potentially corrupted auth data
      localStorage.removeItem('resume2website_session_id')
      localStorage.removeItem('resume2website_user')
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        sessionId: null
      })
      return false
    }
  }, [])

  // Sign out function
  const signOut = useCallback(() => {
    localStorage.removeItem('resume2website_session_id')
    localStorage.removeItem('resume2website_user')
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      sessionId: null
    })
  }, [])

  // Sign in function
  const signIn = useCallback(async (sessionId: string, userData: User) => {
    localStorage.setItem('resume2website_session_id', sessionId)
    localStorage.setItem('resume2website_user', JSON.stringify(userData))
    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      user: userData,
      sessionId
    })
  }, [])

  // Initialize auth check
  useEffect(() => {
    checkAuth()

    // Listen for storage changes (e.g., auth in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'resume2website_session_id' || e.key === 'resume2website_user') {
        checkAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [checkAuth])

  return {
    ...authState,
    checkAuth,
    signIn,
    signOut,
    refreshAuth: checkAuth
  }
}