# Magic UI Portfolio Experiment

This demonstrates how to use Magic UI components to create a beautiful portfolio from CV data.

## What's Included

### Magic UI Components Used:
- **BlurFade** - Beautiful fade-in animations with blur effect
- **BentoGrid** - Modern grid layout for skills section
- **Marquee** - Auto-scrolling showcase for technologies
- **Button** - Styled buttons with hover effects

### Features:
- ✅ Dark mode enabled by default
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Type-safe with TypeScript
- ✅ Clean component architecture

## Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit http://localhost:3000 to see the portfolio.

## Adding More Components

Magic UI uses the same installation process as shadcn/ui:

```bash
# Add a new component
npx shadcn@latest add "https://magicui.design/r/[component-name].json"
```

## Available Components from Magic UI:
- animated-beam
- bento-grid
- blur-fade
- marquee
- globe
- grid-pattern
- retro-grid
- dot-pattern
- meteors
- sparkles
- and many more...

## MCP Support

Magic UI supports Model Context Protocol (MCP) for AI-assisted development:

```bash
# For Cursor
pnpm dlx @magicuidesign/cli@latest install cursor

# For Windsurf
pnpm dlx @magicuidesign/cli@latest install windsurf
```

This gives your AI IDE direct access to all Magic UI components.

## Architecture

```typescript
// Clean component structure
import { BlurFade } from "@/components/magicui/blur-fade";

<BlurFade delay={0.25} inView>
  <h1 className="text-7xl font-bold">
    {cvData.hero.fullName}
  </h1>
</BlurFade>
```

## Benefits Over String Concatenation

1. **Type Safety** - Full TypeScript support
2. **Component-Based** - Reusable, modular components
3. **Clean Code** - No string concatenation mess
4. **Easy to Maintain** - Each component is self-contained
5. **AI-Friendly** - Works with MCP for better code generation

## Customization

1. Edit `app/page.tsx` to modify the portfolio content
2. Update `cvData` object with your own CV information
3. Customize colors in `app/globals.css`
4. Add more Magic UI components as needed

## Next Steps

1. Connect to your CV extraction service
2. Add more sections (projects, education, etc.)
3. Implement contact form functionality
4. Deploy to Vercel or Netlify

## Resources

- [Magic UI Documentation](https://magicui.design/docs)
- [Component Gallery](https://magicui.design/components)
- [MCP Documentation](https://magicui.design/docs/mcp)