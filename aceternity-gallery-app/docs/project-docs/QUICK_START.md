# Quick Start Guide

## Overview
This guide provides quick instructions for common tasks when working with the Aceternity UI component system.

## Table of Contents
1. [Adding a New Component](#adding-a-new-component)
2. [Modifying Existing Components](#modifying-existing-components)
3. [Testing Components](#testing-components)
4. [Creating Component Variations](#creating-component-variations)
5. [Adding to Gallery](#adding-to-gallery)
6. [Common Commands](#common-commands)

## Adding a New Component

### Step 1: Create Component Directory
```bash
mkdir components/ui/your-component-name
```

### Step 2: Create Required Files
Create these files in your component directory:

#### 1. Base Component (`your-component-name-base.tsx`)
```typescript
"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { YourComponentNameProps } from "./your-component-name.types";

export const YourComponentName = ({
  className,
  children,
  ...props
}: YourComponentNameProps) => {
  return (
    <div className={cn("base-styles", className)} {...props}>
      {children}
    </div>
  );
};
```

#### 2. Types File (`your-component-name.types.ts`)
```typescript
import { HTMLAttributes } from "react";

export interface YourComponentNameProps extends HTMLAttributes<HTMLDivElement> {
  // Add your custom props here
  variant?: "default" | "gradient" | "outline";
  size?: "small" | "medium" | "large";
}

export interface YourComponentNameDemoProps {
  className?: string;
  containerClassName?: string;
}
```

#### 3. Demo File (`your-component-name-demo.tsx`)
```typescript
"use client";
import React from "react";
import { YourComponentName } from "./your-component-name-base";
import type { YourComponentNameDemoProps } from "./your-component-name.types";

export function YourComponentNameDemo({ 
  className, 
  containerClassName 
}: YourComponentNameDemoProps = {}) {
  return (
    <div className={containerClassName || "h-96 w-full"}>
      <YourComponentName className={className}>
        Demo content here
      </YourComponentName>
    </div>
  );
}

export function YourComponentNameGalleryPreview({ 
  className, 
  containerClassName 
}: YourComponentNameDemoProps = {}) {
  return (
    <div className={containerClassName || "h-96 w-full relative overflow-hidden rounded-lg"}>
      <YourComponentName className={className}>
        Gallery preview content
      </YourComponentName>
    </div>
  );
}
```

#### 4. Index File (`index.tsx`)
```typescript
export { YourComponentName } from "./your-component-name-base";
export { 
  YourComponentNameDemo,
  YourComponentNameGalleryPreview 
} from "./your-component-name-demo";
export type { 
  YourComponentNameProps,
  YourComponentNameDemoProps 
} from "./your-component-name.types";
```

#### 5. README File (`README.md`)
```markdown
# Your Component Name

Brief description of what the component does.

## Installation

\`\`\`bash
npm install [any-special-dependencies]
\`\`\`

## Usage

\`\`\`tsx
import { YourComponentName } from "@/components/ui/your-component-name";

export function Example() {
  return (
    <YourComponentName variant="default">
      Content here
    </YourComponentName>
  );
}
\`\`\`

## Props

- `variant` - Component variant (default, gradient, outline)
- `size` - Component size (small, medium, large)
- `className` - Additional CSS classes
```

#### 6. Registry File (`your-component-name.registry.json`)
```json
{
  "name": "your-component-name",
  "type": "registry:ui",
  "files": [
    {
      "name": "your-component-name-base.tsx",
      "content": "// File content will be auto-generated"
    },
    {
      "name": "your-component-name.types.ts",
      "content": "// File content will be auto-generated"
    },
    {
      "name": "index.tsx",
      "content": "// File content will be auto-generated"
    }
  ],
  "dependencies": [
    "motion",
    "clsx",
    "tailwind-merge"
  ],
  "devDependencies": [],
  "tailwind": {
    "config": {
      "theme": {
        "extend": {}
      }
    }
  }
}
```

### Step 3: Update System Files

#### 1. Add to Component Adapter (`/lib/component-adapter/general-adapter.ts`)
```typescript
// Add to ComponentType union
| "your-component-name"

// Add case in getComponentSpecificProps()
case "your-component-name":
  return this.adaptYourComponentName();

// Add adapter method
private adaptYourComponentName(): BaseAdaptedProps {
  const { cvData, variant } = this.config;
  
  return {
    variant: variant || "default",
    className: "",
    // Map CV data to component props
  };
}
```

#### 2. Add to Component Registry (`/lib/component-adapter/component-registry.ts`)
```typescript
"your-component-name": {
  componentType: "your-component-name",
  supportedDataTypes: ["DataType1", "DataType2"],
  supportedUIStyles: ["style1", "style2"],
  requiredProps: ["children"],
  optionalProps: ["variant", "size", "className"],
  defaultProps: {
    variant: "default",
    size: "medium",
  },
},
```

#### 3. Add to Component Configs (`/component-library/metadata/component-configs.ts`)
```typescript
'your-component-name': {
  id: 'your-component-name',
  name: 'your-component-name',
  title: 'Your Component Name',
  description: 'Brief description',
  category: 'Interactive', // or appropriate category
  hasPlayground: true,
  defaultProps: {
    variant: 'default',
    size: 'medium',
    className: '',
  },
  propConfigs: {
    variant: {
      type: 'select',
      label: 'Variant',
      defaultValue: 'default',
      options: ['default', 'gradient', 'outline'],
      description: 'Component variant'
    },
    // ... other props
  },
  codeTemplate: `// Template code`,
  importStatement: 'import { YourComponentName } from "@/component-library/components/ui/your-component-name";'
},
```

### Step 4: Create Gallery Page
Create `/app/components-gallery/your-component-name/page.tsx`

### Step 5: Add to Main Gallery
Update `/app/components-gallery/page.tsx`:
```typescript
{
  id: "your-component-name",
  name: "your-component-name",
  title: "Your Component Name",
  description: "Brief description",
  icon: IconName,
  category: "Interactive",
  hasPlayground: true,
  implemented: true,
},
```

### Step 6: Duplicate to Component Library
```bash
cp -r components/ui/your-component-name component-library/components/ui/
```

## Modifying Existing Components

### 1. Always modify the source component first:
```bash
cd components/ui/component-name
# Make your changes
```

### 2. Update types if needed:
Edit `component-name.types.ts`

### 3. Update demos if needed:
Edit `component-name-demo.tsx`

### 4. Copy changes to component-library:
```bash
cp -r components/ui/component-name/* component-library/components/ui/component-name/
```

## Testing Components

### 1. Run development server:
```bash
npm run dev
```

### 2. Navigate to component gallery:
```
http://localhost:3000/components-gallery
```

### 3. Test your component:
- Click on your component in the gallery
- Test all variants
- Check responsive behavior
- Verify playground functionality

### 4. Check for TypeScript errors:
```bash
npm run build
```

## Creating Component Variations

### 1. Add new demo variant:
```typescript
// In component-name-demo.tsx
export function ComponentNameNewVariant() {
  return (
    <ComponentName variant="new">
      New variant content
    </ComponentName>
  );
}
```

### 2. Export from index:
```typescript
// In index.tsx
export { ComponentNameNewVariant } from "./component-name-demo";
```

### 3. Update gallery page to show variant

## Adding to Gallery

### 1. Create gallery page structure:
```typescript
// /app/components-gallery/your-component/page.tsx
"use client";

import { useState } from "react";
import { YourComponentDemo } from "@/components/ui/your-component";
// ... imports

export default function YourComponentGalleryPage() {
  // Gallery page implementation
}
```

### 2. Add navigation and code examples

### 3. Test gallery page thoroughly

## Common Commands

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Check for linting errors
npm run lint
```

### Component Management
```bash
# Create new component directory
mkdir -p components/ui/new-component

# Copy component to library
cp -r components/ui/component-name component-library/components/ui/

# Find all components
ls components/ui/

# Search for component usage
grep -r "ComponentName" components/
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/add-new-component

# Add changes
git add .

# Commit with meaningful message
git commit -m "feat: add new-component with animations"

# Push changes
git push origin feature/add-new-component
```

## Troubleshooting

### Common Issues

1. **Import errors**
   - Check import paths use `@/` alias
   - Verify component is exported from index.tsx

2. **Type errors**
   - Ensure all props are defined in types file
   - Check for missing type exports

3. **Gallery not showing component**
   - Verify component is added to main gallery page
   - Check component has correct metadata

4. **Playground not working**
   - Ensure component is added to component-configs.ts
   - Verify prop configs are correct

5. **Animation not working**
   - Import motion from "motion/react" not "framer-motion"
   - Check for conflicting CSS

## Best Practices

1. **Always follow naming conventions** (see NAMING_CONVENTIONS.md)
2. **Create comprehensive demos** showing all features
3. **Document all props** in README and types
4. **Test responsive behavior** at different screen sizes
5. **Optimize bundle size** by lazy loading heavy dependencies
6. **Maintain consistency** with existing components
7. **Use TypeScript strictly** for better type safety
8. **Follow the adapter pattern** for CV data integration

## Need Help?

- Check existing components for examples
- Review PROJECT_STRUCTURE.md for architecture
- See NAMING_CONVENTIONS.md for naming rules
- Refer to DEPENDENCIES.md for package info