# JobFlow Migration Guide

## Critical: Update ALL Upload Entry Points

Every place that triggers an upload MUST use the new orchestrators. No exceptions!

### The Three Orchestrator Functions:
1. **startPreviewFlow(file)** - Anonymous users: Upload → Preview → Wait for auth
2. **startAuthenticatedFlow(file)** - Authenticated users: Upload → Extract → Generate (no claim needed)
3. **startPostSignupFlow(jobId)** - Post-signup continuation: Claim → Extract → Generate

## 1. Main Upload Handler

### ❌ OLD (DO NOT USE):
```typescript
const handleFileSelect = async (file: File) => {
  if (currentJobId) {
    console.log('Already processing')
    return
  }
  
  // Direct API calls - BAD!
  const response = await uploadFile(file)
  processPortfolioGeneration(file)
  handleStartDemo()
}
```

### ✅ NEW (USE THIS):
```typescript
import { useJobFlow } from '@/lib/jobFlow'

const MyComponent = () => {
  const { startPreviewFlow, startAuthenticatedFlow, isAuthenticated } = useJobFlow()
  
  const handleFileSelect = async (file: File) => {
    // Orchestrator handles everything!
    if (isAuthenticated) {
      await startAuthenticatedFlow(file)
    } else {
      await startPreviewFlow(file)
    }
  }
}
```

## 2. InteractiveCVPile Component

### ❌ OLD:
```typescript
// In InteractiveCVPile.tsx
const handleFileUpload = (file: File) => {
  onFileSelect?.(file) // Passes to parent's handleFileSelect
  startProcessing(file)
}
```

### ✅ NEW:
```typescript
// In InteractiveCVPile.tsx
import { useJobFlow } from '@/lib/jobFlow'

export const InteractiveCVPile = ({ className }: Props) => {
  const { startPreviewFlow, startAuthenticatedFlow, isAuthenticated } = useJobFlow()
  
  const handleFileUpload = async (file: File) => {
    // Call orchestrator directly!
    if (isAuthenticated) {
      await startAuthenticatedFlow(file)
    } else {
      await startPreviewFlow(file)
    }
  }
  
  // In the file input
  <input 
    type="file"
    onChange={(e) => {
      const file = e.target.files?.[0]
      if (file) handleFileUpload(file)
    }}
  />
}
```

## 3. ErrorToast Retry Button

### ❌ OLD:
```typescript
// In ErrorToast.tsx
<button onClick={() => onRetryUpload?.()}>
  Try another file
</button>
```

### ✅ NEW:
```typescript
// In ErrorToast.tsx
import { useJobFlow } from '@/lib/jobFlow'

export const ErrorToast = ({ onClose }: Props) => {
  const { startPreviewFlow, startAuthenticatedFlow, isAuthenticated } = useJobFlow()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleRetry = () => {
    fileInputRef.current?.click()
  }
  
  const handleFileSelect = async (file: File) => {
    onClose() // Close error first
    
    // Use orchestrator!
    if (isAuthenticated) {
      await startAuthenticatedFlow(file)
    } else {
      await startPreviewFlow(file)
    }
  }
  
  return (
    <>
      <input 
        ref={fileInputRef}
        type="file"
        hidden
        accept=".pdf,.doc,.docx,.txt,.rtf,image/png,image/jpg,image/jpeg,image/webp,image/heic,image/heif,image/tiff,image/bmp"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file)
        }}
      />
      <button onClick={handleRetry}>
        Try another file
      </button>
    </>
  )
}
```

## 4. Navbar Upload Button

### ❌ OLD:
```typescript
// In AppleNavbar.tsx
<button onClick={() => onFileSelect?.()}>
  Upload CV
</button>
```

### ✅ NEW:
```typescript
// In AppleNavbar.tsx
import { useJobFlow } from '@/lib/jobFlow'

const AppleNavbar = () => {
  const { startPreviewFlow, startAuthenticatedFlow, isAuthenticated } = useJobFlow()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }
  
  const handleFileSelect = async (file: File) => {
    // Use orchestrator!
    if (isAuthenticated) {
      await startAuthenticatedFlow(file)
    } else {
      await startPreviewFlow(file)
    }
  }
  
  return (
    <>
      <input 
        ref={fileInputRef}
        type="file"
        hidden
        accept=".pdf,.doc,.docx,.txt,.rtf,image/png,image/jpg,image/jpeg,image/webp,image/heic,image/heif,image/tiff,image/bmp"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file)
        }}
      />
      <button onClick={handleUploadClick}>
        Upload CV
      </button>
    </>
  )
}
```

