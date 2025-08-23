import type React from "react"
import { Linkedin, FileText, PinIcon, Github, Twitter, Quote } from "lucide-react"
import {
  Award,
  DraftingCompass,
  Layers,
  Lightbulb,
  Palette,
  SwatchBook,
  Star,
  ShieldCheck,
  Heart,
  Users,
} from "lucide-react"
import type { SectionLayoutConfig } from "@/lib/smart-sizing"

// Icon mapping for skills, projects etc.
export const contentIconMap: Record<string, React.ReactNode> = {
  Lightbulb: <Lightbulb className="h-6 w-6 text-slate-600" />,
  Palette: <Palette className="h-6 w-6 text-slate-600" />,
  SwatchBook: <SwatchBook className="h-6 w-6 text-slate-600" />,
  Layers: <Layers className="h-6 w-6 text-slate-600" />,
  DraftingCompass: <DraftingCompass className="h-6 w-6 text-slate-600" />,
  Award: <Award className="h-6 w-6 text-slate-600" />,
  Star: <Star className="h-6 w-6 text-slate-600" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6 text-slate-600" />,
  Heart: <Heart className="h-6 w-6 text-slate-600" />,
  Users: <Users className="h-6 w-6 text-slate-600" />,
  Quote: <Quote className="h-6 w-6 text-slate-600" />,
}

export const socialIconMap: Record<string, React.ReactNode> = {
  linkedin: <Linkedin size={28} />,
  resume: <FileText size={28} />,
  pinterest: <PinIcon size={28} />,
  github: <Github size={28} />,
  twitter: <Twitter size={28} />,
}

// --- DATA TYPES ---

// Base interface for all items that support multiple view modes
export interface CodeTab {
  name: string
  code: string
  language: string
  highlightLines?: number[]
}

export interface BaseViewItem {
  _key?: string
  viewMode?: 'text' | 'images' | 'code' | 'github-showcase' | 'uri' | 'video' | 'tweet' | 'multi-images' | 'compare' | 'education'
  textVariant?: 'simple' | 'detailed'
  // Timeline positioning info
  timelinePosition?: {
    row: number
    side: 'left' | 'right'
  }
  // Content for different view modes
  codeSnippet?: string
  codeLanguage?: string
  codeTabs?: CodeTab[]
  githubUrl?: string
  images?: string[]
  imageTransform?: {
    crop: { x: number; y: number }
    zoom: number
    rotation: number
  }
  videoUrl?: string
  tweetId?: string
  tweetVariant?: 'default' | 'shadow' | 'minimal'
  linkUrl?: string
  // Multi-images mode
  multiImages?: Array<{
    src: string
    quote: string
    name: string
    designation: string
  }>
  // Compare mode
  compareFirstImage?: string
  compareSecondImage?: string
  compareSlideMode?: 'hover' | 'drag'
  compareVariant?: 'standard' | '3d'
}

export interface HeroData {
  fullName: string
  professionalTitle: string
  summaryTagline: string
  profilePhotoUrl: string | null
  contactButtonText?: string
}

export interface ContactLink {
  name: keyof typeof socialIconMap
  url: string
  customIcon?: {
    type: 'library' | 'upload'
    value: string // Icon name from library or base64/URL for uploaded image
  }
}

export interface ContactData {
  email: string
  phone: string
  location: {
    city: string
    country: string
    state?: string
  }
  professionalLinks: ContactLink[]
  availability: string
  copyright: string
  // Section titles
  mainTitle?: string
  contactSectionTitle?: string
  personalInfoTitle?: string
  // Button text fields
  sendMessageButtonText?: string
  downloadCvButtonText?: string
  // Additional dry information fields
  placeOfBirth?: string
  nationality?: string
  drivingLicense?: string
  dateOfBirth?: string
  maritalStatus?: string
  visaStatus?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: 'award' | 'users' | 'target' | 'trending-up'
}

