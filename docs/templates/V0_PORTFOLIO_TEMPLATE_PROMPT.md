# V0 Prompt: Transform Template into Interactive Portfolio Website with Edit Mode

Transform this existing template into a complete, interactive portfolio website with full edit mode capabilities. Keep the exact design language, colors, typography, and layout patterns but adapt it to showcase professional portfolio content with click-to-edit functionality, drag & drop, smart cards, and theme switching.

## Design Requirements

### Maintain Visual Identity
- **Keep exact color palette** - Use the same colors, gradients, and color relationships
- **Preserve typography** - Same fonts, font weights, sizes, and text hierarchy
- **Maintain layout style** - Keep the same grid system, spacing, and visual patterns
- **Same animations** - Preserve transition styles, hover effects, and micro-interactions
- **Consistent components** - Adapt existing UI elements (buttons, cards, etc.) for portfolio use

### Interactive Features (MUST IMPLEMENT ALL)
- **Click-to-edit text** - Click any text to edit inline with perfect styling preservation
- **Single-edit enforcement** - Only one text element editable at a time
- **Drag & drop** - Reorder sections and items within sections
- **Smart cards** - 10 view modes per content item (text, 3D, video, code, GitHub, etc.)
- **6 color themes** - Theme switcher with instant switching (no page reload)
- **Edit mode toggle** - Visual indicators, blue banner, edit controls
- **Settings panels** - Per-card customization with resizable side panels

### Portfolio Structure Required (18 CV Sections)

Create a single-page portfolio supporting ALL these sections:

#### Always Present (100% of CVs)
1. **Hero Section**
   - Full name (editable)
   - Professional title (editable)
   - Profile photo (replaceable)
   - Professional tagline (editable)
   - CTA buttons - "Download CV" and "Contact Me"

2. **Contact Section**
   - Email, phone, location (all editable)
   - Social media links (editable)
   - Availability status (editable)

#### Usually Present (90%+ of CVs)
3. **Summary Section**
   - Professional overview (editable multi-line)
   - Years of experience (editable)
   - Key achievements (editable list)

4. **Experience Section**
   - Job title and company (editable)
   - Employment dates (editable)
   - Responsibilities/achievements (editable list)
   - Technologies used (editable tags)

5. **Education Section**
   - Degree and institution (editable)
   - Graduation dates (editable)
   - Honors/GPA (editable)
   - Relevant coursework (editable)

6. **Skills Section**
   - Skill categories (editable)
   - Skill names (editable)
   - Proficiency levels (adjustable)

#### Often Present (30-70% of CVs)
7. **Projects Section**
   - Project cards with smart view modes
   - Support for images, videos, code snippets
   - GitHub integration
   - Live demo links

8. **Certifications Section**
   - Certification name (editable)
   - Issuing organization (editable)
   - Date obtained (editable)

9. **Languages Section**
   - Language name (editable)
   - Proficiency level (Native/Fluent/Conversational/Basic)

10. **Hobbies Section**
    - Hobby name (editable)
    - Description (editable)

#### Sometimes Present (10-30% of CVs)
11. **Testimonials Section**
    - Recommendation text (editable)
    - Author name and role (editable)
    - Author photo

12. **Memberships Section**
    - Organization name (editable)
    - Role/position (editable)
    - Duration (editable)

13. **Awards Section**
    - Award name (editable)
    - Issuing organization (editable)
    - Date received (editable)

14. **Publications Section**
    - Publication title (editable)
    - Journal/venue (editable)
    - Date published (editable)

#### Rarely Present (5-15% of CVs)
15. **Patents Section**
    - Patent title (editable)
    - Patent number (editable)
    - Date filed (editable)

16. **Speaking Section**
    - Event name (editable)
    - Topic (editable)
    - Date (editable)

17. **Courses Section**
    - Course name (editable)
    - Platform/institution (editable)
    - Completion date (editable)

18. **References Section**
    - Reference name (editable)
    - Title and company (editable)
    - Contact info (privacy-sensitive)

## Content Structure

Use this sample data structure to populate the portfolio:

