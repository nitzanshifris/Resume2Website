# 🎨 Frontend Developer Mission: Create a New Portfolio Template

Hey there! 👋 

We need your help creating a **brand new portfolio template** for our CV2WEB platform. Think of this like designing a new theme for WordPress - same functionality, completely different look and feel.

## What is CV2WEB?

CV2WEB is an AI-powered platform that transforms CVs into stunning portfolio websites. Users upload their resume, our AI extracts all the information, and then we generate a beautiful portfolio website for them.

Right now we have two templates (v1.5 and v2.1), and we want to give users more choices. That's where you come in!

## Your Mission 🎯

**Create Template Option 3** - Same functionality as existing templates, completely different visual style.


**Impact:** Thousands of professionals will use your template to land jobs

---

## How Our System Works

### Data Flow
```
User uploads CV →  AI extracts data → Creates JSON with all sections → Your template displays it beautifully
```

### Interactive Features (MUST PRESERVE ALL)
- **Click-to-edit text** - Perfect styling preservation, single-edit enforcement, ContentEditable
- **Drag & drop** - Reorder sections and items within sections
- **Smart cards** - 10 view modes per content item (text, 3D, video, code, GitHub, etc.)
- **6 color themes** - Cream Gold, Midnight Blush, Evergreen, Interstellar, Serene Sky, Crimson Night
- **Settings panels** - Per-card customization with resizable side panels
- **Edit mode toggle** - Visual indicators and controls

### Recent Major Improvements (January 2025)
- ✅ **Perfect text editing** - No style loss, single-edit enforcement, seamless ContentEditable
- ✅ **6-theme system** - Complete color palette with floating theme switcher
- ✅ **Enhanced UX** - Blue edit banner, visual feedback, responsive design

---

## Complete CV Sections (18 Total)

Your template must handle ALL these sections:

### Always Present (100% of CVs)
1. **👤 Hero** - Name, title, photo, tagline
2. **📞 Contact** - Email, phone, location, social links, availability

### Usually Present (90%+ of CVs)
3. **📝 Summary** - Professional overview, experience, key achievements
4. **💼 Experience** - Work history, responsibilities, achievements, technologies
5. **🎓 Education** - Degrees, institutions, honors, coursework
6. **🛠️ Skills** - Technical/soft skills with proficiency levels

### Often Present (30-70% of CVs)
7. **🚀 Projects** - Portfolio work, GitHub repos, demos, images, videos
8. **🏆 Certifications** - Professional credentials, organizations, dates
9. **🌍 Languages** - Proficiency levels (Native, Fluent, Conversational, Basic)
10. **🎨 Hobbies** - Personal interests, descriptions

### Sometimes Present (10-30% of CVs)
11. **💬 Testimonials** - Recommendations, author details, relationships
12. **🏢 Memberships** - Professional organizations, associations
13. **🏆 Awards** - Recognition, achievements, competitions
14. **📚 Publications** - Research papers, articles, blog posts

### Rarely Present (5-15% of CVs)
15. **🔬 Patents** - Intellectual property, inventions
16. **🎤 Speaking** - Conference presentations, workshops
17. **📖 Courses** - Online training, bootcamps, certifications
18. **👥 References** - Professional references (privacy-sensitive)

---

## Smart Card System (10 View Modes)

Each content item displays in versatile cards supporting:

1. **Text Simple** - Clean minimal layout
2. **Text Detailed** - Full information display
3. **3D Image** - Interactive 3D cards with images
4. **Multi-images** - Gallery with testimonials
5. **Code** - Syntax-highlighted code with language detection
6. **GitHub** - Repository preview with stats and live links
7. **Video** - Embedded player (YouTube, Vimeo, direct uploads)
8. **Tweet** - Social media embedding
9. **Link Preview** - Website preview in Safari-style browser
10. **Compare** - Before/after image slider

### Settings Panel (Critical Feature)
- **Settings button** appears on hover (gear icon between maximize/delete)
- **Resizable side panel** with left/right positioning
- **Dynamic content** based on selected view mode
- **Real-time preview** of changes

---

## Technical Requirements

### Technology Stack
```json
{
  "core": {
    "react": "^19.1.0",
    "next": "15.2.4",
    "typescript": "^5"
  },
  "ui": {
    "@radix-ui/react-*": "latest",
    "@tabler/icons-react": "^3.34.0",
    "lucide-react": "^0.468.0"
  },
  "styling": {
    "tailwindcss": "^3.4.17",
    "framer-motion": "^11.15.0"
  },
  "dnd": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0"
  }
}
```

