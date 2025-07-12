import { Registry } from "@/lib/registry/schema";

export const starsBackgroundRegistry: Registry = {
  stars_background: {
    name: "stars-background",
    type: "registry:ui",
    registryDependencies: [],
    files: [
      {
        path: "components/ui/stars-background/stars-background-base.tsx",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/stars-background/stars-background-demo.tsx",
        type: "registry:ui", 
        target: ""
      },
      {
        path: "components/ui/stars-background/stars-background.types.ts",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/stars-background/index.tsx",
        type: "registry:ui",
        target: ""
      }
    ],
    tailwind: {
      config: {}
    }
  }
};