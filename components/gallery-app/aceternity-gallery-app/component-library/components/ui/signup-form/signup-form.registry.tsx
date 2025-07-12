import { Registry } from "@/lib/registry/schema";

export const signupFormRegistry: Registry = {
  "signup-form": {
    name: "signup-form",
    type: "registry:ui",
    registryDependencies: [],
    files: [
      {
        path: "components/ui/signup-form/signup-form-base.tsx",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/signup-form/signup-form-demo.tsx",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/signup-form/signup-form.types.ts",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/signup-form/index.tsx",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/input.tsx",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/label.tsx",
        type: "registry:ui",
        target: ""
      }
    ],
    tailwind: {
      config: {
        theme: {
          extend: {
            boxShadow: {
              input: "0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)"
            }
          }
        }
      }
    },
    cssVars: {
      light: {
        "--shadow-input": "0px 2px 3px -1px rgba(0, 0, 0, 0.1), 0px 1px 0px 0px rgba(25, 28, 33, 0.02), 0px 0px 0px 1px rgba(25, 28, 33, 0.08)"
      },
      dark: {
        "--shadow-input": "0px 2px 3px -1px rgba(0, 0, 0, 0.1), 0px 1px 0px 0px rgba(25, 28, 33, 0.02), 0px 0px 0px 1px rgba(25, 28, 33, 0.08)"
      }
    },
    dependencies: ["@radix-ui/react-label", "@tabler/icons-react"]
  }
};