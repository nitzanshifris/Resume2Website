# Naming Conventions Guide

## Overview
This document outlines the naming conventions used throughout the Aceternity UI component system to ensure consistency and maintainability.

## File Naming Conventions

### Component Files
All component files use **kebab-case** naming:

```
✅ CORRECT:
- component-name-base.tsx
- component-name-demo.tsx
- component-name.types.ts
- component-name.registry.json

❌ INCORRECT:
- componentNameBase.tsx
- ComponentNameDemo.tsx
- component_name_types.ts
```

### File Suffixes
Each file type has a specific suffix pattern:

| File Type | Suffix Pattern | Example |
|-----------|----------------|---------|
| Base Component | `-base.tsx` | `hero-parallax-base.tsx` |
| Demo Component | `-demo.tsx` | `hero-parallax-demo.tsx` |
| Types | `.types.ts` | `hero-parallax.types.ts` |
| Registry | `.registry.json` | `hero-parallax.registry.json` |
| Index | `index.tsx` | `index.tsx` |
| Documentation | `README.md` | `README.md` |

### Directory Names
All directories use **kebab-case**:

```
✅ CORRECT:
- /components/ui/3d-card/
- /components/ui/background-gradient/
- /components/ui/infinite-moving-cards/

❌ INCORRECT:
- /components/ui/3dCard/
- /components/ui/Background_Gradient/
- /components/ui/InfiniteMovingCards/
```

## React Component Naming

### Component Names
React components use **PascalCase**:

```typescript
✅ CORRECT:
export const HeroParallax = () => { ... }
export const BackgroundGradient = () => { ... }
export const InfiniteMovingCards = () => { ... }

❌ INCORRECT:
export const heroParallax = () => { ... }
export const background_gradient = () => { ... }
export const infinite-moving-cards = () => { ... }
```

### Component Props Interfaces
Props interfaces follow the pattern `ComponentNameProps`:

```typescript
✅ CORRECT:
interface HeroParallaxProps { ... }
interface BackgroundGradientProps { ... }
type InfiniteMovingCardsProps = { ... }

❌ INCORRECT:
interface HeroParallaxPropsInterface { ... }
interface IHeroParallaxProps { ... }
interface heroParallaxProps { ... }
```

### Demo Component Names
Demo components append descriptive suffixes:

```typescript
✅ CORRECT:
export function HeroParallaxDemo() { ... }
export function HeroParallaxGalleryPreview() { ... }
export function HeroParallaxWithContent() { ... }

❌ INCORRECT:
export function Demo() { ... }
export function HeroParallaxDemoComponent() { ... }
export function hero_parallax_demo() { ... }
```

## Import/Export Conventions

### Named Exports
Use named exports for all components:

```typescript
✅ CORRECT:
export { HeroParallax } from "./hero-parallax-base";
export { HeroParallaxDemo } from "./hero-parallax-demo";
export type { HeroParallaxProps } from "./hero-parallax.types";

❌ INCORRECT:
export default HeroParallax;
module.exports = HeroParallax;
```

### Import Statements
Group imports logically:

```typescript
// 1. React and core libraries
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

// 2. Next.js specific
import Image from "next/image";
import Link from "next/link";

// 3. UI components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 4. Utilities
import { cn } from "@/lib/utils";

// 5. Types
import type { HeroParallaxProps } from "./hero-parallax.types";
```

## CSS and Styling

### Class Names
Use Tailwind CSS classes with **kebab-case** for custom classes:

```typescript
✅ CORRECT:
className="hero-section-wrapper"
className={cn("base-styles", "modifier-styles")}

❌ INCORRECT:
className="heroSectionWrapper"
className="hero_section_wrapper"
```

### CSS Variables
CSS custom properties use **kebab-case**:

```css
✅ CORRECT:
--background-color: #000;
--primary-gradient-start: #fff;
--animation-duration: 300ms;

❌ INCORRECT:
--backgroundColor: #000;
--PRIMARY_GRADIENT_START: #fff;
--animationDuration: 300ms;
```

## TypeScript Conventions

### Type Definitions
Types and interfaces use **PascalCase**:

```typescript
✅ CORRECT:
type ComponentVariant = "default" | "gradient" | "minimal";
interface UserData { ... }
enum AnimationState { ... }

❌ INCORRECT:
type componentVariant = ...;
interface user_data { ... }
enum animationState { ... }
```

### Generic Types
Generic type parameters use single uppercase letters or descriptive PascalCase:

```typescript
✅ CORRECT:
function useState<T>(): [T, (value: T) => void]
interface ComponentProps<TData extends BaseData> { ... }

❌ INCORRECT:
function useState<type>(): ...
interface ComponentProps<data> { ... }
```

## Function Naming

### Regular Functions
Use **camelCase** for function names:

```typescript
✅ CORRECT:
function calculatePosition() { ... }
const handleMouseMove = () => { ... }
const getUserData = async () => { ... }

❌ INCORRECT:
function CalculatePosition() { ... }
const handle_mouse_move = () => { ... }
const get-user-data = async () => { ... }
```

### Event Handlers
Prefix with "handle" or "on":

```typescript
✅ CORRECT:
const handleClick = () => { ... }
const handleSubmit = () => { ... }
const onScroll = () => { ... }

❌ INCORRECT:
const click = () => { ... }
const submitHandler = () => { ... }
const scrollFunction = () => { ... }
```

## Variable Naming

### Constants
Use **UPPER_SNAKE_CASE** for true constants:

```typescript
✅ CORRECT:
const MAX_ITEMS = 100;
const API_ENDPOINT = "https://api.example.com";
const DEFAULT_TIMEOUT = 5000;

❌ INCORRECT:
const maxItems = 100;
const apiEndpoint = "https://api.example.com";
const default_timeout = 5000;
```

### Boolean Variables
Prefix with "is", "has", or "should":

```typescript
✅ CORRECT:
const isLoading = true;
const hasError = false;
const shouldAnimate = true;

❌ INCORRECT:
const loading = true;
const error = false;
const animate = true;
```

## Configuration Files

### JSON Files
Use **kebab-case** for JSON configuration files:

```
✅ CORRECT:
- component-name.registry.json
- tsconfig.json
- package.json

❌ INCORRECT:
- componentName.registry.json
- TSConfig.json
- Package.json
```

### Configuration Objects
Use **camelCase** for object keys:

```json
✅ CORRECT:
{
  "componentName": "hero-parallax",
  "hasPlayground": true,
  "defaultProps": { ... }
}

❌ INCORRECT:
{
  "component-name": "hero-parallax",
  "has_playground": true,
  "DefaultProps": { ... }
}
```

## Git Branch Naming

Use **kebab-case** with prefixes:

```
✅ CORRECT:
- feature/add-hero-component
- fix/carousel-animation-bug
- docs/update-readme
- refactor/component-structure

❌ INCORRECT:
- Feature_AddHeroComponent
- fix_carousel_animation_bug
- DOCS-UPDATE-README
- refactor/componentStructure
```

## Summary Checklist

- ✅ Files and directories: **kebab-case**
- ✅ React components: **PascalCase**
- ✅ Functions and variables: **camelCase**
- ✅ Constants: **UPPER_SNAKE_CASE**
- ✅ CSS classes: **kebab-case** (Tailwind)
- ✅ Types and interfaces: **PascalCase**
- ✅ Props interfaces: **ComponentNameProps**
- ✅ Boolean variables: **is/has/should** prefix
- ✅ Event handlers: **handle/on** prefix
- ✅ Git branches: **type/description-kebab-case**