# 🎨 Frontend Developer Mission: Create a New Portfolio Template

Hey there! 👋 

We need your help creating a **brand new portfolio template** for our CV2WEB platform. 

## What is CV2WEB?

CV2WEB is an AI-powered platform that transforms CVs into portfolio react websites. Users upload their resume, our AI extracts all the information, and then we generate a beautiful portfolio website for them.


## Your Mission 🎯

**Create a new Template** - Same functionality as existing template, completely different visual style.


---

## How Our System Works

### Data Flow
```
User uploads CV →  AI extracts data → Creates JSON with all the data from the user cv file divided by optional sections : 
```
## Complete CV Sections (18 Total)

Your template must handle ALL these sections: 

## 1. Hero Section
- **1.1 fullName** (string, required)
- **1.2 professionalTitle** (string, required)
- **1.3 summaryTagline** (string, optional)
- **1.4 profilePhotoUrl** (string | null, optional)

## 2. Contact Section
- **2.1 email** (string, required)
- **2.2 phone** (string, optional)
- **2.3 location** (object, optional)
  - **2.3.1 city** (string)
  - **2.3.2 state** (string)
  - **2.3.3 country** (string)
- **2.4 professionalLinks** (array, optional)
  - **2.4.1 platform** (string: "LinkedIn" | "GitHub" | "Twitter" | "Website" | "Portfolio" | "Other")
  - **2.4.2 url** (string)
- **2.5 availability** (string, optional)

## 3. Summary Section
- **3.1 summaryText** (string, required)
- **3.2 yearsOfExperience** (number, optional)
- **3.3 keySpecializations** (array<string>, optional)

## 4. Experience Section
Array of experience items, each containing:
- **4.1 jobTitle** (string, required)
- **4.2 companyName** (string, required)
- **4.3 location** (object, optional)
  - **4.3.1 city** (string)
  - **4.3.2 state** (string)
  - **4.3.3 country** (string)
- **4.4 dateRange** (object, required)
  - **4.4.1 startDate** (string)
  - **4.4.2 endDate** (string)
  - **4.4.3 isCurrent** (boolean)
- **4.5 responsibilitiesAndAchievements** (array<string>, optional)
- **4.6 technologiesUsed** (array<string>, optional)

## 5. Education Section
Array of education items, each containing:
- **5.1 degree** (string, required)
- **5.2 fieldOfStudy** (string, optional)
- **5.3 institution** (string, required)
- **5.4 location** (object, optional)
  - **5.4.1 city** (string)
  - **5.4.2 state** (string)
  - **5.4.3 country** (string)
- **5.5 dateRange** (object, optional)
  - **5.5.1 startDate** (string)
  - **5.5.2 endDate** (string)
- **5.6 gpa** (string, optional)
- **5.7 honors** (array<string>, optional)

## 6. Skills Section
- **6.1 skillCategories** (array, optional)
  - **6.1.1 categoryName** (string, required)
  - **6.1.2 skills** (array<string>, required)
- **6.2 ungroupedSkills** (array<string>, optional)

## 7. Projects Section
Array of project items, each containing:
- **7.1 title** (string, required)
- **7.2 description** (string, required)
- **7.3 role** (string, optional)
- **7.4 technologiesUsed** (array<string>, optional)
- **7.5 projectUrl** (string, optional)
- **7.6 githubUrl** (string, optional)
- **7.7 imageUrl** (string, optional)
- **7.8 videoUrl** (string, optional)
- **7.9 demoUrl** (string, optional)

## 8. Achievements Section
Array of achievement items, each containing:
- **8.1 value** (string, required)
- **8.2 label** (string, required)
- **8.3 contextOrDetail** (string, optional)
- **8.4 timeframe** (string, optional)

## 9. Certifications Section
Array of certification items, each containing:
- **9.1 title** (string, required)
- **9.2 issuingOrganization** (string, required)
- **9.3 issueDate** (string, required)
- **9.4 expirationDate** (string, optional)
- **9.5 credentialId** (string, optional)
- **9.6 verificationUrl** (string, optional)

## 10. Languages Section
Array of language items, each containing:
- **10.1 language** (string, required)
- **10.2 proficiency** (string, optional)
- **10.3 certification** (string, optional)

