import { FileText, Search } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { SimpleBlogWithGrid, BlogWithSearch } from "./blog-sections-base";

// Define all blog section variants
const blogSectionsVariants: PackVariant[] = [
  {
    id: "simple-blog-with-grid",
    title: "Simple Blog with Grid",
    description: "Clean blog layout with grid pattern background and blog cards featuring blur image loading",
    icon: FileText,
    component: SimpleBlogWithGrid,
    tags: ["blog", "grid", "cards", "minimal"],
    featured: true,
    codeExample: `import { SimpleBlogWithGrid } from "@/packs/blog-sections";

export function MyBlogSection() {
  return <SimpleBlogWithGrid />;
}`,
  },
  {
    id: "blog-with-search",
    title: "Blog with Search",
    description: "Blog layout with fuzzy search functionality, featured post, and date formatting",
    icon: Search,
    component: BlogWithSearch,
    tags: ["blog", "search", "filters", "fuzzy-search", "date"],
    featured: false,
    codeExample: `import { BlogWithSearch } from "@/packs/blog-sections";

export function MyBlogSection() {
  return <BlogWithSearch />;
}`,
  },
];

// Define the complete blog sections pack
const blogSectionsPack: ComponentPack = {
  id: "blog-sections",
  name: "blog-sections",
  title: "Blog Sections",
  description: "Blog sections with search and filters. Beautiful, responsive blog layouts with modern design.",
  icon: FileText,
  category: "content",
  variants: blogSectionsVariants,
  tags: ["blog", "content", "sections", "grid", "cards"],
  dependencies: [
    "motion",
    "clsx",
    "tailwind-merge",
    "date-fns",
    "fuzzy-search",
  ],
  implemented: true,
  featured: true,
  version: "1.0.0",
  author: "Aceternity",
  license: "MIT",
  repository: "https://github.com/aceternity/blog-sections",
  documentation: "/packs-gallery/blog-sections",
  installCommand: "npm i motion clsx tailwind-merge date-fns fuzzy-search",
  importExample: `import { 
  SimpleBlogWithGrid,
  BlogWithSearch,
  BlogCard,
  BlogCardWithDate,
  BlogPostRows,
  BlogPostRow,
  BlurImage,
  GridPattern,
  GridPatternContainer,
  Container,
  truncate
} from "@/packs/blog-sections";`,
};

// Register the pack
registerPack(blogSectionsPack);

// Export for external use
export { blogSectionsPack, blogSectionsVariants };
export default blogSectionsPack;