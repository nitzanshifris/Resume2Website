/**
 * CV Data Adapter - Maps RESUME2WEBSITE CV Editor data to v0_template_1 format
 * 
 * This adapter transforms the CV data from our extraction system 
 * to the format expected by the v0_template_1 portfolio template.
 */

import type { PortfolioData, HeroData, ContactData, ContactLink } from './data'

// ===== RESUME2WEBSITE TYPES (matching our backend schema) =====

interface Resume2WebsiteLocation {
  city?: string | null
  state?: string | null  
  country?: string | null
}

interface Resume2WebsiteProfessionalLink {
  platform?: string | null
  url?: string | null
}

interface Resume2WebsiteDateRange {
  startDate?: string | null
  endDate?: string | null
  isCurrent?: boolean | null
}

interface Resume2WebsiteHero {
  fullName?: string | null
  professionalTitle?: string | null
  summaryTagline?: string | null
  profilePhotoUrl?: string | null
}

interface Resume2WebsiteContact {
  email?: string | null
  phone?: string | null
  location?: Resume2WebsiteLocation | null
  professionalLinks?: Resume2WebsiteProfessionalLink[] | null
  availability?: string | null
}

interface Resume2WebsiteSummary {
  summaryText?: string | null
  yearsOfExperience?: number | null
  keySpecializations?: string[] | null
  careerHighlights?: string[] | null
}

interface Resume2WebsiteExperienceItem {
  jobTitle?: string | null
  companyName?: string | null
  location?: Resume2WebsiteLocation | null
  dateRange?: Resume2WebsiteDateRange | null
  responsibilitiesAndAchievements?: string[] | null
  technologiesUsed?: string[] | null
  summary?: string | null
}

interface Resume2WebsiteEducationItem {
  degree?: string | null
  fieldOfStudy?: string | null
  institution?: string | null
  location?: Resume2WebsiteLocation | null
  dateRange?: Resume2WebsiteDateRange | null
  gpa?: string | null
  honors?: string[] | null
  relevantCoursework?: string[] | null
}

interface Resume2WebsiteSkillCategory {
  categoryName?: string | null
  skills?: string[] | null
}

interface Resume2WebsiteSkills {
  sectionTitle?: string | null
  skillCategories?: Resume2WebsiteSkillCategory[] | null
  ungroupedSkills?: string[] | null
}

interface Resume2WebsiteProjectItem {
  title?: string | null
  description?: string | null
  technologiesUsed?: string[] | null
  projectUrl?: string | null
  imageUrl?: string | null
  githubUrl?: string | null
  demoUrl?: string | null
  videoUrl?: string | null
}

interface Resume2WebsiteLanguageItem {
  language?: string | null
  proficiency?: string | null
  certification?: string | null
}

interface Resume2WebsiteCertificationItem {
  title?: string | null
  issuingOrganization?: string | null
  issueDate?: string | null
  expirationDate?: string | null
  credentialId?: string | null
  verificationUrl?: string | null
}

interface Resume2WebsiteAchievementItem {
  value?: string | null
  label?: string | null
  contextOrDetail?: string | null
  timeframe?: string | null
}

interface Resume2WebsiteVolunteerItem {
  role?: string | null
  organization?: string | null
  dateRange?: Resume2WebsiteDateRange | null
  description?: string | null
}

interface Resume2WebsiteCourseItem {
  title?: string | null
  institution?: string | null
  completionDate?: string | null
}

interface Resume2WebsitePublicationItem {
  title?: string | null
  publicationType?: string | null
  publicationVenue?: string | null
  publicationDate?: string | null
  url?: string | null
}

interface Resume2WebsiteSpeakingItem {
  eventName?: string | null
  topic?: string | null
  date?: string | null
  venue?: string | null
  role?: string | null
  audienceSize?: number | null
}

