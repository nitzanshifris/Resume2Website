# Task #10 - Portfolio Generation Text Animation

## 📋 Task Overview

| Property | Value |
|----------|-------|
| **ID** | 10 |
| **Title** | Portfolio Generation Text Animation |
| **Status** | 🟡 Pending |
| **Priority** | 🟠 Medium |
| **Complexity** | ⚫ 5/10 |
| **Dependencies** | Text animation components (already exist) |
| **File Path** | `packages/new-renderer/components/` |

## 🎯 Current State

### Existing Components
- **Text Animation Components:** Available at `components/libraries/aceternity/ui/text-generate-effect/` and `components/libraries/aceternity/ui/typewriter-effect/`
- **Before/After Component:** Exists as `BeforeAfterSlider` in `user_web_example/components/see-the-difference.tsx`
- **Portfolio Generation UI:** Exists in various dashboard pages but no central page.tsx with `isGenerating` state

---

## 🔧 Implementation Subtasks

### 1️⃣ Create Portfolio Generation Messages Component

**📁 Path:** `packages/new-renderer/components/portfolio-generation-messages.tsx`

**📝 Implementation:** Create new component for animated messages during portfolio generation

```typescript
import { TextGenerateEffect } from "@/components/libraries/aceternity/ui/text-generate-effect";
import { TypewriterEffect } from "@/components/libraries/aceternity/ui/typewriter-effect";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  {
    text: 🔴{PLACEHOLDER: generation-start-message},
    duration: 4000
  },
  {
    text: 🔴{PLACEHOLDER: portfolio-statistics-message},
    duration: 5000
  },
  {
    text: 🔴{PLACEHOLDER: ai-crafting-message},
    duration: 5000
  },
  {
    text: 🔴{PLACEHOLDER: scroll-invitation-message},
    duration: 4000,
    hasScrollIndicator: true
  }
];
```

---

### 2️⃣ Implement Message Rotation Logic

**📁 Path:** `packages/new-renderer/components/portfolio-generation-messages.tsx`

**📝 Implementation:** Create rotation system with smooth transitions

```typescript
export function PortfolioGenerationMessages() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 500); // Fade out duration
    }, messages[currentIndex].duration);
    
    return () => clearInterval(interval);
  }, [currentIndex]);
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <TextGenerateEffect
            words={messages[currentIndex].text}
            className="text-2xl md:text-3xl font-semibold"
          />
          {messages[currentIndex].hasScrollIndicator && (
            <ScrollIndicator />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

### 3️⃣ Create Scroll Indicator Component

**📁 Path:** `packages/new-renderer/components/portfolio-generation-messages.tsx`

**📝 Implementation:** Add animated scroll invitation

```typescript
function ScrollIndicator() {
  return (
    <motion.div
      className="mt-8 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="cursor-pointer"
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });
        }}
      >
        <svg
          className="w-8 h-8 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
      <span className="text-sm text-muted-foreground mt-2">
        Scroll to see examples
      </span>
    </motion.div>
  );
}
```

---

### 4️⃣ Integration with Portfolio Generation Flow

**📁 Path:** To be integrated where portfolio generation UI exists

**✅ Current State:** No central portfolio generation page found - needs integration point

**📝 Implementation:** Import and use the component where portfolio generation happens

```typescript
import { PortfolioGenerationMessages } from '@/components/portfolio-generation-messages';
import { PortfolioGenerationProgress } from '@/components/portfolio-generation-progress';

// Inside the portfolio generation section
{isGenerating && (
  <div className="flex flex-col items-center space-y-8">
    <PortfolioGenerationProgress progress={progress} />
    <PortfolioGenerationMessages />
  </div>
)}
```

---

### 5️⃣ Mobile Responsiveness

**📁 Path:** `packages/new-renderer/components/portfolio-generation-messages.tsx`

**📝 Implementation:** Ensure text scales appropriately on mobile

```css
@media (max-width: 768px) {
  .portfolio-message {
    font-size: 1.25rem; /* Smaller on mobile */
    padding: 0 1rem; /* Add horizontal padding */
  }
  
  .scroll-indicator svg {
    width: 1.5rem;
    height: 1.5rem;
  }
}
```

---

### 6️⃣ Performance Optimization

**📁 Path:** `packages/new-renderer/components/portfolio-generation-messages.tsx`

**📝 Implementation:** Use React.memo and cleanup

```typescript
export const PortfolioGenerationMessages = React.memo(() => {
  // Component implementation
});
```