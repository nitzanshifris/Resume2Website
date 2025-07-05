# Bento Grid Component

A skewed grid layout with title, description and a header component. Perfect for showcasing features, skills, projects, or services in an organized and visually appealing grid format.

## Features

- Responsive grid layout (1 column on mobile, 3 columns on desktop)
- Hover animations with translate effects
- Customizable grid item spanning (1 or 2 columns)
- Dark mode compatible
- Flexible header content (images, animations, components)
- TypeScript support

## Usage

### Basic Usage

```tsx
import { BentoGrid, BentoGridItem } from "./bento-grid-base";
import { IconClipboardCopy } from "@tabler/icons-react";

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

function MyBentoGrid() {
  const items = [
    {
      title: "Feature Title",
      description: "Feature description goes here",
      header: <Skeleton />,
      icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    }
  ];

  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}
```

### Available Variants

1. **Basic** (`bento-grid-basic.tsx`)
   - Simple grid with skeleton headers
   - Good for content placeholders

2. **Animated** (`bento-grid-animated.tsx`)
   - Interactive animations on hover
   - Complex motion graphics in headers

3. **Two Column** (`bento-grid-two-column.tsx`)
   - Alternating 2-column and 1-column layout
   - Great for feature highlights

4. **Skills Showcase** (`bento-grid-skills-showcase.tsx`)
   - Perfect for displaying technical skills
   - Animated skill icons and tags

5. **Projects Showcase** (`bento-grid-projects-showcase.tsx`)
   - Project portfolio display
   - Technology stack tags and links

6. **Services Showcase** (`bento-grid-services-showcase.tsx`)
   - Service offerings presentation
   - Feature lists and pricing

## Props

### BentoGrid Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | undefined | Additional CSS classes |
| children | React.ReactNode | undefined | Grid items to render |

### BentoGridItem Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | undefined | Additional CSS classes (use for spanning) |
| title | string \| React.ReactNode | undefined | Item title |
| description | string \| React.ReactNode | undefined | Item description |
| header | React.ReactNode | undefined | Header content (image, animation, etc.) |
| icon | React.ReactNode | undefined | Small icon next to title |

## Grid Layout

The grid uses CSS Grid with the following classes:
- `grid-cols-1` on mobile
- `md:grid-cols-3` on desktop
- `md:auto-rows-[18rem]` for consistent row heights

### Column Spanning

Use className to make items span multiple columns:
```tsx
<BentoGridItem
  className="md:col-span-2" // Spans 2 columns
  // ... other props
/>
```

## Animations

Grid items include hover animations:
- `hover:shadow-xl` - Shadow increase on hover
- `group-hover/bento:translate-x-2` - Content slides right on hover
- Custom animations in headers for enhanced interactivity

## Styling Guidelines

- **Headers**: Use min-h-[6rem] for consistent height
- **Colors**: Follow neutral color scheme with accent colors for icons
- **Spacing**: Consistent p-4 padding, gap-4 grid spacing
- **Typography**: font-sans for consistency, font-bold for titles

## CV/Portfolio Use Cases

### Skills Section
```tsx
const skillsItems = [
  {
    title: "Frontend Development",
    description: "React, TypeScript, Next.js",
    header: <SkillIcon />,
    className: "md:col-span-2"
  }
];
```

### Projects Section
```tsx
const projectItems = [
  {
    title: "E-commerce Platform",
    description: "Full-stack online store",
    header: <ProjectImage />,
    icon: <ShoppingIcon />
  }
];
```

### Services Section
```tsx
const serviceItems = [
  {
    title: "Web Development",
    description: "Custom web applications",
    header: <ServiceIcon />,
    className: "md:col-span-1"
  }
];
```

## Dependencies

- @/lib/utils (cn function)
- @tabler/icons-react (for icons)
- motion/react (for animations in some variants)
- React 18+

## Accessibility

- Proper heading hierarchy with title elements
- Keyboard navigation support
- Screen reader friendly structure
- Sufficient color contrast ratios