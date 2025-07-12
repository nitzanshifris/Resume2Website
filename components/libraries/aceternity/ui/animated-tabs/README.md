# Animated Tabs Component

A beautiful tabs component with 3D stacking animation effects. When you click on a tab, it animates to the top with a smooth spring transition, and hovering spreads the stacked tabs for better visibility.

## Features

- Smooth tab switching with spring animations
- 3D perspective stacking effect
- Hover to spread stacked tabs
- Fully customizable styling
- Responsive design with horizontal scrolling on mobile
- Built with Framer Motion for smooth animations
- TypeScript support

## Usage

```tsx
import { Tabs } from "./tabs";

const tabs = [
  {
    title: "Product",
    value: "product",
    content: (
      <div className="w-full h-full rounded-2xl p-10 bg-gradient-to-br from-purple-700 to-violet-900">
        <p>Product content</p>
      </div>
    ),
  },
  {
    title: "Services",
    value: "services",
    content: (
      <div className="w-full h-full rounded-2xl p-10 bg-gradient-to-br from-blue-700 to-cyan-900">
        <p>Services content</p>
      </div>
    ),
  },
];

export function MyTabs() {
  return (
    <div className="h-[40rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full">
      <Tabs tabs={tabs} />
    </div>
  );
}
```

## Props

### Tabs Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| tabs | Tab[] | required | Array of tab objects with title, value, and content |
| containerClassName | string | - | CSS class for the tabs container |
| activeTabClassName | string | - | CSS class for the active tab indicator |
| tabClassName | string | - | CSS class for individual tab buttons |
| contentClassName | string | - | CSS class for the content container |

### Tab Object

| Property | Type | Description |
|----------|------|-------------|
| title | string | The display text for the tab |
| value | string | Unique identifier for the tab |
| content | ReactNode | The content to display when tab is active |

## Styling

The component uses a custom CSS class `.no-visible-scrollbar` to hide scrollbars on mobile. Add this to your global CSS:

```css
.no-visible-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.no-visible-scrollbar::-webkit-scrollbar {
  display: none;
}
```

## Variants

### Default
Standard tabs with gradient backgrounds and image placeholders.

### Minimal
Clean design with simple borders and subtle styling.

### Colorful
Each tab has its own vibrant color theme.

### With Icons
Tabs with emoji icons for better visual recognition.

### Responsive
Optimized for mobile devices with flexible layouts.

## Animation Details

- **Tab Click**: Selected tab moves to top with spring animation
- **Hover Effect**: Stacked tabs spread vertically (-50px per tab)
- **Scaling**: Each stacked tab is scaled down by 0.1
- **Opacity**: Shows top 3 tabs, others fade out
- **Active Animation**: Active tab bounces with [0, 40, 0] Y animation

## Best Practices

1. Wrap the Tabs component in a container with defined height
2. Add `[perspective:1000px]` class to the container for 3D effects
3. Keep tab content self-contained and responsive
4. Use meaningful tab values for better code maintainability
5. Consider mobile users - test horizontal scrolling on small screens

## Accessibility

- Keyboard navigation support
- Proper button roles and click handlers
- Screen reader friendly tab labels
- Focus management on tab switch