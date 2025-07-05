"use client";

import React from "react";
import { SignupFormDemo, LoginFormDemo, ContactFormDemo } from "@/components/ui/signup-form/signup-form-demo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignupFormGalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <Link href="/components-gallery">
          <Button
            variant="ghost"
            className="mb-8 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Signup Form
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl">
            A customizable form built on top of shadcn&apos;s input and label, with a touch of framer motion
          </p>
        </div>

        {/* Examples */}
        <div className="space-y-16">
          {/* Signup Form */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Signup Form
            </h2>
            <div className="bg-zinc-900/50 rounded-lg p-8 border border-zinc-800 flex items-center justify-center min-h-[600px]">
              <SignupFormDemo />
            </div>
          </section>

          {/* Login Form */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Login Form Variant
            </h2>
            <div className="bg-zinc-900/50 rounded-lg p-8 border border-zinc-800 flex items-center justify-center min-h-[500px]">
              <LoginFormDemo />
            </div>
          </section>

          {/* Contact Form */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Contact Form Variant
            </h2>
            <div className="bg-zinc-900/50 rounded-lg p-8 border border-zinc-800 flex items-center justify-center min-h-[550px]">
              <ContactFormDemo />
            </div>
          </section>

          {/* Code Example */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Usage Example
            </h2>
            <div className="bg-zinc-800 rounded-lg p-6">
              <pre className="text-zinc-300 overflow-x-auto">
                <code>{`import { SignupFormDemo } from "@/components/ui/signup-form";

export function MySignupPage() {
  const handleSubmit = (data) => {
    console.log("Form data:", data);
    // Handle form submission
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignupFormDemo onSubmit={handleSubmit} />
    </div>
  );
}`}</code>
              </pre>
            </div>
          </section>

          {/* Component Structure */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Component Structure
            </h2>
            <div className="bg-zinc-800 rounded-lg p-6">
              <pre className="text-zinc-300 overflow-x-auto">
                <code>{`// The form uses enhanced Input and Label components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Input component features:
// - Framer Motion hover effect with radial gradient
// - Custom shadow styling
// - Dark mode support

// Label component features:
// - Built on @radix-ui/react-label
// - Accessibility features
// - Dark mode support

// LabelInputContainer helper:
const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};`}</code>
              </pre>
            </div>
          </section>

          {/* Props Documentation */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Props Documentation
            </h2>
            <div className="bg-zinc-800 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">SignupForm Props</h3>
                <ul className="space-y-2 text-zinc-300">
                  <li>• <code className="text-blue-400">className</code>: string - Additional CSS classes</li>
                  <li>• <code className="text-blue-400">onSubmit</code>: function - Form submission handler</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Input Props</h3>
                <ul className="space-y-2 text-zinc-300">
                  <li>• All standard HTML input attributes</li>
                  <li>• Enhanced with Framer Motion animations</li>
                  <li>• Custom shadow and hover effects</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Label Props</h3>
                <ul className="space-y-2 text-zinc-300">
                  <li>• All Radix UI Label primitive props</li>
                  <li>• <code className="text-blue-400">className</code>: string - Additional CSS classes</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}