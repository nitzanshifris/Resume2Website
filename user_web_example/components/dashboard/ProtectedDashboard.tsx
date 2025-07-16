"use client"

import React from 'react'
import ProtectedRoute from '../auth/ProtectedRoute'
import SimpleDashboard from '../simple-dashboard'

interface ProtectedDashboardProps {
  userName?: string
  onBackToHome?: () => void
}

export default function ProtectedDashboard({ userName, onBackToHome }: ProtectedDashboardProps) {
  return (
    <ProtectedRoute>
      <SimpleDashboard userName={userName || "User"} onBackToHome={onBackToHome} />
    </ProtectedRoute>
  )
}