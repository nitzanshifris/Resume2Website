"use client";

import React from "react";
import { FloatingDockStandardDemo, FloatingDockMinimalDemo, FloatingDockPortfolioDemo } from "@/components/ui/floating-dock";

export default function FloatingDockGallery() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Floating Dock
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            A macOS-style floating dock component with smooth animations and hover effects. Perfect for navigation menus, social links, or quick action bars.
          </p>
        </div>

        <div className="space-y-20">
          {/* Standard Demo */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white text-center">Standard Dock</h2>
            <p className="text-neutral-400 text-center">Full-featured dock with multiple navigation items</p>
            <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 p-8">
              <FloatingDockStandardDemo />
            </div>
          </div>

          {/* Minimal Demo */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white text-center">Minimal Dock</h2>
            <p className="text-neutral-400 text-center">Simple dock with essential navigation</p>
            <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 p-8">
              <FloatingDockMinimalDemo />
            </div>
          </div>

          {/* Portfolio Demo */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white text-center">Portfolio Dock</h2>
            <p className="text-neutral-400 text-center">Tailored for portfolio websites with social links</p>
            <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 p-8">
              <FloatingDockPortfolioDemo />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950">
            <h3 className="text-lg font-semibold text-white mb-2">Responsive Design</h3>
            <p className="text-neutral-400 text-sm">Desktop dock with hover animations, mobile-friendly drawer</p>
          </div>
          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950">
            <h3 className="text-lg font-semibold text-white mb-2">Smooth Animations</h3>
            <p className="text-neutral-400 text-sm">Spring-based hover effects and size transitions</p>
          </div>
          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950">
            <h3 className="text-lg font-semibold text-white mb-2">Dark Mode Support</h3>
            <p className="text-neutral-400 text-sm">Built-in dark mode compatibility</p>
          </div>
          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950">
            <h3 className="text-lg font-semibold text-white mb-2">TypeScript Ready</h3>
            <p className="text-neutral-400 text-sm">Full type safety with interfaces</p>
          </div>
          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950">
            <h3 className="text-lg font-semibold text-white mb-2">Icon Support</h3>
            <p className="text-neutral-400 text-sm">Works with Tabler Icons or custom React components</p>
          </div>
          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950">
            <h3 className="text-lg font-semibold text-white mb-2">Easy Customization</h3>
            <p className="text-neutral-400 text-sm">Position and style with className props</p>
          </div>
        </div>
      </div>
    </div>
  );
}