## 5. Drag & Drop Handler

### ❌ OLD:
```typescript
const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  const file = e.dataTransfer?.files[0]
  if (file) {
    uploadFile(file)
    handleStartDemo()
  }
}
```

### ✅ NEW:
```typescript
import { useJobFlow } from '@/lib/jobFlow'

const DropZone = () => {
  const { startPreviewFlow, startAuthenticatedFlow, isAuthenticated } = useJobFlow()
  
  const handleDrop = async (e: DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer?.files[0]
    
    if (file) {
      // Use orchestrator!
      if (isAuthenticated) {
        await startAuthenticatedFlow(file)
      } else {
        await startPreviewFlow(file)
      }
    }
  }
  
  return (
    <div 
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      Drop CV here
    </div>
  )
}
```

## 6. Modal Upload Button

### ❌ OLD:
```typescript
// In AuthModal or any modal
<button onClick={() => {
  setShowUpload(true)
  handleStartDemo()
}}>
  Upload & Start
</button>
```

### ✅ NEW:
```typescript
// In AuthModal
import { useJobFlow } from '@/lib/jobFlow'

const AuthModal = () => {
  const { startPreviewFlow, startAuthenticatedFlow, isAuthenticated } = useJobFlow()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleUploadInModal = async (file: File) => {
    // Use orchestrator!
    if (isAuthenticated) {
      await startAuthenticatedFlow(file)
    } else {
      await startPreviewFlow(file)
    }
  }
  
  return (
    <>
      <input 
        ref={fileInputRef}
        type="file"
        hidden
        accept=".pdf,.doc,.docx,.txt,.rtf,image/png,image/jpg,image/jpeg,image/webp,image/heic,image/heif,image/tiff,image/bmp"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUploadInModal(file)
        }}
      />
      <button onClick={() => fileInputRef.current?.click()}>
        Upload & Start
      </button>
    </>
  )
}
```

## 7. Homepage CTA Buttons

### ❌ OLD:
```typescript
// Homepage buttons
<button onClick={handleStartDemo}>
  Get Started
</button>
<button onClick={() => processPortfolioGeneration(demoFile)}>
  Try Demo
</button>
```

### ✅ NEW:
```typescript
import { useJobFlow } from '@/lib/jobFlow'

const Homepage = () => {
  const { startPreviewFlow } = useJobFlow()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleGetStarted = () => {
    fileInputRef.current?.click()
  }
  
  const handleTryDemo = async () => {
    // Load a demo file
    const response = await fetch('/demo-cv.pdf')
    const blob = await response.blob()
    const demoFile = new File([blob], 'demo-cv.pdf', { type: 'application/pdf' })
    
    // Use orchestrator!
    await startPreviewFlow(demoFile)
  }
  
  return (
    <>
      <input 
        ref={fileInputRef}
        type="file"
        hidden
        accept=".pdf,.doc,.docx,.txt,.rtf,image/png,image/jpg,image/jpeg,image/webp,image/heic,image/heif,image/tiff,image/bmp"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) startPreviewFlow(file)
        }}
      />
      <button onClick={handleGetStarted}>Get Started</button>
      <button onClick={handleTryDemo}>Try Demo</button>
    </>
  )
}
```

## 8. Auto-Start After Auth

### ❌ OLD:
```typescript
// In useEffect watching auth state
useEffect(() => {
  if (isAuthenticated && uploadedFile) {
    handleStartDemo()
    processPortfolioGeneration(uploadedFile)
  }
}, [isAuthenticated])
```

### ✅ NEW:
```typescript
// Handled by the orchestrator!
import { useJobFlow, FlowState } from '@/lib/jobFlow'

const handleAuthSuccess = () => {
  const { context, startPostSignupFlow } = useJobFlow()
  
  // Continue if we have a jobId, regardless of current state
  // (resumeFromStorage may have advanced state via hydration)
  if (context.currentJobId) {
    // Special case: If already in WaitingAuth, continue the flow
    if (context.state === FlowState.WaitingAuth) {
      startPostSignupFlow(context.currentJobId)
    }
    // Otherwise, resumeFromStorage will handle continuation
  }
}
```

## CRITICAL Checklist - Search & Replace

Search your codebase for these patterns and replace ALL of them:

### 🔍 Search for:
- `handleStartDemo(`
- `processPortfolioGeneration(`
- `uploadFile(`
- `uploadAnonymous(`
- `api.upload(`
- `onFileSelect(`
- `handleFileSelect(`
- `setUploadedFile(`
- `setCurrentJobId(`

