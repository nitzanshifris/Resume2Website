# 3D Card Component

A card perspective effect component that elevates card elements on hover.

## Usage

```tsx
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

<CardContainer>
  <CardBody>
    <CardItem translateZ="50">
      Your content here
    </CardItem>
  </CardBody>
</CardContainer>
```

## Variants

- **Basic**: Standard 3D card with perspective effect
- **With Rotation**: Enhanced version with rotation effects on hover

## Props

### CardContainer
- `children`: React.ReactNode
- `className`: string (optional)
- `containerClassName`: string (optional)

### CardBody
- `children`: React.ReactNode
- `className`: string (optional)

### CardItem
- `as`: React.ElementType (default: "div")
- `children`: React.ReactNode
- `className`: string (optional)
- `translateX`: number | string (optional)
- `translateY`: number | string (optional)
- `translateZ`: number | string (optional)
- `rotateX`: number | string (optional)
- `rotateY`: number | string (optional)
- `rotateZ`: number | string (optional)