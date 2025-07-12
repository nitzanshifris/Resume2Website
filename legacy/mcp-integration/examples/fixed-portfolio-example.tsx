// Example of portfolio with proper design rules applied
"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { Button } from "@/components/ui/button";

export default function ImprovedPortfolio() {
  // Consistent color scheme - only 2 background variations
  const bgPrimary = "bg-white";
  const bgSecondary = "bg-gray-50";
  
  // High contrast text colors
  const textPrimary = "text-gray-900";
  const textSecondary = "text-gray-700";
  const accentColor = "text-blue-600";
  
  return (
    <main className="min-h-screen">
      {/* Hero - White background, black text (maximum contrast) */}
      <section className={`relative min-h-screen flex items-center justify-center px-4 ${bgPrimary}`}>
        <GridPattern 
          squares={[[4,4], [8,8], [12,12]]} 
          className="absolute inset-0 h-full w-full fill-gray-100/40 stroke-gray-100/40" 
        />
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <BlurFade delay={0.25} inView>
            <h1 className={`text-6xl md:text-8xl font-bold mb-8 ${textPrimary}`}>
              MICHELLE JEWETT
            </h1>
          </BlurFade>
          <BlurFade delay={0.5} inView>
            <p className={`text-2xl md:text-3xl mb-12 ${textSecondary}`}>
              Marketing & Business Management Professional
            </p>
          </BlurFade>
          <BlurFade delay={0.75} inView>
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white text-xl px-8 py-6">
              View My Work
            </Button>
          </BlurFade>
        </div>
      </section>
      
      {/* Experience - Gray background, black text (high contrast) */}
      <section className={`py-32 px-4 ${bgSecondary}`}>
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className={`text-4xl md:text-6xl font-bold text-center mb-20 ${textPrimary}`}>
              Professional Experience
            </h2>
          </BlurFade>
          
          <div className="space-y-12">
            <BlurFade delay={0.5} inView>
              <div className="bg-white rounded-xl p-10 shadow-sm">
                <h3 className={`text-3xl font-semibold mb-3 ${textPrimary}`}>
                  University News Paper Editor
                </h3>
                <p className={`text-2xl mb-6 ${accentColor}`}>
                  Columbus State University
                </p>
                <p className={`text-xl ${textSecondary}`}>
                  Created three new websites for university faculties, 
                  managed weekly editorial content, and led digital transformation initiatives.
                </p>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>
      
      {/* Skills - White background again (alternating pattern) */}
      <section className={`py-32 px-4 ${bgPrimary}`}>
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.25} inView>
            <h2 className={`text-4xl md:text-6xl font-bold text-center mb-20 ${textPrimary}`}>
              Core Competencies
            </h2>
          </BlurFade>
          
          <div className="grid md:grid-cols-2 gap-12">
            <BlurFade delay={0.5} inView>
              <div>
                <h3 className={`text-3xl font-semibold mb-6 ${textPrimary}`}>
                  Technical Skills
                </h3>
                <div className="flex flex-wrap gap-4">
                  {['HTML', 'WordPress', 'MS Office', 'Adobe Creative Suite'].map((skill) => (
                    <span key={skill} className={`text-xl px-6 py-3 rounded-full border-2 border-gray-900 ${textPrimary}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>
      
      {/* Contact - Gray background (consistent alternating) */}
      <section className={`py-32 px-4 ${bgSecondary}`}>
        <div className="max-w-4xl mx-auto text-center">
          <BlurFade delay={0.25} inView>
            <h2 className={`text-4xl md:text-6xl font-bold mb-12 ${textPrimary}`}>
              Let's Connect
            </h2>
          </BlurFade>
          <BlurFade delay={0.5} inView>
            <p className={`text-2xl mb-12 ${textSecondary}`}>
              Ready to bring value to your organization
            </p>
          </BlurFade>
          <BlurFade delay={0.75} inView>
            <div className="flex gap-6 justify-center">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white text-xl px-8 py-6">
                Email Me
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-gray-900 text-gray-900 hover:bg-gray-100 text-xl px-8 py-6">
                Download CV
              </Button>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}