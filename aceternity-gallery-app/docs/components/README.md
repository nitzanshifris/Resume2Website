# Aceternity Components Documentation

This directory contains the complete, up-to-date documentation for all Aceternity UI components as they appear on the official website. These components are optimized for building modern, animated websites from CV data.

## Component Categories

### 1. Background Effects
- **Background Boxes** - Grid-based hover effects
- **Background Gradient** - Animated gradient backgrounds
- **Background Lines** - Wave pattern animations
- **Aurora Background** - Aurora borealis effects
- **Background Beams** - Light beam animations
- **Meteors** - Falling star effects
- **Shooting Stars** - Diagonal shooting stars
- **Spotlight** - Mouse-following light effects
- **Grid Backgrounds** - Dot and grid patterns

### 2. Cards & Containers
- **3D Card** - Perspective hover effects
- **Card Hover Effect** - Grid with animated hover
- **Card Spotlight** - Spotlight reveal on hover
- **Evervault Card** - Encrypted text effects
- **Glare Card** - Glare reflection effects
- **Expanding Card** - Click to expand cards
- **Card Stack** - Stacked card animations

### 3. Text Effects
- **Text Generate Effect** - Typewriter animations
- **Text Reveal Card** - Hover to reveal text
- **Typewriter Effect** - Classic typewriter
- **Hero Highlight** - Highlighted hero text
- **Flip Words** - Word rotation effects
- **Text Hover Effect** - Matrix-like hover

### 4. Navigation
- **Floating Navbar** - Hide on scroll navbar
- **Navbar Menu** - Dropdown navigation
- **Floating Dock** - macOS-style dock
- **Sidebar** - Animated sidebar

### 5. Interactive Elements
- **3D Pin** - Perspective pin animation
- **Animated Modal** - Smooth modal transitions
- **Animated Tooltip** - 3D hover tooltips
- **Following Pointer** - Cursor following effects
- **Lens Effect** - Magnifying glass effect
- **Tabs** - Animated tab navigation

### 6. Content Display
- **Timeline** - Vertical timeline with scroll
- **Bento Grid** - Masonry grid layout
- **Sticky Scroll Reveal** - Scroll-triggered reveals
- **Container Scroll** - Parallax scroll effects
- **Infinite Moving Cards** - Auto-scrolling cards
- **Apple Cards Carousel** - Apple-style carousel

### 7. Forms & Inputs
- **Placeholders and Vanish Input** - Animated input fields
- **File Upload** - Drag and drop upload
- **Multi Step Loader** - Step progress indicator
- **Signup Form** - Animated signup form

### 8. Hero Sections
- **Hero Parallax** - Parallax hero section
- **Hero Section Templates** - Ready-made heroes
- **Lamp Effect** - Lamp light animation
- **Vortex** - Swirling vortex background

### 9. Special Effects
- **Canvas Reveal Effect** - WebGL canvas reveals
- **SVG Mask Effect** - SVG masking animations
- **Tracing Beam** - Line tracing animations
- **Sparkles** - Particle effects
- **Glowing Stars** - Glowing star background
- **World Map** - Interactive globe

## Usage Guide

Each component documentation includes:
1. **Preview** - Visual demonstration
2. **Installation** - Required dependencies
3. **Code** - Complete implementation
4. **Props** - Component properties
5. **Variants** - Different styles/modes
6. **CV Integration** - How to use with CV data

## CV Integration Examples

### Portfolio Section
```jsx
// Combine Background Beams + Bento Grid
<BackgroundBeams>
  <BentoGrid>
    {cvData.projects.map(project => (
      <BentoGridItem
        title={project.name}
        description={project.description}
        icon={<ProjectIcon />}
      />
    ))}
  </BentoGrid>
</BackgroundBeams>
```

### Experience Timeline
```jsx
// Timeline for work experience
<Timeline data={cvData.experience.map(job => ({
  title: job.position,
  content: (
    <div>
      <p>{job.company}</p>
      <p>{job.duration}</p>
      <p>{job.description}</p>
    </div>
  )
}))} />
```

### Skills Showcase
```jsx
// Animated Cards for skills
<HoverEffect items={cvData.skills.map(skill => ({
  title: skill.name,
  description: skill.proficiency,
  link: "#"
}))} />
```

### Hero Section
```jsx
// Hero with text effects
<AuroraBackground>
  <TextGenerateEffect words={cvData.headline} />
  <TypewriterEffect words={cvData.roles} />
</AuroraBackground>
```

## Best Practices

1. **Performance**
   - Lazy load heavy animations
   - Use `dynamic` imports for large components
   - Disable animations on mobile when needed

2. **Accessibility**
   - Add proper ARIA labels
   - Ensure keyboard navigation
   - Provide animation toggles

3. **Responsive Design**
   - Test all breakpoints
   - Adjust animation intensity on mobile
   - Consider touch interactions

4. **Dark Mode**
   - All components support dark mode
   - Use Tailwind's dark: prefix
   - Test contrast ratios

## Component Status

✅ **Production Ready** - Fully tested and optimized
🚧 **Beta** - Working but may need adjustments
📝 **Documentation Only** - Reference implementation

Last Updated: January 2025