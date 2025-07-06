
"use client";

import { Button } from "@/components/ui/button";
import cvDataJson from "../cv-data.json";
import { Mail, Phone, MapPin, GraduationCap, Briefcase, Star } from "lucide-react";

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      
      <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-light mb-8 text-gray-900">
            {cvDataJson.hero.fullName}
          </h1>
          <div className="w-24 h-1 bg-[var(--color-primary)] mx-auto mb-8"></div>
          <p className="text-2xl md:text-3xl mb-12 text-gray-600 font-light">
            {cvDataJson.hero.summaryTagline}
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white text-lg px-8 py-6">
              Contact Me
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white text-lg px-8 py-6">
              Download CV
            </Button>
          </div>
        </div>
      </section>
      
      {/* Experience Section */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-gray-900">
            Experience
          </h2>
          <div className="space-y-8">
            {cvDataJson.experience.experienceItems.map((exp, idx) => (
              <div key={idx} className="bg-gray-50 backdrop-blur rounded-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
                      {exp.jobTitle}
                    </h3>
                    <p className="text-xl text-[var(--color-primary)]">
                      {exp.companyName}
                    </p>
                  </div>
                  <span className="text-lg text-gray-600">
                    {exp.dateRange?.startDate} - {exp.dateRange?.endDate}
                  </span>
                </div>
                <ul className="space-y-2">
                  {exp.responsibilitiesAndAchievements?.map((item, i) => (
                    <li key={i} className="text-lg text-gray-600">
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
      <section className="py-32 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-gray-900">
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cvDataJson.skills.skillCategories.map((category, idx) => (
              <div key={idx} className="border-2 border-gray-200 rounded-lg p-8">
                <h3 className="text-3xl font-bold mb-6 text-[var(--color-primary)]">
                  {category.categoryName}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {category.skills.map((skill, i) => (
                    <div key={i} className="text-lg text-gray-600 flex items-center gap-2">
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
      <section className="py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-gray-900">
            Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cvDataJson.education.educationItems.map((edu, idx) => (
              <div key={idx} className="text-center p-8 rounded-lg bg-gray-50">
                <GraduationCap className="mx-auto mb-6 h-16 w-16 text-[var(--color-primary)]" />
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">
                  {edu.degree}
                </h3>
                <p className="text-xl mb-2 text-[var(--color-secondary)]">
                  {edu.institution}
                </p>
                <p className="text-lg text-gray-600">
                  {edu.dateRange?.startDate} - {edu.dateRange?.endDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-20 text-gray-900">
            Let's Connect
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            {cvDataJson.contact.email && (
              <div className="flex items-center gap-2 text-xl text-gray-700">
                <Mail className="h-6 w-6 text-[var(--color-primary)]" />
                {cvDataJson.contact.email}
              </div>
            )}
            {cvDataJson.contact.phone && (
              <div className="flex items-center gap-2 text-xl text-gray-700">
                <Phone className="h-6 w-6 text-[var(--color-primary)]" />
                {cvDataJson.contact.phone}
              </div>
            )}
            {(cvDataJson.contact.location?.city || cvDataJson.contact.location?.state) && (
              <div className="flex items-center gap-2 text-xl text-gray-700">
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
