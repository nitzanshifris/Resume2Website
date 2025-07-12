// Portfolio generation types for CV2WEB with MCP

export interface CVData {
  hero: {
    fullName: string;
    title: string;
    summaryTagline: string;
  };
  contact: {
    email: string;
    phone: string;
    location: {
      city: string;
      state: string;
      country?: string;
    };
  };
  experience: {
    experienceItems: Array<{
      jobTitle: string;
      companyName: string;
      dateRange: {
        startDate: string;
        endDate: string;
      };
      responsibilitiesAndAchievements: string[];
    }>;
  };
  education: {
    educationItems: Array<{
      degree: string;
      fieldOfStudy: string;
      institution: string;
      dateRange: {
        startDate: string;
        endDate: string;
      };
      gpa?: string;
    }>;
  };
  skills: {
    skillCategories: Array<{
      categoryName: string;
      skills: string[];
    }>;
  };
}

export enum PortfolioStyle {
  MINIMALIST = 'minimalist',
  RETRO_CYBERPUNK = 'retro-cyberpunk',
  MODERN_BUSINESS = 'modern-business',
  CREATIVE_SHOWCASE = 'creative-showcase',
  TECH_FORWARD = 'tech-forward',
  BOLD_TYPOGRAPHY = 'bold-typography',
  MAGAZINE_LAYOUT = 'magazine-layout',
  ARTISTIC_PORTFOLIO = 'artistic-portfolio'
}

export interface PortfolioConfig {
  style: PortfolioStyle;
  colorScheme?: 'light' | 'dark' | 'auto';
  fontScale?: number; // Multiplier for text sizes (default: 1.0)
  spacing?: 'compact' | 'normal' | 'spacious';
  animations?: boolean;
}

export interface MCPComponent {
  name: string;
  library: 'magic-ui' | 'aceternity-ui' | 'shadcn-ui';
  props?: Record<string, any>;
  children?: MCPComponent[];
}

export interface PortfolioTemplate {
  style: PortfolioStyle;
  components: MCPComponent[];
  layout: {
    sections: string[];
    grid?: string;
  };
  theme: {
    colors: Record<string, string>;
    fonts: {
      heading: string;
      body: string;
    };
    textSizes: {
      hero: string;
      sectionTitle: string;
      body: string;
      small: string;
    };
  };
}