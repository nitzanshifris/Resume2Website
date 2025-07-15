import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconMail,
  IconPhone,
  IconMapPin,
  IconWorld,
  IconBrandLinkedin,
  IconBrandPinterest,
} from "@tabler/icons-react"
import { Users, Medal, Trophy } from "lucide-react"

// A helper to format date ranges
const formatDateRange = (range) => {
  if (!range) return ""
  const start = range.startDate || ""
  const end = range.endDate || (range.isCurrent ? "Present" : "")
  if (start && end) return `${start} — ${end}`
  return start || end
}

// A helper to format locations
const formatLocation = (location) => {
  if (!location) return ""
  return [location.city, location.state, location.country].filter(Boolean).join(", ")
}

const getSkillIcon = (categoryName) => {
  const icons = {
    "Design Software & Tools": IconBrandInstagram,
    "Fashion Design": IconBrandTwitter,
    "Business & Strategy": Users,
    Collaboration: Medal,
    default: Trophy,
  }
  const lowerCategory = categoryName.toLowerCase()
  for (const key in icons) {
    if (lowerCategory.includes(key.toLowerCase().split(" ")[0])) {
      const IconComponent = icons[key]
      // Decoupled icon color from theme: now neutral, and orange on hover.
      return <IconComponent className="w-12 h-12 text-white transition-colors duration-300" />
    }
  }
  const DefaultIcon = icons.default
  return <DefaultIcon className="w-12 h-12 text-white transition-colors duration-300" />
}

const getContactIcon = (platform) => {
  const lowerPlatform = platform?.toLowerCase() || ""
  if (lowerPlatform.includes("linkedin")) return IconBrandLinkedin
  if (lowerPlatform.includes("pinterest")) return IconBrandPinterest
  return IconWorld
}

