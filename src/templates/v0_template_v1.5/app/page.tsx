"use client"

import React, { useMemo, useState, useEffect } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { toast } from "sonner"

import { initialData, contentIconMap, type PortfolioData } from "@/lib/data"
import { fetchLatestCVData, adaptCV2WebToTemplate } from "@/lib/cv-data-adapter"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme/theme-provider"
import { useEditMode } from "@/contexts/edit-mode-context"

/* ── UI primitives ──────────────────────────────────────────────── */
import { VerticalTimeline } from "@/components/ui/vertical-timeline"
import { BentoGridItem } from "@/components/ui/bento-grid-item"
import { EditableText } from "@/components/ui/editable-text"
import { EditableTruncatedText } from "@/components/ui/editable-truncated-text"
import { FloatingNav } from "@/components/ui/floating-nav"
import { GlowingButton } from "@/components/ui/glowing-button"
import { FlipText } from "@/components/ui/flip-text"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

/* ── Custom components & layouts ────────────────────────────────── */
import { Section } from "@/components/section"
import { DraggableSection } from "@/components/draggable-section-simple"
import { DraggableList } from "@/components/draggable-list"
import { CardCarousel } from "@/components/card-carousel"
import { HeroSection } from "@/components/hero-section"
import { SkillsSection } from "@/components/skills-section"
import { ContactSection } from "@/components/contact-section"
import { AccordionLayout } from "@/components/layouts/accordion-layout"
import { ListLayout } from "@/components/layouts/list-layout"
import { HobbyCard } from "@/components/hobby-card"
import { MembershipCard } from "@/components/membership-card"
import { TestimonialCard } from "@/components/testimonial-card"
import { SmartCard } from "@/components/smart-card"
import { EditModeToggle } from "@/components/edit-mode-toggle"
import { EditableSection } from "@/components/editable-section"
import { WatermarkToggle } from "@/components/watermark-toggle"
import { useWatermark } from "@/contexts/watermark-context"
import { ThemeToggle } from "@/components/theme-toggle"

/* ── Helpers ────────────────────────────────────────────────────── */
const formatLabel = (key: string) => {
  const result = key.replace(/([A-Z])/g, " $1")
  return result.charAt(0).toUpperCase() + result.slice(1)
}

type SectionKey = keyof Omit<PortfolioData, "hero" | "contact">

const initialSectionKeys: SectionKey[] = [
  "summary",
  "experience",
  "projects",
  "skills",
  "education",
  "testimonials",
  "achievements",
  "certifications",
  "volunteer",
  "hobbies",
  "courses",
  "publications",
  "speakingEngagements",
  "memberships",
  "languages",
]

const hasContent = (data: any): boolean => {
  if (!data || typeof data !== "object") return false

  // Special handling for skills section
  if (data.skillCategories || data.ungroupedSkills) {
    return (
      (Array.isArray(data.skillCategories) && data.skillCategories.length > 0) ||
      (Array.isArray(data.ungroupedSkills) && data.ungroupedSkills.length > 0)
    )
  }

  const itemKeys = Object.keys(data).filter((k) => k.endsWith("Items") || k.endsWith("skills"))
  if (itemKeys.length) return itemKeys.some((k) => Array.isArray(data[k]) && data[k].length)

  return Boolean(data.summaryText)
}

const cardBgClasses = ["bg-card", "bg-secondary/50", "bg-muted/50"]

