"use client";

import { portfolioData } from '@/lib/portfolio-data';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip/animated-tooltip-base';
import { BackgroundGradient } from '@/components/ui/background-gradient/background-gradient-base';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid/bento-grid-base';
import { CardStack } from '@/components/ui/card-stack/card-stack';
import { FloatingDock } from '@/components/ui/floating-dock/floating-dock-base';
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
  const contactData = portfolioData.contact || {};

  // Map skills to BentoGrid format
  const skillItems = skillsData.items?.map((skill: any, i: number) => ({
    title: skill.title,
    description: skill.description,
    header: skill.headerGradient ? (() => (
      <div className={`flex flex-1 w-full h-full min-h-[6rem] rounded-xl ${skill.headerGradient}`}></div>
    ))() : (() => (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
    ))(),
    className: skill.className || ""
  })) || [];

  // Map contact items with icons
  const dockItems = contactData.items?.map((item: any) => ({
    title: item.title,
    icon: item.icon === 'email' ? IconMail : 
          item.icon === 'phone' ? IconUser : 
          IconHome,
    href: item.link
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

      {/* Summary Section */}
      {(summaryData.words || summaryData.text || summaryData.content) && (
        <section id="summary" className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <TextGenerateEffect words={summaryData.words || 'Lanford Jaden'} className="text-center" />
          </div>
        </section>
      )}

      {/* Experience Section */}
      {(experienceData.items?.length > 0 || experienceData.cards?.length > 0 || experienceData.entries?.length > 0 || experienceData.people?.length > 0 || experienceData.testimonials?.length > 0) && (
        <section id="experience" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Experience</h2>
            <CardStack 
              items={experienceData.cards || experienceData.items || []}
              {...experienceData}
            />
          </div>
        </section>
      )}

      {/* Education Section */}
      {(educationData.items?.length > 0 || educationData.cards?.length > 0 || educationData.entries?.length > 0 || educationData.people?.length > 0 || educationData.testimonials?.length > 0) && (
        <section id="education" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Education</h2>
            <CardStack 
              items={educationData.cards || educationData.items || []}
              {...educationData}
            />
          </div>
        </section>
      )}

      {/* Skills Grid */}
      {(skillsData.items && skillsData.items.length >= 3) ? (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Skills</h2>
            <BentoGrid className="max-w-5xl mx-auto">
              {skillsData.items.map((item: any, i: number) => (
                <BentoGridItem
                  key={i}
                  title={item.title}
                  description={item.description}
                  header={(() => {
                    const gradientClass = item.headerGradient || item.header?.className || 
                      "flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100";
                    return <div className={gradientClass}></div>;
                  })()}
                  className={item.className || ""}
                  icon={item.icon}
                />
              ))}
            </BentoGrid>
          </div>
        </section>
      ) : (<section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Skills</h2>
            <div className={skillsData.className || "grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto w-full"}>
              {skillsData.cards?.map((card: any, i: number) => (
                <div key={i} className={card.containerClassName || "col-span-1 min-h-[6rem]"}>
                  <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-gray-300">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Languages Section */}
      {(languagesData.items?.length > 0 || languagesData.cards?.length > 0 || languagesData.entries?.length > 0 || languagesData.people?.length > 0 || languagesData.testimonials?.length > 0) && (
        <section id="languages" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Languages</h2>
            <AnimatedTooltip 
              items={languagesData.cards || languagesData.items || []}
              {...languagesData}
            />
          </div>
        </section>
      )}

      {/* Contact Navigation */}
      {contactData.items && contactData.items.length > 0 && (
        <FloatingDock 
          items={contactData.items}
          desktopClassName={contactData.className || "fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50"}
          mobileClassName="fixed bottom-5 right-5 z-50"
        />
      )}
    </main>
  );
}