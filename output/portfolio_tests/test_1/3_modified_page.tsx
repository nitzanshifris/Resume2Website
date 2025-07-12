"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "@/components/ui/sparkles"
import { FlipWords } from "@/components/ui/flip-words"
import { VerticalTimeline } from "@/components/ui/vertical-timeline"
import { FloatingNav } from "@/components/ui/floating-nav"
import { BentoGridItem } from "@/components/ui/bento-grid-item"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { EditableText } from "@/components/ui/editable-text"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { BackgroundGradient } from "@/components/ui/background-gradient"
import { Button } from "@/components/ui/button"
import {
  Linkedin,
  FileText,
  PinIcon as Pinterest,
  Palette,
  SwatchBook,
  DraftingCompass,
  Layers,
  Settings,
  Award,
  Lightbulb,
  Mail,
  Phone,
  LinkIcon,
  Download,
} from "lucide-react"
import { toast } from "sonner"

// Helper to format keys for display
const formatLabel = (key: string) => {
  const result = key.replace(/([A-Z])/g, " $1")
  return result.charAt(0).toUpperCase() + result.slice(1)
}

const iconMap = {
  Lightbulb: <Lightbulb className="h-4 w-4 text-muted-foreground" />,
  Palette: <Palette className="h-4 w-4 text-muted-foreground" />,
  SwatchBook: <SwatchBook className="h-4 w-4 text-muted-foreground" />,
  Layers: <Layers className="h-4 w-4 text-muted-foreground" />,
  DraftingCompass: <DraftingCompass className="h-4 w-4 text-muted-foreground" />,
  Award: <Award className="h-4 w-4 text-muted-foreground" />,
}

const initialData = {
  hero: {
    name: "GUY SAGEE",
    subTitle: "A",
    flipWords: [
      "Professional",
      "Expert",
      "Specialist",
      "Leader"
    ]
  },
  professionalSummary: {
    title: "Professional Summary",
    content: "Conducted research and provided actionable recommendations for smart city initiatives Managed financial strategies, oversight, and modeling for a media production company"
  },
  experience: {
    title: "Experience",
    items: [
      {
        title: "Research Analyst",
        company: "GYT ANALYTICS",
        location: "Israel, 2023 — 2024",
        details: "Conducted reviews of government reports, databases, and market analyses for smart city insights. Engaged key stakeholders to gather data and perspectives through interviews."
      },
      {
        title: "Operations and production manager",
        company: "ALT MEDIA",
        location: "Israel, 2022 — 2023",
        details: "Project management - Led a team of editors, overseeing creative direction, logistics and deadlines. Financial management - Managed pricing strategies, financial oversight, collection and financial modeling."
      },
      {
        title: "First Sergeant, Special Forces Combat Driving Unit Tactical driving instructor",
        company: "ISRAEL DEFENSE FORCES",
        location: "Israel, 2017 — 2019",
        details: "Training included 4-months infantry combat basic training and 8-months advanced driving training on several military vehicles, on-road and off-road, night-vision combat driving. Driving instructor, commander of 6-vehicle combat convoy, in multiple one-month intensive driving courses."
      }
    ]
  },
  skills: {
    title: "Skills",
    items: [
      {
        title: "Programming Languages",
        description: "Proficient in Python, Java",
        icon: "DraftingCompass"
      },
      {
        title: "Libraries & Frameworks",
        description: "Proficient in Numpy, Matplotlib, Pandas",
        icon: "SwatchBook"
      },
      {
        title: "Data & Analytics Tools",
        description: "Proficient in Excel, Data analysis, Pivot tables and 4 more",
        icon: "SwatchBook"
      },
      {
        title: "Project & Operations Management",
        description: "Proficient in Project management, Operations management, Logistics and 3 more",
        icon: "Layers"
      }
    ]
  },
  education: {
    title: "Education",
    items: [
      {
        title: "BEN-GURION UNIVERSITY OF THE NEGEV",
        degree: "B.Sc",
        years: "2022 - Present",
        description: "Relevant coursework: Data Structures, Algorithms"
      },
      {
        title: "UNIVERSITY OF INNSBRUCK",
        degree: null,
        years: "2024 - 2025",
        description: "Relevant coursework: neurophysiology, cognitive science"
      },
      {
        title: "ALLIANCE HIGH SCHOOL",
        degree: "Full graduation diploma",
        years: "2010 - 2016",
        description: "Developed expertise in Physics, Mathematics, English and French"
      }
    ]
  },
  courses: {
    title: "Professional Development",
    items: [
      {
        title: "Certified English teacher",
        description: "MYTEFL",
        icon: "Award"
      },
      {
        title: "Certified English teacher",
        description: "MYTEFL",
        icon: "Award"
      },
      {
        title: "120-hour comprehensive TEFL program",
        description: "MYTEFL",
        icon: "Award"
      }
    ]
  },
  speakingEngagements: {
    title: "Speaking Engagements",
    items: [
      {
        event: "Tactical Driving Instruction",
        topic: "Advanced driving training on military vehicles (on-road, off-road, night-vision combat driving)",
        date: "2017",
        link: null
      }
    ]
  },
  languages: {
    title: "Languages",
    items: [
      {
        language: "English",
        proficiency: "Native"
      },
      {
        language: "Hebrew",
        proficiency: "Native"
      },
      {
        language: "Spanish",
        proficiency: "Fluent"
      },
      {
        language: "French",
        proficiency: "Basic"
      }
    ]
  },
  contact: {
    title: "Let's Connect",
    subtitle: null,
    phone: "+972 543517650",
    email: "guy.sagee@gmail.com",
    copyright: "© 2025 GUY SAGEE. All Rights Reserved."
  }
}

