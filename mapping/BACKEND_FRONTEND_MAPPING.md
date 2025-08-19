# Backend to Frontend Data Mapping Guide

## Overview
This document compares the backend-extracted JSON structure with the frontend template expectations, section by section.

## 1. HERO SECTION

### Backend Structure:
```json
{
  "hero": {
    "fullName": "ALEXANDER TAYLOR",
    "professionalTitle": "Senior Product Manager | SaaS | UX Optimization",
    "profilePhotoUrl": null,
    "summaryTagline": null  // Missing in some extractions
  }
}
```

### Frontend Expects:
```typescript
{
  hero: {
    fullName: string,
    professionalTitle: string,
    summaryTagline?: string,  // Optional tagline
    profilePhotoUrl?: string  // Optional photo URL
  }
}
```

**Status:** ✅ MATCHED

---

## 2. CONTACT SECTION

### Backend Structure:
```json
{
  "contact": {
    "email": "help@enhancv.com",
    "phone": "+1-(234)-555-1234",
    "location": {
      "city": "Dallas",
      "state": "Texas",
      "country": "United States"
    },
    "professionalLinks": [
      {
        "platform": "linkedin.com",
        "url": "Not available (extracted from image)"
      }
    ],
    "availability": null,
    "placeOfBirth": null,
    "nationality": null,
    "drivingLicense": null,
    "dateOfBirth": null,
    "maritalStatus": null,
    "visaStatus": null
  }
}
```

### Frontend Expects:
```typescript
{
  contact: {
    email: string,
    phone?: string,
    location: string,  // Frontend wants a string, backend sends object!
    availability?: string,
    professionalLinks: Array<{
      platform: string,
      url: string
    }>
  }
}
```

**Status:** ⚠️ NEEDS FIX - Location format mismatch

---

## 3. SUMMARY SECTION

### Backend Structure:
```json
{
  "summary": {
    "summaryText": "Seasoned Product Manager with over 5 years...",
    "yearsOfExperience": 5,
    "keySpecializations": ["SaaS startups", "customer experience"],
    "careerHighlights": ["leading a product feature that increased..."]
  }
}
```

### Frontend Expects:
```typescript
{
  summary: {
    summaryText: string,
    yearsOfExperience?: number,
    keySpecializations?: string[]
    // Note: careerHighlights not used in frontend
  }
}
```

**Status:** ✅ MOSTLY MATCHED (careerHighlights ignored)

---

## 4. EXPERIENCE SECTION

### Backend Structure:
```json
{
  "experience": {
    "sectionTitle": "EXPERIENCE",
    "experienceItems": [
      {
        "jobTitle": "Senior Product Manager",
        "companyName": "InnovateTech Solutions",
        "location": {
          "city": "Dallas",
          "state": "Texas",
          "country": "United States"
        },
        "dateRange": {
          "startDate": "06/2020",
          "endDate": "Present",
          "isCurrent": true
        },
        "remoteWork": null,
        "responsibilitiesAndAchievements": ["Developed and launched..."],
        "technologiesUsed": ["React", "Node.js"],
        "summary": null,
        "employmentType": null,
        "teamSize": 10,
        "reportingTo": null,
        // MISSING Smart Card fields:
        "videoUrl": null,
        "githubUrl": null,
        "imageUrl": null,
        "linkUrl": null,
        "hasLink": null,
        "linkType": null,
        "viewMode": null,
        "textVariant": null
      }
    ]
  }
}
```

### Frontend Expects:
```typescript
{
  experience: {
    sectionTitle: string,
    experienceItems: Array<{
      jobTitle: string,
      company: string,  // Backend uses "companyName"!
      dateRange: { startDate: string, endDate: string, isCurrent?: boolean },
      description?: string,  // Backend uses "responsibilitiesAndAchievements" array!
      responsibilities?: string[],  // Backend field name differs
      technologies?: string[],  // Backend uses "technologiesUsed"
      // Smart Card fields (NOW ADDED to backend schema):
      videoUrl?: string,
      githubUrl?: string,
      imageUrl?: string,
      linkUrl?: string,
      hasLink?: boolean,
      linkType?: string,
      viewMode?: string,  // Should be 'timeline' for experience
      textVariant?: string  // Should be 'detailed'
    }>
  }
}
```

