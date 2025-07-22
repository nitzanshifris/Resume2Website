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
  viewMode?: 'text' | 'images' | 'code' | 'github' | 'uri' | 'video' | 'tweet'
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

export interface ExperienceItem {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export interface EducationItem {
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
    fullName: "Michelle Lopez",
    professionalTitle: "Fashion Designer & Creative Director",
    summaryTagline: "Transforming Fabric into Art, One Stitch at a Time.",
    profilePhotoUrl: "/fashion-designer-sketching.png",
  },
  contact: {
    email: "michelle.lopez@email.com",
    phone: "(541) 754-3010",
    location: { city: "New York", country: "USA" },
    professionalLinks: [
      { name: "linkedin", url: "https://linkedin.com/in/michelle-lopez" },
      { name: "resume", url: "/michelle-lopez-cv.pdf" },
      { name: "pinterest", url: "https://pinterest.com/michellelopezdesigns" },
      { name: "github", url: "https://github.com/michellelopez" },
      { name: "twitter", url: "https://twitter.com/mlopezfashion" },
    ],
    availability: "Available for collaborations and new projects.",
    copyright: "© 2025 Michelle Lopez. All Rights Reserved.",
  },
  summary: {
    sectionTitle: "Design Philosophy & Vision",
    summaryText:
      "As a fashion designer at the intersection of tradition and technology, I believe that true luxury lies in sustainability, craftsmanship, and innovation. My journey from the ateliers of Milan to founding Maison Lopez has been driven by a singular vision: to create fashion that honors our planet while pushing the boundaries of design. Through zero-waste pattern cutting, AI-driven customization, and blockchain-verified supply chains, I'm proving that ethical fashion can be both beautiful and profitable. My work isn't just about creating clothes—it's about reimagining an entire industry. Every thread tells a story of transformation, every garment carries the promise of a more sustainable future. Fashion should empower, inspire, and endure. That's not just my philosophy; it's my commitment to every client, every student, and every young designer who dreams of changing the world through design.",
  },
  experience: {
    sectionTitle: "Career Milestones",
    experienceItems: [
      {
        title: "Creative Director & Head of Design",
        company: "Maison Lopez",
        location: "New York",
        startDate: "2021",
        endDate: "Present",
        description:
          "Founded my own luxury fashion house, specializing in sustainable haute couture. Launched 8 successful collections, featured in Vogue, Harper's Bazaar, and Paris Fashion Week. Generated $3.2M in revenue within the first year through direct-to-consumer sales and exclusive boutique partnerships.",
      },
      {
        title: "Senior Fashion Designer",
        company: "Escada",
        location: "Milan",
        startDate: "2017",
        endDate: "2021",
        description:
          "Led the design of commercially successful collections, including an acclaimed Art Nouveau-inspired men's line that boosted sales by 46%. Managed a team of 12 designers and collaborated with celebrity stylists for red carpet events. Introduced sustainable practices that reduced material waste by 30%.",
      },
      {
        title: "Associate Fashion Designer",
        company: "Dior",
        location: "New York",
        startDate: "2014",
        endDate: "2017",
        description:
          "Contributed to multiple high-revenue collections, specializing in luxury footwear and accessories. Designed the award-winning 'Midnight Bloom' handbag collection that became a bestseller in Asian markets. Coordinated with production teams in Italy to ensure quality standards.",
      },
      {
        title: "Junior Fashion Designer",
        company: "Prada",
        location: "Milan",
        startDate: "2011",
        endDate: "2014",
        description:
          "Assisted in the development of seasonal collections, from initial concept to final production. Specialized in textile innovation and collaborated with fabric suppliers to develop unique materials. Contributed to the 2013 Spring collection that increased youth market share by 23%.",
      },
    ],
  },
  education: {
    sectionTitle: "Academic Provenance",
    educationItems: [
      {
        institution: "Parsons School of Design",
        degree: "Master of Fine Arts in Fashion Design",
        years: "2012 - 2014",
        description:
          "My thesis collection, which explored the intersection of technology and haute couture, was featured in the graduate showcase and received industry acclaim. Graduated Summa Cum Laude with a 4.0 GPA. Received the Designer of the Year Award and a full scholarship from the CFDA.",
      },
      {
        institution: "Central Saint Martins",
        degree: "Bachelor of Arts in Fashion Design",
        years: "2008 - 2011",
        description: 
          "Developed a strong foundation in conceptual design, pattern cutting, and garment construction. Specialized in sustainable fashion practices and innovative textile manipulation. Final year collection was purchased by Browns Fashion for their emerging designers showcase.",
      },
      {
        institution: "Fashion Institute of Technology",
        degree: "Certificate in Fashion Business Management",
        years: "2015",
        description: 
          "Completed intensive program covering brand management, retail strategy, and fashion marketing. Developed business plan for sustainable fashion startup that won first place in the FIT Entrepreneurship Competition with $50,000 seed funding.",
      },
      {
        institution: "Polimoda",
        degree: "Summer Intensive: Italian Leatherworking & Haute Couture",
        years: "2010",
        description: 
          "Studied traditional Italian leather craftsmanship and accessory design in Florence. Apprenticed under master craftsmen at Gucci's atelier, learning hand-stitching techniques passed down through generations. Created limited edition handbag collection sold at Bergdorf Goodman.",
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
    sectionTitle: "Selected Works & Collections",
    projectItems: [
      {
        _key: "project-1",
        title: "Project 'Chrysalis' - Zero Waste Collection",
        description:
          "A revolutionary sustainable capsule collection using upcycled materials and zero-waste pattern cutting techniques. Featured in Vogue Sustainability Issue and won the Green Fashion Award 2023.",
        link: "https://maisonlopez.com/chrysalis",
        icon: "Lightbulb",
        viewMode: "code",
        codeSnippet: `// Sustainable fashion algorithm for zero-waste pattern generation
class SustainablePatternGenerator {
  constructor(private fabricWidth: number, private garmentSpecs: GarmentSpec[]) {}
  
  generateZeroWasteLayout(): PatternLayout {
    const optimizer = new FabricOptimizer(this.fabricWidth);
    const patterns = this.garmentSpecs.map(spec => {
      return optimizer.tessellate(spec, {
        allowRotation: true,
        minimizeWaste: true,
        grainlineConstraints: spec.grainRequirements
      });
    });
    
    return {
      efficiency: optimizer.calculateEfficiency(),
      wastePercentage: optimizer.getWasteMetrics(),
      patterns: patterns,
      sustainabilityScore: this.calculateSustainabilityImpact(patterns)
    };
  }
  
  private calculateSustainabilityImpact(patterns: Pattern[]): number {
    // Complex algorithm considering water usage, carbon footprint, and material lifecycle
    return patterns.reduce((score, pattern) => {
      return score + (pattern.ecoScore * pattern.materialWeight);
    }, 0) / patterns.length;
  }
}`,
        codeLanguage: "typescript",
        images: [
          "/fabric-swatches-moodboard.png",
          "/fashion-design-sketching.png",
          "/sustainable-fashion-layout.png"
        ],
        githubUrl: "https://github.com/fashion-tech/zero-waste-patterns",
        videoUrl: "https://vimeo.com/chrysalis-collection-2023"
      },
      {
        _key: "project-2", 
        title: "3D-Printed Avant-Garde Footwear",
        description: "Groundbreaking collaboration with MIT Media Lab to develop a line of parametrically designed, 3D-printed shoes. Each pair is custom-fitted using AI foot scanning technology.",
        link: "https://3dprintedfashion.tech",
        icon: "DraftingCompass",
        viewMode: "images",
        images: [
          "/technical-drawing-tools.png",
          "/futuristic-cursor.png",
          "/3d-printed-shoe-designs.png",
          "/parametric-heel-structure.png"
        ],
        githubUrl: "https://github.com/mit-fashion-lab/3d-footwear",
        tweetId: "1668408059125702661",
        codeSnippet: `// Parametric shoe design algorithm
const generateCustomShoe = (footScan: FootScanData): ShoeModel => {
  const { length, width, archHeight, pressurePoints } = footScan;
  
  return new ParametricShoe()
    .setDimensions(length, width)
    .generateArchSupport(archHeight, pressurePoints)
    .optimizeCushioning(pressurePoints)
    .applyAestheticPattern('voronoi')
    .export3DModel();
};`,
        codeTabs: [
          {
            name: "ShoeGenerator.tsx",
            language: "typescript",
            code: `// Main shoe generation component
import { useState } from 'react';
import { generateCustomShoe } from './algorithm';
import { FootScanner } from './FootScanner';

export const ShoeGenerator = () => {
  const [footData, setFootData] = useState<FootScanData | null>(null);
  const [shoeModel, setShoeModel] = useState<ShoeModel | null>(null);

  const handleScan = async () => {
    const data = await FootScanner.scan();
    setFootData(data);
    const model = generateCustomShoe(data);
    setShoeModel(model);
  };

  return (
    <div className="p-8">
      <h1>Custom 3D Shoe Generator</h1>
      <button onClick={handleScan}>Scan Foot</button>
      {shoeModel && <ModelViewer model={shoeModel} />}
    </div>
  );
};`
          },
          {
            name: "algorithm.ts",
            language: "typescript",
            code: `// Parametric shoe design algorithm
export const generateCustomShoe = (footScan: FootScanData): ShoeModel => {
  const { length, width, archHeight, pressurePoints } = footScan;
  
  return new ParametricShoe()
    .setDimensions(length, width)
    .generateArchSupport(archHeight, pressurePoints)
    .optimizeCushioning(pressurePoints)
    .applyAestheticPattern('voronoi')
    .export3DModel();
};

// Voronoi pattern generation
const generateVoronoiPattern = (surface: Surface): Pattern => {
  const points = distributePoints(surface, 100);
  return createVoronoiDiagram(points);
};`
          },
          {
            name: "styles.css",
            language: "css",
            code: `.shoe-viewer {
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
        title: "The 'Metropolis' Collection",
        description: "A ready-to-wear line inspired by Fritz Lang's 1927 film architecture. Features structured silhouettes with Art Deco influences, combining metallic fabrics with geometric cutouts.",
        link: "https://metropolis-fashion.com",
        icon: "Palette",
        viewMode: "video",
        videoUrl: "https://www.youtube.com/watch?v=metropolis-runway-2024",
        images: [
          "/art-deco-fashion.png",
          "/geometric-patterns.png",
          "/metallic-fabrics.png"
        ],
        linkUrl: "https://www.vogue.com/article/metropolis-collection-review"
      },
      {
        _key: "project-4",
        title: "Digital Couture NFT Collection",
        description: "Pioneering digital-only haute couture pieces sold as NFTs. Collaborated with digital artists to create wearable art for the metaverse, generating $500K in sales within 48 hours.",
        link: "https://digitalcouture.io",
        icon: "Star",
        viewMode: "github",
        githubUrl: "https://github.com/digital-fashion/nft-couture",
        tweetId: "1734567890123456789",
        codeSnippet: `// Smart contract for digital fashion NFTs
pragma solidity ^0.8.0;

contract DigitalCouture is ERC721 {
    struct Garment {
        string designHash;
        uint256 edition;
        bool isExclusive;
        mapping(address => bool) wearableIn;
    }
    
    function mintCouture(string memory design, uint256 editions) public {
        // Minting logic for limited edition digital garments
    }
}`
      },
      {
        _key: "project-5",
        title: "Tweet: Fashion Tech Innovation",
        description: "Showcasing our latest fashion technology innovations through social media. This tweet features our AI-powered design process with multiple images.",
        link: "https://twitter.com/fashiontech",
        icon: "Twitter",
        viewMode: "tweet",
        tweetId: "1678577280489234432", // Tweet with image carousel
      },
      {
        _key: "project-6",
        title: "Tweet: Sustainable Fashion Article",
        description: "Featured article about our sustainable fashion practices and zero-waste methodology. This tweet includes a rich media preview of our Vogue feature.",
        link: "https://twitter.com/sustainablefashion",
        icon: "Twitter",
        viewMode: "tweet",
        tweetId: "1675849118445436929", // Tweet with meta URL preview
      },
      {
        _key: "project-7",
        title: "Social Media Campaign",
        description: "Our viral social media campaign showcasing the intersection of technology and haute couture reached over 5M impressions.",
        link: "https://twitter.com/maisonlopez",
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
      { language: "Italian", proficiency: "Fluent" },
      { language: "French", proficiency: "Conversational" },
    ],
  },
  courses: {
    sectionTitle: "Professional Development & Training",
    courseItems: [
      { 
        _key: "course-1",
        title: "Advanced Draping & Couture Techniques Masterclass", 
        institution: "Chambre Syndicale de la Haute Couture", 
        year: "2022", 
        icon: "Award",
        viewMode: "text",
        codeSnippet: `// 3D draping simulation algorithm
const simulateDrape = (fabric: FabricProperties, form: DressForm) => {
  const gravity = new Vector3(0, -9.81, 0);
  const particles = fabric.generateParticleGrid();
  
  return physicsEngine.simulate({
    particles,
    constraints: fabric.stretchConstraints,
    forces: [gravity, fabric.windResistance],
    iterations: 1000
  });
};`,
        images: ["/draping-technique.png", "/couture-process.png"]
      },
      { 
        _key: "course-2",
        title: "Sustainable Textile Science & Circular Economy", 
        institution: "Copenhagen Fashion Summit Academy", 
        year: "2021", 
        icon: "ShieldCheck",
        viewMode: "text",
        linkUrl: "https://sustainablefashion.academy/certifications",
        videoUrl: "https://vimeo.com/sustainable-textiles-course"
      },
      { 
        _key: "course-3",
        title: "Digital Fashion Design in CLO3D & Browzwear", 
        institution: "Digital Fashion Academy", 
        year: "2020", 
        icon: "DraftingCompass",
        viewMode: "text",
        githubUrl: "https://github.com/digital-fashion/3d-design-patterns"
      },
      {
        _key: "course-4",
        title: "Fashion Tech: AI & Machine Learning for Designers",
        institution: "MIT Professional Education",
        year: "2023",
        icon: "Lightbulb",
        viewMode: "text",
        codeSnippet: `# AI trend prediction model
import tensorflow as tf
from fashion_dataset import FashionTrends

model = tf.keras.Sequential([
    tf.keras.layers.LSTM(128, return_sequences=True),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.LSTM(64),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(num_trends, activation='softmax')
])

# Predict next season's trending colors and patterns
predictions = model.predict(current_season_data)`,
        codeLanguage: "python"
      }
    ],
  },
  publications: {
    sectionTitle: "Publications & Media Features",
    publicationItems: [
      {
        _key: "pub-1",
        title: "The Future of Digital Fashion: NFTs Meet Haute Couture",
        journal: "Vogue Business",
        year: "2023",
        link: "https://voguebusiness.com/digital-fashion-nfts",
        icon: "DraftingCompass",
        viewMode: "text",
        linkUrl: "https://voguebusiness.com/technology/digital-fashion-nfts-haute-couture",
        images: ["/vogue-business-cover.png", "/digital-fashion-spread.png"]
      },
      {
        _key: "pub-2",
        title: "Zero-Waste Pattern Cutting: A Revolutionary Manifesto",
        journal: "The International Journal of Fashion Design",
        year: "2022",
        link: "https://fashionjournal.org/zero-waste-manifesto",
        icon: "Layers",
        viewMode: "text",
        codeSnippet: `// Extract from the published algorithm
function optimizePatternLayout(pieces: PatternPiece[]): Layout {
  // Recursive tessellation algorithm that achieved 
  // 98.7% fabric utilization in production tests
  return pieces.reduce((layout, piece) => {
    const bestFit = findOptimalPosition(layout, piece);
    return insertPiece(layout, piece, bestFit);
  }, emptyLayout);
}`,
        codeLanguage: "typescript"
      },
      {
        _key: "pub-3",
        title: "Exclusive Interview: Redefining Luxury Through Sustainability",
        journal: "Business of Fashion",
        year: "2021",
        link: "https://businessoffashion.com/michelle-lopez-interview",
        icon: "Quote",
        viewMode: "text",
        videoUrl: "https://www.youtube.com/watch?v=bof-interview-2021",
        tweetId: "1456789012345678901"
      },
      {
        _key: "pub-4",
        title: "Fashion's Digital Revolution: From Sketches to Algorithms",
        journal: "MIT Technology Review",
        year: "2024",
        link: "https://technologyreview.com/fashion-algorithms",
        icon: "Star",
        viewMode: "text",
        githubUrl: "https://github.com/fashion-tech/algorithmic-design",
        images: ["/mit-tech-review-cover.png", "/algorithmic-patterns.png"]
      },
    ],
  },
  speakingEngagements: {
    sectionTitle: "Speaking Engagements & Keynotes",
    engagementItems: [
      {
        _key: "speak-1",
        title: "Keynote: 'The Intersection of AI and Haute Couture'",
        event: "Global Fashion Summit 2024",
        year: "2024",
        location: "Copenhagen",
        icon: "Layers",
        viewMode: "text",
        videoUrl: "https://globalfashionsummit.com/keynote-michelle-lopez",
        images: ["/fashion-summit-stage.png", "/keynote-presentation.png"],
        linkUrl: "https://fashionsummit.com/speakers/michelle-lopez"
      },
      {
        _key: "speak-2",
        title: "Panelist: 'Circular Economy - Fashion's Future'",
        event: "Sustainable Brands Conference",
        year: "2023",
        location: "Paris",
        icon: "ShieldCheck",
        viewMode: "text",
        tweetId: "1623456789012345678",
        codeSnippet: `// Live coding demo from the panel
// Calculating fashion's carbon footprint
const calculateGarmentFootprint = (garment) => {
  const materialImpact = garment.materials.reduce((total, mat) => 
    total + (mat.weight * mat.carbonPerKg), 0);
  
  const productionImpact = garment.productionSteps.reduce((total, step) =>
    total + step.energyUsage * CARBON_PER_KWH, 0);
    
  const transportImpact = calculateShippingCarbon(garment.origin, garment.destination);
  
  return { materialImpact, productionImpact, transportImpact };
};`,
        codeLanguage: "javascript"
      },
      {
        _key: "speak-3",
        title: "Masterclass: 'Digital Pattern Making Revolution'",
        event: "Parsons School of Design",
        year: "2022",
        location: "New York",
        icon: "Award",
        viewMode: "text",
        githubUrl: "https://github.com/parsons-masterclass/digital-patterns",
        videoUrl: "https://parsons.edu/masterclass-recordings/lopez-2022"
      },
      {
        _key: "speak-4",
        title: "TEDx Talk: 'Fashion Without Waste Is Possible'",
        event: "TEDxMilano",
        year: "2023",
        location: "Milan",
        icon: "Star",
        viewMode: "text",
        videoUrl: "https://ted.com/talks/michelle_lopez_fashion_without_waste",
        images: ["/tedx-milano-stage.png", "/zero-waste-demonstration.png"],
        linkUrl: "https://www.ted.com/talks/michelle_lopez_fashion_without_waste"
      },
    ],
  },
  volunteer: {
    sectionTitle: "Community Impact & Volunteer Work",
    volunteerItems: [
      {
        _key: "vol-1",
        role: "Lead Mentor & Board Member",
        organization: "Fashion Forward Initiative",
        period: "2020 - Present",
        description: "Mentoring 25+ emerging designers annually in collection development, brand strategy, and sustainable practices. Established scholarship program that has awarded $150,000 to underrepresented students. Leading workshops on entrepreneurship and digital fashion innovation.",
        icon: "Heart",
        viewMode: "text",
        images: ["/mentorship-program.png", "/fashion-forward-workshop.png"],
        linkUrl: "https://fashionforward.org/mentors/michelle-lopez"
      },
      {
        _key: "vol-2",
        role: "Creative Director (Pro Bono)",
        organization: "Dress for Success Worldwide",
        period: "2019 - Present",
        description: "Redesigned the organization's professional wardrobe program, impacting 10,000+ women globally. Created capsule wardrobe guidelines and led styling workshops for job seekers. Developed partnerships with luxury brands for clothing donations worth $500,000 annually.",
        icon: "Users",
        viewMode: "text",
        videoUrl: "https://dressforsuccess.org/impact-stories/michelle-lopez",
        githubUrl: "https://github.com/dress-for-success/wardrobe-algorithm"
      },
      {
        _key: "vol-3",
        role: "Costume Designer & Arts Advocate",
        organization: "Broadway Cares/Equity Fights AIDS",
        period: "2018 - 2021",
        description: "Designed costumes for charity galas raising over $2M for AIDS research. Created the iconic 'Red Ribbon Gown' auctioned for $75,000. Collaborated with Broadway stars on fashion shows combining theatre and haute couture.",
        icon: "Palette",
        viewMode: "text",
        images: ["/broadway-cares-gala.png", "/red-ribbon-gown.png"],
        tweetId: "1234567890123456789"
      },
      {
        _key: "vol-4",
        role: "Founder - Fashion Skills Program",
        organization: "NYC Youth Empowerment Center",
        period: "2022 - Present",
        description: "Founded and teach free fashion design program for at-risk youth. 85% of graduates have entered fashion school or industry jobs. Program includes pattern making, sewing, digital design, and entrepreneurship. Secured sponsorships from major fashion houses for equipment and materials.",
        icon: "Star",
        viewMode: "text",
        codeSnippet: `// Student project: Fashion design app
class FashionSketchApp {
  constructor() {
    this.canvas = new FabricCanvas();
    this.tools = ['pencil', 'brush', 'patterns', 'colors'];
    this.templates = this.loadCroquis();
  }
  
  // Teaching students to code their designs
  generateTechPack() {
    return {
      sketches: this.canvas.exportSketches(),
      measurements: this.calculateProportions(),
      materials: this.selectedFabrics,
      costEstimate: this.calculateProduction()
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
        title: "CFDA/Vogue Fashion Fund Winner",
        description: "Won the prestigious CFDA/Vogue Fashion Fund with a $400,000 grant and year-long mentorship. Selected from over 500 applicants for revolutionary sustainable design approach and innovative business model. Mentored by Diane von Furstenberg and Tom Ford.",
        year: "2023",
        icon: "Star",
        viewMode: "text",
        images: ["/cfda-award-ceremony.png", "/vogue-fund-trophy.png"],
        linkUrl: "https://cfda.com/programs/designer-programs/fashion-fund/2023-winner",
        videoUrl: "https://vogue.com/video/cfda-fashion-fund-2023-winner"
      },
      {
        _key: "achieve-2",
        title: "International Woolmark Prize - Global Winner",
        description: "First American designer to win the global Woolmark Prize in a decade. Awarded €200,000 for groundbreaking biodegradable wool innovations. Collection showcased at Paris Fashion Week and stocked in 150+ luxury retailers worldwide.",
        year: "2022",
        icon: "Award",
        viewMode: "text",
        githubUrl: "https://github.com/woolmark/innovation-lab",
        tweetId: "1567890123456789012"
      },
      {
        _key: "achieve-3",
        title: "LVMH Prize for Young Fashion Designers - Grand Prize",
        description: "Awarded the LVMH Prize grand prize of €300,000 and mentorship from LVMH executives. Recognized for merging traditional craftsmanship with cutting-edge technology. Led to collaboration opportunities with Louis Vuitton and Dior.",
        year: "2021",
        icon: "ShieldCheck",
        viewMode: "text",
        images: ["/lvmh-prize-ceremony.png", "/bernard-arnault-presentation.png"],
        linkUrl: "https://lvmhprize.com/designers/2021/michelle-lopez"
      },
      {
        _key: "achieve-4",
        title: "UNESCO Creative Cities Award for Sustainable Fashion",
        description: "Honored by UNESCO for contributions to sustainable fashion education and innovation. Established fashion incubator supporting 50+ emerging sustainable designers. Program model adopted by fashion schools in 12 countries.",
        year: "2024",
        icon: "Heart",
        viewMode: "text",
        codeSnippet: `// Open-sourced sustainability tracking system
const SustainabilityIndex = {
  calculateScore: (brand) => {
    const metrics = {
      materials: assessMaterialSustainability(brand.materials),
      production: evaluateProductionMethods(brand.factories),
      labor: auditLaborPractices(brand.suppliers),
      transparency: measureSupplyChainVisibility(brand.data),
      circularity: assessEndOfLifeOptions(brand.products)
    };
    
    return generateComprehensiveReport(metrics);
  }
};`,
        codeLanguage: "javascript"
      },
    ],
  },
  certifications: {
    sectionTitle: "Professional Certifications & Accreditations",
    certificationItems: [
      {
        _key: "cert-1",
        title: "Certified Sustainable Fashion Practitioner - Level 5 (Expert)",
        issuingBody: "International Council for Sustainable Fashion",
        year: "2022",
        icon: "ShieldCheck",
        viewMode: "text",
        linkUrl: "https://sustainablefashion.org/certified-practitioners/michelle-lopez",
        images: ["/sustainable-fashion-cert.png", "/certification-badge.png"],
        codeSnippet: `// Certification project: LCA calculator
function calculateLifecycleAssessment(garment) {
  const phases = {
    rawMaterials: calculateExtractionImpact(garment.materials),
    manufacturing: calculateProductionImpact(garment.processes),
    distribution: calculateTransportImpact(garment.logistics),
    use: calculateWearAndCareImpact(garment.careInstructions),
    endOfLife: calculateDisposalImpact(garment.recyclability)
  };
  
  return generateLCAReport(phases);
}`,
        codeLanguage: "javascript"
      },
      {
        _key: "cert-2",
        title: "Global Organic Textile Standard (GOTS) - Approved Designer",
        issuingBody: "GOTS International Organization",
        year: "2021",
        icon: "Layers",
        viewMode: "text",
        githubUrl: "https://github.com/gots-certified/organic-textile-standards",
        videoUrl: "https://global-standard.org/certified-designers/michelle-lopez"
      },
      {
        _key: "cert-3",
        title: "Cradle to Cradle Certified™ Product Designer",
        issuingBody: "Cradle to Cradle Products Innovation Institute",
        year: "2023",
        icon: "Award",
        viewMode: "text",
        images: ["/c2c-certification.png", "/circular-design-principles.png"],
        linkUrl: "https://c2ccertified.org/certified-designers"
      },
      {
        _key: "cert-4",
        title: "B Corporation Certified Fashion Business",
        issuingBody: "B Lab Global",
        year: "2024",
        icon: "Star",
        viewMode: "text",
        tweetId: "1789012345678901234",
        linkUrl: "https://bcorporation.net/directory/maison-lopez",
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
    sectionTitle: "Passions & Personal Interests",
    hobbyItems: [
      { 
        _key: "hobby-1",
        title: "Vintage Textile Restoration & Collection", 
        icon: "Heart",
        viewMode: "text",
        images: ["/vintage-textile-collection.png", "/restoration-process.png"],
        linkUrl: "https://instagram.com/michellesvintage"
      },
      { 
        _key: "hobby-2",
        title: "Argentine Tango Competition Dancing", 
        icon: "Heart",
        viewMode: "text",
        videoUrl: "https://youtube.com/tango-championship-2023",
        images: ["/tango-performance.png"]
      },
      { 
        _key: "hobby-3",
        title: "Ikebana Master - Japanese Flower Arranging", 
        icon: "Palette",
        viewMode: "text",
        images: ["/ikebana-arrangements.png", "/japanese-aesthetics.png"],
        codeSnippet: `// Ikebana principles in fashion design
const IkebanaDesign = {
  principles: {
    asymmetry: 'Creating balance through inequality',
    simplicity: 'Maximum impact with minimal elements',
    seasonality: 'Honoring natural cycles',
    space: 'Celebrating negative space as design element'
  },
  
  applyToFashion: (garment) => {
    return incorporateJapaneseAesthetics(garment);
  }
};`,
        codeLanguage: "javascript"
      },
      { 
        _key: "hobby-4",
        title: "Urban Sketching & Fashion Illustration", 
        icon: "DraftingCompass",
        viewMode: "text",
        githubUrl: "https://github.com/urban-sketchers/fashion-illustrations",
        images: ["/urban-sketches.png", "/fashion-illustrations.png"]
      },
    ],
  },
  memberships: {
    sectionTitle: "Professional Affiliations & Leadership",
    membershipItems: [
      {
        _key: "member-1",
        organization: "Council of Fashion Designers of America (CFDA)",
        role: "Board Member & Sustainability Committee Chair",
        period: "2023 - Present",
        icon: "Users",
        viewMode: "text",
        linkUrl: "https://cfda.com/members/michelle-lopez",
        images: ["/cfda-board-meeting.png", "/sustainability-summit.png"]
      },
      {
        _key: "member-2",
        organization: "United Nations Fashion Industry Charter",
        role: "Founding Signatory & Advisory Board",
        period: "2022 - Present",
        icon: "ShieldCheck",
        viewMode: "text",
        videoUrl: "https://unfashioncharter.org/signatories/maison-lopez",
        githubUrl: "https://github.com/un-fashion-charter/climate-action"
      },
      {
        _key: "member-3",
        organization: "Ellen MacArthur Foundation - Make Fashion Circular",
        role: "Innovation Partner & Thought Leader",
        period: "2021 - Present",
        icon: "Award",
        viewMode: "text",
        codeSnippet: `// Circular fashion tracking system
interface CircularFashionMetrics {
  design: {
    durability: number;      // Years of expected use
    recyclability: number;   // % of recyclable materials
    modularity: boolean;     // Can be disassembled
  };
  production: {
    wasteReduction: number;  // % waste eliminated
    renewableEnergy: number; // % renewable energy used
  };
  endOfLife: {
    takeBackProgram: boolean;
    upcyclingOptions: string[];
    biodegradability: number; // % biodegradable
  };
}`,
        codeLanguage: "typescript"
      },
      {
        _key: "member-4",
        organization: "Fashion Revolution Global Advisory Committee",
        role: "Strategic Advisor & Transparency Advocate",
        period: "2020 - Present",
        icon: "Star",
        viewMode: "text",
        tweetId: "1890123456789012345",
        linkUrl: "https://fashionrevolution.org/advisors/michelle-lopez"
      },
    ],
  },
  testimonials: {
    sectionTitle: "Industry Testimonials & Endorsements",
    testimonialItems: [
      {
        quote:
          "Michelle's revolutionary approach to sustainable luxury has redefined what haute couture means in the 21st century. Her vision is unparalleled - she doesn't just follow trends, she creates movements. Working with her on the CFDA initiatives has been transformative for the entire American fashion industry.",
        authorName: "Anna Wintour",
        authorTitle: "Editor-in-Chief, Vogue & Artistic Director, Condé Nast",
        authorImage: "/anna-wintour-portrait.png",
      },
      {
        quote:
          "In my 40 years in fashion, I've rarely encountered a designer with Michelle's unique combination of technical mastery and visionary creativity. Her zero-waste techniques should be taught in every fashion school. She's not just designing clothes; she's architecting the future of our industry.",
        authorName: "Giorgio Armani",
        authorTitle: "Founder & CEO, Giorgio Armani S.p.A.",
        authorImage: "/giorgio-armani-portrait.png",
      },
      {
        quote:
          "Michelle Lopez represents everything we look for at LVMH - innovation, craftsmanship, and an unwavering commitment to excellence. Her digital fashion NFT project opened our eyes to entirely new revenue streams. She's a visionary who delivers results. Her brand has exceeded all growth projections.",
        authorName: "Bernard Arnault",
        authorTitle: "Chairman & CEO, LVMH",
        authorImage: "/bernard-arnault-portrait.png",
      },
      {
        quote:
          "As her former professor at Parsons, I knew Michelle would change fashion. But she's exceeded even my highest expectations. Her ability to merge technology with traditional craftsmanship while maintaining sustainability is genius. She's become the role model for our students - the future of fashion design.",
        authorName: "Tim Gunn",
        authorTitle: "Former Chair of Fashion Design, Parsons School of Design",
        authorImage: "/tim-gunn-portrait.png",
      },
    ],
  },
}
