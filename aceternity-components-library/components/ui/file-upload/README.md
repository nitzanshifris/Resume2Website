# File Upload Component

A beautiful and interactive file upload component with drag and drop support, animations, and file previews.

## Features

- 🎯 Drag and drop support
- 📱 Responsive design
- 🎨 Beautiful animations with Framer Motion
- 🌗 Dark mode support
- 📄 File preview with metadata
- 🔧 Customizable file restrictions
- ♿ Accessible

## Usage

```tsx
import { FileUpload } from "./file-upload";

function MyComponent() {
  const handleFileUpload = (files: File[]) => {
    console.log("Files uploaded:", files);
    // Process your files here
  };

  return (
    <FileUpload 
      onChange={handleFileUpload}
      maxFiles={5}
      accept={{
        'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
        'application/pdf': ['.pdf']
      }}
      maxSize={5242880} // 5MB
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onChange | `(files: File[]) => void` | required | Callback when files are selected |
| className | `string` | - | Additional CSS classes for the upload area |
| containerClassName | `string` | - | Additional CSS classes for the container |
| maxFiles | `number` | 10 | Maximum number of files allowed |
| accept | `Record<string, string[]>` | - | Accepted file types |
| maxSize | `number` | - | Maximum file size in bytes |
| disabled | `boolean` | false | Disable the upload component |

## Examples

### Basic Usage
```tsx
<FileUpload onChange={(files) => console.log(files)} />
```

### With File Restrictions
```tsx
<FileUpload 
  onChange={handleFileUpload}
  maxFiles={3}
  accept={{
    'image/*': ['.png', '.jpg', '.jpeg']
  }}
  maxSize={2097152} // 2MB
/>
```

### Custom Styling
```tsx
<FileUpload 
  onChange={handleFileUpload}
  className="border-blue-500 bg-blue-50/10"
  containerClassName="p-8"
/>
```

## Dependencies

- `framer-motion` - For smooth animations
- `@tabler/icons-react` - For the upload icon
- `react-dropzone` - For drag and drop functionality
- `tailwind-merge` - For className merging
- `clsx` - For conditional classes

## Accessibility

The component is fully accessible with:
- Keyboard navigation support
- Screen reader announcements
- Focus indicators
- ARIA labels

## Dark Mode

The component automatically adapts to your application's dark mode settings using Tailwind CSS dark mode classes.