### Project Structure
```
your-new-template/
├── app/
│   ├── page.tsx              # Main portfolio page (complex state management)
│   ├── layout.tsx            # Theme providers and contexts
│   ├── globals.css           # Custom styles, theme variables
│   └── resume-data.json      # Demo data
├── components/
│   ├── sections/             # 18 CV section components
│   │   ├── hero-section.tsx
│   │   ├── summary-section.tsx
│   │   ├── experience-section.tsx
│   │   ├── education-section.tsx
│   │   ├── skills-section.tsx
│   │   ├── projects-section.tsx
│   │   ├── contact-section.tsx
│   │   ├── certifications-section.tsx
│   │   ├── languages-section.tsx
│   │   ├── hobbies-section.tsx
│   │   ├── testimonials-section.tsx
│   │   ├── memberships-section.tsx
│   │   ├── awards-section.tsx
│   │   ├── publications-section.tsx
│   │   ├── patents-section.tsx
│   │   ├── speaking-section.tsx
│   │   ├── courses-section.tsx
│   │   └── references-section.tsx
│   ├── cards/               # Smart card system
│   │   ├── smart-card.tsx       # Main wrapper with view mode switching
│   │   └── view-modes/          # 10 view mode implementations
│   │       ├── text-view.tsx
│   │       ├── text-detailed-view.tsx
│   │       ├── image-3d-view.tsx
│   │       ├── multi-images-view.tsx
│   │       ├── code-view.tsx
│   │       ├── github-view.tsx
│   │       ├── video-view.tsx
│   │       ├── tweet-view.tsx
│   │       ├── link-preview-view.tsx
│   │       └── compare-view.tsx
│   ├── ui/                  # 37 reusable UI primitives
│   │   ├── editable-text.tsx    # CRITICAL - text editing heart
│   │   ├── button.tsx, card.tsx, sheet.tsx
│   │   ├── accordion.tsx, alert-dialog.tsx, avatar.tsx
│   │   ├── badge.tsx, breadcrumb.tsx, calendar.tsx
│   │   ├── carousel.tsx, checkbox.tsx, collapsible.tsx
│   │   ├── command.tsx, context-menu.tsx, dialog.tsx
│   │   ├── drawer.tsx, dropdown-menu.tsx, form.tsx
│   │   ├── hover-card.tsx, input.tsx, label.tsx
│   │   ├── menubar.tsx, navigation-menu.tsx, pagination.tsx
│   │   ├── popover.tsx, progress.tsx, radio-group.tsx
│   │   ├── resizable.tsx, scroll-area.tsx, select.tsx
│   │   ├── separator.tsx, skeleton.tsx, slider.tsx
│   │   ├── switch.tsx, table.tsx, tabs.tsx
│   │   ├── textarea.tsx, toast.tsx, toaster.tsx
│   │   ├── toggle.tsx, toggle-group.tsx, tooltip.tsx
│   │   ├── vertical-timeline.tsx
│   │   └── use-toast.ts
│   ├── edit-mode-toggle.tsx     # Edit mode switcher
│   ├── theme-toggle.tsx         # 6-theme floating switcher
│   ├── watermark-toggle.tsx     # Branding control
│   └── draggable-section.tsx    # Drag & drop wrapper
├── contexts/
│   ├── edit-mode-context.tsx   # CRITICAL - global edit state
│   ├── theme-context.tsx       # Theme switching and CSS variables
│   └── watermark-context.tsx   # Watermark visibility
├── lib/
│   ├── cv-data-adapter.tsx     # CRITICAL - data transformation
│   ├── data.tsx               # TypeScript type definitions
│   ├── themes.ts              # 6-theme system definitions
│   └── utils.ts               # Utility functions
├── package.json, tailwind.config.js, tsconfig.json
└── README.md
```

---

## Critical Components Deep Dive

### 1. EditableText Component (MISSION CRITICAL)
```typescript
// components/ui/editable-text.tsx
interface EditableTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  initialValue: string
  onSave: (value: string) => void
  className?: string
  placeholder?: string
}

// Must implement:
// - Click-to-edit functionality
// - Perfect styling preservation during editing
// - Single-edit enforcement via global context
// - ContentEditable implementation (no input replacements)
// - Auto-save on blur/Enter, cancel on Escape
// - Loading states and error handling
```

### 2. Theme System Integration
```typescript
// lib/themes.ts - Complete theme structure
interface Theme {
  name: string
  colors: {
    primary: string, secondary: string, accent: string
    background: string, foreground: string, muted: string
    'muted-foreground': string, border: string, input: string
    ring: string, chart1: string, chart2: string, chart3: string
    chart4: string, chart5: string, destructive: string
    'destructive-foreground': string, success: string
    'success-foreground': string, warning: string
    'warning-foreground': string, info: string, 'info-foreground': string
  }
  gradients: {
    'gradient-1': string, 'gradient-2': string, 'gradient-3': string
    'gradient-hero': string, 'gradient-card': string
    'gradient-button': string, 'gradient-accent': string, 'gradient-muted': string
  }
}
```

