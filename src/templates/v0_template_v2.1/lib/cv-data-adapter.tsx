/**
 * CV Data Adapter - Extends v2.1's data mapper with CV2WEB integration
 * 
 * This adapter provides:
 * 1. CV2WEB data format compatibility
 * 2. Session-based CV data fetching
 * 3. Fallback to existing demo data
 */

import React from 'react'
import { mapCvDataToSections } from './data-mapper'
import { Code2, Database, Cloud, GitBranch, Shield, Trophy } from "lucide-react"

// Helper function to get skill category icon
const getSkillIcon = (categoryName: string) => {
  const icons: Record<string, any> = {
    "Programming Languages": Code2,
    "Backend Development": Database,
    "Frontend Development": Code2,
    "Cloud & DevOps": Cloud,
    "Tools & Version Control": GitBranch,
    "Security & Testing": Shield,
    default: Trophy,
  }
  const lowerCategory = categoryName.toLowerCase()
  for (const key of Object.keys(icons)) {
    if (key !== 'default' && lowerCategory.includes(key.toLowerCase().split(" ")[0])) {
      return icons[key]
    }
  }
  return icons.default
}

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
      githubUrl?: string | null
      demoUrl?: string | null
      videoUrl?: string | null
    }> | null
  } | null
  achievements?: {
    sectionTitle?: string | null
    achievements?: Array<{
      value?: string | null
      label?: string | null
      contextOrDetail?: string | null
      timeframe?: string | null
    }> | null
  } | null
  certifications?: {
    sectionTitle?: string | null
    certificationItems?: Array<{
      title?: string | null
      issuingOrganization?: string | null
      issueDate?: string | null
      expirationDate?: string | null
      credentialId?: string | null
      verificationUrl?: string | null
    }> | null
  } | null
  languages?: {
    sectionTitle?: string | null
    languageItems?: Array<{
      language?: string | null
      proficiency?: string | null
      certification?: string | null
    }> | null
  } | null
  courses?: {
    sectionTitle?: string | null
    courseItems?: Array<{
      title?: string | null
      institution?: string | null
      completionDate?: string | null
    }> | null
  } | null
  volunteer?: {
    sectionTitle?: string | null
    volunteerItems?: Array<{
      role?: string | null
      organization?: string | null
      dateRange?: {
        startDate?: string | null
        endDate?: string | null
        isCurrent?: boolean | null
      } | null
      description?: string | null
    }> | null
  } | null
  publications?: {
    sectionTitle?: string | null
    publications?: Array<{
      title?: string | null
      publicationType?: string | null
      publicationVenue?: string | null
      publicationDate?: string | null
      url?: string | null
    }> | null
  } | null
  speaking?: {
    sectionTitle?: string | null
    speakingEngagements?: Array<{
      eventName?: string | null
      topic?: string | null
      date?: string | null
      venue?: string | null
      role?: string | null
    }> | null
  } | null
  patents?: {
    sectionTitle?: string | null
    patents?: Array<{
      title?: string | null
      patentNumber?: string | null
      status?: string | null
      filingDate?: string | null
      description?: string | null
    }> | null
  } | null
  memberships?: {
    sectionTitle?: string | null
    memberships?: Array<{
      organization?: string | null
      role?: string | null
      membershipType?: string | null
      dateRange?: {
        startDate?: string | null
        endDate?: string | null
        isCurrent?: boolean | null
      } | null
    }> | null
  } | null
  hobbies?: {
    sectionTitle?: string | null
    hobbies?: string[] | null
  } | null
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
        description: cv2webData.summary.summaryText
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
        title: item?.jobTitle || '',
        subtitle: `${item?.companyName || ''}${item?.location ? ', ' + formatLocation(item.location) : ''}`,
        period: formatDateRange(item?.dateRange),
        details: item?.responsibilitiesAndAchievements || []
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
        title: `${item?.degree || ''}${item?.fieldOfStudy ? ', ' + item.fieldOfStudy : ''}`,
        subtitle: `${item?.institution || ''}${item?.location ? ', ' + formatLocation(item.location) : ''}`,
        period: formatDateRange(item?.dateRange),
        details: item?.honors || []
      }))
    })
  }

  // Add skills section
  if (cv2webData.skills?.skillCategories?.length || cv2webData.skills?.ungroupedSkills?.length) {
    const skills = []
    
    // Add categorized skills
    cv2webData.skills.skillCategories?.forEach(category => {
      const IconComponent = getSkillIcon(category.categoryName || '')
      skills.push({
        categoryName: category.categoryName || 'Skills',
        skills: category.skills || [],
        icon: <IconComponent className="w-20 h-20 text-foreground transition-colors duration-300" />
      })
    })
    
    // Add ungrouped skills
    if (cv2webData.skills.ungroupedSkills?.length) {
      const IconComponent = getSkillIcon('Other Skills')
      skills.push({
        categoryName: 'Other Skills',
        skills: cv2webData.skills.ungroupedSkills,
        icon: <IconComponent className="w-20 h-20 text-foreground transition-colors duration-300" />
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

  // Add achievements section
  if (cv2webData.achievements?.achievements?.length) {
    adaptedData.sections.push({
      id: 'accomplishments',
      type: 'accomplishments',
      title: cv2webData.achievements.sectionTitle || 'Achievements',
      data: cv2webData.achievements.achievements.map(item => {
        // Match the exact format expected by v2.1
        let title = item?.value || ''
        let description = item?.label || ''
        
        if (item?.contextOrDetail) {
          description += ` ${item.contextOrDetail}`
        }
        if (item?.timeframe) {
          description += ` (${item.timeframe})`
        }
        
        return {
          title: title.trim(),
          description: description.trim()
        }
      })
    })
  }

  // Add certifications section
  if (cv2webData.certifications?.certificationItems?.length) {
    adaptedData.sections.push({
      id: 'certifications',
      type: 'certifications',
      title: cv2webData.certifications.sectionTitle || 'Certifications',
      data: cv2webData.certifications.certificationItems.map(item => ({
        title: item?.title || '',
        subtitle: item?.issuingOrganization || '',
        date: item?.issueDate || '',
        expiryDate: item?.expirationDate || null,
        credentialId: item?.credentialId || null,
        verificationUrl: item?.verificationUrl || null
      }))
    })
  }

  // Add languages section
  if (cv2webData.languages?.languageItems?.length) {
    adaptedData.sections.push({
      id: 'languages',
      type: 'languages',
      title: cv2webData.languages.sectionTitle || 'Languages',
      data: cv2webData.languages.languageItems.map(item => ({
        name: item?.language || '',
        proficiency: item?.proficiency || ''
      }))
    })
  }

  // Add courses section
  if (cv2webData.courses?.courseItems?.length) {
    adaptedData.sections.push({
      id: 'courses',
      type: 'courses',
      title: cv2webData.courses.sectionTitle || 'Courses',
      data: cv2webData.courses.courseItems.map(item => ({
        title: item?.title || '',
        institution: item?.institution || '',
        date: item?.completionDate || ''
      }))
    })
  }

  // Add volunteer section
  if (cv2webData.volunteer?.volunteerItems?.length) {
    adaptedData.sections.push({
      id: 'volunteer',
      type: 'timeline',
      title: cv2webData.volunteer.sectionTitle || 'Volunteer Experience',
      data: cv2webData.volunteer.volunteerItems.map(item => ({
        title: item?.role || '',
        subtitle: item?.organization || '',
        period: formatDateRange(item?.dateRange),
        details: item?.description ? [item.description] : []
      }))
    })
  }

  // Add publications section
  if (cv2webData.publications?.publications?.length) {
    adaptedData.sections.push({
      id: 'publications',
      type: 'publications',
      title: cv2webData.publications.sectionTitle || 'Publications',
      data: cv2webData.publications.publications.map(item => ({
        title: item?.title || '',
        journal: item?.publicationType || item?.publicationVenue || '',
        date: item?.publicationDate || '',
        link: item?.url || '#'
      }))
    })
  }

  // Add speaking engagements (using timeline since v2.1 doesn't have dedicated speaking section)
  if (cv2webData.speaking?.speakingEngagements?.length) {
    adaptedData.sections.push({
      id: 'speaking',
      type: 'timeline',
      title: cv2webData.speaking.sectionTitle || 'Speaking Engagements',
      data: cv2webData.speaking.speakingEngagements.map(item => ({
        title: item?.topic || '',
        subtitle: `${item?.eventName || ''}${item?.venue ? ', ' + item.venue : ''}`,
        period: item?.date || '',
        details: item?.role ? [item.role] : []
      }))
    })
  }

  // Add patents section
  if (cv2webData.patents?.patents?.length) {
    adaptedData.sections.push({
      id: 'patents',
      type: 'patents',
      title: cv2webData.patents.sectionTitle || 'Patents',
      data: cv2webData.patents.patents.map(item => ({
        title: item?.title || '',
        patentNumber: item?.patentNumber || '',
        status: item?.status || '',
        filingDate: item?.filingDate || '',
        description: item?.description || ''
      }))
    })
  }

  // Add memberships section
  if (cv2webData.memberships?.memberships?.length) {
    adaptedData.sections.push({
      id: 'memberships',
      type: 'memberships',
      title: cv2webData.memberships.sectionTitle || 'Professional Memberships',
      data: cv2webData.memberships.memberships.map(item => ({
        organization: item?.organization || '',
        role: item?.role || '',
        type: item?.membershipType || '',
        duration: formatDateRange(item?.dateRange)
      }))
    })
  }

  // Add hobbies section
  if (cv2webData.hobbies?.hobbies?.length) {
    adaptedData.sections.push({
      id: 'hobbies',
      type: 'hobbies',
      title: cv2webData.hobbies.sectionTitle || 'Hobbies & Interests',
      data: cv2webData.hobbies.hobbies
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

/**
 * Main adapter function for portfolio generator to use
 * This is what gets called from injected-data.tsx
 */
export function adaptCV2WebToTemplate(cv2webData: CV2WebData) {
  return adaptCV2WebData(cv2webData)
}