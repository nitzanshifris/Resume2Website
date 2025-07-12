# Backend-Aware Component Adapter System

This adapter system works seamlessly with the backend adapters to render Aceternity UI components with CV data.

## Architecture Overview

```
Backend Adapters → Generic Props → Component Mapper → Style Resolver → Theme Applicator → Rendered Component
```

## Key Components

### 1. Component Registry (`component-registry.ts`)
- Maps all Aceternity components to their supported data types and UI styles
- Validates component compatibility
- Provides metadata for each component

### 2. Component Mapper (`mapper.ts`)
- Transforms backend data structures to Aceternity component props
- Handles all 24 component types
- Maintains type safety with TypeScript

### 3. Style Resolver (`style-resolver.ts`)
- Applies UI style configurations from backend
- Handles responsive sizing (including carousel size fix)
- Manages animation speeds and intensities

### 4. Theme Applicator (`theme-applicator.ts`)
- Applies backend theme configurations to components
- Manages CSS variables and custom properties
- Loads custom fonts dynamically

### 5. Portfolio Hook (`usePortfolioAdapter.tsx`)
- Main hook for rendering entire portfolio sections
- Processes backend section configurations
- Handles errors and loading states

## Usage

### Basic Portfolio Rendering

```tsx
import { PortfolioRenderer } from "@/lib/component-adapter/PortfolioRenderer";

function Portfolio({ portfolioData }) {
  return (
    <PortfolioRenderer
      sections={portfolioData.sections}
      theme={portfolioData.theme}
    />
  );
}
```

### Individual Component Adaptation

```tsx
import { useComponentAdapter } from "@/lib/component-adapter";

function CustomComponent({ data }) {
  const { adaptComponent } = useComponentAdapter();
  
  const adapted = adaptComponent("carousel", data, "carousel-standard");
  
  return <Carousel {...adapted.props} />;
}
```

## Adding New Components

When adding a new Aceternity component, follow the template in `future-component-template.tsx`:

1. **Add to Registry** (`component-registry.ts`)
```typescript
"new-component": {
  componentType: "new-component",
  supportedDataTypes: ["DataType1", "DataType2"],
  supportedUIStyles: ["style-1", "style-2"],
  requiredProps: ["prop1", "prop2"],
  optionalProps: ["prop3"],
  defaultProps: { animationSpeed: "normal" },
}
```

2. **Add Mapper** (`mapper.ts`)
```typescript
private static mapNewComponent(data: any, uiStyle?: string): any {
  return {
    prop1: data.field1,
    prop2: data.field2,
  };
}
```

3. **Add Styles** (`style-resolver.ts`)
```typescript
"new-ui-style": () => ({
  className: "specific-classes",
  animationSpeed: "slow",
})
```

4. **Import Component** (`PortfolioRenderer.tsx`)
```typescript
"new-component": dynamic(() => import("@/component-library/components/ui/new-component"))
```

## Data Flow Example

### Backend Provides:
```json
{
  "sections": [{
    "id": "experience",
    "type": "experience",
    "uiStyle": "timeline-vertical",
    "data": [
      {
        "id": "1",
        "title": "Senior Developer",
        "subtitle": "Tech Corp",
        "dateRange": "2020 - Present",
        "items": [
          { "text": "Led team of 5 developers" }
        ]
      }
    ]
  }],
  "theme": {
    "name": "professional",
    "colors": { "primary": "#3b82f6" },
    "animations": { "speed": "normal" }
  }
}
```

### Adapter Outputs:
```tsx
<Timeline
  data={[
    {
      title: "Senior Developer",
      content: <TimelineContent {...} />
    }
  ]}
  className="timeline-vertical"
  style={{ "--primary": "#3b82f6" }}
/>
```

## Size Configurations

The adapter handles responsive sizing automatically:

- **Carousel sizes**: 
  - Small: `w-[50vmin] h-[50vmin]`
  - Medium: `w-[70vmin] h-[70vmin]`
  - Large: `w-[90vmin] h-[90vmin]`
  - Full: `w-full h-[80vh]`

- **General component sizes**:
  - Small: `w-64 h-64`
  - Medium: `w-96 h-96`
  - Large: `w-[32rem] h-[32rem]`
  - Full: `w-full h-full`

## Performance Considerations

1. **Dynamic Imports**: All components are lazy-loaded
2. **Memoization**: Props are memoized to prevent re-renders
3. **Error Boundaries**: Each section has error handling
4. **Loading States**: Skeleton loaders for better UX

## Testing

Test the adapter with different backend configurations:

```tsx
// Test with mock data
const mockSections = [
  {
    id: "test",
    type: "projects",
    uiStyle: "carousel-standard",
    data: mockProjects,
    visible: true,
    order: 1
  }
];

<PortfolioRenderer sections={mockSections} theme={defaultTheme} />
```

## Backend Compatibility

This adapter system is designed to work with the backend adapter outputs:
- Validates data structures match backend schemas
- Respects archetype-based decisions
- Applies backend-generated themes
- Follows backend UI style configurations