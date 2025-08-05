// Portfolio Generator with Design Rules Enforcement
import { CVData, PortfolioStyle, PortfolioConfig } from '../types/portfolio.types';
import { DESIGN_RULES, THEME_PRESETS } from '../config/design-rules';
import { MCPWrapper } from './mcp-wrapper';

export class PortfolioGenerator {
  private mcpWrapper: MCPWrapper;
  
  constructor() {
    this.mcpWrapper = new MCPWrapper();
  }
  
  async generatePortfolio(cvData: CVData, config: PortfolioConfig): Promise<string> {
    const theme = THEME_PRESETS[config.style] || THEME_PRESETS.professional;
    const sections = this.generateSections(cvData, theme, config);
    
    return `
"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import cvDataJson from "../cv-data.json";

export default function Portfolio() {
  return (
    <main className="min-h-screen">
      ${sections.join('\n      ')}
    </main>
  );
}`;
  }
  
  private generateSections(cvData: CVData, theme: any, config: PortfolioConfig): string[] {
    const sections: string[] = [];
    const backgrounds = theme.backgrounds;
    let bgIndex = 0;
    
    // Hero Section - Always high contrast
    sections.push(`
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 ${backgrounds[bgIndex % backgrounds.length]}">
        <div className="max-w-6xl mx-auto text-center">
          <BlurFade delay={0.25} inView>
            <h1 className="${DESIGN_RULES.textSizes.hero} font-bold mb-8 ${theme.textColors[0]}">
              ${cvData.hero.fullName}
            </h1>
          </BlurFade>
          <BlurFade delay={0.5} inView>
            <p className="${DESIGN_RULES.textSizes.body} mb-12 ${theme.textColors[1]}">
              ${cvData.hero.summaryTagline}
            </p>
          </BlurFade>
          <BlurFade delay={0.75} inView>
            <Button size="lg" className="${theme.accentColors[0]} text-white">
              Get In Touch
            </Button>
          </BlurFade>
        </div>
      </section>`);
    
    bgIndex++;
    
    // Experience Section - Alternating background
    sections.push(`
      {/* Experience Section */}
      <section className="py-32 px-4 ${backgrounds[bgIndex % backgrounds.length]}">
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className="${DESIGN_RULES.textSizes.sectionTitle} font-bold text-center mb-16 ${theme.textColors[0]}">
              Experience
            </h2>
          </BlurFade>
          <div className="space-y-8">
            {cvDataJson.experience.experienceItems.map((exp, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-lg p-8 shadow-lg">
                  <h3 className="text-2xl font-semibold mb-2 ${theme.textColors[0]}">{exp.jobTitle}</h3>
                  <p className="text-xl mb-4 ${theme.accentColors[1]}">{exp.companyName}</p>
                  <ul className="space-y-2">
                    {exp.responsibilitiesAndAchievements?.map((item, i) => (
                      <li key={i} className="${DESIGN_RULES.textSizes.body} ${theme.textColors[1]}">• {item}</li>
                    ))}
                  </ul>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>`);
    
    bgIndex++;
    
    // Skills Section - Consistent theming
    sections.push(`
      {/* Skills Section */}
      <section className="py-32 px-4 ${backgrounds[bgIndex % backgrounds.length]}">
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className="${DESIGN_RULES.textSizes.sectionTitle} font-bold text-center mb-16 ${theme.textColors[0]}">
              Skills & Expertise
            </h2>
          </BlurFade>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cvDataJson.skills.skillCategories.map((category, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-4 ${theme.textColors[0]}">{category.categoryName}</h3>
                  <div className="flex flex-wrap gap-3">
                    {category.skills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 rounded-full ${theme.textColors[0]} border-2 ${theme.accentColors[0].replace('bg-', 'border-').replace('hover:bg-', '')} text-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>`);
    
    return sections;
  }
}