export const mapCvDataToSections = (cvData) => {
  if (!cvData) return { hero: {}, sections: [] }

  const sections = []

  // Professional Summary
  if (cvData.summary?.summaryText) {
    sections.push({
      id: "professionalSummary",
      type: "paragraph",
      title: cvData.summary.sectionTitle || "Professional Summary",
      data: {
        description: cvData.summary.summaryText,
      },
    })
  }

  // Skills
  const allSkillCategories = [...(cvData.skills?.skillCategories || [])]
  if (cvData.skills?.ungroupedSkills?.length > 0) {
    allSkillCategories.push({
      categoryName: "Additional Skills",
      skills: cvData.skills.ungroupedSkills,
    })
  }

  if (allSkillCategories.length > 0) {
    sections.push({
      id: "skills",
      type: "bento",
      title: cvData.skills.sectionTitle || "Skills",
      data: allSkillCategories.map((category) => ({
        ...category,
        icon: getSkillIcon(category.categoryName),
      })),
    })
  }

  // Experience
  if (cvData.experience?.experienceItems?.length > 0) {
    sections.push({
      id: "experience",
      type: "timeline",
      title: cvData.experience.sectionTitle || "Experience",
      data: cvData.experience.experienceItems.map((item) => ({
        title: item.jobTitle,
        subtitle: `${item.companyName}, ${formatLocation(item.location)}`,
        period: formatDateRange(item.dateRange),
        details: item.responsibilitiesAndAchievements,
      })),
    })
  }

  // Projects
  if (cvData.projects?.projectItems?.length > 0) {
    sections.push({
      id: "projects",
      type: "projects",
      title: cvData.projects.sectionTitle || "Projects",
      data: cvData.projects.projectItems.map((item) => ({
        title: item.title,
        description: item.description,
        link: item.projectUrl || "#",
      })),
    })
  }

  // Education
  if (cvData.education?.educationItems?.length > 0) {
    sections.push({
      id: "education",
      type: "timeline",
      title: cvData.education.sectionTitle || "Education",
      data: cvData.education.educationItems.map((item) => ({
        title: `${item.degree}, ${item.fieldOfStudy}`,
        subtitle: `${item.institution}, ${formatLocation(item.location)}`,
        period: formatDateRange(item.dateRange),
        details: item.honors,
      })),
    })
  }

  // Certifications
  if (cvData.certifications?.certificationItems?.length > 0) {
    sections.push({
      id: "certifications",
      type: "certifications",
      title: cvData.certifications.sectionTitle || "Certifications",
      data: cvData.certifications.certificationItems.map((item) => ({
        title: item.title,
        subtitle: item.issuingOrganization,
        date: item.issueDate,
      })),
    })
  }

  // Publications
  if (cvData.publications?.publications?.length > 0) {
    sections.push({
      id: "publications",
      type: "publications",
      title: cvData.publications.sectionTitle || "Publications",
      data: cvData.publications.publications.map((item) => ({
        title: item.title,
        journal: item.publicationType,
        date: item.publicationDate,
        link: item.publicationUrl || "#",
      })),
    })
  }

  // Speaking Engagements
  if (cvData.speaking?.speakingEngagements?.length > 0) {
    sections.push({
      id: "speakingEngagements",
      type: "timeline",
      title: cvData.speaking.sectionTitle || "Speaking Engagements",
      data: cvData.speaking.speakingEngagements.map((item) => ({
        title: item.topic,
        subtitle: `${item.eventName}, ${item.venue}`,
        period: item.date,
      })),
    })
  }

  // Languages
  if (cvData.languages?.languageItems?.length > 0) {
    sections.push({
      id: "languages",
      type: "languages",
      title: cvData.languages.sectionTitle || "Languages",
      data: cvData.languages.languageItems.map((item) => ({
        name: item.language,
        proficiency: item.proficiency,
      })),
    })
  }

  // Achievements
  if (cvData.achievements?.achievements?.length > 0) {
    sections.push({
      id: "accomplishments",
      type: "accomplishments",
      title: cvData.achievements.sectionTitle || "Key Achievements",
      data: cvData.achievements.achievements,
    })
  }

  // Hobbies
  if (cvData.hobbies?.hobbies?.length > 0) {
    sections.push({
      id: "hobbies",
      type: "hobbies",
      title: cvData.hobbies.sectionTitle || "Hobbies & Interests",
      data: cvData.hobbies,
    })
  }

  // --- NEW SECTIONS ---

  // Courses
  if (cvData.courses?.courseItems?.length > 0) {
    sections.push({
      id: "courses",
      type: "courses",
      title: cvData.courses.sectionTitle || "Courses & Training",
      data: cvData.courses.courseItems.map((item) => ({
        title: item.courseName,
        institution: item.institution,
        date: item.completionDate,
      })),
    })
  }

  // Volunteer
  if (cvData.volunteer?.volunteerItems?.length > 0) {
    sections.push({
      id: "volunteer",
      type: "timeline",
      title: cvData.volunteer.sectionTitle || "Volunteer Experience",
      data: cvData.volunteer.volunteerItems.map((item) => ({
        title: item.role,
        subtitle: `${item.organization}, ${formatLocation(item.location)}`,
        period: formatDateRange(item.dateRange),
        details: item.responsibilities,
      })),
    })
  }

  // Patents
  if (cvData.patents?.patentItems?.length > 0) {
    sections.push({
      id: "patents",
      type: "patents",
      title: cvData.patents.sectionTitle || "Patents",
      data: cvData.patents.patentItems.map((item) => ({
        title: item.title,
        office: item.patentOffice,
        date: item.issueDate,
        link: item.url || "#",
      })),
    })
  }

  // Memberships
  if (cvData.memberships?.memberships?.length > 0) {
    sections.push({
      id: "memberships",
      type: "memberships",
      title: cvData.memberships.sectionTitle || "Professional Memberships",
      data: cvData.memberships.memberships.map((item) => ({
        organization: item.organization,
        role: item.role,
        period: formatDateRange(item.dateRange),
      })),
    })
  }

  // Contact
  if (cvData.contact) {
    const contactItems = []
    if (cvData.contact.email) {
      contactItems.push({
        label: "Email",
        value: cvData.contact.email,
        icon: IconMail,
        href: `mailto:${cvData.contact.email}`,
      })
    }
    if (cvData.contact.phone) {
      contactItems.push({ label: "Phone", value: cvData.contact.phone, icon: IconPhone })
    }
    if (cvData.contact.location && (cvData.contact.location.city || cvData.contact.location.country)) {
      contactItems.push({
        label: "Location",
        value: formatLocation(cvData.contact.location),
        icon: IconMapPin,
        className: "md:col-span-2",
      })
    }
    if (cvData.contact.professionalLinks?.length > 0) {
      cvData.contact.professionalLinks.forEach((link) => {
        contactItems.push({
          label: link.platform,
          value: link.url.replace(/https?:\/\//, ""),
          icon: getContactIcon(link.platform),
          href: link.url,
        })
      })
    }
    if (contactItems.length > 0) {
      sections.push({
        id: "contact",
        type: "contact",
        title: "Contact",
        data: contactItems,
      })
    }
  }

  return {
    hero: {
      name: cvData.hero?.fullName,
      title: cvData.hero?.professionalTitle,
      availability: cvData.contact?.availability,
      profilePhotoUrl: cvData.hero?.profilePhotoUrl,
    },
    sections,
  }
}
