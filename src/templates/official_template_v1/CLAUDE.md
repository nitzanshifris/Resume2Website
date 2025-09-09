# Claude AI Assistant Guidelines for v0 Template Project

## Project Overview
This is a dynamic portfolio/CV template builder that allows users to create professional websites from their resume data. The project features a drag-and-drop interface with customizable smart cards and multiple display modes.

## Tech Stack
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Animation**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **Icons**: Tabler Icons, Lucide React
- **Code Highlighting**: react-syntax-highlighter

## Key Components

### SmartCard System
- **Location**: `/components/smart-card.tsx`
- **Purpose**: Universal card component with multiple display modes
- **Display Modes**:
  - Text View (with variants: simple, detailed, minimal)
  - Image/Multi-image display
  - Before/After comparison
  - Code Block (in progress)
  - GitHub Card (TODO)
  - Link Preview (TODO)
  - Video Player
  - Tweet Card (almost ready)

### Important Files
- `/app/page.tsx` - Main application entry point with all sections
- `/components/smart-card.tsx` - Core SmartCard component
- `/components/ui/compare.tsx` - Before/After comparison slider
- `/components/ui/code-block/` - Code display components
- `/lib/data.ts` - Initial data structure and types

## Current Development Status
- **MVP Phase**: Preparing for handoff to Razmat and Besayt
- **Completed**: Most display modes, drag-and-drop, basic editing
- **In Progress**: Code block improvements, UI simplification
- **TODO**: GitHub card, link preview, footer editing, education as SmartCard

## Important Patterns & Conventions

### State Management
- Use `handleSave()` with `showToast: false` for SmartCard updates to prevent notification spam
- All editable content uses `EditableText` component
- State updates flow through `onUpdate` prop callbacks

### Styling Conventions
- Use Tailwind classes, avoid inline styles except when necessary
- Dark mode support via `dark:` prefixes
- Consistent spacing: use `space-y-*` for vertical, `gap-*` for grids

### Code Guidelines
- **NO COMMENTS** in code unless explicitly requested
- Follow existing patterns in nearby code
- Always check for existing libraries before adding new ones
- Use TypeScript strict typing

## Known Issues & Solutions

### 1. Save Notification Spam
**Problem**: Every keystroke triggered "Changes saved!" toast
**Solution**: Pass `false` as third parameter to `handleSave()` for live updates

### 2. Sidebar Visibility Issues  
**Problem**: Content invisible until mouse selection in Before/After mode
**Current Status**: Under investigation, likely React rendering issue

### 3. Carousel Arrow Overlap
**Problem**: Left arrow overlaps navigation bar
**Solution**: Reduce button size and move inward (TODO)

## Development Workflow
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Testing Approach
- Manual testing with various resume formats
- Edge case testing with bulk resume uploads (planned)
- Section-by-section verification of text extraction

## Recent Important Changes
1. Removed watermark functionality completely
2. Disabled save notifications for live editing
3. Changed Before/After from "Compare View"
4. Enhanced code block with modern tab design
5. Fixed text selection issue in comparison slider

## Communication Style for AI
- Be concise and direct
- Avoid unnecessary explanations unless asked
- Show code changes, not explanations
- Use emojis only when explicitly requested
- Always preserve existing code style

## Task Tracking Files
- `MVP_REMAINING_TASKS.txt` - Current development tasks
- `WEBSITE_HANDOFF_TASKS.txt` - Post-development tasks
- `SmartCard-DisplayMode-Tasks.md` - SmartCard specific tasks

## Important Notes
- Project uses live preview - changes appear immediately
- Edit mode toggle affects what controls are visible
- All sections can be reordered via drag and drop
- SmartCards are the core building block for content

## 🏗️ Core Architecture Principles

### Data Robustness
**CRITICAL**: This template will be injected with 100,000s of different resume data sets. Every component must:
- Handle missing data gracefully (empty states, fallbacks)
- Support variable content lengths (truncation, scrolling)
- Adapt to different data structures
- Never break with unexpected input
- Maintain visual consistency regardless of content

### Universal Component Fixes
When fixing issues in universal components (SmartCard, EditableText, etc.):
1. Test with multiple data scenarios (empty, minimal, excessive)
2. Ensure backwards compatibility
3. Document the fix below
4. Consider edge cases from various resume formats

## 🔧 Major Fixes & Solutions Log

### 1. Save Notification Spam (FIXED)
- **Component**: All SmartCards
- **Solution**: Disabled toast notifications on live updates
- **Impact**: Affects all sections using SmartCard
- **Date**: Current session

### 2. Before/After Slider Lag (FIXED)
- **Component**: `/components/ui/compare.tsx`
- **Solution**: Changed from hover to drag-only interaction
- **Impact**: Better performance on all Before/After cards

### 3. Code Block Tab Layout (FIXED)
- **Component**: SmartCard code view
- **Solution**: Changed from grid to flex layout for horizontal tabs
- **Impact**: Proper tab display in all code blocks

