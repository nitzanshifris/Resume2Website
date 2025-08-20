# Upload Resume Modal - ErrorToast Migration TODO

## Current State
The upload-resume.tsx component still uses `alert()` in several places:

1. **Line 90**: File type validation - "Please upload a PDF, DOC, DOCX, or image file..."
2. **Line 95**: File size validation - "File size must be less than 10MB"
3. **Line 126**: Multi-file auth required - "Please sign in to upload multiple files"
4. **Line 209**: Auth required in processing - "Please sign in to continue"
5. **Line 223**: Generic error message display
6. **Line 253**: Auth required for completion - "Please sign in to continue"
7. **Line 263**: Error message display

## Required Changes

### 1. Add ErrorToast state management
```typescript
const [errorToast, setErrorToast] = useState<{
  isOpen: boolean
  title: string
  message: string
  suggestion?: string
}>({
  isOpen: false,
  title: '',
  message: '',
  suggestion: undefined
})
```

### 2. Import StandardizedError type and getStandardizedError helper
- Move these to a shared utils file for reuse across components

### 3. Replace each alert() with ErrorToast
- File validation errors → "File type not supported" with proper suggestion
- Size errors → "File is too large" with 10MB limit message
- Auth errors (401/403) → Trigger auth modal instead of toast
- Use getStandardizedError() for consistent messaging

### 4. Add ErrorToast component to render tree
```tsx
<ErrorToast
  isOpen={errorToast.isOpen}
  onClose={() => setErrorToast(prev => ({ ...prev, isOpen: false }))}
  title={errorToast.title}
  message={errorToast.message}
  suggestion={errorToast.suggestion}
  onRetryUpload={handleRetryUpload}
/>
```

## Benefits
- Consistent UX across entire application
- Better error messaging with suggestions
- Auth errors properly route to auth modal
- No jarring browser alerts