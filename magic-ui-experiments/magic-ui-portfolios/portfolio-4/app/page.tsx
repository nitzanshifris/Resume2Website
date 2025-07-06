"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { WordRotate } from "@/components/magicui/word-rotate";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Briefcase, GraduationCap, Mail, Phone, MapPin, Star } from "lucide-react";
import cvDataJson from "../cv-data.json";

export default function CreativePortfolio() {
  const words = ["Marketing Expert", "Business Manager", "Creative Thinker", "Team Player"];
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      {/* Hero Section - Playful Design */}
      <section className="relative flex min-h-screen items-center justify-center px-4 py-20">
        <div className="text-center">
          <BlurFade delay={0.25} inView>
            <div className="mb-6 inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-800 dark:text-purple-100">
              <Sparkles className="mr-2 h-4 w-4" />
              Welcome to my portfolio
            </div>
          </BlurFade>
          
          <BlurFade delay={0.5} inView>
            <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white md:text-7xl">
              Hi, I'm <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {cvDataJson.hero.fullName}
              </span>
            </h1>
          </BlurFade>
          
          <BlurFade delay={0.75} inView>
            <div className="mb-8 text-2xl text-gray-600 dark:text-gray-300">
              I'm a <WordRotate words={words} className="font-semibold text-purple-600 dark:text-purple-400" />
            </div>
          </BlurFade>
          
          <BlurFade delay={1} inView>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              {cvDataJson.hero.summaryTagline}
            </p>
          </BlurFade>
          
          <BlurFade delay={1.25} inView>
            <Button size="lg" className="group">
              Let's Connect
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </BlurFade>
        </div>
      </section>

      {/* About Me Cards */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <BlurFade delay={0.25} inView>
            <h2 className="mb-12 text-center text-4xl font-bold">About Me</h2>
          </BlurFade>
          
          <div className="grid gap-6 md:grid-cols-3">
            <BlurFade delay={0.5} inView>
              <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl dark:bg-gray-800">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100 opacity-50 transition-transform group-hover:scale-150 dark:bg-purple-900" />
                <Mail className="mb-4 h-8 w-8 text-purple-600 dark:text-purple-400" />
                <h3 className="mb-2 text-xl font-semibold">Contact</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{cvDataJson.contact.email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{cvDataJson.contact.phone}</p>
              </div>
            </BlurFade>
            
            <BlurFade delay={0.75} inView>
              <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl dark:bg-gray-800">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-pink-100 opacity-50 transition-transform group-hover:scale-150 dark:bg-pink-900" />
                <MapPin className="mb-4 h-8 w-8 text-pink-600 dark:text-pink-400" />
                <h3 className="mb-2 text-xl font-semibold">Location</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {cvDataJson.contact.location.city}, {cvDataJson.contact.location.state}
                </p>
              </div>
            </BlurFade>
            
            <BlurFade delay={1} inView>
              <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl dark:bg-gray-800">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-100 opacity-50 transition-transform group-hover:scale-150 dark:bg-orange-900" />
                <GraduationCap className="mb-4 h-8 w-8 text-orange-600 dark:text-orange-400" />
                <h3 className="mb-2 text-xl font-semibold">Education</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {cvDataJson.education.educationItems[0].degree}
                </p>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Experience Timeline - Card Style */}
      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl px-4">
          <BlurFade delay={0.25} inView>
            <h2 className="mb-12 text-center text-4xl font-bold">My Journey</h2>
          </BlurFade>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-purple-600 to-pink-600 md:left-1/2" />
            
            {cvDataJson.experience.experienceItems.slice(0, 4).map((exp, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div className={`relative mb-8 flex items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="absolute left-8 h-4 w-4 rounded-full bg-purple-600 md:left-1/2 md:-translate-x-1/2" />
                  <div className={`ml-20 w-full rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-lg dark:from-gray-800 dark:to-gray-700 md:ml-0 md:w-5/12 ${idx % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <div className="mb-2 inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                      <Briefcase className="mr-1 h-3 w-3" />
                      {exp.dateRange.startDate} - {exp.dateRange.endDate}
                    </div>
                    <h3 className="mb-1 text-lg font-semibold">{exp.jobTitle}</h3>
                    <p className="mb-3 text-sm font-medium text-purple-600 dark:text-purple-400">{exp.companyName}</p>
                    <ul className="space-y-1">
                      {exp.responsibilitiesAndAchievements?.slice(0, 2).map((item, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Skills - Colorful Grid */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <BlurFade delay={0.25} inView>
            <h2 className="mb-12 text-center text-4xl font-bold">My Superpowers</h2>
          </BlurFade>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cvDataJson.skills.skillCategories.map((category, idx) => {
              const colors = [
                "from-purple-400 to-pink-400",
                "from-pink-400 to-red-400",
                "from-orange-400 to-yellow-400",
                "from-green-400 to-teal-400",
                "from-blue-400 to-indigo-400",
                "from-indigo-400 to-purple-400",
              ];
              
              return (
                <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                  <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-2xl dark:bg-gray-800">
                    <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${colors[idx % colors.length]} opacity-20 transition-transform group-hover:scale-150`} />
                    <h3 className="mb-3 text-lg font-semibold">{category.categoryName}</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, i) => (
                        <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </BlurFade>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <BlurFade delay={0.25} inView>
            <h2 className="mb-12 text-center text-4xl font-bold">Impact & Achievements</h2>
          </BlurFade>
          
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { icon: Star, value: "3", label: "Websites Built" },
              { icon: Star, value: "5K+", label: "Data Entries" },
              { icon: Star, value: "2K", label: "Files Processed" },
              { icon: Star, value: "200+", label: "Articles Edited" },
            ].map((achievement, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div className="text-center">
                  <achievement.icon className="mx-auto mb-4 h-8 w-8" />
                  <div className="mb-2 text-5xl font-bold">{achievement.value}</div>
                  <div className="text-sm opacity-90">{achievement.label}</div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 text-center">
        <BlurFade delay={0.25} inView>
          <h2 className="mb-6 text-4xl font-bold">Let's Create Something Amazing!</h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            I'm always excited about new opportunities and challenges.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" variant="default">
              <Mail className="mr-2 h-4 w-4" />
              Email Me
            </Button>
            <Button size="lg" variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Call Me
            </Button>
          </div>
        </BlurFade>
      </section>
    </main>
  );
}