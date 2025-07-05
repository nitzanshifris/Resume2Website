import type { ComponentConfig } from "@/component-library/metadata/types";

export const timelineConfig: ComponentConfig = {
  name: "timeline",
  title: "Timeline",
  description: "A timeline component with sticky header and scroll beam follow",
  dependencies: ["motion", "clsx", "tailwind-merge", "@tabler/icons-react"],
  filesRequired: [
    "timeline-base.tsx",
    "timeline-demo.tsx", 
    "timeline.types.ts",
    "index.tsx"
  ],
  usage: `import { Timeline } from "@/components/ui/timeline";

const data = [
  {
    title: "2024",
    content: (
      <div>
        <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          Built and launched Aceternity UI and Aceternity UI Pro from scratch
        </p>
      </div>
    ),
  },
  {
    title: "Early 2023", 
    content: (
      <div>
        <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          Started working on the component library
        </p>
      </div>
    ),
  },
];

<Timeline data={data} />`,
  variants: [
    {
      name: "default",
      description: "Default timeline with scroll animation"
    }
  ],
  features: [
    "Scroll-animated progress beam",
    "Sticky timeline headers", 
    "Rich content support",
    "Responsive design",
    "Dark mode support",
    "Smooth scroll-based animations"
  ],
  examples: [
    {
      title: "Basic Timeline",
      code: `<Timeline data={[
  {
    title: "2024",
    content: <p>Content for 2024</p>
  },
  {
    title: "2023", 
    content: <p>Content for 2023</p>
  }
]} />`
    },
    {
      title: "Timeline with Images",
      code: `<Timeline data={[
  {
    title: "Projects",
    content: (
      <div className="grid grid-cols-2 gap-4">
        <img src="/image1.jpg" alt="Project 1" className="rounded-lg" />
        <img src="/image2.jpg" alt="Project 2" className="rounded-lg" />
      </div>
    )
  }
]} />`
    }
  ],
  installCommand: "npx shadcn@latest add timeline"
};