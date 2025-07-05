"use client";

import { useCVData } from '@/contexts/CVContext';
import type { WobbleCardProps } from '@/component-library/components/ui/wobble-card';

export interface WobbleCardAdapterData {
  skillsCards: Array<Partial<WobbleCardProps> & { content: { title: string; description: string } }>;
  experienceCards: Array<Partial<WobbleCardProps> & { content: { title: string; description: string; duration?: string } }>;
  projectCards: Array<Partial<WobbleCardProps> & { content: { title: string; description: string; tech?: string[] } }>;
  summaryCard: Partial<WobbleCardProps> & { content: { title: string; description: string } };
}

export function useWobbleCardAdapter(): WobbleCardAdapterData {
  const { cvData } = useCVData();

  // Skills as wobble cards - categorized by proficiency
  const skillsCards = cvData?.skills?.slice(0, 6).map((skill, index) => {
    const proficiencyLevel = skill.proficiency || 0;
    let bgColor = 'bg-indigo-800';
    
    if (proficiencyLevel >= 90) {
      bgColor = 'bg-gradient-to-br from-purple-800 to-pink-800';
    } else if (proficiencyLevel >= 70) {
      bgColor = 'bg-gradient-to-br from-blue-800 to-indigo-900';
    } else if (proficiencyLevel >= 50) {
      bgColor = 'bg-gradient-to-br from-green-800 to-teal-900';
    }

    return {
      containerClassName: `${bgColor} min-h-[200px]`,
      className: '',
      content: {
        title: skill.name,
        description: skill.category || `${proficiencyLevel}% proficiency`
      }
    };
  }) || [];

  // Experience as wobble cards
  const experienceCards = cvData?.workExperience?.slice(0, 4).map((job, index) => {
    const colors = [
      'bg-gradient-to-br from-orange-800 to-red-900',
      'bg-gradient-to-br from-cyan-800 to-blue-900',
      'bg-gradient-to-br from-emerald-800 to-green-900',
      'bg-gradient-to-br from-violet-800 to-purple-900'
    ];

    return {
      containerClassName: `${colors[index % colors.length]} min-h-[250px]`,
      className: '',
      content: {
        title: job.position,
        description: job.company,
        duration: `${job.startDate} - ${job.endDate || 'Present'}`
      }
    };
  }) || [];

  // Projects as wobble cards
  const projectCards = cvData?.projects?.slice(0, 3).map((project, index) => {
    const colors = [
      'bg-gradient-to-br from-zinc-800 to-zinc-900',
      'bg-gradient-to-br from-slate-800 to-slate-900',
      'bg-gradient-to-br from-stone-800 to-stone-900'
    ];

    return {
      containerClassName: `${colors[index % colors.length]} min-h-[300px]`,
      className: '',
      content: {
        title: project.name,
        description: project.description || 'Project description',
        tech: project.technologies?.slice(0, 3)
      }
    };
  }) || [];

  // Summary card based on personal info
  const summaryCard = {
    containerClassName: 'bg-gradient-to-br from-blue-900 to-purple-900 min-h-[300px]',
    className: '',
    content: {
      title: cvData?.personalInfo?.title || 'Professional Title',
      description: cvData?.personalInfo?.summary || 'Professional summary goes here.'
    }
  };

  return {
    skillsCards,
    experienceCards,
    projectCards,
    summaryCard
  };
}

// Helper function to create feature cards from CV data
export function createFeatureCards(cvData: any): Array<{
  containerClassName: string;
  icon?: string;
  title: string;
  description: string;
}> {
  const features = [];

  // Add skills count feature
  if (cvData?.skills?.length) {
    features.push({
      containerClassName: 'bg-gradient-to-br from-blue-800 to-indigo-900 min-h-[250px]',
      icon: '🎯',
      title: `${cvData.skills.length}+ Skills`,
      description: 'Diverse technical skill set across multiple domains'
    });
  }

  // Add experience feature
  if (cvData?.workExperience?.length) {
    const totalYears = calculateTotalExperience(cvData.workExperience);
    features.push({
      containerClassName: 'bg-gradient-to-br from-green-800 to-emerald-900 min-h-[250px]',
      icon: '💼',
      title: `${totalYears}+ Years Experience`,
      description: 'Professional experience across various industries'
    });
  }

  // Add projects feature
  if (cvData?.projects?.length) {
    features.push({
      containerClassName: 'bg-gradient-to-br from-purple-800 to-pink-900 min-h-[250px]',
      icon: '🚀',
      title: `${cvData.projects.length} Projects`,
      description: 'Successfully completed projects showcasing expertise'
    });
  }

  return features;
}

// Helper to calculate total years of experience
function calculateTotalExperience(workExperience: any[]): number {
  let totalMonths = 0;
  
  workExperience.forEach(job => {
    if (job.startDate) {
      const start = new Date(job.startDate);
      const end = job.endDate ? new Date(job.endDate) : new Date();
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                     (end.getMonth() - start.getMonth());
      totalMonths += months;
    }
  });
  
  return Math.round(totalMonths / 12);
}