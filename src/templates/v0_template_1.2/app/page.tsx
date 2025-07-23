"use client"

import type React from "react"

import { useMemo, useState, useEffect } from "react"
import { toast } from "sonner"

import { initialData, contentIconMap, type PortfolioData } from "@/lib/data"
import { fetchLatestCVData } from "@/lib/cv-data-adapter"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme/theme-provider"
import { useSettings } from "@/components/settings/settings-provider"

/* ── UI primitives ──────────────────────────────────────────────── */
import { VerticalTimeline } from "@/components/ui/vertical-timeline"
import { BentoGridItem } from "@/components/ui/bento-grid-item"
import { EditableText } from "@/components/ui/editable-text"
import { FloatingNav } from "@/components/ui/floating-nav"
import { GlowingButton } from "@/components/ui/glowing-button"
import { FlipText } from "@/components/ui/flip-text"
import { CodeBlock } from "@/components/ui/code-block"

/* ── Custom components & layouts ────────────────────────────────── */
import { Section } from "@/components/section"
import { CardCarousel } from "@/components/card-carousel"
import { HeroSection } from "@/components/hero-section"
import { SkillsSection } from "@/components/skills-section"
import { ContactSection } from "@/components/contact-section"
import { AccordionLayout } from "@/components/layouts/accordion-layout"
import { ListLayout } from "@/components/layouts/list-layout"
import { HobbyCard } from "@/components/hobby-card"
import { MembershipCard } from "@/components/membership-card"
import { TestimonialCard } from "@/components/testimonial-card"
import { ThreeDImageCard } from "@/components/three-d-image-card"
import { EmbedLayout } from "@/components/layouts/embed-layout"
import { GitHubCardLayout } from "@/components/layouts/github-card-layout"
import { CodeBlockLayout } from "@/components/layouts/code-block-layout"
import { SettingsPanel } from "@/components/settings/settings-panel"
import { ImageCarouselLayout } from "@/components/layouts/image-carousel-layout"

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
  const { itemViewModes } = useSettings()

  /* Load CV Data */ /* ------------------------------------------- */
  useEffect(() => {
    const loadCVData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const sessionId = getSessionId()

        if (sessionId) {
          console.log("🔄 Loading CV data from API...")
          const cvData = await fetchLatestCVData(sessionId)
          setData(cvData)
          console.log("✅ CV data loaded successfully")
          toast.success("Portfolio loaded from your CV data!")
        } else {
          console.log("⚠️ No session ID found, using demo data")
          toast.info("Showing demo portfolio - connect your CV for personalized content")
        }
      } catch (err) {
        console.error("❌ Failed to load CV data:", err)
        setError(err instanceof Error ? err.message : "Failed to load CV data")
        toast.error("Failed to load CV data, showing demo content")
      } finally {
        setIsLoading(false)
      }
    }

    loadCVData()
  }, [])

  /* Listen for Theme Changes and Content Updates from Parent */ /* ------------------- */
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return

      if (event.data?.type === "CHANGE_THEME") {
        const themeId = event.data.themeId
        const themeMap: Record<string, number> = {
          "cream-gold": 0,
          "midnight-blush": 1,
          evergreen: 2,
          interstellar: 3,
          "serene-sky": 4,
          "crimson-night": 5,
        }
        const themeIndex = themeMap[themeId]
        if (themeIndex !== undefined && themes[themeIndex]) {
          setTheme(themes[themeIndex].name)
          console.log("🎨 Theme changed to:", themes[themeIndex].name)
        }
      } else if (event.data?.type === "TOGGLE_PHOTO") {
        setShowPhoto(event.data.show)
        console.log("📸 Profile photo visibility:", event.data.show)
      } else if (event.data?.type === "TOGGLE_SECTION") {
        const { section, visible } = event.data
        setSectionVisibility((prev) => ({ ...prev, [section]: visible }))
        console.log("👁️ Section visibility updated:", section, visible)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [setTheme, themes])

  /* Helper function to get session ID */ /* -------------------- */
  const getSessionId = (): string | null => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const sessionFromUrl = urlParams.get("session")
      if (sessionFromUrl) return sessionFromUrl

      const sessionFromStorage = localStorage.getItem("sessionId")
      if (sessionFromStorage) return sessionFromStorage

      if (process.env.NODE_ENV === "development") {
        return "dev-session"
      }
    }
    return null
  }

  const [sectionVisibility, setSectionVisibility] = useState<Record<SectionKey, boolean>>(() => {
    const visibility: Partial<Record<SectionKey, boolean>> = {}
    for (const key of initialSectionKeys) visibility[key] = hasContent(data[key])
    return visibility as Record<SectionKey, boolean>
  })

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

  const sectionsForPanel = useMemo(() => {
    return orderedSections
      .map((key) => {
        const sectionData = (data as any)[key]
        const items = sectionData
          ? Object.keys(sectionData).find((k) => k.endsWith("Items"))
            ? sectionData[Object.keys(sectionData).find((k) => k.endsWith("Items"))!]
            : []
          : []

        return {
          key,
          title: formatLabel(sectionData?.sectionTitle ?? key),
          items: Array.isArray(items) ? items : [],
        }
      })
      .filter((s) => s.items.length > 0)
  }, [orderedSections, data])

  /* Generic save helper */ /* ------------------------------------- */
  const handleSave = (path: string, value: any) => {
    setData((prev) => {
      const keys = path.split(".")
      const next = structuredClone(prev) as any
      let cur = next
      for (let i = 0; i < keys.length - 1; i++) {
        if (cur[keys[i]] === undefined) cur[keys[i]] = {}
        cur = cur[keys[i]]
      }
      cur[keys.at(-1)!] = value
      toast.success("Content saved!")
      return next
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
    })) ?? []

  /* Section components map */ /* --------------------------------- */
  const sectionComponents: Record<SectionKey, React.ReactNode> = {
    summary:
      sectionVisibility.summary && data.summary.summaryText ? (
        <Section
          id="summary"
          title={data.summary.sectionTitle}
          onSaveTitle={(v) => handleSave("summary.sectionTitle", v)}
          isVisible
        >
          <div className="min-h-[150px] flex items-center justify-center max-w-4xl mx-auto">
            <FlipText
              className="text-lg sm:text-2xl md:text-3xl font-serif font-light text-foreground/90 leading-relaxed"
              duration={0.3}
              delayMultiple={0.03}
            >
              {data.summary.summaryText ?? ""}
            </FlipText>
          </div>
        </Section>
      ) : null,
    experience:
      sectionVisibility.experience && data.experience.experienceItems.length ? (
        <Section
          id="experience"
          title={data.experience.sectionTitle}
          onSaveTitle={(v) => handleSave("experience.sectionTitle", v)}
          isVisible
          className="bg-secondary/30"
          fullWidth={Object.values(itemViewModes.experience ?? {}).includes("image-carousel")}
        >
          {Object.values(itemViewModes.experience ?? {}).includes("image-carousel") ? (
            <ImageCarouselLayout
              items={data.experience.experienceItems}
              onSave={(key, field, value) => {
                const itemIndex = data.experience.experienceItems.findIndex((it) => it._key === key)
                if (itemIndex > -1) {
                  handleSave(`experience.experienceItems.${itemIndex}.${field}`, value)
                }
              }}
            />
          ) : (
            <CardCarousel
              items={data.experience.experienceItems}
              itemClassName="basis-full"
              renderItem={(item, i) => {
                const mode = itemViewModes.experience?.[item._key] || "text"
                switch (mode) {
                  case "image":
                    return (
                      <div className="flex justify-center">
                        <ThreeDImageCard
                          title={item.title}
                          subtitle={`${item.company} | ${item.startDate} - ${item.endDate}`}
                          description={item.description}
                          imageUrl={item.imageUrl || "/placeholder.svg"}
                          onSaveTitle={(v) => handleSave(`experience.experienceItems.${i}.title`, v)}
                          onSaveSubtitle={(v) => {
                            const [company = "", dates = ""] = v.split(" | ")
                            const [startDate = "", endDate = ""] = dates.split(" - ")
                            handleSave(`experience.experienceItems.${i}.company`, company.trim())
                            handleSave(`experience.experienceItems.${i}.startDate`, startDate.trim())
                            handleSave(`experience.experienceItems.${i}.endDate`, endDate.trim())
                          }}
                          onSaveDescription={(v) => handleSave(`experience.experienceItems.${i}.description`, v)}
                        />
                      </div>
                    )
                  case "code":
                    if (!item.code) return <div className="text-center p-8">No code snippet for this item.</div>
                    return <CodeBlockLayout items={[{ ...item, language: "tsx", filename: `${item.company}.tsx` }]} />
                  case "text":
                  default:
                    return (
                      <AccordionLayout
                        items={[item]}
                        onSave={(idx, field, v) => handleSave(`experience.experienceItems.${i}.${field}`, v)}
                      />
                    )
                }
              }}
            />
          )}
        </Section>
      ) : null,
    projects:
      sectionVisibility.projects && data.projects.projectItems.length > 0 ? (
        <Section
          id="projects"
          title={data.projects.sectionTitle}
          onSaveTitle={(v) => handleSave("projects.sectionTitle", v)}
          isVisible
          fullWidth
          className={Object.values(itemViewModes.projects ?? {}).includes("image-carousel") ? "" : "bg-card/50"}
        >
          {Object.values(itemViewModes.projects ?? {}).includes("image-carousel") ? (
            <ImageCarouselLayout
              items={data.projects.projectItems.map((item) => ({ ...item, linkUrl: item.link }))}
              onSave={(key, field, value) => {
                const itemIndex = data.projects.projectItems.findIndex((it) => it._key === key)
                if (itemIndex > -1) {
                  handleSave(`projects.projectItems.${itemIndex}.${field}`, value)
                }
              }}
            />
          ) : (
            <CardCarousel
              items={data.projects.projectItems}
              itemClassName="basis-full md:basis-1/2"
              renderItem={(item, i) => {
                const mode = itemViewModes.projects?.[item._key] || "text"
                switch (mode) {
                  case "code":
                    if (!item.code) return <div className="text-center p-8">No code snippet for this item.</div>
                    return (
                      <CodeBlock
                        language="tsx"
                        code={item.code}
                        filename={`${item.title.replace(/\s/g, "-")}.tsx`}
                        className="h-full"
                      />
                    )
                  case "image":
                    return (
                      <div className="flex justify-center">
                        <ThreeDImageCard
                          title={item.title}
                          description={item.description}
                          imageUrl={item.imageUrl || "/placeholder.svg"}
                          linkUrl={item.link}
                          onSaveTitle={(v) => handleSave(`projects.projectItems.${i}.title`, v)}
                          onSaveDescription={(v) => handleSave(`projects.projectItems.${i}.description`, v)}
                        />
                      </div>
                    )
                  case "url":
                    if (!item.embedUrl) return <div className="text-center p-8">No embed URL for this item.</div>
                    return (
                      <EmbedLayout
                        items={[{ ...item, _key: i }]}
                        onSave={(key, field, value) => handleSave(`projects.projectItems.${i}.${field}`, value)}
                      />
                    )
                  case "github":
                    if (!item.githubUrl) return <div className="text-center p-8">No GitHub URL for this item.</div>
                    return (
                      <GitHubCardLayout
                        items={[{ ...item, _key: i, url: item.githubUrl }]}
                        onSave={(key, field, value) => handleSave(`projects.projectItems.${i}.${field}`, value)}
                      />
                    )
                  case "text":
                  default:
                    return (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                        <BentoGridItem
                          className={cn("h-full shadow-lg", cardBgClasses[i % cardBgClasses.length])}
                          icon={contentIconMap[item.icon]}
                          title={
                            <EditableText
                              initialValue={item.title}
                              onSave={(v) => handleSave(`projects.projectItems.${i}.title`, v)}
                            />
                          }
                          description={
                            <EditableText
                              textarea
                              initialValue={item.description}
                              onSave={(v) => handleSave(`projects.projectItems.${i}.description`, v)}
                            />
                          }
                        />
                      </a>
                    )
                }
              }}
            />
          )}
        </Section>
      ) : null,
    skills:
      sectionVisibility.skills && hasContent(data.skills) ? (
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
          />
        </Section>
      ) : null,
    education:
      sectionVisibility.education && data.education.educationItems.length ? (
        <Section
          id="education"
          title={data.education.sectionTitle}
          onSaveTitle={(v) => handleSave("education.sectionTitle", v)}
          isVisible
        >
          <VerticalTimeline items={educationTimelineItems} />
        </Section>
      ) : null,
    testimonials:
      sectionVisibility.testimonials && data.testimonials.testimonialItems.length ? (
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
            itemClassName="basis-1/2"
            renderItem={(item, i) => (
              <TestimonialCard
                item={item}
                onSave={(field, v) => handleSave(`testimonials.testimonialItems.${i}.${field}`, v)}
              />
            )}
          />
        </Section>
      ) : null,
    achievements:
      sectionVisibility.achievements && data.achievements.achievementItems.length ? (
        <Section
          id="achievements"
          title={data.achievements.sectionTitle}
          onSaveTitle={(v) => handleSave("achievements.sectionTitle", v)}
          isVisible
        >
          <ListLayout
            items={data.achievements.achievementItems}
            onSave={(i, field, v) => handleSave(`achievements.achievementItems.${i}.${field}`, v)}
            onSaveMulti={(i, v) => {
              const [desc = "", yr = ""] = v.split(",")
              handleSave(`achievements.achievementItems.${i}.description`, desc.trim())
              handleSave(`achievements.achievementItems.${i}.year`, yr.trim())
            }}
          />
        </Section>
      ) : null,
    certifications:
      sectionVisibility.certifications && data.certifications.certificationItems.length ? (
        <Section
          id="certifications"
          title={data.certifications.sectionTitle}
          onSaveTitle={(v) => handleSave("certifications.sectionTitle", v)}
          isVisible
          className="bg-secondary/30"
        >
          <ListLayout
            items={data.certifications.certificationItems.map((it) => ({
              ...it,
              description: it.issuingBody,
            }))}
            onSave={(i, field, v) => handleSave(`certifications.certificationItems.${i}.${field}`, v)}
            onSaveMulti={(i, v) => {
              const [body = "", yr = ""] = v.split(",")
              handleSave(`certifications.certificationItems.${i}.issuingBody`, body.trim())
              handleSave(`certifications.certificationItems.${i}.year`, yr.trim())
            }}
          />
        </Section>
      ) : null,
    volunteer:
      sectionVisibility.volunteer && data.volunteer.volunteerItems.length ? (
        <Section
          id="volunteer"
          title={data.volunteer.sectionTitle}
          onSaveTitle={(v) => handleSave("volunteer.sectionTitle", v)}
          isVisible
          fullWidth
        >
          <CardCarousel
            items={data.volunteer.volunteerItems}
            itemClassName="basis-full md:basis-1/2"
            renderItem={(item, i) => {
              const mode = itemViewModes.volunteer?.[item._key] || "text"
              if (mode === "code" && item.code) {
                return (
                  <CodeBlock
                    language="javascript"
                    code={item.code}
                    filename={`${item.organization.replace(/\s/g, "-")}.js`}
                    className="h-full"
                  />
                )
              }
              return (
                <BentoGridItem
                  className={cn("h-full shadow-lg", cardBgClasses[i % cardBgClasses.length])}
                  icon={contentIconMap[item.icon]}
                  title={
                    <EditableText
                      initialValue={item.role}
                      onSave={(v) => handleSave(`volunteer.volunteerItems.${i}.role`, v)}
                    />
                  }
                  description={
                    <>
                      <p className="font-semibold text-card-foreground text-lg">
                        <EditableText
                          as="span"
                          initialValue={item.organization}
                          onSave={(v) => handleSave(`volunteer.volunteerItems.${i}.organization`, v)}
                        />
                      </p>
                      <EditableText
                        textarea
                        as="p"
                        initialValue={item.description}
                        onSave={(v) => handleSave(`volunteer.volunteerItems.${i}.description`, v)}
                        className="mt-2 text-xl"
                      />
                    </>
                  }
                />
              )
            }}
          />
        </Section>
      ) : null,
    hobbies:
      sectionVisibility.hobbies && data.hobbies.hobbyItems.length > 0 ? (
        <Section
          id="hobbies"
          title={data.hobbies.sectionTitle}
          onSaveTitle={(v) => handleSave("hobbies.sectionTitle", v)}
          isVisible
          className="bg-secondary/30"
          fullWidth
        >
          <CardCarousel
            items={data.hobbies.hobbyItems}
            itemClassName="basis-1/3"
            renderItem={(item, i) => {
              const selectedGradient = getGradientForIndex(i)
              return (
                <HobbyCard
                  title={item.title}
                  onSave={(v) => handleSave(`hobbies.hobbyItems.${i}.title`, v)}
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, ${selectedGradient.from}33, ${selectedGradient.to}66)`,
                  }}
                />
              )
            }}
          />
        </Section>
      ) : null,
    courses:
      sectionVisibility.courses && data.courses.courseItems.length ? (
        <Section
          id="courses"
          title={data.courses.sectionTitle}
          onSaveTitle={(v) => handleSave("courses.sectionTitle", v)}
          isVisible
          fullWidth
        >
          <CardCarousel
            items={data.courses.courseItems}
            itemClassName="basis-1/2"
            renderItem={(item, i) => (
              <BentoGridItem
                className={cn("h-full shadow-lg", cardBgClasses[i % cardBgClasses.length])}
                icon={contentIconMap[item.icon]}
                title={
                  <EditableText
                    initialValue={item.title}
                    onSave={(v) => handleSave(`courses.courseItems.${i}.title`, v)}
                  />
                }
                description={
                  <EditableText
                    as="p"
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
          />
        </Section>
      ) : null,
    publications:
      sectionVisibility.publications && data.publications.publicationItems.length ? (
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
            itemClassName="basis-full md:basis-1/2"
            renderItem={(item, i) => {
              const mode = itemViewModes.publications?.[item._key] || "text"
              if (mode === "code" && item.code) {
                return (
                  <CodeBlock
                    language="markdown"
                    code={item.code}
                    filename={`${item.title.replace(/\s/g, "-")}.md`}
                    className="h-full"
                  />
                )
              }
              return (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                  <BentoGridItem
                    className={cn("h-full shadow-lg", cardBgClasses[i % cardBgClasses.length])}
                    icon={contentIconMap[item.icon]}
                    title={
                      <EditableText
                        initialValue={item.title}
                        onSave={(v) => handleSave(`publications.publicationItems.${i}.title`, v)}
                      />
                    }
                    description={
                      <EditableText
                        as="p"
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
              )
            }}
          />
        </Section>
      ) : null,
    speakingEngagements:
      sectionVisibility.speakingEngagements && data.speakingEngagements.engagementItems.length ? (
        <Section
          id="speakingEngagements"
          title={data.speakingEngagements.sectionTitle}
          onSaveTitle={(v) => handleSave("speakingEngagements.sectionTitle", v)}
          isVisible
          fullWidth
        >
          <CardCarousel
            items={data.speakingEngagements.engagementItems}
            itemClassName="basis-1/2"
            renderItem={(item, i) => (
              <BentoGridItem
                className={cn("h-full shadow-lg", cardBgClasses[i % cardBgClasses.length])}
                icon={contentIconMap[item.icon]}
                title={
                  <EditableText
                    initialValue={item.title}
                    onSave={(v) => handleSave(`speakingEngagements.engagementItems.${i}.title`, v)}
                  />
                }
                description={
                  <EditableText
                    as="p"
                    initialValue={`${item.event} - ${item.location}${item.year ? `, ${item.year}` : ""}`}
                    onSave={(v) => handleSave(`speakingEngagements.engagementItems.${i}.event`, v)}
                  />
                }
              />
            )}
          />
        </Section>
      ) : null,
    memberships:
      sectionVisibility.memberships && data.memberships.membershipItems.length ? (
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
                <MembershipCard
                  organization={item.organization}
                  role={item.role}
                  period={item.period}
                  onSaveOrganization={(v) => handleSave(`memberships.membershipItems.${i}.organization`, v)}
                  onSaveRole={(v) => handleSave(`memberships.membershipItems.${i}.role`, v)}
                  onSavePeriod={(v) => handleSave(`memberships.membershipItems.${i}.period`, v)}
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, ${selectedGradient.from}33, ${selectedGradient.to}66)`,
                  }}
                />
              )
            }}
          />
        </Section>
      ) : null,
    languages:
      sectionVisibility.languages && data.languages.languageItems.length > 0 ? (
        <Section
          id="languages"
          title={data.languages.sectionTitle}
          onSaveTitle={(v) => handleSave("languages.sectionTitle", v)}
          isVisible
        >
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {data.languages.languageItems.map((item, i) => (
              <GlowingButton key={item._key}>
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
            ))}
          </div>
        </Section>
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

  return (
    <main className="bg-background text-foreground antialiased w-full max-w-full overflow-x-hidden">
      <FloatingNav navItems={navItems} maxVisibleItems={6} />
      <SettingsPanel sections={sectionsForPanel} />
      <HeroSection data={data.hero} onSave={(field, v) => handleSave(`hero.${field}`, v)} showPhoto={showPhoto} />
      {orderedSections.map((key) => (
        <div key={key}>{sectionComponents[key]}</div>
      ))}
      <ContactSection
        data={data.contact}
        onSave={(field, v) => handleSave(`contact.${field}`, v)}
        onSaveLocation={(field, v) => handleSave(`contact.location.${field}`, v)}
      />
    </main>
  )
}