## 11. Volunteer Section
Array of volunteer items, each containing:
- **11.1 role** (string, required)
- **11.2 organization** (string, required)
- **11.3 dateRange** (object, optional)
  - **11.3.1 startDate** (string)
  - **11.3.2 endDate** (string)
  - **11.3.3 isCurrent** (boolean)
- **11.4 description** (string, optional)

## 12. Publications Section
Array of publication items, each containing:
- **12.1 title** (string, required)
- **12.2 publicationType** (string, optional)
- **12.3 publicationVenue** (string, optional)
- **12.4 publicationDate** (string, optional)
- **12.5 url** (string, optional)

## 13. Speaking Section
Array of speaking engagement items, each containing:
- **13.1 eventName** (string, required)
- **13.2 topic** (string, required)
- **13.3 date** (string, optional)
- **13.4 venue** (string, optional)
- **13.5 eventUrl** (string, optional)
- **13.6 presentationUrl** (string, optional)
- **13.7 videoUrl** (string, optional)

## 14. Courses Section
Array of course items, each containing:
- **14.1 title** (string, required)
- **14.2 institution** (string, optional)
- **14.3 completionDate** (string, optional)
- **14.4 certificateUrl** (string, optional)

## 15. Memberships Section
Array of membership items, each containing:
- **15.1 organization** (string, required)
- **15.2 role** (string, optional)
- **15.3 membershipType** (string, optional)
- **15.4 dateRange** (object, optional)
  - **15.4.1 startDate** (string)
  - **15.4.2 endDate** (string)
  - **15.4.3 isCurrent** (boolean)

## 16. Hobbies Section
Array of strings representing hobbies/interests

## 17. Patents Section
Array of patent items, each containing:
- **17.1 title** (string, required)
- **17.2 patentNumber** (string, optional)
- **17.3 status** (string: "Filed" | "Pending" | "Granted", optional)
- **17.4 filingDate** (string, optional)
- **17.5 grantDate** (string, optional)
- **17.6 url** (string, optional)

## 18. Testimonials Section (Optional)
Array of testimonial items, each containing:
- **18.1 name** (string, required)
- **18.2 role** (string, optional)
- **18.3 company** (string, optional)
- **18.4 testimonialText** (string, required)
- **18.5 date** (string, optional)

