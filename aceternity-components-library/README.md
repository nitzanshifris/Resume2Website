# Aceternity Components Library

> **2025-07-04** – Library fully synced with latest Magic-UI components & packs (134 components, 54 packs). Added support for:
> – Animated Gradient/Text/Special Effects
> – Education Timeline, Moving Border, Meteors, MacBook Scroll.
> – Complete packs hierarchy (hero-sections, cta-sections, bento-grids, etc.).

A complete, production-ready React component library with beautiful animations and modern design patterns. Optimized for CV2WEB portfolio generation and general use.

## 🚀 Quick Start

```bash
npm install @aceternity/components-library
```

```tsx
import { Timeline, HeroParallax, BentoGrid } from '@aceternity/components-library';

// Use components in your React app
<Timeline entries={timelineData} />
<HeroParallax products={heroProducts} />
<BentoGrid items={skillsData} />
```

## 📦 What's Included

### **134+ Components + 54 Packs** organized by category:

#### **Core CV2WEB Components** (Always Used)
- `hero-parallax` - Animated parallax hero section
- `hero-highlight` - Hero with text highlighting effects  
- `timeline` - Perfect for experience/education
- `bento-grid` - Modern grid layout for skills
- `floating-dock` - Contact/social links dock
- `text-generate-effect` - Animated text generation

#### **Content Components**
- `card-hover-effect` - Interactive project cards
- `animated-testimonials` - Social proof carousels
- `animated-tooltip` - Skill badges with tooltips
- `card-stack` - Certification displays
- `sticky-scroll-reveal` - Content reveals on scroll

#### **Background Effects**
- `aurora-background` - Gradient aurora effect
- `background-beams` - Animated beam patterns
- `background-boxes` - Moving box patterns
- `meteors` - Falling meteor animation
- `sparkles` - Particle effects

#### **3D Components**
- `3d-card` - Three-dimensional cards
- `3d-pin` - 3D pin effects
- `globe` - Interactive 3D globe
- `world-map` - Animated world map

#### **Text Effects**
- `typewriter-effect` - Typewriter animations
- `flip-words` - Word flipping effects
- `text-hover-effect` - Interactive text
- `cover` - Text masking effects

#### **Navigation**
- `floating-navbar` - Floating navigation bar
- `navbar-menu` - Animated menu systems
- `sidebar` - Collapsible sidebars

#### **Complex Packs** (Complete Sections)
- `hero-section-with-images-grid` - Complete hero with image gallery
- `modern-hero-with-gradients` - Modern gradient hero section
- `three-column-bento-grid` - Full bento grid layout
- `testimonials-marquee-grid` - Complete testimonials section
- `simple-cta-with-images` - Call-to-action with backgrounds
- `content-card` - Feature-rich content cards
- `expandable-card-on-click` - Interactive expanding cards
- `simple-footer-with-four-grids` - Complete footer sections
- `simple-pricing-with-three-tiers` - Pricing tables

## 🔧 CV2WEB Integration

This library is specifically optimized for CV2WEB's portfolio generation pipeline:

```typescript
// CV2WEB generates this structure automatically
const portfolioData = {
  hero: { /* hero data */ },
  experience: { /* timeline entries */ },
  skills: { /* bento grid items */ }
};

// Components accept CV2WEB data directly
<Timeline entries={portfolioData.experience} />
<BentoGrid items={portfolioData.skills} />
```

### **Props Compatibility**
All components are designed to work with CV2WEB's exact data structure:

```typescript
interface TimelineEntry {
  title: string;        // Company/School name
  subtitle: string;     // Position/Degree
  date: string;         // Date range
  description?: string; // Summary
  bullets?: string[];   // Achievements
}
```

## 🎨 Styling

Built with **Tailwind CSS** and **Framer Motion**:

```css
/* Add to your globals.css */
@import '@aceternity/components-library/styles/globals.css';
```

## 📱 Responsive Design

All components are mobile-first and fully responsive:
- **Mobile**: Optimized touch interactions
- **Tablet**: Balanced layouts
- **Desktop**: Full feature sets

## ⚡ Performance

- **Tree-shakeable**: Only bundle what you use
- **Optimized animations**: 60fps smooth animations
- **Lazy loading**: Components load on demand
- **TypeScript**: Full type safety

## 🔨 Usage Examples

### Timeline Component
```tsx
const experience = [
  {
    title: "Tech Corp",
    subtitle: "Senior Engineer", 
    date: "2020 - Present",
    bullets: ["Led team of 5", "Increased performance 40%"]
  }
];

<Timeline entries={experience} />
```

### Bento Grid
```tsx
const skills = [
  {
    title: "React",
    description: "Frontend framework",
    icon: <ReactIcon />
  }
];

<BentoGrid items={skills} />
```

### Hero Parallax
```tsx
const products = [
  {
    title: "Project 1",
    link: "https://project1.com",
    thumbnail: "/project1.jpg"
  }
];

<HeroParallax products={products} />
```

## 🎯 Component Categories

| Category | Count | Examples |
|----------|-------|----------|
| **Hero** | 3 | hero-parallax, hero-highlight |
| **Content** | 12 | timeline, card-hover-effect |
| **Layout** | 8 | bento-grid, layout-grid |
| **Text** | 6 | text-generate-effect, typewriter |
| **Background** | 10 | aurora, meteors, sparkles |
| **3D** | 5 | 3d-card, globe, world-map |
| **Navigation** | 4 | floating-dock, navbar-menu |
| **Forms** | 3 | file-upload, signup-form |
| **UI** | 8 | button, card, modal |

## 📋 Component Registry

Each component includes:
- **TypeScript types**
- **Usage examples** 
- **Dependency list**
- **CV2WEB compatibility**
- **Responsive behavior**

See `components/registry.json` for full component metadata.

## 🔄 Updates

This library stays in sync with the latest Aceternity designs and includes:
- New component additions
- Performance improvements  
- Bug fixes
- CV2WEB compatibility updates

## 📄 License

MIT License - Use in any project, commercial or personal.

## 🤝 Contributing

1. Components must be responsive
2. Include TypeScript types
3. Follow Tailwind conventions
4. Test with CV2WEB data structures
5. Document props and usage

---

**Ready for production.** **Optimized for CV2WEB.** **80+ beautiful components.**