## 📋 Current MVP Tasks (from MVP_REMAINING_TASKS.txt)

### High Priority - Must Complete
1. **Hero Section**: Make "contact" button editable
2. **Code Block**: Complete implementation for SmartCard
3. **GitHub Card**: Build new display mode
4. **Link Preview**: Build new display mode
5. **Education Section**: Rebuild as SmartCard component
6. **Footer Section**: Make all buttons and text editable
7. **SmartCard Sidebar**: Simplify UI for better usability

### UI/UX Fixes Needed
- Fix carousel arrow overlap with navigation bar
- Redesign hover effects to avoid z-index conflicts
- Maintain borderline visibility on card expansion
- Simplify SmartCard settings sidebar

### Section Status
✅ **Ready**: Summary, Employment, Multi-image, Before/After, Video, Achievements, Certifications, Volunteering, Hobbies, Publications, Speaking, Languages
⚠️ **Almost Ready**: Tweet Card, Text View
❌ **Not Ready**: Code Block, GitHub Card, Link Preview, Footer, Professional Membership

## 🚨 Development Rules & Best Practices

### Problem-Solving Approach
When encountering issues:
1. **If uncertain, ALWAYS provide 3 solution options** with probabilities:
   - Option A: [Description] - 70% confidence
   - Option B: [Description] - 20% confidence  
   - Option C: [Description] - 10% confidence
2. **Failed fixes must be immediately reverted**
3. **Document what didn't work** to avoid repeating

### 🎯 Visual Debugging Best Practice Example

**The Reel Card Sizing Issue - How to Debug Collaboratively:**

❌ **What I did wrong:**
- Assumed single cards should take 100% width "because CSS flexbox works that way"
- Implemented "Micro" size based on technical percentages without asking about visual goals
- Only discovered the issue when user reported "nothing changes visually"

✅ **What I should have done:**
1. **Ask visual intent questions FIRST:**
   - "Should single cards respect their size even when alone?"
   - "What should 'Micro' actually feel like visually?"
   - "Should cards have max-width constraints?"

2. **Show visual comparisons:**
   - "Here's Small vs Mini vs Micro - do these feel right?"
   - "With 1 card vs 3 cards, do the sizes make sense?"

3. **Clarify the design philosophy:**
   - "Are we optimizing for mobile-first responsive behavior?"
   - "Should size names match visual hierarchy expectations?"

**Key Learning:** Never implement visual features based solely on technical behavior. Always validate the visual/UX intent with the user first, especially for sizing, spacing, and layout decisions.

### Code Quality Standards
- Every fix must handle edge cases
- Test with empty, minimal, and excessive data
- No hardcoded values that could break with different data
- Graceful degradation when features unavailable
- Clear error boundaries around risky components

### Common Edge Cases to Consider
- Empty strings and null values
- Very long text (names, descriptions)
- Missing images or broken URLs
- Different language characters (UTF-8)
- Various date formats
- Unusual data structures from different CV parsers

## 🔄 Failed Attempts Log
Document fixes that didn't work to avoid repetition:

### [CardCarousel/DraggableCardCarousel] - Single Card Display Issues
**Attempted**: Applying itemClassName only to single cards in edit mode
**Why it failed**: Preview mode (CardCarousel) also needed the same fix
**Don't repeat**: Always check both edit and preview modes for consistency

### Example Format:
```
### [Component] - [Issue]
**Attempted**: [What we tried]
**Why it failed**: [Reason]
**Don't repeat**: [Key learning]
```

## 📋 Future Enhancement Tasks

### Testimonials Section (Post-MVP)
**Status**: Hidden by default until improvements completed
- **Issue**: TestimonialCard component needs UI/UX improvements before production
- **Requirements**: 
  - Improve card layout and responsive design
  - Enhance visual hierarchy and readability
  - Fix any spacing/alignment issues
  - Test with various testimonial lengths and content
- **Implementation**: After MVP completion, improve TestimonialCard component, then enable as optional section
- **Location**: `/components/testimonial-card.tsx` and `/app/page.tsx` (currently hidden via sectionVisibility)

### SmartCard UI Improvements
1. **Positioning Controls**: Add positioning button next to drag handle
   - **Scope**: Only for Image/Video/Before&After display modes
   - **Purpose**: Allow fine-tuning of image/video positioning within cards
   - **Implementation**: Add button in SmartCard settings sidebar

2. **Preview Mode Consistency**: Fix carousel preview positioning
   - **Issue**: Preview always starts from left side regardless of layout
   - **Expected**: Single cards should be centered, match final website layout
   - **Components**: CardCarousel component positioning logic

## Contact & Context
- Primary developer: Reefnaaman
- Handoff recipients: Razmat and Besayt
- Purpose: MVP for portfolio/CV website generator
- Scale: Must handle 10,000s of unique resumes