### 3. CV Data Adapter (Complete Function List)
```typescript
// lib/cv-data-adapter.tsx - 26 transformation functions
export function adaptCV2WebToTemplate(cv2webData: CV2WebData): TemplateData
export function determineViewMode(item: any): ViewModeConfig
export function validateAndSanitizeData(data: any): ValidatedData
export async function fetchLatestCVData(sessionId: string): Promise<TemplateData>
export function transformHeroSection(heroData: any): HeroSectionData
export function transformExperienceSection(experienceData: any): ExperienceSectionData
export function transformEducationSection(educationData: any): EducationSectionData
export function transformSkillsSection(skillsData: any): SkillsSectionData
export function transformProjectsSection(projectsData: any): ProjectsSectionData
export function transformCertificationsSection(certData: any): CertificationsSectionData
export function transformLanguagesSection(languagesData: any): LanguagesSectionData
export function transformHobbiesSection(hobbiesData: any): HobbiesSectionData
export function transformTestimonialsSection(testimonialsData: any): TestimonialsSectionData
export function transformMembershipsSection(membershipsData: any): MembershipsSectionData
export function transformAwardsSection(awardsData: any): AwardsSectionData
export function transformPublicationsSection(publicationsData: any): PublicationsSectionData
export function transformPatentsSection(patentsData: any): PatentsSectionData
export function transformSpeakingSection(speakingData: any): SpeakingSectionData
export function transformCoursesSection(coursesData: any): CoursesSectionData
export function transformReferencesSection(referencesData: any): ReferencesSectionData
export function generateFallbackData(sectionType: string): SectionData
export function detectContentType(content: string): 'text' | 'url' | 'code' | 'email'
export function optimizeImageUrls(images: string[]): string[]
export function sanitizeUserContent(content: string): string
export function cacheTransformedData(key: string, data: any): void
export function getCachedData(key: string): any | null
```

### 4. Data Structure Pattern
```typescript
interface CVSection {
  sectionTitle: string           // User-editable section title
  items: Array<SectionItem>      // Array of items in the section
}

interface SectionItem {
  // Core fields vary by section type
  title?: string, description?: string, dates?: DateRange
  // View mode metadata:
  viewMode?: ViewMode, images?: string[], videoUrl?: string
  githubUrl?: string, tweetUrl?: string, linkPreviewUrl?: string
  codeSnippet?: string, codeLanguage?: string
  compareImages?: { before: string, after: string }
  multiImages?: string[], testimonialAuthor?: string
  testimonialRole?: string, testimonialCompany?: string
  isVisible?: boolean, customFields?: Record<string, any>
}
```

---


---

##  Development Workflow

### Week 1: Analysis & Setup
- **Study reference templates** (v1.5 and v2.1 in `src/templates/`)
- **Choose design direction** and create comprehensive mockups
- **Setup environment** and test all existing functionality
- **Understand critical components** (EditableText, SmartCard, contexts)

### Week 2: Visual Foundation
- **Implement 6-theme CSS system** in globals.css
- **Build responsive layout** (mobile-first, tablet, desktop)  
- **Style core components** matching your design aesthetic
- **Create animation system** with 60fps performance

### Week 3: Interactive Features
- **Integrate text editing** with perfect styling preservation
- **Implement smart cards** with all 10 view modes
- **Add drag & drop** for sections and items
- **Complete edit mode** with visual feedback system

### Week 4: Polish & Integration
- **Backend integration** with real CV data testing
- **Performance optimization** (< 3s load time, smooth animations)
- **Cross-browser testing** (Chrome, Firefox, Safari, Edge)
- **Complete documentation** and demo materials

---

## Testing Requirements (ALL MUST PASS)

### ✅ Text Editing System
```bash
□ Click any text - becomes editable immediately
□ Maintains exact font size, weight, color during editing
□ Only one text element editable at a time
□ Enter saves, Escape cancels, clicking elsewhere saves
□ Multi-line descriptions edit seamlessly
□ Works on touch devices
```

### ✅ Theme System (All 6 Themes)
```bash
□ pick 6 different color theme - 3 light and 3 dark .
□ Instant theme switching (no page reload)
□ All UI elements respect theme colors consistently
```

### ✅ Responsive Design
```bash
□ Mobile (320px-768px) - Perfect layout, readable text
□ Tablet (768px-1024px) - Optimized multi-column layout
□ Desktop (1024px+) - Rich enhanced layout
□ Touch interactions work perfectly
□ No horizontal scrolling at any breakpoint
```

