# Aceternity Component Library - Complete Developer Guide

## 📚 Table of Contents

1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Project Architecture](#project-architecture)
4. [Component Library Overview](#component-library-overview)
5. [Using Components](#using-components)
6. [CV Data Integration](#cv-data-integration)
7. [Component Categories](#component-categories)
8. [Development Workflow](#development-workflow)
9. [Testing Components](#testing-components)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [API Reference](#api-reference)

## 🚀 Introduction

Aceternity is a comprehensive React/Next.js component library designed specifically for RESUME2WEBSITE-V3 application. It contains 70+ beautifully animated UI components that automatically transform CV/resume data into stunning web presentations.

### Key Features
- 🎨 **70+ Animated Components** - Pre-built, production-ready UI components
- 🔄 **Automatic CV Adaptation** - Components automatically adapt to CV data
- 🎭 **Multiple Variants** - Each component has multiple design variations
- 🌗 **Dark Mode Support** - Built-in dark/light theme support
- 📱 **Fully Responsive** - Mobile-first design approach
- ⚡ **Performance Optimized** - Lazy loading and code splitting
- 🛠️ **TypeScript Support** - Full type safety and IntelliSense

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd aceternity

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Basic Usage

```tsx
// Import a component
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

// Use in your component
export function MyComponent() {
  const items = [
    { id: 1, name: "John Doe", designation: "Developer", image: "/avatar1.jpg" },
    { id: 2, name: "Jane Smith", designation: "Designer", image: "/avatar2.jpg" }
  ];

  return <AnimatedTooltip items={items} />;
}
```

## 🏗️ Project Architecture

```
aceternity/
├── app/                      # Next.js App Router pages
│   ├── components-gallery/   # Component demos
│   ├── cv-demo/             # CV integration demos
│   └── page.tsx             # Homepage
├── components/              
│   ├── ui/                  # All UI components
│   │   ├── [component]/     # Individual component folders
│   │   │   ├── index.tsx    # Main exports
│   │   │   ├── *-base.tsx   # Base component
│   │   │   ├── *-demo.tsx   # Demo variations
│   │   │   └── *.types.ts   # TypeScript types
│   └── navbar.tsx           # App navigation
├── lib/
│   ├── component-adapter/   # CV data adaptation system
│   │   ├── general-adapter.ts
│   │   ├── component-registry.ts
│   │   └── mapper.ts
│   └── utils.ts             # Utility functions
├── hooks/                   # Custom React hooks
├── data/                    # Static data files
├── public/                  # Static assets
└── docs/                    # Documentation
```

## 📦 Component Library Overview

### Component Structure

Each component follows a consistent structure:

```
component-name/
├── index.tsx                    # Exports all variations
├── component-name-base.tsx      # Base implementation
├── component-name-[variant].tsx # Different variations
├── component-name.types.ts      # TypeScript interfaces
├── component-name.registry.json # Metadata (optional)
└── README.md                    # Component documentation
```

### Component Naming Convention

- **Base Component**: `ComponentName` (e.g., `AnimatedTooltip`)
- **Demo Variations**: `ComponentNameVariant` (e.g., `AnimatedTooltipTeamAvatars`)
- **Types**: `ComponentNameProps`, `ComponentNameItem`
- **Files**: `kebab-case` (e.g., `animated-tooltip-base.tsx`)

## 🎯 Using Components

### Basic Import Pattern

```tsx
// Import base component
import { ComponentName } from "@/components/ui/component-name";

// Import specific variation
import { ComponentNameVariant } from "@/components/ui/component-name";

// Import types
import type { ComponentNameProps } from "@/components/ui/component-name";
```

### Example: Using Aurora Background

```tsx
import { AuroraBackground } from "@/components/ui/aurora-background";

export function HeroSection() {
  return (
    <AuroraBackground className="h-screen">
      <div className="relative z-10">
        <h1 className="text-6xl font-bold">Welcome</h1>
        <p className="text-xl">Beautiful animated background</p>
      </div>
    </AuroraBackground>
  );
}
```

### Example: Using 3D Card

```tsx
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

export function ProductCard() {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 dark:bg-black w-auto h-auto rounded-xl p-6">
        <CardItem translateZ="50" className="text-xl font-bold">
          Make things float in air
        </CardItem>
        <CardItem translateZ="60" className="text-sm mt-2">
          Hover over this card to unleash the power of CSS perspective
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
```

## 🔄 CV Data Integration

The library includes an automatic CV data adaptation system that transforms resume data into component props.

### How It Works

1. **CV Data Input**: The system receives structured CV data
2. **Component Selection**: AI selects appropriate components based on content
3. **Data Adaptation**: The adapter transforms CV data into component props
4. **Rendering**: Components render with the adapted data

### Using the General Adapter

```tsx
import { GeneralComponentAdapter } from "@/lib/component-adapter/general-adapter";
import { usePortfolioAdapter } from "@/lib/component-adapter/usePortfolioAdapter";

// In your component
export function Portfolio() {
  const { adaptedComponents, loading, error } = usePortfolioAdapter({
    cvData: yourCVData,
    componentSelections: selectedComponents
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {adaptedComponents.map((component, index) => (
        <div key={index}>{component}</div>
      ))}
    </div>
  );
}
```

### CV Data Structure

```typescript
interface CVData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
    category: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}
```

## 📊 Component Categories

### 1. Background Effects (9 components)

Perfect for hero sections and page backgrounds:

- `aurora-background` - Animated aurora borealis effect
- `background-beams` - Animated light beams
- `background-boxes` - 3D box grid pattern
- `background-gradient` - Animated gradient backgrounds
- `background-lines` - Animated line patterns
- `meteors` - Falling meteor animation
- `shooting-stars` - Shooting star effect
- `sparkles` - Particle sparkle effect
- `wavy-background` - Animated wave patterns

### 2. Cards & Containers (7 components)

For displaying content in elegant containers:

- `3d-card` - Interactive 3D tilt effect
- `card-hover-effect` - Hover animations
- `card-spotlight` - Spotlight follow effect
- `card-stack` - Stacked card carousel
- `expandable-card` - Expandable card grid
- `focus-cards` - Focus on hover effect
- `sticky-scroll-reveal` - Scroll-triggered reveals

### 3. Text Effects (6 components)

For animated typography:

- `text-generate-effect` - Typewriter generation
- `text-hover-effect` - Hover animations
- `typewriter-effect` - Classic typewriter
- `flip-words` - Word flip animation
- `text-reveal-card` - Reveal on interaction
- `hero-highlight` - Highlighted hero text

### 4. Navigation (4 components)

For site navigation:

- `navbar-menu` - Dropdown navigation
- `floating-navbar` - Sticky floating nav
- `sidebar` - Collapsible sidebar
- `floating-dock` - macOS-style dock

### 5. Interactive Elements (6 components)

For user interactions:

- `animated-modal` - Smooth modal dialogs
- `animated-tooltip` - Interactive tooltips
- `following-pointer` - Cursor following effect
- `hover-border-gradient` - Gradient borders
- `moving-border` - Animated borders
- `tabs` - Animated tab component

### 6. Content Display (6 components)

For showcasing content:

- `animated-testimonials` - Testimonial carousel
- `apple-cards-carousel` - Apple-style cards
- `bento-grid` - Masonry grid layout
- `hero-parallax` - Parallax hero section
- `infinite-moving-cards` - Auto-scrolling cards
- `timeline` - Vertical timeline

### 7. Forms & Inputs (4 components)

For user input:

- `file-upload` - Drag & drop upload
- `multi-step-loader` - Multi-step forms
- `placeholders-and-vanish-input` - Animated inputs
- `signup-form` - Complete signup form

### 8. Special Effects (6 components)

For unique visual effects:

- `3d-pin` - 3D pinned elements
- `globe` - Interactive 3D globe
- `lens` - Magnifying lens effect
- `macbook-scroll` - Device scroll animation
- `svg-mask-effect` - SVG masking
- `vortex` - Swirling vortex effect

## 🛠️ Development Workflow

### Creating a New Component

1. **Create component directory**:
```bash
mkdir components/ui/my-component
```

2. **Create base component**:
```tsx
// my-component-base.tsx
"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { MyComponentProps } from "./my-component.types";

export const MyComponent = ({ className, ...props }: MyComponentProps) => {
  return (
    <div className={cn("default-styles", className)} {...props}>
      {/* Component content */}
    </div>
  );
};
```

3. **Create types file**:
```tsx
// my-component.types.ts
export interface MyComponentProps {
  className?: string;
  // Add your props here
}
```

4. **Create index file**:
```tsx
// index.tsx
export { MyComponent } from "./my-component-base";
export type { MyComponentProps } from "./my-component.types";
```

5. **Add to component registry**:
```tsx
// lib/component-adapter/component-registry.ts
import { MyComponent } from "@/components/ui/my-component";

export const componentRegistry = {
  // ... existing components
  "my-component": {
    component: MyComponent,
    supportedDataTypes: ["personalInfo", "skills"],
    defaultProps: {}
  }
};
```

### Component Best Practices

1. **Always use TypeScript** - Define proper interfaces
2. **Client Components** - Add `"use client"` for interactive components
3. **Responsive Design** - Use Tailwind responsive utilities
4. **Dark Mode** - Support both light and dark themes
5. **Performance** - Lazy load heavy components
6. **Accessibility** - Include ARIA labels and keyboard support

## 🧪 Testing Components

### Unit Testing

```tsx
// __tests__/my-component.test.tsx
import { render, screen } from "@testing-library/react";
import { MyComponent } from "@/components/ui/my-component";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByRole("...")).toBeInTheDocument();
  });
});
```

### Visual Testing

Use the component gallery to visually test components:

```bash
npm run dev
# Navigate to http://localhost:3000/components-gallery
```

## 🚀 Deployment

### Production Build

```bash
# Create production build
npm run build

# Test production build
npm run start
```

### Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Troubleshooting

### Common Issues

1. **Component not rendering**
   - Check if component needs `"use client"` directive
   - Verify all props are passed correctly
   - Check console for errors

2. **TypeScript errors**
   - Run `npm run type-check`
   - Ensure all imports have proper types
   - Check tsconfig.json paths

3. **Styling issues**
   - Verify Tailwind classes are not purged
   - Check for CSS conflicts
   - Use `cn()` utility for class merging

4. **Performance issues**
   - Use React DevTools Profiler
   - Implement lazy loading
   - Optimize animations with `will-change`

## 📡 API Reference

### Component Adapter API

```typescript
class GeneralComponentAdapter {
  constructor(config: AdapterConfig)
  adapt(): AdaptedComponent
  getComponentProps(): Record<string, any>
}

interface AdapterConfig {
  componentType: string;
  cvData: CVData;
  variant?: string;
  size?: "small" | "medium" | "large";
  className?: string;
}
```

### Hook API

```typescript
function usePortfolioAdapter(config: {
  cvData: CVData;
  componentSelections: ComponentSelection[];
}): {
  adaptedComponents: React.ReactNode[];
  loading: boolean;
  error: Error | null;
}
```

### Utility Functions

```typescript
// Class name utility
cn(...inputs: ClassValue[]): string

// Animation utilities
import { motion } from "framer-motion";
```

## 🎉 Conclusion

This guide covers the essential aspects of working with the Aceternity component library. For more detailed information on specific components, refer to their individual README files in the component directories.

### Additional Resources

- [Component Demos](http://localhost:3000/components-gallery)
- [GitHub Repository](#)
- [Issue Tracker](#)
- [Discord Community](#)

### Contributing

We welcome contributions! Please see our contributing guidelines for more information.

---

Built with ❤️ by the RESUME2WEBSITE team