## Frontend Developer Example Data
```json
{
  "hero": {
    "fullName": "Jennifer Adams",
    "professionalTitle": "Senior Software Engineer",
    "summaryTagline": "Building scalable solutions with modern technologies",
    "profilePhotoUrl": "https://example.com/profile-photo.jpg"
  },
  "contact": {
    "email": "jennifer@example.com",
    "phone": "+1 (555) 123-4567",
    "location": {
      "city": "San Francisco",
      "state": "CA",
      "country": "USA"
    },
    "professionalLinks": [
      {
        "platform": "LinkedIn",
        "url": "https://linkedin.com/in/jenniferadams"
      },
      {
        "platform": "GitHub",
        "url": "https://github.com/jadams"
      },
      {
        "platform": "Portfolio",
        "url": "https://jenniferadams.dev"
      }
    ],
    "availability": "Open to new opportunities"
  },
  "summary": {
    "summaryText": "Experienced software engineer with 8+ years building web applications. Passionate about clean code, user experience, and mentoring junior developers. Led teams of 5-10 engineers on projects serving millions of users.",
    "yearsOfExperience": 8,
    "keySpecializations": ["Full Stack Development", "Team Leadership", "Cloud Architecture"]
  },
  "experience": [
    {
      "jobTitle": "Senior Software Engineer",
      "companyName": "TechCorp Inc",
      "location": {
        "city": "San Francisco",
        "state": "CA",
        "country": "USA"
      },
      "dateRange": {
        "startDate": "Jan 2021",
        "endDate": "Present",
        "isCurrent": true
      },
      "responsibilitiesAndAchievements": [
        "Led development of microservices architecture serving 2M+ daily users",
        "Reduced API response time by 60% through optimization",
        "Mentored 5 junior engineers, 3 promoted within a year"
      ],
      "technologiesUsed": ["React", "Node.js", "AWS", "PostgreSQL", "Docker"]
    },
    {
      "jobTitle": "Software Engineer",
      "companyName": "StartupXYZ",
      "location": {
        "city": "Austin",
        "state": "TX",
        "country": "USA"
      },
      "dateRange": {
        "startDate": "Jun 2018",
        "endDate": "Dec 2020",
        "isCurrent": false
      },
      "responsibilitiesAndAchievements": [
        "Built real-time collaboration features used by 50K+ users",
        "Implemented CI/CD pipeline reducing deployment time by 75%"
      ],
      "technologiesUsed": ["Vue.js", "Python", "Docker", "Redis"]
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "fieldOfStudy": "Computer Science",
      "institution": "University of California, Berkeley",
      "location": {
        "city": "Berkeley",
        "state": "CA",
        "country": "USA"
      },
      "dateRange": {
        "startDate": "2014",
        "endDate": "2018"
      },
      "gpa": "3.8/4.0",
      "honors": ["Magna Cum Laude", "Dean's List"]
    }
  ],
  "skills": {
    "skillCategories": [
      {
        "categoryName": "Programming Languages",
        "skills": ["JavaScript", "TypeScript", "Python", "Go", "Java"]
      },
      {
        "categoryName": "Frameworks & Libraries",
        "skills": ["React", "Node.js", "Express", "Django", "Next.js"]
      },
      {
        "categoryName": "Tools & Platforms",
        "skills": ["AWS", "Docker", "Kubernetes", "Git", "Jenkins"]
      }
    ],
    "ungroupedSkills": ["System Design", "Agile Methodology", "Technical Writing"]
  },
  "projects": [
    {
      "title": "Open Source Task Manager",
      "description": "Built a collaborative task management tool with real-time updates and team features. Used by 500+ teams worldwide.",
      "role": "Lead Developer",
      "technologiesUsed": ["React", "Node.js", "Socket.io", "MongoDB"],
      "projectUrl": "https://taskmanager.example.com",
      "githubUrl": "https://github.com/jadams/task-manager",
      "imageUrl": "https://example.com/project-screenshot.png",
      "videoUrl": "https://youtube.com/watch?v=demo123",
      "demoUrl": "https://demo.taskmanager.example.com"
    },
    {
      "title": "AI-Powered Code Review Tool",
      "description": "Developed a tool that uses machine learning to provide intelligent code review suggestions.",
      "role": "Solo Developer",
      "technologiesUsed": ["Python", "TensorFlow", "FastAPI"],
      "githubUrl": "https://github.com/jadams/ai-code-review"
    }
  ],
  "achievements": [
    {
      "value": "60%",
      "label": "API Performance Improvement",
      "contextOrDetail": "Optimized database queries and implemented caching strategy",
      "timeframe": "2023"
    },
    {
      "value": "2M+",
      "label": "Daily Active Users",
      "contextOrDetail": "Scaled microservices architecture to handle massive user growth",
      "timeframe": "2022-2023"
    },
    {
      "value": "3x",
      "label": "Team Productivity Increase",
      "contextOrDetail": "Through implementing automated testing and CI/CD",
      "timeframe": "2021"
    }
  ],
  "certifications": [
    {
      "title": "AWS Certified Solutions Architect",
      "issuingOrganization": "Amazon Web Services",
      "issueDate": "May 2022",
      "expirationDate": "May 2025",
      "credentialId": "AWS-SAA-123456",
      "verificationUrl": "https://aws.amazon.com/verification/cert123"
    },
    {
      "title": "Google Cloud Professional Developer",
      "issuingOrganization": "Google Cloud",
      "issueDate": "Jan 2023"
    }
  ],
  "languages": [
    {
      "language": "English",
      "proficiency": "Native"
    },
    {
      "language": "Spanish",
      "proficiency": "Professional Working",
      "certification": "DELE B2"
    },
    {
      "language": "Mandarin",
      "proficiency": "Basic"
    }
  ],
  "volunteer": [
    {
      "role": "Technical Mentor",
      "organization": "Code for Good",
      "dateRange": {
        "startDate": "2020",
        "endDate": "Present",
        "isCurrent": true
      },
      "description": "Mentor underprivileged students in web development, helping 20+ students land their first tech jobs"
    }
  ],
  "publications": [
    {
      "title": "Scaling Microservices in Production",
      "publicationType": "Technical Article",
      "publicationVenue": "Medium Engineering Blog",
      "publicationDate": "March 2023",
      "url": "https://medium.com/engineering/scaling-microservices"
    },
    {
      "title": "Machine Learning for Code Reviews",
      "publicationType": "Conference Paper",
      "publicationVenue": "IEEE Software Engineering Conference",
      "publicationDate": "October 2022",
      "url": "https://ieee.org/papers/ml-code-reviews"
    }
  ],
  "speaking": [
    {
      "eventName": "ReactConf 2023",
      "topic": "Scaling React Applications in Production",
      "date": "May 2023",
      "venue": "Las Vegas Convention Center",
      "eventUrl": "https://reactconf.com/2023",
      "presentationUrl": "https://slides.com/jadams/scaling-react",
      "videoUrl": "https://youtube.com/watch?v=react123"
    },
    {
      "eventName": "NodeJS Summit",
      "topic": "Building Resilient Microservices",
      "date": "November 2022",
      "venue": "Online",
      "videoUrl": "https://youtube.com/watch?v=node456"
    }
  ],
  "courses": [
    {
      "title": "Advanced React Patterns",
      "institution": "Frontend Masters",
      "completionDate": "January 2023",
      "certificateUrl": "https://frontendmasters.com/certificate/jadams/react"
    },
    {
      "title": "System Design Interview",
      "institution": "Educative.io",
      "completionDate": "March 2022"
    }
  ],
  "memberships": [
    {
      "organization": "Association for Computing Machinery",
      "role": "Senior Member",
      "membershipType": "Professional",
      "dateRange": {
        "startDate": "2019",
        "endDate": "Present",
        "isCurrent": true
      }
    },
    {
      "organization": "Women in Technology International",
      "role": "Active Member",
      "membershipType": "Professional"
    }
  ],
  "hobbies": ["Photography", "Rock Climbing", "Open Source Contributing", "Board Games", "Travel"],
  "patents": [
    {
      "title": "Method for Optimizing Database Query Performance",
      "patentNumber": "US10123456B2",
      "status": "Granted",
      "filingDate": "2022-03-15",
      "grantDate": "2023-09-20",
      "url": "https://patents.google.com/patent/US10123456B2"
    },
    {
      "title": "Real-time Collaboration System Architecture",
      "status": "Pending",
      "filingDate": "2023-06-10"
    }
  ]
}
```

