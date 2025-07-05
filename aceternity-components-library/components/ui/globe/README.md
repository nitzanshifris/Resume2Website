# GitHub Globe Component

An interactive 3D globe animation similar to GitHub's homepage, built with Three.js and React Three Fiber.

## Usage

```tsx
import { World } from "./globe";

const globeConfig = {
  pointSize: 4,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#FFFFFF",
  atmosphereAltitude: 0.1,
  emissive: "#062056",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
};

const arcs = [
  {
    order: 1,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -22.9068,
    endLng: -43.1729,
    arcAlt: 0.1,
    color: "#06b6d4",
  },
  // Add more arcs...
];

export function GlobeExample() {
  return (
    <div className="h-[40rem] w-full relative">
      <World data={arcs} globeConfig={globeConfig} />
    </div>
  );
}
```

## Features

- Interactive 3D globe with WebGL rendering
- Animated arcs between locations
- Customizable appearance and behavior
- Auto-rotation support
- Ring animations at arc endpoints
- Atmosphere and lighting effects
- Responsive design

## Dependencies

This component requires the following packages:
- `three` - 3D graphics library
- `three-globe` - Globe visualization library
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for React Three Fiber

## Props

### World Component
- `data`: Array of arc positions to display connections
- `globeConfig`: Configuration object for globe appearance and behavior

### GlobeConfig Options
- `pointSize`: Size of location points
- `globeColor`: Base color of the globe
- `showAtmosphere`: Toggle atmosphere layer
- `atmosphereColor`: Color of atmosphere
- `atmosphereAltitude`: Height of atmosphere layer
- `emissive`: Emissive material color
- `emissiveIntensity`: Strength of emissive glow
- `shininess`: Material shininess
- `polygonColor`: Color of country polygons
- `ambientLight`: Ambient light color
- `directionalLeftLight`: Left directional light color
- `directionalTopLight`: Top directional light color
- `pointLight`: Point light color
- `arcTime`: Animation duration for arcs
- `arcLength`: Length of arc dash
- `rings`: Number of ring animations
- `maxRings`: Maximum ring radius
- `initialPosition`: Starting camera position
- `autoRotate`: Enable auto-rotation
- `autoRotateSpeed`: Speed of rotation

### Position Type
- `order`: Animation order
- `startLat/startLng`: Starting coordinates
- `endLat/endLng`: Ending coordinates
- `arcAlt`: Arc altitude (height)
- `color`: Arc color

## Notes

- The component uses dynamic imports with SSR disabled for proper WebGL rendering
- Requires `globe.json` file with country polygon data in `/data` directory
- Performance may vary based on number of arcs and device capabilities