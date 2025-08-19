# Template Changes Required (Frontend Only)

## Core Data Structure Changes

### 1. Remove `hero.summaryTagline` Field
- **Files to update in ALL templates:**
  - `lib/data.tsx` - Remove summaryTagline from HeroData interface
  - `lib/cv-data-adapter.tsx` - Remove summaryTagline from adaptHero function return
  - `lib/mock-data.tsx` - Remove summaryTagline from mock hero data
  - `lib/injected-data.tsx` - Remove summaryTagline from injected hero data
  - `app/page.tsx` - Remove summaryTagline handler from sectionMapping if present

### 2. Professional Summary Section - Intelligent Field Combination
- **Implementation:**
  - Combine summaryText + yearsOfExperience + keySpecializations + careerHighlights into one paragraph
  - Avoid duplication (check if info already exists in summaryText before adding)
  - Apply gradient/colored styling to specific elements:
    - yearsOfExperience number
    - Each keySpecialization
    - Each careerHighlight
- **Files to Update:**
  - `components/summary-section.tsx` - Add combination logic and gradient text styling
  - `lib/cv-data-adapter.tsx` - Add helper function to intelligently combine fields

## Section-Specific Implementations

### Projects Section - Add Tags to Smart Cards
- **Add tags to smart cards in text display mode (detailed variant):**
  - Display `dateRange` as a tag if present
  - Display `role` as a tag if present  
  - Display `technologies` as separate tags (not in description text)
- **Smart Card Enhancement Required:**
  - Extend smart card component to support tags in detailed text variant
  - Tags should appear below description as clickable badges
- **Files to Update:**
  - `components/smart-card.tsx` - Add tags support for text mode detailed variant
  - `components/project-section.tsx` - Pass tags data to smart cards

### 3. Experience Section - Timeline Cards
- **Field Mapping Required:**
  - Map `companyName` → `company` 
  - Map `technologiesUsed` → `technologies`
  - Map `responsibilitiesAndAchievements[]` → `description` (joined as string)
  - Keep `responsibilities[]` array for optional bullet display
- **Display Implementation:**
  - Timeline card layout with expand/collapse
  - Show duration calculation from dateRange
  - Display "Active" badge if isCurrent=true
  - Show technology badges at bottom when expanded
  - **Conditional Display**: Hide "Technologies & Tools" section title if no technologies exist for that experience item
- **Additional Badges/Tags to Add (if data exists):**
  - `experience.experienceItems[].location` - Location badge: 📍 City, State
  - `experience.experienceItems[].remoteWork` - Remote/Hybrid/Onsite badge: 🏠
  - `experience.experienceItems[].employmentType` - Full-time/Part-time/Contract badge
  - `experience.experienceItems[].teamSize` - Display "Team of X" in details
  - `experience.experienceItems[].reportingTo` - Include in detailed view if relevant
- **Files to Update:**
  - `lib/cv-data-adapter.tsx` - Field mapping
  - `components/experience-section.tsx` - Add new badges

### 4. Smart Card Display Implementation
- **All sections now receive URL fields from backend:**
  - videoUrl, githubUrl, imageUrl, linkUrl
  - hasLink (boolean), linkType, viewMode, textVariant
- **Display Logic to Implement:**
  - Education & Experience: Use 'timeline' viewMode
  - Other sections: Use viewMode based on URL type
  - When hasLink=true: Show URL preview as primary, description on expand
  - Hobbies: Use 'simple' textVariant
  - All other sections: Use 'detailed' textVariant
- **Files to Update:**
  - All section components to handle new smart card fields
  - `components/smart-card.tsx` - Ensure all viewModes work correctly

## UI Enhancements

### 5. Section Icons
- **Pick default icons for all sections presenting an icon**
  - Experience: Briefcase
  - Education: Graduation cap
  - Skills: Tools/Gear
  - Projects: Folder
  - Certifications: Certificate
  - Languages: Globe
  - Volunteer: Heart
  - Publications: Book
  - Speaking: Microphone
  - Courses: Learning/Book
  - Memberships: Users/Group
  - Hobbies: Star
  - Patents: Lightbulb
  - Achievements: Trophy

### 6. Smart Card Text Display
- **Present text title + description for each smart card showing non-text display**
  - Only if there's text attached to link
  - Show title prominently
  - Show description on expand/hover

### 7. Download CV Button
- **Add a button to download the CV in contact section**
  - Position: Contact section
  - Action: Download original CV file
  - Icon: Download icon

### 8. Delete Copyright from Contact
- **Remove copyright field**
  - Frontend expectation: `contact.copyright`
  - Frontend location: `cv-data-adapter.tsx:254`
  - Action: Remove this field completely

## Additional Data Tags (Show only if present in data)

### Education Section Tags
- **Fields to display as badges/tags:**
  - `education.educationItems[].relevantCoursework` - Display as separate list or badges
  - `education.educationItems[].honors` - Display as highlighted badges
  - `education.educationItems[].gpa` - Show if not null
  - `education.educationItems[].minors` - Display with degree information
  - `education.educationItems[].exchangePrograms` - Include in education details

### Languages Section Metrics
- **Add certification badges:**
  - `languages.languageItems[].certification` - Display as badge with language

## Footer Information Section

### Contact Fields (Low Priority - Add if needed)
- **Optional contact details to display:**
  - `contact.placeOfBirth` - Could add to detailed contact section
  - `contact.nationality` - Could display with location if relevant
  - `contact.drivingLicense` - Add to contact details if job-relevant
  - `contact.dateOfBirth` - Generally avoid for privacy
  - `contact.maritalStatus` - Generally avoid for privacy
  - `contact.visaStatus` - Could be important for international positions
  - `contact.location.state` - Add between city and country if available

## Future Enhancements (Not MVP)

### Testimonials Section
- **Backend doesn't currently support - leads to null object**
  - Allow user to add testimonials section
  - Backend path: `testimonials.testimonialItems`
  - Frontend location: `app/page.tsx:1064`
  - Issue: Frontend expects testimonials but adapter provides empty array
  - Recommendation: Map backend testimonials data when available