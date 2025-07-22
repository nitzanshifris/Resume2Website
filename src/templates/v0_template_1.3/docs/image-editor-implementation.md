# Image Editor Implementation Guide

## Overview

I've successfully implemented a drag and scale image editing functionality for the SmartCard component using `react-easy-crop`. This allows users to crop, zoom, and rotate images within the portfolio template.

## Features Implemented

1. **Drag to Reposition**: Users can drag the image to adjust its position within the crop area
2. **Zoom Control**: Slider-based zoom control with range from 1x to 3x magnification
3. **Rotation**: Rotate images in 90-degree increments
4. **Base64 Support**: Works with both URL-based images and uploaded files (base64 data URLs)
5. **Real-time Preview**: See changes as you edit
6. **Aspect Ratio Control**: Maintains 16:9 aspect ratio (configurable)

## Technical Implementation

### 1. New Component: ImageEditor

Located at: `components/ui/image-editor.tsx`

Key features:
- Uses `react-easy-crop` library for the core cropping functionality
- Custom UI with shadcn/ui components for controls
- Exports cropped image as base64 JPEG with 90% quality
- Responsive design that works in a modal dialog

### 2. SmartCard Integration

Updated `components/smart-card.tsx` to include:
- New state variables for image editing mode
- "Edit Image" button in the image preview section
- Modal dialog for the image editor
- Automatic save of edited images

### 3. Dependencies

Added to `package.json`:
```json
"react-easy-crop": "^5.5.0"
```

## Usage

### Basic Usage in SmartCard

1. Set a SmartCard to "3D Image Card" display mode
2. Upload or provide an image URL
3. Click "Edit Image" button in the preview
4. Use the editor to adjust the image
5. Click "Apply Changes" to save

### Programmatic Usage

```typescript
import { ImageEditor } from '@/components/ui/image-editor'

<ImageEditor
  imageSrc="https://example.com/image.jpg"
  aspectRatio={16 / 9}
  onSave={(croppedImage) => {
    // croppedImage is a base64 data URL
    console.log('Cropped:', croppedImage)
  }}
  onCancel={() => {
    // Handle cancel
  }}
/>
```

## User Experience

### Controls
- **Mouse**: Click and drag to reposition the image
- **Scroll**: Use mouse wheel to zoom in/out
- **Touch**: Pinch to zoom on touch devices
- **Slider**: Fine-tune zoom level with the slider
- **Rotation Button**: Click to rotate 90 degrees clockwise

### Visual Feedback
- Grid overlay shows during editing
- Dark background for better contrast
- Real-time preview of changes
- Loading state during processing

## Implementation Details

### Image Processing

The cropping process:
1. Creates an HTML canvas element
2. Applies rotation transformation if needed
3. Draws the image at the specified crop coordinates
4. Exports as JPEG with 90% quality
5. Returns base64 data URL

### State Management

The component manages:
- Crop position (x, y coordinates)
- Zoom level (1-3x)
- Rotation angle (0-360°)
- Cropped area pixels for final export

### Performance Considerations

- Images are processed client-side (no server required)
- Large images may take a moment to process
- Base64 encoding increases data size by ~33%
- JPEG compression at 90% quality balances size and quality

## Testing

Test the implementation at: `/test-image-editor`

This page provides:
- Step-by-step instructions
- Live demo of the SmartCard with image editing
- State visualization for debugging

## Future Enhancements

Potential improvements:
1. Add preset aspect ratios (1:1, 4:3, 16:9, etc.)
2. Support for multiple images in carousel mode
3. Image filters and adjustments
4. Undo/redo functionality
5. Touch gesture improvements
6. Server-side processing for large images

## Troubleshooting

Common issues:
- **Image not loading**: Check CORS settings for external URLs
- **Performance issues**: Consider resizing large images before editing
- **Mobile issues**: Ensure viewport meta tag is set correctly

## Code Examples

### Custom Aspect Ratios
```typescript
<ImageEditor
  imageSrc={imageSrc}
  aspectRatio={1} // Square
  // or
  aspectRatio={4/3} // 4:3
  // or
  aspectRatio={undefined} // Free crop
  onSave={handleSave}
  onCancel={handleCancel}
/>
```

### Integration with File Upload
```typescript
const handleFileUpload = (file: File) => {
  const reader = new FileReader()
  reader.onloadend = () => {
    const base64 = reader.result as string
    setImageForEditing(base64)
  }
  reader.readAsDataURL(file)
}
```