**Status:** ⚠️ NEEDS MAPPING - Field name mismatches

---

## 5. EDUCATION SECTION

### Backend Structure:
```json
{
  "education": {
    "sectionTitle": "EDUCATION",
    "educationItems": [
      {
        "degree": "Master of Science in Marketing Analytics",
        "fieldOfStudy": "Marketing",
        "institution": "University of California, Berkeley",
        "location": {
          "city": "Berkeley",
          "state": "California",
          "country": "United States"
        },
        "dateRange": {
          "startDate": "2014",
          "endDate": "2016"
        },
        "gpa": null,
        "honors": null,
        "relevantCoursework": null,
        "exchangePrograms": null,
        "minors": null,
        // Smart Card fields added but need to be populated
        "videoUrl": null,
        "githubUrl": null,
        "imageUrl": null,
        "linkUrl": null,
        "hasLink": null,
        "linkType": null,
        "viewMode": null,  // Should be 'timeline'
        "textVariant": null
      }
    ]
  }
}
```

### Frontend Expects:
```typescript
{
  education: {
    sectionTitle: string,
    educationItems: Array<{
      degree: string,
      fieldOfStudy?: string,
      institution: string,
      dateRange?: { startDate: string, endDate: string },
      gpa?: number,
      honors?: string[],
      relevantCoursework?: string[],
      description?: string,
      // Smart Card fields:
      imageUrl?: string,
      linkUrl?: string,
      hasLink?: boolean,
      linkType?: string,
      viewMode?: string,  // 'timeline' for education
      textVariant?: string  // 'detailed'
    }>
  }
}
```

**Status:** ✅ MOSTLY MATCHED (location not used in frontend)

---

## 6. SKILLS SECTION

### Backend Structure:
```json
{
  "skills": {
    "sectionTitle": "SKILLS",
    "skillCategories": [
      {
        "categoryName": "Product Management",
        "skills": ["User Research", "Agile Methodologies", "Product Strategy"]
      }
    ],
    "ungroupedSkills": ["Leadership", "Public Speaking"]
  }
}
```

### Frontend Expects:
```typescript
{
  skills: {
    sectionTitle: string,
    skillCategories: Array<{
      categoryName: string,
      skills: string[]
    }>,
    ungroupedSkills?: string[]
  }
}
```

**Status:** ✅ MATCHED

---

## 7. PROJECTS SECTION

### Backend Structure:
```json
{
  "projects": {
    "sectionTitle": "PROJECTS",
    "projectItems": [
      {
        "projectTitle": "Product Launch: AI-Powered Analytics Dashboard",
        "role": null,
        "dateRange": null,
        "description": "Led the end-to-end product development...",
        "outcomes": "resulting in $2M in new revenue",
        "technologiesUsed": ["Python", "React"],
        "projectUrl": null,
        "imageUrl": null,
        "projectMetrics": null,
        // Smart Card fields added:
        "videoUrl": null,
        "githubUrl": null,
        "linkUrl": null,
        "hasLink": null,
        "linkType": null,
        "viewMode": null,
        "textVariant": null
      }
    ]
  }
}
```

### Frontend Expects:
```typescript
{
  projects: {
    sectionTitle: string,
    projectItems: Array<{
      projectTitle: string,
      role?: string,
      dateRange?: { startDate: string, endDate: string },
      description?: string,
      technologies?: string[],  // Backend uses "technologiesUsed"
      outcomes?: string,
      // Smart Card fields:
      projectUrl?: string,
      githubUrl?: string,
      videoUrl?: string,
      imageUrl?: string,
      linkUrl?: string,
      hasLink?: boolean,
      linkType?: string,
      viewMode?: string,  // Determined by URL type
      textVariant?: string  // 'detailed'
    }>
  }
}
```

**Status:** ⚠️ NEEDS MAPPING - "technologiesUsed" → "technologies"

---

## 8. ACHIEVEMENTS SECTION

### Backend Structure:
```json
{
  "achievements": {
    "sectionTitle": "KEY ACHIEVEMENTS",
    "achievements": [
      {
        "value": "30%",
        "label": "Increase in user retention",
        "contextOrDetail": "through feature optimization",
        "timeframe": null,
        // Smart Card fields added:
        "videoUrl": null,
        "githubUrl": null,
        "imageUrl": null,
        "linkUrl": null,
        "hasLink": null,
        "linkType": null,
        "viewMode": null,
        "textVariant": null
      }
    ]
  }
}
```

