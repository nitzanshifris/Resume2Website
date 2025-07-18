// Resume2Web Brand Theme Configuration
export const brandTheme = {
  colors: {
    primary: {
      DEFAULT: '#2563EB',
      light: '#3B82F6',
      dark: '#1D4ED8',
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93BBFD',
      400: '#60A5FA',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
    secondary: {
      DEFAULT: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    accent: {
      DEFAULT: '#F59E0B',
      light: '#FBB040',
      dark: '#D97706',
    },
  },
  gradients: {
    primary: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
    secondary: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    accent: 'linear-gradient(135deg, #F59E0B 0%, #DC2626 100%)',
    hero: 'linear-gradient(180deg, rgba(37, 99, 235, 0.05) 0%, transparent 100%)',
  },
  shadows: {
    brand: '0 10px 30px -10px rgba(37, 99, 235, 0.3)',
    brandHover: '0 20px 40px -15px rgba(37, 99, 235, 0.4)',
    soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  animations: {
    fadeIn: 'fadeIn 0.6s ease-out',
    slideUp: 'slideUp 0.8s ease-out',
    scaleIn: 'scaleIn 0.5s ease-out',
    float: 'float 6s ease-in-out infinite',
  },
  typography: {
    fonts: {
      heading: 'Inter, system-ui, -apple-system, sans-serif',
      body: 'Inter, system-ui, -apple-system, sans-serif',
      mono: 'JetBrains Mono, Consolas, monospace',
    },
    sizes: {
      hero: 'clamp(3rem, 10vw, 7rem)',
      h1: 'clamp(2.5rem, 5vw, 4rem)',
      h2: 'clamp(2rem, 4vw, 3rem)',
      h3: 'clamp(1.5rem, 3vw, 2rem)',
      body: 'clamp(1rem, 2vw, 1.125rem)',
    },
  },
  spacing: {
    section: '6rem',
    sectionMobile: '4rem',
    container: '1280px',
  },
  borderRadius: {
    small: '0.375rem',
    medium: '0.5rem',
    large: '0.75rem',
    xl: '1rem',
  },
}

// CSS Custom Properties for runtime theming
export const cssVariables = `
  :root {
    /* Brand Colors */
    --r2w-primary: 221 83% 53%;
    --r2w-primary-rgb: 37, 99, 235;
    --r2w-secondary: 158 64% 52%;
    --r2w-secondary-rgb: 16, 185, 129;
    --r2w-accent: 38 92% 50%;
    --r2w-accent-rgb: 245, 158, 11;
    
    /* Brand Gradients */
    --r2w-gradient-primary: ${brandTheme.gradients.primary};
    --r2w-gradient-secondary: ${brandTheme.gradients.secondary};
    --r2w-gradient-accent: ${brandTheme.gradients.accent};
    
    /* Brand Shadows */
    --r2w-shadow: ${brandTheme.shadows.brand};
    --r2w-shadow-hover: ${brandTheme.shadows.brandHover};
    
    /* Spacing */
    --r2w-section-spacing: ${brandTheme.spacing.section};
    --r2w-container-width: ${brandTheme.spacing.container};
  }
  
  @media (max-width: 768px) {
    :root {
      --r2w-section-spacing: ${brandTheme.spacing.sectionMobile};
    }
  }
`