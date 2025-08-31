/**
 * CV Data Adapter - Maps CV2WEB CV Editor data to v0_template_1 format
 * 
 * This adapter transforms the CV data from our extraction system 
 * to the format expected by the v0_template_1 portfolio template.
 */

import type { PortfolioData, HeroData, ContactData, ContactLink } from './data'

// ===== CV2WEB TYPES (matching our backend schema) =====

interface CV2WebLocation {
  city?: string | null
  state?: string | null  
  country?: string | null
}

// SmartCard fields that can be added to any section
interface SmartCardFields {
  videoUrl?: string | null
  githubUrl?: string | null
  imageUrl?: string | null
  linkUrl?: string | null
  hasLink?: boolean | null
  linkType?: 'website' | 'video' | 'github' | 'image' | 'pdf' | 'tweet' | null
  viewMode?: 'text' | 'timeline' | 'video' | 'github' | 'images' | 'tweet' | 'uri' | null
  textVariant?: 'detailed' | 'simple' | null
}

interface CV2WebProfessionalLink {
  platform?: string | null
  url?: string | null
}

interface CV2WebDateRange {
  startDate?: string | null
  endDate?: string | null
  isCurrent?: boolean | null
}

interface CV2WebHero {
  fullName?: string | null
  professionalTitle?: string | null
  summaryTagline?: string | null
  profilePhotoUrl?: string | null
}

interface CV2WebContact {
  // Contact Section fields (main contact info)
  email?: string | null
  phone?: string | null
  location?: CV2WebLocation | null  // Current location, NOT place of birth
  professionalLinks?: CV2WebProfessionalLink[] | null
  availability?: string | null
  
  // Personal Information Footer fields (demographics - separate section)
  placeOfBirth?: string | null
  nationality?: string | null
  drivingLicense?: string | null
  dateOfBirth?: string | null
  maritalStatus?: string | null
  visaStatus?: string | null
}

interface CV2WebSummary {
  summaryText?: string | null
  yearsOfExperience?: number | null
  keySpecializations?: string[] | null
  careerHighlights?: string[] | null
}

interface CV2WebExperienceItem {
  jobTitle?: string | null
  companyName?: string | null
  location?: CV2WebLocation | null
  dateRange?: CV2WebDateRange | null
  responsibilitiesAndAchievements?: string[] | null
  technologiesUsed?: string[] | null
  summary?: string | null
  duration?: string | null
  employmentType?: string | null
  remoteWork?: string | null
  companyLogo?: string | null
}

interface CV2WebEducationItem {
  degree?: string | null
  fieldOfStudy?: string | null
  institution?: string | null
  location?: CV2WebLocation | null
  dateRange?: CV2WebDateRange | null
  description?: string | null
  gpa?: string | null
  honors?: string[] | null
  minors?: string[] | null
  relevantCoursework?: string[] | null
  exchangePrograms?: string[] | null
}

interface CV2WebSkillCategory {
  categoryName?: string | null
  skills?: string[] | null
}

interface CV2WebSkills {
  sectionTitle?: string | null
  skillCategories?: CV2WebSkillCategory[] | null
  ungroupedSkills?: string[] | null
}

interface CV2WebProjectItem extends SmartCardFields {
  title?: string | null
  description?: string | null
  technologiesUsed?: string[] | null
  projectUrl?: string | null
  demoUrl?: string | null
  // Note: imageUrl, videoUrl, githubUrl already included in SmartCardFields
  // SmartCard fields inherited from SmartCardFields
}

interface CV2WebLanguageItem {
  language?: string | null
  proficiency?: string | null
  certification?: string | null
}

interface CV2WebCertificationItem extends SmartCardFields {
  title?: string | null
  description?: string | null
  issuingOrganization?: string | null
  issueDate?: string | null
  expirationDate?: string | null
  credentialId?: string | null
  verificationUrl?: string | null
  // SmartCard fields inherited from SmartCardFields
}