export interface ExperienceItem {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
  customDuration?: string | null // Custom duration override
  remoteWork?: string | null // "Remote", "Hybrid", or null
  employmentType?: string | null // "Full-time", "Part-time", or null
  additionalInfo?: { label: string; value: string }[] // New field for custom key-value pairs
  icon?: {
    type: 'library' | 'upload'
    value: string // Icon name from library or base64/URL for uploaded image
  }
}

export interface EducationItem {
  institution: string
  degree: string
  years: string
  description: string
  imageUrl?: string
  imageAlt?: string
  imageTransform?: {
    crop: { x: number; y: number }
    zoom: number
    rotation: number
  }
  icon?: {
    type: 'library' | 'upload'
    value: string // Icon name from library or base64/URL for uploaded image
  }
  relevantCoursework?: string[]
  honors?: string[]
  gpa?: string
  minors?: string[]
  exchangePrograms?: string[]
}

export interface Skill {
  name: string
  level?: number // Optional: 1-5 for proficiency
  detailedDisplayText?: string // Optional: detailed description for the skill
}

export interface SkillCategory {
  categoryName: string
  skills: Skill[]
}

export interface SkillsData {
  sectionTitle: string
  skillCategories: SkillCategory[]
  ungroupedSkills: Skill[]
}

export interface ProjectItem extends BaseViewItem {
  title: string
  description: string
  link: string
  icon?: {
    type: 'library' | 'upload'
    value: string // Icon name from library or base64/URL for uploaded image
  } | keyof typeof contentIconMap // Support legacy format
}

export interface LanguageItem {
  language: string
  proficiency: string
}

export interface CourseItem extends BaseViewItem {
  title: string
  institution: string
  year: string
  icon?: {
    type: 'library' | 'upload'
    value: string // Icon name from library or base64/URL for uploaded image
  } | keyof typeof contentIconMap // Support legacy format
}

export interface PublicationItem extends BaseViewItem {
  title: string
  journal: string
  year: string
  link: string
  icon?: {
    type: 'library' | 'upload'
    value: string // Icon name from library or base64/URL for uploaded image
  } | keyof typeof contentIconMap // Support legacy format
}

export interface SpeakingEngagementItem extends BaseViewItem {
  title: string
  event: string
  year: string
  location: string
  icon?: {
    type: 'library' | 'upload'
    value: string // Icon name from library or base64/URL for uploaded image
  } | keyof typeof contentIconMap // Support legacy format
}

export interface VolunteerExperienceItem extends BaseViewItem {
  role: string
  organization: string
  period: string
  description: string
  icon?: {
    type: 'library' | 'upload'
    value: string // Icon name from library or base64/URL for uploaded image
  } | keyof typeof contentIconMap // Support legacy format
}

// --- NEW DATA TYPES FOR NEW SECTIONS ---
export interface AchievementItem extends BaseViewItem {
  title: string
  description: string
  year: string
  icon?: {
    type: 'library' | 'upload'
    value: string // Icon name from library or base64/URL for uploaded image
  } | keyof typeof contentIconMap // Support legacy format
}

export interface CertificationItem extends BaseViewItem {
  title: string
  issuingBody: string
  year: string
  icon?: {
    type: 'library' | 'upload'
    value: string // Icon name from library or base64/URL for uploaded image
  } | keyof typeof contentIconMap // Support legacy format
}

export interface HobbyItem extends BaseViewItem {
  title: string
  icon?: {
    type: 'library' | 'upload'
    value: string // Icon name from library or base64/URL for uploaded image
  } | keyof typeof contentIconMap // Support legacy format
}

export interface MembershipItem extends BaseViewItem {
  organization: string
  role: string
  period: string
  description?: string
  icon?: {
    type: 'library' | 'upload'
    value: string // Icon name from library or base64/URL for uploaded image
  } | keyof typeof contentIconMap // Support legacy format
}

export interface TestimonialItem {
  quote: string
  authorName: string
  authorTitle: string
  authorImage: string
  quoteIcon?: {
    type: 'library' | 'upload'
    value: string // Icon name from library or base64/URL for uploaded image
  }
}

