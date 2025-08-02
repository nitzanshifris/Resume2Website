/**
 * Auto-generated CV data for portfolio
 * Generated at: 2025-08-02T02:00:00.000000
 * Template: v0_template_v2.1
 */

import { mapCvDataToSections } from './data-mapper'

// CV Data from extraction (CV2WEB format)
const extractedCVData = {
  "hero": {
    "fullName": "Your Name",
    "professionalTitle": "Your Professional Title",
    "summaryTagline": "Your professional summary or tagline",
    "profilePhotoUrl": null
  },
  "contact": {
    "email": "your.email@example.com",
    "phone": "(555) 123-4567",
    "location": {
      "city": "Your City",
      "state": "Your State",
      "country": "Your Country"
    },
    "professionalLinks": [
      {
        "platform": "LinkedIn",
        "url": "https://linkedin.com/in/yourprofile"
      },
      {
        "platform": "GitHub", 
        "url": "https://github.com/yourprofile"
      }
    ],
    "availability": "Available for new opportunities"
  },
  "summary": {
    "summaryText": "Professional summary text describing your experience, skills, and career objectives.",
    "yearsOfExperience": 5,
    "keySpecializations": [
      "Specialization 1",
      "Specialization 2", 
      "Specialization 3"
    ],
    "careerHighlights": [
      "Achievement 1",
      "Achievement 2",
      "Achievement 3"
    ]
  },
  "experience": {
    "sectionTitle": "Professional Experience",
    "experienceItems": [
      {
        "jobTitle": "Your Job Title",
        "companyName": "Company Name",
        "location": {
          "city": "City",
          "state": "State",
          "country": "Country"
        },
        "dateRange": {
          "startDate": "JANUARY 2020",
          "endDate": "PRESENT",
          "isCurrent": true
        },
        "responsibilitiesAndAchievements": [
          "Key responsibility or achievement 1",
          "Key responsibility or achievement 2",
          "Key responsibility or achievement 3"
        ],
        "technologiesUsed": [
          "Technology 1",
          "Technology 2",
          "Technology 3"
        ]
      }
    ]
  },
  "education": {
    "sectionTitle": "Education",
    "educationItems": [
      {
        "degree": "Your Degree",
        "fieldOfStudy": "Field of Study",
        "institution": "University Name",
        "location": {
          "city": "City",
          "state": "State", 
          "country": "Country"
        },
        "dateRange": {
          "startDate": "SEPTEMBER 2016",
          "endDate": "MAY 2020",
          "isCurrent": false
        },
        "gpa": "3.8",
        "honors": ["Dean's List", "Magna Cum Laude"]
      }
    ]
  },
  "skills": {
    "sectionTitle": "Technical Skills",
    "skillCategories": [
      {
        "categoryName": "Programming Languages",
        "skills": [
          "JavaScript",
          "Python",
          "Java",
          "TypeScript"
        ]
      },
      {
        "categoryName": "Frameworks & Libraries",
        "skills": [
          "React",
          "Node.js",
          "Express",
          "Next.js"
        ]
      }
    ]
  },
  "projects": {
    "sectionTitle": "Featured Projects",
    "projectItems": [
      {
        "title": "Project Title",
        "role": "Your Role",
        "duration": "3 months",
        "description": "Brief description of the project and your contributions.",
        "technologiesUsed": [
          "Technology 1",
          "Technology 2"
        ],
        "projectUrl": "https://project-demo.com",
        "githubUrl": "https://github.com/yourproject"
      }
    ]
  }
}

// Convert CV data to template format using the v2.1 data mapper
export const portfolioData = mapCvDataToSections(extractedCVData)

// Force use of real data instead of sample data
export const useRealData = false // Disabled to use demo API data instead

// Export extracted data for compatibility
export { extractedCVData }