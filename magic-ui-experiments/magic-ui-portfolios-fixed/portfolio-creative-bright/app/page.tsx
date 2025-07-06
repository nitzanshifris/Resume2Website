
"use client";

import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Rainbow } from "@/components/magicui/rainbow";
import { SparklesCore } from "@/components/magicui/sparkles";
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
      <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-orange-50 to-pink-50 relative overflow-hidden">
        <SparklesCore className="absolute inset-0" particleColor="#f97316" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <BlurFade delay={0.25} inView>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-pulse text-gray-900">
              {cvDataJson.hero.fullName}
            </h1>
          </BlurFade>
          <BlurFade delay={0.5} inView>
            {cvDataJson.hero.title && (
              <p className="text-2xl md:text-3xl mb-4 text-[var(--color-primary)]">
                {cvDataJson.hero.title}
              </p>
            )}
            <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-3xl mx-auto">
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
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
            Experience
          </h2>
          <div className="space-y-6">
            {cvDataJson.experience.experienceItems.map((exp, idx) => (
              <BlurFade key={idx} delay={0.1 * idx} inView>
                <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">
                        {exp.jobTitle}
                      </h3>
                      <p className="text-lg text-[var(--color-primary)]">
                        {exp.companyName}
                      </p>
                    </div>
                    <span className="text-sm text-gray-600">
                      {exp.dateRange?.startDate} - {exp.dateRange?.endDate || 'Present'}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.responsibilitiesAndAchievements?.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start">
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
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
            Skills & Expertise
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cvDataJson.skills.skillCategories.map((category, idx) => (
              <BlurFade key={idx} delay={0.1 * idx} inView>
                <div className="p-8 rounded-xl shadow-xl bg-white hover:shadow-2xl transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-full bg-[var(--color-primary)] text-white">
                      {getIcon(category.categoryName)}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {category.categoryName}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {category.skills.map((skill, i) => (
                      <div key={i} className="text-gray-700 font-medium">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      {/* Education Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
            Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cvDataJson.education.educationItems.map((edu, idx) => (
              <BlurFade key={idx} delay={0.1 * idx} inView>
                <div className="text-center p-6 rounded-lg bg-white shadow-lg">
                  <GraduationCap className="mx-auto mb-4 h-12 w-12 text-[var(--color-primary)]" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {edu.degree}
                  </h3>
                  <p className="text-lg mb-2 text-[var(--color-secondary)]">
                    {edu.institution}
                  </p>
                  <p className="text-sm text-gray-600">
                    {edu.dateRange?.startDate} - {edu.dateRange?.endDate || 'Present'}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-gray-900">
            Let's Connect
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            {cvDataJson.contact.email && (
              <div className="flex items-center gap-2 text-lg text-gray-600">
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