## ImportantNotes
    "All sections are optional - your template should gracefully handle missing data",
    "Arrays might be empty - ensure your template doesn't break with empty arrays",
    "Some fields within objects are optional - use appropriate fallbacks",
    "URLs might be null or undefined - handle gracefully",
    "The template should look professional even with minimal data",
    "You have complete creative freedom in how to display this data",
    "Consider using modern UI patterns and animations",
    "The portfolio should tell a story about the person",
    "Make it memorable and unique"

  

---









# Edit Mode Features Specification

## **Core Edit Mode Controls**
- ✅ **Edit Mode Toggle Button**: Floating button to enable/disable edit mode
- ✅ **Edit Mode Indicator**: Top bar showing edit mode is active
- ✅ **Keyboard Shortcuts**: Enter to save, Esc to cancel
- ✅ **Visual Edit States**: Clear indicators when hovering/editing

## **Text Editing Features**
- ✅ **Click to Edit**: All text elements become editable
- ✅ **Inline Editing**: Edit text directly in place
- ✅ **Multi-line Support**: Paragraph editing for longer content
- ✅ **Auto-save**: Changes save automatically
- ✅ **Cancel/Revert**: Escape key cancels current edit

## **Drag & Drop Features**
- ✅ **Drag & Drop Sections**: Reorder entire sections
- ✅ **Drag & Drop Items**: Reorder items within sections
- ✅ **Smooth Animations**: Animated reordering

## **Profile Photo Management**
- ✅ **Upload Photo**: Add profile picture
- ✅ **Remove Photo**: Delete current picture
- ✅ **Change Shape**: Circle, square, or rounded options
- ✅ **Reposition Photo**: Drag to adjust position within frame
- ✅ **Real-time Preview**: See changes instantly

