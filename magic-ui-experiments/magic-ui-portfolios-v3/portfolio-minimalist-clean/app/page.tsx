
"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Button } from "@/components/ui/button";
import cvDataJson from "../cv-data.json";
import { Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Star, ArrowRight, Code, Palette, TrendingUp, Users } from "lucide-react";

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* Hero Section - Minimalist */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <BlurFade delay={0.25} inView>
            <h1 className="text-7xl md:text-9xl font-light mb-8 text-gray-900 tracking-tight">
              {cvDataJson.hero.fullName}
            </h1>
          </BlurFade>
          
          <BlurFade delay={0.5} inView>
            <p className="text-3xl md:text-5xl mb-12 text-gray-600 font-light leading-relaxed">
              {cvDataJson.hero.summaryTagline}
            </p>
          </BlurFade>
          
          <BlurFade delay={0.75} inView>
            <div className="flex gap-6 justify-center">
              <ShimmerButton size="lg" className="text-xl px-8 py-6">
                Connect
              </ShimmerButton>
            </div>
          </BlurFade>
        </div>
      </section>
      
      
      {/* Experience Section */}
      <section className="py-24 md:py-32 px-4 bg-gray-50">
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
                      <p className="text-xl md:text-2xl text-blue-600">
                        {exp.companyName}
                      </p>
                    </div>
                    <span className="text-lg md:text-xl text-gray-600">
                      {exp.dateRange.startDate} - {exp.dateRange.endDate}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.responsibilitiesAndAchievements?.map((item, i) => (
                      <li key={i} className="text-xl md:text-2xl text-gray-600">
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
      
      
      {/* Skills Section */}
      <section className="py-24 md:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-gray-900">
              Skills & Expertise
            </h2>
          </BlurFade>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {cvDataJson.skills.skillCategories.map((category, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div>
                  <h3 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900 border-b-2 border-gray-200 pb-2">
                    {category.categoryName}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {category.skills.map((skill, i) => (
                      <div key={i} className="text-xl md:text-2xl text-gray-600">
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
                  <GraduationCap className="mx-auto mb-6 h-12 w-12 text-blue-600" />
                  <h3 className="text-3xl md:text-4xl font-semibold mb-2 text-gray-900">
                    {edu.degree}
                  </h3>
                  <p className="text-xl md:text-2xl mb-2 text-gray-600">
                    {edu.institution}
                  </p>
                  <p className="text-lg md:text-xl text-gray-600">
                    {edu.dateRange.startDate} - {edu.dateRange.endDate}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      
      
      {/* Contact Section */}
      <section className="py-24 md:py-32 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <BlurFade delay={0.25} inView>
            <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-gray-900">
              Let's Connect
            </h2>
          </BlurFade>
          
          <BlurFade delay={0.5} inView>
            <p className="text-xl md:text-2xl mb-12 text-gray-600">
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
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white text-xl px-8 py-6">
                <Mail className="mr-2 h-5 w-5" />
                Email Me
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-xl px-8 py-6">
                Download CV
              </Button>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