interface Resume2WebsiteMembershipItem {
  organization?: string | null
  role?: string | null
  membershipType?: string | null
  dateRange?: Resume2WebsiteDateRange | null
}

// Main CV Data Interface (from our extraction system)
interface Resume2WebsiteData {
  hero?: Resume2WebsiteHero | null
  contact?: Resume2WebsiteContact | null
  summary?: Resume2WebsiteSummary | null
  experience?: {
    sectionTitle?: string | null
    experienceItems?: Resume2WebsiteExperienceItem[] | null
  } | null
  education?: {
    sectionTitle?: string | null
    educationItems?: Resume2WebsiteEducationItem[] | null
  } | null
  skills?: Resume2WebsiteSkills | null
  projects?: {
    sectionTitle?: string | null
    projectItems?: Resume2WebsiteProjectItem[] | null
  } | null
  languages?: {
    sectionTitle?: string | null
    languageItems?: Resume2WebsiteLanguageItem[] | null
  } | null
  certifications?: {
    sectionTitle?: string | null
    certificationItems?: Resume2WebsiteCertificationItem[] | null
  } | null
  achievements?: {
    sectionTitle?: string | null
    achievements?: Resume2WebsiteAchievementItem[] | null
  } | null
  volunteer?: {
    sectionTitle?: string | null
    volunteerItems?: Resume2WebsiteVolunteerItem[] | null
  } | null
  courses?: {
    sectionTitle?: string | null
    courseItems?: Resume2WebsiteCourseItem[] | null
  } | null
  publications?: {
    sectionTitle?: string | null
    publications?: Resume2WebsitePublicationItem[] | null
  } | null
  speaking?: {
    sectionTitle?: string | null
    speakingEngagements?: Resume2WebsiteSpeakingItem[] | null
  } | null
  memberships?: {
    sectionTitle?: string | null
    memberships?: Resume2WebsiteMembershipItem[] | null
  } | null
  hobbies?: {
    sectionTitle?: string | null
    hobbies?: string[] | null
  } | null
}

// ===== ADAPTER FUNCTIONS =====

function adaptHero(resume2websiteHero?: Resume2WebsiteHero | null): HeroData {
  return {
    fullName: resume2websiteHero?.fullName || "Portfolio Owner",
    professionalTitle: resume2websiteHero?.professionalTitle || "Professional",
    summaryTagline: resume2websiteHero?.summaryTagline || "Creating amazing experiences",
    profilePhotoUrl: resume2websiteHero?.profilePhotoUrl || null
  }
}

function adaptContact(resume2websiteContact?: Resume2WebsiteContact | null): ContactData {
  // Map professional links to template format
  const professionalLinks: ContactLink[] = []
  
  if (resume2websiteContact?.professionalLinks) {
    for (const link of resume2websiteContact.professionalLinks) {
      if (link?.platform && link?.url) {
        // Map platform names to template format
        const platformMap: Record<string, keyof typeof import('./data').socialIconMap> = {
          'linkedin': 'linkedin',
          'github': 'github', 
          'twitter': 'twitter',
          'portfolio': 'resume',
          'website': 'resume'
        }
        
        const mappedPlatform = platformMap[link.platform.toLowerCase()] || 'resume'
        professionalLinks.push({
          name: mappedPlatform,
          url: link.url
        })
      }
    }
  }

  return {
    email: resume2websiteContact?.email || "",
    phone: resume2websiteContact?.phone || "",
    location: {
      city: resume2websiteContact?.location?.city || "",
      country: resume2websiteContact?.location?.country || ""
    },
    professionalLinks,
    availability: resume2websiteContact?.availability || "Available for new opportunities",
    copyright: `© ${new Date().getFullYear()} Portfolio. All Rights Reserved.`
  }
}

function formatDateRange(dateRange?: Resume2WebsiteDateRange | null): string {
  if (!dateRange) return ""
  
  const start = dateRange.startDate || ""
  const end = dateRange.isCurrent ? "Present" : (dateRange.endDate || "")
  
  if (start && end) return `${start} - ${end}`
  if (start) return start
  if (end) return end
  return ""
}

