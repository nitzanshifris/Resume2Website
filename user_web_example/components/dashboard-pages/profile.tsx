"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// Removed unused Textarea import
import { 
  User, 
  Edit3,
  Camera,
  Save,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfileProps {
  userName?: string
}

export default function Profile({ userName = "Alex Rodriguez" }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  // Removed activeTab - simplified to single page
  const [formData, setFormData] = useState({
    // Personal Details only
    name: "",
    email: "",
    phone: "",
    location: "",
    dateOfBirth: ""
  })

  const [cvData, setCvData] = useState<any>(null) // For DOB and location from CV

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile()
    fetchLatestCVData()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const sessionId = localStorage.getItem('resume2website_session_id')
      if (!sessionId) {
        setIsLoading(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/profile`, {
        headers: {
          'X-Session-ID': sessionId
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const profile = await response.json()
      setFormData(prev => ({
        ...prev,
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        dateOfBirth: profile.date_of_birth || ''
      }))
      
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLatestCVData = async () => {
    try {
      const sessionId = localStorage.getItem('resume2website_session_id')
      if (!sessionId) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/my-cvs`, {
        headers: {
          'X-Session-ID': sessionId
        }
      })

      if (!response.ok) return

      const data = await response.json()
      const latestCV = data.cvs?.[0]
      
      if (latestCV?.cv_data) {
        const parsedCV = JSON.parse(latestCV.cv_data)
        setCvData(parsedCV)
        
        // Auto-fill DOB and location if empty and available in CV
        setFormData(prev => {
          let locationString = prev.location || ''
          
          // If location from CV is an object, format it as a string
          if (!locationString && parsedCV.contact?.location) {
            const loc = parsedCV.contact.location
            if (typeof loc === 'object') {
              locationString = `${loc.city || ''}${loc.city && loc.state ? ', ' : ''}${loc.state || ''}${(loc.city || loc.state) && loc.country ? ', ' : ''}${loc.country || ''}`.trim()
            } else {
              locationString = loc
            }
          }
          
          // If still no location, try address
          if (!locationString && parsedCV.contact?.address) {
            locationString = parsedCV.contact.address
          }
          
          return {
            ...prev,
            dateOfBirth: prev.dateOfBirth || parsedCV.hero?.dateOfBirth || '',
            location: locationString
          }
        })
      }
    } catch (error) {
      console.error('Error fetching CV data:', error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const sessionId = localStorage.getItem('resume2website_session_id')
      if (!sessionId) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
          location: formData.location
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setIsEditing(false)
      
      // Show success message (you can add a toast here)
      console.log('Profile updated successfully')
      
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data to original values
    fetchUserProfile()
  }

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Removed handleNestedInputChange - not needed for simplified form

  // Removed skill management functions - not needed

  // Removed tabs - simplified to single page

  const EditableField = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      {children}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header with Avatar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {formData.name ? formData.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'U'}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full">
                    <User className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-700 bg-clip-text text-transparent leading-tight pb-2">
                  Account Details
                </h1>
              </div>
              <p className="text-xl text-gray-600 mb-2 font-medium">{formData.name || 'User'}</p>
              <p className="text-xl text-gray-600 mb-2">{formData.email}</p>
              <p className="text-gray-500 mb-3">
                {typeof formData.location === 'object' && formData.location 
                  ? `${formData.location.city || ''}${formData.location.city && formData.location.state ? ', ' : ''}${formData.location.state || ''}${(formData.location.city || formData.location.state) && formData.location.country ? ', ' : ''}${formData.location.country || ''}`
                  : formData.location || ''}
              </p>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  Premium Plan
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Profile 95% Complete
                </Badge>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2">
              {isEditing ? (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSave} 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)} size="sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Removed navigation tabs - single simplified page */}

      {/* Main Content - Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            {isEditing && (
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave} 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EditableField label="Full Name">
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                  placeholder="Enter your full name"
                />
              </EditableField>

              <EditableField label="Email Address">
                <Input
                  type="email"
                  value={formData.email}
                  disabled={true}
                  className="bg-gray-50"
                  placeholder="Email cannot be changed"
                />
              </EditableField>

              <EditableField label="Phone Number">
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                  placeholder="Enter your phone number"
                />
              </EditableField>

              <EditableField label="Location">
                <Input
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                  placeholder="Enter your location"
                />
              </EditableField>

              <EditableField label="Date of Birth">
                <Input
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </EditableField>
            </div>
          )}
        </Card>

        {/* Removed all other tabs and complex content */}
      </motion.div>
    </div>
  )
} 