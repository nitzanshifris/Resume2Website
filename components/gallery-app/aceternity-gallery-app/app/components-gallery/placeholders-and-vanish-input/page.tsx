"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

// Search placeholders
const searchPlaceholders = [
  "Search for anything...",
  "Try searching for 'React components'",
  "Find your next project idea",
  "Discover amazing UI patterns",
  "What are you looking for?",
];

// Question placeholders
const questionPlaceholders = [
  "What's the first rule of Fight Club?",
  "Who is Tyler Durden?",
  "Where is Andrew Laeddis Hiding?",
  "Write a Javascript method to reverse a string",
  "How to assemble your own PC?",
];

// Professional placeholders
const professionalPlaceholders = [
  "Enter your company name",
  "What's your job title?",
  "Describe your project goals",
  "What services do you need?",
  "How can we help you today?",
];

// Creative placeholders
const creativePlaceholders = [
  "What's your wildest idea?",
  "Describe your dream project",
  "What inspires you today?",
  "Share your creative vision",
  "What story do you want to tell?",
];

export default function PlaceholdersAndVanishInputPage() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input changed:", e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Placeholders And Vanish Input</h1>
          <p className="text-xl text-gray-400">
            Sliding in placeholders and vanish effect of input on submit
          </p>
        </div>

        <div className="space-y-16">
          {/* Search Input */}
          <div className="bg-zinc-900 rounded-lg p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Search Input</h3>
              <p className="text-gray-400 mb-6">
                Perfect for search interfaces with helpful placeholder suggestions.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 min-h-[200px] flex flex-col justify-center">
              <h4 className="text-2xl font-bold text-center mb-8 text-gray-800">
                Search Our Library
              </h4>
              <PlaceholdersAndVanishInput
                placeholders={searchPlaceholders}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            </div>
          </div>

          {/* Q&A Input */}
          <div className="bg-zinc-900 rounded-lg p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Q&A Interface</h3>
              <p className="text-gray-400 mb-6">
                Great for AI chatbots, support systems, and interactive Q&A platforms.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 min-h-[200px] flex flex-col justify-center">
              <h4 className="text-2xl font-bold text-center mb-8 text-gray-800">
                Ask Aceternity UI Anything
              </h4>
              <PlaceholdersAndVanishInput
                placeholders={questionPlaceholders}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            </div>
          </div>

          {/* Professional Form */}
          <div className="bg-zinc-900 rounded-lg p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Professional Form</h3>
              <p className="text-gray-400 mb-6">
                Ideal for business forms, contact forms, and professional inquiries.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-8 min-h-[200px] flex flex-col justify-center">
              <h4 className="text-2xl font-bold text-center mb-8 text-gray-800">
                Get Started Today
              </h4>
              <PlaceholdersAndVanishInput
                placeholders={professionalPlaceholders}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            </div>
          </div>

          {/* Creative Input */}
          <div className="bg-zinc-900 rounded-lg p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Creative Input</h3>
              <p className="text-gray-400 mb-6">
                Perfect for creative platforms, idea submission forms, and inspiration prompts.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-lg p-8 min-h-[200px] flex flex-col justify-center">
              <h4 className="text-2xl font-bold text-center mb-8 text-gray-800">
                Share Your Vision
              </h4>
              <PlaceholdersAndVanishInput
                placeholders={creativePlaceholders}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-16 bg-zinc-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">How to Use</h3>
          <ul className="text-gray-400 space-y-2">
            <li>• Watch the placeholder text cycle automatically every 3 seconds</li>
            <li>• Type in the input field to see your text</li>
            <li>• Press Enter or click the submit button to trigger the vanish effect</li>
            <li>• The text will dissolve into particles with a smooth animation</li>
            <li>• Perfect for creating engaging form interactions</li>
            <li>• Fully responsive and supports dark/light themes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}