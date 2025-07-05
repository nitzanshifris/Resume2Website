# Lens

A lens component to zoom into images, videos, or practically anything. Perfect for creating magnification effects with smooth animations and mouse tracking.

## Features

- **Mouse Tracking**: The lens follows mouse movement for dynamic zoom positioning
- **Static Mode**: Fixed lens position for consistent zoom area display
- **Customizable Zoom**: Adjustable zoom factor and lens size for different magnification needs
- **React Component Support**: Works with any React content, not just images
- **Smooth Animations**: Framer Motion powered entrance and exit animations
- **External Control**: Can be controlled externally via hovering prop

## Installation

```bash
npm i motion clsx tailwind-merge
```

## Usage

```tsx
import { Lens } from "@/components/ui/lens";

export function MyLens() {
  const [hovering, setHovering] = useState(false);

  return (
    <Lens hovering={hovering} setHovering={setHovering}>
      <img
        src="image-url.jpg"
        alt="image"
        width={500}
        height={500}
        className="rounded-2xl"
      />
    </Lens>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `React.ReactNode` | Required | The content to be displayed inside the lens |
| zoomFactor | `number` | `1.5` | The magnification factor for the lens |
| lensSize | `number` | `170` | The diameter of the lens in pixels |
| position | `{ x: number, y: number }` | `{ x: 200, y: 150 }` | The static position of the lens (when isStatic is true) |
| isStatic | `boolean` | `false` | If true, the lens stays in a fixed position; if false, it follows the mouse |
| isFocusing | `() => void` | - | Callback function when the lens is focusing (not used in current implementation) |
| hovering | `boolean` | - | External control for the hover state |
| setHovering | `(hovering: boolean) => void` | - | External setter for the hover state |

## Variants

### Basic with Animation
The default lens with mouse tracking and hover animations.

```tsx
import { LensDemo } from "@/components/ui/lens";

export function BasicLens() {
  return <LensDemo />;
}
```

### Static Lens
A lens that stays in a fixed position.

```tsx
import { LensStatic } from "@/components/ui/lens";

export function StaticLens() {
  return (
    <LensStatic 
      position={{ x: 250, y: 200 }}
      zoomFactor={2}
      lensSize={200}
    />
  );
}
```

### Lens on React Component
Use the lens effect on any React component, not just images.

```tsx
import { LensOnComponent } from "@/components/ui/lens";

export function ComponentLens() {
  return <LensOnComponent />;
}
```

## Customization

### Zoom Factor
Adjust the magnification level:

```tsx
<Lens zoomFactor={2.5}>
  {/* Your content */}
</Lens>
```

### Lens Size
Change the diameter of the lens:

```tsx
<Lens lensSize={250}>
  {/* Your content */}
</Lens>
```

### Static Position
Set a fixed lens position:

```tsx
<Lens isStatic position={{ x: 300, y: 200 }}>
  {/* Your content */}
</Lens>
```

### External Control
Control the lens state externally:

```tsx
const [isHovering, setIsHovering] = useState(false);

return (
  <div>
    <button onClick={() => setIsHovering(!isHovering)}>
      Toggle Lens
    </button>
    <Lens hovering={isHovering} setHovering={setIsHovering}>
      {/* Your content */}
    </Lens>
  </div>
);
```

## Examples

### Image Gallery with Lens
```tsx
const images = [
  "image1.jpg",
  "image2.jpg",
  "image3.jpg"
];

return (
  <div className="grid grid-cols-3 gap-4">
    {images.map((src, index) => (
      <Lens key={index} zoomFactor={2}>
        <img 
          src={src} 
          alt={`Gallery ${index}`}
          className="w-full h-64 object-cover rounded-lg"
        />
      </Lens>
    ))}
  </div>
);
```

### Product Detail Zoom
```tsx
<Lens zoomFactor={3} lensSize={200}>
  <img 
    src="product-detail.jpg"
    alt="Product Detail"
    className="w-full h-96 object-cover"
  />
</Lens>
```

### Interactive Chart/Diagram
```tsx
<Lens zoomFactor={1.8} lensSize={180}>
  <div className="w-full h-96 bg-gray-100 rounded-lg p-4">
    <svg width="100%" height="100%">
      {/* Your SVG chart/diagram content */}
    </svg>
  </div>
</Lens>
```

## Technical Details

The lens effect works by:
1. Using CSS `mask-image` and `WebkitMaskImage` to create a circular reveal area
2. Scaling the content with CSS `transform: scale()` for zoom effect
3. Tracking mouse position to update the lens location
4. Using Framer Motion for smooth entrance/exit animations

## Browser Support

- Modern browsers that support CSS mask-image
- WebKit browsers (Safari, Chrome) through -webkit-mask-image
- All browsers that support CSS transforms

## Performance Notes

- GPU-accelerated transforms for smooth zoom effects
- Efficient mask-image rendering
- Minimal re-renders with proper state management
- Optimized for both desktop and mobile interactions

## Common Use Cases

- **Product Photography**: Detailed product inspection
- **Technical Diagrams**: Examining complex schematics
- **Medical Imaging**: Detailed area examination
- **Maps and Charts**: Precision viewing of specific regions
- **Art and Design**: Detailed artwork inspection
- **Scientific Visualization**: Data analysis and exploration