interface CV2WebAchievementItem extends SmartCardFields {
  value?: string | null
  label?: string | null
  contextOrDetail?: string | null
  timeframe?: string | null
  // SmartCard fields inherited from SmartCardFields
}

interface CV2WebVolunteerItem extends SmartCardFields {
  role?: string | null
  organization?: string | null
  dateRange?: CV2WebDateRange | null
  description?: string | null
  // SmartCard fields inherited from SmartCardFields
}

interface CV2WebCourseItem extends SmartCardFields {
  title?: string | null
  institution?: string | null
  completionDate?: string | null
  certificateNumber?: string | null
  certificateUrl?: string | null
  // SmartCard fields inherited from SmartCardFields
}

interface CV2WebPublicationItem extends SmartCardFields {
  title?: string | null
  description?: string | null
  authors?: string[] | null
  publicationType?: string | null
  journalName?: string | null
  conferenceName?: string | null
  publicationVenue?: string | null  // Backwards compatibility
  publicationDate?: string | null
  doi?: string | null
  publicationUrl?: string | null
  url?: string | null  // Backwards compatibility
  abstract?: string | null
  // SmartCard fields inherited from SmartCardFields
}

interface CV2WebSpeakingItem extends SmartCardFields {
  title?: string | null
  description?: string | null
  eventName?: string | null
  topic?: string | null
  date?: string | null
  venue?: string | null
  role?: string | null
  eventUrl?: string | null
  presentationUrl?: string | null
  audienceSize?: number | null
  // Note: videoUrl already included in SmartCardFields
  // SmartCard fields inherited from SmartCardFields
}

interface CV2WebMembershipItem extends SmartCardFields {
  organization?: string | null
  role?: string | null
  membershipType?: string | null
  dateRange?: CV2WebDateRange | null
  // SmartCard fields inherited from SmartCardFields
}

interface CV2WebHobbyItem extends SmartCardFields {
  title?: string | null
  description?: string | null
  // SmartCard fields inherited from SmartCardFields
}

// Main CV Data Interface (from our extraction system)
interface CV2WebData {
  hero?: CV2WebHero | null
  contact?: CV2WebContact | null
  summary?: CV2WebSummary | null
  experience?: {
    sectionTitle?: string | null
    experienceItems?: CV2WebExperienceItem[] | null
  } | null
  education?: {
    sectionTitle?: string | null
    educationItems?: CV2WebEducationItem[] | null
  } | null
  skills?: CV2WebSkills | null
  projects?: {
    sectionTitle?: string | null
    projectItems?: CV2WebProjectItem[] | null
  } | null
  languages?: {
    sectionTitle?: string | null
    languageItems?: CV2WebLanguageItem[] | null
  } | null
  certifications?: {
    sectionTitle?: string | null
    certificationItems?: CV2WebCertificationItem[] | null
  } | null
  achievements?: {
    sectionTitle?: string | null
    achievements?: CV2WebAchievementItem[] | null
  } | null
  volunteer?: {
    sectionTitle?: string | null
    volunteerItems?: CV2WebVolunteerItem[] | null
  } | null
  courses?: {
    sectionTitle?: string | null
    courseItems?: CV2WebCourseItem[] | null
  } | null
  publications?: {
    sectionTitle?: string | null
    publications?: CV2WebPublicationItem[] | null
  } | null
  speaking?: {
    sectionTitle?: string | null
    speakingEngagements?: CV2WebSpeakingItem[] | null
  } | null
  memberships?: {
    sectionTitle?: string | null
    memberships?: CV2WebMembershipItem[] | null
  } | null
  hobbies?: {
    sectionTitle?: string | null
    hobbies?: string[] | null  // Legacy string list
    hobbyItems?: CV2WebHobbyItem[] | null  // SmartCard format
  } | null
}

// ===== ADAPTER FUNCTIONS =====

