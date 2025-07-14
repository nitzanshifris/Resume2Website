# Dependencies Documentation

## Overview
This document lists all dependencies required for the Aceternity UI component system, including core dependencies, peer dependencies, and component-specific requirements.

## Core Dependencies

### React & Next.js
```json
"next": "^15.0.3"
"react": "^19.0.0"
"react-dom": "^19.0.0"
```

### Animation Libraries
```json
"framer-motion": "^12.16.0"
"motion": "^12.18.1"
```
**Note**: Import motion as `motion/react` in components.

### Styling
```json
"tailwindcss": "^3.4.16"
"tailwind-merge": "^3.3.0"
"clsx": "^2.1.1"
"classnames": "^2.5.1"
"class-variance-authority": "^0.7.1"
```

### TypeScript
```json
"typescript": "^5.8.3"
"@types/node": "^22.15.29"
"@types/react": "^19.1.6"
"@types/react-dom": "^19.0.1"
```

## Component-Specific Dependencies

### 3D and WebGL Components
Used by: `globe`, `three-globe`
```json
"@react-three/drei": "^10.3.0"
"@react-three/fiber": "^9.1.2"
"three": "^0.177.0"
"three-globe": "^2.42.11"
"@types/three": "^0.177.0"
"cobe": "^0.6.4"
```

### Particle Effects
Used by: `particle-background`, `tsparticles` components
```json
"@tsparticles/engine": "^3.8.1"
"@tsparticles/react": "^3.0.0"
"@tsparticles/slim": "^3.8.1"
```

### UI Components
```json
"@tabler/icons-react": "^3.34.0"
"lucide-react": "^0.454.0"
"react-icons": "^5.5.0"
```

### Specialized Components

#### Code Block
```json
"react-syntax-highlighter": "^15.6.1"
"@types/react-syntax-highlighter": "^15.5.13"
```

#### File Upload
```json
"react-dropzone": "^14.3.5"
```

#### Marquee Effects
```json
"react-fast-marquee": "^1.6.5"
```

#### Text Utilities
```json
"react-wrap-balancer": "^1.1.1"
```

#### Map Components
```json
"dotted-map": "^2.2.3"
```

#### Noise Generation
```json
"simplex-noise": "^4.0.3"
```

## Additional Dependencies for Link Preview

**Note**: These are not currently in package.json but required for the link-preview component:
```bash
npm install @radix-ui/react-hover-card qss
```

## Development Dependencies

### Build Tools
```json
"autoprefixer": "^10.4.20"
"postcss": "^8.4.49"
```

### Linting
```json
"eslint": "^9.17.0"
"eslint-config-next": "^15.0.3"
```

## Installation Commands

### Install all dependencies
```bash
npm install
```

### Install specific component dependencies
```bash
# For link-preview component
npm install @radix-ui/react-hover-card qss

# For code-block component (already included)
# react-syntax-highlighter is already in dependencies

# For file-upload component (already included)
# react-dropzone is already in dependencies
```

## Configuration Requirements

### Next.js Configuration
For certain components, you need to update `next.config.js`:

#### Link Preview Component
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.microlink.io"],
  },
};

module.exports = nextConfig;
```

### Tailwind Configuration
Ensure your `tailwind.config.js` includes:
```javascript
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./component-library/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // ... rest of config
};
```

### TypeScript Configuration
Your `tsconfig.json` should include:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Peer Dependencies

These should be installed in your main project:
- React 18+ or 19+
- Next.js 13+ (with App Router)
- Tailwind CSS 3+
- TypeScript 5+

## Version Compatibility

- **React**: Version 19.0.0 (latest)
- **Next.js**: Version 15.0.3 (latest with App Router)
- **Framer Motion**: Version 12+ (uses new `motion/react` import)
- **TypeScript**: Version 5.8.3

## Bundle Size Considerations

Large dependencies to be aware of:
- `three` and related 3D libraries (significant size)
- `@tsparticles` suite (moderate size)
- `react-syntax-highlighter` (includes language definitions)

Consider lazy loading components that use these dependencies.

## Troubleshooting

### Common Issues

1. **Motion import errors**
   - Use `import { motion } from "motion/react"` not `"framer-motion"`

2. **Type errors with React 19**
   - Ensure all type packages are updated to support React 19

3. **Missing peer dependencies**
   - Run `npm install` to install all dependencies
   - Check for any peer dependency warnings

4. **Build errors**
   - Clear `.next` folder and rebuild
   - Check for version conflicts in package-lock.json