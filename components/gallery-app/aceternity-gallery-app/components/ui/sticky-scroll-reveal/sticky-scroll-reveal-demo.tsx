"use client";
import React from "react";
import { StickyScroll } from "./sticky-scroll-reveal-base";
 
 
const content = [
  {
    title: "Collaborative Editing",
    description:
      "Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
        Collaborative Editing
      </div>
    ),
  },
  {
    title: "Real time changes",
    description:
      "See changes as they happen. With our platform, you can track every modification in real time. No more confusion about the latest version of your project. Say goodbye to the chaos of version control and embrace the simplicity of real-time updates.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="/linear.webp"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Version control",
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] text-white">
        Version control
      </div>
    ),
  },
  {
    title: "Running out of content",
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
        Running out of content
      </div>
    ),
  },
];
export function StickyScrollRevealDemo() {
  return (
    <div className="w-full py-4">
      <StickyScroll content={content} />
    </div>
  );
}

// Alternative demo with different content
const portfolioContent = [
  {
    title: "Design Philosophy",
    description:
      "My approach to design combines aesthetics with functionality. Every pixel serves a purpose, and every interaction tells a story. I believe in creating experiences that not only look beautiful but also solve real problems.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500 to-purple-500 text-white">
        <svg className="h-20 w-20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7V12C2 16.5 4.23 20.68 7.62 23.15L12 24L16.38 23.15C19.77 20.68 22 16.5 22 12V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    ),
  },
  {
    title: "Development Process",
    description:
      "From concept to deployment, I follow a structured approach that ensures quality at every step. Starting with wireframes and prototypes, moving through development sprints, and ending with thorough testing and optimization.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
        <svg className="h-20 w-20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    ),
  },
  {
    title: "Client Collaboration",
    description:
      "Communication is key to project success. I maintain transparent dialogue throughout the development process, providing regular updates and incorporating feedback to ensure the final product exceeds expectations.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <svg className="h-20 w-20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    ),
  },
  {
    title: "Continuous Innovation",
    description:
      "Technology evolves rapidly, and so do I. I stay current with the latest frameworks, tools, and best practices to deliver cutting-edge solutions that are both modern and maintainable.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-500 to-rose-500 text-white">
        <svg className="h-20 w-20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    ),
  },
];

export function StickyScrollPortfolio() {
  return (
    <div className="w-full py-4">
      <StickyScroll content={portfolioContent} />
    </div>
  );
}

// Product features demo
const productContent = [
  {
    title: "Analytics Dashboard",
    description:
      "Get real-time insights into your business performance. Track key metrics, monitor trends, and make data-driven decisions with our comprehensive analytics suite.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500 text-white">
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">87%</div>
          <div className="text-sm">Performance Increase</div>
        </div>
      </div>
    ),
  },
  {
    title: "Team Management",
    description:
      "Efficiently manage your team with role-based permissions, task assignments, and progress tracking. Foster collaboration and keep everyone aligned with your goals.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
        <div className="grid grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-12 h-12 bg-white/20 rounded-lg" />
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Automated Workflows",
    description:
      "Save time with automated processes. Set up custom workflows that handle repetitive tasks, send notifications, and keep your operations running smoothly.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
        <div className="space-y-2">
          <div className="h-2 w-40 bg-white/30 rounded" />
          <div className="h-2 w-32 bg-white/50 rounded" />
          <div className="h-2 w-36 bg-white/70 rounded" />
          <div className="h-2 w-28 bg-white/90 rounded" />
        </div>
      </div>
    ),
  },
  {
    title: "Security First",
    description:
      "Your data is protected with enterprise-grade security. End-to-end encryption, regular backups, and compliance with industry standards ensure your information stays safe.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-white">
        <svg className="h-24 w-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L4 7V11C4 15.5 6.5 19.7 10 21.8C10.6 22.1 11.3 22.1 12 22C12.7 22.1 13.4 22.1 14 21.8C17.5 19.7 20 15.5 20 11V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    ),
  },
];

export function StickyScrollProduct() {
  return (
    <div className="w-full py-4">
      <StickyScroll content={productContent} />
    </div>
  );
}

// Custom content styling demo
export function StickyScrollCustomStyling() {
  return (
    <div className="w-full py-4">
      <StickyScroll 
        content={content} 
        contentClassName="rounded-2xl border border-neutral-200 dark:border-neutral-800"
      />
    </div>
  );
}