# World Map

A world map with animated lines and dots, programmatically generated.

## Features

- **Dotted Map Generation**: Uses the dotted-map library to create a stylized world map
- **Animated Connections**: Smooth curved paths that animate between points
- **Pulsing Endpoints**: Animated circles at connection endpoints
- **Dark Mode Support**: Automatically adapts to theme changes
- **Customizable Colors**: Configure line colors for different use cases
- **SVG-based**: Scalable and crisp at any size
- **Responsive**: Maintains aspect ratio across screen sizes

## Installation

```bash
npm install motion clsx tailwind-merge dotted-map
```

For React 19 / Next.js 15 users:
```bash
npm install motion@12.0.0-alpha.2
npm install dotted-map --legacy-peer-deps
```

## Usage

### Basic Usage

```tsx
import WorldMap from "@/components/ui/world-map";

export function BasicWorldMap() {
  return (
    <WorldMap
      dots={[
        {
          start: { lat: 51.5074, lng: -0.1278 }, // London
          end: { lat: 40.7128, lng: -74.0060 }, // New York
        },
        {
          start: { lat: 40.7128, lng: -74.0060 }, // New York
          end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
        },
      ]}
    />
  );
}
```

### Custom Line Color

```tsx
import WorldMap from "@/components/ui/world-map";

export function CustomColorMap() {
  return (
    <WorldMap
      dots={[
        {
          start: { lat: 48.8566, lng: 2.3522 }, // Paris
          end: { lat: 41.9028, lng: 12.4964 }, // Rome
        },
        {
          start: { lat: 41.9028, lng: 12.4964 }, // Rome
          end: { lat: 37.9838, lng: 23.7275 }, // Athens
        },
      ]}
      lineColor="#10b981" // Green connections
    />
  );
}
```

### Global Network Example

```tsx
import WorldMap from "@/components/ui/world-map";

export function GlobalNetwork() {
  const connections = [
    // Americas
    { start: { lat: 37.7749, lng: -122.4194 }, end: { lat: 40.7128, lng: -74.0060 } },
    { start: { lat: 40.7128, lng: -74.0060 }, end: { lat: -23.5505, lng: -46.6333 } },
    
    // Europe
    { start: { lat: 51.5074, lng: -0.1278 }, end: { lat: 48.8566, lng: 2.3522 } },
    { start: { lat: 48.8566, lng: 2.3522 }, end: { lat: 52.5200, lng: 13.4050 } },
    
    // Asia
    { start: { lat: 35.6762, lng: 139.6503 }, end: { lat: 22.3193, lng: 114.1694 } },
    { start: { lat: 22.3193, lng: 114.1694 }, end: { lat: 1.3521, lng: 103.8198 } },
    
    // Cross-continental
    { start: { lat: 51.5074, lng: -0.1278 }, end: { lat: 1.3521, lng: 103.8198 } },
    { start: { lat: 40.7128, lng: -74.0060 }, end: { lat: 35.6762, lng: 139.6503 } },
  ];

  return (
    <div className="py-20 bg-black">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-4xl font-bold text-white mb-4">
          Our Global Infrastructure
        </h2>
        <p className="text-lg text-gray-400">
          Connected data centers across the world
        </p>
      </div>
      <WorldMap dots={connections} lineColor="#3b82f6" />
    </div>
  );
}
```

## Props

### WorldMap Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dots` | `Array<{start: Point, end: Point}>` | `[]` | Array of coordinate pairs representing connections on the map |
| `lineColor` | `string` | `"#0ea5e9"` | Color of the lines connecting the dots |

### Point Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `lat` | `number` | Yes | Latitude coordinate (-90 to 90) |
| `lng` | `number` | Yes | Longitude coordinate (-180 to 180) |
| `label` | `string` | No | Optional label for the point (not currently displayed) |

## Animation Details

### Path Animation
- Paths animate using `pathLength` from 0 to 1
- Duration: 1 second per path
- Delay: 0.5 seconds between each path
- Easing: "easeOut" for smooth deceleration

### Dot Animation
- Pulsing effect using SVG `animate` elements
- Radius animates from 2px to 8px
- Opacity fades from 0.5 to 0
- Duration: 1.5 seconds, repeating infinitely

### Gradient Effect
- Lines have gradient opacity at endpoints
- Fade from transparent to full color over 5% of line length
- Creates smooth connection appearance

## Styling

### Map Appearance
- Dotted map with diagonal grid pattern
- Dot radius: 0.22
- Light mode: Black dots with 40% opacity
- Dark mode: White dots with 40% opacity
- Mask gradient for smooth edges

### Container
- Aspect ratio: 2:1 (width:height)
- Rounded corners with `rounded-lg`
- Background adapts to theme

## Common City Coordinates

```tsx
// Major Cities
const cities = {
  // Americas
  newYork: { lat: 40.7128, lng: -74.0060 },
  losAngeles: { lat: 34.0522, lng: -118.2437 },
  toronto: { lat: 43.6532, lng: -79.3832 },
  mexicoCity: { lat: 19.4326, lng: -99.1332 },
  saoPaulo: { lat: -23.5505, lng: -46.6333 },
  
  // Europe
  london: { lat: 51.5074, lng: -0.1278 },
  paris: { lat: 48.8566, lng: 2.3522 },
  berlin: { lat: 52.5200, lng: 13.4050 },
  madrid: { lat: 40.4168, lng: -3.7038 },
  rome: { lat: 41.9028, lng: 12.4964 },
  
  // Asia
  tokyo: { lat: 35.6762, lng: 139.6503 },
  beijing: { lat: 39.9042, lng: 116.4074 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  singapore: { lat: 1.3521, lng: 103.8198 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  
  // Oceania
  sydney: { lat: -33.8688, lng: 151.2093 },
  melbourne: { lat: -37.8136, lng: 144.9631 },
  
  // Africa
  cairo: { lat: 30.0444, lng: 31.2357 },
  johannesburg: { lat: -26.2041, lng: 28.0473 },
  nairobi: { lat: -1.2921, lng: 36.8219 },
};
```

## Technical Details

### Map Projection
- Uses equirectangular projection (simple latitude/longitude mapping)
- X coordinate: `(lng + 180) * (800 / 360)`
- Y coordinate: `(90 - lat) * (400 / 180)`
- SVG viewBox: 800x400 units

### Curved Paths
- Quadratic Bézier curves for connections
- Control point positioned above midpoint
- Creates arc effect between locations

### Performance
- SVG-based rendering for smooth scaling
- Efficient animation using Framer Motion
- Minimal re-renders with proper key management

## Browser Support

Works in all modern browsers that support:
- SVG animations
- Framer Motion
- CSS masks
- ES6+ JavaScript features