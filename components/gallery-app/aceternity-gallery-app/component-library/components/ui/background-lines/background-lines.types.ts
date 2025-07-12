export interface BackgroundLinesProps {
  children: React.ReactNode;
  className?: string;
  svgOptions?: {
    duration?: number;
  };
}

export interface SVGOptions {
  duration?: number;
}

export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  ctaButton?: {
    text: string;
    action: () => void;
  };
}

export interface AboutSectionProps {
  name: string;
  role: string;
  description: string;
  skills?: string[];
}

export interface ServiceSectionProps {
  title: string;
  services: Array<{
    name: string;
    description: string;
    icon?: React.ReactNode;
  }>;
}