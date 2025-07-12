# Timeline

A timeline component with sticky header and scroll beam follow.

## Features

- **Scroll-Animated Progress**: Dynamic beam that follows scroll position
- **Sticky Headers**: Timeline titles remain visible while scrolling
- **Responsive Design**: Optimized for mobile and desktop
- **Dark Mode Support**: Built-in dark mode with proper contrast
- **Rich Content Support**: Supports any React content including images
- **Smooth Animations**: Powered by Framer Motion

## Installation

```bash
npm install motion clsx tailwind-merge @tabler/icons-react
```

## Usage

```tsx
import { Timeline } from "@/components/ui/timeline";

const data = [
  {
    title: "2024",
    content: (
      <div>
        <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          Built and launched Aceternity UI and Aceternity UI Pro from scratch
        </p>
      </div>
    ),
  },
  {
    title: "Early 2023",
    content: (
      <div>
        <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          Started working on the component library
        </p>
      </div>
    ),
  },
];

export function MyTimeline() {
  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}
```

## Props

### Timeline

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `TimelineEntry[]` | Yes | Array of timeline entries with title and content |

### TimelineEntry

```typescript
interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}
```

## Examples

### Basic Timeline
```tsx
<Timeline 
  data={[
    {
      title: "Step 1",
      content: <p>First milestone achieved</p>
    },
    {
      title: "Step 2", 
      content: <p>Second milestone reached</p>
    }
  ]} 
/>
```

### Timeline with Images
```tsx
<Timeline 
  data={[
    {
      title: "Project Launch",
      content: (
        <div>
          <p className="mb-4">Successfully launched our new product</p>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="/image1.jpg" 
              alt="Product 1" 
              className="rounded-lg w-full"
            />
            <img 
              src="/image2.jpg" 
              alt="Product 2" 
              className="rounded-lg w-full"
            />
          </div>
        </div>
      )
    }
  ]} 
/>
```

### Changelog Timeline
```tsx
<Timeline 
  data={[
    {
      title: "v2.0.0",
      content: (
        <div>
          <p className="mb-4">Major Release</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              ✅ New component library
            </div>
            <div className="flex items-center gap-2">
              ✅ Performance improvements
            </div>
            <div className="flex items-center gap-2">
              ✅ Dark mode support
            </div>
          </div>
        </div>
      )
    }
  ]} 
/>
```

## Styling

The component includes built-in styling for:
- Timeline progress beam with gradient (purple to blue)
- Sticky headers on desktop
- Responsive text sizes
- Dark mode support
- Proper spacing and padding

## Technical Details

- Uses Framer Motion for scroll-based animations
- Calculates timeline height dynamically
- Smooth opacity and height transitions
- Sticky positioning for timeline titles

## Common Use Cases

- Company history
- Project milestones
- Product changelogs
- Educational timelines
- Career journey
- Event schedules