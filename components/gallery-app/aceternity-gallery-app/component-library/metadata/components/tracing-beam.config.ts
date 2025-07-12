import type { ComponentConfig } from "@/component-library/metadata/types";

export const tracingBeamConfig: ComponentConfig = {
  name: "tracing-beam",
  title: "Tracing Beam",
  description: "A Beam that follows the path of an SVG as the user scrolls. Adjusts beam length with scroll speed.",
  dependencies: ["motion", "clsx", "tailwind-merge"],
  filesRequired: [
    "tracing-beam-base.tsx",
    "tracing-beam-demo.tsx", 
    "tracing-beam.types.ts",
    "index.tsx"
  ],
  usage: `import { TracingBeam } from "@/components/ui/tracing-beam";

<TracingBeam className="px-6">
  <div className="max-w-2xl mx-auto antialiased pt-4 relative">
    {/* Your scrollable content goes here */}
  </div>
</TracingBeam>`,
  variants: [
    {
      name: "default",
      description: "Default tracing beam with gradient animation"
    }
  ],
  features: [
    "Scroll-animated SVG beam",
    "Dynamic gradient positioning",
    "Speed-responsive animation",
    "Content wrapper component",
    "Smooth spring physics",
    "Responsive design"
  ],
  examples: [
    {
      title: "Basic Usage",
      code: `<TracingBeam>
  <div className="max-w-2xl mx-auto">
    <h1>Welcome</h1>
    <p>Scroll down to see the beam follow your progress.</p>
  </div>
</TracingBeam>`
    },
    {
      title: "Blog Layout",
      code: `<TracingBeam className="px-6">
  <article className="max-w-2xl mx-auto antialiased pt-4 relative">
    {articles.map((item, index) => (
      <div key={index} className="mb-10">
        <h2 className="bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4">
          {item.category}
        </h2>
        <h3 className="text-xl font-bold mb-4">
          {item.title}
        </h3>
        <div className="prose prose-sm">
          {item.content}
        </div>
      </div>
    ))}
  </article>
</TracingBeam>`
    }
  ],
  installCommand: "npx shadcn@latest add tracing-beam"
};