import { Registry } from "@/lib/registry/schema";

export const sidebarRegistry: Registry = {
  sidebar: {
    name: "sidebar",
    type: "registry:ui",
    registryDependencies: [],
    files: [
      {
        path: "components/ui/sidebar/sidebar-base.tsx",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/sidebar/sidebar-demo.tsx",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/sidebar/sidebar.types.ts",
        type: "registry:ui",
        target: ""
      },
      {
        path: "components/ui/sidebar/index.tsx",
        type: "registry:ui",
        target: ""
      }
    ],
    tailwind: {
      config: {}
    },
    dependencies: ["@tabler/icons-react"]
  }
};