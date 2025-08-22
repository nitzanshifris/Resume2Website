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

// --- INITIAL DATA (conforming to the new structure) ---
export const initialData: PortfolioData = {
  hero: {
    fullName: "Your Name",
    professionalTitle: "Your Professional Title",
    summaryTagline: "Your Professional Tagline or Mission Statement",
    profilePhotoUrl: "/placeholder-profile.png",
    contactButtonText: "Contact Me",
  },
  contact: {
    email: "your.email@example.com",
    phone: "(123) 456-7890",
    location: { city: "Your City", country: "Your Country", state: "Your State" },
    professionalLinks: [
      { name: "linkedin", url: "https://linkedin.com/in/yourprofile" },
      { name: "resume", url: "/your-resume.pdf" },
      { name: "pinterest", url: "https://pinterest.com/yourprofile" },
      { name: "github", url: "https://github.com/yourprofile" },
      { name: "twitter", url: "https://twitter.com/yourprofile" },
    ],
    availability: "Available for opportunities and collaborations.",
    copyright: "© 2025 Your Name. All Rights Reserved.",
    // Personal Information Fields
    placeOfBirth: "Your Birth City, Country",
    nationality: "Your Nationality", 
    drivingLicense: "Valid Driver's License",
    dateOfBirth: "January 1, 1990",
    maritalStatus: "Single",
    visaStatus: "Work Authorization Status",
  },
  summary: {
    sectionTitle: "Professional Summary",
    summaryText:
      "As a professional at the intersection of innovation and excellence, I bring a unique perspective to my field. My journey has been driven by a commitment to quality, creativity, and continuous improvement. Through strategic thinking and practical application, I've demonstrated the ability to deliver meaningful results while maintaining the highest standards. My work focuses on creating value through thoughtful solutions that address real-world challenges. I believe in the power of collaboration, the importance of sustainable practices, and the pursuit of excellence in every endeavor. This approach has enabled me to build strong relationships, lead successful projects, and contribute to organizational growth. I'm passionate about mentoring others and sharing knowledge to foster collective success.",
  },
  experience: {
    sectionTitle: "Professional Experience",
    experienceItems: [
      {
        title: "Senior Position Title",
        company: "Leading Company Name",
        location: "Major City",
        startDate: "2021",
        endDate: "Present",
        description:
          "Led strategic initiatives and managed cross-functional teams to deliver high-impact projects. Implemented innovative solutions that improved operational efficiency and drove significant business growth. Successfully launched multiple products and expanded market presence through data-driven strategies. Instrumental in transferring 2000 client files onto the new digital CRM system.",
        remoteWork: "Hybrid",
        employmentType: "Full-time",
        additionalInfo: [
          { label: "Skills", value: "React" },
          { label: "Skills", value: "TypeScript" },
          { label: "Tools", value: "Adobe" },
          { label: "Tools", value: "Photoshop" },
          { label: "Tools", value: "Figma" },
          { label: "Team Size", value: "8 developers" },
          { label: "Budget", value: "$5M annually" }
        ],
        icon: {
          type: "library",
          value: "Crown"
        }
      },
      {
        title: "Mid-Level Position Title",
        company: "Established Company Name",
        location: "International City",
        startDate: "2017",
        endDate: "2021",
        description:
          "Managed key projects and led a diverse team to achieve organizational objectives. Developed and implemented strategies that resulted in measurable improvements in performance metrics. Collaborated with stakeholders across departments to deliver innovative solutions.",
        remoteWork: "Remote",
        employmentType: "Part-time",
        additionalInfo: [
          { label: "Skills", value: "Project Management" },
          { label: "Tools", value: "Jira" }
        ],
        icon: {
          type: "library",
          value: "TrendingUp"
        }
      },
      {
        title: "Associate Position Title",
        company: "Renowned Company Name",
        location: "Metropolitan Area",
        startDate: "2014",
        endDate: "2017",
        description:
          "Contributed to major projects and initiatives that drove departmental success. Developed innovative approaches to complex challenges and collaborated with senior leadership to implement strategic solutions. Recognized for exceptional performance and dedication to quality.",
        icon: {
          type: "library",
          value: "Target"
        }
      },
      {
        title: "Entry-Level Position Title",
        company: "Prestigious Company Name",
        location: "Global City",
        startDate: "2011",
        endDate: "2014",
        description:
          "Supported team initiatives and contributed to project development from conception to completion. Gained valuable experience in industry best practices and developed core competencies. Participated in successful campaigns that exceeded performance targets.",
        icon: {
          type: "library",
          value: "Briefcase"
        }
      },
    ],
  },
  education_old: {
    sectionTitle: "Education (Timeline)",
    layoutConfig: {
      layoutType: 'horizontal-carousel' as const,
      autoSizing: true,
      shape: 'wide' as const
    },
    educationItems: [
      {
        institution: "Prestigious University",
        degree: "Master's Degree in Your Field",
        years: "2012 - 2014",
        description:
          "Completed advanced coursework with focus on innovation and practical application. Graduated with highest honors and received recognition for outstanding academic achievement. Thesis work contributed to advancement in the field and received departmental commendation.",
        relevantCoursework: ["Advanced Research Methods", "Data Analysis", "Machine Learning", "Statistical Modeling"],
        honors: ["Summa Cum Laude", "Dean's List", "Outstanding Thesis Award"],
        gpa: "3.9/4.0",
        minors: ["Computer Science", "Mathematics"],
        exchangePrograms: ["Cambridge University Exchange Program"],
        icon: {
          type: "library",
          value: "GraduationCap"
        }
      },
      {
        institution: "Renowned University",
        degree: "Bachelor's Degree in Your Field",
        years: "2008 - 2011",
        description: 
          "Developed strong foundation in core principles and practical skills. Specialized in innovative approaches and emerging technologies. Final year project received departmental recognition and was featured in university showcase.",
        relevantCoursework: ["Software Engineering", "Database Systems", "Web Development"],
        honors: ["Magna Cum Laude", "Academic Excellence Award"],
        gpa: "3.7/4.0",
        minors: ["Business Administration"],
        exchangePrograms: ["Berlin Technical University"],
        icon: {
          type: "library",
          value: "Book"
        }
      },
      {
        institution: "Professional Institute",
        degree: "Professional Certificate",
        years: "2015",
        description: 
          "Completed intensive program covering advanced topics and practical applications. Developed comprehensive project that won recognition in institute competition and received funding for implementation.",
        relevantCoursework: ["Project Management", "Advanced Analytics"],
        honors: ["Certificate of Excellence"],
        gpa: "4.0/4.0",
        icon: {
          type: "library",
          value: "Award"
        }
      },
      {
        institution: "International Academy",
        degree: "Specialized Training Program",
        years: "2010",
        description: 
          "Completed specialized training in advanced techniques and traditional methods. Worked with industry experts to develop practical skills and create portfolio pieces. Projects received commercial recognition and market validation.",
        relevantCoursework: ["Advanced Techniques", "Traditional Methods", "Portfolio Development"],
        exchangePrograms: ["Tokyo Design Institute"],
        icon: {
          type: "library",
          value: "Target"
        }
      },
    ],
  },
  education: {
    sectionTitle: "Education",
    layoutConfig: {
      layoutType: 'horizontal-carousel',
      autoSizing: false,
      manualSize: 'medium',
      shape: 'wide',
      height: 'standard'
    },
    educationItems: [
      {
        institution: "Prestigious University",
        degree: "Master's Degree in Your Field",
        years: "2012 - 2014",
        description:
          "Completed advanced coursework with focus on innovation and practical application. Graduated with highest honors and received recognition for outstanding academic achievement.",
        relevantCoursework: ["Advanced Research Methods", "Data Analysis", "Machine Learning"],
        honors: ["Summa Cum Laude", "Dean's List"],
        gpa: "3.9/4.0",
        icon: {
          type: "library",
          value: "GraduationCap"
        },
        _key: "education-1",
        viewMode: "text",
        textVariant: "detailed",
        images: undefined
      },
      {
        institution: "University of Technology", 
        degree: "Bachelor's Degree in Engineering",
        years: "2008 - 2012",
        description:
          "Comprehensive engineering program with strong foundation in technical principles and practical application. Active in student organizations and research initiatives.",
        relevantCoursework: ["Engineering Fundamentals", "Design Principles"],
        exchangePrograms: ["International Exchange Program"],
        gpa: "4.0/4.0",
        icon: {
          type: "library",
          value: "Award"
        },
        _key: "education-2",
        viewMode: "text",
        textVariant: "detailed",
        images: undefined
      }
    ],
  },
  skills: {
    sectionTitle: "Skills & Expertise",
    skillCategories: [
      {
        categoryName: "Core Competencies",
        skills: [{ name: "Strategic Planning" }, { name: "Project Management" }, { name: "Team Leadership" }],
      },
      {
        categoryName: "Technical Skills",
        skills: [{ name: "Data Analysis" }, { name: "Process Optimization" }, { name: "Quality Assurance" }],
      },
      {
        categoryName: "Digital Tools",
        skills: [{ name: "Microsoft Office Suite" }, { name: "Project Management Tools" }, { name: "Analytics Platforms" }],
      },
    ],
    ungroupedSkills: [{ name: "Communication" }, { name: "Problem Solving" }, { name: "Innovation" }],
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
    projectItems: [
      {
        _key: "project-exp-beta2-1",
        title: "GitHub Showcase Test",
        description: "Testing GitHub repository display with smart card system.",
        link: "https://github.com/Reefnaaman/v0_template_v1.5",
        icon: "Lightbulb",
        viewMode: "github-showcase",
        githubUrl: "https://github.com/Reefnaaman/v0_template_v1.5"
      },
      {
        _key: "project-exp-beta2-2",
        title: "Video Player Test",
        description: "This is a comprehensive test of the video player functionality with YouTube content integration. The video demonstrates advanced techniques and provides valuable insights into modern development practices. When expanded, this description appears in a dedicated left panel alongside the video content, creating an enhanced viewing experience with contextual information readily available.",
        link: "https://www.youtube.com/watch?v=SGLhrRCBu-s",
        icon: "Star",
        viewMode: "video",
        videoUrl: "https://www.youtube.com/watch?v=SGLhrRCBu-s"
      }
      // {
      //   _key: "project-exp-beta2-3",
      //   title: "Link Preview Test", 
      //   description: "Testing link preview card display with website metadata.",
      //   link: "https://github.com/vercel/next.js",
      //   icon: "ExternalLink",
      //   viewMode: "uri",
      //   linkUrl: "https://github.com/vercel/next.js"
      // }
    ],
  },
  languages: {
    sectionTitle: "Languages",
    languageItems: [
      { language: "English", proficiency: "Native" },
      { language: "Spanish", proficiency: "Fluent" },
      { language: "Mandarin", proficiency: "Conversational" },
    ],
  },
  courses: {
    sectionTitle: "Professional Development",
    courseItems: [
      { 
        _key: "course-1",
        title: "Advanced Leadership & Management Excellence", 
        institution: "Executive Leadership Institute", 
        year: "2022", 
        icon: "Users",
        viewMode: "text",
        codeSnippet: `// Process optimization algorithm
const optimizeProcess = (process: ProcessData, constraints: Constraints) => {
  const baseline = new ProcessAnalyzer();
  const metrics = process.generateMetrics();
  
  return optimizer.analyze({
    metrics,
    constraints: process.businessConstraints,
    targets: [efficiency, quality],
    iterations: 1000
  });
};`,
        images: ["/placeholder-process-1.png", "/placeholder-process-2.png"]
      },
      { 
        _key: "course-2",
        title: "Sustainable Business Practices & Innovation", 
        institution: "Global Sustainability Academy", 
        year: "2021", 
        icon: "Layers",
        viewMode: "text",
        linkUrl: "https://sustainability.academy/certifications",
        videoUrl: "https://vimeo.com/sustainable-business-course"
      },
      { 
        _key: "course-3",
        title: "Digital Transformation & Technology Integration", 
        institution: "Technology Innovation Academy", 
        year: "2020", 
        icon: "DraftingCompass",
        viewMode: "text",
        githubUrl: "https://github.com/tech-innovation/digital-patterns"
      },
      {
        _key: "course-4",
        title: "Advanced Analytics & Machine Learning Applications",
        institution: "Professional Education Institute",
        year: "2023",
        icon: "Lightbulb",
        viewMode: "text",
        codeSnippet: `# Predictive analytics model
import tensorflow as tf
from business_dataset import BusinessMetrics

model = tf.keras.Sequential([
    tf.keras.layers.LSTM(128, return_sequences=True),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.LSTM(64),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(num_outcomes, activation='softmax')
])

# Predict next quarter's business trends
predictions = model.predict(current_quarter_data)`,
        codeLanguage: "python"
      }
    ],
  },
  publications: {
    sectionTitle: "Publications & Media",
    publicationItems: [
      {
        _key: "pub-1",
        title: "The Future of Digital Innovation: Technology Meets Business",
        journal: "Industry Business Review",
        year: "2023",
        link: "https://businessreview.com/digital-innovation",
        icon: "Lightbulb",
        viewMode: "text",
        linkUrl: "https://businessreview.com/technology/digital-innovation-business",
        images: ["/placeholder-publication-1.png", "/placeholder-publication-2.png"]
      },
      {
        _key: "pub-2",
        title: "Process Optimization: A Revolutionary Approach",
        journal: "The International Journal of Business Excellence",
        year: "2022",
        link: "https://businessjournal.org/process-optimization",
        icon: "Layers",
        viewMode: "text",
        codeSnippet: `// Extract from the published algorithm
function optimizeProcessLayout(components: ProcessComponent[]): Layout {
  // Recursive optimization algorithm that achieved 
  // 98.7% resource utilization in production tests
  return components.reduce((layout, component) => {
    const bestFit = findOptimalPosition(layout, component);
    return insertComponent(layout, component, bestFit);
  }, emptyLayout);
}`,
        codeLanguage: "typescript"
      },
      {
        _key: "pub-3",
        title: "Exclusive Interview: Redefining Excellence Through Innovation",
        journal: "Business Weekly",
        year: "2021",
        link: "https://businessweekly.com/executive-interview",
        icon: "Quote",
        viewMode: "text",
        videoUrl: "https://www.youtube.com/watch?v=bof-interview-2021",
        tweetId: "1456789012345678901"
      },
      {
        _key: "pub-4",
        title: "Industry's Digital Revolution: From Concepts to Algorithms",
        journal: "Technology Review",
        year: "2024",
        link: "https://technologyreview.com/industry-algorithms",
        icon: "Star",
        viewMode: "text",
        githubUrl: "https://github.com/tech-industry/algorithmic-design",
        images: ["/placeholder-tech-review-1.png", "/placeholder-algorithmic-2.png"]
      },
    ],
  },
  speakingEngagements: {
    sectionTitle: "Speaking Engagements",
    engagementItems: [
      {
        _key: "speak-1",
        title: "Keynote: 'The Intersection of AI and Business Innovation'",
        event: "Global Innovation Summit 2024",
        year: "2024",
        location: "International Conference Center",
        icon: "Layers",
        viewMode: "text",
        videoUrl: "https://globalinnovationsummit.com/keynote-speaker",
        images: ["/placeholder-summit-stage.png", "/placeholder-keynote.png"],
        linkUrl: "https://innovationsummit.com/speakers/featured"
      },
      {
        _key: "speak-2",
        title: "Panelist: 'Circular Economy - Industry's Future'",
        event: "Sustainable Business Conference",
        year: "2023",
        location: "Major European City",
        icon: "ShieldCheck",
        viewMode: "text",
        tweetId: "1623456789012345678",
        codeSnippet: `// Live coding demo from the panel
// Calculating product carbon footprint
const calculateProductFootprint = (product) => {
  const materialImpact = product.materials.reduce((total, mat) => 
    total + (mat.weight * mat.carbonPerKg), 0);
  
  const productionImpact = product.productionSteps.reduce((total, step) =>
    total + step.energyUsage * CARBON_PER_KWH, 0);
    
  const transportImpact = calculateShippingCarbon(product.origin, product.destination);
  
  return { materialImpact, productionImpact, transportImpact };
};`,
        codeLanguage: "javascript"
      },
      {
        _key: "speak-3",
        title: "Masterclass: 'Digital Transformation Strategies'",
        event: "Leading Business School",
        year: "2022",
        location: "Major US City",
        icon: "Award",
        viewMode: "text",
        githubUrl: "https://github.com/business-masterclass/digital-strategies",
        videoUrl: "https://businessschool.edu/masterclass-recordings/speaker-2022"
      },
      {
        _key: "speak-4",
        title: "TEDx Talk: 'Innovation Without Limits Is Possible'",
        event: "TEDx International",
        year: "2023",
        location: "European City",
        icon: "Lightbulb",
        viewMode: "text",
        videoUrl: "https://ted.com/talks/speaker_innovation_without_limits",
        images: ["/placeholder-tedx-stage.png", "/placeholder-demonstration.png"],
        linkUrl: "https://www.ted.com/talks/speaker_innovation_without_limits"
      },
    ],
  },
  volunteer: {
    sectionTitle: "Community & Volunteer Work",
    volunteerItems: [
      {
        _key: "vol-1",
        role: "Lead Mentor & Board Member",
        organization: "Professional Development Initiative",
        period: "2020 - Present",
        description: "Mentoring 25+ emerging professionals annually in career development, leadership strategy, and innovative practices. Established scholarship program that has awarded significant funding to underrepresented students. Leading workshops on entrepreneurship and digital innovation.",
        icon: "Heart",
        viewMode: "text",
        images: ["/placeholder-mentorship.png", "/placeholder-workshop.png"],
        linkUrl: "https://professionaldevelopment.org/mentors/featured"
      },
      {
        _key: "vol-2",
        role: "Strategic Advisor (Pro Bono)",
        organization: "Career Success Worldwide",
        period: "2019 - Present",
        description: "Redesigned the organization's professional development program, impacting 10,000+ individuals globally. Created comprehensive guidelines and led workshops for job seekers. Developed partnerships with leading organizations for program support worth significant annual value.",
        icon: "Users",
        viewMode: "text",
        videoUrl: "https://careersuccess.org/impact-stories/featured-advisor",
        githubUrl: "https://github.com/career-success/optimization-algorithm"
      },
      {
        _key: "vol-3",
        role: "Program Designer & Community Advocate",
        organization: "Arts & Health Foundation",
        period: "2018 - 2021",
        description: "Designed programs for charity events raising significant funds for health research. Created iconic initiatives that generated substantial auction proceeds. Collaborated with community leaders on events combining arts and social impact.",
        icon: "Palette",
        viewMode: "text",
        images: ["/placeholder-gala-event.png", "/placeholder-initiative.png"],
        tweetId: "1234567890123456789"
      },
      {
        _key: "vol-4",
        role: "Founder - Skills Development Program",
        organization: "Youth Empowerment Center",
        period: "2022 - Present",
        description: "Founded and teach free professional skills program for at-risk youth. 85% of graduates have entered higher education or industry positions. Program includes technical skills, digital literacy, and entrepreneurship. Secured sponsorships from major organizations for equipment and materials.",
        icon: "Users",
        viewMode: "text",
        codeSnippet: `// Student project: Professional skills app
class SkillsDevelopmentApp {
  constructor() {
    this.workspace = new DigitalCanvas();
    this.tools = ['analyzer', 'planner', 'tracker', 'reports'];
    this.templates = this.loadTemplates();
  }
  
  // Teaching students to build digital solutions
  generateProjectPack() {
    return {
      projects: this.workspace.exportProjects(),
      metrics: this.calculateMetrics(),
      resources: this.selectedResources,
      projectedValue: this.calculateROI()
    };
  }
}`,
        codeLanguage: "javascript"
      },
    ],
  },
  achievements: {
    sectionTitle: "Awards & Recognition",
    achievementItems: [
      {
        _key: "achieve-1",
        title: "Industry Excellence Award Winner",
        description: "Won the prestigious Industry Excellence Award with substantial grant funding and year-long mentorship. Selected from over 500 applicants for revolutionary innovative approach and transformative business model. Mentored by industry leaders and pioneers.",
        year: "2023",
        icon: "Award",
        viewMode: "text",
        images: ["/placeholder-award-ceremony.png", "/placeholder-trophy.png"],
        linkUrl: "https://industryawards.com/excellence/2023-winner",
        videoUrl: "https://industryawards.com/video/excellence-2023-winner"
      },
      {
        _key: "achieve-2",
        title: "International Innovation Prize - Global Winner",
        description: "First professional from region to win the global Innovation Prize in a decade. Awarded significant funding for groundbreaking sustainable innovations. Work showcased at international conferences and adopted by 150+ organizations worldwide.",
        year: "2022",
        icon: "Award",
        viewMode: "text",
        githubUrl: "https://github.com/innovation/research-lab",
        tweetId: "1567890123456789012"
      },
      {
        _key: "achieve-3",
        title: "Global Leadership Award - Grand Prize",
        description: "Awarded the Global Leadership grand prize with substantial funding and mentorship from industry executives. Recognized for merging traditional excellence with cutting-edge innovation. Led to collaboration opportunities with Fortune 500 companies.",
        year: "2021",
        icon: "ShieldCheck",
        viewMode: "text",
        images: ["/placeholder-leadership-ceremony.png", "/placeholder-presentation.png"],
        linkUrl: "https://globalleadershipaward.com/winners/2021/featured"
      },
      {
        _key: "achieve-4",
        title: "UNESCO Creative Cities Award for Sustainable Innovation",
        description: "Honored by UNESCO for contributions to sustainable innovation education and development. Established innovation incubator supporting 50+ emerging sustainable leaders. Program model adopted by institutions in 12 countries.",
        year: "2024",
        icon: "Heart",
        viewMode: "text",
        codeSnippet: `// Open-sourced sustainability tracking system
const SustainabilityIndex = {
  calculateScore: (organization) => {
    const metrics = {
      resources: assessResourceSustainability(organization.resources),
      operations: evaluateOperationalMethods(organization.facilities),
      workforce: auditWorkplacePractices(organization.teams),
      transparency: measureProcessVisibility(organization.data),
      circularity: assessLifecycleOptions(organization.outputs)
    };
    
    return generateComprehensiveReport(metrics);
  }
};`,
        codeLanguage: "javascript"
      },
    ],
  },
  certifications: {
    sectionTitle: "Professional Certifications",
    certificationItems: [
      {
        _key: "cert-1",
        title: "Certified Sustainable Business Practitioner - Level 5 (Expert)",
        issuingBody: "International Council for Sustainable Business",
        year: "2022",
        icon: "ShieldCheck",
        viewMode: "text",
        linkUrl: "https://sustainablebusiness.org/certified-practitioners/featured",
        images: ["/placeholder-sustainability-cert.png", "/placeholder-badge.png"],
        codeSnippet: `// Certification project: LCA calculator
function calculateLifecycleAssessment(product) {
  const phases = {
    rawMaterials: calculateExtractionImpact(product.materials),
    manufacturing: calculateProductionImpact(product.processes),
    distribution: calculateTransportImpact(product.logistics),
    use: calculateUsageImpact(product.specifications),
    endOfLife: calculateDisposalImpact(product.recyclability)
  };
  
  return generateLCAReport(phases);
}`,
        codeLanguage: "javascript"
      },
      {
        _key: "cert-2",
        title: "Global Organic Business Standard (GOBS) - Approved Professional",
        issuingBody: "GOBS International Organization",
        year: "2021",
        icon: "Layers",
        viewMode: "text",
        githubUrl: "https://github.com/gobs-certified/organic-business-standards",
        videoUrl: "https://global-standard.org/certified-professionals/featured"
      },
      {
        _key: "cert-3",
        title: "Cradle to Cradle Certified™ Business Designer",
        issuingBody: "Cradle to Cradle Business Innovation Institute",
        year: "2023",
        icon: "Award",
        viewMode: "text",
        images: ["/placeholder-c2c-cert.png", "/placeholder-circular-principles.png"],
        linkUrl: "https://c2ccertified.org/certified-professionals"
      },
      {
        _key: "cert-4",
        title: "B Corporation Certified Business",
        issuingBody: "B Lab Global",
        year: "2024",
        icon: "Star",
        viewMode: "text",
        tweetId: "1789012345678901234",
        linkUrl: "https://bcorporation.net/directory/example-company",
        codeSnippet: `// B Corp impact assessment tool
const BCorpAssessment = {
  governance: 18.7,  // Accountability & Transparency
  workers: 22.3,     // Fair wages & benefits
  community: 31.2,   // Supply chain & giving
  environment: 48.6, // Sustainable practices
  customers: 15.4,   // Product impact
  
  totalScore: 136.2, // Minimum required: 80
  certification: 'CERTIFIED B CORPORATION™'
};`
      },
    ],
  },
  hobbies: {
    sectionTitle: "Interests & Hobbies",
    hobbyItems: [
      { 
        _key: "hobby-1",
        title: "Vintage Collection & Restoration", 
        icon: "Heart",
        viewMode: "text",
        images: ["/placeholder-vintage-collection.png", "/placeholder-restoration.png"],
        linkUrl: "https://instagram.com/vintage-collector"
      },
      { 
        _key: "hobby-2",
        title: "Competitive Dance & Performance", 
        icon: "Users",
        viewMode: "text",
        videoUrl: "https://youtube.com/dance-championship-2023",
        images: ["/placeholder-performance.png"]
      },
      { 
        _key: "hobby-3",
        title: "Traditional Art & Cultural Studies", 
        icon: "Palette",
        viewMode: "text",
        images: ["/placeholder-traditional-art.png", "/placeholder-cultural-studies.png"],
        codeSnippet: `// Traditional principles in modern design
const DesignPrinciples = {
  principles: {
    asymmetry: 'Creating balance through inequality',
    simplicity: 'Maximum impact with minimal elements',
    seasonality: 'Honoring natural cycles',
    space: 'Celebrating negative space as design element'
  },
  
  applyToModernDesign: (project) => {
    return incorporateTraditionalPrinciples(project);
  }
};`,
        codeLanguage: "javascript"
      },
      { 
        _key: "hobby-4",
        title: "Urban Sketching & Digital Illustration", 
        icon: "DraftingCompass",
        viewMode: "text",
        githubUrl: "https://github.com/urban-sketchers/digital-illustrations",
        images: ["/placeholder-urban-sketches.png", "/placeholder-illustrations.png"]
      },
    ],
  },
  memberships: {
    sectionTitle: "Professional Memberships",
    membershipItems: [
      {
        _key: "member-1",
        organization: "Professional Excellence Association",
        role: "Board Member & Innovation Committee Chair",
        period: "2023 - Present",
        description: "Leading strategic initiatives as Board Member and Chair of the Innovation Committee. Driving organizational transformation through cutting-edge innovation programs and fostering collaboration among industry leaders.",
        icon: "Award",
        viewMode: "text",
        textVariant: "detailed",
        linkUrl: "https://professionalexcellence.org/members/featured",
        images: ["/placeholder-board-meeting.png", "/placeholder-summit.png"]
      },
      {
        _key: "member-2",
        organization: "United Nations Sustainable Business Charter",
        role: "Founding Signatory & Advisory Board",
        period: "2022 - Present",
        description: "Founding signatory of the UN Sustainable Business Charter, serving on the Advisory Board to shape global sustainability policies and practices. Contributing to climate action initiatives and sustainable business frameworks.",
        icon: "ShieldCheck",
        viewMode: "text",
        textVariant: "detailed",
        videoUrl: "https://sustainablebusinesscharter.org/signatories/featured",
        githubUrl: "https://github.com/un-business-charter/climate-action"
      },
      {
        _key: "member-3",
        organization: "Circular Economy Foundation - Make Business Circular",
        role: "Innovation Partner & Thought Leader",
        period: "2021 - Present",
        description: "Innovation Partner driving circular economy initiatives and sustainable business models. Developing frameworks and tools for businesses to transition to circular practices and reduce environmental impact.",
        icon: "Award",
        viewMode: "text",
        textVariant: "detailed",
        codeSnippet: `// Circular business tracking system
interface CircularBusinessMetrics {
  design: {
    durability: number;      // Years of expected use
    recyclability: number;   // % of recyclable components
    modularity: boolean;     // Can be redesigned
  };
  operations: {
    wasteReduction: number;  // % waste eliminated
    renewableEnergy: number; // % renewable energy used
  };
  endOfLife: {
    takeBackProgram: boolean;
    reusabilityOptions: string[];
    sustainability: number; // % sustainable practices
  };
}`,
        codeLanguage: "typescript"
      },
      {
        _key: "member-4",
        organization: "Innovation Revolution Global Advisory Committee",
        role: "Strategic Advisor & Transparency Advocate",
        period: "2020 - Present",
        description: "Strategic Advisor championing transparency and ethical innovation in global business practices. Working with international organizations to establish standards for responsible innovation and corporate accountability.",
        icon: "Star",
        viewMode: "text",
        textVariant: "detailed",
        tweetId: "1890123456789012345",
        linkUrl: "https://innovationrevolution.org/advisors/featured"
      },
    ],
  },
  testimonials: {
    sectionTitle: "Professional Testimonials",
    testimonialItems: [
      {
        quote:
          "This professional's revolutionary approach to sustainable innovation has redefined what excellence means in the modern business environment. Their vision is unparalleled - they don't just follow trends, they create movements. Working with them on industry initiatives has been transformative for our entire sector.",
        authorName: "Industry Leader",
        authorTitle: "Senior Executive, Leading Organization",
        authorImage: "/placeholder-testimonial-1.png",
      },
      {
        quote:
          "In my decades of industry experience, I've rarely encountered a professional with this unique combination of technical mastery and visionary innovation. Their methodologies should be taught in every business school. They're not just solving problems; they're architecting the future of our industry.",
        authorName: "Renowned Expert",
        authorTitle: "Founder & CEO, International Corporation",
        authorImage: "/placeholder-testimonial-2.png",
      },
      {
        quote:
          "This professional represents everything we look for in leadership - innovation, expertise, and an unwavering commitment to excellence. Their digital transformation project opened our eyes to entirely new opportunities. They're a visionary who delivers results. Their initiatives have exceeded all growth projections.",
        authorName: "Executive Chairman",
        authorTitle: "Chairman & CEO, Global Corporation",
        authorImage: "/placeholder-testimonial-3.png",
      },
      {
        quote:
          "As their former mentor, I knew this individual would transform their industry. But they've exceeded even my highest expectations. Their ability to merge technology with traditional excellence while maintaining sustainability is genius. They've become the role model for our students - the future of business innovation.",
        authorName: "Distinguished Professor",
        authorTitle: "Former Department Chair, Prestigious University",
        authorImage: "/placeholder-testimonial-4.png",
      },
    ],
  },
}
