// Pricing sections type definitions
export interface PricingTier {
  name: string;
  id: string;
  href: string;
  priceMonthly: string;
  priceYearly: string;
  description: string;
  features: string[];
  featured: boolean;
  cta: string;
  onClick: () => void;
}

export interface PricingSectionProps {
  tiers?: PricingTier[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export type PricingPeriod = "monthly" | "yearly";

export interface PricingSectionsStyle {
  container?: string;
  grid?: string;
  card?: string;
  title?: string;
  description?: string;
}