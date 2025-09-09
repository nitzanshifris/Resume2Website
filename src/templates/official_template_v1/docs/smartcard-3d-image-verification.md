# SmartCard 3D Image Mode Verification Checklist

## Complete Feature Set for 3D Image Display Mode

When ANY SmartCard in ANY section is set to `viewMode: "images"`, it MUST provide:

### 1. **Data Structure Requirements**
- [ ] Accepts `viewMode: "images"` to enable 3D image card
- [ ] Accepts `images: string[]` array (URLs or base64)
- [ ] Accepts optional `imageTransform` object for saved transforms
- [ ] Accepts optional `link` for external URL
- [ ] All other view mode data (githubUrl, tweetId, codeSnippet, etc.)

### 2. **Three Hover Buttons** (top-right on hover)
- [ ] **External Link Button** (leftmost)
  - Shows when: `link` exists OR image is URL (not base64)
  - Function: Opens link/image in new tab
- [ ] **Fullscreen Button** (middle)
  - Shows when: `viewMode !== 'text'`
  - Function: Opens enlarged 3D card dialog
- [ ] **Settings Button** (rightmost)
  - Shows: Always
  - Function: Opens configuration sidebar

### 3. **Settings Panel Features**
- [ ] **Display Mode Selector** - Switch between all view modes
- [ ] **Image URL Input** - Enter/edit image URLs
- [ ] **Upload Image** - Upload from computer (base64)
- [ ] **Preview with Edit Button** - Shows current image
- [ ] **Clear Image** - Remove current image

### 4. **Image Editor Capabilities**
- [ ] Drag to reposition
- [ ] Zoom slider (1x-3x)
- [ ] Rotate button (90° increments)
- [ ] Reset button
- [ ] Apply Changes button
- [ ] Non-destructive editing (preserves original)

### 5. **Display Specifications**
- [ ] Aspect ratio: 4:3 for images mode
- [ ] Title: Centered, bold, text-xl
- [ ] Image: Full height/width with object-cover
- [ ] 3D parallax effect on hover
- [ ] Proper shadow and borders

### 6. **State Management**
- [ ] Local state for all edits
- [ ] onUpdate callbacks to parent
- [ ] Proper data persistence
- [ ] Transform data saved separately

## Sections Verified ✅

All sections now have identical functionality:

1. **Projects** ✅
   - Conditional aspect ratio: YES
   - All features: YES

2. **Achievements** ✅
   - Conditional aspect ratio: FIXED
   - All features: YES

3. **Certifications** ✅
   - Conditional aspect ratio: FIXED
   - All features: YES

4. **Volunteer** ✅
   - Conditional aspect ratio: FIXED
   - All features: YES

5. **Hobbies** ✅
   - Uses HobbyCard wrapper but SmartCard inside
   - All features: YES

6. **Courses** ✅
   - Conditional aspect ratio: FIXED
   - All features: YES

7. **Publications** ✅
   - Conditional aspect ratio: FIXED
   - All features: YES

8. **Speaking Engagements** ✅
   - Conditional aspect ratio: FIXED
   - All features: YES

9. **Memberships** ✅
   - Uses MembershipCard wrapper but SmartCard inside
   - All features: YES

## Testing Instructions

To verify any section:
1. Set `viewMode: "images"` in the data
2. Hover over the card - should see 3 buttons
3. Click Settings - should see all image options
4. Upload an image - should work with transform editor
5. Switch view modes - should work seamlessly
6. Check fullscreen - should show enlarged 3D card

## Example Data Structure

```typescript
{
  _key: "item-key",
  title: "Item Title",
  description: "Item description...",
  link: "https://example.com", // Optional - enables external link button
  icon: "IconName",
  viewMode: "images", // REQUIRED for 3D image mode
  images: ["image-url.png"], // REQUIRED
  imageTransform: { // Optional - defaults to no transform
    crop: { x: 0, y: 0 },
    zoom: 1,
    rotation: 0
  },
  // Optional view mode data:
  githubUrl: "https://github.com/...",
  tweetId: "123456789",
  codeSnippet: "// code here",
  videoUrl: "https://...",
  linkUrl: "https://..."
}
```