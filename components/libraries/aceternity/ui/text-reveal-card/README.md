# Text Reveal Card

An interactive card component that reveals hidden text on mouse movement. Features animated stars background and smooth text transitions following cursor position.

## Features

- **Mouse Tracking**: Reveals text based on cursor position
- **Touch Support**: Fully functional on mobile devices
- **Animated Stars**: Dynamic starfield background with 80 particles
- **Clip Path Animation**: Smooth reveal effect using CSS clip-path
- **Gradient Text**: Beautiful gradient on revealed text
- **TypeScript Support**: Fully typed components
- **Responsive Design**: Adapts to different screen sizes

## Installation

```bash
npm install motion clsx tailwind-merge
```

## Usage

```tsx
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "./text-reveal-card";

export function MyComponent() {
  return (
    <div className="flex items-center justify-center bg-[#0E0E10] h-[40rem] rounded-2xl w-full">
      <TextRevealCard
        text="You know the business"
        revealText="I know the chemistry"
      >
        <TextRevealCardTitle>
          Sometimes, you just need to see it.
        </TextRevealCardTitle>
        <TextRevealCardDescription>
          This is a text reveal card. Hover over the card to reveal the hidden text.
        </TextRevealCardDescription>
      </TextRevealCard>
    </div>
  );
}
```

## Props

### TextRevealCard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | - | Static text that remains visible (required) |
| `revealText` | `string` | - | Text revealed on hover/touch (required) |
| `children` | `ReactNode` | - | Card content (title and description) |
| `className` | `string` | - | Additional CSS classes |

### TextRevealCardTitle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Title content (required) |
| `className` | `string` | - | Additional CSS classes |

### TextRevealCardDescription

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Description content (required) |
| `className` | `string` | - | Additional CSS classes |

## Examples

### Basic Usage
```tsx
<TextRevealCard
  text="Dream big"
  revealText="Work hard"
>
  <TextRevealCardTitle>
    Motivation
  </TextRevealCardTitle>
  <TextRevealCardDescription>
    Hover to reveal the secret to success.
  </TextRevealCardDescription>
</TextRevealCard>
```

### Custom Styling
```tsx
<TextRevealCard
  text="Create with passion"
  revealText="Design with purpose"
  className="bg-purple-900 border-purple-500 w-[45rem]"
>
  <TextRevealCardTitle className="text-purple-300">
    Design Philosophy
  </TextRevealCardTitle>
  <TextRevealCardDescription className="text-purple-200">
    Our approach to creative design.
  </TextRevealCardDescription>
</TextRevealCard>
```

### Minimal Theme
```tsx
<TextRevealCard
  text="Less is more"
  revealText="Simplicity wins"
  className="bg-white border-gray-200 w-[35rem]"
>
  <TextRevealCardTitle className="text-gray-900">
    Minimalism
  </TextRevealCardTitle>
  <TextRevealCardDescription className="text-gray-600">
    The power of simple design.
  </TextRevealCardDescription>
</TextRevealCard>
```

## Technical Details

### Mouse Tracking
- Calculates mouse position relative to card bounds
- Updates width percentage for reveal effect
- Smooth transitions on mouse leave

### Touch Support
- Full support for touch devices
- Uses touchstart, touchmove, and touchend events
- Same reveal behavior as mouse interaction

### Animated Background
- 80 star particles with random positions
- Continuous animation with varying durations
- Memoized for performance optimization
- Uses deterministic "random" values to prevent hydration issues

### Text Effects
- Static text: Muted color with mask gradient
- Revealed text: White gradient with text shadow
- Vertical indicator line that follows cursor

## Styling

### Default Colors
- Card background: `#1d1c20`
- Border: `white/[0.08]`
- Static text: `#323238`
- Title: White
- Description: `#a9a9a9`

### Text Sizes
- Desktop: `text-[3rem]` (48px)
- Mobile: `text-base` (16px)
- Responsive with `sm:` prefix

### Container
- Default width: `w-[40rem]` (640px)
- Height: Fixed at 40 height units for text area
- Padding: `p-8` (32px)

## Performance Considerations

- Stars component is memoized to prevent re-renders
- Uses `will-change-transform` for smooth animations
- Efficient mouse tracking with single state update
- Optimized clip-path animations

## Accessibility

- Both texts are readable by screen readers
- Touch support for mobile users
- Consider adding ARIA labels for context
- Ensure sufficient color contrast

## Browser Support

Works in all modern browsers with support for:
- CSS clip-path
- CSS transforms
- Touch events
- CSS gradients
- JavaScript ES6+

## Common Use Cases

- Interactive hero sections
- Product feature reveals
- Portfolio project cards
- Marketing campaigns
- Educational content
- Creative presentations
- Landing page interactions