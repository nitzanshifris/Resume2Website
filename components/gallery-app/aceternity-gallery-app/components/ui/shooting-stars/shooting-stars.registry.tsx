import { Registry } from "@/lib/registry/schema";

export const shootingStarsRegistry: Registry = {
  shooting_stars: {
    name: "shooting-stars",
    type: "registry:ui",
    registryDependencies: ["stars-background"],
    files: [
      {
        path: "components/ui/shooting-stars/shooting-stars-base.tsx",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/shooting-stars/shooting-stars-demo.tsx", 
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/shooting-stars/shooting-stars.types.ts",
        type: "registry:ui", 
        target: ""
      },
      {
        path: "components/ui/shooting-stars/index.tsx",
        type: "registry:ui",
        target: ""
      }
    ],
    tailwind: {
      config: {}
    }
  }
};