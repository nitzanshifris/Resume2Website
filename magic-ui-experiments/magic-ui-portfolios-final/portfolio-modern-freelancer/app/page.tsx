
"use client";

import { Button } from "@/components/ui/button";
import cvDataJson from "../cv-data.json";
import { Mail, Phone, MapPin, GraduationCap, Briefcase, Star } from "lucide-react";

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      
      <section className="min-h-screen flex items-center px-4 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--color-primary)] to-transparent opacity-10 pattern-geometric"></div>
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-7xl md:text-9xl font-black mb-8 text-white leading-tight">
              {cvDataJson.hero.fullName}
            </h1>
            <p className="text-2xl md:text-4xl mb-12 text-gray-300 font-light">
              {cvDataJson.hero.summaryTagline}
            </p>
            <Button size="lg" className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white text-xl px-10 py-6 rounded-full">
              Let's Work Together
            </Button>
          </div>
        </div>
      </section>
      
      {/* Experience Section */}
      <section className="py-32 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white">
            Experience
          </h2>
          <div className="space-y-8">
            {cvDataJson.experience.experienceItems.map((exp, idx) => (
              <div key={idx} className="bg-gray-800/50 backdrop-blur rounded-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-white">
                      {exp.jobTitle}
                    </h3>
                    <p className="text-xl text-[var(--color-primary)]">
                      {exp.companyName}
                    </p>
                  </div>
                  <span className="text-lg text-gray-400">
                    {exp.dateRange?.startDate} - {exp.dateRange?.endDate}
                  </span>
                </div>
                <ul className="space-y-2">
                  {exp.responsibilitiesAndAchievements?.map((item, i) => (
                    <li key={i} className="text-lg text-gray-300">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section className="py-32 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white">
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cvDataJson.skills.skillCategories.map((category, idx) => (
              <div key={idx} className="glass rounded-lg p-8">
                <h3 className="text-3xl font-bold mb-6 text-[var(--color-primary)]">
                  {category.categoryName}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {category.skills.map((skill, i) => (
                    <div key={i} className="text-lg text-gray-300 flex items-center gap-2">
                      <Star className="h-4 w-4 text-[var(--color-secondary)]" />
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Education Section */}
      <section className="py-32 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white">
            Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cvDataJson.education.educationItems.map((edu, idx) => (
              <div key={idx} className="text-center p-8 rounded-lg bg-gray-800/50">
                <GraduationCap className="mx-auto mb-6 h-16 w-16 text-[var(--color-primary)]" />
                <h3 className="text-2xl font-semibold mb-2 text-white">
                  {edu.degree}
                </h3>
                <p className="text-xl mb-2 text-[var(--color-secondary)]">
                  {edu.institution}
                </p>
                <p className="text-lg text-gray-400">
                  {edu.dateRange?.startDate} - {edu.dateRange?.endDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-20 text-white">
            Let's Connect
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            {cvDataJson.contact.email && (
              <div className="flex items-center gap-2 text-xl text-gray-300">
                <Mail className="h-6 w-6 text-[var(--color-primary)]" />
                {cvDataJson.contact.email}
              </div>
            )}
            {cvDataJson.contact.phone && (
              <div className="flex items-center gap-2 text-xl text-gray-300">
                <Phone className="h-6 w-6 text-[var(--color-primary)]" />
                {cvDataJson.contact.phone}
              </div>
            )}
            {(cvDataJson.contact.location?.city || cvDataJson.contact.location?.state) && (
              <div className="flex items-center gap-2 text-xl text-gray-300">
                <MapPin className="h-6 w-6 text-[var(--color-primary)]" />
                {cvDataJson.contact.location.city}{cvDataJson.contact.location.city && cvDataJson.contact.location.state && ', '}{cvDataJson.contact.location.state}
              </div>
            )}
          </div>
          <Button size="lg" className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white text-xl px-10 py-6">
            <Mail className="mr-2 h-5 w-5" />
            Get In Touch
          </Button>
        </div>
      </section>
    </main>
  );
}
