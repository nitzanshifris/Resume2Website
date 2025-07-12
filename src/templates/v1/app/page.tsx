"use client";

import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/magicui/blur-fade";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { BorderBeam } from "@/components/magicui/border-beam";
import { MagicCard } from "@/components/magicui/magic-card";
import { TextReveal } from "@/components/magicui/text-reveal";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { cn } from "@/lib/utils";
import cvDataJson from "../cv-data.json";
import { Mail, Phone, MapPin, GraduationCap, Briefcase, Star, Brain, Code, Globe, Award } from "lucide-react";

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      {/* Hero Section with Magic UI Effects */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background Effects */}
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            "absolute inset-0 opacity-30"
          )}
        />
        <GridPattern
          width={40}
          height={40}
          x={-1}
          y={-1}
          className="absolute inset-0 opacity-10"
        />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <BlurFade delay={0.25} inView>
            <div className="mb-8">
              <Brain className="mx-auto h-24 w-24 text-blue-400 animate-pulse" />
            </div>
          </BlurFade>
          
          <BlurFade delay={0.5} inView>
            <h1 className="text-7xl md:text-9xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient bg-300%">
                {cvDataJson.hero.fullName}
              </span>
            </h1>
          </BlurFade>
          
          <BlurFade delay={0.75} inView>
            <p className="text-2xl md:text-4xl mb-12 text-gray-300 max-w-4xl mx-auto">
              Computational Neuroscience & Cognition Student | Research Analyst | Tech Enthusiast
            </p>
          </BlurFade>
          
          <BlurFade delay={1} inView>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="relative bg-blue-600 hover:bg-blue-700 text-white text-xl px-8 py-6 overflow-hidden group">
                <span className="relative z-10 flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Get In Touch
                </span>
                <BorderBeam size={250} duration={12} delay={9} />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-xl px-8 py-6 transition-all duration-300">
                <Code className="mr-2 h-5 w-5" />
                View Projects
              </Button>
            </div>
          </BlurFade>
        </div>
      </section>
      
      {/* Experience Section with Magic Cards */}
      <section className="py-32 px-4 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white flex items-center justify-center gap-4">
              <Briefcase className="h-16 w-16 text-blue-400" />
              Experience
            </h2>
          </BlurFade>
          
          <div className="space-y-8">
            {cvDataJson.experience?.experienceItems?.map((exp, idx) => (
              <BlurFade key={idx} delay={0.25 + idx * 0.1} inView>
                <MagicCard
                  className="relative p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm"
                  gradientColor="rgba(59, 130, 246, 0.2)"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-semibold text-white">
                        {exp.jobTitle}
                      </h3>
                      <p className="text-xl text-blue-400">
                        {exp.companyName}
                      </p>
                      {exp.location && (
                        <p className="text-lg text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4" />
                          {exp.location.country}
                        </p>
                      )}
                    </div>
                    <span className="text-lg text-gray-400 font-mono">
                      {exp.dateRange?.startDate} - {exp.dateRange?.endDate || 'Present'}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.responsibilitiesAndAchievements?.map((item, i) => (
                      <li key={i} className="text-lg text-gray-300 flex items-start gap-2">
                        <span className="text-purple-400 mt-1">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </MagicCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      {/* Skills Section with Animated Cards */}
      <section className="py-32 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white">
              Skills & Expertise
            </h2>
          </BlurFade>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cvDataJson.summary?.keySpecializations?.map((spec, idx) => (
              <BlurFade key={idx} delay={0.1 + idx * 0.05} inView>
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative bg-gray-900 rounded-lg p-6 text-center hover:bg-gray-800 transition-all duration-300 border border-gray-800">
                    <Star className="mx-auto mb-4 h-8 w-8 text-purple-400 group-hover:text-blue-400 transition-colors" />
                    <p className="text-lg text-white font-medium">{spec}</p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      {/* Education Section with Timeline */}
      <section className="py-32 px-4 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white flex items-center justify-center gap-4">
              <GraduationCap className="h-16 w-16 text-purple-400" />
              Education
            </h2>
          </BlurFade>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cvDataJson.education?.educationItems?.map((edu, idx) => (
              <BlurFade key={idx} delay={0.25 + idx * 0.1} inView>
                <MagicCard
                  className="relative p-8 text-center bg-gradient-to-br from-gray-900/50 to-gray-800/50"
                  gradientColor={edu.fieldOfStudy?.toLowerCase().includes('neuroscience') ? "rgba(59, 130, 246, 0.3)" : "rgba(168, 85, 247, 0.3)"}
                >
                  {edu.fieldOfStudy?.toLowerCase().includes('neuroscience') ? (
                    <Brain className="mx-auto mb-6 h-16 w-16 text-blue-400" />
                  ) : (
                    <GraduationCap className="mx-auto mb-6 h-16 w-16 text-purple-400" />
                  )}
                  <h3 className="text-2xl font-semibold mb-2 text-white">
                    {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  </h3>
                  <p className="text-xl mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {edu.institution}
                  </p>
                  {edu.location && (
                    <p className="text-lg text-gray-400 mb-2">
                      {edu.location.city}, {edu.location.country}
                    </p>
                  )}
                  <p className="text-lg text-gray-400 font-mono">
                    {edu.dateRange?.startDate} - {edu.dateRange?.endDate || 'Present'}
                  </p>
                  {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-500 mb-2">Key Coursework:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {edu.relevantCoursework.map((course, i) => (
                          <span key={i} className="text-sm bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </MagicCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      {/* Achievements Section */}
      {cvDataJson.achievements?.achievements && (
        <section className="py-32 px-4 bg-black">
          <div className="max-w-6xl mx-auto">
            <BlurFade delay={0.25} inView>
              <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white flex items-center justify-center gap-4">
                <Award className="h-16 w-16 text-yellow-400" />
                Key Achievements
              </h2>
            </BlurFade>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvDataJson.achievements.achievements.map((achievement, idx) => (
                <BlurFade key={idx} delay={0.25 + idx * 0.1} inView>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                    <div className="relative bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-yellow-600/50 transition-all">
                      <h3 className="text-3xl font-bold text-yellow-400 mb-2">{achievement.value}</h3>
                      <p className="text-xl text-white mb-1">{achievement.label}</p>
                      {achievement.contextOrDetail && (
                        <p className="text-gray-400">{achievement.contextOrDetail}</p>
                      )}
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Languages Section */}
      {cvDataJson.languages?.languageItems && (
        <section className="py-32 px-4 bg-gradient-to-b from-black to-gray-950">
          <div className="max-w-6xl mx-auto">
            <BlurFade delay={0.25} inView>
              <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white flex items-center justify-center gap-4">
                <Globe className="h-16 w-16 text-blue-400" />
                Languages
              </h2>
            </BlurFade>
            
            <div className="flex flex-wrap justify-center gap-6">
              {cvDataJson.languages.languageItems.map((lang, idx) => (
                <BlurFade key={idx} delay={0.25 + idx * 0.1} inView>
                  <MagicCard
                    className="px-8 py-6 text-center bg-gradient-to-br from-gray-900/50 to-gray-800/50"
                    gradientColor="rgba(59, 130, 246, 0.2)"
                  >
                    <h3 className="text-2xl font-semibold text-white mb-2">{lang.language}</h3>
                    <p className="text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                      {lang.proficiency}
                    </p>
                    {lang.certification && (
                      <p className="text-sm text-gray-400 mt-2">{lang.certification}</p>
                    )}
                  </MagicCard>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Contact Section with Effects */}
      <section className="py-32 px-4 bg-black relative">
        <GridPattern
          width={40}
          height={40}
          x={-1}
          y={-1}
          className="absolute inset-0 opacity-5"
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold mb-12 text-white">
              Let's Connect
            </h2>
          </BlurFade>
          
          <BlurFade delay={0.5} inView>
            <p className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Interested in neuroscience, AI, and the intersection of technology and cognition? Let's discuss!
            </p>
          </BlurFade>
          
          <BlurFade delay={0.75} inView>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              {cvDataJson.contact.email && (
                <div className="flex items-center gap-2 text-xl text-gray-300 hover:text-blue-400 transition-colors">
                  <Mail className="h-6 w-6 text-blue-400" />
                  {cvDataJson.contact.email}
                </div>
              )}
              {cvDataJson.contact.phone && (
                <div className="flex items-center gap-2 text-xl text-gray-300 hover:text-purple-400 transition-colors">
                  <Phone className="h-6 w-6 text-purple-400" />
                  {cvDataJson.contact.phone}
                </div>
              )}
              {cvDataJson.contact.location && (
                <div className="flex items-center gap-2 text-xl text-gray-300">
                  <MapPin className="h-6 w-6 text-blue-400" />
                  {cvDataJson.contact.location.city}, {cvDataJson.contact.location.country}
                </div>
              )}
            </div>
          </BlurFade>
          
          <BlurFade delay={1} inView>
            <Button size="lg" className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl px-10 py-6 overflow-hidden group">
              <span className="relative z-10 flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Send Message
              </span>
              <BorderBeam size={250} duration={12} delay={9} />
            </Button>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}