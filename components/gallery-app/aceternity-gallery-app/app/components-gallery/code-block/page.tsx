"use client";

import { CodeBlockDemo, CodeBlockDemoSecond } from "@/component-library/components/ui/code-block";

export default function CodeBlockPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Code Block</h1>
        <p className="text-gray-400 mb-12 text-center">
          A configurable code block component built on top of react-syntax-highlighter.
        </p>
        
        <div className="space-y-16">
          {/* Basic Code Block */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-8">Basic Code Block</h2>
            <CodeBlockDemo />
          </section>

          {/* Code Block with Tabs */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-8">Code Block with Multiple Tabs</h2>
            <CodeBlockDemoSecond />
          </section>
        </div>
      </div>
    </div>
  );
}