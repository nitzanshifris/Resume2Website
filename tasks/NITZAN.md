{
  "backend_path": "hero.summaryTagline",
  "frontend_location": "cv-data-adapter.tsx:215",
  "issue": "Field is extracted and mapped in adapter but NOT displayed in hero section",
  "recommendation": "Add summaryTagline display below professionalTitle or as subtitle"     -done
},

IF LINK - SHOW LINK -    
"frontend_expectation": "projects.projectItems[].viewMode",
"frontend_location": "cv-data-adapter.tsx:463",
"current_handling": "Determined by URL analysis",
"recommendation": "Keep auto-detection logic"               -done
},

{
  "backend_path": "experience.experienceItems[].technologiesUsed",
  "frontend_location": "app/page.tsx:696",
  "issue": "Technologies field exists in add item but not properly displayed in experience cards",
  "recommendation": "Display technologies as badges below job description" -done
},


{
  "backend_path": "achievements.achievements[].timeframe",
  "frontend_location": "cv-data-adapter.tsx:503",
  "issue": "Timeframe mapped to 'year' field, losing specificity",
  "recommendation": "Display full timeframe string if more than just year" 
},

PROJECTS SECTION : SHOW AS PART OF DECRIPTION 
{
  "backend_path": "projects.projectItems[].technologiesUsed",
  "frontend_location": "cv-data-adapter.tsx:472",
  "issue": "Technologies mapped but display depends on viewMode",
  "recommendation": "Always show technologies as tech stack badges"
},

{
  "backend_path": "summary.yearsOfExperience",
  "data_type": "number | null",
  "importance": "medium",
  "recommendation": "Display as highlight badge in summary section"        
},
{
  "backend_path": "summary.keySpecializations",
  "data_type": "array | null",
  "importance": "high",
  "recommendation": "Display as tags or badges below summary text"
},
{
  "backend_path": "summary.careerHighlights",
  "data_type": "array | null",
  "importance": "high",
  "recommendation": "Display as bullet points or achievement cards"     -go in achievments section 
},

"frontend_expectation": "testimonials.testimonialItems[].avatar",
"frontend_location": "app/page.tsx:1089",
"current_handling": "Empty field",
"recommendation": "Backend should provide when testimonials added"
},
{
"frontend_expectation": "testimonials.testimonialItems[].rating",
"frontend_location": "app/page.tsx:1090",
"current_handling": "Default to 5",
"recommendation": "Optional rating system"
}
]
},
"frontend_expectation": "projects.projectItems[].githubUrl",
"frontend_location": "cv-data-adapter.tsx:454",
"current_handling": "Detected from projectUrl if GitHub",
"recommendation": "Backend could provide separately"
},
{
"frontend_expectation": "projects.projectItems[].demoUrl",
"frontend_location": "cv-data-adapter.tsx:455",
"current_handling": "Not provided by backend",
"recommendation": "Add to backend schema"
},
{
"frontend_expectation": "projects.projectItems[].videoUrl",
"frontend_location": "cv-data-adapter.tsx:453",
"current_handling": "Auto-detected from URLs",
"recommendation": "Backend could provide separately"
},
{
"frontend_expectation": "education.educationItems[].imageUrl",
"frontend_location": "app/page.tsx:615",
"current_handling": "Not provided, optional field",
"recommendation": "Could add institution logos"
},

"hardcoded_content": {
  "description": "Static content that could be dynamic",
  "instances": [
    {
      "location": "components/contact-section.tsx:51",
      "current_value": "Let's Create Together",
      "should_be": "Dynamic heading from backend or customizable",
      "backend_fields_needed": ["contact.ctaHeading"]
    },
    {
      "location": "components/contact-section.tsx:126",
      "current_value": "michelle-lopez-cv.pdf",
      "should_be": "Dynamic filename based on user's name",
      "backend_fields_needed": ["hero.fullName"]
    },
    {
      "location": "app/page.tsx:836-855",
      "current_value": "No projects added yet / Add Your First Project",
      "should_be": "Configurable empty state messages",
      "backend_fields_needed": ["ui.emptyStateMessages"]
    },
    {
      "location": "cv-data-adapter.tsx:213-216",
      "current_value": "Default fallback values in adapter",
      "should_be": "Backend should provide all values or null",
      "backend_fields_needed": ["All hero fields"]
    }
  ]
},

