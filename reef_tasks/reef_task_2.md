# Task #2 - Portfolio Generation Loading Animation

## 📋 Task Overview

| Property | Value |
|----------|-------|
| **ID** | 5 |
| **Title** | Portfolio Generation Loading Animation |
| **Status** | 🟡 Pending |
| **Priority** | 🔴 High |
| **Complexity** | ⚫ 5/10 |
| **Dependencies** | SSE Infrastructure (✅ already complete) |
| **File Path** | `packages/new-renderer/components/` |

## 🎯 Current State

### Existing Components
- **CV Upload Animation:** Simple spinner with processing message in `user_web_example/components/upload-resume.tsx` (lines 304-330)
- **Template Progress Display:** Already exists at `packages/new-renderer/components/TemplateProgressDisplay.tsx` showing step-based progress
- **SSE Service:** Full SSE infrastructure implemented at `src/services/sse_service.py`
- **Circular Progress Component:** Available at `components/libraries/magic-ui/ui/animated-circular-progress-bar/index.tsx`

---

## 🔧 Implementation Subtasks

### 1️⃣ Create Portfolio Generation Progress Component

**📁 Path:** `packages/new-renderer/components/portfolio-generation-progress.tsx`

**📝 Implementation:** Create new component with percentage-based animation similar to CV upload

```typescript
import React, { useEffect, useState } from 'react';
import { AnimatedCircularProgressBar } from '@/components/libraries/magic-ui/ui/animated-circular-progress-bar';

interface ProgressStage {
  min: number;
  max: number;
  message: string;
}

const PROGRESS_STAGES: ProgressStage[] = [
  { min: 0, max: 20, message: 🔴{PLACEHOLDER: progress-message-1} },
  { min: 20, max: 40, message: 🔴{PLACEHOLDER: progress-message-2} },
  { min: 40, max: 60, message: 🔴{PLACEHOLDER: progress-message-3} },
  { min: 60, max: 80, message: 🔴{PLACEHOLDER: progress-message-4} },
  { min: 80, max: 100, message: 🔴{PLACEHOLDER: progress-message-5} }
];

export const PortfolioGenerationProgress: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(PROGRESS_STAGES[0].message);
  const [isComplete, setIsComplete] = useState(false);
  
  // Progress animation logic here
};
```

---

### 2️⃣ Connect to Existing SSE Events

**📁 Path:** `packages/new-renderer/components/portfolio-generation-progress.tsx`

**✅ Current State:** SSE service already complete - just need to listen to events

**📝 Implementation:** Listen to progress events from existing SSE endpoint

```typescript
useEffect(() => {
  // Connect to existing SSE endpoint
  const eventSource = new EventSource(`/api/sse/portfolio-generation/${sessionId}`);
  
  // Listen for progress updates and animate smoothly
  eventSource.addEventListener('progress', (event) => {
    const data = JSON.parse(event.data);
    animateProgress(progress, data.percentage, 500);
    updateMessageForStage(data.percentage);
  });
  
  return () => eventSource.close();
}, [sessionId]);
```

---

### 3️⃣ Implement Smooth Progress Animation

**📁 Path:** `packages/new-renderer/components/portfolio-generation-progress.tsx`

**📝 Implementation:** Add smooth transitions between progress values

```typescript
const animateProgress = (from: number, to: number, duration: number) => {
  const startTime = Date.now();
  const difference = to - from;
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = from + (difference * easeOutQuart);
    
    setProgress(Math.round(currentValue));
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};
```

---

### 4️⃣ Match CV Upload Animation Design

**📁 Path:** `packages/new-renderer/components/portfolio-generation-progress.tsx`

**✅ Current State:** CV upload uses simple spinner at `user_web_example/components/upload-resume.tsx` (lines 304-310)

**📝 Implementation:** Create enhanced design using existing circular progress component

```typescript
<div className="flex flex-col items-center justify-center space-y-6">
  <div className="relative">
    <AnimatedCircularProgressBar
      value={progress}
      max={100}
      min={0}
      gaugePrimaryColor="#10b981"
      gaugeSecondaryColor="#e5e7eb"
      className="w-48 h-48"
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-4xl font-bold">{progress}%</span>
    </div>
  </div>
  
  <div className="text-center space-y-2">
    <p className="text-lg font-medium animate-pulse">{currentMessage}</p>
    <p className="text-sm text-muted-foreground">
      This usually takes 30-60 seconds
    </p>
  </div>
</div>
```

---


### 5️⃣ Add Engagement Elements

**📁 Path:** `packages/new-renderer/components/portfolio-generation-progress.tsx`

**🆕 New functionality required**

```typescript
// Fun facts or tips that rotate every 5 seconds
const ENGAGEMENT_TIPS = [
  "💡 Did you know? Professional portfolios increase job callbacks by 40%",
  "🎨 We're selecting from over 50 premium templates",
  "✨ Your portfolio will be mobile-responsive by default",
  "🚀 Almost there! Your portfolio is being optimized for SEO"
];

// Rotate tips during generation
useEffect(() => {
  if (!isComplete && progress < 100) {
    const interval = setInterval(() => {
      setCurrentTip(tips => {
        const currentIndex = ENGAGEMENT_TIPS.indexOf(tips);
        return ENGAGEMENT_TIPS[(currentIndex + 1) % ENGAGEMENT_TIPS.length];
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }
}, [isComplete, progress]);
```

---

### 6️⃣ Error State Handling

**📁 Path:** `packages/new-renderer/components/portfolio-generation-progress.tsx`

**📝 Implementation:** Add graceful error handling

```typescript
const [error, setError] = useState<string | null>(null);

const handleError = (errorMessage: string) => {
  setError(errorMessage || "Unable to generate portfolio. Please try again.");
};
```

---

### 7️⃣ Mobile Responsiveness

**📁 Path:** `packages/new-renderer/components/portfolio-generation-progress.tsx`

**📝 Implementation:** Ensure responsive design

```css
@media (max-width: 640px) {
  .progress-container {
    scale: 0.8;
  }
  
  .progress-text {
    font-size: 0.875rem;
  }
}
```