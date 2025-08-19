# Template v10 Migration Guide - CV Data Structure Compatibility

## Executive Summary
The v0_template_v10 template has **78% overall compatibility** with the backend CV data structure. While most core sections work well, there are critical issues with hardcoded content and several high-value fields that aren't being displayed.

## Priority Fix List (Ordered by Impact)

### 🔴 CRITICAL - Fix Immediately

1. **Fix Hardcoded CV Download Filename**
   - **Issue**: Downloads as "michelle-lopez-cv.pdf" for all users
   - **File**: `components/contact-section.tsx` (line 126)
   - **Fix**: 
   ```tsx
   // Replace:
   href="/michelle-lopez-cv.pdf" download="michelle-lopez-cv.pdf"
   
   // With:
   href={`/${data.hero?.fullName?.toLowerCase().replace(/\s+/g, '-') || 'resume'}-cv.pdf`} 
   download={`${data.hero?.fullName?.toLowerCase().replace(/\s+/g, '-') || 'resume'}-cv.pdf`}
   ```

2. **Display Missing Hero Tagline**
   - **Issue**: `hero.summaryTagline` is extracted but never shown
   - **File**: `components/hero-section.tsx` (after line 340)
   - **Fix**: Add component to display tagline below professional title

3. **Wire Up Testimonials Data**
   - **Issue**: Testimonials section always empty
   - **File**: `lib/cv-data-adapter.tsx` (line 608-611)
   - **Fix**: Map backend testimonials when available instead of empty array

### 🟡 HIGH PRIORITY - Significant Value Loss

4. **Add Summary Enhancement Fields**
   - **Missing**: `yearsOfExperience`, `keySpecializations`, `careerHighlights`
   - **File**: `app/page.tsx` (summary section)
   - **Fix**: Add badges/highlights below summary text

5. **Display Technologies in Experience**
   - **Issue**: `technologiesUsed` array not displayed
   - **File**: Experience cards in accordion
   - **Fix**: Add tech stack badges

6. **Show Project Metrics**
   - **Missing**: `projectMetrics` object with achievements
   - **File**: Project cards
   - **Fix**: Display as achievement badges

### 🟢 NICE TO HAVE - Enhanced Features

7. **Add Patents Section** (if users have patents)
8. **Display Certification Expiration Dates**
9. **Show Volunteer Impact Metrics**
10. **Add Speaking Engagement Metrics** (audience size, links)
11. **Include Language Certifications**
12. **Display Location State** (between city and country)

## Migration Steps

### Step 1: Update Data Adapter
1. Open `lib/cv-data-adapter.tsx`
2. Fix the testimonials mapping (line 608-611)
3. Ensure all location fields are mapped (including state)
4. Map the summaryTagline properly

### Step 2: Fix Hero Section
1. Open `components/hero-section.tsx`
2. Add summaryTagline display after professionalTitle
3. Test with sample data containing tagline

### Step 3: Fix Contact Section
1. Open `components/contact-section.tsx`
2. Replace hardcoded CV filename with dynamic generation
3. Test download with different user names

### Step 4: Enhance Summary Section
1. Open `app/page.tsx`
2. Find summary section (around line 629)
3. Add display for:
   - Years of experience (as badge)
   - Key specializations (as tag cloud)
   - Career highlights (as bullet points)

### Step 5: Update Experience Cards
1. In experience section accordion
2. Add technologies display as badges
3. Add employment type badge if present
4. Show remote work status if applicable

### Step 6: Test All Sections
Use this test data structure to verify all mappings work:

```json
{
  "hero": {
    "fullName": "John Doe",
    "professionalTitle": "Senior Software Engineer",
    "summaryTagline": "Building scalable solutions for 10+ years",
    "profilePhotoUrl": null
  },
  "contact": {
    "email": "john@example.com",
    "phone": "+1-555-0100",
    "location": {
      "city": "San Francisco",
      "state": "CA",
      "country": "USA"
    },
    "professionalLinks": [
      {
        "platform": "linkedin",
        "url": "https://linkedin.com/in/johndoe"
      },
      {
        "platform": "github",
        "url": "https://github.com/johndoe"
      }
    ],
    "availability": "Open to new opportunities"
  },
  "summary": {
    "summaryText": "Experienced engineer with a passion for clean code",
    "yearsOfExperience": 10,
    "keySpecializations": ["React", "Node.js", "AWS", "Python"],
    "careerHighlights": [
      "Led team of 8 engineers",
      "Reduced load time by 60%",
      "Architected microservices platform"
    ]
  }
}
```

## Compatibility Matrix

| Section | Current Score | After Fixes | Notes |
|---------|--------------|-------------|-------|
| Hero | 85% | 100% | Add summaryTagline display |
| Contact | 75% | 90% | Fix CV filename, add state |
| Summary | 60% | 95% | Add all missing fields |
| Experience | 80% | 95% | Add technologies, employment type |
| Projects | 85% | 95% | Add metrics display |
| Skills | 90% | 90% | Already good |
| Testimonials | 20% | 90% | Wire up data |
| Patents | 0% | 100% | Add section if needed |

## Fields to Remove/Hide

1. **Demographic Information** - Hide by default:
   - `dateOfBirth`
   - `maritalStatus`
   - `placeOfBirth`
   
2. **Sensitive Information** - Only show if relevant:
   - `nationality`
   - `drivingLicense`
   - `visaStatus` (show for international positions)

## Validation Checklist

- [ ] CV downloads with correct user's name
- [ ] Hero section shows summaryTagline
- [ ] Summary displays years of experience
- [ ] Key specializations shown as badges
- [ ] Career highlights visible
- [ ] Technologies shown in experience cards
- [ ] Project metrics displayed
- [ ] Testimonials load if data exists
- [ ] All empty states have proper messages
- [ ] No "michelle-lopez" references remain

## Support & Questions

If you encounter issues during migration:
1. Check the complete analysis in `cv_mapping_analysis_v10.json`
2. Verify backend is providing expected data structure
3. Test with minimal data first, then add complexity
4. Use browser DevTools to inspect data flow

## Success Metrics

After implementing these fixes:
- Overall compatibility should reach **95%+**
- All user-specific data should be dynamic
- No hardcoded personal information
- All high-value fields should be visible
- Empty states should be meaningful