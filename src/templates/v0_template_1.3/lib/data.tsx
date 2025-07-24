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

// Icon mapping for skills, projects etc.
export const contentIconMap: Record<string, React.ReactNode> = {
  Lightbulb: <Lightbulb className="h-4 w-4 text-muted-foreground" />,
  Palette: <Palette className="h-4 w-4 text-muted-foreground" />,
  SwatchBook: <SwatchBook className="h-4 w-4 text-muted-foreground" />,
  Layers: <Layers className="h-4 w-4 text-muted-foreground" />,
  DraftingCompass: <DraftingCompass className="h-4 w-4 text-muted-foreground" />,
  Award: <Award className="h-4 w-4 text-muted-foreground" />,
  Star: <Star className="h-4 w-4 text-muted-foreground" />,
  ShieldCheck: <ShieldCheck className="h-4 w-4 text-muted-foreground" />,
  Heart: <Heart className="h-6 w-6" />,
  Users: <Users className="h-4 w-4 text-muted-foreground" />,
  Quote: <Quote className="h-4 w-4 text-muted-foreground" />,
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
  viewMode?: 'text' | 'images' | 'code' | 'github' | 'uri' | 'video' | 'tweet' | 'multi-images' | 'compare'
  textVariant?: 'simple' | 'detailed'
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
}

export interface ContactLink {
  name: keyof typeof socialIconMap
  url: string
}

export interface ContactData {
  email: string
  phone: string
  location: {
    city: string
    country: string
  }
  professionalLinks: ContactLink[]
  availability: string
  copyright: string
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
  technologies?: string[]
  achievements?: Achievement[]
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
}

export interface Skill {
  name: string
  level?: number // Optional: 1-5 for proficiency
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
  icon: keyof typeof contentIconMap
}

export interface LanguageItem {
  language: string
  proficiency: string
}

export interface CourseItem extends BaseViewItem {
  title: string
  institution: string
  year: string
  icon: keyof typeof contentIconMap
}

export interface PublicationItem extends BaseViewItem {
  title: string
  journal: string
  year: string
  link: string
  icon: keyof typeof contentIconMap
}

export interface SpeakingEngagementItem extends BaseViewItem {
  title: string
  event: string
  year: string
  location: string
  icon: keyof typeof contentIconMap
}

export interface VolunteerExperienceItem extends BaseViewItem {
  role: string
  organization: string
  period: string
  description: string
  icon: keyof typeof contentIconMap
}

// --- NEW DATA TYPES FOR NEW SECTIONS ---
export interface AchievementItem extends BaseViewItem {
  title: string
  description: string
  year: string
  icon: keyof typeof contentIconMap
}

export interface CertificationItem extends BaseViewItem {
  title: string
  issuingBody: string
  year: string
  icon: keyof typeof contentIconMap
}

export interface HobbyItem extends BaseViewItem {
  title: string
  icon: keyof typeof contentIconMap
}

export interface MembershipItem extends BaseViewItem {
  organization: string
  role: string
  period: string
  icon: keyof typeof contentIconMap
}

export interface TestimonialItem {
  quote: string
  authorName: string
  authorTitle: string
  authorImage: string
}

