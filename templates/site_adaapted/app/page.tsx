import { PlayfulHeroSection } from "@/components/ui/playful-hero-section"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import MacbookScrollDemo from "@/components/macbook-scroll-demo"
import { LampDemo } from "@/components/lamp-demo"
import { TestimonialsMarqueeGrid } from "@/components/ui/testimonials-marquee"

const professionalSummary =
  "Recent Bachelor of Marketing & Business Management graduate seeking an internship that will allow for learning the ins and outs of the advertising field and provide an opportunity to add value to ABC Marketing by applying theoretical knowledge into practice. Previous informal experience with social media channel set up and blogging has been gained during university as part of the Campus Newspaper team."

const educationContent = [
  {
    title: "High School Diploma",
    description:
      "Hawthorne High School, Boston. GPA: 3.7. Captain of Athletics Team (State Champions in 2016, Runners Up in 2014). Editor of Hawthorne School News Paper.",
    content: (
      <div className="flex h-full w-full items-center justify-center rounded-md bg-[#0B0B0F]">
        <p className="text-4xl font-bold text-slate-400 font-serif">2014 - 2016</p>
      </div>
    ),
  },
  {
    title: "Advanced Excel Course",
    description:
      "ICT Computer College. Mastered advanced functions, data analysis, and visualization techniques in Microsoft Excel.",
    content: (
      <div className="flex h-full w-full items-center justify-center rounded-md bg-[#0B0B0F]">
        <p className="text-4xl font-bold text-slate-400 font-serif">Fall 2017</p>
      </div>
    ),
  },
  {
    title: "Certificate in HTML",
    description: "Udemy Online. A foundational course covering the structure of web pages using HTML.",
    content: (
      <div className="flex h-full w-full items-center justify-center rounded-md bg-[#0B0B0F]">
        <p className="text-4xl font-bold text-slate-400 font-serif">Spring 2018</p>
      </div>
    ),
  },
  {
    title: "Bachelor of Marketing & Business Management",
    description:
      "Columbus State University, Atlanta. GPA: 3.6. Majors: Marketing & Business Management. Minors: Political Science, Communications and Economics. Awards: Honors Program, Dean's list for 8 Semesters.",
    content: (
      <div className="flex h-full w-full items-center justify-center rounded-md bg-[#0B0B0F]">
        <p className="text-4xl font-bold text-slate-400">2016 - 2019</p>
      </div>
    ),
  },
]

const experienceItems = [
  {
    title: "University News Paper Editor",
    description:
      "Created three new websites for Columbus State University's faculties. Responsible for weekly editor's comments and proofreading all staff write-ups.",
    link: "#",
  },
  {
    title: "Marketing Intern at Coca Cola",
    description:
      "Updated a database of 5000 clients, prepared market studies using quantitative and qualitative data, and conducted competitor analysis.",
    link: "#",
  },
  {
    title: "Business Management Intern at Boston Legal",
    description:
      "Transferred 2000 client files to a new CRM system, assisted with HR and operational tasks, and helped write up policies and procedures.",
    link: "#",
  },
  {
    title: "General Intern at Florida County Healthcare",
    description:
      "Organized weekly Q&A sessions, handled email correspondence, managed phone inquiries, and scheduled travel for directors.",
    link: "#",
  },
  {
    title: "Administrator Externship",
    description:
      "Completed a two-week job shadowing program at the Boston Small Business Association, observing administrative roles.",
    link: "#",
  },
  {
    title: "Volunteer at Sunshine Retirement Village",
    description:
      "Assisted residents with shopping and banking, and organized weekly Bingo games as a weekend Care Giver.",
    link: "#",
  },
]

export default function HomePage() {
  return (
    <main className="bg-[#0B0B0F] text-white">
      <PlayfulHeroSection />
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0B0F]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-8 sm:text-7xl">Professional Summary</h2>
          <TextGenerateEffect words={professionalSummary} className="text-slate-300" />
        </div>
      </section>
      <section className="py-20 bg-[#0B0B0F]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-extrabold text-white mb-12 text-7xl">Education & Courses</h2>
          <StickyScroll content={educationContent} />
        </div>
      </section>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0B0F]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-extrabold text-center text-white mb-12 text-7xl">Experience</h2>
          <HoverEffect items={experienceItems} />
        </div>
      </section>
      <LampDemo />
      <section className="pt-0 pb-10 bg-[#0B0B0F]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-7xl font-extrabold text-center text-white mb-12">Featured Project</h2>
          <MacbookScrollDemo />
        </div>
      </section>
      <section className="bg-[#0B0B0F] py-20">
        <TestimonialsMarqueeGrid />
      </section>
    </main>
  )
}
