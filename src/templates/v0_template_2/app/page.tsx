"use client"

import { WavyBackground } from "@/components/ui/wavy-background"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { Download, CheckCircle, Settings, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useFontSize } from "@/contexts/font-size-context"
import { FontSizeSelector } from "@/components/ui/font-size-selector"
import { cn } from "@/lib/utils"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { mapCvDataToSections } from "@/lib/data-mapper"
import { FloatingNav } from "@/components/ui/floating-nav"
import { useTheme } from "@/contexts/theme-context"
import { ThemeSelector } from "@/components/ui/theme-selector"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { MovingBorder } from "@/components/ui/moving-border"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableItem } from "@/components/ui/sortable-item"

// Import section components
import { ParagraphSection } from "@/components/sections/paragraph-section"
import { SkillsSection } from "@/components/sections/skills-section"
import { TimelineSection } from "@/components/sections/timeline-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { PublicationsSection } from "@/components/sections/publications-section"
import { AccomplishmentsSection } from "@/components/sections/accomplishments-section"
import { ContactSection } from "@/components/sections/contact-section"
import { CertificationsSection } from "@/components/sections/certifications-section"
import { HobbiesSection } from "@/components/sections/hobbies-section"
import { LanguagesSection } from "@/components/sections/languages-section"
// Import new section components
import { CoursesSection } from "@/components/sections/courses-section"
import { MembershipsSection } from "@/components/sections/memberships-section"
import { PatentsSection } from "@/components/sections/patents-section"

const sectionComponentMap = {
  paragraph: ParagraphSection,
  bento: SkillsSection,
  timeline: TimelineSection,
  projects: ProjectsSection,
  publications: PublicationsSection,
  accomplishments: AccomplishmentsSection,
  contact: ContactSection,
  certifications: CertificationsSection,
  hobbies: HobbiesSection,
  languages: LanguagesSection,
  // Add new components to the map
  courses: CoursesSection,
  memberships: MembershipsSection,
  patents: PatentsSection,
}

const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.5,
    },
  },
}

const heroItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
}