"duplicate_mappings": {
  "description": "Same backend data used in multiple places",
  "instances": [
    {
      "backend_path": "hero.fullName",
      "frontend_locations": [
        "components/hero-section.tsx:316",
        "components/hero-section.tsx:170 (alt text)",
        "potentially in CV download filename"
      ],
      "note": "Name used consistently across template"
    },
    {
      "backend_path": "contact.email",
      "frontend_locations": [
        "components/contact-section.tsx:80",
        "potentially in contact form mailto"
      ],
      "note": "Email used for display and functionality"
    },
    {
      "backend_path": "projects.projectItems[].title",
      "frontend_locations": [
        "app/page.tsx:816",
        "app/page.tsx:824 (modal title)"
      ],
      "note": "Title used in card and modal"
    }
  ]
}
},


{
  "backend_path": "skills.proficiencyIndicators",
  "data_type": "object | null",
  "importance": "medium",
  "recommendation": "Use for skill level visualization"
},
{
  "backend_path": "projects.projectItems[].role",
  "data_type": "string | null",
  "importance": "medium",
  "recommendation": "Display as subtitle in project cards"
},
{
  "backend_path": "projects.projectItems[].duration",
  "data_type": "string | null",
  "importance": "low",
  "recommendation": "Display with project details"
},
{
  "backend_path": "projects.projectItems[].keyFeatures",
  "data_type": "array | null",
  "importance": "medium",
  "recommendation": "Display as bullet points or badges"
},
{
  "backend_path": "projects.projectItems[].projectMetrics",
  "data_type": "object | null",
  "importance": "high",
  "recommendation": "Display as achievement badges"
},
{
  "backend_path": "certifications.certificationItems[].expirationDate",
  "data_type": "string | null",
  "importance": "medium",
  "recommendation": "Display if certification expires" - remove from backend extraction 
},
{
  "backend_path": "certifications.certificationItems[].credentialId",
  "data_type": "string | null",
  "importance": "low",
  "recommendation": "Display in detailed view" 
},

{
  "backend_path": "volunteer.volunteerItems[].responsibilities",
  "data_type": "array | null",
  "importance": "medium",
  "recommendation": "Display as bullet points"
},
{
  "backend_path": "volunteer.volunteerItems[].impactMetrics",
  "data_type": "object | null",
  "importance": "high",
  "recommendation": "Display as achievement badges"
},
{
  "backend_path": "volunteer.volunteerItems[].commitment",
  "data_type": "string | null",
  "importance": "low",
  "recommendation": "Display time commitment if relevant"
},
{
  "backend_path": "publications.publications[].authors",
  "data_type": "array | null",
  "importance": "medium",
  "recommendation": "Display co-authors if multiple"
},
{
  "backend_path": "publications.publications[].doi",
  "data_type": "string | null",
  "importance": "low",
  "recommendation": "Include as metadata link"
},
{
  "backend_path": "publications.publications[].abstract",
  "data_type": "string | null",
  "importance": "low",
  "recommendation": "Show in expanded view"
},
{
  "backend_path": "speaking.speakingEngagements[].audienceSize",
  "data_type": "number | null",
  "importance": "low",
  "recommendation": "Display as metric badge"
},
{
  "backend_path": "speaking.speakingEngagements[].eventUrl",
  "data_type": "string | null",
  "importance": "medium",
  "recommendation": "Add as clickable link"
},
{
  "backend_path": "speaking.speakingEngagements[].presentationUrl",
  "data_type": "string | null",
  "importance": "medium",
  "recommendation": "Add as slides/video link"
},
{
  "backend_path": "patents",
  "data_type": "entire section",
  "importance": "low",
  "recommendation": "Add patents section if user has patents"
},
{
  "backend_path": "memberships.memberships[].membershipId",
  "data_type": "string | null",
  "importance": "low",
  "recommendation": "Display in detailed view"
},
{
  "backend_path": "unclassified_text",
  "data_type": "string | null",
  "importance": "low",
  "recommendation": "Could display as 'Additional Information' section"
}
]
},


HOBBIES -SIMPLE TEXT ALL OTHER DETAILED

"frontend_expectation": "projects.projectItems[].textVariant",
"frontend_location": "app/page.tsx:785",
"current_handling": "Default to 'detailed'",
"recommendation": "Keep as display preference"
},