## **SmartCard Customization** - 

- ✅ **Smart Card System (10 View Modes)

Each content item displays in versatile cards supporting:

1. **Text Simple** - Clean minimal layout - one word or one sentence
2. **Text Detailed** - Full information display
3. **Image** - the user should be able to display an image alingside the text or without ant text - user should be allowed to upload images or drop a link
4. **Multi-images** - same as singal image but for multiple images -up to 5
5. **Code** - Syntax-highlighted code with language detection
6. **GitHub** - Repository preview with stats, full coed files and links
7. **Video** - Embedded player (YouTube, Vimeo, direct uploads)
8. **Tweet** - Social media embedding
9. **Link Preview** - Website preview 
10. **Compare** - Before/after presentation

### Settings Panel (Critical Feature)
- **Settings button** appears on hover (gear icon between maximize/delete)
- **Resizable side panel** with left/right positioning
- **Dynamic content** based on selected view mode
- **Real-time preview** of changes

- ✅ **Typography Controls**: Font size, weight, family, color
- ✅ **Content Editing**: Edit all card content inline
- ✅ **Fullscreen Mode**: Expand cards to full view
- ✅ **External Links**: Open content in new tab
- ✅ **Delete Cards**: Remove individual cards
- ✅ **Add Cards**: Insert new cards between existing ones

## **Typography Settings**
- ✅ **Global Text Sizes**: Control all text sizes from one panel
- ✅ **Component-Specific Sizes**: Individual control for each component type
- ✅ **Live Preview**: See changes in real-time
- ✅ **Reset to Defaults**: One-click reset option
- ✅ **Responsive Sizes**: Different sizes for mobile/desktop

## **Theme Customization**
- ✅ **Theme Selector**: Choose from 6 color schemes - 3 light version and 3 dark versions 
- ✅ **Custom Colors**: make the template highly theme aware , all effects colors should change accordingly to the theme color palllet
- ✅ **Live Theme Preview**: Instant theme changes

## **Section Management**
- ✅ **Show/Hide Sections**: Toggle section visibility
- ✅ **Add Sections**: Add new content sections
- ✅ **Delete Sections**: Remove unwanted sections
- ✅ **Section Titles**: Edit all section headings

## **List Management**
- ✅ **Add List Items**: Add to any list (skills, experience, education)
- ✅ **Remove List Items**: Delete individual items
- ✅ **Reorder List Items**: Drag to reorder within lists
- ✅ **Edit List Content**: Inline editing of all list data

## **Media Management**
- ✅ **Image Uploads**: Add images to galleries
- ✅ **Image Editing**: Crop, zoom, rotate images
- ✅ **Video Embeds**: Add YouTube/Vimeo videos
- ✅ **Code Snippets**: Add/edit code blocks
- ✅ **GitHub Integration**: Link GitHub repositories

## **Contact Information**
- ✅ **Edit Contact Details**: Phone, email, location
- ✅ **Social Links**: Add/edit/remove social media links
- ✅ **Availability Status**: Update availability message
- ✅ **Contact Form**: Enable/disable contact form

## **Advanced Features**
- ✅ **Watermark Control**: Show/hide portfolio watermark of RESUME2WEB Company name 
- ✅ **Export/Import**: Backup and restore customizations
- ✅ **Undo/Redo**: Revert recent changes

## **Mobile Editing**
- ✅ **Touch Controls**: Touch-friendly editing
- ✅ **Responsive Panels**: Adaptive editing panels
- ✅ **Swipe Gestures**: Navigate carousels
- ✅ **Mobile Preview**: See mobile view while editing

## **Visual Feedback**
- ✅ **Hover States**: Clear hover indicators
- ✅ **Active States**: Visual feedback during editing
- ✅ **Success Messages**: Confirmation of saved changes
- ✅ **Error Messages**: Clear error notifications
- ✅ **Loading States**: Progress indicators

## **Data Validation**
- ✅ **Email Validation**: Verify email formats
- ✅ **URL Validation**: Check link formats
- ✅ **Required Fields**: Prevent empty required fields
- ✅ **Character Limits**: Enforce text length limits - adjusted to font and size of component , alert the user if the data he provided for a singal component crossed the limit . 

