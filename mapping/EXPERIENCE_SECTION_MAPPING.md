# Experience Section Data Mapping Analysis

## Frontend Display (From Screenshots)

### Collapsed Card Shows:
1. **Company Icon** (briefcase icon)
2. **Job Title** (e.g., "Senior Position Title")
3. **Company Name** (e.g., "LEADING COMPANY NAME")
4. **Date Range** (e.g., "2021 - Present")
5. **Active Badge** (green "Active" badge if current job)
6. **Duration** (calculated, e.g., "4 years, 8 months")
7. **Expand/Collapse Arrow**

### Expanded Card Additionally Shows:
1. **Duration Line** (e.g., "Duration: 4 years, 8 months")
2. **Description/Responsibilities** (paragraph text)
3. **Technology Tags** (colored badges at bottom)

## Backend Data Structure

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
        "responsibilitiesAndAchievements": [
          "Developed and launched...",
          "Drove cross-functional teams...",
          "Implemented a customer feedback loop..."
        ],
        "technologiesUsed": ["React", "Node.js", "AWS"],
        "summary": null,
        "employmentType": null,
        "teamSize": 10,
        "reportingTo": null
      }
    ]
  }
}
```

## Field Mapping Analysis

### ✅ DISPLAYED FIELDS (Direct Mapping)
| Backend Field | Frontend Display | Location | Notes |
|--------------|------------------|----------|-------|
| `jobTitle` | Main title | Card header | Direct display |
| `companyName` | Company name | Under title | **RENAME TO:** `company` |
| `dateRange.startDate` | Start date | Right side | Format: "2021" |
| `dateRange.endDate` | End date | Right side | "Present" if current |
| `dateRange.isCurrent` | Active badge | Right side | Shows green "Active" |
| `responsibilitiesAndAchievements[]` | Description | Expanded view | **COMBINE** into single paragraph |
| `technologiesUsed[]` | Tech badges | Bottom of expanded | **RENAME TO:** `technologies` |

### ⚠️ CALCULATED FIELDS (Frontend Calculates)
| Field | Display | Calculation |
|-------|---------|------------|
| Duration | "4 years, 8 months" | Calculate from dateRange |

### ❌ NOT DISPLAYED (But Available for Future)
| Backend Field | Purpose | Future UI Element Needed? |
|--------------|---------|--------------------------|
| `location` | City/State/Country | Could add location badge |
| `remoteWork` | Remote/Hybrid/Onsite | Could add work mode badge |
| `employmentType` | Full-time/Part-time/Contract | Could add employment type badge |
| `teamSize` | Team size managed | Could add "Team of X" badge |
| `reportingTo` | Manager title | Could add reporting structure |
| `summary` | Brief role summary | Not needed (responsibilities covers this) |

## Required Backend Changes

### 1. Field Renaming (cv-data-adapter.tsx)
```typescript
// Current → Desired
companyName → company
responsibilitiesAndAchievements → responsibilities (kept as array)
technologiesUsed → technologies
```

### 2. Data Transformation
```typescript
// Combine responsibilities array into description for display
description: responsibilitiesAndAchievements.join(' ') // For paragraph display
responsibilities: responsibilitiesAndAchievements // Keep array for bullets if needed
```

## Frontend Template Changes Needed

### Files to Update:
1. **`lib/cv-data-adapter.tsx`**
   - Map `companyName` → `company`
   - Map `technologiesUsed` → `technologies`
   - Create `description` from `responsibilitiesAndAchievements.join(' ')`
   - Keep `responsibilities` array for optional bullet display

2. **`components/experience-section.tsx`** or timeline component
   - Add location badge display (if location exists)
   - Add remote work badge (if remoteWork exists)
   - Add team size badge (if teamSize exists)
   - Add employment type badge (if employmentType exists)

## Recommended UI Additions for Extra Data

If backend provides non-null values, frontend should display:

### In Collapsed View:
- **Location Badge**: 📍 Dallas, TX (if location provided)
- **Remote Badge**: 🏠 Remote (if remoteWork = true)
- **Employment Type**: Full-time/Part-time badge

### In Expanded View:
- **Team Size**: "Led team of 10" (if teamSize provided)
- **Reporting To**: "Reported to: CTO" (if reportingTo provided)

## Smart Card Configuration
```typescript
{
  viewMode: 'timeline',  // Always timeline for experience
  textVariant: 'detailed',
  hasLink: false,  // Experience items typically don't have URLs
  // But could have:
  videoUrl: null,  // Could link to company video
  linkUrl: null,   // Could link to company website
  imageUrl: null,  // Could show company logo
}
```

## Summary of Changes Needed

### Backend (cv-data-adapter):
1. Rename fields to match frontend expectations
2. Combine responsibilities array into description string
3. Keep array version for flexibility

### Frontend Template:
1. Display additional badges for location, remote work, team size
2. Calculate and display duration
3. Handle technology badges properly
4. Implement expand/collapse with all data