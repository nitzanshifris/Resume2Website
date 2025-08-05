// Core Design Rules for CV2WEB Portfolio Generation

export const DESIGN_RULES = {
  // 1. NO OVERLAPPING
  overlap: {
    textOnText: false,
    componentOnComponent: false,
    minSpacing: '1rem', // Minimum spacing between elements
  },
  
  // 2. CONSISTENT THEME
  backgroundTheme: {
    strategy: 'alternating', // 'single' | 'alternating' | 'gradient-progression'
    maxVariations: 2, // Maximum number of different backgrounds
    examples: {
      alternating: ['section-a', 'section-b', 'section-a', 'section-b'],
      single: ['same-bg', 'same-bg', 'same-bg', 'same-bg'],
      gradientProgression: ['light-gradient', 'medium-gradient', 'dark-gradient']
    }
  },
  
  // 3. HIGH CONTRAST
  contrast: {
    minContrastRatio: 7, // WCAG AAA standard
    textOnBackground: {
      light: {
        text: ['text-gray-900', 'text-black'],
        buttons: ['bg-gray-900', 'bg-black', 'border-gray-900']
      },
      dark: {
        text: ['text-white', 'text-gray-100'],
        buttons: ['bg-white', 'bg-gray-100', 'border-white']
      }
    }
  },
  
  // 4. TEXT SIZING (from previous discussion)
  textSizes: {
    hero: 'text-5xl md:text-7xl lg:text-8xl', // 80-128px
    sectionTitle: 'text-3xl md:text-4xl lg:text-5xl', // 48-80px
    body: 'text-xl md:text-2xl', // 20-24px
    small: 'text-base md:text-lg', // 16-18px minimum
  }
};

// Theme Presets with proper contrast
export const THEME_PRESETS = {
  minimalist: {
    backgrounds: [
      'bg-white',
      'bg-gray-50'
    ],
    textColors: ['text-black', 'text-gray-900'],
    accentColors: ['border-black', 'bg-black hover:bg-gray-800']
  },
  
  retroCyberpunk: {
    backgrounds: [
      'bg-gray-950',
      'bg-gradient-to-br from-purple-950 to-pink-950'
    ],
    textColors: ['text-white', 'text-gray-100'],
    accentColors: ['text-purple-400', 'text-pink-400', 'border-purple-400']
  },
  
  professional: {
    backgrounds: [
      'bg-white',
      'bg-slate-50'
    ],
    textColors: ['text-slate-900', 'text-slate-800'],
    accentColors: ['bg-blue-600 hover:bg-blue-700', 'text-blue-600']
  },
  
  creative: {
    backgrounds: [
      'bg-gradient-to-br from-orange-50 to-pink-50',
      'bg-white'
    ],
    textColors: ['text-gray-900', 'text-gray-800'],
    accentColors: ['bg-orange-600 hover:bg-orange-700', 'text-orange-600']
  }
};

// Validation function to check contrast
export function validateContrast(bgClass: string, textClass: string): boolean {
  // This would ideally calculate actual contrast ratios
  // For now, using a simple mapping
  const goodCombos = [
    ['bg-white', 'text-black'],
    ['bg-gray-50', 'text-gray-900'],
    ['bg-gray-950', 'text-white'],
    ['bg-black', 'text-white'],
    ['from-purple-950', 'text-white'],
    ['from-orange-50', 'text-gray-900']
  ];
  
  return goodCombos.some(([bg, text]) => 
    bgClass.includes(bg) && textClass.includes(text)
  );
}