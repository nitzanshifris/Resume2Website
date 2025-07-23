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

interface BaseItem {
  _key: string
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

export interface ExperienceItem extends BaseItem {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
  imageUrl?: string
  embedUrl?: string
  githubUrl?: string
  code?: string
}

export interface EducationItem extends BaseItem {
  institution: string
  degree: string
  years: string
  description: string
  imageUrl?: string
  embedUrl?: string
  code?: string
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

export interface ProjectItem extends BaseItem {
  title: string
  description: string
  link: string
  icon: keyof typeof contentIconMap
  imageUrl?: string
  embedUrl?: string
  githubUrl?: string
  code?: string
}

export interface LanguageItem extends BaseItem {
  language: string
  proficiency: string
}

export interface CourseItem extends BaseItem {
  title: string
  institution: string
  year: string
  icon: keyof typeof contentIconMap
}

export interface PublicationItem extends BaseItem {
  title: string
  journal: string
  year: string
  link: string
  icon: keyof typeof contentIconMap
  imageUrl?: string
  code?: string
}

export interface SpeakingEngagementItem extends BaseItem {
  title: string
  event: string
  year: string
  location: string
  icon: keyof typeof contentIconMap
  imageUrl?: string
  code?: string
}

export interface VolunteerExperienceItem extends BaseItem {
  role: string
  organization: string
  period: string
  description: string
  icon: keyof typeof contentIconMap
  imageUrl?: string
  code?: string
}

export interface AchievementItem extends BaseItem {
  title: string
  description: string
  year: string
  icon: keyof typeof contentIconMap
  imageUrl?: string
  code?: string
}

export interface CertificationItem extends BaseItem {
  title: string
  issuingBody: string
  year: string
  icon: keyof typeof contentIconMap
  imageUrl?: string
  code?: string
}

export interface HobbyItem extends BaseItem {
  title: string
  icon: keyof typeof contentIconMap
}

export interface MembershipItem extends BaseItem {
  organization: string
  role: string
  period: string
  icon: keyof typeof contentIconMap
}

export interface TestimonialItem extends BaseItem {
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
    fullName: "Michelle Lopez",
    professionalTitle: "Fashion Designer",
    summaryTagline: "A Fashion Visionary, Creator, and Innovator.",
    profilePhotoUrl: "/placeholder.svg?width=200&height=200",
  },
  contact: {
    email: "michelle.lopez@email.com",
    phone: "(541) 754-3010",
    location: { city: "New York", country: "USA" },
    professionalLinks: [
      { name: "linkedin", url: "#" },
      { name: "resume", url: "/michelle-lopez-cv.pdf" },
      { name: "pinterest", url: "#" },
    ],
    availability: "Available for collaborations and new projects.",
    copyright: "© 2025 Michelle Lopez. All Rights Reserved.",
  },
  summary: {
    sectionTitle: "Professional Summary",
    summaryText:
      "My philosophy is rooted in the belief that fashion is a powerful form of self-expression. I strive to create pieces that are not only beautiful and innovative but also timeless, empowering the wearer with confidence and grace. Each design is a story, woven from threads of history, art, and modern sensibility.",
  },
  experience: {
    sectionTitle: "Career Milestones",
    experienceItems: [
      {
        _key: "exp1",
        title: "Senior Fashion Designer",
        company: "Escada",
        location: "Milan",
        startDate: "2017",
        endDate: "2021",
        description:
          "Led the design of commercially successful collections, including an acclaimed Art Nouveau-inspired men's line that boosted sales by 46%.",
        imageUrl: "/placeholder.svg?width=400&height=200",
        githubUrl: "https://github.com/vercel/next.js",
        code: `const EscadaCollection = ({ theme }) => {
  const style = getStyle(theme);
  return <div style={style}>Art Nouveau Men's Line</div>;
};`,
      },
      {
        _key: "exp2",
        title: "Associate Fashion Designer",
        company: "Dior",
        location: "New York",
        startDate: "2014",
        endDate: "2017",
        description:
          "Contributed to multiple high-revenue collections, specializing in luxury footwear and accessories.",
        imageUrl: "/placeholder.svg?width=400&height=200",
      },
      {
        _key: "exp3",
        title: "Junior Fashion Designer",
        company: "Prada",
        location: "Milan",
        startDate: "2011",
        endDate: "2014",
        description: "Assisted in the development of seasonal collections, from initial concept to final production.",
      },
    ],
  },
  education: {
    sectionTitle: "Academic Provenance",
    educationItems: [
      {
        _key: "edu1",
        institution: "Parsons School of Design",
        degree: "Master of Fine Arts in Fashion Design",
        years: "2012 - 2014",
        description:
          "My thesis collection, which explored the intersection of technology and haute couture, was featured in the graduate showcase and received industry acclaim.",
        imageUrl: "/placeholder.svg?width=400&height=200",
      },
      {
        _key: "edu2",
        institution: "Central Saint Martins",
        degree: "Bachelor of Arts in Fashion Design",
        years: "2008 - 2011",
        description: "Developed a strong foundation in conceptual design, pattern cutting, and garment construction.",
      },
      {
        _key: "edu3",
        institution: "Polimoda",
        degree: "Summer Intensive: Italian Leatherworking",
        years: "2010",
        description: "Studied traditional Italian leather craftsmanship and accessory design in Florence.",
      },
    ],
  },
  skills: {
    sectionTitle: "Areas of Expertise",
    skillCategories: [
      {
        categoryName: "Design & Concept",
        skills: [{ name: "Fashion Design" }, { name: "Conceptual Development" }, { name: "Trend Forecasting" }],
      },
      {
        categoryName: "Technical Skills",
        skills: [{ name: "Pattern Cutting" }, { name: "Draping" }, { name: "Garment Construction" }],
      },
      {
        categoryName: "Digital Tools",
        skills: [{ name: "Adobe Illustrator" }, { name: "Adobe Photoshop" }, { name: "CLO 3D" }],
      },
    ],
    ungroupedSkills: [{ name: "Fabric Sourcing" }, { name: "Sustainable Practices" }, { name: "Brand Strategy" }],
  },
  projects: {
    sectionTitle: "Selected Works",
    projectItems: [
      {
        _key: "proj1",
        title: "Project 'Chrysalis'",
        description:
          "A sustainable capsule collection using upcycled materials and zero-waste pattern cutting techniques.",
        link: "#",
        icon: "Lightbulb",
        imageUrl: "/placeholder.svg?width=400&height=200",
        embedUrl: "https://www.youtube.com/embed/P_wKDMcr16g",
        code: `import React from 'react';

function SustainableComponent() {
  return (
    <div>
      <h1>Zero-Waste Fashion</h1>
      <p>This component is built with 100% recycled code.</p>
    </div>
  );
}

export default SustainableComponent;`,
      },
      {
        _key: "proj2",
        title: "3D-Printed Footwear",
        description: "Collaboration with an engineering lab to develop a line of avant-garde, 3D-printed shoes.",
        link: "#",
        icon: "Lightbulb",
      },
      {
        _key: "proj3",
        title: "The 'Metropolis' Collection",
        description: "A ready-to-wear line inspired by the architecture of Fritz Lang's 1927 film.",
        link: "#",
        icon: "Palette",
      },
    ],
  },
  languages: {
    sectionTitle: "Languages",
    languageItems: [
      { _key: "lang1", language: "English", proficiency: "Native" },
      { _key: "lang2", language: "Italian", proficiency: "Fluent" },
      { _key: "lang3", language: "French", proficiency: "Conversational" },
    ],
  },
  courses: {
    sectionTitle: "Courses & Certifications",
    courseItems: [
      {
        _key: "course1",
        title: "Advanced Draping Techniques",
        institution: "The Fashion Institute",
        year: "2022",
        icon: "Award",
      },
      {
        _key: "course2",
        title: "Sustainable Textile Science",
        institution: "FutureLearn",
        year: "2021",
        icon: "Award",
      },
      { _key: "course3", title: "Digital Fashion Pro", institution: "Udemy", year: "2020", icon: "Award" },
    ],
  },
  publications: {
    sectionTitle: "Publications",
    publicationItems: [
      {
        _key: "pub1",
        title: "The Future of Digital Fashion",
        journal: "Vogue Business",
        year: "2023",
        link: "#",
        icon: "DraftingCompass",
      },
      {
        _key: "pub2",
        title: "Zero-Waste Pattern Cutting: A Manifesto",
        journal: "The Design Journal",
        year: "2022",
        link: "#",
        icon: "DraftingCompass",
      },
      {
        _key: "pub3",
        title: "Interview: On Craftsmanship",
        journal: "Business of Fashion",
        year: "2021",
        link: "#",
        icon: "DraftingCompass",
      },
    ],
  },
  speakingEngagements: {
    sectionTitle: "Speaking Engagements",
    engagementItems: [
      {
        _key: "speak1",
        title: "Keynote: 'Technology in Haute Couture'",
        event: "Global Fashion Summit",
        year: "2024",
        location: "Copenhagen",
        icon: "Layers",
      },
      {
        _key: "speak2",
        title: "Panelist: 'The Circular Economy in Fashion'",
        event: "Sustainable Brands Conference",
        year: "2023",
        location: "Paris",
        icon: "Layers",
      },
      {
        _key: "speak3",
        title: "Guest Lecturer",
        event: "Parsons School of Design",
        year: "2022",
        location: "New York",
        icon: "Layers",
      },
    ],
  },
  volunteer: {
    sectionTitle: "Volunteer Experience",
    volunteerItems: [
      {
        _key: "vol1",
        role: "Mentor for Young Designers",
        organization: "Fashion Forward Initiative",
        period: "2020 - Present",
        description: "Guiding emerging talent in collection development and brand strategy.",
        icon: "Lightbulb",
        code: `// Mentorship matching algorithm
function matchMentorToMentee(mentors, mentees) {
  return mentees.map(mentee => ({
    ...mentee,
    mentor: findBestMatch(mentee, mentors)
  }));
}`,
      },
      {
        _key: "vol2",
        role: "Workshop Facilitator",
        organization: "Dress for Success",
        period: "2019",
        description: "Led workshops on personal styling and professional wardrobing.",
        icon: "Lightbulb",
      },
      {
        _key: "vol3",
        role: "Costume Designer",
        organization: "Local Community Theatre",
        period: "2018",
        description: "Designed and created costumes for a local production of 'A Midsummer Night's Dream'.",
        icon: "Palette",
      },
    ],
  },
  achievements: {
    sectionTitle: "Achievements",
    achievementItems: [
      {
        _key: "ach1",
        title: "CFDA/Vogue Fashion Fund Finalist",
        description: "Recognized as one of the top emerging designers in the nation.",
        year: "2023",
        icon: "Star",
      },
      {
        _key: "ach2",
        title: "International Woolmark Prize",
        description: "Winner of the prestigious award for innovation in wool.",
        year: "2022",
        icon: "Star",
      },
      {
        _key: "ach3",
        title: "LVMH Prize for Young Fashion Designers",
        description: "Shortlisted for the coveted LVMH Prize.",
        year: "2021",
        icon: "Star",
        code: `function lvmhPrize(designer) {
  if (designer.isInnovative && designer.hasVision) {
    return "shortlisted";
  }
}`,
      },
    ],
  },
  certifications: {
    sectionTitle: "Certifications",
    certificationItems: [
      {
        _key: "cert1",
        title: "Certified Sustainable Fashion Practitioner",
        issuingBody: "Council for Sustainable Fashion",
        year: "2022",
        icon: "ShieldCheck",
      },
      {
        _key: "cert2",
        title: "Global Organic Textile Standard (GOTS)",
        issuingBody: "GOTS Organization",
        year: "2021",
        icon: "ShieldCheck",
      },
      {
        _key: "cert3",
        title: "Leather Working Group (LWG) Certified",
        issuingBody: "LWG",
        year: "2020",
        icon: "ShieldCheck",
      },
    ],
  },
  hobbies: {
    sectionTitle: "Hobbies & Interests",
    hobbyItems: [
      { _key: "hob1", title: "Vintage Textile Restoration", icon: "Heart" },
      { _key: "hob2", title: "Argentine Tango", icon: "Heart" },
      { _key: "hob3", title: "Ikebana (Japanese Flower Arranging)", icon: "Heart" },
      { _key: "hob4", title: "Sketching Urban Landscapes", icon: "DraftingCompass" },
      { _key: "hob5", title: "Pottery and Ceramics", icon: "Palette" },
      { _key: "hob6", title: "French New Wave Cinema", icon: "Star" },
    ],
  },
  memberships: {
    sectionTitle: "Professional Memberships",
    membershipItems: [
      {
        _key: "mem1",
        organization: "Council of Fashion Designers of America (CFDA)",
        role: "Member",
        period: "2023 - Present",
        icon: "Users",
      },
      {
        _key: "mem2",
        organization: "The Costume Society",
        role: "Member",
        period: "2020 - Present",
        icon: "Users",
      },
      {
        _key: "mem3",
        organization: "American Sewing Guild",
        role: "Member",
        period: "2018 - Present",
        icon: "Users",
      },
    ],
  },
  testimonials: {
    sectionTitle: "What Others Say",
    testimonialItems: [
      {
        _key: "test1",
        quote:
          "Michelle's vision is unparalleled. Her ability to blend classic silhouettes with modern sensibilities is what makes her a true artist in the fashion world.",
        authorName: "Anna Wintour",
        authorTitle: "Editor-in-Chief, Vogue",
        authorImage: "/placeholder.svg?width=100&height=100",
      },
      {
        _key: "test2",
        quote:
          "Working with Michelle was a transformative experience. Her attention to detail and commitment to quality are evident in every single stitch.",
        authorName: "Tom Ford",
        authorTitle: "Fashion Designer & Filmmaker",
        authorImage: "/placeholder.svg?width=100&height=100",
      },
      {
        _key: "test3",
        quote:
          "She possesses a rare combination of raw creativity and commercial acumen. Her collections don't just inspire; they sell.",
        authorName: "Marco Bizzarri",
        authorTitle: "CEO, Gucci",
        authorImage: "/placeholder.svg?width=100&height=100",
      },
    ],
  },
}
