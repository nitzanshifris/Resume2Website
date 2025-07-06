
"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import cvDataJson from "../cv-data.json";
import { Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Star, ArrowRight } from "lucide-react";

export default function Portfolio() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - High Contrast */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-white">
        
        <div className="max-w-6xl mx-auto text-center">
          <BlurFade delay={0.25} inView>
            <h1 className="text-7xl md:text-9xl font-bold mb-8 text-gray-900">
              {cvDataJson.hero.fullName}
            </h1>
          </BlurFade>
          <BlurFade delay={0.5} inView>
            <p className="text-3xl md:text-5xl mb-12 text-gray-700">
              {cvDataJson.hero.summaryTagline}
            </p>
          </BlurFade>
        </div>
      </section>
      
      {/* Experience Section - Alternating Background */}
      <section className="py-32 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-gray-900">
              Experience
            </h2>
          </BlurFade>
          <div className="mt-12 space-y-8">
            {cvDataJson.experience.experienceItems.map((exp, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-lg p-8 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">{exp.jobTitle}</h3>
                      <p className="text-xl md:text-2xl bg-gray-900 hover:bg-gray-800">{exp.companyName}</p>
                    </div>
                    <span className="text-lg text-gray-700">
                      {exp.dateRange.startDate} - {exp.dateRange.endDate}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.responsibilitiesAndAchievements?.map((item, i) => (
                      <li key={i} className="text-lg md:text-xl text-gray-700">• {item}</li>
                    ))}
                  </ul>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      {/* Skills Section - Original Background */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-gray-900">
              Skills & Expertise
            </h2>
          </BlurFade>
          <div className="mt-20 space-y-16">
            {cvDataJson.skills.skillCategories.map((category, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 border-b-2 border-gray-900 hover:border-gray-800 pb-4">{category.categoryName}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.skills.map((skill, i) => (
                      <div key={i} className="text-2xl md:text-3xl text-gray-700 py-2">
                        • {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      {/* Education Section - Alternating Background */}
      <section className="py-32 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-gray-900">
              Education
            </h2>
          </BlurFade>
          <div className="mt-12 space-y-8">
            {cvDataJson.education.educationItems.map((edu, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div className="text-center">
                  <GraduationCap className="mx-auto mb-6 h-12 w-12 text-gray-900" />
                  <h3 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-900">{edu.degree}</h3>
                  <p className="text-xl md:text-2xl mb-2 text-gray-700">{edu.institution}</p>
                  <p className="text-lg text-gray-700">
                    {edu.dateRange.startDate} - {edu.dateRange.endDate}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section - Original Background */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-gray-900">
              Let's Connect
            </h2>
          </BlurFade>
          <BlurFade delay={0.5} inView>
            <p className="text-xl md:text-2xl mb-12 text-gray-700">
              Ready to bring value to your organization
            </p>
          </BlurFade>
          <BlurFade delay={0.75} inView>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="flex items-center gap-2 text-lg md:text-xl text-gray-900">
                <Mail className="h-6 w-6" />
                {cvDataJson.contact.email}
              </div>
              <div className="flex items-center gap-2 text-lg md:text-xl text-gray-900">
                <Phone className="h-6 w-6" />
                {cvDataJson.contact.phone}
              </div>
              <div className="flex items-center gap-2 text-lg md:text-xl text-gray-900">
                <MapPin className="h-6 w-6" />
                {cvDataJson.contact.location.city}, {cvDataJson.contact.location.state}
              </div>
            </div>
          </BlurFade>
          <BlurFade delay={1} inView>
            <div className="mt-12 flex gap-6 justify-center">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white text-xl px-8 py-6">
                <Mail className="mr-2 h-5 w-5" />
                Email Me
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-gray-900 hover:border-gray-800 text-gray-900 hover:bg-gray-100 text-xl px-8 py-6">
                Download CV
              </Button>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}