🔧 Technical Setup & Development Guide

  Project Structure

  Here's the recommended folder structure for your new template:

  src/templates/your-new-template/
  ├── app/
  │   ├── page.tsx              # Main template page
  │   ├── layout.tsx            # Template layout
  │   └── globals.css           # Template-specific styles
  ├── components/
  │   ├── ui/                   # Reusable UI components
  │   ├── sections/             # Section components (hero, experience, etc.)
  │   ├── cards/                # SmartCard implementations
  │   └── layout/               # Layout components
  ├── lib/
  │   ├── cv-data-adapter.tsx   # CRITICAL: Data transformation layer
  │   ├── data.tsx              # Type definitions and demo data
  │   └── utils.ts              # Utility functions
  ├── styles/                   # Additional styling if needed
  ├── package.json              # Template dependencies
  ├── tailwind.config.js        # Tailwind configuration
  └── postcss.config.mjs        # PostCSS config (MUST include autoprefixer!)

  Reference Template

  ✅ You'll receive the complete v1.5 template (src/templates/v0_template_v1.5/) as your reference. Study these files carefully:

  - cv-data-adapter.tsx - Shows how to transform CV data to template format
  - page.tsx - Main template structure and edit mode integration
  - Component patterns - How sections, cards, and editing work together

  Local Development Setup

  Prerequisites

  node >= 18.0.0
  python >= 3.11
  pnpm >= 8.0.0

  Setup Commands

  # 1. Navigate to project root
  cd CV2WEB-V4

  # 2. Install dependencies (use pnpm, NOT npm/yarn)
  pnpm install

  # 3. Setup Python backend (if testing full system)
  python3 -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  pip install -r requirements.txt

  # 4. Start development servers
  # Frontend (your template)
  pnpm run dev  # Runs on http://localhost:3000

  # Backend (for testing data injection)
  source venv/bin/activate
  uvicorn main:app --reload --port 2000  # Runs on http://localhost:2000

  Development Workflow

  # Type checking (MUST run before commits)
  pnpm run typecheck

  # Build for production
  pnpm run build

  # Start production build
  pnpm run start

  Build & Deployment Process

  Technology Stack

  - Framework: Next.js 15 (App Router)
  - Runtime: React 18+ with TypeScript
  - Styling: Tailwind CSS v4
  - Build System: Next.js built-in webpack
  - Deployment: Vercel (automatic deployment)

  Build Process

  1. Development: Next.js dev server with hot reload
  2. Production Build: next build creates optimized bundle
  3. Static Generation: Next.js generates static files where possible
  4. Deployment: Automatic deployment to Vercel on git push

  Critical Requirements

  // postcss.config.mjs - MUST include both plugins!
  const config = {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},  // ⚠️ REQUIRED - Without this, CSS won't load!
    },
  };

  Data Integration

  How Your Template Receives Data

  // Your cv-data-adapter.tsx will receive this structure:
  import { CVData } from '@/types'  // The 17-section structure you documented

  // Transform it to your template's needs:
  export const adaptCVData = (cvData: CVData): YourTemplateData => {
    return {
      hero: {
        name: cvData.hero?.fullName || "Your Name",
        title: cvData.hero?.professionalTitle || "Professional",
        // ... your transformations
      }
    }
  }

  Platform Communication

  // Edit mode integration - these are provided by the platform:
  import { useEditMode } from '@/contexts/edit-mode-context'
  import { EditableText } from '@/components/ui/editable-text'
  import { DraggableList } from '@/components/draggable-list'

  // Save changes back to platform:
  const handleSave = (path: string, value: any) => {
    // Platform handles data persistence
  }

  Template Registration

  Once built, your template will be registered in:
  # src/api/routes/portfolio_generator.py
  AVAILABLE_TEMPLATES = {
      "v0_template_1": "/src/templates/v0_template_1",
      "your_new_template": "/src/templates/your-new-template",  # Your template here
  }

  Key Integration Points

  1. Data Adapter (Most Important)

  // lib/cv-data-adapter.tsx - This is your main integration point
  export const adaptCVData = (cvData: CVData): TemplateData => {
    // Transform the standardized CV data to your template's format
  }

  2. Edit Mode Support

  // Your components should support edit mode:
  import { useEditMode } from '@/contexts/edit-mode-context'

  const { isEditMode } = useEditMode()
  // Show different UI based on edit state

  3. Theme Integration

  // Use the platform's theme system:
  import { useTheme } from '@/components/theme/theme-provider'

  const { theme } = useTheme()
  // Access theme colors and apply them

  Development Tips

  - Study v1.5 template first - understand the patterns before building
  - Start with basic layout - add edit features incrementally
  - Test with real CV data - use examples from data/cv_examples/
  - Always run typecheck before committing
  - Use absolute imports - @/components/... not relative paths