```typescript
const portfolioData = {
  hero: {
    name: "Alex Johnson",
    title: "Senior Full Stack Developer",
    tagline: "Building scalable web applications with modern technologies",
    profileImage: "/api/placeholder/150/150",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    availability: "Available for new opportunities"
  },
  
  summary: {
    text: "Passionate full-stack developer with 5+ years of experience creating robust web applications. Specialized in React, Node.js, and cloud architecture with a proven track record of delivering high-quality products.",
    metrics: [
      { label: "Years Experience", value: "5+" },
      { label: "Projects Completed", value: "25+" },
      { label: "Team Size Led", value: "8" }
    ],
    coreSkills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL", "Docker"]
  },
  
  experience: [
    {
      title: "Senior Full Stack Developer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      dates: "2022 - Present",
      achievements: [
        "Led development of microservices architecture serving 1M+ users",
        "Reduced application load time by 40% through optimization",
        "Mentored 3 junior developers and conducted code reviews"
      ],
      technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"]
    },
    {
      title: "Full Stack Developer",
      company: "StartupXYZ",
      location: "Palo Alto, CA", 
      dates: "2020 - 2022",
      achievements: [
        "Built customer portal from scratch using React and Express",
        "Implemented real-time chat system with Socket.io",
        "Improved database query performance by 60%"
      ],
      technologies: ["React", "Express", "MongoDB", "Socket.io"]
    }
  ],
  
  skills: {
    "Frontend": [
      { name: "React", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "Vue.js", level: 75 }
    ],
    "Backend": [
      { name: "Node.js", level: 95 },
      { name: "Python", level: 80 },
      { name: "PostgreSQL", level: 85 },
      { name: "MongoDB", level: 80 }
    ],
    "DevOps": [
      { name: "AWS", level: 85 },
      { name: "Docker", level: 90 },
      { name: "Kubernetes", level: 70 },
      { name: "CI/CD", level: 85 }
    ]
  },
  
  projects: [
    {
      title: "E-commerce Platform",
      description: "Full-featured online shopping platform with payment integration",
      image: "/api/placeholder/300/200",
      technologies: ["React", "Node.js", "Stripe", "PostgreSQL"],
      liveUrl: "https://demo-ecommerce.com",
      githubUrl: "https://github.com/alex/ecommerce"
    },
    {
      title: "Task Management App", 
      description: "Collaborative project management tool with real-time updates",
      image: "/api/placeholder/300/200",
      technologies: ["Vue.js", "Express", "Socket.io", "MongoDB"],
      liveUrl: "https://taskmanager-demo.com",
      githubUrl: "https://github.com/alex/taskmanager"
    },
    {
      title: "Analytics Dashboard",
      description: "Business intelligence dashboard with interactive charts",
      image: "/api/placeholder/300/200", 
      technologies: ["React", "D3.js", "Python", "FastAPI"],
      liveUrl: "https://analytics-demo.com",
      githubUrl: "https://github.com/alex/analytics"
    }
  ],
  
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "Stanford University",
      location: "Stanford, CA",
      year: "2019",
      honors: "Magna Cum Laude"
    }
  ],
  
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2023"
    },
    {
      name: "React Developer Certification", 
      issuer: "Meta",
      year: "2022"
    }
  ],
  
  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/alexjohnson" },
    { platform: "GitHub", url: "https://github.com/alexjohnson" },
    { platform: "Twitter", url: "https://twitter.com/alexjohnson" }
  ]
}
```

## Technical Implementation

### Core Technologies
```json
{
  "react": "^19.1.0",
  "next": "15.2.4", 
  "typescript": "^5",
  "tailwindcss": "^3.4.17",
  "framer-motion": "^11.15.0",
  "@radix-ui/react-*": "latest",
  "@dnd-kit/core": "^6.1.0",
  "@dnd-kit/sortable": "^8.0.0"
}
```

### Critical Interactive Features

#### 1. EditableText Component
```typescript
// Every text element must be editable
interface EditableTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  initialValue: string
  onSave: (value: string) => void
  className?: string // Preserves ALL original styles
}

// Implementation requirements:
// - Click to edit (no double-click)
// - ContentEditable (NOT input replacement)
// - Perfect style preservation during edit
// - Single-edit enforcement via context
// - Save on blur/Enter, cancel on Escape
```

#### 2. Smart Card System (10 View Modes)
```typescript
type ViewMode = 
  | 'text-simple'      // Clean minimal text
  | 'text-detailed'    // Full information display
  | 'image-3d'         // Interactive 3D card
  | 'multi-images'     // Gallery/carousel
  | 'code'            // Syntax highlighted
  | 'github'          // Repo preview with stats
  | 'video'           // YouTube/Vimeo embed
  | 'tweet'           // Twitter embed
  | 'link-preview'    // Website preview
  | 'compare'         // Before/after slider

// Each card must have:
// - Hover to show settings gear icon
// - Resizable settings panel
// - View mode switcher
// - Delete and maximize buttons
```

#### 3. Edit Mode Context
```typescript
// Global edit mode management
const EditModeContext = createContext({
  isEditMode: false,
  activeEditId: null,
  setActiveEdit: (id: string | null) => void
})

// Visual indicators in edit mode:
// - Blue banner at top
// - Hover outlines on editable elements
// - Drag handles on sections
// - Settings buttons on cards
```

