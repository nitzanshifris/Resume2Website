"use client";
import React from "react";
import { Meteors } from "./meteors-base";

// Gallery preview components with consistent sizing
export function MeteorsGalleryBasic() {
  return (
    <div className="py-20 flex items-center justify-center bg-black w-full px-8 h-[32rem]">
      <div className="relative w-full max-w-xl h-96">
        <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-red-500 bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl" />
        <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 px-4 py-8 shadow-xl">
          <div className="mb-4 flex h-5 w-5 items-center justify-center rounded-full border border-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-2 w-2 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
              />
            </svg>
          </div>

          <h1 className="relative z-50 mb-4 text-xl font-bold text-white">
            Meteors because they&apos;re cool
          </h1>

          <p className="relative z-50 mb-4 text-base font-normal text-slate-500">
            Beautiful meteor animations that fall across your content. 
            Perfect for adding dynamic movement to your landing pages and hero sections.
          </p>

          <button className="rounded-lg border border-gray-500 px-4 py-1 text-gray-300 hover:bg-gray-800 transition-colors">
            Explore
          </button>

          <Meteors number={20} />
        </div>
      </div>
    </div>
  );
}

export function MeteorsGalleryCards() {
  return (
    <div className="py-20 bg-gray-900 w-full px-8 h-[32rem]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="relative">
            <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl" />
            <div className="relative flex h-80 flex-col items-start justify-end overflow-hidden rounded-2xl border border-purple-800 bg-purple-900/20 px-6 py-6 shadow-xl">
              <h2 className="relative z-50 mb-3 text-lg font-bold text-white">
                Premium Features
              </h2>
              <p className="relative z-50 mb-4 text-sm text-purple-200">
                Unlock advanced functionality with our premium tier.
              </p>
              <button className="rounded-lg border border-purple-500 px-3 py-1 text-purple-300 text-sm hover:bg-purple-800/30 transition-colors">
                Upgrade Now
              </button>
              <Meteors number={15} className="bg-purple-400" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-gradient-to-r from-green-500 to-emerald-500 blur-3xl" />
            <div className="relative flex h-80 flex-col items-start justify-end overflow-hidden rounded-2xl border border-green-800 bg-green-900/20 px-6 py-6 shadow-xl">
              <h2 className="relative z-50 mb-3 text-lg font-bold text-white">
                Analytics Dashboard
              </h2>
              <p className="relative z-50 mb-4 text-sm text-green-200">
                Track your performance with real-time insights.
              </p>
              <button className="rounded-lg border border-green-500 px-3 py-1 text-green-300 text-sm hover:bg-green-800/30 transition-colors">
                View Dashboard
              </button>
              <Meteors number={12} className="bg-green-400" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-gradient-to-r from-orange-500 to-red-500 blur-3xl" />
            <div className="relative flex h-80 flex-col items-start justify-end overflow-hidden rounded-2xl border border-orange-800 bg-orange-900/20 px-6 py-6 shadow-xl">
              <h2 className="relative z-50 mb-3 text-lg font-bold text-white">
                Team Collaboration
              </h2>
              <p className="relative z-50 mb-4 text-sm text-orange-200">
                Work together seamlessly with your team.
              </p>
              <button className="rounded-lg border border-orange-500 px-3 py-1 text-orange-300 text-sm hover:bg-orange-800/30 transition-colors">
                Invite Team
              </button>
              <Meteors number={18} className="bg-orange-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MeteorsGalleryHero() {
  return (
    <div className="py-20 bg-gradient-to-br from-black via-gray-900 to-black w-full px-8 h-[32rem]">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/50 px-8 py-16">
          <h1 className="relative z-50 mb-6 text-4xl md:text-6xl font-bold text-white">
            Launch Your Dreams
          </h1>
          <p className="relative z-50 mb-8 text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the magic of meteors as they light up your journey to success. 
            Every falling star represents a new opportunity.
          </p>
          <div className="relative z-50 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">
              Get Started
            </button>
            <button className="px-8 py-3 border border-gray-500 text-white rounded-lg hover:bg-gray-800 transition-colors">
              Learn More
            </button>
          </div>
          <Meteors number={30} />
        </div>
      </div>
    </div>
  );
}

export function MeteorsGalleryPortfolio() {
  return (
    <div className="py-20 bg-black w-full px-8 h-[32rem]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Featured Projects</h2>
          <p className="text-gray-400">Discover my latest work and achievements</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <div className="absolute inset-0 h-full w-full scale-[0.90] transform rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 blur-2xl opacity-70" />
            <div className="relative flex h-72 flex-col justify-between overflow-hidden rounded-xl border border-blue-800 bg-blue-900/10 p-6 shadow-xl">
              <div>
                <h3 className="relative z-50 text-xl font-bold text-white mb-2">
                  E-Commerce Platform
                </h3>
                <p className="relative z-50 text-blue-200 text-sm mb-4">
                  Full-stack e-commerce solution built with React, Node.js, and MongoDB. 
                  Features real-time inventory, payment processing, and admin dashboard.
                </p>
              </div>
              <div className="relative z-50 flex gap-2">
                <span className="px-2 py-1 bg-blue-800/50 text-blue-200 text-xs rounded">React</span>
                <span className="px-2 py-1 bg-blue-800/50 text-blue-200 text-xs rounded">Node.js</span>
                <span className="px-2 py-1 bg-blue-800/50 text-blue-200 text-xs rounded">MongoDB</span>
              </div>
              <Meteors number={10} className="bg-blue-400" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 h-full w-full scale-[0.90] transform rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 blur-2xl opacity-70" />
            <div className="relative flex h-72 flex-col justify-between overflow-hidden rounded-xl border border-violet-800 bg-violet-900/10 p-6 shadow-xl">
              <div>
                <h3 className="relative z-50 text-xl font-bold text-white mb-2">
                  AI Chat Assistant
                </h3>
                <p className="relative z-50 text-violet-200 text-sm mb-4">
                  Intelligent chatbot powered by machine learning algorithms. 
                  Provides 24/7 customer support with natural language processing.
                </p>
              </div>
              <div className="relative z-50 flex gap-2">
                <span className="px-2 py-1 bg-violet-800/50 text-violet-200 text-xs rounded">Python</span>
                <span className="px-2 py-1 bg-violet-800/50 text-violet-200 text-xs rounded">TensorFlow</span>
                <span className="px-2 py-1 bg-violet-800/50 text-violet-200 text-xs rounded">NLP</span>
              </div>
              <Meteors number={10} className="bg-violet-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}