type SectionKey = keyof typeof initialData

export default function FashionPortfolioPageFinal() {
  const [data, setData] = useState(initialData)

  const [sectionVisibility, setSectionVisibility] = useState({
    professionalSummary: true,
    experience: true,
    projects: true,
    skills: true,
    education: true,
    courses: true,
    publications: true,
    speakingEngagements: true,
    volunteer: true,
    languages: true,
  })

  const handleSave = (sectionKey: SectionKey, field: string, value: string, index: number | null = null) => {
    setData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData)) // Deep copy
      const section = newData[sectionKey]

      if (index !== null && "items" in section) {
        // @ts-ignore
        section.items[index][field] = value
      } else {
        // @ts-ignore
        section[field] = value
      }
      toast.success("Content saved successfully!")
      return newData
    })
  }

  const toggleSection = (section: keyof typeof sectionVisibility) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const navItems = [
    { name: "Summary", link: "#professionalSummary", key: "professionalSummary" },
    { name: "Experience", link: "#experience", key: "experience" },
    { name: "Projects", link: "#projects", key: "projects" },
    { name: "Skills", link: "#skills", key: "skills" },
    { name: "Education", link: "#education", key: "education" },
    { name: "Contact", link: "#contact", key: "contact" },
  ]

  const sectionAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4 },
  }

  const educationTimelineItems = data.education.items.map((item, i) => ({
    title: (
      <EditableText
        as="h3"
        className="font-serif text-2xl font-bold text-card-foreground"
        initialValue={item.title}
        onSave={(value) => handleSave("education", "title", value, i)}
      />
    ),
    degree: (
      <EditableText
        as="p"
        className="font-sans text-lg font-semibold text-card-foreground/90 mt-1"
        initialValue={item.degree}
        onSave={(value) => handleSave("education", "degree", value, i)}
      />
    ),
    years: (
      <EditableText
        as="p"
        className="font-sans text-base text-muted-foreground my-2"
        initialValue={item.years}
        onSave={(value) => handleSave("education", "years", value, i)}
      />
    ),
    description: (
      <EditableText
        textarea
        as="p"
        className="font-sans text-muted-foreground text-lg mt-2"
        initialValue={item.description}
        onSave={(value) => handleSave("education", "description", value, i)}
      />
    ),
  }))

  return (
    <main className="bg-background text-foreground antialiased">
      <FloatingNav
        navItems={navItems.filter((item) => sectionVisibility[item.key as keyof typeof sectionVisibility] ?? true)}
      >
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-2 rounded-full hover:bg-foreground/10 transition-colors">
              <Settings className="h-5 w-5 text-foreground/80" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-60 bg-popover border-border">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none font-serif">Display Sections</h4>
                <div className="grid gap-2">
                  {Object.keys(sectionVisibility).map((key) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Switch
                        id={key}
                        checked={sectionVisibility[key as keyof typeof sectionVisibility]}
                        onCheckedChange={() => toggleSection(key as keyof typeof sectionVisibility)}
                      />
                      <Label htmlFor={key} className="capitalize font-sans">
                        {formatLabel(key)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <ThemeSwitcher />
            </div>
          </PopoverContent>
        </Popover>
      </FloatingNav>

      {/* Hero Section */}
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden rounded-md pt-24">
        <EditableText
          as="h1"
          initialValue={data.hero.name}
          onSave={(value) => handleSave("hero", "name", value)}
          className="md:text-8xl text-6xl lg:text-[10rem] font-bold text-center text-foreground relative z-20 font-serif text-glow"
        />
        <div className="w-[40rem] h-40 relative">
          <div
            className="absolute inset-x-20 top-0 h-[2px] w-3/4 blur-sm"
            style={{
              backgroundImage: "linear-gradient(to right, transparent, hsl(var(--accent)), transparent)",
            }}
          />
          <div
            className="absolute inset-x-20 top-0 h-px w-3/4"
            style={{
              backgroundImage: "linear-gradient(to right, transparent, hsl(var(--accent)), transparent)",
            }}
          />
          <div
            className="absolute inset-x-60 top-0 h-[5px] w-1/4 blur-sm"
            style={{
              backgroundImage: "linear-gradient(to right, transparent, hsl(var(--accent)), transparent)",
            }}
          />
          <div
            className="absolute inset-x-60 top-0 h-px w-1/4"
            style={{
              backgroundImage: "linear-gradient(to right, transparent, hsl(var(--accent)), transparent)",
            }}
          />
          <Sparkles
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="hsl(var(--accent))"
          />
          <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>
        <div className="text-6xl mx-auto font-normal text-foreground flex items-center gap-3 font-serif">
          <EditableText
            as="span"
            initialValue={data.hero.subTitle}
            onSave={(value) => handleSave("hero", "subTitle", value)}
          />
          <FlipWords words={data.hero.flipWords} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
          className="mt-16"
        >
          <Button
            asChild
            className="px-10 py-8 text-xl font-semibold rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <a href="/michelle-lopez-cv.pdf" download="michelle-lopez-cv.pdf">
              <Download className="mr-3 h-6 w-6" />
              Download CV
            </a>
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {sectionVisibility.professionalSummary && (
          <motion.section id="professionalSummary" {...sectionAnimation} className="py-20 px-4 max-w-5xl mx-auto">
            <EditableText
              as="h2"
              initialValue={data.professionalSummary.title}
              onSave={(value) => handleSave("professionalSummary", "title", value)}
              className="text-6xl font-bold text-center mb-12 font-serif text-glow"
            />
            <p className="text-center text-xl md:text-2xl font-serif font-light text-foreground/90 leading-relaxed min-h-[240px] flex items-center justify-center">
              <TypingAnimation text={data.professionalSummary.content} />
            </p>
            <hr className="mt-20 border-t border-border/50" />
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sectionVisibility.experience && (
          <motion.section id="experience" {...sectionAnimation} className="py-20 px-4 bg-secondary/30">
            <EditableText
              as="h2"
              initialValue={data.experience.title}
              onSave={(value) => handleSave("experience", "title", value)}
              className="text-6xl font-bold text-center mb-12 font-serif text-glow"
            />
            <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {data.experience.items.map((item, i) => (
                  <CarouselItem key={i} className="md:basis-1/2">
                    <div className="p-1 h-full">
                      <BentoGridItem
                        className="h-full"
                        title={
                          <EditableText
                            initialValue={item.title}
                            onSave={(value) => handleSave("experience", "title", value, i)}
                          />
                        }
                        description={
                          <>
                            <EditableText
                              as="p"
                              initialValue={item.company}
                              onSave={(value) => handleSave("experience", "company", value, i)}
                              className="font-semibold text-card-foreground text-lg"
                            />
                            <EditableText
                              as="p"
                              initialValue={item.location}
                              onSave={(value) => handleSave("experience", "location", value, i)}
                              className="text-base text-muted-foreground"
                            />
                            <EditableText
                              textarea
                              as="p"
                              initialValue={item.details}
                              onSave={(value) => handleSave("experience", "details", value, i)}
                              className="mt-2 text-lg"
                            />
                          </>
                        }
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sectionVisibility.projects && (
          <motion.section id="projects" {...sectionAnimation} className="py-20 px-4">
            <EditableText
              as="h2"
              initialValue={data.projects.title}
              onSave={(value) => handleSave("projects", "title", value)}
              className="text-6xl font-bold text-center mb-12 font-serif text-glow"
            />
            <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {data.projects.items.map((item, i) => (
                  <CarouselItem key={i} className="md:basis-1/2">
                    <div className="p-1 h-full">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                        <BentoGridItem
                          className="h-full"
                          icon={iconMap[item.icon as keyof typeof iconMap]}
                          title={
                            <EditableText
                              initialValue={item.title}
                              onSave={(value) => handleSave("projects", "title", value, i)}
                            />
                          }
                          description={
                            <EditableText
                              textarea
                              initialValue={item.description}
                              onSave={(value) => handleSave("projects", "description", value, i)}
                            />
                          }
                        />
                      </a>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sectionVisibility.skills && (
          <motion.section id="skills" {...sectionAnimation} className="py-20 px-4 bg-secondary/30">
            <EditableText
              as="h2"
              initialValue={data.skills.title}
              onSave={(value) => handleSave("skills", "title", value)}
              className="text-6xl font-bold text-center mb-12 font-serif text-glow"
            />
            <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {data.skills.items.map((item, i) => (
                  <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <BentoGridItem
                        className="h-full"
                        icon={iconMap[item.icon as keyof typeof iconMap]}
                        title={
                          <EditableText
                            initialValue={item.title}
                            onSave={(value) => handleSave("skills", "title", value, i)}
                          />
                        }
                        description={
                          <EditableText
                            initialValue={item.description}
                            onSave={(value) => handleSave("skills", "description", value, i)}
                          />
                        }
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sectionVisibility.education && (
          <motion.section id="education" {...sectionAnimation} className="py-20">
            <EditableText
              as="h2"
              initialValue={data.education.title}
              onSave={(value) => handleSave("education", "title", value)}
              className="text-6xl font-bold text-center mb-20 font-serif text-glow"
            />
            <VerticalTimeline items={educationTimelineItems} />
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sectionVisibility.courses && (
          <motion.section id="courses" {...sectionAnimation} className="py-20 px-4 bg-secondary/30">
            <EditableText
              as="h2"
              initialValue={data.courses.title}
              onSave={(value) => handleSave("courses", "title", value)}
              className="text-6xl font-bold text-center mb-12 font-serif text-glow"
            />
            <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {data.courses.items.map((item, i) => (
                  <CarouselItem key={i} className="md:basis-1/2">
                    <div className="p-1 h-full">
                      <BentoGridItem
                        className="h-full"
                        icon={iconMap[item.icon as keyof typeof iconMap]}
                        title={
                          <EditableText
                            initialValue={item.title}
                            onSave={(value) => handleSave("courses", "title", value, i)}
                          />
                        }
                        description={
                          <EditableText
                            initialValue={item.description}
                            onSave={(value) => handleSave("courses", "description", value, i)}
                          />
                        }
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sectionVisibility.publications && (
          <motion.section id="publications" {...sectionAnimation} className="py-20 px-4">
            <EditableText
              as="h2"
              initialValue={data.publications.title}
              onSave={(value) => handleSave("publications", "title", value)}
              className="text-6xl font-bold text-center mb-12 font-serif text-glow"
            />
            <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {data.publications.items.map((item, i) => (
                  <CarouselItem key={i} className="md:basis-1/2">
                    <div className="p-1 h-full">
                      <BackgroundGradient
                        containerClassName="rounded-xl h-full transition-transform duration-200 hover:-translate-y-1"
                        className="bg-card rounded-xl h-full"
                      >
                        <a
                          href={item.link}
                          key={i}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-6 h-full"
                        >
                          <div className="flex justify-between items-center h-full">
                            <div>
                              <EditableText
                                as="h3"
                                initialValue={item.title}
                                onSave={(value) => handleSave("publications", "title", value, i)}
                                className="font-serif text-3xl font-bold text-card-foreground"
                              />
                              <p className="text-lg text-muted-foreground">
                                <EditableText
                                  as="span"
                                  initialValue={item.outlet}
                                  onSave={(value) => handleSave("publications", "outlet", value, i)}
                                />
                                {" - "}
                                <EditableText
                                  as="span"
                                  initialValue={item.date}
                                  onSave={(value) => handleSave("publications", "date", value, i)}
                                />
                              </p>
                            </div>
                            <LinkIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </a>
                      </BackgroundGradient>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sectionVisibility.speakingEngagements && (
          <motion.section id="speakingEngagements" {...sectionAnimation} className="py-20 px-4 bg-secondary/30">
            <EditableText
              as="h2"
              initialValue={data.speakingEngagements.title}
              onSave={(value) => handleSave("speakingEngagements", "title", value)}
              className="text-6xl font-bold text-center mb-12 font-serif text-glow"
            />
            <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {data.speakingEngagements.items.map((item, i) => (
                  <CarouselItem key={i} className="md:basis-1/2">
                    <div className="p-1 h-full">
                      <BackgroundGradient
                        containerClassName="rounded-xl h-full transition-transform duration-200 hover:-translate-y-1"
                        className="bg-card rounded-xl h-full"
                      >
                        <a
                          href={item.link}
                          key={i}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-6 h-full"
                        >
                          <div className="flex justify-between items-center h-full">
                            <div>
                              <EditableText
                                as="h3"
                                initialValue={item.event}
                                onSave={(value) => handleSave("speakingEngagements", "event", value, i)}
                                className="font-serif text-3xl font-bold text-card-foreground"
                              />
                              <p className="text-lg text-muted-foreground">
                                <EditableText
                                  as="span"
                                  initialValue={item.topic}
                                  onSave={(value) => handleSave("speakingEngagements", "topic", value, i)}
                                />
                                {" - "}
                                <EditableText
                                  as="span"
                                  initialValue={item.date}
                                  onSave={(value) => handleSave("speakingEngagements", "date", value, i)}
                                />
                              </p>
                            </div>
                            <LinkIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </a>
                      </BackgroundGradient>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sectionVisibility.volunteer && (
          <motion.section id="volunteer" {...sectionAnimation} className="py-20 px-4">
            <EditableText
              as="h2"
              initialValue={data.volunteer.title}
              onSave={(value) => handleSave("volunteer", "title", value)}
              className="text-6xl font-bold text-center mb-12 font-serif text-glow"
            />
            <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {data.volunteer.items.map((item, i) => (
                  <CarouselItem key={i} className="md:basis-1/2">
                    <div className="p-1 h-full">
                      <BackgroundGradient
                        containerClassName="rounded-xl h-full transition-transform duration-200 hover:-translate-y-1"
                        className="bg-card rounded-xl h-full"
                      >
                        <div className="p-8 h-full">
                          <EditableText
                            as="h3"
                            initialValue={item.organization}
                            onSave={(value) => handleSave("volunteer", "organization", value, i)}
                            className="font-serif text-3xl font-bold text-card-foreground"
                          />
                          <EditableText
                            as="p"
                            initialValue={item.role}
                            onSave={(value) => handleSave("volunteer", "role", value, i)}
                            className="font-sans text-xl text-card-foreground/80 font-semibold my-2"
                          />
                          <EditableText
                            textarea
                            as="p"
                            initialValue={item.description}
                            onSave={(value) => handleSave("volunteer", "description", value, i)}
                            className="font-sans text-lg text-muted-foreground"
                          />
                        </div>
                      </BackgroundGradient>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sectionVisibility.languages && (
          <motion.section id="languages" {...sectionAnimation} className="py-20 px-4 bg-secondary/30">
            <EditableText
              as="h2"
              initialValue={data.languages.title}
              onSave={(value) => handleSave("languages", "title", value)}
              className="text-6xl font-bold text-center mb-12 font-serif text-glow"
            />
            <div className="max-w-4xl mx-auto flex justify-center gap-4 flex-wrap">
              {data.languages.items.map((item, i) => (
                <div
                  key={i}
                  className="bg-card px-4 py-2 rounded-full border border-border text-center shadow-sm text-lg"
                >
                  <EditableText
                    as="span"
                    initialValue={item.language}
                    onSave={(value) => handleSave("languages", "language", value, i)}
                    className="font-serif font-semibold text-card-foreground"
                  />
                  {": "}
                  <EditableText
                    as="span"
                    initialValue={item.proficiency}
                    onSave={(value) => handleSave("languages", "proficiency", value, i)}
                    className="font-sans text-muted-foreground"
                  />
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Contact & Footer */}
      <footer id="contact" className="relative">
        <AuroraBackground>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center text-center py-24 px-4"
          >
            <EditableText
              as="h2"
              initialValue={data.contact.title}
              onSave={(value) => handleSave("contact", "title", value)}
              className="text-5xl md:text-7xl font-bold font-serif mb-4"
            />
            <EditableText
              as="p"
              initialValue={data.contact.subtitle}
              onSave={(value) => handleSave("contact", "subtitle", value)}
              className="text-xl font-sans font-light mb-8 text-muted-foreground max-w-2xl"
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-xl mb-12">
              <a
                href={`tel:${data.contact.phone}`}
                className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
              >
                <Phone className="h-5 w-5" />
                <EditableText
                  as="span"
                  initialValue={data.contact.phone}
                  onSave={(value) => handleSave("contact", "phone", value)}
                />
              </a>
              <a
                href={`mailto:${data.contact.email}`}
                className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
              >
                <Mail className="h-5 w-5" />
                <EditableText
                  as="span"
                  initialValue={data.contact.email}
                  onSave={(value) => handleSave("contact", "email", value)}
                />
              </a>
            </div>
            <div className="flex justify-center gap-4">
              <a
                href="#"
                className="p-3 bg-card/50 rounded-full text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-110 backdrop-blur-sm border border-border/20"
                aria-label="LinkedIn"
              >
                <Linkedin size={28} />
              </a>
              <a
                href="#"
                className="p-3 bg-card/50 rounded-full text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-110 backdrop-blur-sm border border-border/20"
                aria-label="Resume"
              >
                <FileText size={28} />
              </a>
              <a
                href="#"
                className="p-3 bg-card/50 rounded-full text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-110 backdrop-blur-sm border border-border/20"
                aria-label="Pinterest"
              >
                <Pinterest size={28} />
              </a>
            </div>
          </motion.div>
        </AuroraBackground>
        <div className="bg-background/80 backdrop-blur-sm py-4">
          <EditableText
            as="p"
            initialValue={data.contact.copyright}
            onSave={(value) => handleSave("contact", "copyright", value)}
            className="text-sm text-muted-foreground text-center"
          />
        </div>
      </footer>
    </main>
  )
}