### ✅ Smart Card System
```bash
□ All 10 view modes display and function correctly
□ Settings panel opens/closes smoothly
□ View mode switching preserves data
□ Resizable panel works with left/right positioning
```

### ✅ Performance Benchmarks
```bash
□ First load: < 3 seconds
□ Theme switching: < 500ms
□ Edit mode toggle: < 200ms
□ Drag & drop: Smooth 60fps
□ Mobile scroll: No jank
```

---

## Complete Deliverables

### 1. Production-Ready Code
- **Complete template** with all 18 CV sections working
- **All interactive features** functional and tested
- **Perfect responsive design** across all devices
- **6-theme compatibility** with smooth switching
- **Performance optimized** meeting all benchmarks

### 2. Design Documentation
- **Design system guide** (colors, typography, spacing)
- **Component library** with examples and usage
- **Responsive specifications** for all breakpoints
- **Theme integration** documentation

### 3. Demo Package
- **Screenshots** - desktop/mobile views, all themes, edit mode
- **Video walkthrough** (3-5 minutes) showing all features
- **Live demo** deployed and accessible via URL

### 4. Technical Documentation
- **Setup guide** with complete installation instructions
- **Component API** documentation with TypeScript interfaces
- **Integration guide** for CV2WEB platform compatibility
- **Maintenance guide** for future updates and customization

---

## Success Criteria (ALL REQUIRED)

### Functional Requirements
- [ ] All text elements editable with perfect styling preservation
- [ ] Single-edit enforcement prevents multiple simultaneous edits
- [ ] All 6 themes render perfectly with your design
- [ ] Drag & drop works smoothly for sections and items
- [ ] All 10 smart card view modes function correctly
- [ ] Edit mode provides clear visual feedback
- [ ] Settings panels work for all card types
- [ ] Flawless responsive design across all devices
- [ ] Performance meets all benchmark requirements
- [ ] No console errors or runtime issues

### Design Requirements
- [ ] Visually distinct from existing templates (>80% different)
- [ ] Professional appearance suitable for job seekers
- [ ] Consistent design system throughout
- [ ] Excellent typography and spacing
- [ ] Smooth professional animations
- [ ] WCAG AA accessibility compliance
- [ ] Modern aesthetics appropriately applied

### Technical Requirements
- [ ] Clean, maintainable TypeScript code
- [ ] Proper React component architecture
- [ ] Follows established code patterns
- [ ] Comprehensive error handling
- [ ] Optimized performance and rendering
- [ ] Cross-browser compatibility
- [ ] Full TypeScript coverage

---

## Getting Started Checklist

### Pre-Development
- [ ] Study both reference templates (v1.5 and v2.1) thoroughly
- [ ] Test all existing functionality in development environment
- [ ] Choose design direction and create comprehensive mockups
- [ ] Set up development environment with all dependencies

### Development Environment Setup
```bash
# Copy reference template
cp -r src/templates/v0_template_v1.5 src/templates/your-new-template
cd src/templates/your-new-template

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Test critical functionality:
# - Edit mode toggle and text editing
# - All 6 theme switches
# - Drag & drop sections and items
# - Smart card view mode switching
# - Settings panels functionality
```

### Critical Testing Protocol
- **Text editing** - Click any text, verify styling preservation, test single-edit
- **Theme switching** - Test all 6 themes with your design
- **Responsive** - Test on mobile, tablet, desktop
- **Smart cards** - Verify all 10 view modes work
- **Performance** - Check loading speed and animation smoothness

---

## Reference Package We'll Provide

```bash
frontend-developer-package/
├── reference-templates/
│   ├── v0_template_v1.5/          # Complex, feature-rich (1,700+ lines)
│   └── v0_template_v2.1/          # Modern, clean design (690 lines)
├── sample-data/
│   ├── complete_cv_data_template.json    # Full data structure
│   └── enhanced_michelle_cv.json         # Real CV example
├── FRONTEND_DEVELOPER_MISSION_HUMAN.md  # This document
└── README.md                             # Setup instructions
```

**Package Size:** ~5-10MB (no node_modules, no build folders)

---

---

## Final Notes


**Key Success Factors:**
- Study `components/ui/editable-text.tsx` thoroughly - it's the heart of the system
- Test text editing extensively - perfect styling preservation is critical
- Ensure all 6 themes work beautifully with your design
- Maintain professional quality throughout
- Preserve all interactive functionality

**Ready to build something that changes careers?** 🚀

Your template will help thousands of professionals create stunning portfolios that get results. Let's create something extraordinary together!

---

*Document Version: 2.1 Concise*  
*Created: January 2025*  
*For: CV2WEB V4 Platform - Professional Portfolio Template Development*  
*Impact: Global - Thousands of professionals worldwide*