
"use client";

import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BackgroundGradient } from "@/components/magicui/background-gradient";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import cvDataJson from "../cv-data.json";
import { Mail, Phone, MapPin, GraduationCap, Briefcase, Award, Code, Wrench } from "lucide-react";

export default function Portfolio() {
  const getIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'technical skills':
        return <Code className="h-5 w-5" />;
      case 'tools & technologies':
        return <Wrench className="h-5 w-5" />;
      case 'certifications':
        return <Award className="h-5 w-5" />;
      default:
        return <Briefcase className="h-5 w-5" />;
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-emerald-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-purple-500/20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <BlurFade delay={0.25} inView>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white">
              {cvDataJson.hero.fullName}
            </h1>
          </BlurFade>
          <BlurFade delay={0.5} inView>
            {cvDataJson.hero.title && (
              <p className="text-2xl md:text-3xl mb-4 text-[var(--color-primary)]">
                {cvDataJson.hero.title}
              </p>
            )}
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto">
              {cvDataJson.hero.summaryTagline}
            </p>
          </BlurFade>
          <BlurFade delay={0.75} inView>
            <Button size="lg" className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white text-xl px-8 py-6">
              Get In Touch
            </Button>
          </BlurFade>
        </div>
      </section>
      
      {/* Experience Section */}
      <section className="py-24 px-4 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            Experience
          </h2>
          <div className="space-y-6">
            {cvDataJson.experience.experienceItems.map((exp, idx) => (
              <BlurFade key={idx} delay={0.1 * idx} inView>
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">
                        {exp.jobTitle}
                      </h3>
                      <p className="text-lg text-[var(--color-primary)]">
                        {exp.companyName}
                      </p>
                    </div>
                    <span className="text-sm text-gray-300">
                      {exp.dateRange?.startDate} - {exp.dateRange?.endDate || 'Present'}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.responsibilitiesAndAchievements?.map((item, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start">
                        <span className="text-[var(--color-secondary)] mr-2">▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section className="py-24 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            Skills & Expertise
          </h2>
          
          <div className="space-y-8">
            {cvDataJson.skills.skillCategories.map((category, idx) => (
              <BlurFade key={idx} delay={0.1 * idx} inView>
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-6 text-[var(--color-primary)]">
                    {category.categoryName}
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {category.skills.map((skill, i) => (
                      <span key={i} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      {/* Education Section */}
      <section className="py-24 px-4 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cvDataJson.education.educationItems.map((edu, idx) => (
              <BlurFade key={idx} delay={0.1 * idx} inView>
                <div className="text-center p-6 rounded-lg bg-gray-800 shadow-lg">
                  <GraduationCap className="mx-auto mb-4 h-12 w-12 text-[var(--color-primary)]" />
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {edu.degree}
                  </h3>
                  <p className="text-lg mb-2 text-[var(--color-secondary)]">
                    {edu.institution}
                  </p>
                  <p className="text-sm text-gray-300">
                    {edu.dateRange?.startDate} - {edu.dateRange?.endDate || 'Present'}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-emerald-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-white">
            Let's Connect
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            {cvDataJson.contact.email && (
              <div className="flex items-center gap-2 text-lg text-gray-300">
                <Mail className="h-5 w-5 text-[var(--color-primary)]" />
                {cvDataJson.contact.email}
              </div>
            )}
          </div>
          <Button size="lg" className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white text-xl px-10 py-6">
            <Mail className="mr-2 h-5 w-5" />
            Contact Me
          </Button>
        </div>
      </section>
    </main>
  );
}
