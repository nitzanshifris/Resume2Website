/**
 * Sections Registry
 * Central registry for all UI sections
 */

export interface SectionRegistryItem {
  name: string;
  path: string;
  category: 'hero' | 'testimonials' | 'pricing' | 'cta' | 'feature' | 'contact' | 'blog' | 'footer' | 'navigation';
  description: string;
  tags: string[];
  dependencies: string[];
  variants: string[];
  status: 'stable' | 'beta' | 'experimental';
}

export const sectionsRegistry: SectionRegistryItem[] = [
  {
    name: 'hero-sections',
    path: '/sections/hero',
    category: 'hero',
    description: 'Hero sections for landing pages',
    tags: ['hero', 'landing', 'banner'],
    dependencies: ['motion', 'clsx'],
    variants: ['HeroSectionWithBeamsAndGrid', 'HeroSectionFocusCards'],
    status: 'stable'
  },
  {
    name: 'testimonials',
    path: '/sections/testimonials',
    category: 'testimonials',
    description: 'Customer testimonials and reviews',
    tags: ['testimonials', 'reviews', 'social-proof'],
    dependencies: ['motion', 'clsx'],
    variants: ['TestimonialsWithMarquee', 'TestimonialCards'],
    status: 'stable'
  },
  {
    name: 'pricing-sections',
    path: '/sections/pricing',
    category: 'pricing',
    description: 'Pricing tables and plans',
    tags: ['pricing', 'plans', 'subscription'],
    dependencies: ['motion', 'clsx'],
    variants: ['PricingWithSwitch', 'PricingCards'],
    status: 'stable'
  },
  {
    name: 'cta-sections',
    path: '/sections/cta',
    category: 'cta',
    description: 'Call-to-action sections',
    tags: ['cta', 'conversion', 'action'],
    dependencies: ['motion', 'clsx'],
    variants: ['CTAWithBackgroundNoise', 'SimpleCTA'],
    status: 'stable'
  }
];

export function getSectionByName(name: string): SectionRegistryItem | undefined {
  return sectionsRegistry.find(section => section.name === name);
}

export function getSectionsByCategory(category: SectionRegistryItem['category']): SectionRegistryItem[] {
  return sectionsRegistry.filter(section => section.category === category);
}

export function getSectionsByTag(tag: string): SectionRegistryItem[] {
  return sectionsRegistry.filter(section => section.tags.includes(tag));
}