function adaptHero(cv2webHero?: CV2WebHero | null): HeroData {
  return {
    fullName: cv2webHero?.fullName || "Portfolio Owner",
    professionalTitle: cv2webHero?.professionalTitle || "Professional",
    profilePhotoUrl: cv2webHero?.profilePhotoUrl || null
  }
}

function adaptContact(cv2webContact?: CV2WebContact | null): ContactData {
  // Map professional links to template format
  const professionalLinks: ContactLink[] = []
  
  if (cv2webContact?.professionalLinks) {
    for (const link of cv2webContact.professionalLinks) {
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
    // Contact Section fields (displayed in main contact area)
    email: cv2webContact?.email || "",
    phone: cv2webContact?.phone || "",
    location: {  // Current location for contact purposes
      city: cv2webContact?.location?.city || "",
      country: cv2webContact?.location?.country || "",
      state: cv2webContact?.location?.state || ""
    },
    professionalLinks,
    availability: cv2webContact?.availability || "Available for new opportunities",
    copyright: `© ${new Date().getFullYear()} Portfolio. All Rights Reserved.`,
    
    // Personal Information Footer fields (displayed separately at bottom)
    placeOfBirth: cv2webContact?.placeOfBirth || null,
    nationality: cv2webContact?.nationality || null,
    drivingLicense: cv2webContact?.drivingLicense || null,
    dateOfBirth: cv2webContact?.dateOfBirth || null,
    maritalStatus: cv2webContact?.maritalStatus || null,
    visaStatus: cv2webContact?.visaStatus || null
  }
}

function cleanSummaryText(text: string): string {
  if (!text) return "";

  // Split only when a list marker starts a line/sentence: -, – , — , •
  const parts = text
    .split(/(?:^|\n|\.\s*)\s*[-–—•]\s+/g)
    .map(s => s.trim())
    .filter(Boolean);

  // If it looks like a list, join into sentences
  if (parts.length > 1) {
    return parts.join('. ').replace(/\s*\.\s*$/,'');
  }
  return text.trim();
}

function formatDateRange(dateRange?: CV2WebDateRange | null): string {
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
    return { viewMode: 'video', videoUrl: item.videoUrl || undefined }
  }
  
  // Check demo URL for video
  if (item.demoUrl && isVideoUrl(item.demoUrl)) {
    return { viewMode: 'video', videoUrl: item.demoUrl || undefined }
  }
  
  // Check for GitHub
  if (item.githubUrl && isGitHubUrl(item.githubUrl)) {
    return { viewMode: 'github', githubUrl: item.githubUrl || undefined }
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
    return { viewMode: 'uri', primaryUrl: (item.projectUrl || item.demoUrl) || undefined }
  }
  
  return { viewMode: 'text' }
}

/**
 * Main adapter function - converts CV2WEB data to template format
 */
