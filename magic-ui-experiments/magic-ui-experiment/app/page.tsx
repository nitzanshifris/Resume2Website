"use client";

import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Marquee } from "@/components/magicui/marquee";
import { Button } from "@/components/ui/button";
import { Calendar, FileTextIcon, BookOpenIcon, GlobeIcon, BrainIcon, BriefcaseIcon, TrendingUpIcon, UsersIcon, TargetIcon } from "lucide-react";
import cvDataJson from "../cv-data.json";

// Transform the CV data for better display
const cvData = {
  hero: {
    fullName: cvDataJson.hero.fullName,
    professionalTitle: "Marketing & Business Management Graduate",
    summaryTagline: cvDataJson.hero.summaryTagline,
  },
  skills: [
    { name: "Business Development", category: "Business" },
    { name: "Email Marketing", category: "Marketing" },
    { name: "Microsoft Office", category: "Technical" },
    { name: "Website Design", category: "Technical" },
    { name: "Project Management", category: "Management" },
    { name: "Communication", category: "Soft Skills" },
    { name: "Time Management", category: "Soft Skills" },
    { name: "Teamwork", category: "Soft Skills" },
    { name: "Critical Thinking", category: "Soft Skills" },
  ],
  experience: cvDataJson.experience.experienceItems.slice(0, 3).map(exp => ({
    title: exp.jobTitle,
    company: exp.companyName,
    period: `${exp.dateRange.startDate} - ${exp.dateRange.endDate}`,
    description: exp.responsibilitiesAndAchievements ? exp.responsibilitiesAndAchievements[0] : "",
    achievements: exp.responsibilitiesAndAchievements || []
  })),
  achievements: [
    { metric: "3", label: "Websites Created" },
    { metric: "5000+", label: "Clients Database Updated" },
    { metric: "2000", label: "Files Digitalized" },
    { metric: "200+", label: "Articles Edited" },
  ],
  education: cvDataJson.education.educationItems[0],
};

const features = [
  {
    Icon: TrendingUpIcon,
    name: "Marketing Excellence",
    description: "Bachelor of Marketing with hands-on experience in digital marketing and analytics",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-500 opacity-30" />
    ),
  },
  {
    Icon: BrainIcon,
    name: "Business Management",
    description: "Strong foundation in business operations, project management, and strategic planning",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 opacity-30" />
    ),
  },
  {
    Icon: FileTextIcon,
    name: "Content Creation",
    description: "Editorial experience with university newspaper and website development",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 opacity-30" />
    ),
  },
  {
    Icon: UsersIcon,
    name: "Team Collaboration",
    description: "Proven ability to work effectively in diverse teams and coordinate projects",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-30" />
    ),
  },
];

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-background dark:bg-black">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-20">
        <BlurFade delay={0.25} inView>
          <h1 className="text-4xl font-bold text-black dark:text-white sm:text-6xl md:text-7xl lg:text-8xl">
            {cvData.hero.fullName}
          </h1>
        </BlurFade>
        <BlurFade delay={0.25 * 2} inView>
          <span className="mt-4 text-xl text-neutral-600 dark:text-neutral-400 sm:text-2xl">
            {cvData.hero.professionalTitle}
          </span>
        </BlurFade>
        <BlurFade delay={0.25 * 3} inView>
          <p className="mt-6 max-w-3xl text-center text-lg text-neutral-500 dark:text-neutral-300">
            {cvData.hero.summaryTagline}
          </p>
        </BlurFade>
      </section>

      {/* Skills Section with Bento Grid */}
      <section className="py-20 px-4">
        <BlurFade delay={0.25 * 4} inView>
          <h2 className="mb-12 text-center text-3xl font-bold md:text-5xl">
            Skills & Expertise
          </h2>
        </BlurFade>
        <BentoGrid>
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-4">
        <BlurFade delay={0.25 * 5} inView>
          <h2 className="mb-12 text-center text-3xl font-bold md:text-5xl">
            Professional Experience
          </h2>
        </BlurFade>
        <div className="mx-auto max-w-4xl space-y-8">
          {cvData.experience.map((exp, idx) => (
            <BlurFade key={idx} delay={0.25 * (6 + idx)} inView>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-xl font-semibold">{exp.title}</h3>
                <p className="mt-1 text-muted-foreground">
                  {exp.company} • {exp.period}
                </p>
                <ul className="mt-4 space-y-2">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      • {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20 px-4">
        <BlurFade delay={0.25 * 9} inView>
          <h2 className="mb-12 text-center text-3xl font-bold md:text-5xl">
            Education
          </h2>
        </BlurFade>
        <div className="mx-auto max-w-4xl">
          <BlurFade delay={0.25 * 10} inView>
            <div className="rounded-lg border bg-card p-6 text-center">
              <BookOpenIcon className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">{cvData.education.degree}</h3>
              <p className="mt-1 text-lg text-muted-foreground">
                {cvData.education.fieldOfStudy}
              </p>
              <p className="mt-2 text-muted-foreground">
                {cvData.education.institution}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {cvData.education.dateRange.startDate} - {cvData.education.dateRange.endDate}
              </p>
              {cvData.education.gpa && (
                <p className="mt-2 text-sm font-semibold text-primary">
                  GPA: {cvData.education.gpa}
                </p>
              )}
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Skills Marquee */}
      <section className="py-20">
        <BlurFade delay={0.25 * 11} inView>
          <h2 className="mb-12 text-center text-3xl font-bold md:text-5xl">
            Technical Skills
          </h2>
        </BlurFade>
        <div className="relative">
          <Marquee pauseOnHover className="[--duration:20s]">
            {cvData.skills.map((skill) => (
              <div
                key={skill.name}
                className="rounded-lg border bg-card px-4 py-2"
              >
                <span className="text-sm font-medium">{skill.name}</span>
              </div>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 px-4">
        <BlurFade delay={0.25 * 12} inView>
          <h2 className="mb-12 text-center text-3xl font-bold md:text-5xl">
            Key Achievements
          </h2>
        </BlurFade>
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {cvData.achievements.map((achievement, idx) => (
            <BlurFade key={idx} delay={0.25 * (13 + idx)} inView>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {achievement.metric}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {achievement.label}
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 text-center">
        <BlurFade delay={0.25 * 17} inView>
          <h2 className="mb-8 text-3xl font-bold md:text-5xl">Get In Touch</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Ready to bring fresh ideas and enthusiasm to your team
          </p>
          <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground">
              {cvDataJson.contact.email} • {cvDataJson.contact.phone}
            </p>
            <p className="text-muted-foreground">
              {cvDataJson.contact.location.city}, {cvDataJson.contact.location.state}
            </p>
            <Button size="lg" className="font-semibold mt-4">
              Contact Me
            </Button>
          </div>
        </BlurFade>
      </section>
    </main>
  );
}