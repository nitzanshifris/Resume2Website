# Vortex Background

A wavy, swirly, vortex background ideal for CTAs and backgrounds.

## Features

- **Animated Particles**: Smooth particle animation using simplex noise
- **Customizable Colors**: Control particle hue and background colors
- **Performance Optimized**: Smooth 60fps animation with efficient rendering
- **Glow Effects**: Beautiful particle trails with blur and glow effects
- **Responsive**: Adapts to container size automatically
- **Interactive**: Particles respond to noise patterns for dynamic movement

## Installation

```bash
npm install motion clsx tailwind-merge simplex-noise
```

## Usage

### Basic Usage

```tsx
import { Vortex } from "@/components/ui/vortex";

export function VortexDemo() {
  return (
    <div className="w-[calc(100%-4rem)] mx-auto rounded-md h-[30rem] overflow-hidden">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          Your Content Here
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          Your description text goes here.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white">
            Call to Action
          </button>
        </div>
      </Vortex>
    </div>
  );
}
```

### Full Page Usage

```tsx
import { Vortex } from "@/components/ui/vortex";

export function VortexFullPage() {
  return (
    <div className="w-[calc(100%-4rem)] mx-auto rounded-md h-screen overflow-hidden">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          Full Screen Vortex
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          Extended range and custom settings for full page displays.
        </p>
      </Vortex>
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `any` | - | Optional children to be rendered inside the component |
| `className` | `string` | - | Optional className for styling the children wrapper |
| `containerClassName` | `string` | - | Optional className for styling the container |
| `particleCount` | `number` | `700` | Number of particles to be generated |
| `rangeY` | `number` | `100` | Vertical range for particle movement |
| `baseHue` | `number` | `220` | Base hue for particle color (0-360) |
| `baseSpeed` | `number` | `0.0` | Base speed for particle movement |
| `rangeSpeed` | `number` | `1.5` | Range of speed variation for particles |
| `baseRadius` | `number` | `1` | Base radius of particles |
| `rangeRadius` | `number` | `2` | Range of radius variation for particles |
| `backgroundColor` | `string` | `"#000000"` | Background color of the canvas |

## Examples

### Green Vortex
```tsx
<Vortex
  backgroundColor="black"
  baseHue={120}
  particleCount={500}
  rangeY={200}
>
  <YourContent />
</Vortex>
```

### High Energy Vortex
```tsx
<Vortex
  backgroundColor="black"
  baseHue={280}
  particleCount={800}
  baseSpeed={0.5}
  rangeSpeed={2.0}
  rangeY={150}
>
  <YourContent />
</Vortex>
```

### Custom Colors
```tsx
<Vortex
  backgroundColor="#1a1a1a"
  baseHue={60}
  particleCount={400}
>
  <YourContent />
</Vortex>
```

## Styling

### Container Styling
Use the `containerClassName` prop to style the outer container:

```tsx
<Vortex
  containerClassName="h-screen w-full rounded-xl border border-gray-700"
  backgroundColor="black"
>
  <YourContent />
</Vortex>
```

### Content Styling
Use the `className` prop to style the content area:

```tsx
<Vortex
  className="flex items-center justify-center text-center p-8"
  backgroundColor="black"
>
  <YourContent />
</Vortex>
```

## Technical Details

### Animation System
- Uses `simplex-noise` for smooth, organic particle movement
- Canvas-based rendering for optimal performance
- RequestAnimationFrame for smooth 60fps animation
- Efficient particle recycling system

### Particle System
- Each particle has position, velocity, life, speed, radius, and hue
- Particles are influenced by 3D noise for natural movement
- Automatic boundary detection and particle respawning
- Customizable particle properties via props

### Rendering Pipeline
1. Clear canvas and fill background
2. Update particle positions using noise
3. Draw particle trails with HSL colors
4. Apply glow effects with blur filters
5. Composite final image

## Performance Considerations

- **Particle Count**: Higher counts look better but use more CPU
- **Range Settings**: Larger ranges require more calculations
- **Speed Settings**: Higher speeds increase animation complexity
- **Canvas Size**: Larger canvases require more rendering work

Recommended settings for different use cases:
- **Hero sections**: 500-700 particles
- **Background elements**: 300-500 particles
- **Mobile devices**: 200-400 particles
- **Full screen**: 800-1000 particles

## Browser Support

Works in all modern browsers that support:
- HTML5 Canvas
- RequestAnimationFrame
- CSS filters (blur, brightness)
- ES6+ JavaScript features

## Common Use Cases

- Hero section backgrounds
- Call-to-action overlays
- Loading screen animations
- Product showcase backgrounds
- Landing page effects
- Modal dialog backgrounds