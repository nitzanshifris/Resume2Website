# Task #7 - Homepage Headlines Update

## 📋 Task Overview

| Property | Value |
|----------|-------|
| **ID** | 7 |
| **Title** | Homepage Headlines Update |
| **Status** | 🟡 Pending |
| **Priority** | 🔴 High |
| **Complexity** | ⚫ 6/10 |
| **Dependencies** | None |
| **File Path** | `CV2WEB-V4/user_web_example/app/page.tsx` |

## 🎯 Current State

### Headlines
- **Main headline:** "Take control of your career, stand out, get interviews"
- **Sub-headline:** "Turn your PDF résumé into a Web Portfolio in One click"  
- **Post-animation headline:** "Transform Your Portfolio - From PDF to Professional Website"

---

## 🔧 Implementation Subtasks

### 1️⃣ Update Homepage Headlines in page.tsx

**📁 Path:** `CV2WEB-V4/user_web_example/app/page.tsx`

**📝 Implementation:** Replace existing headline text with conversion-focused copy

```typescript
// 🔴{PLACEHOLDER: Headline variations for A/B testing}
const headlines = {
  main: 🔴{PLACEHOLDER: Main headline text},
  sub: 🔴{PLACEHOLDER: Sub-headline text},
  postAnimation: 🔴{PLACEHOLDER: Post-animation text}
};
```

---

### 2️⃣ Update CV2WebDemo Component Headlines

**📁 Path:** `CV2WEB-V4/user_web_example/app/page.tsx` (Lines 482-1179)

**📝 Current Implementation:**

```typescript
// Desktop version headlines (around lines 908-933)
<span className="text-gray-800 font-bold">
  Take control of your <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">career</span>,
  <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">stand out</span>,
  get&nbsp;<span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">interviews</span>
</span>

// Mobile version headlines (around lines 698-701)
// Similar structure but with responsive sizing
```

**🔑 Key Areas to Modify:**
- Main headline text (lines 699, 910)
- Sub-headline with RoughNotation strike-through effect (lines 720-731, 920-931)
- Post-animation headline in AnimatePresence (lines 979-996)
- Mobile-specific headline sizing: `style={{ fontSize: 'clamp(3.2rem, 11vw, 4.5rem)' }}`

---

### 3️⃣ Gradient Text Effects

**📁 Path:** Lines 699, 910, 989 in `CV2WEB-V4/user_web_example/app/page.tsx`

**✅ Current State:** Already implemented using Tailwind CSS classes
- `bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600`
- `bg-clip-text text-transparent`

**🎨 Optional:** To change gradient colors
```
Change from: emerald-500, sky-400, blue-600
To: 🔴{PLACEHOLDER: gradient-color-1}, 🔴{PLACEHOLDER: gradient-color-2}, 🔴{PLACEHOLDER: gradient-color-3}
```

---

### 4️⃣ Create A/B Testing Infrastructure

**📁 Path:** To be added to `CV2WEB-V4/user_web_example/app/page.tsx`

**🆕 New functionality required**

```typescript
const headlineVariants = {
  control: {
    main: 🔴{PLACEHOLDER: Control variant headline},
    sub: 🔴{PLACEHOLDER: Control variant subheadline}
  },
  variantA: {
    main: 🔴{PLACEHOLDER: Variant A headline},
    sub: 🔴{PLACEHOLDER: Variant A subheadline}
  },
  variantB: {
    main: 🔴{PLACEHOLDER: Variant B headline},
    sub: 🔴{PLACEHOLDER: Variant B subheadline}
  }
};
```

---

### 5️⃣ Animation Considerations

**📁 Path:** Lines 979-996 in `CV2WEB-V4/user_web_example/app/page.tsx`

**✅ Current State:** Post-animation headline already exists with transitions

**📝 Example Animation Code:**
```typescript
const [showPostAnimation, setShowPostAnimation] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => setShowPostAnimation(true), 3000);
  return () => clearTimeout(timer);
}, []);
```

---

### 6️⃣ Responsive Design Updates

**📁 Path:** Lines 647+ in `CV2WEB-V4/user_web_example/app/page.tsx`

**✅ Current State:** Responsive design is already implemented
- Mobile-first design with different layouts
- Already has proper scaling for mobile devices