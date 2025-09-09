# Guy Usishkin CV - Extraction & Display Issues

## Test Date: 2025-08-30
**File**: Guy_Usishkin.docx
**Portfolio URL**: http://localhost:4000

## Critical Issues

### 1. About Me Section - Personal Summary Not Extracted ❌
**Original Text in CV**:
```
I'm a curious person looking to explore the world of knowledge. When I'm not leveraging my knowledge through studying or working, my main activity is bouldering. As the son of a writer, I love spending my spare time reading books. As a philosophy student, I express my passion for philosophy by exploring the history of complex ideas and their evolution.
```

**What Website Shows**:
```
Passionate professional dedicated to excellence and innovation.
```

**Issue**: Generic placeholder text instead of Guy's actual personal summary
**Impact**: High - Loses personal voice and unique details

### 2. Military Service Mapped as Achievement Card
**Original Structure**: Separate "Military Service" section (2018-2020)
**Website Display**: Shows as "Military Leadership" achievement card
**Issue**: Section type changed from experience to achievement
**Impact**: Medium - Content preserved but categorization changed

### 3. Missing Contact Details
**Not Captured**:
- Address: "Mitzpe 3, Tel Aviv, Israel" - only city and country captured
**Impact**: Low - partial address still functional

### 4. Missing Passport/Nationality Information
**Original**: 
- Hebrew - Native (Israeli passport)
- English - Highly proficient (American passport)

**Website Shows**: Only language proficiency, no passport/nationality info
**Impact**: Low - may be relevant for international opportunities

### 5. Incomplete Hobbies Extraction
**Original "About me" mentions**:
- Bouldering ✅ (captured)
- Reading books ✅ (captured)
- Philosophy ❌ (missed context about being philosophy student and passion)

**Impact**: Low - main hobbies captured

## Data Quality Summary

### Sections Correctly Extracted ✅
- Hero (Name, Title)
- Contact (Email, Phone, Location)
- Experience (Job details, responsibilities, technologies)
- Education (Both degrees, GPA, descriptions)
- Skills/Capabilities (All technical skills organized in categories)
- Languages (Hebrew, English with proficiency)
- Volunteer (Israeli scout's movement)
- Achievements (Academic achievements, military leadership)

### Sections with Issues ⚠️
- About Me/Summary (using generic text instead of personal summary)
- Military Service (mapped as achievement instead of experience)
- Hobbies (partial extraction from "About me" text)

## Root Cause Analysis Needed
1. Why is the "About me" text not being extracted as summary?
2. Is the extraction model not recognizing informal/personal text?
3. Should military service have its own section type?

## Recommendations
1. **High Priority**: Fix personal summary extraction to capture "About me" sections
2. **Medium Priority**: Consider dedicated military/service section type
3. **Low Priority**: Enhance extraction to capture passport/nationality context

## Next Steps
- Investigate why personal summary text is not extracted
- Check if this is a pattern across other CVs
- Test with Lior and Yaniv's CVs for comparison