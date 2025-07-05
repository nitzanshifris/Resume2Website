"use client";

import { useCVData } from '@/contexts/CVContext';
import type { Word } from '@/component-library/components/ui/typewriter-effect';

export interface TypewriterEffectData {
  heroWords: Word[];
  skillsWords: Word[];
  nameWords: Word[];
  roleWords: Word[];
  companyWords: Word[];
}

export function useTypewriterEffectAdapter(): TypewriterEffectData {
  const { cvData } = useCVData();

  // Create hero words from name and role
  const heroWords: Word[] = [];
  if (cvData?.personalInfo?.name) {
    const nameWords = cvData.personalInfo.name.split(' ');
    nameWords.forEach((word, index) => {
      heroWords.push({
        text: word,
        className: index === nameWords.length - 1 ? 'text-blue-500 dark:text-blue-500' : ''
      });
    });
  }

  // Create skills words
  const skillsWords: Word[] = [];
  if (cvData?.skills && cvData.skills.length > 0) {
    const topSkills = cvData.skills.slice(0, 5);
    topSkills.forEach((skill, index) => {
      skillsWords.push({
        text: skill.name,
        className: index === 0 || index === topSkills.length - 1 ? 'text-purple-500 dark:text-purple-500' : ''
      });
    });
  }

  // Create name words with styling
  const nameWords: Word[] = [];
  if (cvData?.personalInfo?.name) {
    const words = cvData.personalInfo.name.split(' ');
    words.forEach((word, index) => {
      nameWords.push({
        text: word,
        className: index === 0 ? 'text-blue-500 font-bold' : index === words.length - 1 ? 'text-purple-500 font-bold' : 'font-semibold'
      });
    });
  }

  // Create role words
  const roleWords: Word[] = [];
  if (cvData?.personalInfo?.title) {
    const words = cvData.personalInfo.title.split(' ');
    words.forEach((word, index) => {
      roleWords.push({
        text: word,
        className: index === words.length - 1 ? 'text-green-500 dark:text-green-500' : ''
      });
    });
  }

  // Create company words from work experience
  const companyWords: Word[] = [];
  if (cvData?.workExperience && cvData.workExperience.length > 0) {
    const currentJob = cvData.workExperience[0];
    if (currentJob.company) {
      const words = ['Currently', 'working', 'at', currentJob.company];
      words.forEach((word, index) => {
        companyWords.push({
          text: word,
          className: index === words.length - 1 ? 'text-blue-500 font-bold' : ''
        });
      });
    }
  }

  return {
    heroWords,
    skillsWords,
    nameWords,
    roleWords,
    companyWords
  };
}