### Frontend Expects:
```typescript
{
  achievements: {
    sectionTitle: string,
    achievements: Array<{
      value: string,
      label: string,
      contextOrDetail?: string,
      timeframe?: string,
      // Smart Card fields:
      linkUrl?: string,
      imageUrl?: string,
      videoUrl?: string,
      hasLink?: boolean,
      linkType?: string,
      viewMode?: string,
      textVariant?: string  // 'detailed'
    }>
  }
}
```

**Status:** ✅ MATCHED

---

## 9. CERTIFICATIONS SECTION

### Backend Structure:
```json
{
  "certifications": {
    "sectionTitle": "CERTIFICATIONS",
    "certificationItems": [
      {
        "title": "Certified Scrum Product Owner (CSPO)",
        "issuingOrganization": "Scrum Alliance",
        "issueDate": "2021",
        "expirationDate": null,
        "credentialId": null,
        "verificationUrl": null,
        // Smart Card fields added:
        "videoUrl": null,
        "githubUrl": null,
        "imageUrl": null,
        "linkUrl": null,
        "hasLink": null,
        "linkType": null,
        "viewMode": null,
        "textVariant": null
      }
    ]
  }
}
```

### Frontend Expects:
```typescript
{
  certifications: {
    sectionTitle: string,
    certificationItems: Array<{
      title: string,
      organization: string,  // Backend uses "issuingOrganization"!
      dateObtained?: string,  // Backend uses "issueDate"!
      expirationDate?: string,
      credentialId?: string,
      verificationUrl?: string,
      // Smart Card fields:
      imageUrl?: string,
      linkUrl?: string,
      hasLink?: boolean,
      linkType?: string,
      viewMode?: string,
      textVariant?: string  // 'detailed'
    }>
  }
}
```

**Status:** ⚠️ NEEDS MAPPING - Field name mismatches

---

## 10. LANGUAGES SECTION

### Backend Structure:
```json
{
  "languages": {
    "sectionTitle": "LANGUAGES",
    "languageItems": [
      {
        "language": "English",
        "proficiency": "Native",
        "certification": null
      }
    ]
  }
}
```

### Frontend Expects:
```typescript
{
  languages: {
    sectionTitle: string,
    languageItems: Array<{
      language: string,
      proficiency: string,
      certification?: string
    }>
  }
}
```

**Status:** ✅ MATCHED

---

## 11. VOLUNTEER SECTION

### Backend Structure:
```json
{
  "volunteer": {
    "sectionTitle": "VOLUNTEER EXPERIENCE",
    "volunteerItems": [
      {
        "role": "Product Strategy Mentor",
        "organization": "TechMentors",
        "location": null,
        "dateRange": {
          "startDate": "2021",
          "endDate": "Present"
        },
        "description": "Mentored 10+ aspiring product managers...",
        "impact": null,
        "commitment": null,
        // Smart Card fields added:
        "videoUrl": null,
        "githubUrl": null,
        "imageUrl": null,
        "linkUrl": null,
        "hasLink": null,
        "linkType": null,
        "viewMode": null,
        "textVariant": null
      }
    ]
  }
}
```

### Frontend Expects:
```typescript
{
  volunteer: {
    sectionTitle: string,
    volunteerItems: Array<{
      role: string,
      organization: string,
      dateRange?: { startDate: string, endDate: string },
      description?: string,
      impact?: string,
      // Smart Card fields:
      imageUrl?: string,
      githubUrl?: string,
      linkUrl?: string,
      hasLink?: boolean,
      linkType?: string,
      viewMode?: string,
      textVariant?: string  // 'detailed'
    }>
  }
}
```

**Status:** ✅ MATCHED

---

## 12. PUBLICATIONS SECTION

