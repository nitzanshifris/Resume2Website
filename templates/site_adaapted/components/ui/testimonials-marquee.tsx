"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import Marquee from "react-fast-marquee"

export function TestimonialsMarqueeGrid() {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 pt-20 overflow-hidden h-full ">
      <div className="pb-20 text-center">
        <h1 className="pt-4 font-bold text-3xl text-white md:text-6xl">Kind Words From Colleagues & Mentors</h1>
        <p className="mt-4 text-neutral-200 text-2xl">
          Hear what professors, managers, and community leaders have to say about Michelle.
        </p>
      </div>
      <div className="relative">
        <div className="h-full overflow-hidden w-full bg-[#0B0B0F]">
          <TestimonialsGrid />
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-40 w-full bg-gradient-to-t from-[#0B0B0F] to-transparent"></div>
    </div>
  )
}

export const TestimonialsGrid = () => {
  const first = testimonials.slice(0, 6)
  const second = testimonials.slice(6, 12)

  return (
    <div className="relative [mask-image:linear-gradient(to_right,transparent_0%,white_10%,white_90%,transparent_100%)]">
      <Marquee direction="right" pauseOnHover speed={50}>
        {first.map((testimonial, index) => (
          <Card key={`testimonial-${testimonial.name}-${index}`}>
            <Quote>{testimonial.quote}</Quote>
            <div className="flex gap-2 items-center mt-8">
              <div className="flex flex-col">
                <QuoteDescription className="text-neutral-300">{testimonial.name}</QuoteDescription>
                <QuoteDescription className="text-neutral-400">{testimonial.designation}</QuoteDescription>
              </div>
            </div>
          </Card>
        ))}
      </Marquee>
      <Marquee className="mt-10" direction="right" pauseOnHover speed={70}>
        {second.map((testimonial, index) => (
          <Card key={`testimonial-${testimonial.name}-${index}`}>
            <Quote>{testimonial.quote}</Quote>
            <div className="flex gap-2 items-center mt-8">
              <div className="flex flex-col">
                <QuoteDescription className="text-neutral-300">{testimonial.name}</QuoteDescription>
                <QuoteDescription className="text-neutral-400">{testimonial.designation}</QuoteDescription>
              </div>
            </div>
          </Card>
        ))}
      </Marquee>
    </div>
  )
}

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "p-4 md:p-8 rounded-xl min-h-[230px] h-full max-w-md md:max-w-lg mx-4 bg-neutral-900 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group",
        className,
      )}
    >
      {children}
    </div>
  )
}

export const Quote = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h3 className={cn("font-semibold text-white py-2 text-base", className)}>{children}</h3>
}

export const QuoteDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <p className={cn("text-xs md:text-sm font-normal text-neutral-400 max-w-sm", className)}>{children}</p>
}

interface Testimonial {
  quote: string
  name: string
  designation?: string
}

export const testimonials: Testimonial[] = [
  {
    name: "Dr. Alistair Finch",
    quote:
      "Michelle was one of the most engaged students in my Strategic Marketing course. Her insightful analysis and creative approach to case studies were consistently impressive. She has a bright future in the advertising world.",
    designation: "Professor of Marketing, Columbus State University",
  },
  {
    name: "Sarah Jenkins",
    quote:
      "During her internship, Michelle was a proactive and valuable member of our team. She handled complex data analysis for market studies with ease and brought fresh ideas to our competitor analysis projects. A true asset.",
    designation: "Senior Marketing Manager, Coca-Cola",
  },
  {
    name: "Maria Rodriguez",
    quote:
      "Michelle's dedication to our residents was heartwarming. She didn't just help with tasks; she built genuine connections and brought so much joy with her weekly Bingo games. Her compassion is as remarkable as her work ethic.",
    designation: "Volunteer Coordinator, Sunshine Retirement Village",
  },
  {
    name: "David Chen",
    quote:
      "Working with Michelle on the campus newspaper was a pleasure. She has a natural talent for content creation and a keen eye for detail. Her work on the new faculty websites significantly boosted their online presence.",
    designation: "Editor-in-Chief, CSU Campus Newspaper",
  },
  {
    name: "Robert Paulson",
    quote:
      "Michelle's efficiency is top-notch. She flawlessly managed the transfer of over 2000 client files to our new CRM and was instrumental in drafting new operational policies. She's a quick learner and incredibly organized.",
    designation: "Operations Director, Boston Legal",
  },
  {
    name: "Emily White",
    quote:
      "We were so grateful for Michelle's help with our annual food drive. She managed our social media outreach, which led to a 30% increase in donations. Her marketing skills are a huge benefit to any cause she supports.",
    designation: "Organizer, Annual City Food Drive",
  },
  {
    name: "Dr. Susan Wheeler",
    quote:
      "Michelle consistently demonstrated strong leadership and analytical skills in my Business Management capstone project. Her ability to synthesize complex information and present it clearly is a rare talent.",
    designation: "Professor of Business, Columbus State University",
  },
  {
    name: "James Peterson",
    quote:
      "Michelle volunteered her time to revamp our online adoption profiles and social media. The result was a significant increase in adoption inquiries. Her passion for helping our animals find homes was evident in everything she did.",
    designation: "Director, Local Animal Shelter",
  },
  {
    name: "Tom Harris",
    quote:
      "I was impressed by how quickly Michelle adapted to the fast-paced environment here. She's a team player who is always willing to help out, whether it's with HR tasks or operational support. Great attitude.",
    designation: "HR Assistant, Boston Legal",
  },
  {
    name: "Linda Carter",
    quote:
      "Even during her short externship, Michelle showed great promise. She was observant, asked intelligent questions, and showed a genuine interest in understanding the administrative backbone of small businesses.",
    designation: "Administrator, Boston Small Business Association",
  },
  {
    name: "Ben Carter",
    quote:
      "Building houses with Michelle for Habitat for Humanity was an amazing experience. She's not afraid to get her hands dirty and works tirelessly. Her commitment to community building is truly inspiring.",
    designation: "Fellow Volunteer, Habitat for Humanity",
  },
  {
    name: "Chloe Davis",
    quote:
      "Group projects with Michelle were always a success. She's a natural leader who knows how to motivate a team and ensure everyone contributes their best work. Her positive energy is contagious.",
    designation: "Fellow Graduate, Columbus State University",
  },
]