/* ── Page component ─────────────────────────────────────────────── */
export default function FashionPortfolioPage() {
  /* State */ /* --------------------------------------------------- */
  const [data, setData] = useState<PortfolioData>(initialData)
  const [showPhoto, setShowPhoto] = useState(true)
  const [orderedSections, setOrderedSections] = useState<SectionKey[]>(initialSectionKeys)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { theme, setTheme, themes } = useTheme()
  const { isEditMode } = useEditMode()
  const { isWatermarkVisible, toggleWatermark } = useWatermark()
  
  /* DnD sensors */
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  /* Load CV Data */ /* ------------------------------------------- */
  useEffect(() => {
    const loadCVData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Check if we're in standalone mode (port 9999)
        const isStandalone = window.location.port === '9999'
        
        if (isStandalone) {
          console.log('🎨 Running in standalone mode with demo data')
          toast.success('Welcome to your portfolio preview!')
          // Use the demo data from initialData
          // No need to do anything else - initialData is already set
        } else {
          // For generated portfolios, always fetch CV data (which will use injected data)
          console.log('🔄 Loading CV data...')
          const sessionId = getSessionId() || 'generated-portfolio'
          const cvData = await fetchLatestCVData(sessionId)
          setData(cvData)
          console.log('✅ CV data loaded successfully')
          toast.success('Portfolio loaded successfully!')
        }
      } catch (err) {
        // This is expected when running standalone without backend
        console.log('ℹ️ Error loading CV data, using demo content')
        // Keep using initialData as fallback
      } finally {
        setIsLoading(false)
      }
    }

    loadCVData()
  }, [])

  /* Listen for Theme Changes and Content Updates from Parent */ /* ------------------- */
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from parent window
      if (event.source !== window.parent) return
      
      if (event.data?.type === 'CHANGE_THEME') {
        const themeId = event.data.themeId
        
        // Map theme IDs to theme indices
        const themeMap: Record<string, number> = {
          'cream-gold': 0,
          'midnight-blush': 1,
          'evergreen': 2,
          'interstellar': 3,
          'serene-sky': 4,
          'crimson-night': 5
        }
        
        const themeIndex = themeMap[themeId]
        if (themeIndex !== undefined && themes[themeIndex]) {
          // Change theme using the theme provider
          setTheme(themes[themeIndex].name)
          console.log('🎨 Theme changed to:', themes[themeIndex].name)
        }
      } else if (event.data?.type === 'TOGGLE_PHOTO') {
        setShowPhoto(event.data.show)
        console.log('📸 Profile photo visibility:', event.data.show)
      } else if (event.data?.type === 'TOGGLE_SECTION') {
        const { section, visible } = event.data
        setSectionVisibility(prev => ({ ...prev, [section]: visible }))
        console.log('👁️ Section visibility updated:', section, visible)
      } else if (event.data?.type === 'ADD_ITEM') {
        const { section, item } = event.data
        
        // Add new item to the appropriate section
        setData(prev => {
          const newData = { ...prev }
          
          switch(section) {
            case 'projects':
              newData.projects.projectItems = [...newData.projects.projectItems, item]
              break
            case 'hobbies':
              newData.hobbies.hobbyItems = [...newData.hobbies.hobbyItems, item]
              break
            case 'courses':
              newData.courses.courseItems = [...newData.courses.courseItems, item]
              break
            case 'certifications':
              newData.certifications.certificationItems = [...newData.certifications.certificationItems, item]
              break
            case 'volunteer':
              newData.volunteer.volunteerItems = [...newData.volunteer.volunteerItems, item]
              break
            case 'achievements':
              newData.achievements.achievementItems = [...newData.achievements.achievementItems, item]
              break
            case 'publications':
              newData.publications.publicationItems = [...newData.publications.publicationItems, item]
              break
            case 'speaking':
              newData.speakingEngagements.engagementItems = [...newData.speakingEngagements.engagementItems, item]
              break
            case 'memberships':
              newData.memberships.membershipItems = [...newData.memberships.membershipItems, item]
              break
          }
          
          return newData
        })
        
        console.log('➕ Added new item to section:', section)
      } else if (event.data?.type === 'UPDATE_CONTENT') {
        const { sectionId, content } = event.data
        
        // Map section IDs to data paths
        const sectionMapping: Record<string, (content: string) => void> = {
          'fullName': (content: string) => {
            setData(prev => ({
              ...prev,
              hero: {
                ...prev.hero,
                fullName: content
              }
            }))
          },
          'professionalTitle': (content: string) => {
            setData(prev => ({
              ...prev,
              hero: {
                ...prev.hero,
                professionalTitle: content
              }
            }))
          },
          'summary': (content: string) => {
            setData(prev => ({
              ...prev,
              summary: {
                ...prev.summary,
                summaryText: content
              }
            }))
          },
          'experience': (content: string) => {
            // Parse experience text back into structured data
            const experiences = content.split('\n\n').map(exp => {
              const lines = exp.split('\n')
              const [jobInfo, dateInfo] = lines
              const [jobTitle, companyName] = (jobInfo || '').split(' at ')
              const [startDate, endDate] = (dateInfo || '').split(' - ')
              
              return {
                jobTitle: jobTitle?.trim() || '',
                companyName: companyName?.trim() || '',
                dateRange: {
                  startDate: startDate?.trim() || '',
                  endDate: endDate?.trim() || '',
                  isCurrent: endDate?.trim().toLowerCase() === 'present'
                },
                responsibilitiesAndAchievements: []
              }
            })
            
            setData(prev => ({
              ...prev,
              experience: {
                ...prev.experience,
                experienceItems: experiences
              }
            }))
          },
          'skills': (content: string) => {
            // Parse skills back into categories
            const lines = content.split('\n')
            const categories = lines.map(line => {
              const [categoryName, skills] = line.split(':')
              return {
                categoryName: categoryName?.trim() || '',
                skills: skills?.split(',').map(s => s.trim()).filter(Boolean) || []
              }
            }).filter(cat => cat.categoryName)
            
            setData(prev => ({
              ...prev,
              skills: {
                ...prev.skills,
                skillCategories: categories
              }
            }))
          },
          'education': (content: string) => {
            // Parse education text back into structured data
            const educations = content.split('\n\n').map(edu => {
              const lines = edu.split('\n')
              const [degreeInfo, institution] = lines
              const [degree, fieldOfStudy] = (degreeInfo || '').split(' in ')
              
              return {
                degree: degree?.trim() || '',
                fieldOfStudy: fieldOfStudy?.trim() || '',
                institution: institution?.trim() || '',
                dateRange: { startDate: '', endDate: '' }
              }
            })
            
            setData(prev => ({
              ...prev,
              education: {
                ...prev.education,
                educationItems: educations
              }
            }))
          },
          'contact': (content: string) => {
            const lines = content.split('\n')
            setData(prev => ({
              ...prev,
              contact: {
                ...prev.contact,
                email: lines[0] || '',
                phone: lines[1] || ''
              }
            }))
          },
          'email': (content: string) => {
            setData(prev => ({
              ...prev,
              contact: {
                ...prev.contact,
                email: content
              }
            }))
          },
          'phone': (content: string) => {
            setData(prev => ({
              ...prev,
              contact: {
                ...prev.contact,
                phone: content
              }
            }))
          },
          'summaryTagline': (content: string) => {
            setData(prev => ({
              ...prev,
              hero: {
                ...prev.hero,
                summaryTagline: content
              }
            }))
          }
        }
        
        if (sectionMapping[sectionId]) {
          sectionMapping[sectionId](content)
          console.log('📝 Content updated for section:', sectionId)
        }
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  /* Helper function to get session ID */ /* -------------------- */
  const getSessionId = (): string | null => {
    // Try URL params first (for direct links)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const sessionFromUrl = urlParams.get('session')
      if (sessionFromUrl) return sessionFromUrl
      
      // Try localStorage (from CV editor)
      const sessionFromStorage = localStorage.getItem('sessionId')
      if (sessionFromStorage) return sessionFromStorage
      
      // Development fallback
      if (process.env.NODE_ENV === 'development') {
        return 'dev-session'
      }
    }
    
    return null
  }

  const [sectionVisibility, setSectionVisibility] = useState<Record<SectionKey, boolean>>(() => {
    const visibility: Partial<Record<SectionKey, boolean>> = {}
    for (const key of initialSectionKeys) visibility[key] = hasContent(data[key])
    return visibility as Record<SectionKey, boolean>
  })

  /* Update section visibility when data changes */ /* ----------- */
  // Removed automatic visibility update based on content to respect manual settings from website editor

  const getGradientForIndex = (index: number) => {
    const gradients = [
      { from: theme.colors["gradient-1"], to: theme.colors["gradient-2"] },
      { from: theme.colors["gradient-2"], to: theme.colors["gradient-3"] },
      { from: theme.colors["gradient-3"], to: theme.colors["gradient-4"] },
      { from: theme.colors["gradient-4"], to: theme.colors["gradient-1"] },
      { from: theme.colors["gradient-1"], to: theme.colors["gradient-3"] },
    ]
    return gradients[index % gradients.length]
  }

  /* D-n-D ordering */ /* ----------------------------------------- */
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setOrderedSections((items) => {
        const oldIdx = items.indexOf(active.id as SectionKey)
        const newIdx = items.indexOf(over.id as SectionKey)
        return arrayMove(items, oldIdx, newIdx)
      })
      toast.success("Section order updated!")
    }
  }

  /* Generic save helper */ /* ------------------------------------- */
  const handleSave = (path: string, value: any, showToast: boolean = true) => {
    setData((prev) => {
      const keys = path.split(".")
      const next = structuredClone(prev) as any
      let cur = next
      for (let i = 0; i < keys.length - 1; i++) {
        if (cur[keys[i]] === undefined) cur[keys[i]] = {}
        cur = cur[keys[i]]
      }
      cur[keys.at(-1)!] = value
      if (showToast) {
        toast.success("Content saved!")
      }
      return next
    })
  }

  const toggleSection = (s: SectionKey) => setSectionVisibility((p) => ({ ...p, [s]: !p[s] }))

  /* Helper function for moving sections */
  const moveSection = (section: SectionKey, direction: 'up' | 'down') => {
    setOrderedSections((current) => {
      const index = current.indexOf(section)
      if (index === -1) return current
      
      const newIndex = direction === 'up' ? index - 1 : index + 1
      
      // Check bounds
      if (newIndex < 0 || newIndex >= current.length) return current
      
      const newOrder = [...current]
      // Swap positions
      ;[newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]]
      
      toast.success(`Moved ${formatLabel((data as any)[section]?.sectionTitle ?? section)} ${direction}`)
      return newOrder
    })
  }

  /* Helper functions for adding/removing items */
  const addItem = (section: string, newItem: any) => {
    setData(prev => {
      const sectionData = (prev as any)[section]
      const itemsKey = Object.keys(sectionData).find(k => k.endsWith('Items'))
      if (itemsKey) {
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [itemsKey]: [...sectionData[itemsKey], newItem]
          }
        }
      }
      return prev
    })
    toast.success("Item added!")
  }

  const removeItem = (section: string, index: number) => {
    setData(prev => {
      const sectionData = (prev as any)[section]
      const itemsKey = Object.keys(sectionData).find(k => k.endsWith('Items'))
      if (itemsKey) {
        const newItems = [...sectionData[itemsKey]]
        newItems.splice(index, 1)
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [itemsKey]: newItems
          }
        }
      }
      return prev
    })
    toast.success("Item removed!")
  }

  /* Navigation items */ /* --------------------------------------- */
  const navItems = useMemo(
    () =>
      [
        ...orderedSections.map((k) => ({
          name: formatLabel((data as any)[k]?.sectionTitle ?? k),
          link: `#${k}`,
          key: k,
        })),
        { name: "Contact", link: "#contact" },
      ].filter((i) => !i.key || sectionVisibility[i.key as SectionKey]),
    [orderedSections, sectionVisibility, data],
  )

  /* Education timeline pre-map */ /* ------------------------------ */
  const educationTimelineItems =
    data.education?.educationItems.map((item, i) => ({
      title: (
        <EditableText
          as="h3"
          className="font-serif text-lg sm:text-2xl font-bold text-card-foreground"
          initialValue={item.institution}
          onSave={(v) => handleSave(`education.educationItems.${i}.institution`, v)}
        />
      ),
      degree: (
        <EditableText
          as="p"
          className="font-sans text-base sm:text-lg font-semibold text-card-foreground/90 mt-1"
          initialValue={item.degree}
          onSave={(v) => handleSave(`education.educationItems.${i}.degree`, v)}
        />
      ),
      years: (
        <EditableText
          as="p"
          className="font-sans text-base text-muted-foreground my-2"
          initialValue={item.years}
          onSave={(v) => handleSave(`education.educationItems.${i}.years`, v)}
        />
      ),
      description: (
        <EditableText
          textarea
          as="p"
          className="font-sans text-muted-foreground text-sm sm:text-base mt-2"
          initialValue={item.description}
          onSave={(v) => handleSave(`education.educationItems.${i}.description`, v)}
        />
      ),
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
      imageTransform: item.imageTransform,
    })) ?? []

  /* Get visible sections for determining first/last */
  const visibleSectionKeys = useMemo(() => 
    orderedSections.filter(key => sectionVisibility[key] && hasContent(data[key])),
    [orderedSections, sectionVisibility, data]
  )

  /* Section components map */ /* --------------------------------- */
  const sectionComponents: Record<SectionKey, React.ReactNode> = {
    /* 1. Summary --------------------------------------------------- */
    summary:
      sectionVisibility.summary && data.summary.summaryText ? (
        <EditableSection
          sectionTitle="Summary"
          onMoveUp={() => moveSection('summary', 'up')}
          onMoveDown={() => moveSection('summary', 'down')}
          showMoveButtons={true}
          showAddButton={false}
          isFirst={visibleSectionKeys[0] === 'summary'}
          isLast={visibleSectionKeys[visibleSectionKeys.length - 1] === 'summary'}
        >
          <Section
            id="summary"
            title={data.summary.sectionTitle}
            onSaveTitle={(v) => handleSave("summary.sectionTitle", v)}
            isVisible
            fullWidth={true}
          >
            <div className="min-h-[150px] flex items-center justify-center max-w-5xl mx-auto px-6 lg:px-8">
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                <FlipText
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-light text-foreground/90 leading-relaxed hyphens-auto text-balance"
                  duration={0.3}
                  delayMultiple={0.03}
                  style={{
                    textWrap: 'balance',
                    hyphens: 'auto',
                    wordBreak: 'normal',
                    lineHeight: '1.7'
                  }}
                >
                  {data.summary.summaryText ?? ""}
                </FlipText>
              </div>
            </div>
          </Section>
        </EditableSection>
      ) : null,

    /* 2. Experience (Accordion) ------------------------------------ */
    experience:
      sectionVisibility.experience && data.experience.experienceItems.length ? (
        <EditableSection
          onAddItem={() => addItem('experience', {
            company: 'New Company',
            position: 'New Position',
            location: 'Location',
            duration: '2024 - Present',
            responsibilities: []
          })}
          sectionTitle="Experience"
          onMoveUp={() => moveSection('experience', 'up')}
          onMoveDown={() => moveSection('experience', 'down')}
          showMoveButtons={true}
          isFirst={visibleSectionKeys[0] === 'experience'}
          isLast={visibleSectionKeys[visibleSectionKeys.length - 1] === 'experience'}
        >
          <Section
            id="experience"
            title={data.experience.sectionTitle}
            onSaveTitle={(v) => handleSave("experience.sectionTitle", v)}
            isVisible
            className="bg-secondary/30"
          >
            <AccordionLayout
              items={data.experience.experienceItems}
              onSave={(i, field, v) => handleSave(`experience.experienceItems.${i}.${field}`, v)}
              onReorder={(newItems) => handleSave("experience.experienceItems", newItems, false)}
            />
          </Section>
        </EditableSection>
      ) : null,

    /* 3. Projects (carousel) --------------------------------------- */
    projects:
      sectionVisibility.projects ? (
        <EditableSection
          onAddItem={() => addItem('projects', {
            title: 'New Project',
            description: 'Project description',
            icon: 'IconBrandGithub',
            link: '#',
            viewMode: 'text',
            textVariant: 'detailed',
            images: []
          })}
          sectionTitle="Projects"
          onMoveUp={() => moveSection('projects', 'up')}
          onMoveDown={() => moveSection('projects', 'down')}
          showMoveButtons={true}
          isFirst={visibleSectionKeys[0] === 'projects'}
          isLast={visibleSectionKeys[visibleSectionKeys.length - 1] === 'projects'}
        >
          <Section
            id="projects"
            title={data.projects.sectionTitle}
            onSaveTitle={(v) => handleSave("projects.sectionTitle", v)}
            isVisible
            fullWidth
          >
          {data.projects.projectItems.length > 0 ? (
            <CardCarousel
              items={data.projects.projectItems}
              itemClassName="basis-full md:basis-1/2 lg:basis-1/3"
              renderItem={(item, i) => {
                const selectedGradient = getGradientForIndex(i)
                return (
                <SmartCard
                  item={item}
                  onUpdate={(field, value) => handleSave(`projects.projectItems.${i}.${field}`, value)}
                  onDelete={() => removeItem('projects', i)}
                  className={cn(
                    "h-full w-full shadow-lg overflow-hidden", 
                    item.viewMode === 'images' ? "aspect-[4/3]" : "aspect-[5/3]",
                    cardBgClasses[i % cardBgClasses.length]
                  )}
                >
                  {/* Render based on text variant */}
                  {item.textVariant === 'simple' ? (
                    <HobbyCard
                      title={item.title}
                      onSave={(v) => handleSave(`projects.projectItems.${i}.title`, v)}
                      onDelete={() => removeItem('projects', i)}
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, ${selectedGradient.from}33, ${selectedGradient.to}66)`,
                      }}
                    />
                  ) : (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                      <BentoGridItem
                        className="h-full"
                        icon={contentIconMap[item.icon]}
                        title={
                          <EditableText
                            className="font-serif text-lg sm:text-2xl font-bold text-card-foreground"
                            initialValue={item.title}
                            onSave={(v) => handleSave(`projects.projectItems.${i}.title`, v)}
                          />
                        }
                        description={
                          <EditableTruncatedText
                            initialValue={item.description}
                            onSave={(v) => handleSave(`projects.projectItems.${i}.description`, v)}
                            maxLines={3}
                            modalTitle={`${item.title} - Description`}
                          />
                        }
                      />
                    </a>
                  )}
                </SmartCard>
                )
              }}
            />
          ) : (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No projects added yet</p>
                <GlowingButton
                  onClick={() => {
                    // Send message to parent to add new project
                    window.parent.postMessage({
                      type: 'ADD_ITEM',
                      section: 'projects',
                      item: {
                        title: 'New Project',
                        description: 'Project description...',
                        link: 'https://example.com',
                        icon: 'project'
                      }
                    }, '*')
                  }}
                >
                  Add Your First Project
                </GlowingButton>
              </div>
            </div>
          )}
        </Section>
        </EditableSection>
      ) : null,

    /* 4. Skills (unchanged) ---------------------------------------- */
    skills:
      sectionVisibility.skills && hasContent(data.skills) ? (
        <EditableSection
          sectionTitle="Skills"
          onMoveUp={() => moveSection('skills', 'up')}
          onMoveDown={() => moveSection('skills', 'down')}
          showMoveButtons={true}
          showAddButton={false}
          isFirst={visibleSectionKeys[0] === 'skills'}
          isLast={visibleSectionKeys[visibleSectionKeys.length - 1] === 'skills'}
        >
          <Section
            id="skills"
            title={data.skills.sectionTitle}
            onSaveTitle={(v) => handleSave("skills.sectionTitle", v)}
            isVisible
            className="bg-secondary/30"
          >
            <SkillsSection
              data={data.skills}
              onSaveSkill={(catIdx, skillIdx, v) =>
                handleSave(`skills.skillCategories.${catIdx}.skills.${skillIdx}.name`, v)
              }
              onSaveUngroupedSkill={(idx, v) => handleSave(`skills.ungroupedSkills.${idx}.name`, v)}
              onReorderCategories={(newCategories) => handleSave("skills.skillCategories", newCategories, false)}
              onReorderSkills={(catIdx, newSkills) => handleSave(`skills.skillCategories.${catIdx}.skills`, newSkills, false)}
            />
          </Section>
        </EditableSection>
      ) : null,

    /* 5. Education (timeline) -------------------------------------- */
    education:
      sectionVisibility.education && data.education.educationItems.length ? (
        <EditableSection
          onAddItem={() => addItem('education', {
            institution: 'New Institution',
            degree: 'New Degree',
            years: '2024',
            description: 'Description of education'
          })}
          sectionTitle="Education"
          onMoveUp={() => moveSection('education', 'up')}
          onMoveDown={() => moveSection('education', 'down')}
          showMoveButtons={true}
          isFirst={visibleSectionKeys[0] === 'education'}
          isLast={visibleSectionKeys[visibleSectionKeys.length - 1] === 'education'}
        >
          <Section
            id="education"
            title={data.education.sectionTitle}
            onSaveTitle={(v) => handleSave("education.sectionTitle", v)}
            isVisible
          >
          {isEditMode ? (
            <DraggableList
              items={data.education.educationItems}
              onReorder={(newItems) => {
                handleSave("education.educationItems", newItems, false)
              }}
              renderItem={(educationItem, index) => {
                const timelineItem = {
                  title: (
                    <EditableText
                      as="h3"
                      className="font-serif text-lg sm:text-2xl font-bold text-card-foreground"
                      initialValue={educationItem.institution}
                      onSave={(v) => handleSave(`education.educationItems.${index}.institution`, v)}
                    />
                  ),
                  degree: (
                    <EditableText
                      as="p"
                      className="font-sans text-base sm:text-lg font-semibold text-card-foreground/90 mt-1"
                      initialValue={educationItem.degree}
                      onSave={(v) => handleSave(`education.educationItems.${index}.degree`, v)}
                    />
                  ),
                  years: (
                    <EditableText
                      as="p"
                      className="font-sans text-base text-muted-foreground my-2"
                      initialValue={educationItem.years}
                      onSave={(v) => handleSave(`education.educationItems.${index}.years`, v)}
                    />
                  ),
                  description: (
                    <EditableText
                      textarea
                      as="p"
                      className="font-sans text-muted-foreground text-sm sm:text-base mt-2"
                      initialValue={educationItem.description}
                      onSave={(v) => handleSave(`education.educationItems.${index}.description`, v)}
                    />
                  ),
                  imageUrl: educationItem.imageUrl,
                  imageAlt: educationItem.imageAlt,
                  imageTransform: educationItem.imageTransform,
                }
                
                return (
                  <div className="mb-8">
                    <VerticalTimeline 
                      items={[timelineItem]} 
                      isEditMode={isEditMode}
                      onEdit={() => {
                        // Handle edit functionality
                        console.log('Edit education item:', index)
                      }}
                      onDelete={() => removeItem('education', index)}
                      onUpdateImage={(_, imageUrl, imageAlt, imageTransform) => {
                        const newItems = [...data.education.educationItems]
                        newItems[index] = {
                          ...newItems[index],
                          imageUrl,
                          imageAlt,
                          imageTransform
                        }
                        setData(prev => ({
                          ...prev,
                          education: {
                            ...prev.education,
                            educationItems: newItems
                          }
                        }))
                      }}
                    />
                  </div>
                )
              }}
              keyExtractor={(item, index) => `education-${data.education.educationItems[index]?.institution || index}`}
              className="w-full"
            />
          ) : (
            <VerticalTimeline 
              items={educationTimelineItems} 
              isEditMode={isEditMode}
              onEdit={(index) => {
                // Handle edit functionality
                console.log('Edit education item:', index)
              }}
              onDelete={(index) => removeItem('education', index)}
              onUpdateImage={(index, imageUrl, imageAlt, imageTransform) => {
                const newItems = [...data.education.educationItems]
                newItems[index] = {
                  ...newItems[index],
                  imageUrl,
                  imageAlt,
                  imageTransform
                }
                setData(prev => ({
                  ...prev,
                  education: {
                    ...prev.education,
                    educationItems: newItems
                  }
                }))
              }}
            />
          )}
        </Section>
        </EditableSection>
      ) : null,

    /* 6. Testimonials (carousel) ----------------------------------- */
    testimonials:
      sectionVisibility.testimonials && data.testimonials.testimonialItems.length ? (
        <EditableSection
          onAddItem={() => addItem('testimonials', {
            quote: 'New testimonial quote',
            authorName: 'Author Name',
            authorTitle: 'Author Title',
            authorImage: ''
          })}
          sectionTitle="Testimonials"
          onMoveUp={() => moveSection('testimonials', 'up')}
          onMoveDown={() => moveSection('testimonials', 'down')}
          showMoveButtons={true}
          isFirst={visibleSectionKeys[0] === 'testimonials'}
          isLast={visibleSectionKeys[visibleSectionKeys.length - 1] === 'testimonials'}
        >
          <Section
            id="testimonials"
            title={data.testimonials.sectionTitle}
            onSaveTitle={(v) => handleSave("testimonials.sectionTitle", v)}
            isVisible
            className="bg-secondary/30"
            fullWidth
          >
          <CardCarousel
            items={data.testimonials.testimonialItems}
            itemClassName="basis-full md:basis-1/2 lg:basis-1/3"
            renderItem={(item, i) => (
              <TestimonialCard
                item={item}
                onSave={(field, v) => handleSave(`testimonials.testimonialItems.${i}.${field}`, v)}
                onDelete={() => removeItem('testimonials', i)}
              />
            )}
          />
        </Section>
        </EditableSection>
      ) : null,

    /* 7. Achievements (carousel) --------------------------------------- */
    achievements:
      sectionVisibility.achievements && data.achievements.achievementItems.length ? (
        <EditableSection
          onAddItem={() => addItem('achievements', {
            title: 'New Achievement',
            description: 'Achievement description',
            year: '2024',
            icon: 'IconTrophy',
            viewMode: 'text',
            textVariant: 'detailed',
            images: []
          })}
          sectionTitle="Achievements"
          onMoveUp={() => moveSection('achievements', 'up')}
          onMoveDown={() => moveSection('achievements', 'down')}
          showMoveButtons={true}
          isFirst={visibleSectionKeys[0] === 'achievements'}
          isLast={visibleSectionKeys[visibleSectionKeys.length - 1] === 'achievements'}
        >
          <Section
            id="achievements"
            title={data.achievements.sectionTitle}
            onSaveTitle={(v) => handleSave("achievements.sectionTitle", v)}
            isVisible
            fullWidth
          >
          <CardCarousel
            items={data.achievements.achievementItems}
            itemClassName="basis-full md:basis-1/2 lg:basis-1/3"
            renderItem={(item, i) => {
              const selectedGradient = getGradientForIndex(i)
              return (
              <SmartCard
                item={item}
                onUpdate={(field, value) => handleSave(`achievements.achievementItems.${i}.${field}`, value)}
                onDelete={() => removeItem('achievements', i)}
                className={cn(
                  "h-full w-full shadow-lg overflow-hidden",
                  item.viewMode === 'images' ? "aspect-[4/3]" : "aspect-[5/3]",
                  cardBgClasses[i % cardBgClasses.length]
                )}
              >
                {/* Render based on text variant */}
                {item.textVariant === 'simple' ? (
                  <HobbyCard
                    title={item.title}
                    onSave={(v) => handleSave(`achievements.achievementItems.${i}.title`, v)}
                    onDelete={() => removeItem('achievements', i)}
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${selectedGradient.from}33, ${selectedGradient.to}66)`,
                    }}
                  />
                ) : (
                  <BentoGridItem
                    className="h-full"
                    icon={contentIconMap[item.icon]}
                    title={
                      <EditableText
                        className="font-serif text-lg sm:text-2xl font-bold text-card-foreground"
                        initialValue={item.title}
                        onSave={(v) => handleSave(`achievements.achievementItems.${i}.title`, v)}
                      />
                    }
                    description={
                      <EditableText
                        as="p"
                        className="font-sans text-muted-foreground text-sm sm:text-base"
                        initialValue={`${item.description}${item.year ? `, ${item.year}` : ""}`}
                        onSave={(v) => {
                          const [desc = "", yr = ""] = v.split(",")
                          handleSave(`achievements.achievementItems.${i}.description`, desc.trim())
                          handleSave(`achievements.achievementItems.${i}.year`, yr.trim())
                        }}
                      />
                    }
                  />
                )}
              </SmartCard>
              )
            }}
          />
        </Section>
        </EditableSection>
      ) : null,

    /* 8. Certifications (carousel) ------------------------------------- */
    certifications:
      sectionVisibility.certifications && data.certifications.certificationItems.length ? (
        <EditableSection
          onAddItem={() => addItem('certifications', {
            title: 'New Certification',
            issuingBody: 'Issuing Organization',
            year: '2024',
            icon: 'IconCertificate',
            viewMode: 'text',
            textVariant: 'detailed',
            images: []
          })}
          sectionTitle="Certifications"
          onMoveUp={() => moveSection('certifications', 'up')}
          onMoveDown={() => moveSection('certifications', 'down')}
          showMoveButtons={true}
          isFirst={visibleSectionKeys[0] === 'certifications'}
          isLast={visibleSectionKeys[visibleSectionKeys.length - 1] === 'certifications'}
        >
          <Section
            id="certifications"
            title={data.certifications.sectionTitle}
            onSaveTitle={(v) => handleSave("certifications.sectionTitle", v)}
            isVisible
            className="bg-secondary/30"
            fullWidth
          >
          <CardCarousel
            items={data.certifications.certificationItems}
            itemClassName="basis-full md:basis-1/2 lg:basis-1/3"
            renderItem={(item, i) => {
              const selectedGradient = getGradientForIndex(i)
              return (
              <SmartCard
                item={item}
                onUpdate={(field, value) => handleSave(`certifications.certificationItems.${i}.${field}`, value)}
                onDelete={() => removeItem('certifications', i)}
                className={cn(
                  "h-full w-full shadow-lg overflow-hidden",
                  item.viewMode === 'images' ? "aspect-[4/3]" : "aspect-[5/3]",
                  cardBgClasses[i % cardBgClasses.length]
                )}
              >
                {/* Render based on text variant */}
                {item.textVariant === 'simple' ? (
                  <HobbyCard
                    title={item.title}
                    onSave={(v) => handleSave(`certifications.certificationItems.${i}.title`, v)}
                    onDelete={() => removeItem('certifications', i)}
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${selectedGradient.from}33, ${selectedGradient.to}66)`,
                    }}
                  />
                ) : (
                  <BentoGridItem
                    className="h-full"
                    icon={contentIconMap[item.icon]}
                    title={
                      <EditableText
                        className="font-serif text-lg sm:text-2xl font-bold text-card-foreground"
                        initialValue={item.title}
                        onSave={(v) => handleSave(`certifications.certificationItems.${i}.title`, v)}
                      />
                    }
                    description={
                      <EditableText
                        as="p"
                        className="font-sans text-muted-foreground text-sm sm:text-base"
                        initialValue={`${item.issuingBody}${item.year ? `, ${item.year}` : ""}`}
                        onSave={(v) => {
                          const [body = "", yr = ""] = v.split(",")
                          handleSave(`certifications.certificationItems.${i}.issuingBody`, body.trim())
                          handleSave(`certifications.certificationItems.${i}.year`, yr.trim())
                        }}
                      />
                    }
                  />
                )}
              </SmartCard>
              )
            }}
          />
        </Section>
        </EditableSection>
      ) : null,

    /* 9. Volunteer (carousel) ------------------------------------------ */
    volunteer:
      sectionVisibility.volunteer && data.volunteer.volunteerItems.length ? (
        <EditableSection
          onAddItem={() => addItem('volunteer', {
            role: 'Volunteer Role',
            organization: 'Organization Name',
            duration: '2024 - Present',
            description: 'Volunteer work description',
            icon: 'IconHeart',
            viewMode: 'text',
            textVariant: 'detailed',
            images: []
          })}
          sectionTitle="Volunteer Experience"
          onMoveUp={() => moveSection('volunteer', 'up')}
          onMoveDown={() => moveSection('volunteer', 'down')}
          showMoveButtons={true}
          isFirst={visibleSectionKeys[0] === 'volunteer'}
          isLast={visibleSectionKeys[visibleSectionKeys.length - 1] === 'volunteer'}
        >
          <Section
            id="volunteer"
            title={data.volunteer.sectionTitle}
            onSaveTitle={(v) => handleSave("volunteer.sectionTitle", v)}
            isVisible
            fullWidth
          >
          <CardCarousel
            items={data.volunteer.volunteerItems}
            itemClassName="basis-full md:basis-1/2 lg:basis-1/3"
            renderItem={(item, i) => {
              const selectedGradient = getGradientForIndex(i)
              return (
              <SmartCard
                item={item}
                onUpdate={(field, value) => handleSave(`volunteer.volunteerItems.${i}.${field}`, value)}
                onDelete={() => removeItem('volunteer', i)}
                className={cn(
                  "h-full w-full shadow-lg overflow-hidden",
                  item.viewMode === 'images' ? "aspect-[4/3]" : "aspect-[5/3]",
                  cardBgClasses[i % cardBgClasses.length]
                )}
              >
                {/* Render based on text variant */}
                {item.textVariant === 'simple' ? (
                  <HobbyCard
                    title={item.role}
                    onSave={(v) => handleSave(`volunteer.volunteerItems.${i}.role`, v)}
                    onDelete={() => removeItem('volunteer', i)}
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${selectedGradient.from}33, ${selectedGradient.to}66)`,
                    }}
                  />
                ) : (
                  <BentoGridItem
                    className="h-full"
                    icon={contentIconMap[item.icon]}
                    title={
                      <EditableText
                        className="font-serif text-lg sm:text-2xl font-bold text-card-foreground"
                        initialValue={item.role}
                        onSave={(v) => handleSave(`volunteer.volunteerItems.${i}.role`, v)}
                      />
                    }
                    description={
                      <>
                        <p className="font-semibold text-card-foreground">
                          <EditableText
                            as="span"
                            initialValue={item.organization}
                            onSave={(v) => handleSave(`volunteer.volunteerItems.${i}.organization`, v)}
                          />
                        </p>
                        <EditableTruncatedText
                          initialValue={item.description}
                          onSave={(v) => handleSave(`volunteer.volunteerItems.${i}.description`, v)}
                          className="mt-2"
                          maxLines={2}
                          modalTitle={`${item.role} - Description`}
                        />
                      </>
                    }
                  />
                )}
              </SmartCard>
              )
            }}
          />
        </Section>
        </EditableSection>
      ) : null,

    /* 10. Hobbies (carousel with HobbyCard) -------------------------------------------- */
    hobbies:
      sectionVisibility.hobbies ? (
        <EditableSection
          onAddItem={() => addItem('hobbies', {
            title: 'New Hobby',
            description: 'Describe your hobby',
            icon: 'IconStar',
            viewMode: 'text',
            textVariant: 'detailed',
            images: []
          })}
          sectionTitle="Hobbies"
          onMoveUp={() => moveSection('hobbies', 'up')}
          onMoveDown={() => moveSection('hobbies', 'down')}
          showMoveButtons={true}
          isFirst={visibleSectionKeys[0] === 'hobbies'}
          isLast={visibleSectionKeys[visibleSectionKeys.length - 1] === 'hobbies'}
        >
          <Section
            id="hobbies"
            title={data.hobbies.sectionTitle}
            onSaveTitle={(v) => handleSave("hobbies.sectionTitle", v)}
            isVisible
            className="bg-secondary/30"
            fullWidth
          >
          {data.hobbies.hobbyItems.length > 0 ? (
            <CardCarousel
              items={data.hobbies.hobbyItems}
              itemClassName="basis-full md:basis-1/2 lg:basis-1/3"
              renderItem={(item, i) => {
                const selectedGradient = getGradientForIndex(i)

                return (
                  <SmartCard
                    item={item}
                    onUpdate={(field, value) => handleSave(`hobbies.hobbyItems.${i}.${field}`, value)}
                    onDelete={() => removeItem('hobbies', i)}
                    className="h-full shadow-lg"
                  >
                    {/* Render based on text variant */}
                    {item.textVariant === 'detailed' ? (
                      <BentoGridItem
                        className="h-full"
                        icon={contentIconMap[item.icon || 'IconStar']}
                        title={
                          <EditableText
                            className="font-serif text-lg sm:text-2xl font-bold text-card-foreground"
                            initialValue={item.title}
                            onSave={(v) => handleSave(`hobbies.hobbyItems.${i}.title`, v)}
                          />
                        }
                        description={
                          <EditableTruncatedText
                            initialValue={item.description || 'Add a description for this hobby'}
                            onSave={(v) => handleSave(`hobbies.hobbyItems.${i}.description`, v)}
                            maxLines={2}
                            modalTitle={`${item.title} - Description`}
                          />
                        }
                      />
                    ) : (
                      <HobbyCard
                        title={item.title}
                        onSave={(v) => handleSave(`hobbies.hobbyItems.${i}.title`, v)}
                        onDelete={() => removeItem('hobbies', i)}
                        style={{
                          backgroundImage: `linear-gradient(to bottom right, ${selectedGradient.from}33, ${selectedGradient.to}66)`,
                        }}
                      />
                    )}
                  </SmartCard>
                )
              }}
            />
          ) : (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No hobbies added yet</p>
                <GlowingButton
                  onClick={() => {
                    // Send message to parent to add new hobby
                    window.parent.postMessage({
                      type: 'ADD_ITEM',
                      section: 'hobbies',
                      item: {
                        title: 'New Hobby'
                      }
                    }, '*')
                  }}
                >
                  Add Your First Hobby
                </GlowingButton>
              </div>
            </div>
          )}
        </Section>
        </EditableSection>
      ) : null,

    /* 11. Courses (carousel) --------------------------------------- */
    courses:
      sectionVisibility.courses && data.courses.courseItems.length ? (
        <EditableSection
          onAddItem={() => addItem('courses', {
            title: 'New Course',
            institution: 'Institution Name',
            year: '2024',
            icon: 'IconBook',
            viewMode: 'text',
            textVariant: 'detailed',
            images: []
          })}
          sectionTitle="Courses"
          onMoveUp={() => moveSection('courses', 'up')}
          onMoveDown={() => moveSection('courses', 'down')}
          showMoveButtons={true}
          isFirst={visibleSectionKeys[0] === 'courses'}
          isLast={visibleSectionKeys[visibleSectionKeys.length - 1] === 'courses'}
        >
          <Section
            id="courses"
            title={data.courses.sectionTitle}
            onSaveTitle={(v) => handleSave("courses.sectionTitle", v)}
            isVisible
            fullWidth
          >
          <CardCarousel
            items={data.courses.courseItems}
            itemClassName="basis-full md:basis-1/2 lg:basis-1/3"
            renderItem={(item, i) => {
              const selectedGradient = getGradientForIndex(i)
              return (
              <SmartCard
                item={item}
                onUpdate={(field, value) => handleSave(`courses.courseItems.${i}.${field}`, value)}
                onDelete={() => removeItem('courses', i)}
                className={cn(
                  "h-full w-full shadow-lg overflow-hidden",
                  item.viewMode === 'images' ? "aspect-[4/3]" : "aspect-[5/3]",
                  cardBgClasses[i % cardBgClasses.length]
                )}
              >
                {/* Render based on text variant */}
                {item.textVariant === 'simple' ? (
                  <HobbyCard
                    title={item.title}
                    onSave={(v) => handleSave(`courses.courseItems.${i}.title`, v)}
                    onDelete={() => removeItem('courses', i)}
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${selectedGradient.from}33, ${selectedGradient.to}66)`,
                    }}
                  />
                ) : (
                  <BentoGridItem
                    className="h-full"
                    icon={contentIconMap[item.icon]}
                    title={
                      <EditableText
                        className="font-serif text-lg sm:text-2xl font-bold text-card-foreground"
                        initialValue={item.title}
                        onSave={(v) => handleSave(`courses.courseItems.${i}.title`, v)}
                      />
                    }
                    description={
                      <EditableText
                        as="p"
                        className="font-sans text-muted-foreground text-sm sm:text-base"
                        initialValue={`${item.institution}${item.year ? `, ${item.year}` : ""}`}
                        onSave={(v) => {
                          const [inst = "", yr = ""] = v.split(",")
                          handleSave(`courses.courseItems.${i}.institution`, inst.trim())
                          handleSave(`courses.courseItems.${i}.year`, yr.trim())
                        }}
                      />
                    }
                  />
                )}
              </SmartCard>
              )
            }}
          />
        </Section>
        </EditableSection>
      ) : null,

    /* 12. Publications (carousel) ---------------------------------- */
    publications:
      sectionVisibility.publications && data.publications.publicationItems.length ? (
        <EditableSection
          onAddItem={() => addItem('publications', {
            title: 'New Publication',
            journal: 'Journal Name',
            year: '2024',
            link: '#',
            icon: 'IconBook',
            viewMode: 'text',
            textVariant: 'detailed',
            images: []
          })}
          sectionTitle="Publications"
          onMoveUp={() => moveSection('publications', 'up')}
          onMoveDown={() => moveSection('publications', 'down')}
          showMoveButtons={true}
          isFirst={visibleSectionKeys[0] === 'publications'}
          isLast={visibleSectionKeys[visibleSectionKeys.length - 1] === 'publications'}
        >
          <Section
            id="publications"
            title={data.publications.sectionTitle}
            onSaveTitle={(v) => handleSave("publications.sectionTitle", v)}
            isVisible
            className="bg-secondary/30"
            fullWidth
          >
          <CardCarousel
            items={data.publications.publicationItems}
            itemClassName="basis-full md:basis-1/2 lg:basis-1/3"
            renderItem={(item, i) => {
              const selectedGradient = getGradientForIndex(i)
              return (
              <SmartCard
                item={item}
                onUpdate={(field, value) => handleSave(`publications.publicationItems.${i}.${field}`, value)}
                onDelete={() => removeItem('publications', i)}
                className={cn(
                  "h-full w-full shadow-lg overflow-hidden",
                  item.viewMode === 'images' ? "aspect-[4/3]" : "aspect-[5/3]",
                  cardBgClasses[i % cardBgClasses.length]
                )}
              >
                {/* Render based on text variant */}
                {item.textVariant === 'simple' ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                    <HobbyCard
                      title={item.title}
                      onSave={(v) => handleSave(`publications.publicationItems.${i}.title`, v)}
                      onDelete={() => removeItem('publications', i)}
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, ${selectedGradient.from}33, ${selectedGradient.to}66)`,
                      }}
                    />
                  </a>
                ) : (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                    <BentoGridItem
                      className="h-full"
                      icon={contentIconMap[item.icon]}
                      title={
                        <EditableText
                          className="font-serif text-lg sm:text-2xl font-bold text-card-foreground"
                          initialValue={item.title}
                          onSave={(v) => handleSave(`publications.publicationItems.${i}.title`, v)}
                        />
                      }
                      description={
                        <EditableText
                          as="p"
                          className="font-sans text-muted-foreground text-sm sm:text-base"
                          initialValue={`${item.journal}${item.year ? `, ${item.year}` : ""}`}
                          onSave={(v) => {
                            const [jour = "", yr = ""] = v.split(",")
                            handleSave(`publications.publicationItems.${i}.journal`, jour.trim())
                            handleSave(`publications.publicationItems.${i}.year`, yr.trim())
                          }}
                        />
                      }
                    />
                  </a>
                )}
              </SmartCard>
              )
            }}
          />
        </Section>
        </EditableSection>
      ) : null,

    /* 13. Speaking engagements (carousel) -------------------------- */
    speakingEngagements:
      sectionVisibility.speakingEngagements && data.speakingEngagements.engagementItems.length ? (
        <EditableSection
          onAddItem={() => addItem('speakingEngagements', {
            title: 'New Speaking Engagement',
            event: 'Event Name',
            location: 'Location',
            year: '2024',
            icon: 'IconMicrophone',
            viewMode: 'text',
            textVariant: 'detailed',
            images: []
          })}
          sectionTitle="Speaking Engagements"
          onMoveUp={() => moveSection('speakingEngagements', 'up')}
          onMoveDown={() => moveSection('speakingEngagements', 'down')}
          showMoveButtons={true}
          isFirst={visibleSectionKeys[0] === 'speakingEngagements'}
          isLast={visibleSectionKeys[visibleSectionKeys.length - 1] === 'speakingEngagements'}
        >
          <Section
            id="speakingEngagements"
            title={data.speakingEngagements.sectionTitle}
            onSaveTitle={(v) => handleSave("speakingEngagements.sectionTitle", v)}
            isVisible
            fullWidth
          >
          <CardCarousel
            items={data.speakingEngagements.engagementItems}
            itemClassName="basis-full md:basis-1/2 lg:basis-1/3"
            renderItem={(item, i) => {
              const selectedGradient = getGradientForIndex(i)
              return (
              <SmartCard
                item={item}
                onUpdate={(field, value) => handleSave(`speakingEngagements.engagementItems.${i}.${field}`, value)}
                onDelete={() => removeItem('speakingEngagements', i)}
                className={cn(
                  "h-full w-full shadow-lg overflow-hidden",
                  item.viewMode === 'images' ? "aspect-[4/3]" : "aspect-[5/3]",
                  cardBgClasses[i % cardBgClasses.length]
                )}
              >
                {/* Render based on text variant */}
                {item.textVariant === 'simple' ? (
                  <HobbyCard
                    title={item.title}
                    onSave={(v) => handleSave(`speakingEngagements.engagementItems.${i}.title`, v)}
                    onDelete={() => removeItem('speakingEngagements', i)}
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${selectedGradient.from}33, ${selectedGradient.to}66)`,
                    }}
                  />
                ) : (
                  <BentoGridItem
                    className="h-full"
                    icon={contentIconMap[item.icon]}
                    title={
                      <EditableText
                        className="font-serif text-lg sm:text-2xl font-bold text-card-foreground"
                        initialValue={item.title}
                        onSave={(v) => handleSave(`speakingEngagements.engagementItems.${i}.title`, v)}
                      />
                    }
                    description={
                      <EditableText
                        as="p"
                        className="font-sans text-muted-foreground text-sm sm:text-base"
                        initialValue={`${item.event} - ${item.location}${item.year ? `, ${item.year}` : ""}`}
                        onSave={(v) => handleSave(`speakingEngagements.engagementItems.${i}.event`, v)}
                      />
                    }
                  />
                )}
              </SmartCard>
              )
            }}
          />
        </Section>
        </EditableSection>
      ) : null,

    /* 14. Memberships (carousel) ----------------------------------- */
    memberships:
      sectionVisibility.memberships && data.memberships.membershipItems.length ? (
        <EditableSection
          onAddItem={() => addItem('memberships', {
            organization: 'New Organization',
            role: 'Member',
            period: '2024 - Present',
            viewMode: 'text',
            images: []
          })}
          sectionTitle="Memberships"
          onMoveUp={() => moveSection('memberships', 'up')}
          onMoveDown={() => moveSection('memberships', 'down')}
          showMoveButtons={true}
          isFirst={visibleSectionKeys[0] === 'memberships'}
          isLast={visibleSectionKeys[visibleSectionKeys.length - 1] === 'memberships'}
        >
          <Section
            id="memberships"
            title={data.memberships.sectionTitle}
            onSaveTitle={(v) => handleSave("memberships.sectionTitle", v)}
            isVisible
            className="bg-secondary/30"
            fullWidth
          >
          <CardCarousel
            items={data.memberships.membershipItems}
            itemClassName="basis-1/3"
            renderItem={(item, i) => {
              const selectedGradient = getGradientForIndex(i)

              return (
                <SmartCard
                  item={item}
                  onUpdate={(field, value) => handleSave(`memberships.membershipItems.${i}.${field}`, value)}
                  onDelete={() => removeItem('memberships', i)}
                  className="h-full shadow-lg"
                >
                  {/* Default text view content */}
                  <MembershipCard
                    organization={item.organization}
                    role={item.role}
                    period={item.period}
                    description={item.description}
                    textVariant={item.textVariant || 'simple'}
                    onSaveOrganization={(v) => handleSave(`memberships.membershipItems.${i}.organization`, v)}
                    onSaveRole={(v) => handleSave(`memberships.membershipItems.${i}.role`, v)}
                    onSavePeriod={(v) => handleSave(`memberships.membershipItems.${i}.period`, v)}
                    onSaveDescription={(v) => handleSave(`memberships.membershipItems.${i}.description`, v)}
                    onDelete={() => removeItem('memberships', i)}
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${selectedGradient.from}33, ${selectedGradient.to}66)`,
                    }}
                  />
                </SmartCard>
              )
            }}
          />
        </Section>
        </EditableSection>
      ) : null,

    /* 15. Languages (chips) --------------------------------------- */
    languages:
      sectionVisibility.languages && data.languages.sectionTitle ? (
        <EditableSection
          onAddItem={() => addItem('languages', {
            language: 'New Language',
            proficiency: 'Proficiency Level'
          })}
          sectionTitle="Languages"
          onMoveUp={() => moveSection('languages', 'up')}
          onMoveDown={() => moveSection('languages', 'down')}
          showMoveButtons={true}
          isFirst={visibleSectionKeys[0] === 'languages'}
          isLast={visibleSectionKeys[visibleSectionKeys.length - 1] === 'languages'}
        >
          <Section
            id="languages"
            title={data.languages.sectionTitle}
            onSaveTitle={(v) => handleSave("languages.sectionTitle", v)}
            isVisible
          >
            <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
              {data.languages.languageItems.map((item, i) => (
                <div key={i} className="relative group">
                  {isEditMode && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => removeItem('languages', i)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                  <GlowingButton>
                    <div className="text-xl">
                  <EditableText
                    as="span"
                    initialValue={item.language}
                    onSave={(v) => handleSave(`languages.languageItems.${i}.language`, v)}
                    className="font-serif font-semibold text-card-foreground"
                  />
                  <span className="mx-1 text-muted-foreground">:</span>
                  <EditableText
                    as="span"
                    initialValue={item.proficiency}
                    onSave={(v) => handleSave(`languages.languageItems.${i}.proficiency`, v)}
                    className="font-sans text-muted-foreground"
                  />
                    </div>
                  </GlowingButton>
                </div>
              ))}
            </div>
          </Section>
        </EditableSection>
      ) : null,
  }

  /* ── Render ────────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <main className="bg-background text-foreground antialiased min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading your portfolio...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="bg-background text-foreground antialiased min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-lg text-red-500 mb-4">⚠️ {error}</p>
          <p className="text-muted-foreground mb-4">Showing demo content instead.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  // Prepare sections data for navigator
  const visibleSections = orderedSections
    .filter(key => sectionComponents[key] !== null && sectionComponents[key] !== undefined)
    .map(key => ({
      id: key,
      title: (data as any)[key]?.sectionTitle || formatLabel(key)
    }))

  return (
    <main className="bg-background text-foreground antialiased w-full max-w-full overflow-x-hidden">
      <FloatingNav navItems={navItems} maxVisibleItems={6} />
      <EditModeToggle />
      <ThemeToggle />
      <WatermarkToggle isVisible={isWatermarkVisible} onToggle={toggleWatermark} />

      {/* Hero */}
      <HeroSection data={data.hero} onSave={(field, v) => handleSave(`hero.${field}`, v)} showPhoto={showPhoto} />

      {/* Dynamic sections */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedSections.filter(key => sectionComponents[key] !== null && sectionComponents[key] !== undefined)}
          strategy={verticalListSortingStrategy}
        >
          {orderedSections
            .filter((key) => sectionComponents[key] !== null && sectionComponents[key] !== undefined)
            .map((key) => (
              <DraggableSection key={key} id={key}>
                {sectionComponents[key]}
              </DraggableSection>
            ))}
        </SortableContext>
      </DndContext>

      {/* Contact */}
      <ContactSection
        data={data.contact}
        onSave={(field, v) => handleSave(`contact.${field}`, v)}
        onSaveLocation={(field, v) => handleSave(`contact.location.${field}`, v)}
      />
    </main>
  )
}
