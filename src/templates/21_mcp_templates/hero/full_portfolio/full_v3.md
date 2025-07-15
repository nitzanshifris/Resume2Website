import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, MotionValue, HTMLMotionProps } from "framer-motion"
import { Mail, Phone, MapPin, Calendar, ExternalLink, Download, Github, Linkedin, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Utility function for class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Portfolio data interface
interface PortfolioData {
  personalInfo: {
    name: string
    title: string
    email: string
    phone: string
    location: string
    website: string
    summary: string
    profileImage: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    duration: string
    description: string
    achievements: string[]
  }>
  projects: Array<{
    id: string
    title: string
    description: string
    image: string
    technologies: string[]
    liveUrl?: string
    githubUrl?: string
    category: string
  }>
  skills: Array<{
    category: string
    items: string[]
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    year: string
    description: string
  }>
  social: {
    github?: string
    linkedin?: string
    instagram?: string
  }
}

// Animated Text Cycle Component
interface AnimatedTextCycleProps {
  words: string[]
  interval?: number
  className?: string
}

function AnimatedTextCycle({
  words,
  interval = 5000,
  className = "",
}: AnimatedTextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [width, setWidth] = useState("auto")
  const measureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (measureRef.current) {
      const elements = measureRef.current.children
      if (elements.length > currentIndex) {
        const newWidth = elements[currentIndex].getBoundingClientRect().width
        setWidth(`${newWidth}px`)
      }
    }
  }, [currentIndex])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, interval)

    return () => clearInterval(timer)
  }, [interval, words.length])

  const containerVariants = {
    hidden: { 
      y: -20,
      opacity: 0,
      filter: "blur(8px)"
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      y: 20,
      opacity: 0,
      filter: "blur(8px)",
      transition: { 
        duration: 0.3, 
        ease: "easeIn"
      }
    },
  }

  return (
    <>
      <div 
        ref={measureRef} 
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none"
        style={{ visibility: "hidden" }}
      >
        {words.map((word, i) => (
          <span key={i} className={`font-bold ${className}`}>
            {word}
          </span>
        ))}
      </div>

      <motion.span 
        className="relative inline-block"
        animate={{ 
          width,
          transition: { 
            type: "spring",
            stiffness: 150,
            damping: 15,
            mass: 1.2,
          }
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentIndex}
            className={`inline-block font-bold ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ whiteSpace: "nowrap" }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  )
}

// Hero Gallery Scroll Animation Components
interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>
}

const ContainerScrollContext = React.createContext<ContainerScrollContextValue | undefined>(undefined)

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (!context) {
    throw new Error("useContainerScrollContext must be used within a ContainerScroll Component")
  }
  return context
}

const ContainerScroll = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
  })
  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-screen w-full", className)}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}

const BentoGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "threeCells" | "fourCells" }
>(({ variant = "default", className, ...props }, ref) => {
  const variantClasses = {
    default: `
      grid-cols-8 grid-rows-[1fr_0.5fr_0.5fr_1fr]
      [&>*:first-child]:col-span-8 md:[&>*:first-child]:col-span-6 [&>*:first-child]:row-span-3
      [&>*:nth-child(2)]:col-span-2 md:[&>*:nth-child(2)]:row-span-2 [&>*:nth-child(2)]:hidden md:[&>*:nth-child(2)]:block
      [&>*:nth-child(3)]:col-span-2 md:[&>*:nth-child(3)]:row-span-2 [&>*:nth-child(3)]:hidden md:[&>*:nth-child(3)]:block
      [&>*:nth-child(4)]:col-span-4 md:[&>*:nth-child(4)]:col-span-3
      [&>*:nth-child(5)]:col-span-4 md:[&>*:nth-child(5)]:col-span-3
    `,
    threeCells: `
      grid-cols-2 grid-rows-2
      [&>*:first-child]:col-span-2
    `,
    fourCells: `
      grid-cols-3 grid-rows-2
      [&>*:first-child]:col-span-1
      [&>*:nth-child(2)]:col-span-2
      [&>*:nth-child(3)]:col-span-2
    `,
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative grid gap-4 [&>*:first-child]:origin-top-right [&>*:nth-child(3)]:origin-bottom-right [&>*:nth-child(4)]:origin-top-right",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
})
BentoGrid.displayName = "BentoGrid"

const BentoCell = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, style, ...props }, ref) => {
    const { scrollYProgress } = useContainerScrollContext()
    const translate = useTransform(scrollYProgress, [0.1, 0.9], ["-35%", "0%"])
    const scale = useTransform(scrollYProgress, [0, 0.9], [0.5, 1])

    return (
      <motion.div
        ref={ref}
        className={className}
        style={{ translate, scale, ...style }}
        {...props}
      />
    )
  }
)
BentoCell.displayName = "BentoCell"

const ContainerScale = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, style, ...props }, ref) => {
    const { scrollYProgress } = useContainerScrollContext()
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    const position = useTransform(scrollYProgress, (pos) =>
      pos >= 0.6 ? "absolute" : "fixed"
    )
    return (
      <motion.div
        ref={ref}
        className={cn("left-1/2 top-1/2 size-fit", className)}
        style={{
          translate: "-50% -50%",
          scale,
          position,
          opacity,
          ...style,
        }}
        {...props}
      />
    )
  }
)
ContainerScale.displayName = "ContainerScale"

// Fashion Card Component
interface FashionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string
  title: string
  description?: string
  category?: string
  technologies?: string[]
  liveUrl?: string
  githubUrl?: string
}

function FashionCard({
  image,
  title,
  description,
  category,
  technologies = [],
  liveUrl,
  githubUrl,
  className,
  ...props
}: FashionCardProps) {
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 })
  const cardRef = React.useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotationX = (y - centerY) / 20
      const rotationY = -(x - centerX) / 20
      
      setRotation({ x: rotationX, y: rotationY })
    }
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
  }

  return (
    <div className={cn("group", className)} {...props}>
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-xl transition-all duration-300 bg-card border"
        style={{ 
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm"></div>
        
        <div className="relative z-20 flex flex-col overflow-hidden rounded-xl">
          <div className="aspect-[4/3] w-full">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="p-5 bg-card flex flex-col space-y-2 flex-grow">
            {category && (
              <Badge variant="secondary" className="w-fit text-xs">
                {category}
              </Badge>
            )}
            
            <h3 className="font-semibold text-lg leading-none tracking-tight">
              {title}
            </h3>
            
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
            
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {technologies.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-2 mt-auto pt-3">
              {liveUrl && (
                <Button size="sm" variant="default" className="flex-1">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View
                </Button>
              )}
              {githubUrl && (
                <Button size="sm" variant="outline" className="flex-1">
                  <Github className="w-3 h-3 mr-1" />
                  Code
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Portfolio Component
function MichelleLopezPortfolio() {
  // Sample data for Michelle Lopez
  const portfolioData: PortfolioData = {
    personalInfo: {
      name: "Michelle Lopez",
      title: "Fashion Designer",
      email: "michelle@fashiondesign.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      website: "www.michellelopez.design",
      summary: "Innovative fashion designer with 8+ years of experience creating cutting-edge designs for luxury brands. Specialized in sustainable fashion and contemporary women's wear.",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80"
    },
    experience: [
      {
        id: "1",
        company: "Luxury Fashion House",
        position: "Senior Fashion Designer",
        duration: "2020 - Present",
        description: "Lead designer for women's ready-to-wear collections",
        achievements: [
          "Increased sales by 35% with sustainable collection launch",
          "Led team of 8 designers and pattern makers",
          "Featured in Vogue and Harper's Bazaar"
        ]
      },
      {
        id: "2",
        company: "Contemporary Brand",
        position: "Fashion Designer",
        duration: "2018 - 2020",
        description: "Designed seasonal collections for contemporary market",
        achievements: [
          "Developed signature print collection",
          "Collaborated with celebrity stylists",
          "Managed production timeline and quality control"
        ]
      }
    ],
    projects: [
      {
        id: "1",
        title: "Sustainable Evening Wear",
        description: "Luxury evening wear collection made from recycled materials and organic fabrics",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
        technologies: ["Sustainable Design", "Pattern Making", "Draping"],
        category: "Evening Wear",
        liveUrl: "#",
        githubUrl: "#"
      },
      {
        id: "2",
        title: "Urban Street Collection",
        description: "Contemporary streetwear inspired by urban architecture and modern lifestyle",
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
        technologies: ["Street Fashion", "Technical Fabrics", "Color Theory"],
        category: "Streetwear",
        liveUrl: "#",
        githubUrl: "#"
      },
      {
        id: "3",
        title: "Minimalist Workwear",
        description: "Clean, sophisticated pieces for the modern professional woman",
        image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
        technologies: ["Minimalism", "Tailoring", "Functional Design"],
        category: "Workwear",
        liveUrl: "#",
        githubUrl: "#"
      },
      {
        id: "4",
        title: "Avant-Garde Runway",
        description: "Experimental designs pushing the boundaries of traditional fashion",
        image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
        technologies: ["Avant-Garde", "3D Design", "Experimental Materials"],
        category: "Runway",
        liveUrl: "#",
        githubUrl: "#"
      },
      {
        id: "5",
        title: "Bridal Couture",
        description: "Bespoke bridal gowns with intricate hand-sewn details",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
        technologies: ["Couture", "Hand Sewing", "Beadwork"],
        category: "Bridal",
        liveUrl: "#",
        githubUrl: "#"
      }
    ],
    skills: [
      {
        category: "Design Skills",
        items: ["Fashion Illustration", "Pattern Making", "Draping", "Color Theory", "Textile Design"]
      },
      {
        category: "Software",
        items: ["Adobe Illustrator", "Photoshop", "CLO 3D", "Gerber AccuMark", "Lectra"]
      },
      {
        category: "Specializations",
        items: ["Sustainable Fashion", "Luxury Design", "Ready-to-Wear", "Couture", "Streetwear"]
      }
    ],
    education: [
      {
        id: "1",
        institution: "Fashion Institute of Technology",
        degree: "Bachelor of Fine Arts in Fashion Design",
        year: "2016",
        description: "Graduated Summa Cum Laude with focus on sustainable design practices"
      }
    ],
    social: {
      github: "https://github.com/michellelopez",
      linkedin: "https://linkedin.com/in/michellelopez",
      instagram: "https://instagram.com/michellelopezdesign"
    }
  }

  const heroImages = [
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
    "https://images.unsplash.com/photo-1543076447-215ad9ba6923?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80"
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Scroll Animation */}
      <ContainerScroll className="h-[300vh]">
        <BentoGrid className="sticky left-0 top-0 z-0 h-screen w-full p-4">
          {heroImages.map((imageUrl, index) => (
            <BentoCell
              key={index}
              className="overflow-hidden rounded-xl shadow-xl"
            >
              <img
                className="size-full object-cover object-center"
                src={imageUrl}
                alt="Fashion design"
              />
            </BentoCell>
          ))}
        </BentoGrid>

        <ContainerScale className="relative z-10 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              {portfolioData.personalInfo.name}
            </h1>
            <div className="text-2xl md:text-3xl text-muted-foreground mb-8">
              <AnimatedTextCycle 
                words={["Fashion Designer", "Creative Director", "Sustainable Design Expert", "Luxury Brand Specialist"]}
                interval={3000}
                className="text-primary font-semibold"
              />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {portfolioData.personalInfo.summary}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="px-8">
                View Portfolio
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </Button>
            </div>
          </div>
        </ContainerScale>
      </ContainerScroll>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-lg text-muted-foreground">
              Let's collaborate on your next fashion project
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="w-8 h-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground">{portfolioData.personalInfo.email}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-muted-foreground">{portfolioData.personalInfo.phone}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-muted-foreground">{portfolioData.personalInfo.location}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience</h2>
            <p className="text-lg text-muted-foreground">
              My professional journey in fashion design
            </p>
          </div>
          
          <div className="space-y-8">
            {portfolioData.experience.map((exp) => (
              <Card key={exp.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{exp.position}</CardTitle>
                      <p className="text-lg text-primary font-medium">{exp.company}</p>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {exp.duration}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{exp.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Key Achievements:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {exp.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-lg text-muted-foreground">
              A showcase of my latest fashion collections and designs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.projects.map((project) => (
              <FashionCard
                key={project.id}
                image={project.image}
                title={project.title}
                description={project.description}
                category={project.category}
                technologies={project.technologies}
                liveUrl={project.liveUrl}
                githubUrl={project.githubUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Expertise</h2>
            <p className="text-lg text-muted-foreground">
              Technical skills and design specializations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolioData.skills.map((skillGroup, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{skillGroup.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Education</h2>
            <p className="text-lg text-muted-foreground">
              Academic background and qualifications
            </p>
          </div>
          
          <div className="space-y-6">
            {portfolioData.education.map((edu) => (
              <Card key={edu.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{edu.degree}</h3>
                      <p className="text-lg text-primary">{edu.institution}</p>
                    </div>
                    <Badge variant="outline">{edu.year}</Badge>
                  </div>
                  <p className="text-muted-foreground">{edu.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">{portfolioData.personalInfo.name}</h3>
              <p className="text-muted-foreground">{portfolioData.personalInfo.title}</p>
            </div>
            
            <div className="flex items-center gap-4">
              {portfolioData.social.github && (
                <Button variant="ghost" size="icon">
                  <Github className="w-5 h-5" />
                </Button>
              )}
              {portfolioData.social.linkedin && (
                <Button variant="ghost" size="icon">
                  <Linkedin className="w-5 h-5" />
                </Button>
              )}
              {portfolioData.social.instagram && (
                <Button variant="ghost" size="icon">
                  <Instagram className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 {portfolioData.personalInfo.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MichelleLopezPortfolio