"use client";

import { portfolioData } from '@/lib/portfolio-data';
import { AnimatedTooltip  } from '@/components/ui/animated-tooltip/animated-tooltip-base';
import { BackgroundGradient } from '@/components/ui/background-gradient/background-gradient-base';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid/bento-grid-base';
import { CardStack } from '@/components/ui/card-stack/card-stack';
import { HoverEffect  } from '@/components/ui/card-hover-effect/card-hover-effect-v2';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect/text-generate-effect-base';
import { HeroContent } from '@/components/ui/hero-content';
import { cn } from '@/lib/utils';
import { IconHome, IconUser, IconMail } from '@tabler/icons-react';

export default function Portfolio() {
  // Extract data for each section
  const heroData = portfolioData.hero || {};
  const summaryData = portfolioData.summary || {};
  const experienceData = portfolioData.experience || {};
  const educationData = portfolioData.education || {};
  const skillsData = portfolioData.skills || {};
  const languagesData = portfolioData.languages || {};

  // Map skills to BentoGrid format
  const skillItems = skillsData.items?.map((skill: any, i: number) => ({
    title: skill.title,
    description: skill.description,
    header: (() => (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
    ))(),
    className: i === 3 || i === 6 ? "md:col-span-2" : ""
  })) || [];


  return (
    <main className="relative min-h-screen bg-black">
<section id="hero" className="min-h-screen flex items-center justify-center relative">
        <BackgroundGradient className="absolute inset-0" />
        <div className="relative z-10 text-center max-w-4xl mx-auto p-8">
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-4">
            {heroData.title || 'Lanford Jaden'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            {heroData.subtitle || 'Full Stack Developer'}
          </p>
          {heroData.description && (
            <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
              {heroData.description}
            </p>
          )}
        </div>
      </section>
<section id="summary" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <TextGenerateEffect words={summaryData.words || 'Lanford Jaden'} className="text-center" />
        </div>
      </section>
<section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Experience</h2>
          <HoverEffect items={experienceData.cards || experienceData.items || []} />
        </div>
      </section>
<section id="education" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Education</h2>
          <CardStack 
            items={educationData.items || []}
            {...educationData}
          />
        </div>
      </section>
<section id="languages" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Languages</h2>
          <AnimatedTooltip 
            items={languagesData.items || []}
            {...languagesData}
          />
        </div>
      </section>
    </main>
  );
}