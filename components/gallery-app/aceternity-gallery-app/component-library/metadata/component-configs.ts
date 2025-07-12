/**
 * Component Metadata and Playground Configuration
 * 
 * This file contains prop configurations for components that support playground mode
 */

export interface PropConfig {
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'range' | 'textarea';
  label: string;
  defaultValue: any;
  options?: string[] | number[];
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}

export interface ComponentConfig {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  hasPlayground: boolean;
  defaultProps: Record<string, any>;
  propConfigs: Record<string, PropConfig>;
  codeTemplate: string;
  importStatement: string;
}

export const componentConfigs: Record<string, ComponentConfig> = {
  'background-boxes': {
    id: 'background-boxes',
    name: 'background-boxes',
    title: 'Background Boxes',
    description: 'A full width background box container that highlights on hover',
    category: 'Background',
    hasPlayground: true,
    defaultProps: {
      className: '',
      boxClassName: '',
      children: 'Amazing Background Boxes',
    },
    propConfigs: {
      className: {
        type: 'string',
        label: 'Container Class',
        defaultValue: '',
        description: 'Additional CSS classes for the container'
      },
      boxClassName: {
        type: 'string',
        label: 'Box Class',
        defaultValue: '',
        description: 'CSS classes for individual boxes'
      },
      children: {
        type: 'textarea',
        label: 'Content',
        defaultValue: 'Amazing Background Boxes',
        description: 'Content to display'
      }
    },
    codeTemplate: `import { Boxes } from "@/component-library/components/ui/background-boxes";

export function MyComponent() {
  return (
    <div className="h-96 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg {{className}}">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <div className="relative z-20 text-center">
        <h1 className="md:text-4xl text-xl text-white">{{children}}</h1>
      </div>
    </div>
  );
}`,
    importStatement: 'import { Boxes } from "@/component-library/components/ui/background-boxes";'
  },

  'background-gradient': {
    id: 'background-gradient',
    name: 'background-gradient',
    title: 'Background Gradient',
    description: 'An animated gradient that sits at the background of a card, button or anything',
    category: 'Background',
    hasPlayground: true,
    defaultProps: {
      className: '',
      containerClassName: '',
      animate: true,
      children: 'Gradient Background Content',
    },
    propConfigs: {
      className: {
        type: 'string',
        label: 'Content Class',
        defaultValue: '',
        description: 'CSS classes for the content'
      },
      containerClassName: {
        type: 'string',
        label: 'Container Class',
        defaultValue: '',
        description: 'CSS classes for the container'
      },
      animate: {
        type: 'boolean',
        label: 'Enable Animation',
        defaultValue: true,
        description: 'Enable or disable gradient animation'
      },
      children: {
        type: 'textarea',
        label: 'Content',
        defaultValue: 'Gradient Background Content',
        description: 'Content to display'
      }
    },
    codeTemplate: `import { BackgroundGradient } from "@/component-library/components/ui/background-gradient";

export function MyComponent() {
  return (
    <BackgroundGradient
      className="{{className}}"
      containerClassName="{{containerClassName}}"
      animate={{{animate}}}
    >
      {{children}}
    </BackgroundGradient>
  );
}`,
    importStatement: 'import { BackgroundGradient } from "@/component-library/components/ui/background-gradient";'
  },

  'background-lines': {
    id: 'background-lines',
    name: 'background-lines',
    title: 'Background Lines',
    description: 'A set of svg paths that animate in a wave pattern. Good for hero sections background',
    category: 'Background',
    hasPlayground: true,
    defaultProps: {
      className: 'flex items-center justify-center w-full flex-col px-4',
      children: 'Animated Background Lines',
      svgOptions: { duration: 10 }
    },
    propConfigs: {
      className: {
        type: 'string',
        label: 'Container Class',
        defaultValue: 'flex items-center justify-center w-full flex-col px-4',
        description: 'CSS classes for the container'
      },
      children: {
        type: 'textarea',
        label: 'Content',
        defaultValue: 'Animated Background Lines',
        description: 'Content to display'
      },
      duration: {
        type: 'range',
        label: 'Animation Duration',
        defaultValue: 10,
        min: 2,
        max: 30,
        step: 1,
        description: 'Animation duration in seconds'
      }
    },
    codeTemplate: `import { BackgroundLines } from "@/component-library/components/ui/background-lines";

export function MyComponent() {
  return (
    <BackgroundLines
      className="{{className}}"
      svgOptions={{ duration: {{duration}} }}
    >
      {{children}}
    </BackgroundLines>
  );
}`,
    importStatement: 'import { BackgroundLines } from "@/component-library/components/ui/background-lines";'
  },

  'bento-grid': {
    id: 'bento-grid',
    name: 'bento-grid',
    title: 'Bento Grid',
    description: 'A skewed grid layout with Title, description and a header component',
    category: 'Layout',
    hasPlayground: true,
    defaultProps: {
      className: 'max-w-4xl mx-auto',
      variant: 'basic',
      autoRows: 'md:auto-rows-[18rem]'
    },
    propConfigs: {
      className: {
        type: 'string',
        label: 'Container Class',
        defaultValue: 'max-w-4xl mx-auto',
        description: 'CSS classes for the grid container'
      },
      variant: {
        type: 'select',
        label: 'Variant',
        defaultValue: 'basic',
        options: ['basic', 'animated', 'two-column', 'skills-showcase', 'projects-showcase', 'services-showcase'],
        description: 'Choose grid variant'
      },
      autoRows: {
        type: 'select',
        label: 'Row Height',
        defaultValue: 'md:auto-rows-[18rem]',
        options: ['md:auto-rows-[12rem]', 'md:auto-rows-[18rem]', 'md:auto-rows-[20rem]', 'md:auto-rows-[24rem]'],
        description: 'Grid row height'
      }
    },
    codeTemplate: `import { BentoGrid{{variant}} } from "@/component-library/components/ui/bento-grid";

export function MyComponent() {
  return (
    <BentoGrid{{variant}} 
      className="{{className}} {{autoRows}}"
    />
  );
}`,
    importStatement: 'import { BentoGrid } from "@/component-library/components/ui/bento-grid";'
  },

  '3d-card': {
    id: '3d-card',
    name: '3d-card',
    title: '3D Card Effect',
    description: 'A card perspective effect, hover over the card to elevate card elements',
    category: 'Interactive',
    hasPlayground: true,
    defaultProps: {
      className: '',
      containerClassName: '',
      variant: 'basic',
      enableRotation: true
    },
    propConfigs: {
      className: {
        type: 'string',
        label: 'Card Class',
        defaultValue: '',
        description: 'CSS classes for the card'
      },
      containerClassName: {
        type: 'string',
        label: 'Container Class',
        defaultValue: '',
        description: 'CSS classes for the container'
      },
      variant: {
        type: 'select',
        label: 'Card Variant',
        defaultValue: 'basic',
        options: ['basic', 'product', 'profile', 'project'],
        description: 'Choose card variant'
      },
      enableRotation: {
        type: 'boolean',
        label: 'Enable 3D Rotation',
        defaultValue: true,
        description: 'Enable 3D rotation on hover'
      }
    },
    codeTemplate: `import { ThreeDCard{{variant}} } from "@/component-library/components/ui/3d-card";

export function MyComponent() {
  return (
    <ThreeDCard{{variant}}
      className="{{className}}"
      containerClassName="{{containerClassName}}"
      enableRotation={{{enableRotation}}}
    />
  );
}`,
    importStatement: 'import { ThreeDCard } from "@/component-library/components/ui/3d-card";'
  },

  'animated-tooltip': {
    id: 'animated-tooltip',
    name: 'animated-tooltip',
    title: 'Animated Tooltip',
    description: 'Interactive tooltip component with smooth animations and 3D hover effects',
    category: 'Interactive',
    hasPlayground: true,
    defaultProps: {
      variant: 'basic',
      delay: 0,
      position: 'bottom'
    },
    propConfigs: {
      variant: {
        type: 'select',
        label: 'Tooltip Variant',
        defaultValue: 'basic',
        options: ['basic', 'team', 'skills', 'technologies'],
        description: 'Choose tooltip variant'
      },
      delay: {
        type: 'range',
        label: 'Animation Delay',
        defaultValue: 0,
        min: 0,
        max: 1000,
        step: 100,
        description: 'Delay before showing tooltip (ms)'
      },
      position: {
        type: 'select',
        label: 'Position',
        defaultValue: 'bottom',
        options: ['top', 'bottom', 'left', 'right'],
        description: 'Tooltip position relative to trigger'
      }
    },
    codeTemplate: `import { AnimatedTooltip{{variant}} } from "@/component-library/components/ui/animated-tooltip";

export function MyComponent() {
  return (
    <AnimatedTooltip{{variant}}
      delay={{{delay}}}
      position="{{position}}"
    />
  );
}`,
    importStatement: 'import { AnimatedTooltip } from "@/component-library/components/ui/animated-tooltip";'
  },

  'cover': {
    id: 'cover',
    name: 'cover',
    title: 'Cover',
    description: 'A Cover component that wraps any children, providing beams and space effect, hover to reveal speed',
    category: 'Special Effects',
    hasPlayground: true,
    defaultProps: {
      children: 'warp speed',
      className: ''
    },
    propConfigs: {
      children: {
        type: 'string',
        label: 'Text Content',
        defaultValue: 'warp speed',
        description: 'The text content to wrap with cover effects'
      },
      className: {
        type: 'string',
        label: 'Custom Classes',
        defaultValue: '',
        description: 'Additional CSS classes to apply'
      }
    },
    codeTemplate: `import { Cover } from "@/component-library/components/ui/cover";

export function MyComponent() {
  return (
    <div>
      <h1 className="text-4xl font-semibold text-center">
        Build amazing websites at <Cover{{className ? \` className="\${className}"\` : ''}}>{{children}}</Cover>
      </h1>
    </div>
  );
}`,
    importStatement: 'import { Cover } from "@/component-library/components/ui/cover";'
  },

  'container-scroll-animation': {
    id: 'container-scroll-animation',
    name: 'container-scroll-animation',
    title: 'Container Scroll Animation',
    description: 'A scroll animation that rotates in 3d on scroll. Perfect for hero or marketing sections',
    category: 'Special Effects',
    hasPlayground: true,
    defaultProps: {
      titleText: 'Unleash the power of',
      highlightText: 'Scroll Animations',
      imageUrl: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1400&h=720&fit=crop'
    },
    propConfigs: {
      titleText: {
        type: 'string',
        label: 'Title Text',
        defaultValue: 'Unleash the power of',
        description: 'The main title text'
      },
      highlightText: {
        type: 'string',
        label: 'Highlight Text',
        defaultValue: 'Scroll Animations',
        description: 'The highlighted text (larger font)'
      },
      imageUrl: {
        type: 'string',
        label: 'Image URL',
        defaultValue: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1400&h=720&fit=crop',
        description: 'The image to display in the card'
      }
    },
    codeTemplate: `import { ContainerScroll } from "@/component-library/components/ui/container-scroll-animation";

export function MyComponent() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              {{titleText}} <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                {{highlightText}}
              </span>
            </h1>
          </>
        }
      >
        <img
          src="{{imageUrl}}"
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}`,
    importStatement: 'import { ContainerScroll } from "@/component-library/components/ui/container-scroll-animation";'
  },

  'container-text-flip': {
    id: 'container-text-flip',
    name: 'container-text-flip',
    title: 'Container Text Flip',
    description: 'A container that flips through words, animating the width',
    category: 'Content',
    hasPlayground: true,
    defaultProps: {
      words: 'better,modern,beautiful,awesome',
      interval: 3000,
      animationDuration: 700
    },
    propConfigs: {
      words: {
        type: 'string',
        label: 'Words (comma separated)',
        defaultValue: 'better,modern,beautiful,awesome',
        description: 'Words to cycle through (comma separated)'
      },
      interval: {
        type: 'range',
        label: 'Interval (ms)',
        defaultValue: 3000,
        min: 500,
        max: 5000,
        step: 500,
        description: 'Time between word transitions'
      },
      animationDuration: {
        type: 'range',
        label: 'Animation Duration (ms)',
        defaultValue: 700,
        min: 200,
        max: 2000,
        step: 100,
        description: 'Duration of the transition animation'
      }
    },
    codeTemplate: `import { ContainerTextFlip } from "@/component-library/components/ui/container-text-flip";

export function MyComponent() {
  return (
    <ContainerTextFlip
      words={[{{words.split(',').map(w => '"' + w.trim() + '"').join(', ')}}]}
      interval={{{interval}}}
      animationDuration={{{animationDuration}}}
    />
  );
}`,
    importStatement: 'import { ContainerTextFlip } from "@/component-library/components/ui/container-text-flip";'
  },

  'direction-aware-hover': {
    id: 'direction-aware-hover',
    name: 'direction-aware-hover',
    title: 'Direction Aware Hover',
    description: 'A direction aware hover effect using Framer Motion, Tailwindcss and good old javascript',
    category: 'Interactive',
    hasPlayground: true,
    defaultProps: {
      imageUrl: 'https://images.unsplash.com/photo-1663765970236-f2acfde22237?w=500&h=500&fit=crop',
      title: 'In the mountains',
      subtitle: '$1299 / night'
    },
    propConfigs: {
      imageUrl: {
        type: 'string',
        label: 'Image URL',
        defaultValue: 'https://images.unsplash.com/photo-1663765970236-f2acfde22237?w=500&h=500&fit=crop',
        description: 'The URL of the image to display'
      },
      title: {
        type: 'string',
        label: 'Title',
        defaultValue: 'In the mountains',
        description: 'The main title text'
      },
      subtitle: {
        type: 'string',
        label: 'Subtitle',
        defaultValue: '$1299 / night',
        description: 'The subtitle text'
      }
    },
    codeTemplate: `import { DirectionAwareHover } from "@/component-library/components/ui/direction-aware-hover";

export function MyComponent() {
  return (
    <div className="h-[40rem] relative flex items-center justify-center">
      <DirectionAwareHover imageUrl="{{imageUrl}}">
        <p className="font-bold text-xl">{{title}}</p>
        <p className="font-normal text-sm">{{subtitle}}</p>
      </DirectionAwareHover>
    </div>
  );
}`,
    importStatement: 'import { DirectionAwareHover } from "@/component-library/components/ui/direction-aware-hover";'
  },

  'aurora-background': {
    id: 'aurora-background',
    name: 'aurora-background',
    title: 'Aurora Background',
    description: 'Beautiful animated gradient background with aurora-like effects and smooth transitions',
    category: 'Background',
    hasPlayground: true,
    defaultProps: {
      variant: 'default',
      showRadialGradient: true,
      children: 'Aurora Background'
    },
    propConfigs: {
      variant: {
        type: 'select',
        label: 'Aurora Variant',
        defaultValue: 'default',
        options: ['default', 'blue', 'purple', 'green', 'red'],
        description: 'Choose aurora color theme'
      },
      showRadialGradient: {
        type: 'boolean',
        label: 'Show Radial Gradient',
        defaultValue: true,
        description: 'Enable radial gradient overlay'
      },
      children: {
        type: 'textarea',
        label: 'Content',
        defaultValue: 'Aurora Background',
        description: 'Content to display'
      }
    },
    codeTemplate: `import { AuroraBackground } from "@/component-library/components/ui/aurora-background";

export function MyComponent() {
  return (
    <AuroraBackground
      variant="{{variant}}"
      showRadialGradient={{{showRadialGradient}}}
    >
      {{children}}
    </AuroraBackground>
  );
}`,
    importStatement: 'import { AuroraBackground } from "@/component-library/components/ui/aurora-background";'
  },

  'floating-navbar': {
    id: 'floating-navbar',
    name: 'floating-navbar',
    title: 'Floating Navbar',
    description: 'Smart navigation bar that hides on scroll down and shows on scroll up',
    category: 'Navigation',
    hasPlayground: true,
    defaultProps: {
      variant: 'standard',
      className: ''
    },
    propConfigs: {
      variant: {
        type: 'select',
        label: 'Navbar Variant',
        defaultValue: 'standard',
        options: ['standard', 'minimal', 'portfolio'],
        description: 'Choose navbar style'
      },
      className: {
        type: 'string',
        label: 'Additional Classes',
        defaultValue: '',
        description: 'CSS classes for navbar'
      }
    },
    codeTemplate: `import { FloatingNavbar{{variant}} } from "@/component-library/components/ui/floating-navbar";

export function MyComponent() {
  return (
    <FloatingNavbar{{variant}}
      className="{{className}}"
    />
  );
}`,
    importStatement: 'import { FloatingNavbar } from "@/component-library/components/ui/floating-navbar";'
  },


  'hero-highlight': {
    id: 'hero-highlight',
    name: 'hero-highlight', 
    title: 'Hero Highlight',
    description: 'A background effect with a text highlight component, perfect for hero sections',
    category: 'Special Effects',
    hasPlayground: true,
    defaultProps: {
      children: 'Your content here',
      className: '',
      containerClassName: ''
    },
    propConfigs: {
      children: {
        type: 'textarea',
        label: 'Content',
        defaultValue: 'Your content here',
        description: 'The content to display inside the hero highlight'
      },
      className: {
        type: 'string',
        label: 'Content Classes',
        defaultValue: '',
        description: 'CSS classes for the content wrapper'
      },
      containerClassName: {
        type: 'string',
        label: 'Container Classes',
        defaultValue: '',
        description: 'CSS classes for the container'
      }
    },
    codeTemplate: `import React from "react";
import { motion } from "motion/react";
import { HeroHighlight, Highlight } from "@/component-library/components/ui/hero-highlight";

export function MyComponent() {
  return (
    <HeroHighlight{{containerClassName ? \` containerClassName="\${containerClassName}"\` : ''}}>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
      >
        {{children}}
      </motion.h1>
    </HeroHighlight>
  );
}`,
    importStatement: 'import { HeroHighlight, Highlight } from "@/component-library/components/ui/hero-highlight";'
  },

  'hero-parallax': {
    id: 'hero-parallax',
    name: 'hero-parallax',
    title: 'Hero Parallax',
    description: 'A scroll effect with rotation, translation and opacity animations',
    category: 'Special Effects',
    hasPlayground: true,
    defaultProps: {
      products: []
    },
    propConfigs: {
      products: {
        type: 'textarea',
        label: 'Products Data',
        defaultValue: '[]',
        description: 'Array of product objects with title, link, and thumbnail'
      }
    },
    codeTemplate: `import React from "react";
import { HeroParallax } from "@/component-library/components/ui/hero-parallax";

const products = [
  {
    title: "Product 1",
    link: "https://example.com",
    thumbnail: "https://example.com/image1.png",
  },
  // Add more products...
];

export function MyComponent() {
  return <HeroParallax products={products} />;
}`,
    importStatement: 'import { HeroParallax } from "@/component-library/components/ui/hero-parallax";'
  },

  'hero-sections': {
    id: 'hero-sections',
    name: 'hero-sections',
    title: 'Hero Sections',
    description: 'A set of hero sections ranging from simple to complex layouts',
    category: 'Special Effects',
    hasPlayground: true,
    defaultProps: {
      containerClassName: ''
    },
    propConfigs: {
      containerClassName: {
        type: 'string',
        label: 'Container Classes',
        defaultValue: '',
        description: 'CSS classes for the container'
      }
    },
    codeTemplate: `import React from "react";
import { HeroSectionOne } from "@/component-library/components/ui/hero-sections";

export function MyComponent() {
  return <HeroSectionOne />;
}`,
    importStatement: 'import { HeroSectionOne } from "@/component-library/components/ui/hero-sections";'
  },

  'hover-border-gradient': {
    id: 'hover-border-gradient',
    name: 'hover-border-gradient',
    title: 'Hover Border Gradient',
    description: 'A hover effect that expands to the entire container with a gradient border',
    category: 'Utilities',
    hasPlayground: true,
    defaultProps: {
      children: 'Hover Me',
      containerClassName: 'rounded-full',
      className: 'dark:bg-black bg-white text-black dark:text-white',
      as: 'button',
      duration: 1,
      clockwise: true
    },
    propConfigs: {
      children: {
        type: 'string',
        label: 'Content',
        defaultValue: 'Hover Me',
        description: 'The content to display inside the button'
      },
      containerClassName: {
        type: 'string',
        label: 'Container Classes',
        defaultValue: 'rounded-full',
        description: 'CSS classes for the container'
      },
      className: {
        type: 'string',
        label: 'Inner Classes',
        defaultValue: 'dark:bg-black bg-white text-black dark:text-white',
        description: 'CSS classes for the inner content'
      },
      as: {
        type: 'select',
        label: 'Element Type',
        defaultValue: 'button',
        options: ['button', 'a', 'div', 'span'],
        description: 'The HTML element type'
      },
      duration: {
        type: 'range',
        label: 'Animation Duration',
        defaultValue: 1,
        min: 0.5,
        max: 5,
        step: 0.5,
        description: 'Duration of the gradient rotation in seconds'
      },
      clockwise: {
        type: 'boolean',
        label: 'Clockwise Rotation',
        defaultValue: true,
        description: 'Direction of gradient rotation'
      }
    },
    codeTemplate: `import React from "react";
import { HoverBorderGradient } from "@/component-library/components/ui/hover-border-gradient";

export function MyComponent() {
  return (
    <HoverBorderGradient
      containerClassName="{{containerClassName}}"
      as="{{as}}"
      className="{{className}}"
      duration={{{duration}}}
      clockwise={{{clockwise}}}
    >
      {{children}}
    </HoverBorderGradient>
  );
}`,
    importStatement: 'import { HoverBorderGradient } from "@/component-library/components/ui/hover-border-gradient";'
  },

  'colourful-text': {
    id: 'colourful-text',
    name: 'colourful-text',
    title: 'Colourful Text',
    description: 'A text component with animated color transitions, filter and scale effects',
    category: 'Content',
    hasPlayground: true,
    defaultProps: {
      text: 'Amazing',
      className: '',
      animationDuration: 0.5,
      shuffleInterval: 5000
    },
    propConfigs: {
      text: {
        type: 'string',
        label: 'Text Content',
        defaultValue: 'Amazing',
        description: 'The text to display with color animation'
      },
      className: {
        type: 'string',
        label: 'Additional Classes',
        defaultValue: '',
        description: 'CSS classes for the text'
      },
      animationDuration: {
        type: 'range',
        label: 'Animation Duration',
        defaultValue: 0.5,
        min: 0.1,
        max: 2,
        step: 0.1,
        description: 'Duration of each character animation (seconds)'
      },
      shuffleInterval: {
        type: 'range',
        label: 'Color Shuffle Interval',
        defaultValue: 5000,
        min: 1000,
        max: 10000,
        step: 500,
        description: 'Time between color shuffles (milliseconds)'
      }
    },
    codeTemplate: `import { ColourfulText } from "@/component-library/components/ui/colourful-text";

export function MyComponent() {
  return (
    <h1 className="text-4xl font-bold text-center">
      Build <ColourfulText text="{{text}}" /> experiences
    </h1>
  );
}`,
    importStatement: 'import { ColourfulText } from "@/component-library/components/ui/colourful-text";'
  },

  'compare': {
    id: 'compare',
    name: 'compare',
    title: 'Compare',
    description: 'A comparison component between two images, slide or drag to compare',
    category: 'Interactive',
    hasPlayground: true,
    defaultProps: {
      firstImage: 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=600&h=400&fit=crop',
      secondImage: 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=600&h=400&fit=crop&duotone=000000,ffffff',
      className: 'h-[400px] w-[600px]',
      slideMode: 'hover',
      showHandlebar: true,
      autoplay: false,
      autoplayDuration: 5000,
      initialSliderPercentage: 50
    },
    propConfigs: {
      firstImage: {
        type: 'string',
        label: 'First Image URL',
        defaultValue: 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=600&h=400&fit=crop',
        description: 'URL of the first (before) image'
      },
      secondImage: {
        type: 'string',
        label: 'Second Image URL',
        defaultValue: 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=600&h=400&fit=crop&duotone=000000,ffffff',
        description: 'URL of the second (after) image'
      },
      className: {
        type: 'string',
        label: 'Container Classes',
        defaultValue: 'h-[400px] w-[600px]',
        description: 'CSS classes for the container'
      },
      slideMode: {
        type: 'select',
        label: 'Slide Mode',
        defaultValue: 'hover',
        options: ['hover', 'drag'],
        description: 'Interaction mode for the slider'
      },
      showHandlebar: {
        type: 'boolean',
        label: 'Show Handle Bar',
        defaultValue: true,
        description: 'Show the draggable handle on the slider'
      },
      autoplay: {
        type: 'boolean',
        label: 'Enable Autoplay',
        defaultValue: false,
        description: 'Enable automatic sliding animation'
      },
      autoplayDuration: {
        type: 'range',
        label: 'Autoplay Duration',
        defaultValue: 5000,
        min: 1000,
        max: 10000,
        step: 500,
        description: 'Duration of one autoplay cycle (ms)'
      },
      initialSliderPercentage: {
        type: 'range',
        label: 'Initial Position',
        defaultValue: 50,
        min: 0,
        max: 100,
        step: 5,
        description: 'Initial slider position (0-100)'
      }
    },
    codeTemplate: `import { Compare } from "@/component-library/components/ui/compare";

export function MyComponent() {
  return (
    <Compare
      firstImage="{{firstImage}}"
      secondImage="{{secondImage}}"
      className="{{className}}"
      slideMode="{{slideMode}}"
      showHandlebar={{{showHandlebar}}}
      autoplay={{{autoplay}}}
      autoplayDuration={{{autoplayDuration}}}
      initialSliderPercentage={{{initialSliderPercentage}}}
    />
  );
}`,
    importStatement: 'import { Compare } from "@/component-library/components/ui/compare";'
  },
  'draggable-card': {
    id: 'draggable-card',
    name: 'draggable-card',
    title: 'Draggable Card',
    description: 'A tiltable, draggable card component that jumps on bounds',
    category: 'Interactive',
    hasPlayground: true,
    defaultProps: {
      variant: 'demo',
      containerClassName: 'relative flex min-h-screen w-full items-center justify-center overflow-clip',
      cardClassName: '',
      imageUrl: 'https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop',
      imageAlt: 'Draggable card',
      title: 'Tyler Durden',
      showTitle: true,
      imageClassName: 'pointer-events-none relative z-10 h-80 w-80 object-cover',
      titleClassName: 'mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300'
    },
    propConfigs: {
      variant: {
        type: 'select',
        label: 'Variant',
        defaultValue: 'demo',
        options: ['demo', 'grid', 'single'],
        description: 'The variant of the draggable card to display'
      },
      containerClassName: {
        type: 'string',
        label: 'Container Classes',
        defaultValue: 'relative flex min-h-screen w-full items-center justify-center overflow-clip',
        description: 'CSS classes for the container'
      },
      cardClassName: {
        type: 'string',
        label: 'Card Classes',
        defaultValue: '',
        description: 'Additional CSS classes for the card'
      },
      imageUrl: {
        type: 'string',
        label: 'Image URL',
        defaultValue: 'https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop',
        description: 'URL of the card image'
      },
      imageAlt: {
        type: 'string',
        label: 'Image Alt Text',
        defaultValue: 'Draggable card',
        description: 'Alternative text for the image'
      },
      title: {
        type: 'string',
        label: 'Card Title',
        defaultValue: 'Tyler Durden',
        description: 'Title text displayed on the card'
      },
      showTitle: {
        type: 'boolean',
        label: 'Show Title',
        defaultValue: true,
        description: 'Whether to display the title'
      },
      imageClassName: {
        type: 'string',
        label: 'Image Classes',
        defaultValue: 'pointer-events-none relative z-10 h-80 w-80 object-cover',
        description: 'CSS classes for the image'
      },
      titleClassName: {
        type: 'string',
        label: 'Title Classes',
        defaultValue: 'mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300',
        description: 'CSS classes for the title'
      }
    },
    codeTemplate: `import { DraggableCard{{variant}} } from "@/component-library/components/ui/draggable-card";

export function MyComponent() {
  return <DraggableCard{{variant}} />;
}`,
    importStatement: 'import { DraggableCard{{variant}} } from "@/component-library/components/ui/draggable-card";'
  },
  'evervault-card': {
    id: 'evervault-card',
    name: 'evervault-card',
    title: 'Evervault Card',
    description: 'A cool card with amazing hover effect, reveals encrypted text and a mixed gradient',
    category: 'Interactive',
    hasPlayground: true,
    defaultProps: {
      text: 'hover',
      className: ''
    },
    propConfigs: {
      text: {
        type: 'string',
        label: 'Card Text',
        defaultValue: 'hover',
        description: 'The text displayed in the center of the card'
      },
      className: {
        type: 'string',
        label: 'Additional Classes',
        defaultValue: '',
        description: 'Additional CSS classes for the card'
      }
    },
    codeTemplate: `import { EvervaultCard, Icon } from "@/component-library/components/ui/evervault-card";

export function MyComponent() {
  return (
    <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start max-w-sm mx-auto p-4 relative h-[30rem]">
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      <EvervaultCard text="{{text}}" className="{{className}}" />

      <h2 className="dark:text-white text-black mt-4 text-sm font-light">
        Hover over this card to reveal an awesome effect. Running out of copy here.
      </h2>
      <p className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5">
        Watch me hover
      </p>
    </div>
  );
}`,
    importStatement: 'import { EvervaultCard, Icon } from "@/component-library/components/ui/evervault-card";'
  },
  'expandable-cards': {
    id: 'expandable-cards',
    name: 'expandable-cards',
    title: 'Expandable Cards',
    description: 'Click cards to expand them and show additional information',
    category: 'Interactive',
    hasPlayground: true,
    defaultProps: {
      variant: 'standard'
    },
    propConfigs: {
      variant: {
        type: 'select',
        label: 'Variant',
        defaultValue: 'standard',
        options: ['standard', 'grid', 'bento'],
        description: 'The variant of the expandable cards to display'
      }
    },
    codeTemplate: `import { ExpandableCards{{variant}} } from "@/component-library/components/ui/expandable-cards";

export function MyComponent() {
  return <ExpandableCards{{variant}} />;
}`,
    importStatement: 'import { ExpandableCards{{variant}} } from "@/component-library/components/ui/expandable-cards";'
  },
  'feature-sections': {
    id: 'feature-sections',
    name: 'feature-sections',
    title: 'Feature Sections',
    description: 'A set of feature sections ranging from bento grids to simple layouts',
    category: 'Layout',
    hasPlayground: true,
    defaultProps: {
      variant: 'bento',
      columns: 4
    },
    propConfigs: {
      variant: {
        type: 'select',
        label: 'Variant',
        defaultValue: 'bento',
        options: ['bento', 'simple', 'hover'],
        description: 'The variant of the feature sections to display'
      },
      columns: {
        type: 'select',
        label: 'Columns',
        defaultValue: 4,
        options: [1, 2, 3, 4],
        description: 'Number of columns for simple and hover variants'
      }
    },
    codeTemplate: `import { FeatureSections{{variant}} } from "@/component-library/components/ui/feature-sections";

export function MyComponent() {
  return <FeatureSections{{variant}} columns={{{columns}}} />;
}`,
    importStatement: 'import { FeatureSections{{variant}} } from "@/component-library/components/ui/feature-sections";'
  },
  'file-upload': {
    id: 'file-upload',
    name: 'file-upload',
    title: 'File Upload',
    description: 'Beautiful file upload component with drag and drop support and smooth animations',
    category: 'Form',
    hasPlayground: true,
    defaultProps: {
      maxFiles: 10,
      disabled: false
    },
    propConfigs: {
      maxFiles: {
        type: 'range',
        label: 'Max Files',
        defaultValue: 10,
        min: 1,
        max: 20,
        step: 1,
        description: 'Maximum number of files allowed'
      },
      disabled: {
        type: 'boolean',
        label: 'Disabled',
        defaultValue: false,
        description: 'Disable the upload component'
      }
    },
    codeTemplate: `import { FileUpload } from "@/component-library/components/ui/file-upload";

export function MyComponent() {
  const handleFileUpload = (files: File[]) => {
    console.log("Files uploaded:", files);
  };

  return (
    <FileUpload 
      onChange={handleFileUpload}
      maxFiles={{{maxFiles}}}
      disabled={{{disabled}}}
    />
  );
}`,
    importStatement: 'import { FileUpload } from "@/component-library/components/ui/file-upload";'
  },
  
  'flip-words': {
    id: 'flip-words',
    name: 'flip-words',
    title: 'Flip Words',
    description: 'Dynamic text animation component that cycles through an array of words with smooth flip animations',
    category: 'Content',
    hasPlayground: true,
    defaultProps: {
      words: 'amazing,beautiful,modern,stunning',
      duration: 3000,
      className: ''
    },
    propConfigs: {
      words: {
        type: 'string',
        label: 'Words (comma separated)',
        defaultValue: 'amazing,beautiful,modern,stunning',
        description: 'Words to cycle through (comma separated)'
      },
      duration: {
        type: 'range',
        label: 'Duration (ms)',
        defaultValue: 3000,
        min: 1000,
        max: 6000,
        step: 500,
        description: 'Time between word changes'
      },
      className: {
        type: 'string',
        label: 'Additional Classes',
        defaultValue: '',
        description: 'CSS classes for the animated text'
      }
    },
    codeTemplate: `import { FlipWords } from "@/component-library/components/ui/flip-words";

export function MyComponent() {
  return (
    <div className="h-[40rem] flex justify-center items-center px-4">
      <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
        Build
        <FlipWords
          words={[{{words.split(',').map(w => '"' + w.trim() + '"').join(', ')}}]}
          duration={{{duration}}}
          className="{{className}}"
        /> <br />
        websites with Aceternity UI
      </div>
    </div>
  );
}`,
    importStatement: 'import { FlipWords } from "@/component-library/components/ui/flip-words";'
  },
  'focus-cards': {
    id: 'focus-cards',
    name: 'focus-cards',
    title: 'Focus Cards',
    description: 'Hover over the card to focus on it, blurring the rest of the cards',
    category: 'Interactive',
    hasPlayground: true,
    defaultProps: {},
    propConfigs: {
      cards: {
        type: 'textarea',
        label: 'Cards',
        defaultValue: [
          {
            title: "Forest Adventure",
            src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          {
            title: "Valley of life",
            src: "https://images.unsplash.com/photo-1600271772470-bd22a42787b3?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          {
            title: "Tropical Paradise",
            src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=3070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }
        ],
        description: 'Array of cards with title and src'
      }
    },
    codeTemplate: `import { FocusCards } from "@/component-library/components/ui/focus-cards";

const cards = [
  {
    title: "Forest Adventure",
    src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Valley of life",
    src: "https://images.unsplash.com/photo-1600271772470-bd22a42787b3?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Tropical Paradise",
    src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=3070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  }
];

export function FocusCardsDemo() {
  return <FocusCards cards={cards} />;
}`,
    importStatement: 'import { FocusCards } from "@/component-library/components/ui/focus-cards";'
  },
  'following-pointer': {
    id: 'following-pointer',
    name: 'following-pointer',
    title: 'Following Pointer',
    description: 'A custom pointer that follows mouse arrow and animates in pointer and content',
    category: 'Interactive',
    hasPlayground: true,
    defaultProps: {
      title: 'John Doe'
    },
    propConfigs: {
      title: {
        type: 'string',
        label: 'Pointer Title',
        defaultValue: 'John Doe',
        description: 'Text displayed in the following pointer'
      },
      className: {
        type: 'string',
        label: 'Additional Classes',
        defaultValue: '',
        description: 'CSS classes for the wrapper'
      }
    },
    codeTemplate: `import { FollowerPointerCard } from "@/component-library/components/ui/following-pointer";

export function FollowingPointerDemo() {
  return (
    <FollowerPointerCard
      title="{{title}}"
      className="{{className}}"
    >
      <div className="p-8 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-2">Interactive Card</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Hover over this card to see the custom pointer follow your mouse.
        </p>
      </div>
    </FollowerPointerCard>
  );
}`,
    importStatement: 'import { FollowerPointerCard } from "@/component-library/components/ui/following-pointer";'
  },
  'globe': {
    id: 'globe',
    name: 'globe',
    title: 'GitHub Globe',
    description: 'A globe animation as seen on GitHub\'s homepage. Interactive and customizable',
    category: 'Special Effects',
    hasPlayground: false,
    defaultProps: {},
    propConfigs: {},
    codeTemplate: `import dynamic from "next/dynamic";

const World = dynamic(() => import("@/component-library/components/ui/globe").then((m) => m.World), {
  ssr: false,
});

export function GlobeDemo() {
  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  const sampleArcs = [
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.1,
      color: "#06b6d4",
    },
    {
      order: 2,
      startLat: 28.6139,
      startLng: 77.209,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.2,
      color: "#3b82f6",
    },
    {
      order: 3,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -1.303396,
      endLng: 36.852443,
      arcAlt: 0.5,
      color: "#6366f1",
    },
  ];

  return (
    <div className="h-[40rem] w-full relative">
      <World data={sampleArcs} globeConfig={globeConfig} />
    </div>
  );
}`,
    importStatement: 'import dynamic from "next/dynamic";'
  },

  'glare-card': {
    id: 'glare-card',
    name: 'glare-card',
    title: 'Glare Card',
    description: 'A glare effect that happens on hover, as seen on Linear\'s website',
    category: 'Interactive',
    hasPlayground: true,
    defaultProps: {
      className: 'flex flex-col items-center justify-center',
      children: 'Card Content'
    },
    propConfigs: {
      className: {
        type: 'string',
        label: 'Card Classes',
        defaultValue: 'flex flex-col items-center justify-center',
        description: 'CSS classes for the card content'
      },
      children: {
        type: 'textarea',
        label: 'Content',
        defaultValue: 'Card Content',
        description: 'Content to display inside the card'
      }
    },
    codeTemplate: `import { GlareCard } from "@/component-library/components/ui/glare-card";

export function MyComponent() {
  return (
    <GlareCard className="{{className}}">
      <div className="text-white">
        {{children}}
      </div>
    </GlareCard>
  );
}`,
    importStatement: 'import { GlareCard } from "@/component-library/components/ui/glare-card";'
  },

  'glowing-effect': {
    id: 'glowing-effect',
    name: 'glowing-effect',
    title: 'Glowing Effect',
    description: 'A border glowing effect that adapts to any container or card, as seen on Cursor\'s website',
    category: 'Interactive',
    hasPlayground: true,
    defaultProps: {
      blur: 0,
      inactiveZone: 0.7,
      proximity: 0,
      spread: 20,
      variant: 'default',
      glow: false,
      disabled: true,
      movementDuration: 2,
      borderWidth: 1
    },
    propConfigs: {
      blur: {
        type: 'range',
        label: 'Blur',
        defaultValue: 0,
        min: 0,
        max: 10,
        step: 1,
        description: 'The amount of blur applied to the glowing effect in pixels'
      },
      inactiveZone: {
        type: 'range',
        label: 'Inactive Zone',
        defaultValue: 0.7,
        min: 0,
        max: 1,
        step: 0.1,
        description: 'The radius multiplier for the center zone where the effect is disabled'
      },
      proximity: {
        type: 'range',
        label: 'Proximity',
        defaultValue: 0,
        min: 0,
        max: 200,
        step: 10,
        description: 'The distance in pixels beyond the element\'s bounds where the effect remains active'
      },
      spread: {
        type: 'range',
        label: 'Spread',
        defaultValue: 20,
        min: 0,
        max: 180,
        step: 10,
        description: 'The angular spread of the glowing effect in degrees'
      },
      variant: {
        type: 'select',
        label: 'Variant',
        defaultValue: 'default',
        options: ['default', 'white'],
        description: 'The color variant of the effect'
      },
      glow: {
        type: 'boolean',
        label: 'Force Glow',
        defaultValue: false,
        description: 'When true, forces the effect to be visible regardless of hover state'
      },
      disabled: {
        type: 'boolean',
        label: 'Disabled',
        defaultValue: true,
        description: 'When true, disables the interactive glowing effect'
      },
      movementDuration: {
        type: 'range',
        label: 'Movement Duration',
        defaultValue: 2,
        min: 0.1,
        max: 5,
        step: 0.1,
        description: 'The duration of the glow movement animation in seconds'
      },
      borderWidth: {
        type: 'range',
        label: 'Border Width',
        defaultValue: 1,
        min: 1,
        max: 10,
        step: 1,
        description: 'The width of the glowing border in pixels'
      }
    },
    codeTemplate: `import { GlowingEffect } from "@/component-library/components/ui/glowing-effect";

export function MyComponent() {
  return (
    <div className="relative p-4 border rounded-lg">
      <GlowingEffect
        blur={{{blur}}}
        inactiveZone={{{inactiveZone}}}
        proximity={{{proximity}}}
        spread={{{spread}}}
        variant="{{variant}}"
        glow={{{glow}}}
        disabled={{{disabled}}}
        movementDuration={{{movementDuration}}}
        borderWidth={{{borderWidth}}}
      />
      <div className="p-6">
        <h3 className="text-lg font-semibold">Card with Glowing Effect</h3>
        <p className="text-neutral-400">Move your mouse around to see the effect.</p>
      </div>
    </div>
  );
}`,
    importStatement: 'import { GlowingEffect } from "@/component-library/components/ui/glowing-effect";'
  },

  'glowing-stars': {
    id: 'glowing-stars',
    name: 'glowing-stars',
    title: 'Glowing Background Stars Card',
    description: 'Card background stars that animate on hover and animate anyway',
    category: 'Special Effects',
    hasPlayground: true,
    defaultProps: {
      className: ''
    },
    propConfigs: {
      className: {
        type: 'string',
        label: 'Card Classes',
        defaultValue: '',
        description: 'Additional CSS classes for the card'
      }
    },
    codeTemplate: `import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from "@/component-library/components/ui/glowing-stars";

export function MyComponent() {
  return (
    <GlowingStarsBackgroundCard className="{{className}}">
      <GlowingStarsTitle>Next.js 14</GlowingStarsTitle>
      <div className="flex justify-between items-end">
        <GlowingStarsDescription>
          The power of full-stack to the frontend. Read the release notes.
        </GlowingStarsDescription>
        <div className="h-8 w-8 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4 text-white stroke-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </div>
      </div>
    </GlowingStarsBackgroundCard>
  );
}`,
    importStatement: 'import { GlowingStarsBackgroundCard, GlowingStarsDescription, GlowingStarsTitle } from "@/component-library/components/ui/glowing-stars";'
  },
  'google-gemini-effect': {
    id: 'google-gemini-effect',
    name: 'google-gemini-effect',
    title: 'Google Gemini Effect',
    description: 'An effect of SVGs as seen on the Google Gemini Website',
    category: 'Special Effects',
    hasPlayground: true,
    defaultProps: {
      title: 'Build with Aceternity UI',
      description: 'Scroll this component and see the bottom SVG come to life wow this works!'
    },
    propConfigs: {
      title: {
        type: 'string',
        label: 'Title',
        defaultValue: 'Build with Aceternity UI',
        description: 'The main title displayed'
      },
      description: {
        type: 'string',
        label: 'Description',
        defaultValue: 'Scroll this component and see the bottom SVG come to life wow this works!',
        description: 'The description text'
      }
    },
    codeTemplate: `import { useScroll, useTransform } from "motion/react";
import React from "react";
import { GoogleGeminiEffect } from "@/component-library/components/ui/google-gemini-effect";

export function MyComponent() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <div
      className="h-[400vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative pt-40 overflow-clip"
      ref={ref}
    >
      <GoogleGeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
        title="{{title}}"
        description="{{description}}"
      />
    </div>
  );
}`,
    importStatement: 'import { GoogleGeminiEffect } from "@/component-library/components/ui/google-gemini-effect";'
  },
  'background-gradient-animation': {
    id: 'background-gradient-animation',
    name: 'background-gradient-animation',
    title: 'Background Gradient Animation',
    description: 'A smooth and elegant background gradient animation that changes the gradient position over time',
    category: 'Background',
    hasPlayground: true,
    defaultProps: {
      gradientBackgroundStart: 'rgb(108, 0, 162)',
      gradientBackgroundEnd: 'rgb(0, 17, 82)',
      firstColor: '18, 113, 255',
      secondColor: '221, 74, 255',
      thirdColor: '100, 220, 255',
      fourthColor: '200, 50, 50',
      fifthColor: '180, 180, 50',
      pointerColor: '140, 100, 255',
      size: '80%',
      blendingValue: 'hard-light',
      interactive: true
    },
    propConfigs: {
      gradientBackgroundStart: {
        type: 'string',
        label: 'Background Start Color',
        defaultValue: 'rgb(108, 0, 162)',
        description: 'The starting color of the background gradient'
      },
      gradientBackgroundEnd: {
        type: 'string',
        label: 'Background End Color',
        defaultValue: 'rgb(0, 17, 82)',
        description: 'The ending color of the background gradient'
      },
      firstColor: {
        type: 'string',
        label: 'First Color',
        defaultValue: '18, 113, 255',
        description: 'The first animated color (RGB values without rgb())'
      },
      secondColor: {
        type: 'string',
        label: 'Second Color',
        defaultValue: '221, 74, 255',
        description: 'The second animated color (RGB values without rgb())'
      },
      thirdColor: {
        type: 'string',
        label: 'Third Color',
        defaultValue: '100, 220, 255',
        description: 'The third animated color (RGB values without rgb())'
      },
      size: {
        type: 'string',
        label: 'Animation Size',
        defaultValue: '80%',
        description: 'The size of the animated gradient elements'
      },
      blendingValue: {
        type: 'select',
        label: 'Blend Mode',
        defaultValue: 'hard-light',
        options: ['normal', 'multiply', 'screen', 'overlay', 'soft-light', 'hard-light', 'color-dodge', 'color-burn'],
        description: 'CSS blend mode for the animated elements'
      },
      interactive: {
        type: 'boolean',
        label: 'Interactive',
        defaultValue: true,
        description: 'Enable mouse interaction'
      }
    },
    codeTemplate: `import React from "react";
import { BackgroundGradientAnimation } from "@/component-library/components/ui/background-gradient-animation";

export function MyComponent() {
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="{{gradientBackgroundStart}}"
      gradientBackgroundEnd="{{gradientBackgroundEnd}}"
      firstColor="{{firstColor}}"
      secondColor="{{secondColor}}"
      thirdColor="{{thirdColor}}"
      size="{{size}}"
      blendingValue="{{blendingValue}}"
      interactive={{{interactive}}}
    >
      <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
          Your Content Here
        </p>
      </div>
    </BackgroundGradientAnimation>
  );
}`,
    importStatement: 'import { BackgroundGradientAnimation } from "@/component-library/components/ui/background-gradient-animation";'
  },

  'grid-and-dot-backgrounds': {
    id: 'grid-and-dot-backgrounds',
    name: 'grid-and-dot-backgrounds',
    title: 'Grid and Dot Backgrounds',
    description: 'Beautiful grid and dot background patterns using CSS gradients',
    category: 'Background',
    hasPlayground: true,
    defaultProps: {
      variant: 'grid',
      size: 'default'
    },
    propConfigs: {
      variant: {
        type: 'select',
        label: 'Background Variant',
        defaultValue: 'grid',
        options: ['grid', 'gridSmall', 'dot'],
        description: 'The type of background pattern to display'
      },
      size: {
        type: 'select',
        label: 'Pattern Size',
        defaultValue: 'default',
        options: ['default', 'small'],
        description: 'The size of the pattern elements'
      }
    },
    codeTemplate: `import React from "react";
import { GridAndDotBackgrounds } from "@/components/ui/grid-and-dot-backgrounds";

export function MyComponent() {
  return (
    <GridAndDotBackgrounds variant="{{variant}}" size="{{size}}" className="h-96 w-full bg-black relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="text-2xl md:text-4xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        Your Content Here
      </p>
    </GridAndDotBackgrounds>
  );
}`,
    importStatement: 'import { GridAndDotBackgrounds } from "@/components/ui/grid-and-dot-backgrounds";'
  },

  'images-slider': {
    id: 'images-slider',
    name: 'images-slider',
    title: 'Images Slider',
    description: 'A full page slider with images that can be navigated with the keyboard',
    category: 'Special Effects',
    hasPlayground: true,
    defaultProps: {
      images: [
        'https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop'
      ],
      autoplay: true,
      direction: 'up',
      overlay: true,
      overlayClassName: '',
      className: 'h-96'
    },
    propConfigs: {
      images: {
        type: 'textarea',
        label: 'Image URLs (one per line)',
        defaultValue: 'https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop',
        description: 'URLs of images to display in the slider'
      },
      autoplay: {
        type: 'boolean',
        label: 'Autoplay',
        defaultValue: true,
        description: 'Automatically advance slides'
      },
      direction: {
        type: 'select',
        label: 'Transition Direction',
        defaultValue: 'up',
        options: ['up', 'down'],
        description: 'Direction of slide transitions'
      },
      overlay: {
        type: 'boolean',
        label: 'Show Overlay',
        defaultValue: true,
        description: 'Display dark overlay on images'
      },
      overlayClassName: {
        type: 'string',
        label: 'Overlay Classes',
        defaultValue: '',
        description: 'Additional CSS classes for the overlay'
      },
      className: {
        type: 'string',
        label: 'Container Classes',
        defaultValue: 'h-96',
        description: 'CSS classes for the slider container'
      }
    },
    codeTemplate: `import { motion } from "motion/react";
import React from "react";
import { ImagesSlider } from "@/component-library/components/ui/images-slider";

export function MyComponent() {
  const images = {{images}};
  
  return (
    <ImagesSlider 
      className="{{className}}"
      images={images}
      autoplay={{{autoplay}}}
      direction="{{direction}}"
      overlay={{{overlay}}}
      overlayClassName="{{overlayClassName}}"
    >
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          Your Title Here
        </motion.p>
        <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
          <span>Get Started →</span>
          <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
        </button>
      </motion.div>
    </ImagesSlider>
  );
}`,
    importStatement: 'import { ImagesSlider } from "@/component-library/components/ui/images-slider";'
  },

  'infinite-moving-cards': {
    id: 'infinite-moving-cards',
    name: 'infinite-moving-cards',
    title: 'Infinite Moving Cards',
    description: 'A customizable group of cards that move infinitely in a loop',
    category: 'Utilities',
    hasPlayground: true,
    defaultProps: {
      items: [
        {
          quote: "The only way to do great work is to love what you do.",
          name: "Steve Jobs",
          title: "Apple Co-founder"
        },
        {
          quote: "Innovation distinguishes between a leader and a follower.",
          name: "Steve Jobs", 
          title: "Stanford Commencement 2005"
        },
        {
          quote: "Your time is limited, don't waste it living someone else's life.",
          name: "Steve Jobs",
          title: "Stanford Commencement 2005"
        }
      ],
      direction: 'left',
      speed: 'normal',
      pauseOnHover: true,
      className: ''
    },
    propConfigs: {
      items: {
        type: 'textarea',
        label: 'Items (JSON)',
        defaultValue: JSON.stringify([
          {
            quote: "The only way to do great work is to love what you do.",
            name: "Steve Jobs",
            title: "Apple Co-founder"
          },
          {
            quote: "Innovation distinguishes between a leader and a follower.",
            name: "Steve Jobs", 
            title: "Stanford Commencement 2005"
          },
          {
            quote: "Your time is limited, don't waste it living someone else's life.",
            name: "Steve Jobs",
            title: "Stanford Commencement 2005"
          }
        ], null, 2),
        description: 'Array of testimonial items with quote, name, and title'
      },
      direction: {
        type: 'select',
        label: 'Direction',
        defaultValue: 'left',
        options: ['left', 'right'],
        description: 'Direction of the scrolling animation'
      },
      speed: {
        type: 'select',
        label: 'Speed',
        defaultValue: 'normal',
        options: ['fast', 'normal', 'slow'],
        description: 'Speed of the scrolling animation'
      },
      pauseOnHover: {
        type: 'boolean',
        label: 'Pause on Hover',
        defaultValue: true,
        description: 'Pause animation when hovering over cards'
      },
      className: {
        type: 'string',
        label: 'Additional Classes',
        defaultValue: '',
        description: 'Additional CSS classes for the container'
      }
    },
    codeTemplate: `import React from "react";
import { InfiniteMovingCards } from "@/component-library/components/ui/infinite-moving-cards";

const testimonials = {{items}};

export function MyComponent() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="{{direction}}"
        speed="{{speed}}"
        pauseOnHover={{{pauseOnHover}}}
        className="{{className}}"
      />
    </div>
  );
}`,
    importStatement: 'import { InfiniteMovingCards } from "@/component-library/components/ui/infinite-moving-cards";'
  },

  'lamp': {
    id: 'lamp',
    name: 'lamp',
    title: 'Lamp',
    description: 'A lamp effect as seen on Linear, great for section headers',
    category: 'Special Effects',
    hasPlayground: true,
    defaultProps: {
      title: 'Build lamps',
      subtitle: 'the right way',
      className: '',
      containerClassName: 'h-96 w-full relative overflow-hidden rounded-lg',
    },
    propConfigs: {
      title: {
        type: 'string',
        label: 'Title',
        defaultValue: 'Build lamps',
        description: 'Main title text'
      },
      subtitle: {
        type: 'string',
        label: 'Subtitle',
        defaultValue: 'the right way',
        description: 'Subtitle text'
      },
      className: {
        type: 'string',
        label: 'Text Class',
        defaultValue: '',
        description: 'Additional CSS classes for the text'
      },
      containerClassName: {
        type: 'string',
        label: 'Container Class',
        defaultValue: 'h-96 w-full relative overflow-hidden rounded-lg',
        description: 'Additional CSS classes for the container'
      }
    },
    codeTemplate: `import { LampDemo } from "@/component-library/components/ui/lamp";
import { motion } from "motion/react";

export function MyComponent() {
  return (
    <LampDemo
      title="{{title}}"
      subtitle="{{subtitle}}"
      className="{{className}}"
      containerClassName="{{containerClassName}}"
    />
  );
}`,
    importStatement: 'import { LampDemo } from "@/component-library/components/ui/lamp";'
  },

  'layout-grid': {
    id: 'layout-grid',
    name: 'layout-grid',
    title: 'Layout Grid',
    description: 'A layout effect that animates the grid item on click, powered by Framer Motion layout',
    category: 'Layout',
    hasPlayground: true,
    defaultProps: {
      variant: 'default',
      className: '',
      containerClassName: 'h-96 w-full relative overflow-hidden rounded-lg'
    },
    propConfigs: {
      variant: {
        type: 'select',
        label: 'Grid Variant',
        defaultValue: 'default',
        options: ['default', 'portfolio', 'products'],
        description: 'Choose the grid variant to display'
      },
      className: {
        type: 'string',
        label: 'Additional Classes',
        defaultValue: '',
        description: 'Additional CSS classes for the grid'
      },
      containerClassName: {
        type: 'string',
        label: 'Container Classes',
        defaultValue: 'h-96 w-full relative overflow-hidden rounded-lg',
        description: 'CSS classes for the container'
      }
    },
    codeTemplate: `import { LayoutGrid{{variant}} } from "@/component-library/components/ui/layout-grid";

export function MyComponent() {
  return (
    <LayoutGrid{{variant}}
      className="{{className}}"
      containerClassName="{{containerClassName}}"
    />
  );
}`,
    importStatement: 'import { LayoutGrid } from "@/component-library/components/ui/layout-grid";'
  },

  'lens': {
    id: 'lens',
    name: 'lens',
    title: 'Lens',
    description: 'A lens component to zoom into images, videos, or practically anything',
    category: 'Interactive',
    hasPlayground: true,
    defaultProps: {
      zoomFactor: 1.5,
      lensSize: 170,
      isStatic: false,
      className: '',
      containerClassName: 'h-96 w-full relative overflow-hidden rounded-lg'
    },
    propConfigs: {
      zoomFactor: {
        type: 'range',
        label: 'Zoom Factor',
        defaultValue: 1.5,
        min: 1,
        max: 5,
        step: 0.1,
        description: 'The magnification factor for the lens'
      },
      lensSize: {
        type: 'range',
        label: 'Lens Size',
        defaultValue: 170,
        min: 50,
        max: 400,
        step: 10,
        description: 'The diameter of the lens in pixels'
      },
      isStatic: {
        type: 'boolean',
        label: 'Static Mode',
        defaultValue: false,
        description: 'If true, the lens stays in a fixed position'
      },
      className: {
        type: 'string',
        label: 'Additional Classes',
        defaultValue: '',
        description: 'Additional CSS classes for the lens'
      },
      containerClassName: {
        type: 'string',
        label: 'Container Classes',
        defaultValue: 'h-96 w-full relative overflow-hidden rounded-lg',
        description: 'CSS classes for the container'
      }
    },
    codeTemplate: `import { LensGalleryPreview } from "@/component-library/components/ui/lens";

export function MyComponent() {
  return (
    <LensGalleryPreview
      className="{{className}}"
      containerClassName="{{containerClassName}}"
    />
  );
}`,
    importStatement: 'import { Lens } from "@/component-library/components/ui/lens";'
  },

  'link-preview': {
    id: 'link-preview',
    name: 'link-preview',
    title: 'Link Preview',
    description: 'A customizable link preview on hover, powered by Microlink API',
    category: 'Interactive',
    hasPlayground: true,
    defaultProps: {
      url: 'https://nextjs.org',
      width: 200,
      height: 125,
      quality: 50,
      isStatic: false,
      className: '',
      containerClassName: 'h-96 w-full relative overflow-hidden rounded-lg bg-background flex items-center justify-center'
    },
    propConfigs: {
      url: {
        type: 'string',
        label: 'URL',
        defaultValue: 'https://nextjs.org',
        description: 'The URL to preview'
      },
      width: {
        type: 'range',
        label: 'Width',
        defaultValue: 200,
        min: 150,
        max: 400,
        step: 10,
        description: 'Preview width in pixels'
      },
      height: {
        type: 'range',
        label: 'Height',
        defaultValue: 125,
        min: 100,
        max: 300,
        step: 5,
        description: 'Preview height in pixels'
      },
      quality: {
        type: 'range',
        label: 'Image Quality',
        defaultValue: 50,
        min: 10,
        max: 100,
        step: 10,
        description: 'Image quality (10-100)'
      },
      isStatic: {
        type: 'boolean',
        label: 'Use Static Image',
        defaultValue: false,
        description: 'Use a static image instead of generating preview'
      },
      className: {
        type: 'string',
        label: 'Link Classes',
        defaultValue: '',
        description: 'Additional CSS classes for styling the link'
      },
      containerClassName: {
        type: 'string',
        label: 'Container Classes',
        defaultValue: 'h-96 w-full relative overflow-hidden rounded-lg bg-background flex items-center justify-center',
        description: 'CSS classes for the container'
      }
    },
    codeTemplate: `import { LinkPreviewGalleryPreview } from "@/component-library/components/ui/link-preview";

export function MyComponent() {
  return (
    <LinkPreviewGalleryPreview
      className="{{className}}"
      containerClassName="{{containerClassName}}"
    />
  );
}`,
    importStatement: 'import { LinkPreview } from "@/component-library/components/ui/link-preview";'
  },
  'macbook-scroll': {
    id: 'macbook-scroll',
    name: 'macbook-scroll',
    title: 'MacBook Scroll',
    description: 'A 3D MacBook Pro animation component that responds to scroll',
    category: 'Special Effects',
    hasPlayground: true,
    defaultProps: {
      src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2071&auto=format&fit=crop',
      title: 'This Macbook is built with Tailwindcss. No kidding.',
      showGradient: false,
      badge: undefined
    },
    propConfigs: {
      src: {
        type: 'string',
        label: 'Image Source',
        defaultValue: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2071&auto=format&fit=crop',
        description: 'Image to display on the MacBook screen'
      },
      title: {
        type: 'textarea',
        label: 'Title',
        defaultValue: 'This Macbook is built with Tailwindcss. No kidding.',
        description: 'Title text displayed above the MacBook'
      },
      showGradient: {
        type: 'boolean',
        label: 'Show Gradient',
        defaultValue: false,
        description: 'Whether to show gradient overlay on the screen'
      }
    },
    codeTemplate: `import { MacBookScroll } from "@/component-library/components/ui/macbook-scroll";

export function MyComponent() {
  return (
    <MacBookScroll
      src="{{src}}"
      title="{{title}}"
      showGradient={{showGradient}}
    />
  );
}`,
    importStatement: 'import { MacBookScroll } from "@/component-library/components/ui/macbook-scroll";'
  },
  'meteors': {
    id: 'meteors',
    name: 'meteors',
    title: 'Meteors',
    description: 'A group of beams in the background of a container, sort of like meteors',
    category: 'Special Effects',
    hasPlayground: true,
    defaultProps: {
      number: 20,
      className: ''
    },
    propConfigs: {
      number: {
        type: 'range',
        label: 'Number of Meteors',
        defaultValue: 20,
        min: 5,
        max: 50,
        step: 5,
        description: 'The number of meteors to display'
      },
      className: {
        type: 'string',
        label: 'Class Name',
        defaultValue: '',
        description: 'Additional CSS classes for styling'
      }
    },
    codeTemplate: `import { Meteors } from "@/component-library/components/ui/meteors";

export function MyComponent() {
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-lg border p-8">
        {/* Your content here */}
        <h1>Content with meteor effect</h1>
        
        {/* Add meteor effect */}
        <Meteors number={{number}} className="{{className}}" />
      </div>
    </div>
  );
}`,
    importStatement: 'import { Meteors } from "@/component-library/components/ui/meteors";'
  },
  'moving-border': {
    id: 'moving-border',
    name: 'moving-border',
    title: 'Moving Border',
    description: 'A border that moves around the container. Perfect for making your buttons stand out',
    category: 'Utilities',
    hasPlayground: true,
    defaultProps: {
      borderRadius: '1.75rem',
      duration: 3000,
      children: 'Borders are cool',
      className: 'bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800',
      containerClassName: '',
      borderClassName: ''
    },
    propConfigs: {
      borderRadius: {
        type: 'string',
        label: 'Border Radius',
        defaultValue: '1.75rem',
        description: 'Border radius of the button'
      },
      duration: {
        type: 'range',
        label: 'Animation Duration',
        defaultValue: 3000,
        min: 1000,
        max: 10000,
        step: 500,
        description: 'Duration for the moving border animation in milliseconds'
      },
      children: {
        type: 'string',
        label: 'Button Text',
        defaultValue: 'Borders are cool',
        description: 'The content to be displayed inside the button'
      },
      className: {
        type: 'string',
        label: 'Button Classes',
        defaultValue: 'bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800',
        description: 'Additional CSS classes for the button'
      },
      containerClassName: {
        type: 'string',
        label: 'Container Classes',
        defaultValue: '',
        description: 'Additional CSS classes for the container'
      },
      borderClassName: {
        type: 'string',
        label: 'Border Classes',
        defaultValue: '',
        description: 'Additional CSS classes for the border'
      }
    },
    codeTemplate: `import { Button } from "@/component-library/components/ui/moving-border";

export function MyComponent() {
  return (
    <Button
      borderRadius="{{borderRadius}}"
      duration={{duration}}
      className="{{className}}"
      containerClassName="{{containerClassName}}"
      borderClassName="{{borderClassName}}"
    >
      {{children}}
    </Button>
  );
}`,
    importStatement: 'import { Button } from "@/component-library/components/ui/moving-border";'
  },

  'multi-step-loader': {
    id: 'multi-step-loader',
    name: 'multi-step-loader',
    title: 'Multi Step Loader',
    description: 'A step loader showing progress through multiple states with checkmarks',
    category: 'Utilities',
    hasPlayground: false,
    defaultProps: {
      loading: true,
      duration: 2000,
      loop: true,
      loadingStates: [
        { text: "Buying a condo" },
        { text: "Travelling around the world" },
        { text: "Meeting Elon Musk" },
        { text: "Building a spaceship" },
        { text: "Going to the moon" },
        { text: "Planting flag on moon" },
        { text: "Celebrating on moon" }
      ]
    },
    propConfigs: {},
    codeTemplate: `import { MultiStepLoader } from "@/component-library/components/ui/multi-step-loader";

const loadingStates = [
  { text: "Buying a condo" },
  { text: "Travelling around the world" },
  { text: "Meeting Elon Musk" },
  { text: "Building a spaceship" },
  { text: "Going to the moon" },
  { text: "Planting flag on moon" },
  { text: "Celebrating on moon" }
];

export function MyComponent() {
  return (
    <MultiStepLoader 
      loadingStates={loadingStates}
      loading={{{loading}}}
      duration={{duration}}
      loop={{{loop}}}
    />
  );
}`,
    importStatement: 'import { MultiStepLoader } from "@/component-library/components/ui/multi-step-loader";'
  },

  'navbar-menu': {
    id: 'navbar-menu',
    name: 'navbar-menu',
    title: 'Navbar Menu',
    description: 'A navbar menu that animates its children on hover, makes a beautiful bignav',
    category: 'Navigation',
    hasPlayground: false,
    defaultProps: {
      menuItems: [
        { item: "Services", links: ["Web Development", "Interface Design", "SEO", "Branding"] },
        { item: "About", links: ["Our Team", "Company History", "Mission", "Values"] },
        { item: "Contact", links: ["Get in Touch", "Support", "Sales"] }
      ]
    },
    propConfigs: {},
    codeTemplate: `import { HoveredLink, Menu, MenuItem } from "@/component-library/components/ui/navbar-menu";

function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  
  return (
    <div className="fixed top-10 inset-x-0 max-w-2xl mx-auto z-50">
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/web-dev">Web Development</HoveredLink>
            <HoveredLink href="/interface-design">Interface Design</HoveredLink>
            <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
            <HoveredLink href="/branding">Branding</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}`,
    importStatement: 'import { HoveredLink, Menu, MenuItem, ProductItem } from "@/component-library/components/ui/navbar-menu";'
  },

  'parallax-scroll': {
    id: 'parallax-scroll',
    name: 'parallax-scroll',
    title: 'Parallax Grid Scroll',
    description: 'A grid where two columns scroll in opposite directions, giving a parallax effect',
    category: 'Special Effects',
    hasPlayground: false,
    defaultProps: {
      images: [
        "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
        "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80",
        "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
      ],
      className: "h-[40rem]"
    },
    propConfigs: {},
    codeTemplate: `import { ParallaxScroll } from "@/component-library/components/ui/parallax-scroll";

const images = [
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80",
  // ... more images
];

export function MyComponent() {
  return (
    <ParallaxScroll 
      images={images}
      className="{{className}}"
    />
  );
}`,
    importStatement: 'import { ParallaxScroll, ParallaxScrollSecond } from "@/component-library/components/ui/parallax-scroll";'
  },

  'placeholders-and-vanish-input': {
    id: 'placeholders-and-vanish-input',
    name: 'placeholders-and-vanish-input',
    title: 'Placeholders And Vanish Input',
    description: 'Sliding in placeholders and vanish effect of input on submit',
    category: 'Form',
    hasPlayground: false,
    defaultProps: {
      placeholders: [
        "What's the first rule of Fight Club?",
        "Who is Tyler Durden?",
        "Where is Andrew Laeddis Hiding?",
        "Write a Javascript method to reverse a string",
        "How to assemble your own PC?"
      ]
    },
    propConfigs: {},
    codeTemplate: `import { PlaceholdersAndVanishInput } from "@/component-library/components/ui/placeholders-and-vanish-input";

const placeholders = [
  "What's the first rule of Fight Club?",
  "Who is Tyler Durden?",
  "Where is Andrew Laeddis Hiding?",
  "Write a Javascript method to reverse a string",
  "How to assemble your own PC?",
];

export function MyComponent() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="h-[40rem] flex flex-col justify-center items-center px-4">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        Ask Aceternity UI Anything
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}`,
    importStatement: 'import { PlaceholdersAndVanishInput } from "@/component-library/components/ui/placeholders-and-vanish-input";'
  },
  'pointer-highlight': {
    id: 'pointer-highlight',
    name: 'pointer-highlight',
    title: 'Pointer Highlight',
    description: 'Animated highlight effect with pointer that draws a border around content on scroll',
    category: 'Interactive',
    hasPlayground: false,
    defaultProps: {
      children: 'collaborate',
      rectangleClassName: '',
      pointerClassName: '',
      containerClassName: ''
    },
    propConfigs: {},
    codeTemplate: `import { PointerHighlight } from "@/component-library/components/ui/pointer-highlight";

export function MyComponent() {
  return (
    <div className="mx-auto max-w-lg py-20 text-2xl font-bold tracking-tight md:text-4xl">
      The best way to grow is to
      <PointerHighlight containerClassName="inline-block mx-2">
        <span>collaborate</span>
      </PointerHighlight>
    </div>
  );
}`,
    importStatement: 'import { PointerHighlight } from "@/component-library/components/ui/pointer-highlight";'
  },
  'resizable-navbar': {
    id: 'resizable-navbar',
    name: 'resizable-navbar',
    title: 'Resizable Navbar',
    description: 'A navbar that changes width on scroll, responsive and animated',
    category: 'Navigation',
    hasPlayground: false,
    defaultProps: {
      navItems: [
        { name: 'Features', link: '#features' },
        { name: 'Pricing', link: '#pricing' },
        { name: 'Contact', link: '#contact' }
      ]
    },
    propConfigs: {},
    codeTemplate: `import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/component-library/components/ui/resizable-navbar";
import { useState } from "react";

export function MyComponent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: "Features", link: "#features" },
    { name: "Pricing", link: "#pricing" },
    { name: "Contact", link: "#contact" },
  ];

  return (
    <Navbar>
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          <NavbarButton variant="secondary">Login</NavbarButton>
          <NavbarButton variant="primary">Get Started</NavbarButton>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={\`mobile-link-\${idx}\`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Login
            </NavbarButton>
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Get Started
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}`,
    importStatement: 'import { Navbar, NavBody, NavItems, MobileNav, NavbarLogo, NavbarButton, MobileNavHeader, MobileNavToggle, MobileNavMenu } from "@/component-library/components/ui/resizable-navbar";'
  },
  'shooting-stars': {
    id: 'shooting-stars',
    name: 'shooting-stars',
    title: 'Shooting Stars',
    description: 'Beautiful animated shooting star effect with customizable colors and speed',
    category: 'Background',
    hasPlayground: false,
    defaultProps: {
      minSpeed: 10,
      maxSpeed: 30,
      minDelay: 1200,
      maxDelay: 4200,
      starColor: '#9CA3AF',
      trailColor: '#2F59AA'
    },
    propConfigs: {
      minSpeed: { type: 'number', min: 5, max: 50, step: 5, label: 'Min Speed' },
      maxSpeed: { type: 'number', min: 10, max: 100, step: 5, label: 'Max Speed' },
      minDelay: { type: 'number', min: 500, max: 5000, step: 100, label: 'Min Delay (ms)' },
      maxDelay: { type: 'number', min: 1000, max: 10000, step: 100, label: 'Max Delay (ms)' },
      starColor: { type: 'color', label: 'Star Color' },
      trailColor: { type: 'color', label: 'Trail Color' }
    },
    codeTemplate: `import { ShootingStars } from "@/component-library/components/ui/shooting-stars";

export function MyComponent() {
  return (
    <div className="relative h-screen bg-neutral-900">
      <ShootingStars 
        minSpeed={{{minSpeed}}}
        maxSpeed={{{maxSpeed}}}
        minDelay={{{minDelay}}}
        maxDelay={{{maxDelay}}}
        starColor="{{starColor}}"
        trailColor="{{trailColor}}"
      />
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </div>
  );
}`,
    importStatement: 'import { ShootingStars } from "@/component-library/components/ui/shooting-stars";'
  },
  'stars-background': {
    id: 'stars-background',
    name: 'stars-background',
    title: 'Stars Background',
    description: 'Stunning animated starry background with twinkling effects',
    category: 'Background',
    hasPlayground: false,
    defaultProps: {
      starDensity: 0.00015,
      allStarsTwinkle: true,
      twinkleProbability: 0.7,
      minTwinkleSpeed: 0.5,
      maxTwinkleSpeed: 1
    },
    propConfigs: {
      starDensity: { type: 'number', min: 0.00005, max: 0.001, step: 0.00005, label: 'Star Density' },
      allStarsTwinkle: { type: 'boolean', label: 'All Stars Twinkle' },
      twinkleProbability: { type: 'number', min: 0, max: 1, step: 0.1, label: 'Twinkle Probability' },
      minTwinkleSpeed: { type: 'number', min: 0.1, max: 5, step: 0.1, label: 'Min Twinkle Speed' },
      maxTwinkleSpeed: { type: 'number', min: 0.5, max: 10, step: 0.5, label: 'Max Twinkle Speed' }
    },
    codeTemplate: `import { StarsBackground } from "@/component-library/components/ui/stars-background";

export function MyComponent() {
  return (
    <div className="relative h-screen bg-neutral-900">
      <StarsBackground 
        starDensity={{{starDensity}}}
        allStarsTwinkle={{{allStarsTwinkle}}}
        twinkleProbability={{{twinkleProbability}}}
        minTwinkleSpeed={{{minTwinkleSpeed}}}
        maxTwinkleSpeed={{{maxTwinkleSpeed}}}
      />
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </div>
  );
}`,
    importStatement: 'import { StarsBackground } from "@/component-library/components/ui/stars-background";'
  },
  'sidebar': {
    id: 'sidebar',
    name: 'sidebar',
    title: 'Sidebar',
    description: 'Expandable sidebar that expands on hover, mobile responsive and dark mode support',
    category: 'Navigation',
    hasPlayground: false,
    defaultProps: {
      animate: true,
      links: [
        { label: 'Dashboard', href: '#', icon: 'dashboard' },
        { label: 'Profile', href: '#', icon: 'profile' },
        { label: 'Settings', href: '#', icon: 'settings' }
      ]
    },
    propConfigs: {
      animate: { type: 'boolean', label: 'Enable Animations' }
    },
    codeTemplate: `import { Sidebar, SidebarBody, SidebarLink } from "@/component-library/components/ui/sidebar";
import { IconBrandTabler, IconUserBolt, IconSettings } from "@tabler/icons-react";
import { useState } from "react";

export function MyComponent() {
  const [open, setOpen] = useState(false);
  
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <IconBrandTabler className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Profile", 
      href: "#",
      icon: <IconUserBolt className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar open={open} setOpen={setOpen} animate={{{animate}}}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1">
        {/* Your main content */}
      </main>
    </div>
  );
}`,
    importStatement: 'import { Sidebar, SidebarBody, SidebarLink } from "@/component-library/components/ui/sidebar";'
  },
  'signup-form': {
    id: 'signup-form',
    name: 'signup-form',
    title: 'Signup Form',
    description: 'A customizable form built on top of shadcn\'s input and label, with a touch of framer motion',
    category: 'Form',
    hasPlayground: false,
    defaultProps: {},
    propConfigs: {},
    codeTemplate: `import { SignupFormDemo } from "@/component-library/components/ui/signup-form";

export function MyComponent() {
  const handleSubmit = (data) => {
    console.log("Form data:", data);
    // Handle form submission
    // data contains: firstname, lastname, email, password, twitterpassword
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
      <SignupFormDemo onSubmit={handleSubmit} />
    </div>
  );
}`,
    importStatement: 'import { SignupFormDemo } from "@/component-library/components/ui/signup-form";'
  },
  'sparkles': {
    id: 'sparkles',
    name: 'sparkles',
    title: 'Sparkles',
    description: 'A configurable sparkles component that can be used as a background or as a standalone component',
    category: 'Special Effects',
    hasPlayground: false,
    defaultProps: {
      background: 'transparent',
      minSize: 0.6,
      maxSize: 1.4,
      speed: 4,
      particleColor: '#FFFFFF',
      particleDensity: 120
    },
    propConfigs: {
      background: { type: 'color', label: 'Background Color' },
      minSize: { type: 'number', min: 0.1, max: 5, step: 0.1, label: 'Min Size' },
      maxSize: { type: 'number', min: 0.5, max: 10, step: 0.1, label: 'Max Size' },
      speed: { type: 'number', min: 1, max: 10, step: 1, label: 'Animation Speed' },
      particleColor: { type: 'color', label: 'Particle Color' },
      particleDensity: { type: 'number', min: 10, max: 2000, step: 10, label: 'Particle Density' }
    },
    codeTemplate: `import { SparklesCore } from "@/component-library/components/ui/sparkles";

export function MyComponent() {
  return (
    <div className="relative h-screen bg-black overflow-hidden">
      <div className="absolute inset-0">
        <SparklesCore
          background="{{background}}"
          minSize={{{minSize}}}
          maxSize={{{maxSize}}}
          speed={{{speed}}}
          particleColor="{{particleColor}}"
          particleDensity={{{particleDensity}}}
          className="w-full h-full"
        />
      </div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-6xl font-bold text-white">
          Your Content Here
        </h1>
      </div>
    </div>
  );
}`,
    importStatement: 'import { SparklesCore } from "@/component-library/components/ui/sparkles";'
  },
  'spotlight': {
    id: 'spotlight',
    name: 'spotlight',
    title: 'Spotlight',
    description: 'An SVG-based spotlight effect that creates a dramatic lighting animation to highlight content',
    category: 'Special Effects',
    hasPlayground: false,
    defaultProps: {
      className: '-top-40 left-0 md:left-60 md:-top-20',
      fill: 'white'
    },
    propConfigs: {
      className: { 
        type: 'string', 
        label: 'Position Classes',
        defaultValue: '-top-40 left-0 md:left-60 md:-top-20',
        description: 'Tailwind classes for positioning the spotlight'
      },
      fill: { 
        type: 'color', 
        label: 'Spotlight Color',
        defaultValue: 'white',
        description: 'Fill color for the spotlight effect'
      }
    },
    codeTemplate: `import { Spotlight } from "@/component-library/components/ui/spotlight";

export function MyComponent() {
  return (
    <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="{{className}}"
        fill="{{fill}}"
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Spotlight Effect
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Your content with dramatic spotlight illumination
        </p>
      </div>
    </div>
  );
}`,
    importStatement: 'import { Spotlight } from "@/component-library/components/ui/spotlight";'
  },
  'spotlight-new': {
    id: 'spotlight-new',
    name: 'spotlight-new',
    title: 'Spotlight New',
    description: 'A new spotlight component with left and right spotlight, configurable and customizable',
    category: 'Special Effects',
    hasPlayground: false,
    defaultProps: {
      gradientFirst: "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)",
      gradientSecond: "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)",
      gradientThird: "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)",
      translateY: -350,
      width: 560,
      height: 1380,
      smallWidth: 240,
      duration: 7,
      xOffset: 100
    },
    propConfigs: {
      gradientFirst: { 
        type: 'textarea', 
        label: 'First Gradient',
        defaultValue: "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)",
        description: 'First gradient color for the spotlight effect'
      },
      gradientSecond: { 
        type: 'textarea', 
        label: 'Second Gradient',
        defaultValue: "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)",
        description: 'Second gradient color for the spotlight effect'
      },
      gradientThird: { 
        type: 'textarea', 
        label: 'Third Gradient',
        defaultValue: "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)",
        description: 'Third gradient color for the spotlight effect'
      },
      translateY: { 
        type: 'range', 
        label: 'Vertical Offset',
        defaultValue: -350,
        min: -500,
        max: 0,
        step: 10,
        description: 'Vertical translation offset in pixels'
      },
      width: { 
        type: 'range', 
        label: 'Main Width',
        defaultValue: 560,
        min: 200,
        max: 1000,
        step: 20,
        description: 'Width of the main spotlight element'
      },
      height: { 
        type: 'range', 
        label: 'Height',
        defaultValue: 1380,
        min: 800,
        max: 2000,
        step: 20,
        description: 'Height of the spotlight elements'
      },
      smallWidth: { 
        type: 'range', 
        label: 'Small Width',
        defaultValue: 240,
        min: 100,
        max: 500,
        step: 10,
        description: 'Width of the smaller spotlight elements'
      },
      duration: { 
        type: 'range', 
        label: 'Animation Duration',
        defaultValue: 7,
        min: 1,
        max: 20,
        step: 0.5,
        description: 'Animation duration in seconds'
      },
      xOffset: { 
        type: 'range', 
        label: 'Horizontal Offset',
        defaultValue: 100,
        min: 0,
        max: 300,
        step: 10,
        description: 'Horizontal animation offset in pixels'
      }
    },
    codeTemplate: `import { Spotlight } from "@/component-library/components/ui/spotlight-new";

export function MyComponent() {
  return (
    <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        gradientFirst="{{gradientFirst}}"
        gradientSecond="{{gradientSecond}}"
        gradientThird="{{gradientThird}}"
        translateY={{{translateY}}}
        width={{{width}}}
        height={{{height}}}
        smallWidth={{{smallWidth}}}
        duration={{{duration}}}
        xOffset={{{xOffset}}}
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Your Content Here
        </h1>
      </div>
    </div>
  );
}`,
    importStatement: 'import { Spotlight } from "@/component-library/components/ui/spotlight-new";'
  },
  'sticky-banner': {
    id: 'sticky-banner',
    name: 'sticky-banner',
    title: 'Sticky Banner',
    description: 'A banner component that sticks to top, hides when user scrolls down',
    category: 'Navigation',
    hasPlayground: false,
    defaultProps: {
      className: 'bg-gradient-to-b from-blue-500 to-blue-600',
      hideOnScroll: false,
      children: 'Announcing our new feature! Learn more'
    },
    propConfigs: {
      className: { 
        type: 'string', 
        label: 'CSS Classes',
        defaultValue: 'bg-gradient-to-b from-blue-500 to-blue-600',
        description: 'CSS classes for styling the banner'
      },
      hideOnScroll: { 
        type: 'boolean', 
        label: 'Hide on Scroll',
        defaultValue: false,
        description: 'Hide the banner when scrolling down'
      },
      children: { 
        type: 'textarea', 
        label: 'Banner Content',
        defaultValue: 'Announcing our new feature! Learn more',
        description: 'Content to display in the banner'
      }
    },
    codeTemplate: `import { StickyBanner } from "@/component-library/components/ui/sticky-banner";

export function MyComponent() {
  return (
    <div className="relative h-screen overflow-y-auto">
      <StickyBanner
        className="{{className}}"
        hideOnScroll={{{hideOnScroll}}}
      >
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
          {{children}}
        </p>
      </StickyBanner>
      
      {/* Your scrollable content */}
      <div className="p-8">
        <h1>Your page content here</h1>
        {/* Add more content to make the page scrollable */}
      </div>
    </div>
  );
}`,
    importStatement: 'import { StickyBanner } from "@/component-library/components/ui/sticky-banner";'
  },
  'sticky-scroll-reveal': {
    id: 'sticky-scroll-reveal',
    name: 'sticky-scroll-reveal',
    title: 'Sticky Scroll Reveal',
    description: 'A sticky container that sticks while scrolling, text reveals on scroll',
    category: 'Special Effects',
    hasPlayground: false,
    defaultProps: {
      content: [
        {
          title: "First Feature",
          description: "This is the description for the first feature. It explains what makes this feature special and why users should care about it.",
          content: null
        },
        {
          title: "Second Feature",
          description: "The second feature description goes here. It provides more details about the capabilities and benefits.",
          content: null
        },
        {
          title: "Third Feature",
          description: "Finally, the third feature description. This completes the showcase of your main features or selling points.",
          content: null
        }
      ],
      contentClassName: ''
    },
    propConfigs: {
      content: { 
        type: 'textarea', 
        label: 'Content Sections (JSON)',
        defaultValue: JSON.stringify([
          {
            title: "First Feature",
            description: "This is the description for the first feature.",
            content: null
          },
          {
            title: "Second Feature", 
            description: "The second feature description goes here.",
            content: null
          },
          {
            title: "Third Feature",
            description: "Finally, the third feature description.",
            content: null
          }
        ], null, 2),
        description: 'Array of content sections with title and description'
      },
      contentClassName: { 
        type: 'string', 
        label: 'Content Container Classes',
        defaultValue: '',
        description: 'CSS classes for the sticky content container'
      }
    },
    codeTemplate: `import { StickyScroll } from "@/component-library/components/ui/sticky-scroll-reveal";

const content = {{content}};

// Add visual content to each section
const contentWithVisuals = content.map((item, index) => ({
  ...item,
  content: (
    <div className="flex h-full w-full items-center justify-center 
                    bg-gradient-to-br from-cyan-500 to-emerald-500 text-white">
      <span className="text-4xl font-bold">{index + 1}</span>
    </div>
  )
}));

export function MyComponent() {
  return (
    <div className="w-full py-4">
      <StickyScroll
        content={contentWithVisuals}
        contentClassName="{{contentClassName}}"
      />
    </div>
  );
}`,
    importStatement: 'import { StickyScroll } from "@/component-library/components/ui/sticky-scroll-reveal";'
  },

  'svg-mask-effect': {
    id: 'svg-mask-effect',
    name: 'svg-mask-effect',
    title: 'SVG Mask Effect',
    description: 'A mask reveal effect that shows hidden content when hovering over a container',
    category: 'Interactive',
    hasPlayground: false,
    defaultProps: {
      size: 10,
      revealSize: 600,
      className: 'h-[40rem] rounded-md border'
    },
    propConfigs: {
      size: {
        type: 'number',
        label: 'Initial Size',
        defaultValue: 10,
        min: 5,
        max: 100,
        step: 5,
        description: 'Initial size of the mask circle in pixels'
      },
      revealSize: {
        type: 'number',
        label: 'Reveal Size',
        defaultValue: 600,
        min: 200,
        max: 1200,
        step: 50,
        description: 'Size of the mask circle when hovered'
      },
      className: {
        type: 'text',
        label: 'Container Class',
        defaultValue: 'h-[40rem] rounded-md border',
        description: 'CSS classes for the container'
      }
    },
    codeTemplate: `import { MaskContainer } from "@/component-library/components/ui/svg-mask-effect";

export function MyComponent() {
  return (
    <MaskContainer
      revealText={
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-slate-800">
            Welcome to Our Platform
          </h1>
          <p className="text-xl text-gray-600">
            Build amazing experiences with modern tools
          </p>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Get Started
          </button>
        </div>
      }
      size={{size}}
      revealSize={{revealSize}}
      className="{{className}}"
    >
      <div className="text-white">
        <h2 className="text-3xl mb-2">✨ Discover More</h2>
        <p className="text-lg">Move your cursor to explore</p>
      </div>
    </MaskContainer>
  );
}`,
    importStatement: 'import { MaskContainer } from "@/component-library/components/ui/svg-mask-effect";'
  },

  'tabs': {
    id: 'tabs',
    name: 'tabs',
    title: 'Animated Tabs',
    description: 'Tabs to switch content with 3D stacking effects and smooth animations',
    category: 'Navigation',
    hasPlayground: true,
    defaultProps: {
      tabCount: 3,
      activeTabClassName: '',
      tabClassName: '',
      contentClassName: ''
    },
    propConfigs: {
      tabCount: {
        type: 'select',
        label: 'Number of Tabs',
        defaultValue: 3,
        options: [2, 3, 4, 5],
        description: 'Number of tabs to display'
      },
      activeTabClassName: {
        type: 'text',
        label: 'Active Tab Class',
        defaultValue: '',
        description: 'CSS class for the active tab indicator'
      },
      tabClassName: {
        type: 'text',
        label: 'Tab Class',
        defaultValue: '',
        description: 'CSS class for individual tab buttons'
      },
      contentClassName: {
        type: 'text',
        label: 'Content Class',
        defaultValue: '',
        description: 'CSS class for the content container'
      }
    },
    codeTemplate: `import { Tabs } from "@/component-library/components/ui/tabs";

const tabs = [
  {
    title: "Tab 1",
    value: "tab1",
    content: (
      <div className="w-full h-full rounded-2xl p-10 bg-gradient-to-br from-purple-700 to-violet-900">
        <p className="text-2xl font-bold text-white">Tab 1 Content</p>
        <p className="text-white/80 mt-4">Your content goes here...</p>
      </div>
    ),
  },
  {
    title: "Tab 2",
    value: "tab2",
    content: (
      <div className="w-full h-full rounded-2xl p-10 bg-gradient-to-br from-blue-700 to-cyan-900">
        <p className="text-2xl font-bold text-white">Tab 2 Content</p>
        <p className="text-white/80 mt-4">Your content goes here...</p>
      </div>
    ),
  },
  {
    title: "Tab 3",
    value: "tab3",
    content: (
      <div className="w-full h-full rounded-2xl p-10 bg-gradient-to-br from-green-700 to-emerald-900">
        <p className="text-2xl font-bold text-white">Tab 3 Content</p>
        <p className="text-white/80 mt-4">Your content goes here...</p>
      </div>
    ),
  }
].slice(0, {{tabCount}});

export function MyTabs() {
  return (
    <div className="h-[40rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full">
      <Tabs 
        tabs={tabs}
        activeTabClassName="{{activeTabClassName}}"
        tabClassName="{{tabClassName}}"
        contentClassName="{{contentClassName}}"
      />
    </div>
  );
}`,
    importStatement: 'import { Tabs } from "@/component-library/components/ui/animated-tabs";'
  },
  'tracing-beam': {
    id: 'tracing-beam',
    name: 'tracing-beam',
    title: 'Tracing Beam',
    description: 'A Beam that follows the path of an SVG as the user scrolls. Adjusts beam length with scroll speed.',
    category: 'Utilities',
    hasPlayground: false,
    defaultProps: {},
    propConfigs: {},
    codeTemplate: `import { TracingBeam } from "@/component-library/components/ui/tracing-beam";

export function MyTracingBeam() {
  return (
    <TracingBeam className="px-6">
      <div className="max-w-2xl mx-auto antialiased pt-4 relative">
        <h2 className="text-2xl font-bold mb-4">
          My Article Title
        </h2>
        <p className="text-gray-700 mb-4">
          Your content goes here. The beam will follow as users scroll.
        </p>
        {/* Add more content */}
      </div>
    </TracingBeam>
  );
}`,
    importStatement: 'import { TracingBeam } from "@/component-library/components/ui/tracing-beam";'
  },
  'timeline': {
    id: 'timeline',
    name: 'timeline',
    title: 'Timeline',
    description: 'A timeline component with sticky header and scroll beam follow',
    category: 'Content',
    hasPlayground: false,
    defaultProps: {},
    propConfigs: {},
    codeTemplate: `import { Timeline } from "@/component-library/components/ui/timeline";

const data = [
  {
    title: "2024",
    content: (
      <div>
        <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          Built and launched Aceternity UI and Aceternity UI Pro from scratch
        </p>
      </div>
    ),
  },
  {
    title: "Early 2023",
    content: (
      <div>
        <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          Started working on the component library
        </p>
      </div>
    ),
  },
];

export function MyTimeline() {
  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}`,
    importStatement: 'import { Timeline } from "@/component-library/components/ui/timeline";'
  },

  'typewriter-effect': {
    id: 'typewriter-effect',
    name: 'typewriter-effect',
    title: 'Typewriter Effect',
    description: 'Text generates as if it is being typed on the screen',
    category: 'Animation',
    hasPlayground: true,
    defaultProps: {
      words: [
        { text: 'Build' },
        { text: 'awesome' },
        { text: 'apps' },
        { text: 'with' },
        { text: 'Aceternity.', className: 'text-blue-500 dark:text-blue-500' }
      ],
      className: '',
      cursorClassName: '',
      variant: 'smooth'
    },
    propConfigs: {
      words: {
        type: 'textarea',
        label: 'Words (JSON)',
        defaultValue: JSON.stringify([
          { text: 'Build' },
          { text: 'awesome' },
          { text: 'apps' },
          { text: 'with' },
          { text: 'Aceternity.', className: 'text-blue-500 dark:text-blue-500' }
        ], null, 2),
        description: 'Array of word objects with text and optional className'
      },
      variant: {
        type: 'select',
        label: 'Variant',
        defaultValue: 'smooth',
        options: ['smooth', 'janky'],
        description: 'Animation style - smooth or janky'
      },
      className: {
        type: 'string',
        label: 'Container Class',
        defaultValue: '',
        description: 'Additional CSS classes for the container'
      },
      cursorClassName: {
        type: 'string',
        label: 'Cursor Class',
        defaultValue: '',
        description: 'Additional CSS classes for the cursor'
      }
    },
    codeTemplate: `import React from "react";
import { TypewriterEffectSmooth, TypewriterEffect } from "@/component-library/components/ui/typewriter-effect";

const words = {{words}};

export function MyComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base mb-4">
        The road to freedom starts from here
      </p>
      {{#if (eq variant "smooth")}}
      <TypewriterEffectSmooth 
        words={words}
        className="{{className}}"
        cursorClassName="{{cursorClassName}}"
      />
      {{else}}
      <TypewriterEffect 
        words={words}
        className="{{className}}"
        cursorClassName="{{cursorClassName}}"
      />
      {{/if}}
    </div>
  );
}`,
    importStatement: 'import { TypewriterEffectSmooth, TypewriterEffect } from "@/component-library/components/ui/typewriter-effect";'
  },

  'vortex': {
    id: 'vortex',
    name: 'vortex',
    title: 'Vortex Background',
    description: 'A wavy, swirly, vortex background ideal for CTAs and backgrounds',
    category: 'Background',
    hasPlayground: true,
    defaultProps: {
      backgroundColor: 'black',
      particleCount: 700,
      rangeY: 100,
      baseHue: 220,
      baseSpeed: 0.0,
      rangeSpeed: 1.5,
      baseRadius: 1,
      rangeRadius: 2,
      className: 'flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full',
      containerClassName: '',
      children: `<h2 className="text-white text-2xl md:text-6xl font-bold text-center">
        Your Title Here
      </h2>
      <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
        Your description text goes here.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white">
          Call to Action
        </button>
      </div>`
    },
    propConfigs: {
      backgroundColor: {
        type: 'color',
        label: 'Background Color',
        defaultValue: '#000000',
        description: 'Background color of the canvas'
      },
      particleCount: {
        type: 'range',
        label: 'Particle Count',
        defaultValue: 700,
        min: 100,
        max: 1200,
        step: 50,
        description: 'Number of particles to be generated'
      },
      rangeY: {
        type: 'range',
        label: 'Range Y',
        defaultValue: 100,
        min: 50,
        max: 400,
        step: 25,
        description: 'Vertical range for particle movement'
      },
      baseHue: {
        type: 'range',
        label: 'Base Hue',
        defaultValue: 220,
        min: 0,
        max: 360,
        step: 10,
        description: 'Base hue for particle color (0-360)'
      },
      baseSpeed: {
        type: 'range',
        label: 'Base Speed',
        defaultValue: 0.0,
        min: 0,
        max: 2,
        step: 0.1,
        description: 'Base speed for particle movement'
      },
      rangeSpeed: {
        type: 'range',
        label: 'Range Speed',
        defaultValue: 1.5,
        min: 0.5,
        max: 3.0,
        step: 0.1,
        description: 'Range of speed variation for particles'
      },
      baseRadius: {
        type: 'range',
        label: 'Base Radius',
        defaultValue: 1,
        min: 0.5,
        max: 5,
        step: 0.5,
        description: 'Base radius of particles'
      },
      rangeRadius: {
        type: 'range',
        label: 'Range Radius',
        defaultValue: 2,
        min: 1,
        max: 8,
        step: 0.5,
        description: 'Range of radius variation for particles'
      },
      className: {
        type: 'string',
        label: 'Content Class',
        defaultValue: 'flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full',
        description: 'CSS classes for the content wrapper'
      },
      containerClassName: {
        type: 'string',
        label: 'Container Class',
        defaultValue: '',
        description: 'CSS classes for the container'
      }
    },
    codeTemplate: `import React from "react";
import { Vortex } from "@/component-library/components/ui/vortex";

export function MyComponent() {
  return (
    <div className="w-[calc(100%-4rem)] mx-auto rounded-md h-[30rem] overflow-hidden">
      <Vortex
        backgroundColor="{{backgroundColor}}"
        particleCount={{{particleCount}}}
        rangeY={{{rangeY}}}
        baseHue={{{baseHue}}}
        baseSpeed={{{baseSpeed}}}
        rangeSpeed={{{rangeSpeed}}}
        baseRadius={{{baseRadius}}}
        rangeRadius={{{rangeRadius}}}
        className="{{className}}"
        containerClassName="{{containerClassName}}"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          Your Title Here
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          Your description text goes here.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white">
            Call to Action
          </button>
        </div>
      </Vortex>
    </div>
  );
}`,
    importStatement: 'import { Vortex } from "@/component-library/components/ui/vortex";'
  },

  'wavy-background': {
    id: 'wavy-background',
    name: 'wavy-background',
    title: 'Wavy Background',
    description: 'A cool background effect with waves that move',
    category: 'Background',
    hasPlayground: true,
    defaultProps: {
      colors: ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"],
      waveWidth: 50,
      backgroundFill: "black",
      blur: 10,
      speed: "fast",
      waveOpacity: 0.5,
      className: "max-w-4xl mx-auto pb-40",
      containerClassName: "",
      children: `<p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
        Hero waves are cool
      </p>
      <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
        Leverage the power of canvas to create a beautiful hero section
      </p>`
    },
    propConfigs: {
      colors: {
        type: 'textarea',
        label: 'Wave Colors (JSON)',
        defaultValue: JSON.stringify(["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"], null, 2),
        description: 'Array of color strings for the waves'
      },
      waveWidth: {
        type: 'range',
        label: 'Wave Width',
        defaultValue: 50,
        min: 10,
        max: 100,
        step: 5,
        description: 'The width of the wave strokes'
      },
      backgroundFill: {
        type: 'color',
        label: 'Background Color',
        defaultValue: '#000000',
        description: 'The background color behind the waves'
      },
      blur: {
        type: 'range',
        label: 'Blur Amount',
        defaultValue: 10,
        min: 0,
        max: 30,
        step: 1,
        description: 'The blur effect applied to the waves'
      },
      speed: {
        type: 'select',
        label: 'Animation Speed',
        defaultValue: 'fast',
        options: ['slow', 'fast'],
        description: 'Speed of the wave animation'
      },
      waveOpacity: {
        type: 'range',
        label: 'Wave Opacity',
        defaultValue: 0.5,
        min: 0.1,
        max: 1.0,
        step: 0.1,
        description: 'Opacity of the wave layers'
      },
      className: {
        type: 'string',
        label: 'Content Class',
        defaultValue: 'max-w-4xl mx-auto pb-40',
        description: 'CSS classes for the content wrapper'
      },
      containerClassName: {
        type: 'string',
        label: 'Container Class',
        defaultValue: '',
        description: 'CSS classes for the main container'
      }
    },
    codeTemplate: `import React from "react";
import { WavyBackground } from "@/component-library/components/ui/wavy-background";

export function MyComponent() {
  return (
    <WavyBackground
      colors={{{colors}}}
      waveWidth={{{waveWidth}}}
      backgroundFill="{{backgroundFill}}"
      blur={{{blur}}}
      speed="{{speed}}"
      waveOpacity={{{waveOpacity}}}
      className="{{className}}"
      containerClassName="{{containerClassName}}"
    >
      <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
        Hero waves are cool
      </p>
      <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
        Leverage the power of canvas to create a beautiful hero section
      </p>
    </WavyBackground>
  );
}`,
    importStatement: 'import { WavyBackground } from "@/component-library/components/ui/wavy-background";'
  },

  'wobble-card': {
    id: 'wobble-card',
    name: 'wobble-card',
    title: 'Wobble Card',
    description: 'A card effect that translates and scales on mousemove, perfect for feature cards',
    category: 'Interactive',
    hasPlayground: true,
    defaultProps: {
      containerClassName: 'bg-indigo-800 min-h-[300px]',
      className: '',
      children: `<h2 className="text-xl lg:text-3xl font-semibold text-white">
        Interactive Wobble Card
      </h2>
      <p className="mt-4 text-neutral-200">
        Move your mouse over this card to see the smooth wobble effect. Perfect for feature cards and interactive content.
      </p>`
    },
    propConfigs: {
      containerClassName: {
        type: 'string',
        label: 'Container Class',
        defaultValue: 'bg-indigo-800 min-h-[300px]',
        description: 'CSS classes for the container (background, size, etc.)'
      },
      className: {
        type: 'string',
        label: 'Content Class',
        defaultValue: '',
        description: 'CSS classes for the content wrapper'
      }
    },
    codeTemplate: `import React from "react";
import { WobbleCard } from "@/component-library/components/ui/wobble-card";

export function MyComponent() {
  return (
    <WobbleCard
      containerClassName="{{containerClassName}}"
      className="{{className}}"
    >
      <h2 className="text-xl lg:text-3xl font-semibold text-white">
        Interactive Wobble Card
      </h2>
      <p className="mt-4 text-neutral-200">
        Move your mouse over this card to see the smooth wobble effect. Perfect for feature cards and interactive content.
      </p>
    </WobbleCard>
  );
}`,
    importStatement: 'import { WobbleCard } from "@/component-library/components/ui/wobble-card";'
  },

  'world-map': {
    id: 'world-map',
    name: 'world-map',
    title: 'World Map',
    description: 'A world map with animated lines and dots, programmatically generated',
    category: 'Special Effects',
    hasPlayground: true,
    defaultProps: {
      dots: [
        {
          start: { lat: 51.5074, lng: -0.1278 }, // London
          end: { lat: 40.7128, lng: -74.0060 }, // New York
        },
        {
          start: { lat: 40.7128, lng: -74.0060 }, // New York
          end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
        },
        {
          start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
          end: { lat: -33.8688, lng: 151.2093 }, // Sydney
        },
        {
          start: { lat: 51.5074, lng: -0.1278 }, // London
          end: { lat: 28.6139, lng: 77.209 }, // New Delhi
        },
      ],
      lineColor: '#0ea5e9'
    },
    propConfigs: {
      dots: {
        type: 'textarea',
        label: 'Connection Dots (JSON)',
        defaultValue: JSON.stringify([
          {
            start: { lat: 51.5074, lng: -0.1278 },
            end: { lat: 40.7128, lng: -74.0060 },
          },
          {
            start: { lat: 40.7128, lng: -74.0060 },
            end: { lat: 35.6762, lng: 139.6503 },
          },
          {
            start: { lat: 35.6762, lng: 139.6503 },
            end: { lat: -33.8688, lng: 151.2093 },
          },
          {
            start: { lat: 51.5074, lng: -0.1278 },
            end: { lat: 28.6139, lng: 77.209 },
          },
        ], null, 2),
        description: 'Array of connection points with start and end coordinates'
      },
      lineColor: {
        type: 'color',
        label: 'Line Color',
        defaultValue: '#0ea5e9',
        description: 'Color of the lines connecting the dots'
      }
    },
    codeTemplate: `import React from "react";
import { WorldMap } from "@/component-library/components/ui/world-map";

export function MyComponent() {
  return (
    <div className="py-20 dark:bg-black bg-white">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-4xl font-bold dark:text-white text-black mb-4">
          Global Connections
        </h2>
        <p className="text-lg text-gray-500">
          Our worldwide network
        </p>
      </div>
      <WorldMap
        dots={{{dots}}}
        lineColor="{{lineColor}}"
      />
    </div>
  );
}`,
    importStatement: 'import { WorldMap } from "@/component-library/components/ui/world-map";'
  }
};

export function getComponentConfig(componentId: string): ComponentConfig | null {
  return componentConfigs[componentId] || null;
}

export function generateCode(config: ComponentConfig, props: Record<string, any>): string {
  let code = config.codeTemplate;
  
  Object.entries(props).forEach(([key, value]) => {
    let stringValue = '';
    if (typeof value === 'string') {
      stringValue = value;
    } else if (typeof value === 'boolean') {
      stringValue = value.toString();
    } else if (typeof value === 'number') {
      stringValue = value.toString();
    } else {
      stringValue = JSON.stringify(value);
    }
    
    code = code.replace(new RegExp(`{{${key}}}`, 'g'), stringValue);
  });
  
  // Handle variant capitalization for component names
  if (props.variant) {
    const capitalizedVariant = props.variant.split('-').map((word: string) => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    code = code.replace(/{{variant}}/g, capitalizedVariant);
  }
  
  return code;
}