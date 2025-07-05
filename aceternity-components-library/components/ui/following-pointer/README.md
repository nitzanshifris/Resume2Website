# Following Pointer Component

A custom pointer that follows the mouse cursor and displays animated content with a unique visual effect.

## Usage

```tsx
import { FollowerPointerCard } from "./following-pointer";

export function FollowingPointerExample() {
  return (
    <FollowerPointerCard
      title="John Doe"
      className="w-80"
    >
      <div className="p-8 bg-white rounded-lg border">
        <h3 className="text-lg font-semibold">Hover over me!</h3>
        <p className="text-gray-600">
          The pointer will follow your mouse with a custom title.
        </p>
      </div>
    </FollowerPointerCard>
  );
}
```

## Features

- Custom mouse pointer that follows cursor movement
- Animated entrance/exit effects
- Supports custom titles (string or React components)
- Random color selection for pointer label
- Smooth motion animations
- Hides system cursor within component bounds

## Props

### FollowerPointerCard
- `children`: React content to be wrapped
- `className` (optional): Additional CSS classes
- `title` (optional): Text or component to display in the following pointer (defaults to "William Shakespeare")

## Customization

The component includes:
- SVG arrow pointer with rotation
- Animated label with random background colors
- Smooth scale and opacity transitions
- Custom cursor styling

## Example with Avatar

```tsx
const TitleComponent = ({ name, avatar }: { name: string; avatar: string }) => (
  <div className="flex items-center space-x-2">
    <img src={avatar} className="w-5 h-5 rounded-full" alt={name} />
    <span>{name}</span>
  </div>
);

<FollowerPointerCard title={<TitleComponent name="Jane Doe" avatar="/avatar.jpg" />}>
  {/* Your content */}
</FollowerPointerCard>
```