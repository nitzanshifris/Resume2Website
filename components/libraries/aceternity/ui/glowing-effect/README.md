# Glowing Effect

A border glowing effect that adapts to any container or card, as seen on Cursor's website. The component creates a dynamic glowing border that follows the user's mouse movement.

## Features

- **Mouse Tracking**: Dynamic glow that follows cursor movement
- **Adaptive Borders**: Automatically adapts to container shape and size
- **Performance Optimized**: Uses requestAnimationFrame for smooth animations
- **Customizable**: Multiple variants and extensive configuration options
- **Inactive Zone**: Central area where effect is disabled for better UX
- **Proximity Detection**: Effect extends beyond element boundaries

## Usage

```tsx
import { GlowingEffect } from "./glowing-effect";

export function Example() {
  return (
    <div className="relative p-4 border rounded-lg">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />
      <div className="p-6">
        <h3 className="text-lg font-semibold">Card Title</h3>
        <p className="text-neutral-400">Content goes here</p>
      </div>
    </div>
  );
}
```

## Variants

### Default Variant
Multi-color gradient glow with pink, yellow, green, and blue colors.

### White Variant
Monochrome black and white gradient effect.

### Enhanced Demo
Stronger effect with increased border width and spread.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| blur | number | 0 | Amount of blur applied to the glow effect (px) |
| inactiveZone | number | 0.7 | Radius multiplier for center inactive zone (0-1) |
| proximity | number | 0 | Distance beyond bounds where effect remains active (px) |
| spread | number | 20 | Angular spread of the glow effect (degrees) |
| variant | "default" \| "white" | "default" | Color variant of the effect |
| glow | boolean | false | Force glow visibility regardless of hover |
| className | string | undefined | Additional CSS classes |
| disabled | boolean | true | Disable the interactive effect |
| movementDuration | number | 2 | Duration of glow movement animation (seconds) |
| borderWidth | number | 1 | Width of the glowing border (px) |

## Styling

The component uses CSS custom properties for dynamic styling:
- `--blur`: Blur amount in pixels
- `--spread`: Angular spread value
- `--start`: Current rotation angle
- `--active`: Effect activation state (0 or 1)
- `--glowingeffect-border-width`: Border width
- `--gradient`: Dynamic gradient definition

## Performance

- Uses `requestAnimationFrame` for smooth animations
- Implements proper cleanup to prevent memory leaks
- Optimized event listeners with passive option
- Cancels previous animation frames to prevent stacking

## Examples

### Basic Usage
```tsx
<div className="relative border rounded-lg p-4">
  <GlowingEffect disabled={false} glow={true} />
  <div className="relative z-10">Content here</div>
</div>
```

### Enhanced Effect
```tsx
<GlowingEffect
  blur={0}
  borderWidth={3}
  spread={80}
  glow={true}
  disabled={false}
  proximity={64}
  inactiveZone={0.01}
/>
```

### White Variant
```tsx
<GlowingEffect
  variant="white"
  disabled={false}
  glow={true}
/>
```

## Implementation Notes

- Component must be used inside a positioned container (relative/absolute)
- Uses `memo` for performance optimization
- Properly handles cleanup on unmount
- Supports both mouse and touch events
- Automatically adjusts to container dimensions