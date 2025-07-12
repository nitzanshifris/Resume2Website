"use client";

import { useCVData } from '@/contexts/CVContext';
import type { VortexProps } from '@/component-library/components/ui/vortex';

export interface VortexAdapterData {
  heroVortex: Partial<VortexProps>;
  skillsVortex: Partial<VortexProps>;
  experienceVortex: Partial<VortexProps>;
  portfolioVortex: Partial<VortexProps>;
}

export function useVortexAdapter(): VortexAdapterData {
  const { cvData } = useCVData();

  // Hero section vortex - professional blue theme
  const heroVortex: Partial<VortexProps> = {
    backgroundColor: "black",
    baseHue: 220, // Blue
    particleCount: 600,
    rangeY: 150,
    baseSpeed: 0.2,
    rangeSpeed: 1.2,
    className: "flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
  };

  // Skills section vortex - dynamic based on skill count
  const skillsVortex: Partial<VortexProps> = {
    backgroundColor: "black",
    baseHue: cvData?.skills && cvData.skills.length > 5 ? 280 : 120, // Purple for many skills, green for few
    particleCount: Math.min(800, 300 + (cvData?.skills?.length || 0) * 20),
    rangeY: 120,
    baseSpeed: 0.3,
    rangeSpeed: 1.8,
    className: "flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
  };

  // Experience section vortex - orange/red theme for energy
  const experienceVortex: Partial<VortexProps> = {
    backgroundColor: "black",
    baseHue: cvData?.workExperience && cvData.workExperience.length > 3 ? 15 : 30, // Red-orange for extensive experience
    particleCount: Math.min(700, 400 + (cvData?.workExperience?.length || 0) * 50),
    rangeY: 180,
    baseSpeed: 0.1,
    rangeSpeed: 1.5,
    className: "flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
  };

  // Portfolio section vortex - creative purple/pink theme
  const portfolioVortex: Partial<VortexProps> = {
    backgroundColor: "black",
    baseHue: 300, // Purple-pink
    particleCount: cvData?.projects && cvData.projects.length > 0 ? 750 : 500,
    rangeY: 200,
    baseSpeed: 0.4,
    rangeSpeed: 2.0,
    baseRadius: 1.5,
    rangeRadius: 3,
    className: "flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
  };

  return {
    heroVortex,
    skillsVortex,
    experienceVortex,
    portfolioVortex
  };
}

// Helper function to create themed vortex based on CV section
export function useThemedVortex(section: 'hero' | 'skills' | 'experience' | 'portfolio'): Partial<VortexProps> {
  const { heroVortex, skillsVortex, experienceVortex, portfolioVortex } = useVortexAdapter();
  
  switch (section) {
    case 'hero':
      return heroVortex;
    case 'skills':
      return skillsVortex;
    case 'experience':
      return experienceVortex;
    case 'portfolio':
      return portfolioVortex;
    default:
      return heroVortex;
  }
}