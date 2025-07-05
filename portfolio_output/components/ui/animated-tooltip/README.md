# Animated Tooltip Component

A cool tooltip component that reveals on hover and follows mouse pointer with smooth animations.

## Usage

```tsx
import { AnimatedTooltip } from './animated-tooltip';

const people = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image: "https://example.com/avatar1.jpg"
  },
  // Add more items...
];

export function MyComponent() {
  return <AnimatedTooltip items={people} />;
}
```

## Props

### AnimatedTooltip

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | TooltipItem[] | required | Array of tooltip items to display |
| className | string | - | Additional CSS classes for the container |

### TooltipItem Type

```typescript
interface TooltipItem {
  id: number;
  name: string;
  designation: string;
  image: string;
}
```

## Features

- Smooth spring animations on hover
- Dynamic rotation based on mouse position
- Stacked avatar layout with negative margins
- Gradient accent lines in tooltip
- Scale effect on hover
- Dark theme optimized

## Variants

1. **Team Avatars** - Display team members with overlapping avatars
2. **Social Profiles** - Show social media connections
3. **Skill Badges** - Technical skills with experience levels

## Animation Details

- Spring physics for natural movement
- Tooltip follows mouse cursor
- Rotation effect based on hover position
- PopLayout animation mode for smooth transitions