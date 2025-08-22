"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FileText, Globe, Settings } from 'lucide-react'

interface SimpleDashboardProps {
  userName: string
  onBackToHome?: () => void
}

export default function SimpleDashboard({ userName, onBackToHome }: SimpleDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}!</h1>
            <p className="text-gray-600 mt-2">Manage your portfolios and settings</p>
          </div>
          {onBackToHome && (
            <Button 
              variant="outline" 
              onClick={onBackToHome}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          )}
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recent Portfolios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                My Portfolios
              </CardTitle>
              <CardDescription>
                View and manage your portfolio websites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                No portfolios found. Upload your CV to create your first portfolio!
              </p>
              <Button size="sm" className="w-full">
                Create Portfolio
              </Button>
            </CardContent>
          </Card>

          {/* CV Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                CV Management
              </CardTitle>
              <CardDescription>
                Upload and manage your CV files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Upload new CVs or update existing ones
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Upload New CV
              </Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </CardTitle>
              <CardDescription>
                Account and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Manage your account settings and preferences
              </p>
              <Button size="sm" variant="outline" className="w-full">
                View Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <span className="font-semibold">Create New Portfolio</span>
                  <span className="text-sm text-gray-600">Upload CV and generate website</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <span className="font-semibold">View Analytics</span>
                  <span className="text-sm text-gray-600">Track portfolio performance</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}