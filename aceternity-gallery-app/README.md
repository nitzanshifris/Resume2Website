# Aceternity UI Component System

A comprehensive collection of animated UI components built with React, TypeScript, Framer Motion, and Tailwind CSS for the CV2WEB-V3 application.

## 📚 Documentation Index

### Backend Integration
- **[COMPONENT_LIBRARY_STRUCTURE_GUIDE.md](./COMPONENT_LIBRARY_STRUCTURE_GUIDE.md)** - Detailed file structure guide for backend integration

### Getting Started
- **[PROJECT_STRUCTURE.md](./docs/project-docs/PROJECT_STRUCTURE.md)** - Complete overview of project architecture and directory structure
- **[QUICK_START.md](./docs/project-docs/QUICK_START.md)** - Step-by-step guide for common tasks and workflows
- **[DEPENDENCIES.md](./docs/project-docs/DEPENDENCIES.md)** - All required packages and configuration

### Reference
- **[COMPONENTS_INDEX.md](./docs/project-docs/COMPONENTS_INDEX.md)** - Complete list of all 65+ components with details
- **[NAMING_CONVENTIONS.md](./docs/project-docs/NAMING_CONVENTIONS.md)** - Coding standards and naming rules

### Other Documentation
- **[CV2WEB_COMPLETE_GUIDE.md](./docs/CV2WEB_COMPLETE_GUIDE.md)** - CV integration system documentation
- **[COMPONENT_INTEGRATION_PROMPT.md](./docs/COMPONENT_INTEGRATION_PROMPT.md)** - Component integration checklist

## 🚀 Quick Links

### Development
- **Component Gallery**: `/app/components-gallery/`
- **Source Components**: `/components/ui/`
- **Component Library**: `/component-library/`

### Configuration
- **Component Configs**: `/component-library/metadata/component-configs.ts`
- **Component Registry**: `/lib/component-adapter/component-registry.ts`
- **General Adapter**: `/lib/component-adapter/general-adapter.ts`

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎯 Key Features

- **65+ Animated Components** - From backgrounds to interactive elements
- **TypeScript Support** - Full type safety and IntelliSense
- **Framer Motion Animations** - Smooth, performant animations
- **Tailwind CSS Styling** - Utility-first CSS framework
- **Component Playground** - Interactive prop testing
- **CV Data Integration** - Automatic adaptation to CV data
- **Responsive Design** - Mobile-first approach
- **Dark Mode Support** - Built-in theme support

## 📂 Project Structure

```
aceternity/
├── PROJECT_STRUCTURE.md     # Detailed architecture guide
├── QUICK_START.md          # How-to guide for developers
├── COMPONENTS_INDEX.md     # All components catalog
├── NAMING_CONVENTIONS.md   # Coding standards
├── DEPENDENCIES.md         # Package requirements
├── app/                    # Next.js app directory
├── components/             # UI components source
├── component-library/      # Reusable library
├── lib/                    # Utilities and adapters
└── public/                 # Static assets
```

## 🛠️ Common Tasks

### Add a New Component
See [QUICK_START.md#adding-a-new-component](./QUICK_START.md#adding-a-new-component)

### Modify Existing Component
See [QUICK_START.md#modifying-existing-components](./QUICK_START.md#modifying-existing-components)

### View Component Gallery
```bash
npm run dev
# Navigate to http://localhost:3000/components-gallery
```

## 📋 Component Categories

- **Background Components** (9) - Animated backgrounds and effects
- **Interactive Components** (20) - Cards, tooltips, and interactive elements
- **Layout Components** (5) - Grid systems and navigation
- **Content & Media** (11) - Carousels, sliders, and content display
- **Special Effects** (13) - Unique visual effects and animations
- **Utility Components** (2) - Helper components
- **Base UI Components** (10) - Standard form elements

See [COMPONENTS_INDEX.md](./COMPONENTS_INDEX.md) for the complete list.

## 🔧 Development Workflow

1. **Read Documentation** - Start with PROJECT_STRUCTURE.md
2. **Follow Naming Conventions** - Check NAMING_CONVENTIONS.md
3. **Create/Modify Component** - Use QUICK_START.md guide
4. **Test in Gallery** - View in component gallery
5. **Update Documentation** - Keep docs in sync

## 🎨 Component Standards

Each component includes:
- ✅ TypeScript types
- ✅ Multiple demo variants
- ✅ README documentation
- ✅ Registry metadata
- ✅ Gallery page
- ✅ Playground support (where applicable)

## 🤝 Contributing

1. Follow the naming conventions
2. Create all required files
3. Test thoroughly
4. Update documentation
5. Ensure TypeScript compliance

## 📝 Notes

- Uses Framer Motion v12+ (import as `motion/react`)
- React 19 and Next.js 15 with App Router
- Tailwind CSS for styling
- Full TypeScript support

## 🔍 Finding Information

- **Need to add a component?** → [QUICK_START.md](./QUICK_START.md)
- **Looking for a component?** → [COMPONENTS_INDEX.md](./COMPONENTS_INDEX.md)
- **Understanding the structure?** → [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- **Package questions?** → [DEPENDENCIES.md](./DEPENDENCIES.md)
- **Coding standards?** → [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md)

---

For detailed information about any aspect of this project, please refer to the appropriate documentation file listed above.