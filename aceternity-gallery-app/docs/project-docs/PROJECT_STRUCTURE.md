# Aceternity UI Component System - Project Structure

## Overview
This project integrates the Aceternity UI component library into the CV2WEB-V3 application. It provides a comprehensive set of animated UI components built with React, TypeScript, Framer Motion, and Tailwind CSS.

## Directory Structure

```
aceternity/
├── app/                          # Next.js 13+ App Router
│   ├── components-gallery/       # Component gallery pages
│   │   ├── [component-name]/    # Individual component demo pages
│   │   └── page.tsx            # Main gallery listing
│   └── ...                     # Other app routes
│
├── components/                  # Source UI components
│   └── ui/                     # All UI components
│       ├── [component-name]/   # Each component in its own folder
│       │   ├── [name]-base.tsx       # Core component logic
│       │   ├── [name]-demo.tsx       # Demo variations
│       │   ├── [name].types.ts      # TypeScript interfaces
│       │   ├── index.tsx             # Public exports
│       │   ├── README.md             # Component documentation
│       │   └── [name].registry.json  # Component metadata
│       └── ...
│
├── component-library/          # Reusable component library
│   ├── components/            # Duplicated components for library use
│   │   └── ui/               # Same structure as /components/ui
│   └── metadata/             # Component configuration
│       └── component-configs.ts  # Playground configurations
│
├── lib/                       # Utility functions and adapters
│   ├── component-adapter/    # CV data to component prop adapters
│   │   ├── general-adapter.ts     # Main adapter logic
│   │   └── component-registry.ts  # Component mappings
│   └── utils.ts              # General utilities
│
├── docs/                      # Documentation (if any)
├── data/                      # Static data files
├── hooks/                     # Custom React hooks
├── styles/                    # Global styles
├── public/                    # Static assets
└── utils/                     # Additional utilities
```

## Key Concepts

### 1. Component Structure
Each component follows a consistent structure:
- **base file**: Core component implementation
- **demo file**: Multiple demo variations for gallery
- **types file**: TypeScript type definitions
- **index file**: Clean exports
- **README**: Usage documentation
- **registry**: Metadata for component system

### 2. Dual Directory System
- `/components/ui/`: Primary component development
- `/component-library/`: Mirror for library distribution
- Both directories should maintain identical structures

### 3. Component Adapter System
The adapter system (`/lib/component-adapter/`) maps CV data to component props:
- `general-adapter.ts`: Contains adaptation logic for each component
- `component-registry.ts`: Defines supported data types and UI styles

### 4. Gallery System
- Each component has a dedicated gallery page in `/app/components-gallery/`
- Gallery pages showcase different variations and provide code examples
- Main gallery page lists all available components

## Component Integration Flow

1. **Component Creation**: Add new component to `/components/ui/`
2. **Type Definition**: Define TypeScript interfaces in `types.ts`
3. **Demo Creation**: Create demo variations in `demo.tsx`
4. **Documentation**: Write README with usage examples
5. **Registry**: Create `registry.json` with dependencies
6. **Gallery Page**: Create page in `/app/components-gallery/`
7. **Configuration**: Add to `component-configs.ts` for playground
8. **Adapter**: Update `general-adapter.ts` and `component-registry.ts`
9. **Main Gallery**: Add to main gallery listing
10. **Duplication**: Copy to `/component-library/`

## Available Components

See `COMPONENTS_INDEX.md` for a complete list of available components.

## Configuration Files

- `component-configs.ts`: Playground prop configurations
- `component-registry.ts`: Component data type mappings
- `general-adapter.ts`: CV data adaptation logic
- Individual `registry.json`: Component-specific metadata

## Naming Conventions

See `NAMING_CONVENTIONS.md` for detailed naming rules.

## Dependencies

See `DEPENDENCIES.md` for required packages and configurations.

## Quick Start

See `QUICK_START.md` for common tasks and workflows.