# Wavy Background

A cool background effect with waves that move.

## Features

- **Smooth Wave Animation**: Canvas-based wave rendering using simplex noise
- **Customizable Colors**: Set your own wave color palette
- **Adjustable Speed**: Choose between slow and fast animation speeds
- **Blur Effects**: Control the blur intensity for different visual styles
- **Opacity Control**: Adjust wave transparency
- **Responsive**: Automatically adapts to screen size changes
- **Safari Support**: Special handling for Safari browser compatibility

## Installation

```bash
npm install motion clsx tailwind-merge simplex-noise
```

## Usage

### Basic Usage

```tsx
import { WavyBackground } from "@/components/ui/wavy-background";

export function WavyBackgroundDemo() {
  return (
    <WavyBackground className="max-w-4xl mx-auto pb-40">
      <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
        Hero waves are cool
      </p>
      <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
        Leverage the power of canvas to create a beautiful hero section
      </p>
    </WavyBackground>
  );
}
```

### Custom Colors

```tsx
import { WavyBackground } from "@/components/ui/wavy-background";

export function CustomWavyBackground() {
  return (
    <WavyBackground 
      colors={["#8b5cf6", "#a855f7", "#c084fc", "#d946ef", "#e879f9"]}
      waveWidth={60}
      backgroundFill="#0f0b1a"
      className="max-w-4xl mx-auto pb-40"
    >
      <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
        Purple Waves
      </p>
      <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
        Custom purple color scheme for a mystical feel
      </p>
    </WavyBackground>
  );
}
```

### Slow Animation

```tsx
import { WavyBackground } from "@/components/ui/wavy-background";

export function SlowWavyBackground() {
  return (
    <WavyBackground 
      speed="slow"
      colors={["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"]}
      waveWidth={40}
      blur={15}
      waveOpacity={0.8}
      className="max-w-4xl mx-auto pb-40"
    >
      <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
        Slow Green Waves
      </p>
      <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
        Slower animation with green colors and higher opacity
      </p>
    </WavyBackground>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `any` | - | The content to be displayed on top of the wavy background |
| `className` | `string` | - | The CSS class to apply to the content container |
| `containerClassName` | `string` | - | The CSS class to apply to the main container |
| `colors` | `string[]` | `["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]` | The colors of the waves |
| `waveWidth` | `number` | `50` | The width of the waves |
| `backgroundFill` | `string` | `"black"` | The background color |
| `blur` | `number` | `10` | The blur effect applied to the waves |
| `speed` | `"slow" \| "fast"` | `"fast"` | The speed of the wave animation |
| `waveOpacity` | `number` | `0.5` | The opacity of the waves |

## Examples

### Hero Section
```tsx
<WavyBackground className="max-w-6xl mx-auto pb-40">
  <h1 className="text-4xl md:text-7xl text-white font-bold text-center">
    Welcome to Our Platform
  </h1>
  <p className="text-lg md:text-2xl mt-4 text-white text-center max-w-3xl mx-auto">
    Experience the power of animated backgrounds
  </p>
  <div className="flex gap-4 mt-8 justify-center">
    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
      Get Started
    </button>
    <button className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-black transition">
      Learn More
    </button>
  </div>
</WavyBackground>
```

### Marketing Section
```tsx
<WavyBackground 
  colors={["#f59e0b", "#f97316", "#ea580c", "#dc2626", "#b91c1c"]}
  speed="slow"
  waveWidth={30}
  blur={8}
  className="max-w-4xl mx-auto pb-40"
>
  <h2 className="text-3xl md:text-6xl text-white font-bold text-center">
    Boost Your Sales
  </h2>
  <p className="text-base md:text-xl mt-4 text-white text-center">
    With our revolutionary wave technology
  </p>
</WavyBackground>
```

### Constrained Height
```tsx
<WavyBackground 
  containerClassName="h-96 w-full relative overflow-hidden rounded-lg"
  className="flex items-center justify-center"
>
  <div className="text-center">
    <h3 className="text-2xl md:text-4xl text-white font-bold">
      Contained Waves
    </h3>
    <p className="text-white mt-2">
      Perfect for sections with fixed heights
    </p>
  </div>
</WavyBackground>
```

## Styling

### Container Styling
Use the `containerClassName` prop to control the outer container:

```tsx
<WavyBackground
  containerClassName="h-screen w-full relative overflow-hidden"
  className="flex items-center justify-center"
>
  <YourContent />
</WavyBackground>
```

### Content Styling
Use the `className` prop to style the content area:

```tsx
<WavyBackground
  className="max-w-4xl mx-auto px-4 py-20 text-center"
>
  <YourContent />
</WavyBackground>
```

## Technical Details

### Canvas Animation
- Uses HTML5 Canvas for high-performance rendering
- Simplex noise algorithm for natural wave patterns
- RequestAnimationFrame for smooth 60fps animation
- Automatic canvas resize on window resize

### Wave Generation
- 5 wave layers with different noise offsets
- Continuous horizontal drawing with 5px steps
- Vertical positioning based on noise calculations
- Color cycling through provided color array

### Performance
- Efficient canvas operations
- Optimized noise calculations
- Memory-conscious animation loop
- Proper cleanup on component unmount

## Browser Support

Works in all modern browsers that support:
- HTML5 Canvas
- RequestAnimationFrame
- CSS filters (blur)
- ES6+ JavaScript features

### Safari Compatibility
The component includes special handling for Safari browsers:
- Applies blur filter via inline styles for Safari
- Maintains compatibility with Safari's canvas implementation

## Common Use Cases

- Hero section backgrounds
- Landing page headers
- Marketing section backdrops
- Call-to-action overlays
- Loading screen animations
- Product showcase backgrounds
- Event announcement pages