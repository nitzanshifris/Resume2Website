import { Registry } from "@/lib/registry/schema";

export const spotlightRegistry: Registry = {
  spotlight: {
    name: "spotlight",
    type: "registry:ui",
    registryDependencies: [],
    files: [
      {
        path: "components/ui/spotlight/spotlight-base.tsx",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/spotlight/spotlight-demo.tsx",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/spotlight/spotlight.types.ts",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/spotlight/index.tsx",
        type: "registry:ui",
        target: ""
      }
    ],
    tailwind: {
      config: {
        keyframes: {
          "spotlight": {
            "0%": { opacity: 0, transform: "translate(-72%, -62%) scale(0.5)" },
            "100%": { opacity: 1, transform: "translate(-50%, -40%) scale(1)" }
          }
        },
        animation: {
          "spotlight": "spotlight 2s ease .75s 1 forwards"
        }
      }
    },
    dependencies: []
  }
};