"use client"

import React, { useMemo, useState, useEffect } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { toast } from "sonner"

import { initialData, contentIconMap, type PortfolioData } from "@/lib/data"
import { renderIcon } from "@/lib/icon-utils"
import { IconSelector } from "@/components/ui/icon-selector"
import { fetchLatestCVData, adaptCV2WebToTemplate } from "@/lib/cv-data-adapter"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme/theme-provider"
import { useEditMode } from "@/contexts/edit-mode-context"

/* ── UI primitives ──────────────────────────────────────────────── */
import { VerticalTimeline } from "@/components/ui/vertical-timeline"
import { BentoGridItem } from "@/components/ui/bento-grid-item"
import { EditableText } from "@/components/ui/editable-text"
import { EditableTruncatedText } from "@/components/ui/editable-truncated-text"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import { GlowingButton } from "@/components/ui/glowing-button"
import { FlipText } from "@/components/ui/flip-text"
import { Button } from "@/components/ui/button"
import { Trash2, Briefcase } from "lucide-react"

/* ── Custom components & layouts ────────────────────────────────── */
import { Section } from "@/components/section"
import { DraggableSection } from "@/components/draggable-section-simple"
import { DraggableList } from "@/components/draggable-list"
import { CardCarousel } from "@/components/card-carousel"
import { DraggableCardCarousel } from "@/components/draggable-card-carousel"
import { DraggableCardTimeline } from "@/components/draggable-card-timeline"
import { DraggableCardTimelineV2 } from "@/components/draggable-card-timeline-v2"
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
import { StylePanel } from "@/components/style-panel"
import { SectionLayoutSettings } from "@/components/section-layout-settings"
import { generateCardClasses, type SectionLayoutConfig } from "@/lib/smart-sizing"

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

  // Check for nested items arrays (e.g., experience.experienceItems)
  const itemKeys = Object.keys(data).filter((k) => k.endsWith("Items") || k.endsWith("skills"))
  if (itemKeys.length) {
    return itemKeys.some((k) => Array.isArray(data[k]) && data[k].length > 0)
  }

  // Check for direct text content
  if (data.summaryText) return Boolean(data.summaryText)
  
  // Check for section title (indicates section should show)
  if (data.sectionTitle) return true

  return false
}


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
          // For generated portfolios, first try to load injected data
          console.log('🔄 Loading CV data...')
          
          try {
            // First try to load injected data dynamically (for portfolio generator)
            const injectedModule = await import('@/lib/injected-data')
            if (injectedModule.portfolioData) {
              console.log('✅ Using injected CV data from portfolio generator')
              // Debug: Check what sections have content
              const sections = ['experience', 'education', 'skills', 'projects', 'achievements']
              sections.forEach(section => {
                const sectionData = injectedModule.portfolioData[section]
                if (sectionData) {
                  const hasData = hasContent(sectionData)
                  console.log(`  ${section}: hasContent=${hasData}`, sectionData)
                }
              })
              // Use the injected data directly without merging test data
              setData(injectedModule.portfolioData)
              
              // Update section visibility based on the real CV data
              const newVisibility: Partial<Record<SectionKey, boolean>> = {}
              for (const key of initialSectionKeys) {
                if (key === 'testimonials') {
                  newVisibility[key] = false // Keep testimonials hidden by default
                } else if (key === 'projects') {
                  newVisibility[key] = hasContent(injectedModule.portfolioData[key as SectionKey]) || isEditMode
                } else {
                  newVisibility[key] = hasContent(injectedModule.portfolioData[key as SectionKey])
                }
              }
              setSectionVisibility(newVisibility as Record<SectionKey, boolean>)
              
              toast.success('Portfolio loaded with your CV data!')
              return // Exit early - we have the data
            }
          } catch (injectedError) {
            console.log('ℹ️ No injected data found, trying API...')
          }
          
          // Temporarily skip API fetch for development
          console.log('ℹ️ Skipping API fetch, using demo content')
          // Keep using initialData as fallback
          return
          
          // // Fallback to API fetch (original behavior)
          // const sessionId = getSessionId() || 'generated-portfolio'
          // const cvData = await fetchLatestCVData(sessionId)
          // setData(cvData)
          // console.log('✅ CV data loaded from API')
          // toast.success('Portfolio loaded successfully!')
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
    for (const key of initialSectionKeys) {
      if (key === 'testimonials') {
        visibility[key] = false // Hide testimonials by default (needs card improvements before MVP)
      } else if (key === 'projects') {
        // Always show projects section if it has content or in edit mode
        visibility[key] = hasContent(data[key as SectionKey]) || isEditMode
      } else {
        visibility[key] = hasContent(data[key as SectionKey])
      }
    }
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
        toast.success("Changes saved!")
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
      
      // Smooth scroll to the moved section after a brief delay
      setTimeout(() => {
        const sectionElement = document.getElementById(section)
        if (sectionElement) {
          if (direction === 'up') {
            // When moving up, show a bit of the previous section for context
            const rect = sectionElement.getBoundingClientRect()
            const offsetTop = window.pageYOffset + rect.top - 80 // 80px offset to show previous section
            window.scrollTo({
              top: Math.max(0, offsetTop), // Ensure we don't scroll above the page
              behavior: 'smooth'
            })
          } else {
            // When moving down, scroll to start normally
            sectionElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            })
          }
        }
      }, 100) // Small delay to ensure DOM has updated
      
      return newOrder
    })
  }

  /* Helper functions for adding/removing items */
  const addItem = (section: string, newItem: any) => {
    setData(prev => {
      const sectionData = (prev as any)[section]
      
      // Handle missing sections (like projects_experimental)
      if (!sectionData) {
        console.log(`Section ${section} doesn't exist in data, creating it`)
        if (section === 'projects') {
          // Check if the section exists in data but is missing from state
          const existingData = initialData.projects
          return {
            ...prev,
            [section]: {
              sectionTitle: existingData?.sectionTitle || "Featured Projects (Beta 2)",
              layoutConfig: {
                layoutType: 'horizontal-carousel',
                autoSizing: true,
                manualSize: 'large',
                shape: 'very-wide',
                height: 'standard'
              },
              projectItems: existingData?.projectItems ? [...existingData.projectItems, newItem] : [newItem]
            }
          }
        }
        return prev
      }
      
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
      if (!sectionData) return prev
      
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

  /* Helper functions for reordering carousel items */
  const reorderItems = (section: string, newItems: any[]) => {
    setData(prev => {
      const sectionData = (prev as any)[section]
      if (!sectionData) return prev
      
      const itemsKey = Object.keys(sectionData).find(k => k.endsWith('Items'))
      if (itemsKey) {
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
  }

  /* Navigation items */ /* --------------------------------------- */
  const navItems = useMemo(
    () =>
      [
        ...orderedSections.map((k) => ({
          name: formatLabel((data as any)[k]?.sectionTitle ?? k),
          link: `#${k}`,
          key: k,
          sectionKey: k,
        })),
        { name: "Contact", link: "#contact" },
      ].filter((i) => !i.key || sectionVisibility[i.key as SectionKey]),
    [orderedSections, sectionVisibility, data],
  )


  /* Get visible sections for determining first/last */
  const visibleSectionKeys = useMemo(() => 
    orderedSections.filter(key => {
      return sectionVisibility[key] && hasContent(data[key as SectionKey])
    }),
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
                <EditableText
                  as="div"
                  textarea
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-light text-foreground/90 leading-relaxed hyphens-auto text-balance"
                  initialValue={data.summary.summaryText ?? ""}
                  onSave={(v) => {
                    // Limit to 500 characters
                    const truncated = v.slice(0, 500)
                    handleSave("summary.summaryText", truncated)
                    if (v.length > 500) {
                      toast.warning("Summary limited to 500 characters")
                    }
                  }}
                  placeholder="Add your professional summary here..."
                  maxLength={500}
                >
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
                </EditableText>
              </div>
            </div>
          </Section>
        </EditableSection>
      ) : null,

    /* 2. Experience (Accordion with SmartCard items) --------------- */
    experience:
      sectionVisibility.experience && (isEditMode || data.experience?.experienceItems?.length) ? (
        <EditableSection
          onAddItem={() => addItem('experience', {
            company: 'New Company',
            title: 'New Position',
            location: 'Location',
            startDate: '2024',
            endDate: 'Present',
            description: 'Job description and key achievements',
            technologies: [],
            icon: { type: 'library', value: 'briefcase' },
            viewMode: 'text',
            textVariant: 'detailed'
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
            <div className="max-w-4xl mx-auto space-y-6">
              {data.experience.experienceItems.map((item, i) => (
                <SmartCard
                  key={`experience-${i}-${item.title}`}
                  item={{ ...item, viewMode: 'text' }}
                  onUpdate={(field, value) => handleSave(`experience.experienceItems.${i}.${field}`, value, false)}
                  onDelete={() => removeItem('experience', i)}
                  className="w-full"
                  disableHoverEffects={true}
                  showIconEditor={false}
                >
                  <AccordionLayout
                    items={[item]}
                    onSave={(_, field, v) => handleSave(`experience.experienceItems.${i}.${field}`, v)}
                    showIconEditor={false}
                  />
                </SmartCard>
              ))}
            </div>
          </Section>
        </EditableSection>
      ) : null,



    /* 3c. Projects Experimental Beta2 (carousel) - FLEXBOX TEST VERSION --- */
    projects:
      sectionVisibility.projects && (isEditMode || (data.projects?.projectItems || []).length) ? (
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
          sectionTitle="Project"
          onMoveUp={() => moveSection('projects', 'up')}
          onMoveDown={() => moveSection('projects', 'down')}
          showMoveButtons={true}
          isFirst={visibleSectionKeys[0] === 'projects'}
          isLast={visibleSectionKeys[visibleSectionKeys.length - 1] === 'projects'}
        >
          <Section
            id="projects"
            title={data.projects?.sectionTitle || "Projects Experimental Beta2"}
            onSaveTitle={(v) => handleSave("projects.sectionTitle", v)}
            isVisible
            fullWidth
          >
          {/* Smart Sizing Controls */}
          {isEditMode && (
            <div className="flex justify-end mb-8 mt-2">
              <SectionLayoutSettings
                sectionKey="projects"
                sectionTitle={data.projects?.sectionTitle || "Projects Experimental Beta2"}
                currentConfig={data.projects?.layoutConfig || { layoutType: 'horizontal-carousel', autoSizing: false, manualSize: 'medium', shape: 'very-tall', height: 'standard' }}
                itemCount={data.projects?.projectItems?.length || 0}
                onConfigChange={(config) => handleSave("projects.layoutConfig", config)}
              />
            </div>
          )}
          
          {(data.projects?.projectItems || []).length > 0 ? (
            (() => {
              const layoutConfig = data.projects?.layoutConfig || { layoutType: 'horizontal-carousel', autoSizing: false, manualSize: 'medium', shape: 'very-tall', height: 'standard' }
              
              // Debug: Log what config is being used in preview mode
              console.log('Beta2 Preview mode layout config:', {
                isEditMode,
                rawLayoutConfig: data.projects?.layoutConfig,
                finalLayoutConfig: layoutConfig
              })
              
              const { classes: cardClasses, appliedSize } = generateCardClasses(
                layoutConfig,
                data.projects?.projectItems?.length || 0,
                'projects'
              )
              
              // Debug: Log card classes being applied
              console.log('Beta2 Card classes generated:', {
                layoutConfig,
                cardClasses,
                appliedSize,
                itemCount: data.projects?.projectItems?.length || 0
              })
              
              
              return (
                <DraggableCardCarousel
                  items={data.projects?.projectItems || []}
                  onReorder={(newItems) => reorderItems('projects', newItems)}
                  keyExtractor={(item, index) => `project-exp-beta2-${index}-${item.title}`}
                  itemClassName={cardClasses}
                  containerClassName="beta2-section"
                  renderItem={(item, i) => {
                    const selectedGradient = getGradientForIndex(i)
                    return (
                    <SmartCard
                      item={item}
                      onUpdate={(field, value) => handleSave(`projects.projectItems.${i}.${field}`, value, false)}
                      onDelete={() => removeItem('projects', i)}
                      className="h-full w-full shadow-lg overflow-hidden rounded-2xl"
                    >
                      {/* Render based on text variant - Match regular projects section exactly */}
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
                        <div className="relative h-full group/bento">
                          {/* Icon Editor - floating on top in edit mode */}
                          {isEditMode && (
                            <div className="absolute top-2 left-2 z-10 opacity-0 group-hover/bento:opacity-100 transition-opacity">
                              <IconSelector
                                currentIcon={typeof item.icon === 'object' ? item.icon : undefined}
                                onIconSelect={(newIcon) => {
                                  handleSave(`projects.projectItems.${i}.icon`, newIcon)
                                }}
                                className="text-muted-foreground"
                              />
                            </div>
                          )}
                          {!isEditMode ? (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                              <BentoGridItem
                              className="h-full"
                              icon={typeof item.icon === 'object' ? renderIcon(item.icon, "h-4 w-4 text-muted-foreground") : (contentIconMap[item.icon] || contentIconMap.Lightbulb)}
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
                          ) : (
                            <BentoGridItem
                              className="h-full"
                              icon={typeof item.icon === 'object' ? renderIcon(item.icon, "h-4 w-4 text-muted-foreground") : (contentIconMap[item.icon] || contentIconMap.Lightbulb)}
                              title={item.title}
                              description={item.description}
                            />
                          )}
                        </div>
                      )}
                    </SmartCard>
                    )
                  }}
                />
              )
            })()
          ) : (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No beta2 projects added yet</p>
                <GlowingButton
                  onClick={() => {
                    addItem('projects', {
                      title: 'New Project',
                      description: 'Project description',
                      icon: 'IconBrandGithub',
                      link: '#',
                      viewMode: 'text',
                      textVariant: 'detailed',
                      images: []
                    })
                  }}
                >
                  Add Your First Beta2 Project
                </GlowingButton>
              </div>
            </div>
          )}
        </Section>
        </EditableSection>
      ) : null,

    /* 4. Skills (unchanged) ---------------------------------------- */
    skills:
      sectionVisibility.skills && (isEditMode || hasContent(data.skills)) ? (
        <EditableSection
          onAddItem={() => {
            // Add a new skill category
            const newCategory = {
              categoryName: 'New Category',
              skills: [{ name: 'New Skill', level: 3 }]
            }
            setData(prev => ({
              ...prev,
              skills: {
                ...prev.skills,
                skillCategories: [...(prev.skills.skillCategories || []), newCategory]
              }
            }))
          }}
          sectionTitle="Skills"
          onMoveUp={() => moveSection('skills', 'up')}
          onMoveDown={() => moveSection('skills', 'down')}
          showMoveButtons={true}
          showAddButton={true}
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
            />
          </Section>
        </EditableSection>
      ) : null,

    /* [REMOVED education_old - using new education SmartCard version] */

    /* 5. Education (SmartCard Version) ----------------------------- */
    education:
      sectionVisibility.education && (isEditMode || data.education?.educationItems?.length) ? (
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
            fullWidth={true}
          >
          {/* Smart Sizing Controls */}
          {isEditMode && (
            <div className="flex justify-end mb-8 mt-2">
              <SectionLayoutSettings
                sectionKey="education"
                sectionTitle={data.education.sectionTitle}
                currentConfig={data.education.layoutConfig || { layoutType: 'horizontal-carousel', autoSizing: true, shape: 'wide' }}
                itemCount={data.education.educationItems?.length || 0}
                onConfigChange={(config) => handleSave("education.layoutConfig", config)}
              />
            </div>
          )}
            <DraggableCardTimelineV2
              items={data.education.educationItems}
              layoutConfig={data.education.layoutConfig}
              renderSmartCard={(educationItem, index, position) => {
                const selectedGradient = getGradientForIndex(index)
                
                return (
                  <SmartCard
                    item={{
                      _key: `education-v2-${index}`,
                      title: educationItem.institution,
                      description: educationItem.degree,
                      viewMode: 'education' as const,
                      textVariant: 'detailed' as const,
                      images: educationItem.imageUrl ? [educationItem.imageUrl] : undefined,
                      icon: educationItem.icon || { type: 'library' as const, value: 'GraduationCap' },
                      // Map education-specific fields for the new education display mode
                      institution: educationItem.institution,
                      degree: educationItem.degree,
                      years: educationItem.years,
                      imageUrl: educationItem.imageUrl,
                      imageAlt: educationItem.imageAlt,
                      imageTransform: educationItem.imageTransform,
                      relevantCoursework: educationItem.relevantCoursework || [],
                      honors: educationItem.honors || [],
                      gpa: educationItem.gpa,
                      minors: educationItem.minors || [],
                      exchangePrograms: educationItem.exchangePrograms || [],
                      // Timeline position for image positioning
                      timelinePosition: position,
                    }}
                    onUpdate={(field, value) => {
                      // Handle SmartCard field updates - map back to education fields
                      if (field === 'title' || field === 'institution') {
                        handleSave(`education.educationItems.${index}.institution`, value, false)
                      } else if (field === 'description') {
                        handleSave(`education.educationItems.${index}.description`, value, false)
                      } else if (field === 'degree') {
                        handleSave(`education.educationItems.${index}.degree`, value, false)
                      } else if (field === 'years') {
                        handleSave(`education.educationItems.${index}.years`, value, false)
                      } else if (field === 'relevantCoursework') {
                        handleSave(`education.educationItems.${index}.relevantCoursework`, value, false)
                      } else if (field === 'honors') {
                        handleSave(`education.educationItems.${index}.honors`, value, false)
                      } else if (field === 'gpa') {
                        handleSave(`education.educationItems.${index}.gpa`, value, false)
                      } else if (field === 'minors') {
                        handleSave(`education.educationItems.${index}.minors`, value, false)
                      } else if (field === 'exchangePrograms') {
                        handleSave(`education.educationItems.${index}.exchangePrograms`, value, false)
                      } else if (field === 'imageUrl') {
                        handleSave(`education.educationItems.${index}.imageUrl`, value, false)
                      } else if (field === 'imageAlt') {
                        handleSave(`education.educationItems.${index}.imageAlt`, value, false)
                      } else if (field === 'imageTransform') {
                        handleSave(`education.educationItems.${index}.imageTransform`, value, false)
                      }
                    }}
                    onDelete={() => removeItem('education', index)}
                    onIconClick={() => {
                      console.log('SmartCard onIconClick triggered for education item', index)
                    }}
                    className="h-full w-full shadow-lg overflow-hidden rounded-2xl"
                  >
                    {/* SmartCard will render its own education display mode content */}
                    <div></div>
                  </SmartCard>
                )
              }}
              onReorder={(newItems, newPositions) => {
                // Save the reordered items (positions handled internally by component)
                handleSave("education.educationItems", newItems, false)
              }}
              keyExtractor={(item, index) => `education-v2-${index}-${item.institution || 'item'}`}
              getYearFromItem={(item) => item.years}
              getIconFromItem={(item) => {
                // Always use GraduationCap for education timeline circles
                const iconData = { type: 'library' as const, value: 'GraduationCap' }
                return renderIcon(iconData, "h-5 w-5 text-accent-foreground")
              }}
              onAddItem={() => {
                // Check if we're at the maximum limit
                if (data.education?.educationItems?.length >= 12) {
                  console.log('Cannot add more education items: maximum limit of 12 reached')
                  return
                }
                
                // Determine which side the new item should go on (opposite of last item)
                const lastIndex = (data.education?.educationItems?.length || 1) - 1
                const lastItemIsOnLeft = lastIndex % 2 === 0
                const newItemShouldBeOnRight = lastItemIsOnLeft
                
                console.log(`Adding new education item. Last item (index ${lastIndex}) is on ${lastItemIsOnLeft ? 'left' : 'right'}, new item will be on ${newItemShouldBeOnRight ? 'right' : 'left'}`)
                
                // Add new education item with default values
                addItem('education', {
                  institution: 'New Institution',
                  degree: 'New Degree',
                  years: new Date().getFullYear().toString(),
                  description: 'Description of education',
                  icon: { type: 'library' as const, value: 'GraduationCap' }
                })
              }}
              maxItems={12}
            />
          </Section>
        </EditableSection>
      ) : null,

    /* 6. Testimonials (carousel) ----------------------------------- */
    testimonials:
      sectionVisibility.testimonials && (isEditMode || data.testimonials.testimonialItems.length) ? (
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
          {data.testimonials.testimonialItems.length ? (
          <DraggableCardCarousel
            items={data.testimonials.testimonialItems}
            onReorder={(newItems) => reorderItems('testimonials', newItems)}
            keyExtractor={(item, index) => `testimonial-${index}-${item.name || item.title}`}
            itemClassName="basis-full md:basis-1/2 lg:basis-1/3"
            renderItem={(item, i) => (
              <TestimonialCard
                item={item}
                onSave={(field, v) => handleSave(`testimonials.testimonialItems.${i}.${field}`, v)}
                onDelete={() => removeItem('testimonials', i)}
              />
            )}
          />
          ) : (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No testimonials added yet</p>
                <GlowingButton
                  onClick={() => {
                    addItem('testimonials', {
                      name: 'Client Name',
                      role: 'Client Role',
                      company: 'Company Name',
                      content: 'Testimonial content here',
                      avatar: '',
                      rating: 5,
                      icon: 'IconStar',
                      viewMode: 'text',
                      textVariant: 'detailed',
                      images: []
                    })
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  Add Your First Testimonial
                </GlowingButton>
              </div>
            </div>
          )}
        </Section>
        </EditableSection>
      ) : null,

    /* 7. Achievements (carousel) --------------------------------------- */
    achievements:
      sectionVisibility.achievements && (isEditMode || data.achievements?.achievementItems?.length) ? (
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
          {/* Smart Sizing Controls */}
          {isEditMode && (
            <div className="flex justify-end mb-8 mt-2">
              <SectionLayoutSettings
                sectionKey="achievements"
                sectionTitle={data.achievements?.sectionTitle || "Achievements"}
                currentConfig={data.achievements?.layoutConfig || { layoutType: 'horizontal-carousel', autoSizing: true, manualSize: 'medium', shape: 'wide', height: 'standard' }}
                itemCount={data.achievements?.achievementItems?.length || 0}
                onConfigChange={(config) => handleSave("achievements.layoutConfig", config)}
              />
            </div>
          )}
          {data.achievements?.achievementItems?.length ? (
          (() => {
            const layoutConfig = data.achievements?.layoutConfig || { layoutType: 'horizontal-carousel', autoSizing: true, manualSize: 'medium', shape: 'wide', height: 'standard' }
            const { classes: cardClasses } = generateCardClasses(
              layoutConfig,
              data.achievements?.achievementItems?.length || 0,
              'achievements'
            )
            
            return (
              <DraggableCardCarousel
                items={data.achievements.achievementItems}
                onReorder={(newItems) => reorderItems('achievements', newItems)}
                keyExtractor={(item, index) => `achievement-${index}-${item.title}`}
                itemClassName={cardClasses}
                renderItem={(item, i) => {
              const selectedGradient = getGradientForIndex(i)
              return (
              <SmartCard
                item={item}
                onUpdate={(field, value) => handleSave(`achievements.achievementItems.${i}.${field}`, value, false)}
                onDelete={() => removeItem('achievements', i)}
                className={cn(
                  "h-full w-full shadow-lg overflow-hidden rounded-2xl",
                  item.viewMode === 'images' ? "aspect-[4/3]" : "aspect-[5/3]"
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
                  <div className="relative h-full group/bento">
                    <BentoGridItem
                      className="h-full"
                      icon={item.icon ? renderIcon(item.icon, "h-6 w-6 text-muted-foreground") : <Briefcase className="h-6 w-6 text-muted-foreground" />}
                      iconData={typeof item.icon === 'object' ? item.icon : undefined}
                      onIconUpdate={(newIcon) => {
                        handleSave(`achievements.achievementItems.${i}.icon`, newIcon)
                      }}
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
                  </div>
                )}
              </SmartCard>
              )
            }}
          />
            )
          })()
          ) : (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No achievements added yet</p>
                <GlowingButton
                  onClick={() => {
                    addItem('achievements', {
                      title: 'New Achievement',
                      description: 'Achievement description',
                      year: '2024',
                      icon: 'IconAward',
                      viewMode: 'text',
                      textVariant: 'detailed',
                      images: []
                    })
                  }}
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                >
                  Add Your First Achievement
                </GlowingButton>
              </div>
            </div>
          )}
        </Section>
        </EditableSection>
      ) : null,

    /* 8. Certifications (carousel) ------------------------------------- */
    certifications:
      sectionVisibility.certifications && (isEditMode || data.certifications?.certificationItems?.length) ? (
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
          {/* Smart Sizing Controls */}
          {isEditMode && (
            <div className="flex justify-end mb-8 mt-2">
              <SectionLayoutSettings
                sectionKey="certifications"
                sectionTitle={data.certifications?.sectionTitle || "Certifications"}
                currentConfig={data.certifications?.layoutConfig || { layoutType: 'horizontal-carousel', autoSizing: true, manualSize: 'medium', shape: 'wide', height: 'standard' }}
                itemCount={data.certifications?.certificationItems?.length || 0}
                onConfigChange={(config) => handleSave("certifications.layoutConfig", config)}
              />
            </div>
          )}
          {data.certifications?.certificationItems?.length ? (
          (() => {
            const layoutConfig = data.certifications?.layoutConfig || { layoutType: 'horizontal-carousel', autoSizing: true, manualSize: 'medium', shape: 'wide', height: 'standard' }
            const { classes: cardClasses } = generateCardClasses(
              layoutConfig,
              data.certifications?.certificationItems?.length || 0,
              'certifications'
            )
            
            return (
              <DraggableCardCarousel
                items={data.certifications.certificationItems}
            onReorder={(newItems) => reorderItems('certifications', newItems)}
            keyExtractor={(item, index) => `certification-${index}-${item.title}`}
            itemClassName={cardClasses}
            renderItem={(item, i) => {
              const selectedGradient = getGradientForIndex(i)
              return (
              <SmartCard
                item={item}
                onUpdate={(field, value) => handleSave(`certifications.certificationItems.${i}.${field}`, value, false)}
                onDelete={() => removeItem('certifications', i)}
                className={cn(
                  "h-full w-full shadow-lg overflow-hidden rounded-2xl",
                  item.viewMode === 'images' ? "aspect-[4/3]" : "aspect-[5/3]"
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
                    icon={typeof item.icon === 'object' ? renderIcon(item.icon, "h-4 w-4 text-muted-foreground") : (contentIconMap[item.icon] || contentIconMap.Lightbulb)}
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
            )
          })()          
          ) : (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No certifications added yet</p>
                <GlowingButton
                  onClick={() => {
                    addItem('certifications', {
                      title: 'New Certification',
                      issuingBody: 'Issuing Organization',
                      year: '2024',
                      icon: 'IconCertificate',
                      viewMode: 'text',
                      textVariant: 'detailed',
                      images: []
                    })
                  }}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                >
                  Add Your First Certification
                </GlowingButton>
              </div>
            </div>
          )}
        </Section>
        </EditableSection>
      ) : null,

    /* 9. Volunteer (carousel) ------------------------------------------ */
    volunteer:
      sectionVisibility.volunteer && (isEditMode || data.volunteer?.volunteerItems?.length) ? (
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
          {data.volunteer?.volunteerItems?.length ? (
          <DraggableCardCarousel
            items={data.volunteer.volunteerItems}
            onReorder={(newItems) => reorderItems('volunteer', newItems)}
            keyExtractor={(item, index) => `volunteer-${index}-${item.title}`}
            itemClassName="basis-full md:basis-1/2 lg:basis-1/3"
            renderItem={(item, i) => {
              const selectedGradient = getGradientForIndex(i)
              return (
              <SmartCard
                item={item}
                onUpdate={(field, value) => handleSave(`volunteer.volunteerItems.${i}.${field}`, value, false)}
                onDelete={() => removeItem('volunteer', i)}
                className={cn(
                  "h-full w-full shadow-lg overflow-hidden rounded-2xl",
                  item.viewMode === 'images' ? "aspect-[4/3]" : "aspect-[5/3]"
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
                    icon={typeof item.icon === 'object' ? renderIcon(item.icon, "h-4 w-4 text-muted-foreground") : (contentIconMap[item.icon] || contentIconMap.Lightbulb)}
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
          ) : (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No volunteer experience added yet</p>
                <GlowingButton
                  onClick={() => {
                    addItem('volunteer', {
                      role: 'Volunteer Role',
                      organization: 'Organization Name',
                      duration: '2024 - Present',
                      description: 'Volunteer work description',
                      icon: 'IconHeart',
                      viewMode: 'text',
                      textVariant: 'detailed',
                      images: []
                    })
                  }}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                >
                  Add Your First Volunteer Experience
                </GlowingButton>
              </div>
            </div>
          )}
        </Section>
        </EditableSection>
      ) : null,

    /* 10. Hobbies (carousel with HobbyCard) -------------------------------------------- */
    hobbies:
      sectionVisibility.hobbies && (isEditMode || data.hobbies.hobbyItems.length) ? (
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
            <DraggableCardCarousel
              items={data.hobbies.hobbyItems}
              onReorder={(newItems) => reorderItems('hobbies', newItems)}
              keyExtractor={(item, index) => `hobby-${index}-${item.title}`}
              itemClassName="basis-full md:basis-1/2 lg:basis-1/3"
              renderItem={(item, i) => {
                const selectedGradient = getGradientForIndex(i)

                return (
                  <SmartCard
                    item={item}
                    onUpdate={(field, value) => handleSave(`hobbies.hobbyItems.${i}.${field}`, value, false)}
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
                    addItem('hobbies', {
                      title: 'New Hobby',
                      description: 'Describe your hobby',
                      icon: 'IconStar',
                      viewMode: 'text',
                      textVariant: 'detailed',
                      images: []
                    })
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
      sectionVisibility.courses && (isEditMode || data.courses?.courseItems?.length) ? (
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
          {data.courses?.courseItems?.length ? (
          <DraggableCardCarousel
            items={data.courses.courseItems}
            onReorder={(newItems) => reorderItems('courses', newItems)}
            keyExtractor={(item, index) => `course-${index}-${item.title}`}
            itemClassName="basis-full md:basis-1/2 lg:basis-1/3"
            renderItem={(item, i) => {
              const selectedGradient = getGradientForIndex(i)
              return (
              <SmartCard
                item={item}
                onUpdate={(field, value) => handleSave(`courses.courseItems.${i}.${field}`, value, false)}
                onDelete={() => removeItem('courses', i)}
                className={cn(
                  "h-full w-full shadow-lg overflow-hidden rounded-2xl",
                  item.viewMode === 'images' ? "aspect-[4/3]" : "aspect-[5/3]"
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
                    icon={typeof item.icon === 'object' ? renderIcon(item.icon, "h-4 w-4 text-muted-foreground") : (contentIconMap[item.icon] || contentIconMap.Lightbulb)}
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
          ) : (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No courses added yet</p>
                <GlowingButton
                  onClick={() => {
                    addItem('courses', {
                      title: 'New Course',
                      institution: 'Institution Name',
                      year: '2024',
                      icon: 'IconGraduationCap',
                      viewMode: 'text',
                      textVariant: 'detailed',
                      images: []
                    })
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  Add Your First Course
                </GlowingButton>
              </div>
            </div>
          )}
        </Section>
        </EditableSection>
      ) : null,

    /* 12. Publications (carousel) ---------------------------------- */
    publications:
      sectionVisibility.publications && (isEditMode || data.publications?.publicationItems?.length) ? (
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
          {data.publications?.publicationItems?.length ? (
          <DraggableCardCarousel
            items={data.publications.publicationItems}
            onReorder={(newItems) => reorderItems('publications', newItems)}
            keyExtractor={(item, index) => `publication-${index}-${item.title}`}
            itemClassName="basis-full md:basis-1/2 lg:basis-1/3"
            renderItem={(item, i) => {
              const selectedGradient = getGradientForIndex(i)
              return (
              <SmartCard
                item={item}
                onUpdate={(field, value) => handleSave(`publications.publicationItems.${i}.${field}`, value, false)}
                onDelete={() => removeItem('publications', i)}
                className={cn(
                  "h-full w-full shadow-lg overflow-hidden rounded-2xl",
                  item.viewMode === 'images' ? "aspect-[4/3]" : "aspect-[5/3]"
                )}
              >
                {/* Render based on text variant */}
                {item.textVariant === 'simple' ? (
                  !isEditMode ? (
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
                    <HobbyCard
                      title={item.title}
                      onSave={(v) => handleSave(`publications.publicationItems.${i}.title`, v)}
                      onDelete={() => removeItem('publications', i)}
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, ${selectedGradient.from}33, ${selectedGradient.to}66)`,
                      }}
                    />
                  )
                ) : (
                  !isEditMode ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                      <BentoGridItem
                      className="h-full"
                      icon={typeof item.icon === 'object' ? renderIcon(item.icon, "h-4 w-4 text-muted-foreground") : (contentIconMap[item.icon] || contentIconMap.Lightbulb)}
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
                  ) : (
                    <BentoGridItem
                      className="h-full"
                      icon={typeof item.icon === 'object' ? renderIcon(item.icon, "h-4 w-4 text-muted-foreground") : (contentIconMap[item.icon] || contentIconMap.Lightbulb)}
                      title={item.title}
                      description={`${item.journal}${item.year ? `, ${item.year}` : ""}`}
                    />
                  )
                )}
              </SmartCard>
              )
            }}
          />
          ) : (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No publications added yet</p>
                <GlowingButton
                  onClick={() => {
                    addItem('publications', {
                      title: 'New Publication',
                      journal: 'Journal Name',
                      year: '2024',
                      link: '',
                      icon: 'IconBook',
                      viewMode: 'text',
                      textVariant: 'detailed',
                      images: []
                    })
                  }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  Add Your First Publication
                </GlowingButton>
              </div>
            </div>
          )}
        </Section>
        </EditableSection>
      ) : null,

    /* 13. Speaking engagements (carousel) -------------------------- */
    speakingEngagements:
      sectionVisibility.speakingEngagements && (isEditMode || data.speakingEngagements?.engagementItems?.length) ? (
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
          {data.speakingEngagements.engagementItems.length ? (
          <DraggableCardCarousel
            items={data.speakingEngagements.engagementItems}
            onReorder={(newItems) => reorderItems('speakingEngagements', newItems)}
            keyExtractor={(item, index) => `engagement-${index}-${item.title}`}
            itemClassName="basis-full md:basis-1/2 lg:basis-1/3"
            renderItem={(item, i) => {
              const selectedGradient = getGradientForIndex(i)
              return (
              <SmartCard
                item={item}
                onUpdate={(field, value) => handleSave(`speakingEngagements.engagementItems.${i}.${field}`, value, false)}
                onDelete={() => removeItem('speakingEngagements', i)}
                className={cn(
                  "h-full w-full shadow-lg overflow-hidden rounded-2xl",
                  item.viewMode === 'images' ? "aspect-[4/3]" : "aspect-[5/3]"
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
                    icon={typeof item.icon === 'object' ? renderIcon(item.icon, "h-4 w-4 text-muted-foreground") : (contentIconMap[item.icon] || contentIconMap.Lightbulb)}
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
          ) : (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No speaking engagements added yet</p>
                <GlowingButton
                  onClick={() => {
                    addItem('speakingEngagements', {
                      title: 'New Speaking Engagement',
                      event: 'Event Name',
                      location: 'Location',
                      year: '2024',
                      icon: 'IconMicrophone',
                      viewMode: 'text',
                      textVariant: 'detailed',
                      images: []
                    })
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Add Your First Speaking Engagement
                </GlowingButton>
              </div>
            </div>
          )}
        </Section>
        </EditableSection>
      ) : null,

    /* 14. Memberships (carousel) ----------------------------------- */
    memberships:
      sectionVisibility.memberships && (isEditMode || data.memberships.membershipItems.length) ? (
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
          {data.memberships.membershipItems.length ? (
          <DraggableCardCarousel
            items={data.memberships.membershipItems}
            onReorder={(newItems) => reorderItems('memberships', newItems)}
            keyExtractor={(item, index) => `membership-${index}-${item.title}`}
            itemClassName="basis-1/3"
            renderItem={(item, i) => {
              const selectedGradient = getGradientForIndex(i)

              return (
                <SmartCard
                  item={item}
                  onUpdate={(field, value) => handleSave(`memberships.membershipItems.${i}.${field}`, value, false)}
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
          ) : (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No memberships added yet</p>
                <GlowingButton
                  onClick={() => {
                    addItem('memberships', {
                      organization: 'Organization Name',
                      role: 'Member Role',
                      year: '2024',
                      icon: 'IconUsers',
                      viewMode: 'text',
                      textVariant: 'detailed',
                      images: []
                    })
                  }}
                  className="bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700"
                >
                  Add Your First Membership
                </GlowingButton>
              </div>
            </div>
          )}
        </Section>
        </EditableSection>
      ) : null,

    /* 15. Languages (chips) --------------------------------------- */
    languages:
      sectionVisibility.languages && data.languages?.sectionTitle ? (
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
      <SidebarNav 
        navItems={navItems} 
        onMoveSection={moveSection}
      />
      <EditModeToggle />
      <StylePanel />

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
        onSaveProfessionalLink={(index, field, value) => handleSave(`contact.professionalLinks.${index}.${field}`, value)}
      />
    </main>
  )
}
