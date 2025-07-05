// Generated Portfolio using Aceternity Components
// Place this file in: /aceternity/app/generated-portfolios/michelle-jewett.tsx

'use client';

import React from 'react';
import { HeroParallax } from '@/components/ui/hero-parallax';
import { Timeline } from '@/components/ui/timeline';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { ThreeDCard } from '@/components/ui/3d-card';
import { ContactForm } from '@/components/ui/contact-form';
import { BentoGrid } from '@/components/ui/bento-grid';

export default function MichelleJewettPortfolio() {
  // Hero data
  const heroProducts = [
    {
      title: "University Newspaper",
      link: "#",
      thumbnail: "/api/placeholder/400/300"
    },
    {
      title: "Marketing Projects",
      link: "#",
      thumbnail: "/api/placeholder/400/300"
    },
    {
      title: "Social Media Campaigns",
      link: "#",
      thumbnail: "/api/placeholder/400/300"
    }
  ];

  // Experience timeline data
  const experienceData = [
    {
      title: "2016-2019",
      content: (
        <div>
          <h3 className="text-xl font-bold mb-2">University News Paper Editor</h3>
          <p className="text-neutral-600 dark:text-neutral-400">Columbus State University</p>
          <ul className="mt-2 text-sm">
            <li>• Created three new websites for university faculties</li>
            <li>• Responsible for weekly editor's comments</li>
            <li>• Proofread and edit write-ups from staff members</li>
          </ul>
        </div>
      )
    }
  ];

  // Skills data
  const skillsData = [
    { quote: "HTML", name: "Technical", title: "Web Development" },
    { quote: "WordPress", name: "CMS", title: "Content Management" },
    { quote: "Project Management", name: "Leadership", title: "Management" },
    { quote: "Adobe Photoshop", name: "Design", title: "Creative Suite" },
    { quote: "Team Player", name: "Soft Skill", title: "Collaboration" },
    { quote: "Deadline Driven", name: "Work Style", title: "Time Management" }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Parallax */}
      <HeroParallax products={heroProducts} />
      
      {/* Experience Timeline */}
      <div className="container mx-auto px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Experience</h2>
        <Timeline data={experienceData} />
      </div>
      
      {/* Skills Section */}
      <div className="container mx-auto px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Skills</h2>
        <InfiniteMovingCards
          items={skillsData}
          direction="right"
          speed="slow"
        />
      </div>
    </div>
  );
}