function getRandomIcon(): keyof typeof import('./data').contentIconMap {
  const icons = ['Lightbulb', 'Palette', 'SwatchBook', 'Layers', 'DraftingCompass', 'Award', 'Star', 'ShieldCheck', 'Users'] as const
  return icons[Math.floor(Math.random() * icons.length)]
}

/**
 * Detects if a URL is a video link (YouTube, Vimeo, etc.)
 */
function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false
  // Ensure URL starts with http/https
  if (!url.match(/^https?:\/\//i)) return false
  
  const videoPatterns = [
    /youtube\.com\/watch/i,
    /youtu\.be\//i,
    /vimeo\.com\//i,
    /dailymotion\.com\//i,
    /twitch\.tv\//i,
    /\.mp4$/i,
    /\.webm$/i,
    /\.ogg$/i
  ]
  return videoPatterns.some(pattern => pattern.test(url))
}

/**
 * Detects if a URL is an image
 */
function isImageUrl(url: string | null | undefined): boolean {
  if (!url) return false
  const imagePatterns = [
    /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i,
    /images\.unsplash\.com/i,
    /imgur\.com/i,
    /cloudinary\.com/i
  ]
  return imagePatterns.some(pattern => pattern.test(url))
}

/**
 * Detects if a URL is a GitHub repository
 */
function isGitHubUrl(url: string | null | undefined): boolean {
  if (!url) return false
  // Ensure URL starts with http/https and has valid GitHub repo format
  return /^https?:\/\/github\.com\/[\w-]+\/[\w-]+$/i.test(url.split('?')[0].split('#')[0])
}

/**
 * Detects if a URL is a tweet
 */
function isTweetUrl(url: string | null | undefined): boolean {
  if (!url) return false
  return /(twitter\.com|x\.com)\/\w+\/status\/\d+/i.test(url)
}

/**
 * Extracts tweet ID from a Twitter/X URL
 */
function extractTweetId(url: string): string | null {
  const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/i)
  return match ? match[1] : null
}

/**
 * Determines the best view mode based on available data
 */
function determineViewMode(item: {
  projectUrl?: string | null
  imageUrl?: string | null
  videoUrl?: string | null
  githubUrl?: string | null
  demoUrl?: string | null
}): { viewMode: string; primaryUrl?: string; images?: string[]; videoUrl?: string; githubUrl?: string; tweetId?: string } {
  // Check for video URLs first (highest priority for visual impact)
  if (item.videoUrl && isVideoUrl(item.videoUrl)) {
    return { viewMode: 'video', videoUrl: item.videoUrl }
  }
  
  // Check demo URL for video
  if (item.demoUrl && isVideoUrl(item.demoUrl)) {
    return { viewMode: 'video', videoUrl: item.demoUrl }
  }
  
  // Check for GitHub
  if (item.githubUrl && isGitHubUrl(item.githubUrl)) {
    return { viewMode: 'github', githubUrl: item.githubUrl }
  }
  
  // Check for images
  if (item.imageUrl && isImageUrl(item.imageUrl)) {
    return { viewMode: 'images', images: [item.imageUrl] }
  }
  
  // Check for tweets
  if (item.projectUrl && isTweetUrl(item.projectUrl)) {
    const tweetId = extractTweetId(item.projectUrl)
    if (tweetId) {
      return { viewMode: 'tweet', tweetId }
    }
  }
  
  // Default to text mode with link if available
  if (item.projectUrl || item.demoUrl) {
    return { viewMode: 'uri', primaryUrl: item.projectUrl || item.demoUrl }
  }
  
  return { viewMode: 'text' }
}

/**
 * Main adapter function - converts RESUME2WEBSITE data to template format
 */
