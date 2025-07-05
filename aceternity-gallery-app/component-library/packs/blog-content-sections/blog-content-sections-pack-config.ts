import { FileText, ListTree } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { BlogContentCentered, BlogContentWithToc } from "./blog-content-sections-base";

// Define all blog content section variants
const blogContentSectionsVariants: PackVariant[] = [
  {
    id: "blog-content-centered",
    title: "Blog Content Centered",
    description: "Centered blog post layout with hero image, author info, and markdown content rendering",
    icon: FileText,
    component: BlogContentCentered,
    tags: ["blog", "content", "markdown", "centered", "prose"],
    featured: true,
    codeExample: `import { BlogContentCentered } from "@/packs/blog-content-sections";

export function MyBlogPost() {
  return <BlogContentCentered />;
}`,
  },
  {
    id: "blog-content-with-toc",
    title: "Blog Content With TOC",
    description: "Blog post layout with sticky table of contents, responsive mobile menu, and smooth scroll navigation",
    icon: ListTree,
    component: BlogContentWithToc,
    tags: ["blog", "content", "markdown", "toc", "navigation", "sticky", "responsive"],
    featured: false,
    codeExample: `import { BlogContentWithToc } from "@/packs/blog-content-sections";

export function MyBlogPost() {
  return <BlogContentWithToc />;
}`,
  },
];

// Define the complete blog content sections pack
const blogContentSectionsPack: ComponentPack = {
  id: "blog-content-sections",
  name: "blog-content-sections",
  title: "Blog Content Sections",
  description: "Content sections for your single blog posts. Beautiful layouts with markdown support and prose styling.",
  icon: FileText,
  category: "content",
  variants: blogContentSectionsVariants,
  tags: ["blog", "content", "markdown", "prose", "single-post"],
  dependencies: [
    "motion",
    "clsx",
    "tailwind-merge",
    "@tabler/icons-react",
    "@tailwindcss/typography",
    "react-markdown",
    "date-fns",
  ],
  implemented: true,
  featured: true,
  version: "1.0.0",
  author: "Aceternity",
  license: "MIT",
  repository: "https://github.com/aceternity/blog-content-sections",
  documentation: "/packs-gallery/blog-content-sections",
  installCommand: "npm i motion clsx tailwind-merge @tabler/icons-react @tailwindcss/typography react-markdown date-fns",
  importExample: `import { 
  BlogContentCentered,
  BlogContentWithToc
} from "@/packs/blog-content-sections";`,
};

// Register the pack
registerPack(blogContentSectionsPack);

// Export for external use
export { blogContentSectionsPack, blogContentSectionsVariants };
export default blogContentSectionsPack;