##🔌 Platform Integration Guide

  Data Injection

  Your template receives CV data through a simple JSON injection process:

  // The platform will generate a file: lib/injected-data.tsx
  export const useRealData = true
  export const portfolioData = {
    hero: { fullName: "John Doe", ... },
    experience: [...],
    // All 17 sections as documented
  }

  // In your template's page.tsx:
  import { portfolioData } from '@/lib/injected-data'

  // Use it in your cv-data-adapter.tsx:
  const templateData = adaptCVData(portfolioData)

  That's it! The platform handles extracting CV data and injecting it. You just need to:
  1. Import the data
  2. Transform it to your template's format using your adapter
  3. Display it beautifully

  Parent Platform Communication

  Communication is minimal and straightforward:

  // Save changes - the platform provides this
  const handleSave = (path: string, value: any) => {
    // Just call this when user edits something
    // Platform handles everything else
  }

  // Example usage:
  <EditableText
    initialValue={data.hero.name}
    onSave={(newValue) => handleSave('hero.name', newValue)}
  />

  // For events (like adding new items):
  window.parent.postMessage({
    type: 'ADD_ITEM',
    section: 'projects',
    item: { ... }
  }, '*')

  The platform manages all data persistence, you just notify it of changes.

  Component Strategy

  Build from scratch! This ensures your template is unique and memorable. However:

  Recommended High-Quality Libraries:

  - https://ui.aceternity.com/ - Beautiful animated components
  - https://magicui.design/ - Modern UI components
  - https://www.framer.com/motion/ - Smooth animations
  - https://www.radix-ui.com/ - Accessible component primitives
  - https://ui.shadcn.com/ - Copy-paste components

  Feel free to use any high-quality component libraries that fit your vision. The goal is a stunning, unique portfolio.

  Template Registration

  Once your template is complete:

  1. Place it in: src/templates/your-template-name/
  2. We'll register it by adding one line:
  AVAILABLE_TEMPLATES = {
      "existing_template": "...",
      "your_template_name": "/src/templates/your-template-name"
  }
  3. It becomes available for users to select when generating portfolios

  That's the entire registration process - we handle the rest!

 Data Handling

  Edge Cases & Error States

  Your template must gracefully handle these common scenarios:

  - Empty Sections: Hide sections that have no data. Don't show empty containers or headers for missing sections. For example, if there are no publications, the entire Publications section should not render.
  - Missing Images:
    - For profile photos: Use a default avatar placeholder (you can use initials or a generic user icon)
    - For project images: Either hide the image container or show a subtle placeholder
    - Never show broken image icons
  - Long Text:
    - Implement "Read more" / "Show less" functionality for descriptions exceeding 500 characters
    - This applies to: job descriptions, project descriptions, volunteer descriptions, etc.
    - Show first ~500 chars with ellipsis (...) and expandable button
  - Loading States:
    - Use skeleton screens or loading placeholders while data is being injected
    - Smooth transitions when content appears
    - Consider using shimmer effects for better UX
  - Error Messages:
    - Display user-friendly messages if something fails
    - Examples: "Failed to load image", "Unable to save changes"
    - Use toast notifications or inline error messages
    - Never show technical error details to users

  Additional Data Considerations

  - Fallback Values: Always provide sensible defaults
  const name = data.hero?.fullName || "Your Name"
  const title = data.hero?.professionalTitle || "Professional"
  - Array Handling: Check for empty arrays before mapping
  {data.experience?.length > 0 && (
    <ExperienceSection items={data.experience} />
  )}
  - URL Validation: Verify URLs before using them
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }