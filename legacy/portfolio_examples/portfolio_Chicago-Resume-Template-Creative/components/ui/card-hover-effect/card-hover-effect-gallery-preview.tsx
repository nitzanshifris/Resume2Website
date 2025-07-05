"use client";
import { HoverEffect } from "./card-hover-effect-base";

// Gallery preview components with consistent sizing
export function CardHoverEffectGalleryBasic() {
  const items = [
    {
      title: "Stripe",
      description: "A technology company that builds economic infrastructure for the internet.",
      link: "#",
    },
    {
      title: "Netflix",
      description: "A streaming service that offers a wide variety of award-winning content.",
      link: "#",
    },
    {
      title: "Google",
      description: "A multinational technology company specializing in Internet services.",
      link: "#",
    },
    {
      title: "Meta",
      description: "A technology company focused on building the metaverse.",
      link: "#",
    },
    {
      title: "Amazon",
      description: "A multinational technology company focusing on e-commerce and cloud.",
      link: "#",
    },
    {
      title: "Microsoft",
      description: "A technology company that develops and supports software and services.",
      link: "#",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <HoverEffect items={items} />
    </div>
  );
}

export function CardHoverEffectGalleryPortfolio() {
  const portfolioItems = [
    {
      title: "E-Commerce Platform",
      description: "Built a full-stack e-commerce solution with React, Node.js, and MongoDB.",
      link: "#",
    },
    {
      title: "Social Media Dashboard",
      description: "Developed a real-time analytics dashboard for social media metrics.",
      link: "#",
    },
    {
      title: "AI Chatbot",
      description: "Created an intelligent chatbot using natural language processing.",
      link: "#",
    },
    {
      title: "Mobile Banking App",
      description: "Designed and developed a secure mobile banking application.",
      link: "#",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-8 py-12 bg-gray-900">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">My Projects</h2>
      <HoverEffect items={portfolioItems} className="grid-cols-1 md:grid-cols-2" />
    </div>
  );
}

export function CardHoverEffectGalleryServices() {
  const services = [
    {
      title: "Web Development",
      description: "Custom websites and web applications built with modern technologies.",
      link: "#",
    },
    {
      title: "UI/UX Design",
      description: "Beautiful and intuitive user interfaces that delight your customers.",
      link: "#",
    },
    {
      title: "Mobile Development",
      description: "Native and cross-platform mobile apps for iOS and Android.",
      link: "#",
    },
    {
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and deployment strategies.",
      link: "#",
    },
    {
      title: "Consulting",
      description: "Technical consulting and architecture design for your projects.",
      link: "#",
    },
    {
      title: "Support & Maintenance",
      description: "Ongoing support and maintenance for your applications.",
      link: "#",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-8 py-12 bg-gradient-to-br from-purple-900 to-blue-900">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
        <p className="text-gray-300 text-lg">We offer a wide range of development services</p>
      </div>
      <HoverEffect items={services} />
    </div>
  );
}

export function CardHoverEffectGalleryTeam() {
  const teamMembers = [
    {
      title: "John Doe - CEO",
      description: "Visionary leader with 15+ years of experience in tech startups.",
      link: "#",
    },
    {
      title: "Jane Smith - CTO",
      description: "Technical expert specializing in scalable architecture design.",
      link: "#",
    },
    {
      title: "Mike Johnson - Lead Developer",
      description: "Full-stack developer passionate about clean code and best practices.",
      link: "#",
    },
    {
      title: "Sarah Williams - Designer",
      description: "Creative designer focused on user-centered design principles.",
      link: "#",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-8 py-12 bg-black">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
        <p className="text-gray-400">The people behind our success</p>
      </div>
      <HoverEffect items={teamMembers} className="grid-cols-1 md:grid-cols-2" />
    </div>
  );
}