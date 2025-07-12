"use client";

import { useCVData } from '@/contexts/CVContext';
import type { WavyBackgroundProps } from '@/component-library/components/ui/wavy-background';

export interface WavyBackgroundAdapterData {
  heroWaves: Partial<WavyBackgroundProps>;
  skillsWaves: Partial<WavyBackgroundProps>;
  experienceWaves: Partial<WavyBackgroundProps>;
  portfolioWaves: Partial<WavyBackgroundProps>;
  aboutWaves: Partial<WavyBackgroundProps>;
}

export function useWavyBackgroundAdapter(): WavyBackgroundAdapterData {
  const { cvData } = useCVData();

  // Hero section waves - professional blue theme
  const heroWaves: Partial<WavyBackgroundProps> = {
    colors: ["#38bdf8", "#0ea5e9", "#0284c7", "#0369a1", "#075985"],
    waveWidth: 60,
    backgroundFill: "black",
    blur: 12,
    speed: "fast",
    waveOpacity: 0.6,
    className: "max-w-4xl mx-auto pb-40"
  };

  // Skills section waves - dynamic based on skill count and categories
  const skillsWaves: Partial<WavyBackgroundProps> = {
    colors: cvData?.skills && cvData.skills.length > 10 
      ? ["#8b5cf6", "#a855f7", "#c084fc", "#d946ef", "#e879f9"] // Purple for many skills
      : ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"], // Green for fewer skills
    waveWidth: Math.min(80, 30 + (cvData?.skills?.length || 0) * 2),
    backgroundFill: "#0a0a0a",
    blur: 15,
    speed: cvData?.skills && cvData.skills.length > 8 ? "fast" : "slow",
    waveOpacity: 0.7,
    className: "max-w-5xl mx-auto pb-40"
  };

  // Experience section waves - warm colors based on experience level
  const experienceWaves: Partial<WavyBackgroundProps> = {
    colors: cvData?.workExperience && cvData.workExperience.length > 5
      ? ["#f59e0b", "#f97316", "#ea580c", "#dc2626", "#b91c1c"] // Orange-red for senior
      : ["#fbbf24", "#f59e0b", "#d97706", "#b45309", "#92400e"], // Yellow-orange for mid-level
    waveWidth: Math.min(70, 40 + (cvData?.workExperience?.length || 0) * 3),
    backgroundFill: "#1a0b00",
    blur: 10,
    speed: "slow",
    waveOpacity: 0.8,
    className: "max-w-6xl mx-auto pb-40"
  };

  // Portfolio section waves - creative and vibrant
  const portfolioWaves: Partial<WavyBackgroundProps> = {
    colors: ["#ec4899", "#f472b6", "#fb7185", "#fda4af", "#fecaca"],
    waveWidth: cvData?.projects && cvData.projects.length > 0 ? 55 : 45,
    backgroundFill: "#1a051a",
    blur: 8,
    speed: "fast",
    waveOpacity: 0.9,
    className: "max-w-4xl mx-auto pb-40"
  };

  // About section waves - calm and professional
  const aboutWaves: Partial<WavyBackgroundProps> = {
    colors: ["#6366f1", "#8b5cf6", "#a855f7", "#c084fc", "#e879f9"],
    waveWidth: 50,
    backgroundFill: "#0f0b1a",
    blur: 20,
    speed: "slow",
    waveOpacity: 0.5,
    className: "max-w-3xl mx-auto pb-40"
  };

  return {
    heroWaves,
    skillsWaves,
    experienceWaves,
    portfolioWaves,
    aboutWaves
  };
}

// Helper function to create themed waves based on CV section
export function useThemedWaves(section: 'hero' | 'skills' | 'experience' | 'portfolio' | 'about'): Partial<WavyBackgroundProps> {
  const { heroWaves, skillsWaves, experienceWaves, portfolioWaves, aboutWaves } = useWavyBackgroundAdapter();
  
  switch (section) {
    case 'hero':
      return heroWaves;
    case 'skills':
      return skillsWaves;
    case 'experience':
      return experienceWaves;
    case 'portfolio':
      return portfolioWaves;
    case 'about':
      return aboutWaves;
    default:
      return heroWaves;
  }
}

// Helper function to get theme colors based on profession or industry
export function getProfessionWaveColors(profession?: string): string[] {
  if (!profession) return ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"];
  
  const professionLower = profession.toLowerCase();
  
  if (professionLower.includes('developer') || professionLower.includes('engineer')) {
    return ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"]; // Green tech theme
  }
  
  if (professionLower.includes('designer') || professionLower.includes('creative')) {
    return ["#ec4899", "#f472b6", "#fb7185", "#fda4af", "#fecaca"]; // Pink creative theme
  }
  
  if (professionLower.includes('manager') || professionLower.includes('lead')) {
    return ["#f59e0b", "#f97316", "#ea580c", "#dc2626", "#b91c1c"]; // Orange leadership theme
  }
  
  if (professionLower.includes('analyst') || professionLower.includes('data')) {
    return ["#6366f1", "#8b5cf6", "#a855f7", "#c084fc", "#e879f9"]; // Purple analytical theme
  }
  
  // Default professional blue
  return ["#38bdf8", "#0ea5e9", "#0284c7", "#0369a1", "#075985"];
}