export function adaptResume2WebsiteToTemplate(resume2websiteData: Resume2WebsiteData): PortfolioData {
  return {
    hero: adaptHero(resume2websiteData.hero),
    contact: adaptContact(resume2websiteData.contact),
    
    summary: {
      sectionTitle: resume2websiteData.summary?.summaryText ? "Professional Summary" : "About Me",
      summaryText: resume2websiteData.summary?.summaryText || "Passionate professional dedicated to excellence and innovation."
    },

    experience: {
      sectionTitle: resume2websiteData.experience?.sectionTitle || "Experience",
      experienceItems: (resume2websiteData.experience?.experienceItems || []).map(item => ({
        title: item?.jobTitle || "Professional Role",
        company: item?.companyName || "Company",
        location: `${item?.location?.city || ""} ${item?.location?.country || ""}`.trim() || "Location",
        startDate: item?.dateRange?.startDate || "",
        endDate: item?.dateRange?.isCurrent ? "Present" : (item?.dateRange?.endDate || ""),
        description: item?.responsibilitiesAndAchievements?.join(". ") || item?.summary || "Professional experience description."
      }))
    },

    education: {
      sectionTitle: resume2websiteData.education?.sectionTitle || "Education",
      educationItems: (resume2websiteData.education?.educationItems || []).map(item => ({
        institution: item?.institution || "Educational Institution",
        degree: item?.degree || "Degree",
        years: formatDateRange(item?.dateRange),
        description: item?.relevantCoursework?.join(", ") || item?.honors?.join(", ") || "Educational achievement."
      }))
    },

    skills: {
      sectionTitle: resume2websiteData.skills?.sectionTitle || "Skills",
      skillCategories: (resume2websiteData.skills?.skillCategories || []).map(category => ({
        categoryName: category?.categoryName || "Skills",
        skills: (category?.skills || []).map(skill => {
          // Check if the skill string contains detailed text (e.g., "Python - Expert level with 5+ years experience")
          const skillStr = skill || "Skill"
          const dashIndex = skillStr.indexOf(' - ')
          if (dashIndex > -1) {
            return {
              name: skillStr.substring(0, dashIndex).trim(),
              detailedDisplayText: skillStr
            }
          }
          return { name: skillStr }
        })
      })),
      ungroupedSkills: (resume2websiteData.skills?.ungroupedSkills || []).map(skill => {
        const skillStr = skill || "Skill"
        const dashIndex = skillStr.indexOf(' - ')
        if (dashIndex > -1) {
          return {
            name: skillStr.substring(0, dashIndex).trim(),
            detailedDisplayText: skillStr
          }
        }
        return { name: skillStr }
      })
    },

    projects: {
      sectionTitle: resume2websiteData.projects?.sectionTitle || "Projects",
      projectItems: (resume2websiteData.projects?.projectItems || []).map((item, index) => {
        // Determine the best view mode based on available URLs
        const viewModeData = determineViewMode({
          projectUrl: item?.projectUrl,
          imageUrl: item?.imageUrl,
          videoUrl: item?.videoUrl,
          githubUrl: item?.githubUrl,
          demoUrl: item?.demoUrl
        } as any)
        
        return {
          title: item?.title || "Project",
          description: item?.description || "Project description.",
          link: item?.projectUrl || "#",
          icon: getRandomIcon(),
          viewMode: viewModeData.viewMode as any,
          textVariant: "detailed" as const,
          // Add specific data based on view mode
          ...(viewModeData.videoUrl && { videoUrl: viewModeData.videoUrl }),
          ...(viewModeData.githubUrl && { githubUrl: viewModeData.githubUrl }),
          ...(viewModeData.images && { images: viewModeData.images }),
          ...(viewModeData.tweetId && { tweetId: viewModeData.tweetId }),
          ...(viewModeData.primaryUrl && { linkUrl: viewModeData.primaryUrl }),
          // Include technologies if available
          ...(item?.technologiesUsed && { technologies: item.technologiesUsed })
        }
      })
    },

    languages: {
      sectionTitle: resume2websiteData.languages?.sectionTitle || "Languages",
      languageItems: (resume2websiteData.languages?.languageItems || []).map(item => ({
        language: item?.language || "Language",
        proficiency: item?.proficiency || "Proficient"
      }))
    },

    certifications: {
      sectionTitle: resume2websiteData.certifications?.sectionTitle || "Certifications",
      certificationItems: (resume2websiteData.certifications?.certificationItems || []).map((item, index) => ({
        title: item?.title || "Certification",
        issuingBody: item?.issuingOrganization || "Issuing Body",
        year: item?.issueDate || "",
        icon: getRandomIcon(),
        viewMode: item?.verificationUrl ? "uri" as const : "text" as const,
        textVariant: "detailed" as const,
        ...(item?.verificationUrl && { linkUrl: item.verificationUrl, link: item.verificationUrl })
      }))
    },

    achievements: {
      sectionTitle: resume2websiteData.achievements?.sectionTitle || "Achievements",
      achievementItems: (resume2websiteData.achievements?.achievements || []).map((item, index) => ({
        title: item?.label || "Achievement",
        description: `${item?.value || ""} ${item?.contextOrDetail || ""}`.trim() || "Professional achievement.",
        year: item?.timeframe || "",
        icon: getRandomIcon(),
        viewMode: "text" as const,
        textVariant: "detailed" as const
      }))
    },

    volunteer: {
      sectionTitle: resume2websiteData.volunteer?.sectionTitle || "Volunteer Experience",
      volunteerItems: (resume2websiteData.volunteer?.volunteerItems || []).map((item, index) => ({
        role: item?.role || "Volunteer Role",
        organization: item?.organization || "Organization",
        period: formatDateRange(item?.dateRange),
        description: item?.description || "Volunteer experience description.",
        icon: getRandomIcon(),
        viewMode: "text" as const,
        textVariant: "detailed" as const
      }))
    },

    courses: {
      sectionTitle: resume2websiteData.courses?.sectionTitle || "Courses",
      courseItems: (resume2websiteData.courses?.courseItems || []).map((item, index) => ({
        title: item?.title || "Course",
        institution: item?.institution || "Institution",
        year: item?.completionDate || "",
        icon: getRandomIcon(),
        viewMode: "text" as const,
        textVariant: "detailed" as const
      }))
    },

    publications: {
      sectionTitle: resume2websiteData.publications?.sectionTitle || "Publications",
      publicationItems: (resume2websiteData.publications?.publications || []).map((item, index) => {
        // Check if the publication URL is a video or special link
        const hasUrl = item?.url && item.url !== "#"
        let viewMode: string = "text"
        
        if (hasUrl) {
          if (isVideoUrl(item.url)) {
            viewMode = "video"
          } else {
            viewMode = "uri"
          }
        }
        
        return {
          title: item?.title || "Publication",
          journal: item?.publicationVenue || "Publication Venue",
          year: item?.publicationDate || "",
          link: item?.url || "#",
          icon: getRandomIcon(),
          viewMode: viewMode as const,
          textVariant: "detailed" as const,
          ...(viewMode === "video" && { videoUrl: item?.url }),
          ...(viewMode === "uri" && { linkUrl: item?.url })
        }
      })
    },

    speakingEngagements: {
      sectionTitle: resume2websiteData.speaking?.sectionTitle || "Speaking Engagements",
      engagementItems: (resume2websiteData.speaking?.speakingEngagements || []).map((item, index) => {
        // Check if venue contains a video URL (sometimes speakers put YouTube links in venue)
        const venueIsVideoUrl = item?.venue && isVideoUrl(item.venue)
        
        return {
          title: item?.topic || "Speaking Engagement",
          event: item?.eventName || "Event",
          year: item?.date || "",
          location: venueIsVideoUrl ? "Online Event" : (item?.venue || "Venue"),
          icon: getRandomIcon(),
          viewMode: venueIsVideoUrl ? "video" as const : "text" as const,
          textVariant: "detailed" as const,
          ...(venueIsVideoUrl && { videoUrl: item?.venue })
        }
      })
    },

    memberships: {
      sectionTitle: resume2websiteData.memberships?.sectionTitle || "Professional Memberships",
      membershipItems: (resume2websiteData.memberships?.memberships || []).map(item => ({
        organization: item?.organization || "Organization",
        role: item?.role || "Member",
        period: formatDateRange(item?.dateRange),
        description: item?.membershipType || undefined,
        icon: getRandomIcon(),
        viewMode: "text" as const,
        textVariant: item?.membershipType ? "detailed" as const : "simple" as const
      }))
    },

    hobbies: {
      sectionTitle: resume2websiteData.hobbies?.sectionTitle || "Hobbies & Interests",
      hobbyItems: (resume2websiteData.hobbies?.hobbies || []).map((hobby, index) => ({
        title: hobby || "Interest",
        icon: getRandomIcon(),
        viewMode: "text" as const,
        textVariant: "detailed" as const,
        description: "Add a description for this hobby"
      }))
    },

    // Template expects testimonials but CV data doesn't have them
    testimonials: {
      sectionTitle: "Testimonials",
      testimonialItems: []
    }
  }
}

