
"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { DotPattern } from "@/components/magicui/dot-pattern";import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { Button } from "@/components/ui/button";
import cvDataJson from "../cv-data.json";
import { Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Star, ArrowRight, Code, Palette, TrendingUp, Users } from "lucide-react";

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-950">
      
      {/* Hero Section - Tech Innovative */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-gray-900 to-blue-950 overflow-hidden">
        <DotPattern className="opacity-40 [mask-image:radial-gradient(400px_circle_at_center,white,transparent)]" />
        
        {/* Matrix rain effect background */}
        <div className="absolute inset-0 opacity-10">
          <div className="matrix-rain" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <BlurFade delay={0.25} inView>
            <div className="inline-block mb-8">
              <div className="text-sm uppercase tracking-wider text-green-400 mb-4 animate-pulse">
                &lt;DEVELOPER /&gt;
              </div>
              <h1 className="text-7xl md:text-9xl font-mono font-bold mb-2 text-white glitch" data-text="{cvDataJson.hero.fullName}">
                {cvDataJson.hero.fullName}
              </h1>
            </div>
          </BlurFade>
          
          <BlurFade delay={0.5} inView>
            <p className="text-3xl md:text-5xl mb-12 text-gray-400 max-w-4xl mx-auto font-light">
              {cvDataJson.hero.summaryTagline}
            </p>
          </BlurFade>
          
          <BlurFade delay={0.75} inView>
            <div className="flex gap-6 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-8 py-6">
                <Code className="mr-2 h-5 w-5" />
                View Projects
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900 text-xl px-8 py-6">
                <TrendingUp className="mr-2 h-5 w-5" />
                Analytics
              </Button>
            </div>
          </BlurFade>
        </div>
      </section>
      
      
      {/* Experience Section */}
      <section className="py-24 md:py-32 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white">
              Experience
            </h2>
          </BlurFade>
          
          <div className="space-y-8">
            {cvDataJson.experience.experienceItems.map((exp, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div className="bg-white/5 backdrop-blur rounded-lg p-8 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-semibold text-white">
                        {exp.jobTitle}
                      </h3>
                      <p className="text-xl md:text-2xl text-blue-400">
                        {exp.companyName}
                      </p>
                    </div>
                    <span className="text-lg md:text-xl text-gray-400">
                      {exp.dateRange.startDate} - {exp.dateRange.endDate}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.responsibilitiesAndAchievements?.map((item, i) => (
                      <li key={i} className="text-xl md:text-2xl text-gray-400">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      
      {/* Skills Section - Tech Style */}
      <section className="py-24 md:py-32 px-4 bg-gray-800 relative">
        <DotPattern className="opacity-40 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-mono font-bold text-center mb-20 text-white">
              &lt;Skills /&gt;
            </h2>
          </BlurFade>
          
          <div className="space-y-12">
            {cvDataJson.skills.skillCategories.map((category, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div className="border border-gray-700 rounded-lg p-8 bg-gray-900/50 backdrop-blur">
                  <h3 className="text-3xl md:text-4xl font-mono mb-6 text-blue-400">
                    // {category.categoryName}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {category.skills.map((skill, i) => (
                      <div key={i} className="bg-gray-800 rounded px-4 py-2 text-center">
                        <span className="text-lg md:text-xl text-gray-400 font-mono">
                          {skill}
                        </span>
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
      <section className="py-24 md:py-32 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white">
              Education
            </h2>
          </BlurFade>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cvDataJson.education.educationItems.map((edu, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div className="text-center p-8 rounded-lg bg-white/5 backdrop-blur">
                  <GraduationCap className="mx-auto mb-6 h-12 w-12 text-blue-400" />
                  <h3 className="text-3xl md:text-4xl font-semibold mb-2 text-white">
                    {edu.degree}
                  </h3>
                  <p className="text-xl md:text-2xl mb-2 text-gray-400">
                    {edu.institution}
                  </p>
                  <p className="text-lg md:text-xl text-gray-400">
                    {edu.dateRange.startDate} - {edu.dateRange.endDate}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      
      {/* Contact Section */}
      <section className="py-24 md:py-32 px-4 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white">
              Let's Connect
            </h2>
          </BlurFade>
          
          <BlurFade delay={0.5} inView>
            <p className="text-xl md:text-2xl mb-12 text-gray-400">
              Ready to bring value to your organization
            </p>
          </BlurFade>
          
          <BlurFade delay={0.75} inView>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <div className="flex items-center gap-2 text-xl md:text-2xl text-white">
                <Mail className="h-6 w-6" />
                {cvDataJson.contact.email}
              </div>
              <div className="flex items-center gap-2 text-xl md:text-2xl text-white">
                <Phone className="h-6 w-6" />
                {cvDataJson.contact.phone}
              </div>
              <div className="flex items-center gap-2 text-xl md:text-2xl text-white">
                <MapPin className="h-6 w-6" />
                {cvDataJson.contact.location.city}, {cvDataJson.contact.location.state}
              </div>
            </div>
          </BlurFade>
          
          <BlurFade delay={1} inView>
            <div className="flex gap-6 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-8 py-6">
                <Mail className="mr-2 h-5 w-5" />
                Email Me
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900 text-xl px-8 py-6">
                Download CV
              </Button>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
