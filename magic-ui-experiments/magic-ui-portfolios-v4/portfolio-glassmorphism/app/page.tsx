
"use client";

import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/magicui/blur-fade";
import { DotPattern } from "@/components/magicui/dot-pattern";
import cvDataJson from "../cv-data.json";
import { Mail, Phone, MapPin, GraduationCap } from "lucide-react";

export default function Portfolio() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-7xl md:text-9xl font-bold mb-8 text-white">
            {cvDataJson.hero.fullName}
          </h1>
          <p className="text-3xl md:text-5xl mb-12 text-gray-200 max-w-4xl mx-auto">
            {cvDataJson.hero.summaryTagline}
          </p>
          <div className="flex gap-6 justify-center">
            <Button size="lg" className="glass text-white hover:bg-white/20 text-xl px-8 py-6">
              Get In Touch
            </Button>
          </div>
        </div>
      </section>
      
      {/* Experience Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white">
            Experience
          </h2>
          <div className="space-y-8">
            {cvDataJson.experience.experienceItems.map((exp, idx) => (
              <div key={idx} className="glass-dark backdrop-blur rounded-lg p-8">
                <h3 className="text-2xl md:text-3xl font-semibold text-white">{exp.jobTitle}</h3>
                <p className="text-xl text-gray-200">{exp.companyName}</p>
                <p className="text-lg text-gray-200 mb-4">
                  {exp.dateRange.startDate} - {exp.dateRange.endDate}
                </p>
                <ul className="space-y-2">
                  {exp.responsibilitiesAndAchievements?.map((item, i) => (
                    <li key={i} className="text-lg text-gray-200">• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white">
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cvDataJson.skills.skillCategories.map((category, idx) => (
              <div key={idx} className="p-8 glass">
                <h3 className="text-3xl font-bold mb-6 text-white">
                  {category.categoryName}
                </h3>
                <div className="space-y-2">
                  {category.skills.map((skill, i) => (
                    <div key={i} className="text-xl text-gray-200">
                      • {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Education Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white">
            Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cvDataJson.education.educationItems.map((edu, idx) => (
              <div key={idx} className="text-center p-8">
                <GraduationCap className="mx-auto mb-6 h-12 w-12 text-white" />
                <h3 className="text-2xl font-semibold mb-2 text-white">
                  {edu.degree}
                </h3>
                <p className="text-xl mb-2 text-gray-200">
                  {edu.institution}
                </p>
                <p className="text-lg text-gray-200">
                  {edu.dateRange.startDate} - {edu.dateRange.endDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-20 text-white">
            Let's Connect
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <div className="flex items-center gap-2 text-xl text-white">
              <Mail className="h-6 w-6" />
              {cvDataJson.contact.email}
            </div>
            <div className="flex items-center gap-2 text-xl text-white">
              <Phone className="h-6 w-6" />
              {cvDataJson.contact.phone}
            </div>
            <div className="flex items-center gap-2 text-xl text-white">
              <MapPin className="h-6 w-6" />
              {cvDataJson.contact.location.city}, {cvDataJson.contact.location.state}
            </div>
          </div>
          <Button size="lg" className="glass text-white hover:bg-white/20 text-xl px-8 py-6">
            <Mail className="mr-2 h-5 w-5" />
            Email Me
          </Button>
        </div>
      </section>
    </main>
  );
}
