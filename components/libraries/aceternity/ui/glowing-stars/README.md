# Glowing Background Stars Card

Card background stars that animate on hover and animate anyway. This component creates a beautiful card with an animated star field background that responds to user interaction.

## Features

- **Animated Star Field**: 108 animated stars arranged in an 18-column grid
- **Hover Effects**: Stars glow and animate when card is hovered
- **Auto Animation**: Random stars automatically glow every 3 seconds
- **Responsive Design**: Adapts to different screen sizes
- **Smooth Transitions**: Framer Motion powered animations
- **Customizable Content**: Flexible title and description components

## Usage

```tsx
import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from "./glowing-stars";

export function Example() {
  return (
    <GlowingStarsBackgroundCard>
      <GlowingStarsTitle>Next.js 14</GlowingStarsTitle>
      <div className="flex justify-between items-end">
        <GlowingStarsDescription>
          The power of full-stack to the frontend. Read the release notes.
        </GlowingStarsDescription>
        <div className="h-8 w-8 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center">
          {/* Icon content */}
        </div>
      </div>
    </GlowingStarsBackgroundCard>
  );
}
```

## Components

### GlowingStarsBackgroundCard
The main card container with animated star background.

### GlowingStarsTitle
Styled title component with appropriate typography for the card.

### GlowingStarsDescription
Styled description component with constrained width for optimal readability.

### Illustration
Internal component that renders the animated star field (108 stars in 18 columns).

## Props

### GlowingStarsBackgroundCard
| Prop | Type | Description |
|------|------|-------------|
| className | string | Additional CSS classes for the card |
| children | React.ReactNode | Card content |

### GlowingStarsTitle
| Prop | Type | Description |
|------|------|-------------|
| className | string | Additional CSS classes for the title |
| children | React.ReactNode | Title content |

### GlowingStarsDescription
| Prop | Type | Description |
|------|------|-------------|
| className | string | Additional CSS classes for the description |
| children | React.ReactNode | Description content |

## Animation Details

- **Stars**: 108 stars arranged in 18 columns
- **Auto Glow**: 5 random stars glow every 3 seconds
- **Hover Effect**: All stars activate on card hover
- **Glow Animation**: 2-second duration with easeInOut timing
- **Scale Animation**: Stars scale from 1 to 2.5 when glowing
- **Color Change**: Stars change from #666 to white when active

## Styling

The component uses a dark gradient background:
- Background: `linear-gradient(110deg,#333_0.6%,#222)`
- Border: Light border with dark mode support
- Rounded corners: `rounded-xl`
- Max dimensions: `max-w-md max-h-[20rem]`

## Performance

- Uses `useRef` to track highlighted stars for efficiency
- Implements proper cleanup with `clearInterval`
- AnimatePresence handles smooth enter/exit animations
- Optimized re-renders with strategic state updates

## Examples

### Basic Card
```tsx
<GlowingStarsBackgroundCard>
  <GlowingStarsTitle>Feature Title</GlowingStarsTitle>
  <GlowingStarsDescription>
    Feature description with animated background.
  </GlowingStarsDescription>
</GlowingStarsBackgroundCard>
```

### Card with Icon
```tsx
<GlowingStarsBackgroundCard>
  <GlowingStarsTitle>Next.js 14</GlowingStarsTitle>
  <div className="flex justify-between items-end">
    <GlowingStarsDescription>
      The power of full-stack to the frontend.
    </GlowingStarsDescription>
    <div className="h-8 w-8 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center">
      <ArrowIcon />
    </div>
  </div>
</GlowingStarsBackgroundCard>
```

### Custom Styling
```tsx
<GlowingStarsBackgroundCard className="max-w-lg">
  <GlowingStarsTitle className="text-3xl text-blue-200">
    Custom Title
  </GlowingStarsTitle>
  <GlowingStarsDescription className="text-gray-300">
    Custom description with different styling.
  </GlowingStarsDescription>
</GlowingStarsBackgroundCard>
```

## Implementation Notes

- Component requires Framer Motion for animations
- Uses CSS Grid for star layout
- Implements mouse event handlers for hover detection
- Stars are positioned using absolute positioning within grid cells
- Glow effects use CSS blur and shadow properties