// --- MAIN PORTFOLIO DATA TYPE ---
export interface PortfolioData {
  hero: HeroData
  contact: ContactData
  summary: { sectionTitle: string; summaryText: string }
  experience: { sectionTitle: string; experienceItems: ExperienceItem[] }
  education: { sectionTitle: string; educationItems: EducationItem[] }
  skills: SkillsData
  projects: { sectionTitle: string; projectItems: ProjectItem[] }
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
  },
  contact: {
    email: "your.email@example.com",
    phone: "(123) 456-7890",
    location: { city: "Your City", country: "Your Country" },
    professionalLinks: [
      { name: "linkedin", url: "https://linkedin.com/in/yourprofile" },
      { name: "resume", url: "/your-resume.pdf" },
      { name: "pinterest", url: "https://pinterest.com/yourprofile" },
      { name: "github", url: "https://github.com/yourprofile" },
      { name: "twitter", url: "https://twitter.com/yourprofile" },
    ],
    availability: "Available for opportunities and collaborations.",
    copyright: "© 2025 Your Name. All Rights Reserved.",
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
          "Led strategic initiatives and managed cross-functional teams to deliver high-impact projects. Implemented innovative solutions that improved operational efficiency and drove significant business growth. Successfully launched multiple products and expanded market presence through data-driven strategies.",
        technologies: ["Technology Stack 1", "Technology Stack 2", "Technology Stack 3", "Technology Stack 4", "Technology Stack 5"],
        achievements: [
          {
            id: "1",
            title: "Key Achievement",
            description: "Featured in Vogue and Harper's Bazaar",
            icon: "award"
          },
          {
            id: "2",
            title: "Team Impact",
            description: "Built and led a team of 15 designers",
            icon: "users"
          },
          {
            id: "3",
            title: "Business Impact",
            description: "Generated $3.2M in first year revenue",
            icon: "target"
          }
        ]
      },
      {
        title: "Mid-Level Position Title",
        company: "Established Company Name",
        location: "International City",
        startDate: "2017",
        endDate: "2021",
        description:
          "Managed key projects and led a diverse team to achieve organizational objectives. Developed and implemented strategies that resulted in measurable improvements in performance metrics. Collaborated with stakeholders across departments to deliver innovative solutions.",
      },
      {
        title: "Associate Position Title",
        company: "Renowned Company Name",
        location: "Metropolitan Area",
        startDate: "2014",
        endDate: "2017",
        description:
          "Contributed to major projects and initiatives that drove departmental success. Developed innovative approaches to complex challenges and collaborated with senior leadership to implement strategic solutions. Recognized for exceptional performance and dedication to quality.",
      },
      {
        title: "Entry-Level Position Title",
        company: "Prestigious Company Name",
        location: "Global City",
        startDate: "2011",
        endDate: "2014",
        description:
          "Supported team initiatives and contributed to project development from conception to completion. Gained valuable experience in industry best practices and developed core competencies. Participated in successful campaigns that exceeded performance targets.",
      },
    ],
  },
  education: {
    sectionTitle: "Education",
    educationItems: [
      {
        institution: "Prestigious University",
        degree: "Master's Degree in Your Field",
        years: "2012 - 2014",
        description:
          "Completed advanced coursework with focus on innovation and practical application. Graduated with highest honors and received recognition for outstanding academic achievement. Thesis work contributed to advancement in the field and received departmental commendation.",
      },
      {
        institution: "Renowned University",
        degree: "Bachelor's Degree in Your Field",
        years: "2008 - 2011",
        description: 
          "Developed strong foundation in core principles and practical skills. Specialized in innovative approaches and emerging technologies. Final year project received departmental recognition and was featured in university showcase.",
      },
      {
        institution: "Professional Institute",
        degree: "Professional Certificate",
        years: "2015",
        description: 
          "Completed intensive program covering advanced topics and practical applications. Developed comprehensive project that won recognition in institute competition and received funding for implementation.",
      },
      {
        institution: "International Academy",
        degree: "Specialized Training Program",
        years: "2010",
        description: 
          "Completed specialized training in advanced techniques and traditional methods. Worked with industry experts to develop practical skills and create portfolio pieces. Projects received commercial recognition and market validation.",
      },
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
    projectItems: [
      {
        _key: "project-1",
        title: "Innovative Project Title",
        description:
          "A groundbreaking initiative that leveraged cutting-edge technology to deliver exceptional results. Recognized by industry leaders and featured in major publications for its innovative approach and measurable impact.",
        link: "https://example.com/project1",
        icon: "Lightbulb",
        viewMode: "code",
        codeSnippet: `// Advanced optimization algorithm for resource allocation
class ResourceOptimizer {
  constructor(private capacity: number, private requirements: Requirement[]) {}
  
  optimizeAllocation(): AllocationResult {
    const optimizer = new DynamicOptimizer(this.capacity);
    const allocations = this.requirements.map(req => {
      return optimizer.allocate(req, {
        maximizeEfficiency: true,
        minimizeWaste: true,
        constraints: req.constraints
      });
    });
    
    return {
      efficiency: optimizer.calculateEfficiency(),
      utilization: optimizer.getUtilizationMetrics(),
      allocations: allocations,
      performanceScore: this.calculatePerformance(allocations)
    };
  }
  
  private calculatePerformance(allocations: Allocation[]): number {
    // Complex algorithm considering multiple factors and constraints
    return allocations.reduce((score, allocation) => {
      return score + (allocation.efficiency * allocation.priority);
    }, 0) / allocations.length;
  }
}`,
        codeLanguage: "typescript",
        images: [
          "/placeholder-image-1.png",
          "/placeholder-image-2.png",
          "/placeholder-image-3.png"
        ],
        githubUrl: "https://github.com/example/project-repo",
        videoUrl: "https://vimeo.com/example-video"
      },
      {
        _key: "project-2", 
        title: "Technology-Driven Solution",
        description: "Collaborative project with leading research institution to develop next-generation solutions. Implemented advanced algorithms and machine learning techniques to create customized, data-driven outcomes.",
        link: "https://example.com/project2",
        icon: "DraftingCompass",
        viewMode: "images",
        images: [
          "/placeholder-tech-1.png",
          "/placeholder-tech-2.png",
          "/placeholder-tech-3.png",
          "/placeholder-tech-4.png"
        ],
        githubUrl: "https://github.com/example/tech-project",
        tweetId: "1668408059125702661",
        codeSnippet: `// Advanced parametric design algorithm
const generateCustomSolution = (inputData: InputData): SolutionModel => {
  const { dimension1, dimension2, parameters, constraints } = inputData;
  
  return new ParametricGenerator()
    .setDimensions(dimension1, dimension2)
    .applyParameters(parameters)
    .optimizeForConstraints(constraints)
    .generatePattern('algorithmic')
    .exportModel();
};`,
        codeTabs: [
          {
            name: "Generator.tsx",
            language: "typescript",
            code: `// Main generator component
import { useState } from 'react';
import { generateCustomSolution } from './algorithm';
import { DataScanner } from './DataScanner';

export const SolutionGenerator = () => {
  const [inputData, setInputData] = useState<InputData | null>(null);
  const [solutionModel, setSolutionModel] = useState<SolutionModel | null>(null);

  const handleScan = async () => {
    const data = await DataScanner.scan();
    setInputData(data);
    const model = generateCustomSolution(data);
    setSolutionModel(model);
  };

  return (
    <div className="p-8">
      <h1>Custom Solution Generator</h1>
      <button onClick={handleScan}>Scan Input</button>
      {solutionModel && <ModelViewer model={solutionModel} />}
    </div>
  );
};`
          },
          {
            name: "algorithm.ts",
            language: "typescript",
            code: `// Parametric design algorithm
export const generateCustomSolution = (inputData: InputData): SolutionModel => {
  const { dimension1, dimension2, parameters, constraints } = inputData;
  
  return new ParametricGenerator()
    .setDimensions(dimension1, dimension2)
    .applyParameters(parameters)
    .optimizeForConstraints(constraints)
    .generatePattern('algorithmic')
    .exportModel();
};

// Pattern generation algorithm
const generateAlgorithmicPattern = (surface: Surface): Pattern => {
  const points = distributePoints(surface, 100);
  return createOptimizedPattern(points);
};`
          },
          {
            name: "styles.css",
            language: "css",
            code: `.solution-viewer {
  width: 100%;
  height: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scan-button {
  background: #4a5568;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.scan-button:hover {
  background: #2d3748;
  transform: translateY(-2px);
}`,
            highlightLines: [1, 2, 3]
          }
        ]
      },
      {
        _key: "project-3",
        title: "Strategic Initiative Project",
        description: "A comprehensive program that transformed organizational processes through innovative methodologies. Features data-driven approaches with measurable outcomes, combining traditional best practices with cutting-edge technology.",
        link: "https://example.com/project3",
        icon: "Palette",
        viewMode: "video",
        videoUrl: "https://www.youtube.com/watch?v=example-showcase",
        images: [
          "/placeholder-strategy-1.png",
          "/placeholder-strategy-2.png",
          "/placeholder-strategy-3.png"
        ],
        linkUrl: "https://www.example.com/article/project-review"
      },
      {
        _key: "project-4",
        title: "Digital Innovation Platform",
        description: "Pioneering digital transformation initiative leveraging blockchain technology. Collaborated with technology partners to create innovative solutions for the digital economy, achieving significant ROI within the first quarter.",
        link: "https://example.com/digital-platform",
        icon: "Star",
        viewMode: "github",
        githubUrl: "https://github.com/example/digital-platform",
        tweetId: "1734567890123456789",
        codeSnippet: `// Smart contract for digital assets
pragma solidity ^0.8.0;

contract DigitalAssets is ERC721 {
    struct Asset {
        string dataHash;
        uint256 edition;
        bool isExclusive;
        mapping(address => bool) accessibleBy;
    }
    
    function mintAsset(string memory data, uint256 editions) public {
        // Minting logic for limited edition digital assets
    }
}`
      },
      {
        _key: "project-5",
        title: "Tweet: Innovation Showcase",
        description: "Showcasing our latest technological innovations through social media. This tweet features our data-driven process with multiple visualizations.",
        link: "https://twitter.com/innovationtech",
        icon: "Twitter",
        viewMode: "tweet",
        tweetId: "1678577280489234432", // Tweet with image carousel
      },
      {
        _key: "project-6",
        title: "Tweet: Sustainability Article",
        description: "Featured article about our sustainable practices and innovative methodology. This tweet includes a rich media preview of our industry publication feature.",
        link: "https://twitter.com/sustainability",
        icon: "Twitter",
        viewMode: "tweet",
        tweetId: "1675849118445436929", // Tweet with meta URL preview
      },
      {
        _key: "project-7",
        title: "Social Media Campaign",
        description: "Our viral social media campaign showcasing the intersection of technology and innovation reached over 5M impressions.",
        link: "https://twitter.com/examplecompany",
        icon: "Twitter",
        viewMode: "tweet",
        tweetId: "1441032681968212480", // Regular tweet
      },
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
        icon: "Award",
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
        icon: "ShieldCheck",
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
        icon: "DraftingCompass",
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
        icon: "Star",
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
        icon: "Star",
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
        icon: "Star",
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
        icon: "Heart",
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
        icon: "Users",
        viewMode: "text",
        linkUrl: "https://professionalexcellence.org/members/featured",
        images: ["/placeholder-board-meeting.png", "/placeholder-summit.png"]
      },
      {
        _key: "member-2",
        organization: "United Nations Sustainable Business Charter",
        role: "Founding Signatory & Advisory Board",
        period: "2022 - Present",
        icon: "ShieldCheck",
        viewMode: "text",
        videoUrl: "https://sustainablebusinesscharter.org/signatories/featured",
        githubUrl: "https://github.com/un-business-charter/climate-action"
      },
      {
        _key: "member-3",
        organization: "Circular Economy Foundation - Make Business Circular",
        role: "Innovation Partner & Thought Leader",
        period: "2021 - Present",
        icon: "Award",
        viewMode: "text",
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
        icon: "Star",
        viewMode: "text",
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