export function adaptCV2WebToTemplate(cv2webData: CV2WebData): PortfolioData {
  return {
    hero: adaptHero(cv2webData.hero),
    contact: adaptContact(cv2webData.contact),
    
    summary: {
      sectionTitle: cv2webData.summary?.summaryText ? "Professional Summary" : "",
      summaryText: cleanSummaryText(cv2webData.summary?.summaryText || "")
    },

    experience: {
      sectionTitle: cv2webData.experience?.sectionTitle || "Experience",
      experienceItems: (cv2webData.experience?.experienceItems || []).map(item => {
        // Create additionalInfo array from technologiesUsed and other metadata
        const additionalInfo: Array<{label: string, value: string}> = [];
        
        // Add technologies as individual tags with "Tools" label
        if (item?.technologiesUsed && Array.isArray(item.technologiesUsed)) {
          item.technologiesUsed.forEach(tech => {
            additionalInfo.push({
              label: "Tools",
              value: tech
            });
          });
        }
        
        // Add employment type if available
        if (item?.employmentType) {
          additionalInfo.push({
            label: "Type",
            value: item.employmentType
          });
        }
        
        // Add remote work status if available
        if (item?.remoteWork) {
          additionalInfo.push({
            label: "Mode",
            value: item.remoteWork
          });
        }
        
        return {
          title: item?.jobTitle || "Professional Role",
          company: item?.companyName || "",
          location: `${item?.location?.city || ""} ${item?.location?.country || ""}`.trim() || "Location",
          startDate: item?.dateRange?.startDate || "",
          endDate: item?.dateRange?.isCurrent ? "Present" : (item?.dateRange?.endDate || ""),
          description: item?.responsibilitiesAndAchievements?.join(". ") || item?.summary || "Professional experience description.",
          // Pass through additional fields for display
          duration: item?.duration || null,
          companyLogo: item?.companyLogo || null,
          // Add the formatted additionalInfo array for tag display
          additionalInfo: additionalInfo.length > 0 ? additionalInfo : undefined
        };
      })
    },

    education: {
      sectionTitle: cv2webData.education?.sectionTitle || "Education",
      layoutConfig: {
        layoutType: 'horizontal-carousel',
        autoSizing: false,
        manualSize: 'small',
        shape: 'very-tall',
        height: 'standard'
      },
      educationItems: (cv2webData.education?.educationItems || []).map(item => ({
        institution: item?.institution || "Educational Institution",
        degree: item?.degree || "Degree",
        years: formatDateRange(item?.dateRange),
        description: item?.description || item?.relevantCoursework?.join(", ") || item?.honors?.join(", ") || "Educational achievement.",
        // Pass through all tag fields for the template to display
        gpa: item?.gpa || undefined,
        honors: item?.honors || undefined,
        minors: item?.minors || undefined,
        relevantCoursework: item?.relevantCoursework || undefined,
        exchangePrograms: item?.exchangePrograms || undefined,
        fieldOfStudy: item?.fieldOfStudy || undefined,
        location: item?.location || undefined
      }))
    },

    skills: {
      sectionTitle: cv2webData.skills?.sectionTitle || "Skills",
      skillCategories: (cv2webData.skills?.skillCategories || []).map(category => ({
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
      ungroupedSkills: (cv2webData.skills?.ungroupedSkills || []).map(skill => {
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
      sectionTitle: cv2webData.projects?.sectionTitle || "Projects",
      layoutConfig: {
        layoutType: 'horizontal-carousel',
        autoSizing: false,
        manualSize: 'small',
        shape: 'very-tall',
        height: 'standard'
      },
      projectItems: (cv2webData.projects?.projectItems || []).map((item, index) => {
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
      sectionTitle: cv2webData.languages?.sectionTitle || "Languages",
      languageItems: (cv2webData.languages?.languageItems || []).map(item => ({
        language: item?.language || "",
        proficiency: item?.proficiency || ""  // Keep exact proficiency levels (Native, Fluent, Intermediate, Beginner, etc.)
      }))
    },

    certifications: {
      sectionTitle: cv2webData.certifications?.sectionTitle || "Certifications",
      certificationItems: (cv2webData.certifications?.certificationItems || []).map((item, index) => ({
        title: item?.title || "Certification",
        description: item?.description || `${item?.issuingOrganization || "Issuing Body"}${item?.issueDate ? `, ${item?.issueDate}` : ""}`,
        issuingBody: item?.issuingOrganization || "Issuing Body",
        year: item?.issueDate || "",
        expirationDate: item?.expirationDate || null,
        credentialId: item?.credentialId || null,
        icon: getRandomIcon(),
        viewMode: item?.verificationUrl ? "uri" as const : "text" as const,
        textVariant: "detailed" as const,
        ...(item?.verificationUrl && { linkUrl: item.verificationUrl, link: item.verificationUrl })
      }))
    },

    achievements: {
      sectionTitle: cv2webData.achievements?.sectionTitle || "Achievements",
      achievementItems: (cv2webData.achievements?.achievements || []).map((item, index) => ({
        title: item?.label || "Achievement",
        description: `${item?.value || ""} ${item?.contextOrDetail || ""}`.trim() || "Professional achievement.",
        year: item?.timeframe || "",
        icon: getRandomIcon(),
        viewMode: "text" as const,
        textVariant: "detailed" as const
      }))
    },

    volunteer: {
      sectionTitle: cv2webData.volunteer?.sectionTitle || "Volunteer Experience",
      layoutConfig: {
        layoutType: 'horizontal-carousel',
        autoSizing: false,
        manualSize: 'small',  // Changed from default to small for volunteer cards
        shape: 'standard',
        height: 'standard'
      },
      volunteerItems: (cv2webData.volunteer?.volunteerItems || []).map((item, index) => {
        // Determine view mode based on available URLs
        const viewModeData = determineViewMode({
          projectUrl: item?.linkUrl,
          imageUrl: item?.imageUrl,
          videoUrl: item?.videoUrl,
          githubUrl: item?.githubUrl
        })
        
        return {
          title: item?.role || "Volunteer Role",
          subtitle: item?.organization || "Organization",
          description: item?.description || "Volunteer experience description.",
          period: formatDateRange(item?.dateRange),
          // Keep role and organization for backwards compatibility
          role: item?.role || "Volunteer Role",
          organization: item?.organization || "Organization",
          icon: getRandomIcon(),
          viewMode: viewModeData.viewMode as any,
          textVariant: "detailed" as const,
          // Add URL data based on view mode
          ...(viewModeData.videoUrl && { videoUrl: viewModeData.videoUrl }),
          ...(viewModeData.githubUrl && { githubUrl: viewModeData.githubUrl }),
          ...(viewModeData.images && { images: viewModeData.images }),
          ...(viewModeData.primaryUrl && { linkUrl: viewModeData.primaryUrl })
        }
      })
    },

    courses: {
      sectionTitle: cv2webData.courses?.sectionTitle || "Courses",
      courseItems: (cv2webData.courses?.courseItems || []).map((item, index) => ({
        title: item?.title || "Course",
        institution: item?.institution || "Institution",
        year: item?.completionDate || "",
        icon: getRandomIcon(),
        viewMode: "text" as const,
        textVariant: "detailed" as const
      }))
    },

    publications: {
      sectionTitle: cv2webData.publications?.sectionTitle || "Publications",
      publicationItems: (cv2webData.publications?.publications || []).map((item, index) => {
        // Determine view mode based on available URLs
        const viewModeData = determineViewMode({
          projectUrl: item?.publicationUrl || item?.url,
          videoUrl: item?.videoUrl,
          imageUrl: item?.imageUrl,
          githubUrl: item?.githubUrl
        })
        
        return {
          title: item?.title || "Publication",
          subtitle: item?.journalName || item?.conferenceName || item?.publicationVenue || "Publication Venue",
          description: item?.description || `Published research work${item?.publicationDate ? ` in ${item?.publicationDate}` : ""}.`,
          journal: item?.journalName || item?.conferenceName || item?.publicationVenue || "Publication Venue",
          year: item?.publicationDate || "",
          authors: item?.authors || [],
          doi: item?.doi || null,
          link: item?.publicationUrl || item?.url || "#",
          icon: getRandomIcon(),
          viewMode: viewModeData.viewMode as any,
          textVariant: "detailed" as const,
          // Add URL data based on view mode
          ...(viewModeData.videoUrl && { videoUrl: viewModeData.videoUrl }),
          ...(viewModeData.images && { images: viewModeData.images }),
          ...(viewModeData.primaryUrl && { linkUrl: viewModeData.primaryUrl })
        }
      })
    },

    speakingEngagements: {
      sectionTitle: cv2webData.speaking?.sectionTitle || "Speaking Engagements",
      engagementItems: (cv2webData.speaking?.speakingEngagements || []).map((item, index) => {
        // Determine view mode based on available URLs
        const viewModeData = determineViewMode({
          videoUrl: item?.videoUrl,
          projectUrl: item?.presentationUrl || item?.eventUrl,
          imageUrl: item?.imageUrl,
          githubUrl: item?.githubUrl
        })
        
        return {
          title: item?.title || item?.topic || "Speaking Engagement",
          description: item?.description || `${item?.eventName || "Event"} - ${item?.venue || "Venue"}`,
          event: item?.eventName || "Event",
          year: item?.date || "",
          location: item?.venue || "Venue",
          role: item?.role || null,
          audienceSize: item?.audienceSize || null,
          icon: getRandomIcon(),
          viewMode: viewModeData.viewMode as any,
          textVariant: "detailed" as const,
          // Add URL data based on view mode
          ...(viewModeData.videoUrl && { videoUrl: viewModeData.videoUrl }),
          ...(viewModeData.images && { images: viewModeData.images }),
          ...(viewModeData.primaryUrl && { linkUrl: viewModeData.primaryUrl })
        }
      })
    },

    memberships: {
      sectionTitle: cv2webData.memberships?.sectionTitle || "Professional Memberships",
      membershipItems: (cv2webData.memberships?.memberships || []).map(item => ({
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
      sectionTitle: cv2webData.hobbies?.sectionTitle || "Hobbies",
      hobbyItems: (() => {
        // Use hobbyItems if available (SmartCard format), otherwise use legacy hobbies list
        if (cv2webData.hobbies?.hobbyItems && cv2webData.hobbies.hobbyItems.length > 0) {
          return cv2webData.hobbies.hobbyItems.map((item, index) => {
            // Determine view mode based on available URLs
            const viewModeData = determineViewMode({
              projectUrl: item?.linkUrl,
              imageUrl: item?.imageUrl,
              videoUrl: item?.videoUrl,
              githubUrl: item?.githubUrl
            })
            
            return {
              title: item?.title || "Interest",
              description: item?.description || null,
              icon: getRandomIcon(),
              viewMode: viewModeData.viewMode as any,
              textVariant: item?.description ? "detailed" as const : "simple" as const,
              // Add URL data based on view mode
              ...(viewModeData.videoUrl && { videoUrl: viewModeData.videoUrl }),
              ...(viewModeData.images && { images: viewModeData.images }),
              ...(viewModeData.githubUrl && { githubUrl: viewModeData.githubUrl }),
              ...(viewModeData.primaryUrl && { linkUrl: viewModeData.primaryUrl }),
              ...(viewModeData.tweetId && { tweetId: viewModeData.tweetId })
            }
          })
        } else {
          // Fallback to legacy hobbies string list
          return (cv2webData.hobbies?.hobbies || []).map((hobby, index) => ({
            title: hobby || "Interest",
            icon: getRandomIcon(),
            viewMode: "text" as const,
            textVariant: "simple" as const  // Hobbies use simple text overlay
          }))
        }
      })()
    },

    // Template expects testimonials but CV data doesn't have them
    testimonials: {
      sectionTitle: "Testimonials",
      testimonialItems: []
    }
  }
}

/**
 * Fetches CV data from CV2WEB API and adapts it to template format
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
    const cv2webData: CV2WebData = data.cv_data

    return adaptCV2WebToTemplate(cv2webData)
  } catch (error) {
    console.error('Error fetching CV data:', error)
    // Return fallback data if fetch fails
    return adaptCV2WebToTemplate({})
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
        const { portfolioData } = await import('./injected-data')
        if (portfolioData) {
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

    const cv2webData: CV2WebData = JSON.parse(latestCV.cv_data)
    return adaptCV2WebToTemplate(cv2webData)
  } catch (error) {
    console.error('Error fetching latest CV data:', error)
    // Return fallback data if fetch fails
    return adaptCV2WebToTemplate({})
  }
}