import type React from "react"
import {
  Linkedin,
  FileText,
  PinIcon as Pinterest,
  Github,
  Twitter,
  Quote,
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
  pinterest: <Pinterest size={28} />,
  github: <Github size={28} />,
  twitter: <Twitter size={28} />,
}

// --- DATA TYPES ---

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

export interface ExperienceItem {
  _key?: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export interface EducationItem {
  _key?: string
  institution: string
  degree: string
  years: string
  description: string
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

export interface ProjectItem {
  _key?: string
  title: string
  description: string
  link: string
  icon: keyof typeof contentIconMap
  githubUrl?: string
  demoUrl?: string
  codeSnippet?: string
  images?: string[]
  technologiesUsed?: string[]
  tweetId?: string
}

export interface LanguageItem {
  _key?: string
  language: string
  proficiency: string
}

export interface CourseItem {
  _key?: string
  title: string
  institution: string
  year: string
  icon: keyof typeof contentIconMap
  tweetId?: string
  codeSnippet?: string
  images?: string[]
}

export interface PublicationItem {
  _key?: string
  title: string
  journal: string
  year: string
  link: string
  icon: keyof typeof contentIconMap
  tweetId?: string
  codeSnippet?: string
  images?: string[]
}

export interface SpeakingEngagementItem {
  _key?: string
  title: string
  event: string
  year: string
  location: string
  icon: keyof typeof contentIconMap
  tweetId?: string
  codeSnippet?: string
  images?: string[]
}

export interface VolunteerExperienceItem {
  _key?: string
  role: string
  organization: string
  period: string
  description: string
  icon: keyof typeof contentIconMap
  tweetId?: string
  codeSnippet?: string
  images?: string[]
}

// --- NEW DATA TYPES FOR NEW SECTIONS ---
export interface AchievementItem {
  _key?: string
  title: string
  description: string
  year: string
  icon: keyof typeof contentIconMap
  tweetId?: string
  codeSnippet?: string
  images?: string[]
}

export interface CertificationItem {
  _key?: string
  title: string
  issuingBody: string
  year: string
  icon: keyof typeof contentIconMap
  tweetId?: string
  codeSnippet?: string
  images?: string[]
}

export interface HobbyItem {
  _key?: string
  title: string
  icon: keyof typeof contentIconMap
  tweetId?: string
  codeSnippet?: string
  images?: string[]
}

export interface MembershipItem {
  _key?: string
  organization: string
  role: string
  period: string
  icon: keyof typeof contentIconMap
  tweetId?: string
  codeSnippet?: string
  images?: string[]
}

export interface TestimonialItem {
  _key?: string
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
        _key: "exp-0",
        title: "Senior Fashion Designer",
        company: "Escada",
        location: "Milan",
        startDate: "2017",
        endDate: "2021",
        description:
          "Led the design of commercially successful collections, including an acclaimed Art Nouveau-inspired men's line that boosted sales by 46%.",
      },
      {
        _key: "exp-1",
        title: "Associate Fashion Designer",
        company: "Dior",
        location: "New York",
        startDate: "2014",
        endDate: "2017",
        description:
          "Contributed to multiple high-revenue collections, specializing in luxury footwear and accessories.",
      },
      {
        _key: "exp-2",
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
        _key: "edu-0",
        institution: "Parsons School of Design",
        degree: "Master of Fine Arts in Fashion Design",
        years: "2012 - 2014",
        description:
          "My thesis collection, which explored the intersection of technology and haute couture, was featured in the graduate showcase and received industry acclaim.",
      },
      {
        _key: "edu-1",
        institution: "Central Saint Martins",
        degree: "Bachelor of Arts in Fashion Design",
        years: "2008 - 2011",
        description: "Developed a strong foundation in conceptual design, pattern cutting, and garment construction.",
      },
      {
        _key: "edu-2",
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
        _key: "proj-0",
        title: "Project 'Chrysalis'",
        description:
          "A sustainable capsule collection using upcycled materials and zero-waste pattern cutting techniques.",
        link: "#",
        icon: "Lightbulb",
        githubUrl: "https://github.com/michelle/chrysalis-collection",
        demoUrl: "https://chrysalis-fashion.demo",
        codeSnippet: `// Pattern generation algorithm
const generateZeroWastePattern = (measurements) => {
  const { bust, waist, hip } = measurements;
  return optimizeLayout({
    pieces: calculatePieces(bust, waist, hip),
    fabric: { width: 150, efficiency: 0.95 }
  });
}`,
        images: ["/elegant-summer-dress-runway.png", "/fabric-swatches-moodboard.png"],
        technologiesUsed: ["Sustainable Materials", "Zero-Waste Design", "3D Modeling"]
      },
      {
        _key: "proj-1",
        title: "3D-Printed Footwear",
        description: "Collaboration with an engineering lab to develop a line of avant-garde, 3D-printed shoes.",
        link: "#",
        icon: "Lightbulb",
        githubUrl: "https://github.com/michelle/3d-footwear",
        images: ["/futuristic-cursor.png", "/technical-drawing-tools.png"],
        technologiesUsed: ["3D Printing", "CAD Design", "Material Science"]
      },
      {
        _key: "proj-2",
        title: "The 'Metropolis' Collection",
        description: "A ready-to-wear line inspired by the architecture of Fritz Lang's 1927 film.",
        link: "#",
        icon: "Palette",
        demoUrl: "https://metropolis-collection.demo",
        images: ["/modern-web-app-interface.png", "/abstract-moonlight.png"],
        technologiesUsed: ["Conceptual Design", "Film History", "Urban Architecture"]
      },
      {
        _key: "proj-3",
        title: "Digital Fashion NFT Series",
        description: "Pioneering digital-only fashion pieces as NFTs, bridging haute couture with blockchain technology.",
        link: "#",
        icon: "Star",
        githubUrl: "https://github.com/michelle/fashion-nft",
        demoUrl: "https://fashion-nft.demo",
        codeSnippet: `// Smart contract for fashion NFT
contract FashionNFT is ERC721 {
  mapping(uint => FashionPiece) public pieces;
  
  function mintFashionPiece(
    string memory design,
    uint256 edition
  ) public returns (uint256) {
    // Minting logic here
  }
}`,
        images: ["/pixel-art-landscape.png", "/modern-code-editor.png"],
        technologiesUsed: ["Blockchain", "NFT", "Digital Fashion", "Smart Contracts"],
        tweetId: "1668408059125702661"  // Working Magic UI example
      },
    ],
  },
  languages: {
    sectionTitle: "Languages",
    languageItems: [
      { language: "English", proficiency: "Native" },
      { language: "Italian", proficiency: "Fluent" },
      { language: "French", proficiency: "Conversational" },
    ],
  },
  courses: {
    sectionTitle: "Courses & Certifications",
    courseItems: [
      { 
        _key: "course-0",
        title: "Advanced Draping Techniques", 
        institution: "The Fashion Institute", 
        year: "2022", 
        icon: "Award",
        tweetId: "1729918708385640757",  // Tech tweet
        codeSnippet: `// Calculate fabric draping physics\nfunction calculateDrape(fabric) {\n  const { weight, stiffness } = fabric;\n  return weight * Math.sin(stiffness * 0.5);\n}`,
        images: ["/elegant-summer-dress-runway.png"]
      },
      { 
        _key: "course-1",
        title: "Sustainable Textile Science", 
        institution: "FutureLearn", 
        year: "2021", 
        icon: "Award",
        tweetId: "1737870334136082861",  // Web dev tweet
        images: ["/fabric-swatches-moodboard.png"]
      },
      { 
        _key: "course-2",
        title: "Digital Fashion Pro", 
        institution: "Udemy", 
        year: "2020", 
        icon: "Award",
        tweetId: "1728110928389484866",  // AI tweet
        codeSnippet: `// 3D garment modeling\nconst garment = new Garment3D({\n  type: 'dress',\n  material: 'silk',\n  physics: true\n});`
      },
    ],
  },
  publications: {
    sectionTitle: "Publications",
    publicationItems: [
      {
        _key: "pub-0",
        title: "The Future of Digital Fashion",
        journal: "Vogue Business",
        year: "2023",
        link: "#",
        icon: "DraftingCompass",
        tweetId: "1724493237271478617",  // Real tweet ID - Design
        images: ["/modern-web-app-interface.png"]
      },
      {
        _key: "pub-1",
        title: "Zero-Waste Pattern Cutting: A Manifesto",
        journal: "The Design Journal",
        year: "2022",
        link: "#",
        icon: "DraftingCompass",
        tweetId: "1722673916815769927",  // Real tweet ID - Tech
        codeSnippet: `// Zero-waste pattern algorithm\nfunction optimizePattern(dimensions) {\n  return dimensions.reduce((waste, cut) => \n    waste - cut.area, totalFabric);\n}`
      },
      {
        _key: "pub-2",
        title: "Interview: On Craftsmanship",
        journal: "Business of Fashion",
        year: "2021",
        link: "#",
        icon: "DraftingCompass",
        tweetId: "1731000000000000000"  // Example interview tweet
      },
    ],
  },
  speakingEngagements: {
    sectionTitle: "Speaking Engagements",
    engagementItems: [
      {
        _key: "speak-0",
        title: "Keynote: 'Technology in Haute Couture'",
        event: "Global Fashion Summit",
        year: "2024",
        location: "Copenhagen",
        icon: "Layers",
        tweetId: "1730000000000000000",  // Example conference tweet
        images: ["/abstract-moonlight.png"]
      },
      {
        _key: "speak-1",
        title: "Panelist: 'The Circular Economy in Fashion'",
        event: "Sustainable Brands Conference",
        year: "2023",
        location: "Paris",
        icon: "Layers",
        tweetId: "1729000000000000000",  // Example panel tweet
        codeSnippet: `// Circular design principles\nconst circularDesign = {\n  reduce: minimizeWaste,\n  reuse: extendLifecycle,\n  recycle: enableDisassembly\n};`
      },
      {
        _key: "speak-2",
        title: "Guest Lecturer",
        event: "Parsons School of Design",
        year: "2022",
        location: "New York",
        icon: "Layers",
        tweetId: "1728000000000000000"  // Example education tweet
      },
    ],
  },
  volunteer: {
    sectionTitle: "Volunteer Experience",
    volunteerItems: [
      {
        _key: "vol-0",
        role: "Design Mentor",
        organization: "Fashion Forward Foundation",
        period: "2020 - Present",
        description: "Mentoring underprivileged youth interested in fashion careers, providing portfolio reviews and career guidance.",
        icon: "Heart",
        tweetId: "1727000000000000000",  // Example mentorship tweet
        images: ["/futuristic-cursor.png"]
      },
      {
        _key: "vol-1",
        role: "Workshop Leader",
        organization: "Sustainable Fashion Initiative",
        period: "2019 - 2021",
        description: "Leading monthly workshops on sustainable design practices and upcycling techniques.",
        icon: "Users",
        tweetId: "1726000000000000000",  // Example workshop tweet
        codeSnippet: `// Upcycling calculator\nfunction calculateUpcycleValue(item) {\n  return item.quality * item.rarity + \n         item.sentimentalValue;\n}`
      },
      {
        _key: "vol-2",
        role: "Creative Director",
        organization: "Charity Fashion Show NYC",
        period: "2018",
        description: "Organized and directed annual charity fashion show raising funds for textile waste reduction.",
        icon: "Star",
        tweetId: "1725000000000000000",  // Example charity tweet
        images: ["/elegant-summer-dress-runway.png"]
      },
      {
        _key: "vol-3",
        role: "Mentor for Young Designers",
        organization: "Fashion Forward Initiative",
        period: "2020 - Present",
        description: "Guiding emerging talent in collection development and brand strategy.",
        icon: "Lightbulb",
        tweetId: "1724000000000000000"  // Example mentorship tweet
      },
      {
        _key: "vol-4",
        role: "Workshop Facilitator",
        organization: "Dress for Success",
        period: "2019",
        description: "Led workshops on personal styling and professional wardrobing.",
        icon: "Lightbulb",
        tweetId: "1723000000000000000",  // Example workshop tweet
        codeSnippet: `// Style recommendation engine\nfunction recommendStyle(bodyType, occasion) {\n  return styleDB.filter(s => \n    s.fits.includes(bodyType) && \n    s.occasions.includes(occasion)\n  );\n}`
      },
      {
        _key: "vol-5",
        role: "Costume Designer",
        organization: "Local Community Theatre",
        period: "2018",
        description: "Designed and created costumes for a local production of 'A Midsummer Night's Dream'.",
        icon: "Palette",
        tweetId: "1722000000000000000",  // Example theatre tweet
        images: ["/pixel-art-landscape.png"]
      },
    ],
  },
  achievements: {
    sectionTitle: "Achievements",
    achievementItems: [
      {
        _key: "ach-0",
        title: "CFDA/Vogue Fashion Fund Finalist",
        description: "Recognized as one of the top emerging designers in the nation.",
        year: "2023",
        icon: "Star",
        tweetId: "1721000000000000000",  // Example award tweet
        images: ["/abstract-moonlight.png"]
      },
      {
        _key: "ach-1",
        title: "International Woolmark Prize",
        description: "Winner of the prestigious award for innovation in wool.",
        year: "2022",
        icon: "Star",
        tweetId: "1720000000000000000"  // Example woolmark tweet
      },
      {
        _key: "ach-2",
        title: "LVMH Prize for Young Fashion Designers",
        description: "Shortlisted for the coveted LVMH Prize.",
        year: "2021",
        icon: "Star",
        tweetId: "1719000000000000000",  // Example LVMH tweet
        codeSnippet: `// Award-winning collection algorithm\nconst collection = designs\n  .filter(d => d.innovation > 0.8)\n  .sort((a, b) => b.impact - a.impact);`
      },
      {
        _key: "ach-3",
        title: "Parsons Designer of the Year",
        description: "Awarded for outstanding innovation in sustainable fashion.",
        year: "2020",
        icon: "Award",
        tweetId: "1718000000000000000"  // Example parsons tweet
      },
    ],
  },
  certifications: {
    sectionTitle: "Certifications",
    certificationItems: [
      {
        _key: "cert-0",
        title: "Certified Sustainable Fashion Practitioner",
        issuingBody: "Council for Sustainable Fashion",
        year: "2022",
        icon: "ShieldCheck",
        tweetId: "1717000000000000000",  // Example certification tweet
        images: ["/fabric-swatches-moodboard.png"]
      },
      {
        _key: "cert-1",
        title: "Global Organic Textile Standard (GOTS)",
        issuingBody: "GOTS Organization",
        year: "2021",
        icon: "ShieldCheck",
        tweetId: "1716000000000000000"  // Example GOTS tweet
      },
      {
        _key: "cert-2",
        title: "Leather Working Group (LWG) Certified",
        issuingBody: "LWG",
        year: "2020",
        icon: "ShieldCheck",
        tweetId: "1715000000000000000",  // Example LWG tweet
        codeSnippet: `// Leather sustainability score\nfunction calculateLeatherScore(source) {\n  return source.traceability * 0.4 +\n         source.environmental * 0.6;\n}`
      },
      {
        _key: "cert-3",
        title: "Digital Fashion Innovation Certificate",
        issuingBody: "Fashion Institute of Technology",
        year: "2019",
        icon: "Award",
        tweetId: "1714000000000000000"  // Example FIT tweet
      },
    ],
  },
  hobbies: {
    sectionTitle: "Hobbies & Interests",
    hobbyItems: [
      { 
        _key: "hobby-0",
        title: "Vintage Textile Restoration", 
        icon: "Heart",
        tweetId: "1760000000000000000",
        images: ["/fabric-swatches-moodboard.png"]
      },
      { 
        _key: "hobby-1",
        title: "Argentine Tango", 
        icon: "Heart",
        tweetId: "1711000000000000000",
        images: ["/placeholder.jpg"]
      },
      { 
        _key: "hobby-2",
        title: "Ikebana (Japanese Flower Arranging)", 
        icon: "Heart",
        tweetId: "1760000000000000000",
        images: ["/placeholder.jpg"]
      },
      { 
        _key: "hobby-3",
        title: "Sketching Urban Landscapes", 
        icon: "DraftingCompass",
        tweetId: "1711000000000000000",
        images: ["/technical-drawing-tools.png"]
      },
      { 
        _key: "hobby-4",
        title: "Pottery and Ceramics", 
        icon: "Palette",
        tweetId: "1760000000000000000",
        images: ["/placeholder.jpg"]
      },
      { 
        _key: "hobby-5",
        title: "French New Wave Cinema", 
        icon: "Star",
        tweetId: "1711000000000000000",
        images: ["/placeholder.jpg"]
      },
    ],
  },
  memberships: {
    sectionTitle: "Professional Memberships",
    membershipItems: [
      {
        _key: "mem-0",
        organization: "Council of Fashion Designers of America (CFDA)",
        role: "Member",
        period: "2023 - Present",
        icon: "Users",
        tweetId: "1713000000000000000",  // Example CFDA tweet
        images: ["/modern-web-app-interface.png"]
      },
      {
        _key: "mem-1",
        organization: "The Costume Society",
        role: "Member",
        period: "2020 - Present",
        icon: "Users",
        tweetId: "1712000000000000000"  // Example costume society tweet
      },
      {
        _key: "mem-2",
        organization: "American Sewing Guild",
        role: "Member",
        period: "2018 - Present",
        icon: "Users",
        tweetId: "1711000000000000000",  // Example sewing guild tweet
        codeSnippet: `// Sewing pattern optimizer\nfunction optimizeStitching(pattern) {\n  return pattern.paths\n    .reduce((opt, path) => \n      opt.concat(shortestPath(path)), []\n    );\n}`
      },
      {
        _key: "mem-3",
        organization: "Sustainable Fashion Alliance",
        role: "Advisory Board Member",
        period: "2019 - Present",
        icon: "Star",
        tweetId: "1710000000000000000"  // Example sustainability tweet
      },
    ],
  },
  testimonials: {
    sectionTitle: "What Others Say",
    testimonialItems: [
      {
        quote:
          "Michelle's vision is unparalleled. Her ability to blend classic silhouettes with modern sensibilities is what makes her a true artist in the fashion world.",
        authorName: "Anna Wintour",
        authorTitle: "Editor-in-Chief, Vogue",
        authorImage: "/placeholder.svg?width=100&height=100",
      },
      {
        quote:
          "Working with Michelle was a transformative experience. Her attention to detail and commitment to quality are evident in every single stitch.",
        authorName: "Tom Ford",
        authorTitle: "Fashion Designer & Filmmaker",
        authorImage: "/placeholder.svg?width=100&height=100",
      },
      {
        quote:
          "She possesses a rare combination of raw creativity and commercial acumen. Her collections don't just inspire; they sell.",
        authorName: "Marco Bizzarri",
        authorTitle: "CEO, Gucci",
        authorImage: "/placeholder.svg?width=100&height=100",
      },
    ],
  },
}
