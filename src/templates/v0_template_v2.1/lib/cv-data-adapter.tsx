/**
 * CV Data Adapter - Extends v2.1's data mapper with CV2WEB integration
 * 
 * This adapter provides:
 * 1. CV2WEB data format compatibility
 * 2. Session-based CV data fetching
 * 3. Fallback to existing demo data
 */

import { mapCvDataToSections } from './data-mapper'

// CV2WEB API types (matching backend schema)
interface CV2WebData {
  hero?: {
    fullName?: string | null
    professionalTitle?: string | null
    summaryTagline?: string | null
    profilePhotoUrl?: string | null
  } | null
  contact?: {
    email?: string | null
    phone?: string | null
    location?: {
      city?: string | null
      state?: string | null  
      country?: string | null
    } | null
    professionalLinks?: Array<{
      platform?: string | null
      url?: string | null
    }> | null
    availability?: string | null
  } | null
  summary?: {
    summaryText?: string | null
    yearsOfExperience?: number | null
    keySpecializations?: string[] | null
    careerHighlights?: string[] | null
  } | null
  experience?: {
    sectionTitle?: string | null
    experienceItems?: Array<{
      jobTitle?: string | null
      companyName?: string | null
      location?: {
        city?: string | null
        state?: string | null
        country?: string | null
      } | null
      dateRange?: {
        startDate?: string | null
        endDate?: string | null
        isCurrent?: boolean | null
      } | null
      responsibilitiesAndAchievements?: string[] | null
      technologiesUsed?: string[] | null
      summary?: string | null
    }> | null
  } | null
  education?: {
    sectionTitle?: string | null
    educationItems?: Array<{
      degree?: string | null
      fieldOfStudy?: string | null
      institution?: string | null
      location?: {
        city?: string | null
        state?: string | null
        country?: string | null
      } | null
      dateRange?: {
        startDate?: string | null
        endDate?: string | null
      } | null
      gpa?: string | null
      honors?: string[] | null
      relevantCoursework?: string[] | null
    }> | null
  } | null
  skills?: {
    sectionTitle?: string | null
    skillCategories?: Array<{
      categoryName?: string | null
      skills?: string[] | null
    }> | null
    ungroupedSkills?: string[] | null
  } | null
  projects?: {
    sectionTitle?: string | null
    projectItems?: Array<{
      title?: string | null
      description?: string | null
      technologiesUsed?: string[] | null
      projectUrl?: string | null
      imageUrl?: string | null
    }> | null
  } | null
  [key: string]: any // Allow other sections
}

/**
 * Transform CV2WEB data to v2.1 format
 */
export function adaptCV2WebData(cv2webData: CV2WebData): any {
  // Start with empty data structure
  const adaptedData = {
    hero: {
      name: cv2webData.hero?.fullName || "Your Name",
      title: cv2webData.hero?.professionalTitle || "Professional Title",
      tagline: cv2webData.hero?.summaryTagline || "Your Tagline",
      availability: cv2webData.contact?.availability || "Available for opportunities",
      email: cv2webData.contact?.email || "",
      profilePhotoUrl: cv2webData.hero?.profilePhotoUrl || null
    },
    sections: []
  }

  // Add summary section if available
  if (cv2webData.summary?.summaryText) {
    adaptedData.sections.push({
      id: 'summary',
      type: 'paragraph',
      title: 'About Me',
      data: {
        content: cv2webData.summary.summaryText
      }
    })
  }

  // Add experience section
  if (cv2webData.experience?.experienceItems?.length) {
    adaptedData.sections.push({
      id: 'experience',
      type: 'timeline',
      title: cv2webData.experience.sectionTitle || 'Experience',
      data: cv2webData.experience.experienceItems.map(item => ({
        jobTitle: item?.jobTitle || '',
        companyName: item?.companyName || '',
        duration: formatDateRange(item?.dateRange),
        location: formatLocation(item?.location),
        description: item?.responsibilitiesAndAchievements?.join(' • ') || item?.summary || ''
      }))
    })
  }

  // Add education section
  if (cv2webData.education?.educationItems?.length) {
    adaptedData.sections.push({
      id: 'education',
      type: 'timeline',
      title: cv2webData.education.sectionTitle || 'Education',
      data: cv2webData.education.educationItems.map(item => ({
        jobTitle: item?.degree || '',
        companyName: item?.institution || '',
        duration: formatDateRange(item?.dateRange),
        location: formatLocation(item?.location),
        description: item?.relevantCoursework?.join(', ') || item?.honors?.join(', ') || ''
      }))
    })
  }

  // Add skills section
  if (cv2webData.skills?.skillCategories?.length || cv2webData.skills?.ungroupedSkills?.length) {
    const skills = []
    
    // Add categorized skills
    cv2webData.skills.skillCategories?.forEach(category => {
      skills.push({
        title: category.categoryName || 'Skills',
        items: (category.skills || []).map(skill => ({ name: skill }))
      })
    })
    
    // Add ungrouped skills
    if (cv2webData.skills.ungroupedSkills?.length) {
      skills.push({
        title: 'Other Skills',
        items: cv2webData.skills.ungroupedSkills.map(skill => ({ name: skill }))
      })
    }

    adaptedData.sections.push({
      id: 'skills',
      type: 'bento',
      title: cv2webData.skills.sectionTitle || 'Skills',
      data: skills
    })
  }

  // Add projects section
  if (cv2webData.projects?.projectItems?.length) {
    adaptedData.sections.push({
      id: 'projects',
      type: 'projects',
      title: cv2webData.projects.sectionTitle || 'Projects',
      data: cv2webData.projects.projectItems.map(item => ({
        title: item?.title || '',
        description: item?.description || '',
        link: item?.projectUrl || '#',
        imageUrl: item?.imageUrl || null
      }))
    })
  }

  // Add contact section
  adaptedData.sections.push({
    id: 'contact',
    type: 'contact',
    title: 'Contact',
    data: {
      email: cv2webData.contact?.email || '',
      phone: cv2webData.contact?.phone || '',
      location: formatLocation(cv2webData.contact?.location),
      socialLinks: cv2webData.contact?.professionalLinks?.map(link => ({
        platform: link?.platform || '',
        url: link?.url || ''
      })) || []
    }
  })

  return adaptedData
}