### Backend Structure:
```json
{
  "publications": {
    "sectionTitle": "PUBLICATIONS",
    "publications": [
      {
        "title": "The Future of SaaS Product Management",
        "publicationType": "Article",
        "venue": "Product Management Today",
        "datePublished": "2023",
        "coAuthors": null,
        "doi": null,
        "publicationUrl": null,
        "abstract": null,
        // Smart Card fields added:
        "videoUrl": null,
        "githubUrl": null,
        "imageUrl": null,
        "linkUrl": null,
        "hasLink": null,
        "linkType": null,
        "viewMode": null,
        "textVariant": null
      }
    ]
  }
}
```

### Frontend Expects:
```typescript
{
  publications: {
    sectionTitle: string,
    publications: Array<{
      title: string,
      publicationType?: string,
      venue?: string,
      datePublished?: string,
      coAuthors?: string[],
      abstract?: string,
      publicationUrl?: string,
      // Smart Card fields:
      linkUrl?: string,
      videoUrl?: string,
      hasLink?: boolean,
      linkType?: string,
      viewMode?: string,
      textVariant?: string  // 'detailed'
    }>
  }
}
```

**Status:** ✅ MATCHED

---

## 13. SPEAKING SECTION

### Backend Structure:
```json
{
  "speaking": {
    "sectionTitle": "SPEAKING ENGAGEMENTS",
    "speakingEngagements": [
      {
        "eventName": "ProductCon 2023",
        "topic": "Building Customer-Centric Products",
        "venue": "San Francisco, CA",
        "date": "June 2023",
        "audienceSize": null,
        "eventUrl": null,
        "presentationUrl": null,
        // Smart Card fields added:
        "videoUrl": null,
        "githubUrl": null,
        "imageUrl": null,
        "linkUrl": null,
        "hasLink": null,
        "linkType": null,
        "viewMode": null,
        "textVariant": null
      }
    ]
  }
}
```

### Frontend Expects:
```typescript
{
  speaking: {
    sectionTitle: string,
    speakingEngagements: Array<{
      eventName: string,
      topic?: string,
      venue?: string,
      date?: string,
      audienceSize?: number,
      eventUrl?: string,
      presentationUrl?: string,
      // Smart Card fields:
      videoUrl?: string,
      linkUrl?: string,
      hasLink?: boolean,
      linkType?: string,
      viewMode?: string,
      textVariant?: string  // 'detailed'
    }>
  }
}
```

**Status:** ✅ MATCHED

---

## 14. COURSES SECTION

### Backend Structure:
```json
{
  "courses": {
    "sectionTitle": "PROFESSIONAL DEVELOPMENT",
    "courseItems": [
      {
        "courseName": "Advanced Product Analytics",
        "institution": "Product School",
        "completionDate": "2022",
        "certificateNumber": null,
        "certificateUrl": null,
        "description": null,
        // Smart Card fields added:
        "videoUrl": null,
        "githubUrl": null,
        "imageUrl": null,
        "linkUrl": null,
        "hasLink": null,
        "linkType": null,
        "viewMode": null,
        "textVariant": null
      }
    ]
  }
}
```

### Frontend Expects:
```typescript
{
  courses: {
    sectionTitle: string,
    courseItems: Array<{
      courseName: string,
      institution?: string,
      completionDate?: string,
      certificateUrl?: string,
      description?: string,
      // Smart Card fields:
      videoUrl?: string,
      linkUrl?: string,
      hasLink?: boolean,
      linkType?: string,
      viewMode?: string,
      textVariant?: string  // 'detailed'
    }>
  }
}
```

**Status:** ✅ MATCHED

---

## 15. MEMBERSHIPS SECTION

### Backend Structure:
```json
{
  "memberships": {
    "sectionTitle": "PROFESSIONAL MEMBERSHIPS",
    "memberships": [
      {
        "organizationName": "Product Management Association",
        "membershipType": "Professional Member",
        "role": null,
        "dateRange": {
          "startDate": "2020",
          "endDate": "Present"
        },
        "description": null,
        // Smart Card fields added:
        "videoUrl": null,
        "githubUrl": null,
        "imageUrl": null,
        "linkUrl": null,
        "hasLink": null,
        "linkType": null,
        "viewMode": null,
        "textVariant": null
      }
    ]
  }
}
```

