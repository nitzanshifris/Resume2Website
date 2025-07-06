"use client";

import { AnimatedBeamMultipleOutputDemo } from "@/components/magicui/animated-beam";
import { BlurFade } from "@/components/magicui/blur-fade";
import { RetroGrid } from "@/components/magicui/retro-grid";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/button";
import cvDataJson from "../cv-data.json";

export default function RetroPortfolio() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Retro Grid Background */}
      <RetroGrid className="absolute inset-0 h-full w-full" />

      {/* Hero Section - Retro Style */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <BlurFade delay={0.25} inView>
            <h1 className="mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-6xl font-black uppercase tracking-wider text-transparent md:text-8xl">
              {cvDataJson.hero.fullName}
            </h1>
          </BlurFade>
          <BlurFade delay={0.5} inView>
            <div className="mb-8 flex justify-center gap-4">
              <span className="rounded-full border border-pink-500/50 bg-pink-500/10 px-4 py-2 text-sm text-pink-400">
                Marketing
              </span>
              <span className="rounded-full border border-purple-500/50 bg-purple-500/10 px-4 py-2 text-sm text-purple-400">
                Business Management
              </span>
            </div>
          </BlurFade>
          <BlurFade delay={0.75} inView>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              {cvDataJson.hero.summaryTagline}
            </p>
          </BlurFade>
        </div>
      </section>

      {/* Skills Marquee - Cyberpunk Style */}
      <section className="relative z-10 border-y border-gray-800 bg-black/50 py-8 backdrop-blur">
        <Marquee pauseOnHover className="[--duration:40s]">
          {[...cvDataJson.skills.skillCategories.flatMap(cat => cat.skills), 
            ...cvDataJson.skills.skillCategories.flatMap(cat => cat.skills)].map((skill, idx) => (
            <div
              key={idx}
              className="mx-4 rounded-lg border border-gray-800 bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-4 py-2"
            >
              <span className="font-mono text-sm text-gray-300">{skill}</span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* Experience Cards - Glassmorphism */}
      <section className="relative z-10 py-32">
        <div className="mx-auto max-w-6xl px-4">
          <BlurFade delay={0.25} inView>
            <h2 className="mb-16 text-center text-5xl font-black uppercase tracking-wider text-white">
              Experience
            </h2>
          </BlurFade>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cvDataJson.experience.experienceItems.slice(0, 6).map((exp, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/90 to-gray-950/90 p-6 backdrop-blur transition-all hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20">
                  <DotPattern
                    className={cn(
                      "[mask-image:radial-gradient(200px_circle_at_center,white,transparent)]",
                      "absolute inset-0 opacity-50",
                    )}
                  />
                  <div className="relative z-10">
                    <h3 className="mb-2 text-xl font-bold text-white">{exp.jobTitle}</h3>
                    <p className="mb-1 font-mono text-sm text-purple-400">{exp.companyName}</p>
                    <p className="mb-3 text-xs text-gray-500">
                      {exp.dateRange.startDate} - {exp.dateRange.endDate}
                    </p>
                    <ul className="space-y-1">
                      {exp.responsibilitiesAndAchievements?.slice(0, 2).map((item, i) => (
                        <li key={i} className="text-xs leading-relaxed text-gray-400">
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

      {/* Education - Neon Style */}
      <section className="relative z-10 py-32">
        <div className="mx-auto max-w-4xl px-4">
          <BlurFade delay={0.25} inView>
            <div className="relative rounded-2xl border border-pink-500/50 bg-black/50 p-8 text-center backdrop-blur">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 blur-xl" />
              <div className="relative z-10">
                <h2 className="mb-8 text-3xl font-black uppercase tracking-wider text-white">
                  Education
                </h2>
                <h3 className="mb-2 text-2xl font-bold text-pink-400">
                  {cvDataJson.education.educationItems[0].degree}
                </h3>
                <p className="mb-1 text-lg text-purple-400">
                  {cvDataJson.education.educationItems[0].fieldOfStudy}
                </p>
                <p className="mb-2 text-gray-400">
                  {cvDataJson.education.educationItems[0].institution}
                </p>
                <p className="font-mono text-sm text-gray-500">
                  {cvDataJson.education.educationItems[0].dateRange.startDate} -{" "}
                  {cvDataJson.education.educationItems[0].dateRange.endDate}
                </p>
                {cvDataJson.education.educationItems[0].gpa && (
                  <p className="mt-4 font-mono text-lg font-bold text-green-400">
                    GPA: {cvDataJson.education.educationItems[0].gpa}
                  </p>
                )}
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Achievement Stats - Glowing Numbers */}
      <section className="relative z-10 py-32">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "3", label: "Websites Created" },
              { value: "5K+", label: "Database Entries" },
              { value: "2K", label: "Files Digitized" },
              { value: "200+", label: "Articles Edited" },
            ].map((stat, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div className="text-center">
                  <div className="mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-5xl font-black text-transparent">
                    {stat.value}
                  </div>
                  <div className="font-mono text-sm text-gray-400">{stat.label}</div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <section className="relative z-10 border-t border-gray-800 py-16 text-center">
        <BlurFade delay={0.25} inView>
          <div className="space-y-4">
            <p className="font-mono text-sm text-gray-400">// Get in touch</p>
            <p className="text-lg text-purple-400">{cvDataJson.contact.email}</p>
            <p className="text-lg text-pink-400">{cvDataJson.contact.phone}</p>
            <p className="text-gray-500">
              {cvDataJson.contact.location.city}, {cvDataJson.contact.location.state}
            </p>
          </div>
        </BlurFade>
      </section>
    </main>
  );
}