/**
 * Format date range for display
 */
function formatDateRange(dateRange?: any): string {
  if (!dateRange) return ""
  
  const start = dateRange.startDate || ""
  const end = dateRange.isCurrent ? "Present" : (dateRange.endDate || "")
  
  if (start && end) return `${start} - ${end}`
  if (start) return start
  if (end) return end
  return ""
}

/**
 * Format location for display
 */
function formatLocation(location?: any): string {
  if (!location) return ""
  
  const parts = [location.city, location.state, location.country].filter(Boolean)
  return parts.join(", ")
}

/**
 * Fetch CV data from CV2WEB API
 */
export async function fetchCVData(jobId: string, sessionId: string): Promise<any> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'
    const response = await fetch(`${apiUrl}/api/v1/cv/${jobId}`, {
      headers: {
        'X-Session-ID': sessionId
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch CV data: ${response.status}`)
    }

    const data = await response.json()
    return adaptCV2WebData(data.cv_data)
  } catch (error) {
    console.error('Error fetching CV data:', error)
    // Return null to indicate fetch failure
    return null
  }
}

/**
 * Fetch the most recent CV for a user
 */
export async function fetchLatestCVData(sessionId: string): Promise<any> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)
    
    const response = await fetch(`${apiUrl}/api/v1/my-cvs`, {
      headers: {
        'X-Session-ID': sessionId
      },
      signal: controller.signal,
      mode: 'cors' // Explicitly set CORS mode
    }).finally(() => clearTimeout(timeoutId))

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    const completedCVs = data.cvs?.filter((cv: any) => cv.status === 'completed') || []
    
    // Sort by upload_date descending
    completedCVs.sort((a: any, b: any) => 
      new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()
    )
    
    // Get the most recent CV
    const latestCV = completedCVs[0]
    
    if (!latestCV) {
      console.log('No completed CVs found for session')
      return null
    }

    const cv2webData = JSON.parse(latestCV.cv_data)
    return adaptCV2WebData(cv2webData)
  } catch (error: any) {
    // Better error messages for common issues
    if (error.name === 'AbortError') {
      console.error('CV fetch timeout after 3s')
    } else if (error.message.includes('Failed to fetch')) {
      console.error('Network error - CV2WEB backend may not be running on port 2000')
    } else {
      console.error('Error fetching CV data:', error.message)
    }
    return null
  }
}

/**
 * Get session ID from various sources
 */
export function getSessionId(): string | null {
  if (typeof window !== 'undefined') {
    // Try URL params first
    const urlParams = new URLSearchParams(window.location.search)
    const sessionFromUrl = urlParams.get('session')
    if (sessionFromUrl) return sessionFromUrl
    
    // Try localStorage
    const sessionFromStorage = localStorage.getItem('sessionId')
    if (sessionFromStorage) return sessionFromStorage
    
    // Development fallback
    if (process.env.NODE_ENV === 'development') {
      return 'dev-session'
    }
  }
  
  return null
}