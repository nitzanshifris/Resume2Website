# Compare Component

A comparison component that allows users to slide or drag between two images to compare them visually.

## Features

- **Multiple interaction modes**: Hover or drag to control the slider
- **Autoplay support**: Automatic sliding animation
- **Sparkle effects**: Beautiful particle effects on the slider line
- **Touch support**: Works on mobile devices
- **Customizable**: Control slider position, animation speed, and appearance
- **3D perspective**: Optional 3D transformation effects

## Usage

```tsx
import { Compare } from "@/component-library/components/ui/compare";

function MyComponent() {
  return (
    <Compare
      firstImage="/before.png"
      secondImage="/after.png"
      slideMode="hover"
      className="h-[400px] w-[600px]"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| firstImage | string | "" | URL of the first (before) image |
| secondImage | string | "" | URL of the second (after) image |
| className | string | undefined | Additional CSS classes for the container |
| firstImageClassName | string | undefined | Additional CSS classes for the first image |
| secondImageClassname | string | undefined | Additional CSS classes for the second image |
| initialSliderPercentage | number | 50 | Initial position of the slider (0-100) |
| slideMode | "hover" \| "drag" | "hover" | Mode of interaction for the slider |
| showHandlebar | boolean | true | Whether to show the slider handle |
| autoplay | boolean | false | Enable automatic sliding |
| autoplayDuration | number | 5000 | Duration of one autoplay cycle in milliseconds |

## Variants

- **Demo**: Standard implementation with hover mode
- **Autoplay**: Automatic sliding with 3D perspective
- **Drag**: Manual drag control with 3D perspective

## Dependencies

This component requires the following additional packages:
- `@tsparticles/react`
- `@tsparticles/engine`
- `@tsparticles/slim`
- `@tabler/icons-react`