/**
 * Fetches CV data from RESUME2WEBSITE API and adapts it to template format
 */
export async function fetchAndAdaptCVData(jobId: string, sessionId: string): Promise<PortfolioData> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/cv/${jobId}`, {
      headers: {
        'X-Session-ID': sessionId
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch CV data: ${response.status}`)
    }

    const data = await response.json()
    const resume2websiteData: Resume2WebsiteData = data.cv_data

    return adaptResume2WebsiteToTemplate(resume2websiteData)
  } catch (error) {
    console.error('Error fetching CV data:', error)
    // Return fallback data if fetch fails
    return adaptResume2WebsiteToTemplate({})
  }
}

/**
 * Fetches the most recent CV for a user and adapts it to template format
 */
export async function fetchLatestCVData(sessionId: string): Promise<PortfolioData> {
  try {
    // First check if we have injected data (generated portfolio)
    if (typeof window !== 'undefined') {
      try {
        const { portfolioData, useRealData } = await import('./injected-data')
        if (useRealData && portfolioData) {
          console.log('📋 Using injected CV data from generated portfolio')
          return portfolioData
        }
      } catch (e) {
        // No injected data, continue with fetch
      }
    }
    
    // Check if we're in standalone mode (no backend available)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'
    
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 3000)
    })
    
    // Create the fetch promise
    const fetchPromise = fetch(`${apiUrl}/api/v1/my-cvs`, {
      headers: {
        'X-Session-ID': sessionId
      }
    })
    
    // Race between fetch and timeout
    const response = await Promise.race([fetchPromise, timeoutPromise]) as Response

    if (!response.ok) {
      throw new Error(`Failed to fetch CV list: ${response.status}`)
    }

    const data = await response.json()
    const completedCVs = data.cvs?.filter((cv: any) => cv.status === 'completed') || []
    
    // Sort by upload_date descending (most recent first)
    completedCVs.sort((a: any, b: any) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime())
    
    // Get the most recent CV with valid data
    const latestCV = completedCVs.find((cv: any) => cv.cv_data)
    
    if (!latestCV) {
      throw new Error('No completed CVs found')
    }

    const resume2websiteData: Resume2WebsiteData = JSON.parse(latestCV.cv_data)
    return adaptResume2WebsiteToTemplate(resume2websiteData)
  } catch (error) {
    console.error('Error fetching latest CV data:', error)
    // Return fallback data if fetch fails
    return adaptResume2WebsiteToTemplate({})
  }
}