### Frontend Expects:
```typescript
{
  memberships: {
    sectionTitle: string,
    memberships: Array<{
      organizationName: string,
      membershipType?: string,
      role?: string,
      dateRange?: { startDate: string, endDate: string },
      description?: string,
      // Smart Card fields:
      linkUrl?: string,
      imageUrl?: string,
      hasLink?: boolean,
      linkType?: string,
      viewMode?: string,
      textVariant?: string  // 'detailed'
    }>
  }
}
```

**Status:** ✅ MATCHED

---

## 16. HOBBIES SECTION

### Backend Structure:
```json
{
  "hobbies": {
    "sectionTitle": "HOBBIES & INTERESTS",
    "hobbies": ["Photography", "Hiking", "Reading"],
    "hobbyItems": [  // New structure with smart cards
      {
        "title": "Photography",
        "description": null,
        "videoUrl": null,
        "githubUrl": null,
        "imageUrl": null,
        "linkUrl": null,
        "hasLink": null,
        "linkType": null,
        "viewMode": null,
        "textVariant": null  // Should be 'simple' for hobbies
      }
    ]
  }
}
```

### Frontend Expects:
```typescript
{
  hobbies: {
    sectionTitle: string,
    hobbies?: string[],  // Legacy simple list
    hobbyItems?: Array<{  // New smart card structure
      title: string,
      description?: string,
      // Smart Card fields:
      videoUrl?: string,
      githubUrl?: string,
      imageUrl?: string,
      linkUrl?: string,
      hasLink?: boolean,
      linkType?: string,
      viewMode?: string,
      textVariant?: string  // 'simple' for hobbies
    }>
  }
}
```

**Status:** ✅ MATCHED (supports both formats)

---

## 17. PATENTS SECTION

### Backend Structure:
```json
{
  "patents": {
    "sectionTitle": "PATENTS",
    "patentItems": [
      {
        "title": "Method for Real-Time User Analytics",
        "patentNumber": "US10123456",
        "status": "Pending",
        "dateIssued": null,
        "description": "A novel approach to tracking user behavior..."
      }
    ]
  }
}
```

### Frontend Expects:
```typescript
{
  patents: {
    sectionTitle: string,
    patentItems: Array<{
      title: string,
      patentNumber?: string,
      status?: string,
      dateIssued?: string,
      description?: string
    }>
  }
}
```

**Status:** ✅ MATCHED

---

## 18. TESTIMONIALS SECTION

### Backend Structure:
```json
{
  "testimonials": {
    "sectionTitle": "TESTIMONIALS",
    "testimonialItems": [
      {
        "name": "Jane Smith",
        "role": "CEO",
        "company": "TechCorp",
        "text": "Alex is an exceptional product manager...",
        "date": "2023"
      }
    ]
  }
}
```

### Frontend Expects:
```typescript
{
  testimonials: {
    sectionTitle: string,
    testimonialItems: Array<{
      name: string,
      role?: string,
      company?: string,
      text: string,
      date?: string
    }>
  }
}
```

**Status:** ✅ MATCHED

---

## KEY ISSUES TO FIX IN CV-DATA-ADAPTER

### 1. Field Name Mappings Needed:
- `contact.location` - Backend sends object, frontend needs string
- `experience.companyName` → `experience.company`
- `experience.responsibilitiesAndAchievements` → `experience.responsibilities` (array)
- `experience.technologiesUsed` → `experience.technologies`
- `projects.technologiesUsed` → `projects.technologies`
- `certifications.issuingOrganization` → `certifications.organization`
- `certifications.issueDate` → `certifications.dateObtained`

### 2. Smart Card Fields:
All smart card fields are now added to the backend schema but need to be:
1. Populated by the enhancement_processor.py
2. Set proper defaults:
   - `viewMode: 'timeline'` for Education & Experience
   - `textVariant: 'simple'` for Hobbies
   - `textVariant: 'detailed'` for all other sections

### 3. Missing Data Processing:
- URLs need to be extracted from text descriptions
- URL types need to be classified (video, github, image, website)
- `hasLink` needs to be set based on URL presence
- `linkType` needs to be determined from URL pattern

## NEXT STEPS:
1. ✅ Backend schema updated with smart card fields
2. ✅ Enhancement processor updated to populate smart card fields
3. ⚠️ Need to update cv-data-adapter.tsx to handle field name mappings
4. ⚠️ Need to test with real CV extraction to verify smart card data population