"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { Button } from "@/components/ui/button";
import { Terminal, Code2, Database, GitBranch, Zap, ChevronRight } from "lucide-react";
import cvDataJson from "../cv-data.json";
import React, { useRef } from "react";

export default function TechPortfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      {/* Terminal-style Hero */}
      <section className="relative flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          <BlurFade delay={0.25} inView>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 shadow-2xl">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="ml-2 text-sm text-gray-500">portfolio.sh</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-green-400">$</span>
                  <span className="ml-2 typing-animation">whoami</span>
                </div>
                <div className="ml-6">{cvDataJson.hero.fullName}</div>
                
                <div className="flex items-center">
                  <span className="text-green-400">$</span>
                  <span className="ml-2">cat role.txt</span>
                </div>
                <div className="ml-6 text-blue-400">Marketing & Business Management Graduate</div>
                
                <div className="flex items-center">
                  <span className="text-green-400">$</span>
                  <span className="ml-2">echo $MISSION</span>
                </div>
                <div className="ml-6 text-gray-400">{cvDataJson.hero.summaryTagline}</div>
                
                <div className="flex items-center">
                  <span className="text-green-400">$</span>
                  <span className="ml-2 animate-pulse">_</span>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Skills as Code Blocks */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <BlurFade delay={0.25} inView>
            <h2 className="mb-12 text-center text-3xl">
              <span className="text-gray-500">const</span>{" "}
              <span className="text-blue-400">skills</span>{" "}
              <span className="text-gray-500">=</span> {"{"}
            </h2>
          </BlurFade>
          
          <div className="grid gap-4 md:grid-cols-2">
            {cvDataJson.skills.skillCategories.map((category, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                  <div className="mb-4 text-green-400">// {category.categoryName}</div>
                  <div className="space-y-2">
                    {category.skills.map((skill, i) => (
                      <div key={i} className="flex items-center">
                        <ChevronRight className="mr-2 h-4 w-4 text-gray-600" />
                        <span className="text-yellow-300">&quot;{skill}&quot;</span>
                        {i < category.skills.length - 1 && <span className="text-gray-600">,</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
          
          <BlurFade delay={0.25 * 5} inView>
            <p className="mt-8 text-center text-3xl text-gray-500">{"}"}</p>
          </BlurFade>
        </div>
      </section>

      {/* Experience as Git Log */}
      <section className="bg-gray-900 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <BlurFade delay={0.25} inView>
            <div className="mb-12 flex items-center justify-center gap-2">
              <GitBranch className="h-6 w-6 text-green-400" />
              <h2 className="text-3xl">git log --oneline</h2>
            </div>
          </BlurFade>
          
          <div className="space-y-4">
            {cvDataJson.experience.experienceItems.map((exp, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div className="group cursor-pointer rounded-lg border border-gray-800 bg-gray-950 p-4 transition-all hover:border-green-400">
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-xs text-green-400">
                      {exp.dateRange.startDate.slice(-2)}{idx}a{idx}f
                    </span>
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="text-blue-400">{exp.jobTitle}</span>
                        <span className="text-gray-500"> @ </span>
                        <span className="text-purple-400">{exp.companyName}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {exp.responsibilitiesAndAchievements?.[0]}
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        {exp.dateRange.startDate} - {exp.dateRange.endDate}
                      </div>
                    </div>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Education as System Info */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <BlurFade delay={0.25} inView>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Terminal className="h-5 w-5 text-green-400" />
                <span className="text-green-400">neofetch</span>
              </div>
              
              <div className="grid gap-2 text-sm">
                <div className="flex">
                  <span className="w-32 text-gray-500">Degree:</span>
                  <span className="text-blue-400">{cvDataJson.education.educationItems[0].degree}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-500">Field:</span>
                  <span className="text-purple-400">{cvDataJson.education.educationItems[0].fieldOfStudy}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-500">Institution:</span>
                  <span className="text-yellow-400">{cvDataJson.education.educationItems[0].institution}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-500">Duration:</span>
                  <span className="text-green-400">
                    {cvDataJson.education.educationItems[0].dateRange.startDate} - {cvDataJson.education.educationItems[0].dateRange.endDate}
                  </span>
                </div>
                {cvDataJson.education.educationItems[0].gpa && (
                  <div className="flex">
                    <span className="w-32 text-gray-500">GPA:</span>
                    <span className="text-green-400">{cvDataJson.education.educationItems[0].gpa}</span>
                  </div>
                )}
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Achievements as Performance Metrics */}
      <section className="bg-gray-900 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <BlurFade delay={0.25} inView>
            <h2 className="mb-12 flex items-center justify-center gap-2 text-3xl">
              <Zap className="h-6 w-6 text-yellow-400" />
              Performance Metrics
            </h2>
          </BlurFade>
          
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { label: "Websites Built", value: "3", unit: "sites" },
              { label: "Database Entries", value: "5000", unit: "rows" },
              { label: "Files Processed", value: "2000", unit: "files" },
              { label: "Articles Edited", value: "200", unit: "docs" },
            ].map((metric, idx) => (
              <BlurFade key={idx} delay={0.25 * (idx + 1)} inView>
                <div className="rounded-lg border border-gray-800 bg-gray-950 p-6 text-center">
                  <div className="mb-2 text-4xl font-bold text-green-400">{metric.value}</div>
                  <div className="text-sm text-gray-500">{metric.unit}</div>
                  <div className="mt-2 text-xs text-gray-600">{metric.label}</div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Contact as Command Line */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <BlurFade delay={0.25} inView>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-6 text-2xl">// Contact Information</h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Code2 className="mr-3 h-5 w-5 text-green-400" />
                  <span className="text-gray-500">email:</span>
                  <span className="ml-2 text-blue-400">{cvDataJson.contact.email}</span>
                </div>
                <div className="flex items-center">
                  <Code2 className="mr-3 h-5 w-5 text-green-400" />
                  <span className="text-gray-500">phone:</span>
                  <span className="ml-2 text-blue-400">{cvDataJson.contact.phone}</span>
                </div>
                <div className="flex items-center">
                  <Code2 className="mr-3 h-5 w-5 text-green-400" />
                  <span className="text-gray-500">location:</span>
                  <span className="ml-2 text-blue-400">
                    {cvDataJson.contact.location.city}, {cvDataJson.contact.location.state}
                  </span>
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <Button variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black">
                  ./send_email.sh
                </Button>
                <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black">
                  ./schedule_call.sh
                </Button>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}