# Aceternity Component Library - Complete Structure Guide for Backend Integration

## Project Overview
This is a React/Next.js component library with 65+ animated UI components. Your goal is to understand the exact file structure to integrate your backend CV data with these components.

## 🗂️ Complete Folder Structure Explained

### Root Directory Structure
```
/Users/nitzan_shifris/Desktop/CV2WEB-V3/aceternity/
├── app/                      # Next.js App Router
├── components/               # Source components (development)
├── component-library/        # Distributable components (production mirror)
├── lib/                      # Utilities and adapters
├── docs/                     # Documentation
├── scripts/                  # Build and utility scripts
├── public/                   # Static assets
└── [config files]           # package.json, tsconfig.json, etc.
```

## 📁 Critical Directories for Backend Integration

### 1. `/components/ui/` - Component Source Files
This is where all components live. Each component has its own folder with a specific structure.

#### Example: Hero Parallax Component
```
/components/ui/hero-parallax/
├── hero-parallax-base.tsx      # Core component implementation
├── hero-parallax-demo.tsx      # Demo variations (different ways to use it)
├── hero-parallax.types.ts      # TypeScript interfaces
├── index.tsx                   # Public exports
├── README.md                   # Usage documentation
└── hero-parallax.registry.json # Component metadata
```

#### File Breakdown:

**hero-parallax-base.tsx** - The actual component:
```typescript
"use client";
import React from "react";
import { motion } from "motion/react";

export const HeroParallax = ({ products }: { 
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  // Component implementation
  return (
    <div>
      {products.map((product) => (
        // Animated product display
      ))}
    </div>
  );
};
```

**hero-parallax.types.ts** - Type definitions:
```typescript
export interface HeroParallaxProps {
  products: Array<{
    title: string;
    link: string;
    thumbnail: string;
  }>;
  className?: string;
}
```

**hero-parallax-demo.tsx** - Example usage:
```typescript
export function HeroParallaxDemo() {
  return (
    <HeroParallax 
      products={[
        {
          title: "Project 1",
          link: "https://example.com",
          thumbnail: "/image1.jpg"
        },
        // ... more products
      ]}
    />
  );
}
```

### 2. `/lib/component-adapter/` - THE MOST IMPORTANT FOR BACKEND

This directory contains the system that transforms your backend CV data into component props.

```
/lib/component-adapter/
├── general-adapter.ts       # Main adapter class
├── component-registry.ts    # Maps components to data types
└── README.md               # Adapter documentation
```

#### `general-adapter.ts` - This is where backend data becomes component props:
```typescript
import { CVData } from "@/types/cv";

export type ComponentType = 
  | "3d-card"
  | "hero-parallax"
  | "bento-grid"
  | "timeline"
  // ... all 65+ component types

export interface GeneralAdapterConfig {
  cvData: CVData;           // Your CV data from backend
  componentType: ComponentType;
  variant?: string;         // Component variant (default, gradient, etc.)
}

export class GeneralComponentAdapter {
  private config: GeneralAdapterConfig;
  
  adapt(): BaseAdaptedProps {
    switch (this.config.componentType) {
      case "hero-parallax":
        return this.adaptHeroParallax();
      case "bento-grid":
        return this.adaptBentoGrid();
      // ... cases for all components
    }
  }

  private adaptHeroParallax(): BaseAdaptedProps {
    const { cvData } = this.config;
    
    // Transform CV projects into hero-parallax format
    return {
      products: cvData.projects?.map(project => ({
        title: project.title,
        link: project.link || "#",
        thumbnail: project.image || "/placeholder.jpg"
      })) || []
    };
  }
}
```

#### `component-registry.ts` - Defines what data each component accepts:
```typescript
export const COMPONENT_REGISTRY = {
  "hero-parallax": {
    componentType: "hero-parallax",
    supportedDataTypes: ["ProjectData[]", "PortfolioData[]"],
    supportedUIStyles: ["hero-animated", "portfolio-showcase"],
    requiredProps: ["products"],
    optionalProps: ["className", "containerClassName"],
  },
  "timeline": {
    componentType: "timeline",
    supportedDataTypes: ["ExperienceData[]", "EducationData[]"],
    supportedUIStyles: ["vertical", "horizontal"],
    requiredProps: ["data"],
  },
  // ... registry for all components
};
```

### 3. `/app/components-gallery/` - Live Examples

Each component has a gallery page showing how to use it:

```
/app/components-gallery/
├── page.tsx                    # Main gallery listing all components
├── hero-parallax/
│   └── page.tsx               # Hero parallax demo page
├── timeline/
│   └── page.tsx               # Timeline demo page
└── [component-name]/
    └── page.tsx               # Demo for each component
```

### 4. `/types/cv.ts` - Expected CV Data Structure

Your backend must provide data in this format:

```typescript
export interface CVData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone?: string;
    location?: string;
    summary?: string;
    avatar?: string;
    socialLinks?: Array<{
      platform: string;
      url: string;
    }>;
  };
  
  experience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
    achievements?: string[];
    technologies?: string[];
  }>;
  
  projects?: Array<{
    title: string;
    description: string;
    image?: string;
    link?: string;
    github?: string;
    technologies?: string[];
  }>;
  
  skills?: Array<{
    category: string;
    items: Array<{
      name: string;
      level?: number;
    }>;
  }>;
  
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
  }>;
}
```

## 🔄 Integration Flow Example

### Step 1: Backend sends CV data
```json
{
  "personalInfo": {
    "name": "John Doe",
    "title": "Full Stack Developer"
  },
  "projects": [
    {
      "title": "E-commerce Platform",
      "description": "Built with React and Node.js",
      "image": "https://example.com/project1.jpg",
      "link": "https://myproject.com"
    }
  ]
}
```

### Step 2: Use the adapter to transform data
```typescript
import { GeneralComponentAdapter } from "@/lib/component-adapter/general-adapter";

// Your backend data
const cvData = await fetchCVData();

// Create adapter instance
const adapter = new GeneralComponentAdapter({
  cvData: cvData,
  componentType: "hero-parallax",
  variant: "default"
});

// Get component props
const props = adapter.adapt();
// props = { products: [...] }
```

### Step 3: Render the component
```typescript
import { HeroParallax } from "@/components/ui/hero-parallax";

function Portfolio() {
  const props = adapter.adapt();
  return <HeroParallax {...props} />;
}
```

## 📍 Key Files You Must Understand

1. **`/lib/component-adapter/general-adapter.ts`**
   - Contains all `adapt[ComponentName]()` methods
   - Each method transforms CV data to component props
   - Add new methods here for new components

2. **`/lib/component-adapter/component-registry.ts`**
   - Lists all components and their data requirements
   - Check here to see what data type each component needs

3. **`/component-library/metadata/component-configs.ts`**
   - Playground configurations for each component
   - Shows all possible props and their types

4. **`/types/cv.ts`**
   - The CV data interface your backend must match

## 🗺️ Component Mapping Guide

### For Personal Info Section:
- Use `hero-parallax` if you have projects to showcase
- Use `lamp` for a spotlight effect
- Use `aurora-background` for atmospheric background

### For Experience Section:
- Use `timeline` for chronological display
- Use `card-stack` for stacked cards effect
- Use `animated-testimonials` for recommendations

### For Projects Section:
- Use `layout-grid` for 4+ projects (expandable grid)
- Use `bento-grid` for 2-4 projects
- Use `apple-cards-carousel` for horizontal scrolling

### For Skills Section:
- Use `infinite-moving-cards` for auto-scrolling skills
- Use `hover-effect-v2` for interactive skill cards
- Use `3d-marquee` for 3D rotating display

## 🚀 Quick Start for Backend Developer

1. **Explore components**: 
   ```bash
   cd /app/components-gallery
   npm run dev
   # Visit http://localhost:3000/components-gallery
   ```

2. **Check adapter methods**:
   ```bash
   cat lib/component-adapter/general-adapter.ts | grep "private adapt"
   ```

3. **See component props**:
   ```bash
   cat components/ui/[component-name]/[component-name].types.ts
   ```

4. **Test your integration**:
   ```typescript
   const testData = { /* your CV data */ };
   const adapter = new GeneralComponentAdapter({
     cvData: testData,
     componentType: "hero-parallax"
   });
   console.log(adapter.adapt());
   ```

## ⚠️ Important Notes

1. **Import motion correctly**: Always use `import { motion } from "motion/react"`
2. **Component naming**: All folders use kebab-case, components use PascalCase
3. **Dual directories**: `/components/ui/` and `/component-library/` must stay in sync
4. **Gallery first**: Always check the gallery to understand a component before using it

This guide gives you the complete picture of how the component library is structured and how to integrate your backend with it!