
"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import Marquee from "@/components/magicui/marquee";import { BorderBeam } from "@/components/magicui/border-beam";import { MagicCard } from "@/components/magicui/magic-card";
import { Button } from "@/components/ui/button";
import cvDataJson from "../cv-data.json";
import { Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Star, ArrowRight, Code, Palette, TrendingUp, Users } from "lucide-react";

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100">
      
      {/* Hero Section - Artistic Bold */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float-slow" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <BlurFade delay={0.25} inView>
                <h1 className="text-7xl md:text-9xl font-black mb-8 text-gray-900 leading-tight">
                  {cvDataJson.hero.fullName}
                </h1>
              </BlurFade>
              <BlurFade delay={0.5} inView>
                <p className="text-3xl md:text-5xl mb-12 text-gray-700 leading-relaxed">
                  {cvDataJson.hero.summaryTagline}
                </p>
              </BlurFade>
              
              <BlurFade delay={0.75} inView>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xl px-8 py-6 rounded-full">
                    <Palette className="mr-2 h-5 w-5" />
                    View Portfolio
                  </Button>
                  <Button size="lg" variant="outline" className="border-3 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white text-xl px-8 py-6 rounded-full">
                    Download CV
                  </Button>
                </div>
              </BlurFade>
            </div>
            
            <div className="relative">
              <MagicCard className="p-12 bg-gradient-to-br from-orange-100 to-pink-100">
                <div className="text-6xl font-bold text-orange-600 mb-4">Hello!</div>
                <div className="text-2xl text-gray-700">Let's create something amazing together</div>
              </MagicCard>
            </div>
          </div>
        </div>
      </section>
      
      
      {/* Experience Section */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-gray-900">
              Experience
            </h2>
          </BlurFade>
          
          <div className="space-y-8">
            {cvDataJson.experience.experienceItems.map((exp, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div className="bg-white/5 backdrop-blur rounded-lg p-8 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">
                        {exp.jobTitle}
                      </h3>
                      <p className="text-xl md:text-2xl text-orange-600">
                        {exp.companyName}
                      </p>
                    </div>
                    <span className="text-lg md:text-xl text-gray-700">
                      {exp.dateRange.startDate} - {exp.dateRange.endDate}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.responsibilitiesAndAchievements?.map((item, i) => (
                      <li key={i} className="text-xl md:text-2xl text-gray-700">
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
      
      
      {/* Skills Section - Artistic Style */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-black text-center mb-20 text-gray-900">
              What I Do Best
            </h2>
          </BlurFade>
          
          <Marquee pauseOnHover className="mb-12">
            {cvDataJson.skills.skillCategories.map((category, idx) => (
              <MagicCard key={idx} className="mx-4 p-8 min-w-[300px] bg-gradient-to-br from-orange-50 to-pink-50">
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-orange-600">
                  {category.categoryName}
                </h3>
                <ul className="space-y-2">
                  {category.skills.map((skill, i) => (
                    <li key={i} className="text-xl md:text-2xl text-gray-700">
                      {skill}
                    </li>
                  ))}
                </ul>
              </MagicCard>
            ))}
          </Marquee>
        </div>
      </section>
      
      
      {/* Education Section */}
      <section className="py-24 md:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-gray-900">
              Education
            </h2>
          </BlurFade>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cvDataJson.education.educationItems.map((edu, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div className="text-center p-8 rounded-lg bg-white/5 backdrop-blur">
                  <GraduationCap className="mx-auto mb-6 h-12 w-12 text-orange-600" />
                  <h3 className="text-3xl md:text-4xl font-semibold mb-2 text-gray-900">
                    {edu.degree}
                  </h3>
                  <p className="text-xl md:text-2xl mb-2 text-gray-700">
                    {edu.institution}
                  </p>
                  <p className="text-lg md:text-xl text-gray-700">
                    {edu.dateRange.startDate} - {edu.dateRange.endDate}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      
      {/* Contact Section */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-br from-yellow-50 to-orange-50">
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
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <div className="flex items-center gap-2 text-xl md:text-2xl text-gray-900">
                <Mail className="h-6 w-6" />
                {cvDataJson.contact.email}
              </div>
              <div className="flex items-center gap-2 text-xl md:text-2xl text-gray-900">
                <Phone className="h-6 w-6" />
                {cvDataJson.contact.phone}
              </div>
              <div className="flex items-center gap-2 text-xl md:text-2xl text-gray-900">
                <MapPin className="h-6 w-6" />
                {cvDataJson.contact.location.city}, {cvDataJson.contact.location.state}
              </div>
            </div>
          </BlurFade>
          
          <BlurFade delay={1} inView>
            <div className="flex gap-6 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xl px-8 py-6">
                <Mail className="mr-2 h-5 w-5" />
                Email Me
              </Button>
              <Button size="lg" variant="outline" className="border-3 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white text-xl px-8 py-6">
                Download CV
              </Button>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
