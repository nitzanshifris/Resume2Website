# Tracing Beam

A Beam that follows the path of an SVG as the user scrolls. Adjusts beam length with scroll speed.

## Features

- **Scroll-Animated Beam**: Dynamic beam that follows scroll progress
- **SVG Path Animation**: Smooth gradient animation along custom SVG path
- **Speed-Responsive**: Beam length adjusts based on scroll velocity
- **Gradient Effects**: Beautiful multi-color gradient animation
- **Responsive Design**: Works on all screen sizes
- **Content Wrapper**: Easy to wrap any scrollable content
- **TypeScript Support**: Fully typed component

## Installation

```bash
npm install motion clsx tailwind-merge
```

## Usage

```tsx
import { TracingBeam } from "@/components/ui/tracing-beam";

export function MyContent() {
  return (
    <TracingBeam className="px-6">
      <div className="max-w-2xl mx-auto antialiased pt-4 relative">
        <h2 className="text-2xl font-bold mb-4">
          My Article Title
        </h2>
        <p className="text-gray-700 mb-4">
          Your content goes here. The beam will follow as users scroll.
        </p>
        {/* Add more content */}
      </div>
    </TracingBeam>
  );
}
```

## Props

### TracingBeam

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to be wrapped with tracing beam |
| `className` | `string` | - | Additional CSS classes for the container |

## Examples

### Basic Usage
```tsx
<TracingBeam>
  <div className="max-w-2xl mx-auto">
    <h1>Welcome</h1>
    <p>Scroll down to see the beam follow your progress.</p>
  </div>
</TracingBeam>
```

### Blog Article Layout
```tsx
<TracingBeam className="px-6">
  <article className="max-w-2xl mx-auto antialiased pt-4 relative">
    {articles.map((item, index) => (
      <div key={index} className="mb-10">
        <h2 className="bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4">
          {item.category}
        </h2>
        <h3 className="text-xl font-bold mb-4">
          {item.title}
        </h3>
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="rounded-lg mb-6 w-full"
          />
        )}
        <div className="prose prose-sm">
          {item.content}
        </div>
      </div>
    ))}
  </article>
</TracingBeam>
```

### Timeline Layout
```tsx
<TracingBeam>
  <div className="max-w-2xl mx-auto py-8">
    {timeline.map((event, index) => (
      <div key={index} className="mb-16">
        <div className="sticky top-20 mb-4">
          <span className="text-sm text-gray-500">{event.date}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
        <p className="text-gray-600">{event.description}</p>
      </div>
    ))}
  </div>
</TracingBeam>
```

## Styling

### Beam Colors
The beam uses a gradient with the following colors:
- Start: `#18CCFC` (Cyan)
- Middle: `#6344F5` (Purple)
- End: `#AE48FF` (Pink)

### Customization
You can customize the beam appearance by modifying:
- Gradient colors in the SVG linearGradient
- Beam width via strokeWidth
- Animation timing with spring configuration
- Path shape by modifying the SVG path

## Technical Details

### Scroll Tracking
- Uses Framer Motion's `useScroll` hook
- Tracks scroll progress from start to end of container
- Calculates dynamic SVG height based on content

### Animation
- Spring physics for smooth beam movement
- Configurable stiffness and damping
- Gradient position animated based on scroll

### Performance
- Efficient scroll event handling
- Spring animations for smooth 60fps
- Minimal re-renders

## Common Use Cases

- Blog posts and articles
- Documentation pages
- Timelines and changelogs
- Long-form content
- Tutorial steps
- Story-telling layouts

## Accessibility

- Hidden from screen readers with `aria-hidden`
- Purely decorative element
- Does not interfere with content navigation
- Preserves semantic HTML structure

## Browser Support

Works in all modern browsers that support:
- Framer Motion
- SVG animations
- CSS transforms
- Intersection Observer API