// Backend data types - These match the backend adapter outputs

export interface TimelineEntry {
  id: string;
  title: string;
  subtitle?: string;
  dateRange?: string;
  description?: string;
  items: TimelineItem[];
  icon?: string;
  color?: string;
}

export interface TimelineItem {
  text: string;
  icon?: string;
}

export interface BentoGridItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  header?: {
    type: "image" | "gradient" | "component";
    content: any;
  };
  className?: string;
  size?: "small" | "medium" | "large";
}

export interface Card3DData {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  tags?: string[];
  gradient?: string;
}

export interface ExpandableCardData {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  expandedContent?: any;
  icon?: string;
  metrics?: Array<{
    label: string;
    value: string | number;
  }>;
}

export interface CarouselSlide {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  buttonText?: string;
}

export interface HeroData {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundType: "gradient" | "aurora" | "beams" | "boxes" | "lines" | "meteors";
  cta?: {
    primary?: { text: string; link: string };
    secondary?: { text: string; link: string };
  };
  image?: string;
}

export interface SkillItem {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  category?: string;
  icon?: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  image?: string;
  technologies: string[];
  url?: string;
  github?: string;
  featured?: boolean;
}

export interface AchievementData {
  id: string;
  title: string;
  description: string;
  date: string;
  icon?: string;
  metric?: {
    value: number;
    label: string;
  };
}

export interface ContactData {
  email: string;
  phone?: string;
  location?: string;
  socials: Array<{
    platform: string;
    url: string;
    icon?: string;
  }>;
}

export interface CodeSnippet {
  id: string;
  filename: string;
  language: string;
  code: string;
  description?: string;
  highlightLines?: number[];
  tags?: string[];
}

// Theme configuration from backend
export interface ThemeConfig {
  name: string;
  primaryGradient: string;
  secondaryGradient?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono?: string;
  };
  animations: {
    speed: "slow" | "normal" | "fast";
    intensity: "subtle" | "moderate" | "intense";
  };
  spacing: {
    tight: boolean;
    containerWidth: "narrow" | "normal" | "wide" | "full";
  };
}

// UI Style variants from backend
export type UIStyle = 
  | "timeline-vertical"
  | "timeline-horizontal"
  | "cards-grid"
  | "cards-stack"
  | "cards-expandable"
  | "bento-standard"
  | "bento-asymmetric"
  | "carousel-standard"
  | "carousel-apple"
  | "hero-gradient"
  | "hero-aurora"
  | "hero-minimal"
  | "skills-grid"
  | "skills-cloud"
  | "skills-bento"
  | "projects-showcase"
  | "projects-expandable"
  | "achievements-stats"
  | "achievements-cards"
  | "contact-form"
  | "contact-minimal"
  | "code-single"
  | "code-tabs";

// Section configuration from backend
export interface SectionConfig {
  id: string;
  type: "experience" | "education" | "skills" | "projects" | "achievements" | "contact" | "hero";
  title?: string;
  subtitle?: string;
  data: any; // One of the data types above
  uiStyle: UIStyle;
  theme?: Partial<ThemeConfig>;
  order: number;
  visible: boolean;
}