### ✅ Replace with:
- `startPreviewFlow(` or `startAuthenticatedFlow(`
- Remove - handled by orchestrator
- Remove - handled by orchestrator
- Remove - handled by orchestrator
- Remove - handled by orchestrator
- Use orchestrator directly
- Use orchestrator directly
- Remove - managed by reducer
- Remove - managed by reducer

## Removing Legacy Code

After migration, DELETE these:
```typescript
// DELETE ALL OF THESE:
- handleStartDemo function
- processPortfolioGeneration function
- Direct uploadFile/uploadAnonymous calls
- currentJobId state (use context.currentJobId)
- uploadedFile state (use context.uploadedFile)
- Manual progress calculations
- setTimeout for animations
- window.__flags
```

## CLEAR_LOCK Implementation Detail

The orchestrator automatically clears the job lock when needed:

```typescript
// Inside startPreviewFlow and startAuthenticatedFlow:
const startPreviewFlow = async (file: File) => {
  // If completed with a portfolio, clear lock to allow new upload
  if (context.state === FlowState.Completed && context.currentJobId) {
    console.log('🔓 Clearing previous job lock to allow new upload')
    dispatch({ type: FlowAction.ClearLock })
    // Small delay to ensure state updates
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  
  // CRITICAL GUARD - Check again after potential clear
  if (context.currentJobId) {
    console.log('🛑 BLOCKED: Preview flow blocked, currentJobId exists:', context.currentJobId)
    return
  }
  
  // Continue with upload...
}
```

## Final Integration Pattern

```typescript
// page.tsx - Main component with real auth context
import { JobFlowProvider, useJobFlow } from '@/lib/jobFlow'
import { ProgressCircle, getSemanticProgressForState } from '@/lib/jobFlow'
import { useAuth } from '@/contexts/AuthContext' // Your auth provider

function MainApp() {
  const { 
    context, 
    startPreviewFlow, 
    startAuthenticatedFlow,
    isAuthenticated 
  } = useJobFlow()
  
  // Single unified handler for ALL upload sources
  const handleFileUpload = async (file: File) => {
    // Orchestrator handles CLEAR_LOCK automatically
    if (isAuthenticated) {
      await startAuthenticatedFlow(file)
    } else {
      await startPreviewFlow(file)
    }
  }
  
  // Progress from state
  const semanticProgress = getSemanticProgressForState(context.state)
  
  return (
    <div>
      {/* Option 1: Pass handler down (recommended for consistency) */}
      <InteractiveCVPile onFileSelect={handleFileUpload} />
      <Navbar onFileSelect={handleFileUpload} />
      <ErrorToast onRetry={handleFileUpload} />
      
      {/* Option 2: Components call orchestrator directly */}
      {/* <InteractiveCVPile /> - calls useJobFlow() internally */}
      
      {/* Unified progress display */}
      <ProgressCircle semanticProgress={semanticProgress} />
      
      {/* Portfolio display */}
      {context.portfolioUrl && (
        <iframe src={context.portfolioUrl} />
      )}
    </div>
  )
}

export default function App() {
  const { isAuthenticated } = useAuth() // Get real auth state
  
  return (
    <JobFlowProvider 
      isAuthenticated={isAuthenticated}
      onAuthRequired={() => {
        // Show your auth modal
        console.log('Show auth modal')
      }}
    >
      <MainApp />
    </JobFlowProvider>
  )
}
```

## Verification

After migration, verify:
1. ✅ NO direct API calls outside orchestrators
2. ✅ NO handleStartDemo anywhere
3. ✅ NO processPortfolioGeneration anywhere  
4. ✅ ALL file inputs use orchestrators
5. ✅ ALL progress uses mapSemanticToVisual
6. ✅ NO duplicate uploads in network tab
7. ✅ Portfolio persists on refresh
8. ✅ Can upload new file after completion

## Common Mistakes to Avoid

❌ **DON'T** check currentJobId before calling orchestrator
✅ **DO** let orchestrator handle CLEAR_LOCK

❌ **DON'T** use setTimeout for flow control
✅ **DO** use state transitions

❌ **DON'T** forget to remove setTimeout-based animations
✅ **DO** let orchestrator manage all timing

❌ **DON'T** calculate visual progress manually
✅ **DO** use mapSemanticToVisual

❌ **DON'T** use setTimeout for flow control
✅ **DO** use state transitions

❌ **DON'T** store file/jobId in component state
✅ **DO** use context.uploadedFile and context.currentJobId

❌ **DON'T** call API directly
✅ **DO** use orchestrators only