export default function PortfolioPage() {
  const { getSizeClasses } = useFontSize()
  const { wavyColors } = useTheme()
  const [portfolioData, setPortfolioData] = useState(null)
  const [sectionsOrder, setSectionsOrder] = useState([])
  const [sectionVisibility, setSectionVisibility] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const navItems =
    sectionsOrder
      .map((sectionId) => portfolioData?.sections.find((s) => s.id === sectionId))
      .filter((section) => section && sectionVisibility[section.id])
      .map((section) => ({
        name: section.title,
        link: `#${section.id}`,
      })) || []

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/resume")
        const data = await response.json()
        const mappedData = mapCvDataToSections(data)
        setPortfolioData(mappedData)

        const initialVisibility = mappedData.sections.reduce((acc, section) => {
          acc[section.id] = true
          return acc
        }, {})
        setSectionVisibility(initialVisibility)
        setSectionsOrder(mappedData.sections.map((s) => s.id))
      } catch (error) {
        console.error("Failed to fetch portfolio data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (isLoading || !portfolioData?.sections) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2
      let currentSection = ""

      for (const sectionId of sectionsOrder) {
        if (sectionVisibility[sectionId]) {
          const element = document.getElementById(sectionId)
          if (element && element.offsetTop <= scrollPosition) {
            currentSection = sectionId
          }
        }
      }
      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Set initial active section

    return () => window.removeEventListener("scroll", handleScroll)
  }, [isLoading, portfolioData, sectionVisibility, sectionsOrder])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setSectionsOrder((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const toggleSection = (sectionId: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const sectionWrapperAnimation = {
    initial: { opacity: 0, height: 0, y: 20 },
    animate: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.4, ease: "easeInOut" } },
    exit: { opacity: 0, height: 0, y: -20, transition: { duration: 0.3, ease: "easeInOut" } },
    className: "overflow-hidden",
  }

  const renderSection = (section) => {
    const Component = sectionComponentMap[section.type]
    if (!Component) {
      console.warn(`No component found for section type: ${section.type}`)
      return null
    }
    const props = { id: section.id, title: section.title, items: section.data, ...section.data }
    return <Component {...props} />
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-12 w-12 text-white animate-spin" />
      </div>
    )
  }

  return (
    <main className="bg-black/[0.96] antialiased">
      <FloatingNav navItems={navItems} activeSection={activeSection} />
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <FontSizeSelector />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-black/50 border-neutral-700 text-white backdrop-blur-sm hover:bg-neutral-800"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Page Settings</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 bg-black border-neutral-700 text-white">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Theme</h4>
                <p className="text-sm text-muted-foreground">Select an accent color.</p>
              </div>
              <ThemeSelector />
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Display & Order Sections</h4>
                <p className="text-sm text-muted-foreground">Toggle visibility and drag to reorder.</p>
              </div>
              <div className="grid gap-1 max-h-60 overflow-y-auto">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={sectionsOrder} strategy={verticalListSortingStrategy}>
                    {sectionsOrder.map((sectionId) => {
                      const section = portfolioData?.sections.find((s) => s.id === sectionId)
                      if (!section) return null
                      return (
                        <SortableItem
                          key={section.id}
                          id={section.id}
                          title={section.title}
                          checked={sectionVisibility[section.id] || false}
                          onCheckedChange={() => toggleSection(section.id)}
                        />
                      )
                    })}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <WavyBackground
        colors={wavyColors}
        containerClassName="h-screen"
        className="h-full flex flex-col justify-start items-center"
      >
        <motion.div className="text-center pt-40" variants={heroContainerVariants} initial="hidden" animate="visible">
          <TextGenerateEffect
            words={portfolioData?.hero.name || ""}
            className={cn("text-white my-0 py-0 font-extrabold tracking-tighter", getSizeClasses("heroName"))}
          />
          <TextGenerateEffect
            words={portfolioData?.hero.title || ""}
            className={cn(
              "bg-gradient-to-b from-neutral-200 to-neutral-600 bg-clip-text text-transparent font-normal my-0 mt-0 mb-0 uppercase tracking-[0.2em]",
              getSizeClasses("heroTitle"),
            )}
          />
          {portfolioData?.hero.profilePhotoUrl && (
            <motion.div variants={heroItemVariants} className="mt-8">
              <img
                src={portfolioData.hero.profilePhotoUrl || "/placeholder.svg"}
                alt={`Profile picture of ${portfolioData.hero.name}`}
                width={160}
                height={160}
                className="rounded-full mx-auto w-40 h-40 object-cover border-4 border-neutral-800 shadow-lg"
              />
            </motion.div>
          )}
        </motion.div>
        <div className="absolute bottom-20">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/Emma-Wilson-CV.pdf" download="Emma Wilson - CV.pdf">
              <MovingBorder
                borderRadius="1.75rem"
                className="bg-transparent border-neutral-500 text-neutral-300 border"
              >
                <Button
                  variant="outline"
                  className={cn(
                    "backdrop-blur-sm text-neutral-300 hover:text-white bg-transparent font-semibold font-sans tracking-normal",
                    getSizeClasses("button"),
                  )}
                >
                  <Download className="mr-2 w-4 h-4 px-0 pr-0" />
                  Download Full CV
                </Button>
              </MovingBorder>
            </a>
            {portfolioData?.hero.availability && (
              <MovingBorder borderRadius="1.75rem" className="bg-transparent border-green-500/30 text-green-300 border">
                <Button
                  variant="primary"
                  className={cn(
                    "bg-green-500/20 text-green-300 hover:bg-green-500/30 backdrop-blur-sm font-semibold tracking-wide",
                    getSizeClasses("button"),
                  )}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {portfolioData.hero.availability}
                </Button>
              </MovingBorder>
            )}
          </div>
        </div>
      </WavyBackground>
      <TracingBeam className="px-10">
        <div className="max-w-5xl antialiased pt-4 relative space-y-28">
          <AnimatePresence>
            {sectionsOrder.map((sectionId) => {
              const section = portfolioData?.sections.find((s) => s.id === sectionId)
              if (!section || !sectionVisibility[section.id]) return null
              return (
                <motion.div key={section.id} {...sectionWrapperAnimation}>
                  {renderSection(section)}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </TracingBeam>
    </main>
  )
}
