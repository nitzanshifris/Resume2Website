# Flip Words Component

A dynamic text animation component that cycles through an array of words with smooth flip animations.

## Variants

### Base Component (FlipWords)
The foundation component that handles the core flip animation logic.

**Props:**
- `words`: Array of words to cycle through
- `duration`: Time between word changes (default: 3000ms)
- `className`: Additional CSS classes

### FlipWordsHeroTitle
Hero section variant with prefix and suffix text support.

**Additional Props:**
- `prefix`: Text before the animated words
- `suffix`: Text after the animated words

### FlipWordsTestimonialHighlight
Testimonial variant that highlights dynamic words within a quote.

**Additional Props:**
- `testimonial`: The rest of the testimonial text
- `author`: Person who gave the testimonial
- `role`: Author's role/position (optional)

### FlipWordsFeatureShowcase
Feature section variant with gradient text animation.

**Additional Props:**
- `title`: Feature title
- `description`: Feature description

## Usage Examples

```tsx
// Basic usage
<FlipWords 
  words={["amazing", "beautiful", "modern", "stunning"]} 
  duration={3000}
/>

// Hero title
<FlipWordsHeroTitle
  prefix="Build"
  words={["amazing", "beautiful", "modern"]}
  suffix="websites with Aceternity UI"
/>

// Testimonial
<FlipWordsTestimonialHighlight
  words={["innovative", "creative", "dedicated"]}
  testimonial=" and delivers exceptional results every time."
  author="Jane Doe"
  role="CEO, TechCorp"
/>

// Feature showcase
<FlipWordsFeatureShowcase
  title="Experience"
  words={["blazing-fast", "responsive", "accessible"]}
  description="Our components are built with performance and user experience in mind."
/>
```

## Animation Details

- Uses Framer Motion for smooth animations
- Each word animates letter by letter
- Exit animation includes blur and scale effects
- Supports custom styling through className prop