// --- MAIN PORTFOLIO DATA TYPE ---
export interface PortfolioData {
  hero: HeroData
  contact: ContactData
  summary: { sectionTitle: string; summaryText: string }
  experience: { sectionTitle: string; experienceItems: ExperienceItem[] }
  education_old: { sectionTitle: string; educationItems: EducationItem[]; layoutConfig?: SectionLayoutConfig }
  education: { 
    sectionTitle: string; 
    educationItems: EducationItem[];
    layoutConfig: SectionLayoutConfig;
  }
  skills: SkillsData
  projects: { 
    sectionTitle: string; 
    projectItems: ProjectItem[];
    layoutConfig: SectionLayoutConfig;
  }
  languages: { sectionTitle: string; languageItems: LanguageItem[] }
  courses: { sectionTitle: string; courseItems: CourseItem[] }
  publications: { sectionTitle: string; publicationItems: PublicationItem[] }
  speakingEngagements: { sectionTitle: string; engagementItems: SpeakingEngagementItem[] }
  volunteer: { sectionTitle: string; volunteerItems: VolunteerExperienceItem[] }
  achievements: { sectionTitle: string; achievementItems: AchievementItem[] }
  certifications: { sectionTitle: string; certificationItems: CertificationItem[] }
  hobbies: { sectionTitle: string; hobbyItems: HobbyItem[] }
  memberships: { sectionTitle: string; membershipItems: MembershipItem[] }
  testimonials: { sectionTitle: string; testimonialItems: TestimonialItem[] }
}

// --- INITIAL DATA (Clean structure - all content from injected CV data) ---
// No hardcoded content - all data comes from injected CV

export const initialData: PortfolioData = {
  hero: {
    fullName: "",
    professionalTitle: "",
    summaryTagline: "",
    profilePhotoUrl: null,
    contactButtonText: "Contact Me",
  },
  contact: {
    email: "",
    phone: "",
    location: { city: "", country: "", state: "" },
    professionalLinks: [],
    availability: "",
    copyright: "© 2025 Portfolio. All Rights Reserved.",
    placeOfBirth: "",
    nationality: "", 
    drivingLicense: "",
    dateOfBirth: "",
    maritalStatus: "",
    visaStatus: "",
  },
  summary: {
    sectionTitle: "Professional Summary",
    summaryText: "",
  },
  experience: {
    sectionTitle: "Professional Experience",
    experienceItems: [],
  },
  education: {
    sectionTitle: "Education",
    educationItems: [],
  },
  skills: {
    sectionTitle: "Skills & Expertise",
    skillCategories: [],
  },
  projects: {
    sectionTitle: "Featured Projects",
    layoutConfig: {
      layoutType: 'horizontal-carousel',
      autoSizing: false,
      manualSize: 'small',
      shape: 'very-tall',
      height: 'standard'
    },
    projectItems: [],
  },
  achievements: {
    sectionTitle: "Key Achievements",
    achievementItems: [],
  },
  certifications: {
    sectionTitle: "Certifications",
    certificationItems: [],
  },
  volunteering: {
    sectionTitle: "Volunteer Experience",
    volunteerItems: [],
  },
  languages: {
    sectionTitle: "Languages",
    languageItems: [],
  },
  speaking: {
    sectionTitle: "Speaking Engagements",
    speakingItems: [],
  },
  publications: {
    sectionTitle: "Publications",
    publicationItems: [],
  },
  hobbies: {
    sectionTitle: "Hobbies & Interests",
    hobbyItems: [],
  },
  testimonials: {
    sectionTitle: "Testimonials",
    testimonialItems: [],
  },
  memberships: {
    sectionTitle: "Professional Memberships",
    membershipItems: [],
  },
  patents: {
    sectionTitle: "Patents",
    patentItems: [],
  },
  courses: {
    sectionTitle: "Professional Development",
    courseItems: [],
  },
}