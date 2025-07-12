import { Registry } from "@/lib/registry/schema";

export const sparklesRegistry: Registry = {
  sparkles: {
    name: "sparkles",
    type: "registry:ui",
    registryDependencies: [],
    files: [
      {
        path: "components/ui/sparkles/sparkles-base.tsx",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/sparkles/sparkles-demo.tsx",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/sparkles/sparkles.types.ts",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/sparkles/index.tsx",
        type: "registry:ui",
        target: ""
      }
    ],
    tailwind: {
      config: {}
    },
    dependencies: ["@tsparticles/react", "@tsparticles/engine", "@tsparticles/slim"]
  }
};