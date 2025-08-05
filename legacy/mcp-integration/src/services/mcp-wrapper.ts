// MCP Wrapper Service for CV2WEB
import { CVData, PortfolioStyle, PortfolioConfig, MCPComponent } from '../types/portfolio.types';

export class MCPWrapper {
  private componentRegistry: Map<string, MCPComponent> = new Map();
  
  constructor() {
    this.initializeComponentRegistry();
  }
  
  private initializeComponentRegistry() {
    // Magic UI Components
    this.registerComponent({
      name: 'BlurFade',
      library: 'magic-ui',
      props: { delay: 0.25, inView: true }
    });
    
    this.registerComponent({
      name: 'GridPattern',
      library: 'magic-ui',
      props: { 
        squares: [[4,4], [5,1], [8,2], [5,3], [10,10], [12,15], [15,10], [20,20]],
        className: 'absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30'
      }
    });
    
    this.registerComponent({
      name: 'RetroGrid',
      library: 'magic-ui',
      props: { className: 'absolute inset-0 h-full w-full' }
    });
    
    this.registerComponent({
      name: 'Meteors',
      library: 'magic-ui',
      props: { number: 5 }
    });
    
    this.registerComponent({
      name: 'WordRotate',
      library: 'magic-ui',
      props: { duration: 2500 }
    });
    
    this.registerComponent({
      name: 'Marquee',
      library: 'magic-ui',
      props: { pauseOnHover: true, className: 'py-4' }
    });
    
    this.registerComponent({
      name: 'AnimatedBeam',
      library: 'magic-ui',
      props: {}
    });
    
    this.registerComponent({
      name: 'ShimmerButton',
      library: 'magic-ui',
      props: { 
        className: 'shadow-2xl',
        shimmerColor: '#ffffff',
        background: 'rgba(0, 0, 0, 1)'
      }
    });
  }
  
  private registerComponent(component: MCPComponent) {
    this.componentRegistry.set(component.name, component);
  }
  
  public getComponent(name: string): MCPComponent | undefined {
    return this.componentRegistry.get(name);
  }
  
  public async generatePortfolioCode(
    cvData: CVData,
    config: PortfolioConfig
  ): Promise<string> {
    const template = this.getTemplateForStyle(config.style);
    const components = this.getComponentsForTemplate(template);
    
    // Generate the portfolio code with proper text sizing
    const fontScale = config.fontScale || 1.0;
    const textSizes = this.calculateTextSizes(fontScale);
    
    return this.buildPortfolioComponent(cvData, components, textSizes, config);
  }
  
  private calculateTextSizes(scale: number) {
    return {
      hero: `${5 * scale}rem md:${8 * scale}rem`, // 80-128px scaled
      sectionTitle: `${3 * scale}rem md:${4 * scale}rem`, // 48-64px scaled
      body: `${1.25 * scale}rem md:${1.5 * scale}rem`, // 20-24px scaled
      small: `${1 * scale}rem`, // 16px minimum
    };
  }
  
  private getTemplateForStyle(style: PortfolioStyle): any {
    // Template definitions for each style
    const templates = {
      [PortfolioStyle.MINIMALIST]: {
        components: ['GridPattern', 'BlurFade', 'Meteors'],
        layout: ['hero', 'experience', 'skills', 'education', 'contact'],
        theme: {
          colors: { primary: 'black', secondary: 'gray', accent: 'white' },
          fonts: { heading: 'font-light', body: 'font-light' }
        }
      },
      [PortfolioStyle.RETRO_CYBERPUNK]: {
        components: ['RetroGrid', 'BlurFade', 'Marquee', 'AnimatedBeam'],
        layout: ['hero', 'skills', 'experience', 'achievements', 'contact'],
        theme: {
          colors: { primary: 'purple', secondary: 'pink', accent: 'neon' },
          fonts: { heading: 'font-bold', body: 'font-medium' }
        }
      },
      [PortfolioStyle.CREATIVE_SHOWCASE]: {
        components: ['WordRotate', 'BlurFade', 'BentoGrid'],
        layout: ['hero', 'about', 'journey', 'skills', 'impact', 'cta'],
        theme: {
          colors: { primary: 'purple', secondary: 'pink', accent: 'orange' },
          fonts: { heading: 'font-bold', body: 'font-normal' }
        }
      },
      // Add more style templates...
    };
    
    return templates[style] || templates[PortfolioStyle.MODERN_BUSINESS];
  }
  
  private getComponentsForTemplate(template: any): MCPComponent[] {
    return template.components.map((name: string) => 
      this.getComponent(name)
    ).filter(Boolean) as MCPComponent[];
  }
  
  private buildPortfolioComponent(
    cvData: CVData,
    components: MCPComponent[],
    textSizes: any,
    config: PortfolioConfig
  ): string {
    // This would generate the actual React component code
    // For now, returning a template string
    return `
import { ${components.map(c => c.name).join(', ')} } from "@/components/magicui";
import { Button } from "@/components/ui/button";
import cvData from "./cv-data.json";

export default function Portfolio() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with larger text */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-6xl mx-auto">
          <h1 className="text-[${textSizes.hero}] font-bold mb-6">
            {cvData.hero.fullName}
          </h1>
          <p className="text-[${textSizes.body}] text-gray-600 mb-8">
            {cvData.hero.summaryTagline}
          </p>
        </div>
      </section>
      
      {/* Additional sections with proper text sizing */}
    </main>
  );
}`;
  }
}