#### 4. Theme System (6 Themes)
```typescript
const themes = [
  'cream-gold',      // Light: Warm professional
  'midnight-blush',  // Dark: Pink accents
  'evergreen',       // Light: Nature-inspired
  'interstellar',    // Dark: Space theme
  'serene-sky',      // Light: Soft blue
  'crimson-night'    // Dark: Bold red
]

// Floating theme switcher component
// CSS variables for instant switching
// No page reload required
```

#### 5. Drag & Drop
```typescript
// Using @dnd-kit for smooth drag & drop
// - Drag entire sections up/down
// - Drag items within sections
// - Visual feedback during drag
// - Smooth animations on drop
```

### Code Structure
```typescript
// Main portfolio page with full state management
export default function Portfolio() {
  const [portfolioData, setPortfolioData] = useState(initialData)
  const [isEditMode, setIsEditMode] = useState(false)
  const [activeTheme, setActiveTheme] = useState('cream-gold')
  
  return (
    <EditModeProvider>
      <ThemeProvider theme={activeTheme}>
        <div className="portfolio-container">
          {/* Floating controls */}
          <EditModeToggle />
          <ThemeToggle />
          
          {/* All 18 CV sections (conditionally rendered) */}
          <DraggableSection id="hero">
            <HeroSection data={portfolioData.hero} />
          </DraggableSection>
          
          <DraggableSection id="contact">
            <ContactSection data={portfolioData.contact} />
          </DraggableSection>
          
          {portfolioData.summary && (
            <DraggableSection id="summary">
              <SummarySection data={portfolioData.summary} />
            </DraggableSection>
          )}
          
          {/* ... all other sections with conditional rendering */}
        </div>
      </ThemeProvider>
    </EditModeProvider>
  )
}
```

## Implementation Requirements

### Must-Have Features Checklist
- [ ] **Click-to-edit** on ALL text elements
- [ ] **Style preservation** during editing (no visual changes)
- [ ] **Single-edit enforcement** (only one element editable at a time)
- [ ] **Smart cards** with all 10 view modes
- [ ] **Settings panels** for each card (resizable)
- [ ] **Drag & drop** for sections and items
- [ ] **6 theme system** with instant switching
- [ ] **Edit mode toggle** with visual feedback
- [ ] **Responsive design** (mobile/tablet/desktop)
- [ ] **All 18 CV sections** support

### Component Implementation Priority
1. **EditableText** - This is the heart of the system
2. **EditModeContext** - Global state management
3. **SmartCard** - With all view modes
4. **DraggableSection** - For drag & drop
5. **ThemeProvider** - For theme switching

### Performance Requirements
- First load: < 3 seconds
- Theme switching: < 500ms
- Edit mode toggle: < 200ms
- Drag & drop: 60fps smooth
- Text editing: Instant response

## Responsive Behavior
- **Mobile (320px-768px)**: Single column, stacked layout
- **Tablet (768px-1024px)**: Two-column where appropriate
- **Desktop (1024px+)**: Full multi-column layout with sidebars

## Testing Your Implementation

### Text Editing Tests
```bash
□ Click any heading - becomes editable immediately
□ Click any paragraph - becomes editable immediately  
□ Edit mode maintains exact font size, color, weight
□ Only one element editable at a time
□ Enter key saves changes
□ Escape key cancels changes
□ Clicking outside saves changes
```

### Smart Card Tests
```bash
□ Hover shows settings gear icon
□ Settings panel opens smoothly
□ All 10 view modes work correctly
□ View mode switching preserves content
□ Panel can resize and reposition
```

### Theme & Edit Mode Tests
```bash
□ Theme switcher visible and functional
□ All 6 themes apply correctly
□ Edit mode toggle shows blue banner
□ Edit mode enables all editing features
□ Non-edit mode is read-only
```

### Drag & Drop Tests
```bash
□ Sections can be reordered
□ Items within sections can be reordered
□ Smooth animations during drag
□ Visual feedback while dragging
```

## Final Output
Generate a complete, interactive portfolio website that:
1. **Looks identical** to the original template's design language
2. **Supports all 18 CV sections** with conditional rendering
3. **Implements ALL interactive features** (edit, drag, smart cards, themes)
4. **Click-to-edit functionality** on every text element
5. **Smart card system** with 10 view modes and settings panels
6. **6-theme system** with instant switching
7. **Drag & drop** for sections and items
8. **Perfect responsive design** for all devices
9. **Edit mode** with visual indicators and controls
10. **Performance optimized** meeting all benchmarks

The result should maintain the original template's visual design while adding full RESUME2WEBSITE interactive functionality. Every piece of text should be editable, every section draggable, and every content item should support multiple view modes through the smart card system.