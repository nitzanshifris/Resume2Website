
"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { RetroGrid } from "@/components/magicui/retro-grid";import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";import { FlipText } from "@/components/magicui/flip-text";
import { Button } from "@/components/ui/button";
import cvDataJson from "../cv-data.json";
import { Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Star, ArrowRight, Code, Palette, TrendingUp, Users } from "lucide-react";

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-black">
      
      {/* Hero Section - Neon Cyberpunk */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        <RetroGrid className="opacity-30" />
        
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 animate-gradient" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <BlurFade delay={0.25} inView>
            <h1 className="text-7xl md:text-9xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse-slow">
              {cvDataJson.hero.fullName}
            </h1>
          </BlurFade>
          <BlurFade delay={0.5} inView>
            <p className="text-3xl md:text-5xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {cvDataJson.hero.summaryTagline}
            </p>
          </BlurFade>
          
          {/* Glowing buttons */}
          <BlurFade delay={0.75} inView>
            <div className="flex gap-6 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl px-8 py-6 shadow-lg shadow-purple-500/25">
                Get In Touch
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black text-xl px-8 py-6">
                View Work
              </Button>
            </div>
          </BlurFade>
        </div>
      </section>
      
      
      {/* Experience Section */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-br from-blue-950/20 to-cyan-950/20">
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
                      <p className="text-xl md:text-2xl text-cyan-400">
                        {exp.companyName}
                      </p>
                    </div>
                    <span className="text-lg md:text-xl text-gray-300">
                      {exp.dateRange.startDate} - {exp.dateRange.endDate}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.responsibilitiesAndAchievements?.map((item, i) => (
                      <li key={i} className="text-xl md:text-2xl text-gray-300">
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
      
      
      {/* Skills Section - Neon Style */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-br from-purple-950/20 to-pink-950/20">
        <div className="max-w-7xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Skills & Expertise
            </h2>
          </BlurFade>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cvDataJson.skills.skillCategories.map((category, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <NeonGradientCard className="p-8">
                  <h3 className="text-3xl md:text-4xl font-bold mb-6 text-cyan-400">
                    {category.categoryName}
                  </h3>
                  <div className="space-y-3">
                    {category.skills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse" />
                        <span className="text-xl md:text-2xl text-gray-300">
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                </NeonGradientCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      
      {/* Education Section */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-br from-purple-950/20 to-pink-950/20">
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
                  <GraduationCap className="mx-auto mb-6 h-12 w-12 text-cyan-400" />
                  <h3 className="text-3xl md:text-4xl font-semibold mb-2 text-white">
                    {edu.degree}
                  </h3>
                  <p className="text-xl md:text-2xl mb-2 text-gray-300">
                    {edu.institution}
                  </p>
                  <p className="text-lg md:text-xl text-gray-300">
                    {edu.dateRange.startDate} - {edu.dateRange.endDate}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      
      {/* Contact Section */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-br from-blue-950/20 to-cyan-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white">
              Let's Connect
            </h2>
          </BlurFade>
          
          <BlurFade delay={0.5} inView>
            <p className="text-xl md:text-2xl mb-12 text-gray-300">
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
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl px-8 py-6">
                <Mail className="mr-2 h-5 w-5" />
                Email Me
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black text-xl px-8 py-6">
                Download CV
              </Button>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
