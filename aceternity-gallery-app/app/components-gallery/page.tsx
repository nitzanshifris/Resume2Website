"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Box, Layers, Sparkles, Grid3x3, Pin, Maximize2, MessageSquare, MousePointer2, 
  Images, Waves, Zap, Sparkle, Layout, Palette, TrendingUp, Grid,
  Search, Filter, GitCompare, Presentation, Play, Code2, Eye, Brush, Flashlight, Star, Code, Type, Upload, Clock, ZoomIn, Loader2, Menu, Grid3X3, FileText, FormInput, Megaphone, ScrollText, CreditCard, Square
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlaygroundModal } from "./components/PlaygroundModal";
import { PresentationModal } from "./components/PresentationModal";
import { getComponentConfig } from "@/component-library/metadata/component-configs";

const components = [
  {
    id: "background-boxes",
    name: "background-boxes",
    title: "Background Boxes",
    description: "A full width background box container that highlights on hover",
    icon: Layout,
    category: "Background",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "background-gradient", 
    name: "background-gradient",
    title: "Background Gradient",
    description: "An animated gradient that sits at the background of a card, button or anything",
    icon: Palette,
    category: "Background",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "background-lines",
    name: "background-lines", 
    title: "Background Lines",
    description: "A set of svg paths that animate in a wave pattern. Good for hero sections background",
    icon: TrendingUp,
    category: "Background",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "bento-grid",
    name: "bento-grid",
    title: "Bento Grid", 
    description: "A skewed grid layout with Title, description and a header component",
    icon: Grid,
    category: "Layout",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "3d-card",
    name: "3d-card",
    title: "3D Card Effect",
    description: "A card perspective effect, hover over the card to elevate card elements",
    icon: Box,
    category: "Interactive",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "3d-marquee",
    name: "3d-marquee", 
    title: "3D Marquee",
    description: "A 3D Marquee effect with grid, perfect for testimonials and hero sections",
    icon: Grid3x3,
    category: "Background",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "3d-pin",
    name: "3d-pin",
    title: "3D Animated Pin", 
    description: "A gradient pin that animates on hover, perfect for product links",
    icon: Pin,
    category: "Interactive",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "animated-modal",
    name: "animated-modal",
    title: "Animated Modal",
    description: "A customizable modal with smooth animated transitions and 3D effects",
    icon: Maximize2,
    category: "Utilities",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "animated-testimonials",
    name: "animated-testimonials",
    title: "Animated Testimonials",
    description: "Beautiful testimonial carousel with smooth 3D animations and stacked photo effects",
    icon: MessageSquare,
    category: "Content",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "animated-tooltip",
    name: "animated-tooltip",
    title: "Animated Tooltip",
    description: "Interactive tooltip component with smooth animations and 3D hover effects",
    icon: MousePointer2,
    category: "Interactive",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "apple-cards-carousel",
    name: "apple-cards-carousel",
    title: "Apple Cards Carousel",
    description: "Smooth horizontal scrolling carousel with Apple-style card interactions and modal previews",
    icon: Images,
    category: "Carousel",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "aurora-background",
    name: "aurora-background",
    title: "Aurora Background",
    description: "Beautiful animated gradient background with aurora-like effects and smooth transitions",
    icon: Sparkle,
    category: "Background",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "background-beams",
    name: "background-beams",
    title: "Background Beams",
    description: "Animated beam effects that create dynamic lighting patterns and atmospheric backgrounds",
    icon: Zap,
    category: "Background",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "background-beams-with-collision",
    name: "background-beams-with-collision",
    title: "Background Beams with Collision",
    description: "Dynamic beam effects with collision detection and explosion animations",
    icon: Sparkles,
    category: "Background",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "floating-navbar",
    name: "floating-navbar",
    title: "Floating Navbar",
    description: "Smart navigation bar that hides on scroll down and shows on scroll up",
    icon: Layout,
    category: "Navigation",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "canvas-reveal-effect",
    name: "canvas-reveal-effect",
    title: "Canvas Reveal Effect",
    description: "Interactive canvas-based reveal animations with WebGL shaders for stunning hover effects",
    icon: Brush,
    category: "Interactive",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "card-hover-effect",
    name: "card-hover-effect",
    title: "Card Hover Effect",
    description: "Beautiful card grid with animated hover effects and smooth background transitions",
    icon: Layers,
    category: "Interactive",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "card-spotlight",
    name: "card-spotlight",
    title: "Card Spotlight",
    description: "Interactive spotlight cards with mouse-following illumination effects and canvas animations",
    icon: Flashlight,
    category: "Interactive",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "meteors",
    name: "meteors",
    title: "Meteors",
    description: "Animated meteor effects that create dynamic falling star animations across your content",
    icon: Star,
    category: "Background",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "hover-effect-v2",
    name: "hover-effect-v2",
    title: "Hover Effect",
    description: "Hover over the cards and the effect slides to the currently hovered card",
    icon: Layers,
    category: "Interactive",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "card-stack",
    name: "card-stack",
    title: "Card Stack",
    description: "Cards stack on top of each other after some interval. Perfect for showing testimonials",
    icon: MessageSquare,
    category: "Interactive",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "cards",
    name: "cards",
    title: "Cards",
    description: "A set of cards that can be used for different use cases",
    icon: Layers,
    category: "Interactive",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "carousel",
    name: "carousel",
    title: "Carousel",
    description: "A customizable carousel with microinteractions and slider",
    icon: Images,
    category: "Carousel",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "code-block",
    name: "code-block",
    title: "Code Block",
    description: "A configurable code block component built on top of react-syntax-highlighter",
    icon: Code,
    category: "Utilities",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "colourful-text",
    name: "colourful-text",
    title: "Colourful Text",
    description: "A text component with animated color transitions, filter and scale effects",
    icon: Sparkle,
    category: "Content",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "cover",
    name: "cover",
    title: "Cover",
    description: "A Cover component that wraps any children, providing beams and space effect, hover to reveal speed",
    icon: Sparkle,
    category: "Special Effects",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "compare",
    name: "compare",
    title: "Compare",
    description: "A comparison component between two images, slide or drag to compare",
    icon: GitCompare,
    category: "Interactive",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "container-scroll-animation",
    name: "container-scroll-animation",
    title: "Container Scroll Animation",
    description: "A scroll animation that rotates in 3d on scroll. Perfect for hero or marketing sections",
    icon: Sparkle,
    category: "Special Effects",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "container-text-flip",
    name: "container-text-flip",
    title: "Container Text Flip",
    description: "A container that flips through words, animating the width",
    icon: Type,
    category: "Content",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "flip-words",
    name: "flip-words",
    title: "Flip Words",
    description: "Dynamic text animation component that cycles through an array of words with smooth flip animations",
    icon: Type,
    category: "Content",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "direction-aware-hover",
    name: "direction-aware-hover",
    title: "Direction Aware Hover",
    description: "A direction aware hover effect using Framer Motion, Tailwindcss and good old javascript",
    icon: MousePointer2,
    category: "Interactive",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "draggable-card",
    name: "draggable-card",
    title: "Draggable Card",
    description: "A tiltable, draggable card component that jumps on bounds",
    icon: MousePointer2,
    category: "Interactive",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "evervault-card",
    name: "evervault-card",
    title: "Evervault Card",
    description: "A cool card with amazing hover effect, reveals encrypted text and a mixed gradient",
    icon: Sparkles,
    category: "Interactive",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "expandable-cards",
    name: "expandable-cards",
    title: "Expandable Cards",
    description: "Click cards to expand them and show additional information",
    icon: Maximize2,
    category: "Interactive",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "feature-sections",
    name: "feature-sections",
    title: "Feature Sections",
    description: "A set of feature sections ranging from bento grids to simple layouts",
    icon: Grid,
    category: "Layout",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "file-upload",
    name: "file-upload",
    title: "File Upload",
    description: "Beautiful file upload component with drag and drop support and smooth animations",
    icon: Upload,
    category: "Form",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "floating-dock",
    name: "floating-dock",
    title: "Floating Dock",
    description: "A macOS-style floating dock with smooth animations and hover effects",
    icon: Layout,
    category: "Navigation",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "focus-cards",
    name: "focus-cards",
    title: "Focus Cards",
    description: "Hover over the card to focus on it, blurring the rest of the cards",
    icon: Images,
    category: "Interactive",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "following-pointer",
    name: "following-pointer",
    title: "Following Pointer",
    description: "A custom pointer that follows mouse arrow and animates in pointer and content",
    icon: MousePointer2,
    category: "Interactive",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "globe",
    name: "globe",
    title: "GitHub Globe",
    description: "A globe animation as seen on GitHub's homepage. Interactive and customizable",
    icon: Grid3x3,
    category: "Special Effects",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "glare-card",
    name: "glare-card",
    title: "Glare Card",
    description: "A glare effect that happens on hover, as seen on Linear's website",
    icon: Sparkles,
    category: "Interactive",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "glowing-effect",
    name: "glowing-effect",
    title: "Glowing Effect",
    description: "A border glowing effect that adapts to any container or card, as seen on Cursor's website",
    icon: Zap,
    category: "Interactive",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "glowing-stars",
    name: "glowing-stars",
    title: "Glowing Background Stars Card",
    description: "Card background stars that animate on hover and animate anyway",
    icon: Sparkles,
    category: "Special Effects",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "google-gemini-effect",
    name: "google-gemini-effect",
    title: "Google Gemini Effect",
    description: "An effect of SVGs as seen on the Google Gemini Website",
    icon: Sparkles,
    category: "Special Effects",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "background-gradient-animation",
    name: "background-gradient-animation",
    title: "Background Gradient Animation",
    description: "A smooth and elegant background gradient animation that changes the gradient position over time",
    icon: Sparkles,
    category: "Background",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "grid-and-dot-backgrounds",
    name: "grid-and-dot-backgrounds",
    title: "Grid and Dot Backgrounds",
    description: "Beautiful grid and dot background patterns using CSS gradients",
    icon: Grid,
    category: "Background",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "hero-highlight",
    name: "hero-highlight",
    title: "Hero Highlight",
    description: "A background effect with a text highlight component, perfect for hero sections",
    icon: Sparkles,
    category: "Special Effects",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "hero-parallax",
    name: "hero-parallax",
    title: "Hero Parallax",
    description: "A scroll effect with rotation, translation and opacity animations",
    icon: Layers,
    category: "Special Effects",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "hero-sections",
    name: "hero-sections",
    title: "Hero Sections",
    description: "A set of hero sections ranging from simple to complex layouts",
    icon: Layout,
    category: "Special Effects",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "hover-border-gradient",
    name: "hover-border-gradient",
    title: "Hover Border Gradient",
    description: "A hover effect that expands to the entire container with a gradient border",
    icon: Sparkles,
    category: "Utilities",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "images-slider",
    name: "images-slider",
    title: "Images Slider",
    description: "A full page slider with images that can be navigated with the keyboard",
    icon: Images,
    category: "Special Effects",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "infinite-moving-cards",
    name: "infinite-moving-cards",
    title: "Infinite Moving Cards",
    description: "A customizable group of cards that move infinitely in a loop with smooth animations",
    icon: Clock,
    category: "Interactive",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "lamp",
    name: "lamp",
    title: "Lamp",
    description: "A lamp effect as seen on Linear, great for section headers",
    icon: Flashlight,
    category: "Special Effects",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "layout-grid",
    name: "layout-grid",
    title: "Layout Grid",
    description: "A layout effect that animates the grid item on click, powered by Framer Motion layout",
    icon: Grid,
    category: "Layout",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "lens",
    name: "lens",
    title: "Lens",
    description: "A lens component to zoom into images, videos, or practically anything",
    icon: ZoomIn,
    category: "Interactive",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "link-preview",
    name: "link-preview",
    title: "Link Preview",
    description: "A customizable link preview on hover, powered by Microlink API",
    icon: Eye,
    category: "Interactive",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "macbook-scroll",
    name: "macbook-scroll",
    title: "MacBook Scroll",
    description: "A 3D MacBook Pro animation component that responds to scroll",
    icon: Sparkles,
    category: "Special Effects",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "moving-border",
    name: "moving-border",
    title: "Moving Border",
    description: "A border that moves around the container. Perfect for making your buttons stand out",
    icon: Sparkle,
    category: "Utilities",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "multi-step-loader",
    name: "multi-step-loader",
    title: "Multi Step Loader",
    description: "A step loader showing progress through multiple states with checkmarks",
    icon: Loader2,
    category: "Utilities",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "navbar-menu",
    name: "navbar-menu",
    title: "Navbar Menu",
    description: "A navbar menu that animates its children on hover, makes a beautiful bignav",
    icon: Menu,
    category: "Navigation",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "parallax-scroll",
    name: "parallax-scroll",
    title: "Parallax Grid Scroll",
    description: "A grid where two columns scroll in opposite directions, giving a parallax effect",
    icon: Grid3X3,
    category: "Special Effects",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "placeholders-and-vanish-input",
    name: "placeholders-and-vanish-input",
    title: "Placeholders And Vanish Input",
    description: "Sliding in placeholders and vanish effect of input on submit",
    icon: FileText,
    category: "Form",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "pointer-highlight",
    name: "pointer-highlight",
    title: "Pointer Highlight",
    description: "Animated highlight effect with pointer that draws a border around content on scroll",
    icon: MousePointer2,
    category: "Interactive",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "resizable-navbar",
    name: "resizable-navbar",
    title: "Resizable Navbar",
    description: "A navbar that changes width on scroll, responsive and animated",
    icon: Menu,
    category: "Navigation",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "shooting-stars",
    name: "shooting-stars",
    title: "Shooting Stars",
    description: "Beautiful animated shooting star effect with customizable colors and speed",
    icon: Star,
    category: "Background",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "stars-background",
    name: "stars-background",
    title: "Stars Background",
    description: "Stunning animated starry background with twinkling effects",
    icon: Sparkles,
    category: "Background",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "sidebar",
    name: "sidebar",
    title: "Sidebar",
    description: "Expandable sidebar that expands on hover, mobile responsive and dark mode support",
    icon: Menu,
    category: "Navigation",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "signup-form",
    name: "signup-form",
    title: "Signup Form",
    description: "A customizable form built on top of shadcn's input and label, with a touch of framer motion",
    icon: FormInput,
    category: "Form",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "sparkles",
    name: "sparkles",
    title: "Sparkles",
    description: "A configurable sparkles component that can be used as a background or as a standalone component",
    icon: Sparkles,
    category: "Special Effects",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "spotlight",
    name: "spotlight",
    title: "Spotlight",
    description: "An SVG-based spotlight effect that creates a dramatic lighting animation to highlight content",
    icon: Flashlight,
    category: "Special Effects",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "spotlight-new",
    name: "spotlight-new",
    title: "Spotlight New",
    description: "A new spotlight component with left and right spotlight, configurable and customizable",
    icon: Flashlight,
    category: "Special Effects",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "sticky-banner",
    name: "sticky-banner",
    title: "Sticky Banner",
    description: "A banner component that sticks to top, hides when user scrolls down",
    icon: Megaphone,
    category: "Navigation",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "sticky-scroll-reveal",
    name: "sticky-scroll-reveal",
    title: "Sticky Scroll Reveal",
    description: "A sticky container that sticks while scrolling, text reveals on scroll",
    icon: ScrollText,
    category: "Special Effects",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "svg-mask-effect",
    name: "svg-mask-effect",
    title: "SVG Mask Effect",
    description: "A mask reveal effect that shows hidden content when hovering over a container",
    icon: Eye,
    category: "Interactive",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "tabs",
    name: "tabs",
    title: "Animated Tabs",
    description: "Tabs to switch content with 3D stacking effects and smooth animations",
    icon: Layout,
    category: "Navigation",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "tailwindcss-buttons",
    name: "tailwindcss-buttons",
    title: "Tailwind CSS Buttons",
    description: "A curated collection of 20+ beautiful, battle-tested Tailwind CSS button components",
    icon: MousePointer2,
    category: "Interactive",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "text-generate-effect",
    name: "text-generate-effect",
    title: "Text Generate Effect",
    description: "A cool text effect that fades in text on page load, one by one",
    icon: Type,
    category: "Content",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "text-hover-effect",
    name: "text-hover-effect",
    title: "Text Hover Effect",
    description: "A text hover effect that animates and outlines gradient on hover, as seen on x.ai",
    icon: MousePointer2,
    category: "Special Effects",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "text-reveal-card",
    name: "text-reveal-card",
    title: "Text Reveal Card",
    description: "Mousemove effect to reveal text content at the bottom of the card",
    icon: CreditCard,
    category: "Interactive",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "tracing-beam",
    name: "tracing-beam",
    title: "Tracing Beam",
    description: "A Beam that follows the path of an SVG as the user scrolls. Adjusts beam length with scroll speed",
    icon: Zap,
    category: "Utilities",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "timeline",
    name: "timeline",
    title: "Timeline",
    description: "A timeline component with sticky header and scroll beam follow",
    icon: Clock,
    category: "Content",
    hasPlayground: false,
    implemented: true,
  },
  {
    id: "typewriter-effect",
    name: "typewriter-effect",
    title: "Typewriter Effect",
    description: "Text generates as if it is being typed on the screen",
    icon: Type,
    category: "Content",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "vortex",
    name: "vortex",
    title: "Vortex Background",
    description: "A wavy, swirly, vortex background ideal for CTAs and backgrounds",
    icon: Zap,
    category: "Background",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "wavy-background",
    name: "wavy-background",
    title: "Wavy Background",
    description: "A cool background effect with waves that move",
    icon: Waves,
    category: "Background",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "wobble-card",
    name: "wobble-card",
    title: "Wobble Card",
    description: "A card effect that translates and scales on mousemove, perfect for feature cards",
    icon: Square,
    category: "Interactive",
    hasPlayground: true,
    implemented: true,
  },
  {
    id: "world-map",
    name: "world-map",
    title: "World Map",
    description: "A world map with animated lines and dots, programmatically generated",
    icon: Grid3x3,
    category: "Special Effects",
    hasPlayground: true,
    implemented: true,
  },
];

const categories = ["All", "Background", "Layout", "Interactive", "Utilities", "Content", "Carousel", "Navigation", "Form", "Special Effects"];

export default function ComponentsGalleryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [playgroundComponent, setPlaygroundComponent] = useState<string | null>(null);
  const [showPresentation, setShowPresentation] = useState(false);

  // Filter components based on search and category
  const filteredComponents = useMemo(() => {
    return components.filter(component => {
      const matchesSearch = component.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           component.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || component.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Get component counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { "All": components.length };
    components.forEach(component => {
      counts[component.category] = (counts[component.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleCompareToggle = (componentId: string) => {
    if (selectedForCompare.includes(componentId)) {
      setSelectedForCompare(prev => prev.filter(id => id !== componentId));
    } else if (selectedForCompare.length < 3) {
      setSelectedForCompare(prev => [...prev, componentId]);
    }
  };

  const implementedCount = components.filter(c => c.implemented).length;
  const playgroundCount = components.filter(c => c.hasPlayground).length;

  const handleCompareNavigation = () => {
    if (selectedForCompare.length >= 2) {
      router.push(`/components-gallery/compare?components=${selectedForCompare.join(',')}`);
    }
  };

  const openPlayground = (componentId: string) => {
    setPlaygroundComponent(componentId);
  };

  const closePlayground = () => {
    setPlaygroundComponent(null);
  };

  const playgroundConfig = playgroundComponent ? getComponentConfig(playgroundComponent) : null;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Don't trigger if modal is open
      if (playgroundComponent || showPresentation) {
        return;
      }

      switch (event.key) {
        case '/':
          event.preventDefault();
          document.getElementById('search-input')?.focus();
          break;
        case 'c':
        case 'C':
          if (event.ctrlKey || event.metaKey) return; // Don't interfere with copy
          event.preventDefault();
          setCompareMode(!compareMode);
          break;
        case 'p':
        case 'P':
          if (event.ctrlKey || event.metaKey) return; // Don't interfere with print
          event.preventDefault();
          setShowPresentation(true);
          break;
        case 'Escape':
          event.preventDefault();
          setSearchQuery("");
          setSelectedCategory("All");
          setCompareMode(false);
          setSelectedForCompare([]);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          event.preventDefault();
          const categoryIndex = parseInt(event.key) - 1;
          if (categoryIndex < categories.length) {
            setSelectedCategory(categories[categoryIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [compareMode, playgroundComponent, showPresentation, categories]);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
            Component Gallery
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
            Explore and preview beautiful UI components with stunning animations and effects
          </p>
          
          {/* Keyboard Shortcuts Hint */}
          <div className="text-sm text-gray-500 mb-6">
            <span className="inline-flex items-center gap-4">
              <span><kbd className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-xs">/</kbd> Search</span>
              <span><kbd className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-xs">C</kbd> Compare</span>
              <span><kbd className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-xs">P</kbd> Present</span>
              <span><kbd className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-xs">1-6</kbd> Categories</span>
            </span>
          </div>
          
          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="bg-gray-900 text-gray-400 border-gray-800">
              {implementedCount} Components
            </Badge>
            <Badge variant="secondary" className="bg-gray-900 text-gray-400 border-gray-800">
              {categories.length - 1} Categories
            </Badge>
            <Badge variant="secondary" className="bg-gray-900 text-gray-400 border-gray-800">
              {playgroundCount} with Playground
            </Badge>
          </div>

          {/* Global Actions */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/buttons">
              <Button
                variant="outline"
                className="bg-gray-900 border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white"
              >
                <MousePointer2 className="h-4 w-4 mr-2" />
                Button Collection
              </Button>
            </Link>
            <Button
              variant={compareMode ? "default" : "outline"}
              onClick={() => setCompareMode(!compareMode)}
              className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            >
              <GitCompare className="h-4 w-4 mr-2" />
              Compare Mode {selectedForCompare.length > 0 && `(${selectedForCompare.length})`}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPresentation(true)}
              className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            >
              <Presentation className="h-4 w-4 mr-2" />
              Presentation Mode
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search-input"
              placeholder="Search components... (Press '/' to focus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-800 text-white placeholder-gray-500 focus:border-gray-700"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-gray-800 border-gray-700 text-white" 
                  : "bg-gray-900 border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white"
                }
              >
                {category}
                {categoryCounts[category] && (
                  <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                    {categoryCounts[category]}
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-center">
            <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1">
              <Button
                variant={viewMode === "preview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("preview")}
                className={viewMode === "preview" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                variant={viewMode === "code" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("code")}
                className={viewMode === "code" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}
              >
                <Code2 className="h-4 w-4 mr-2" />
                Code
              </Button>
            </div>
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredComponents.map((component) => {
            const Icon = component.icon;
            const isSelected = selectedForCompare.includes(component.id);
            
            return (
              <div key={component.id} className="group relative">
                {/* Compare Mode Overlay */}
                {compareMode && (
                  <div className="absolute top-4 right-4 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCompareToggle(component.id)}
                      className="w-5 h-5 rounded bg-gray-900 border-gray-700 text-gray-400 focus:ring-gray-600"
                      disabled={!isSelected && selectedForCompare.length >= 3}
                    />
                  </div>
                )}

                <Link
                  href={component.implemented ? `/components-gallery/${component.name}` : "#"}
                  className={`block ${!component.implemented ? "pointer-events-none" : ""}`}
                >
                  <div className={`relative rounded-xl transition-all duration-300 ${component.implemented ? "group-hover:scale-[1.02]" : "opacity-50"} ${isSelected ? "ring-2 ring-gray-600" : ""}`}>
                    <Card 
                      className="h-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300 card-spotlight border-glow"
                      onMouseMove={(e) => {
                        if (!component.implemented) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                      }}
                    >
                      {/* Glow Effect */}
                      <div className="glow-effect" />
                      
                      <CardHeader className="space-y-4 relative z-10">
                        {/* Header with icon and status */}
                        <div className="flex items-center justify-between">
                          <div className="p-3 rounded-lg bg-gray-800 group-hover:bg-gray-700 transition-colors">
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-sm font-medium text-gray-400">
                              {component.category}
                            </span>
                            {!component.implemented && (
                              <Badge variant="secondary" className="bg-gray-800 text-gray-500 text-xs border-gray-700">
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Title and Description */}
                        <div>
                          <CardTitle className="text-2xl text-white group-hover:text-gray-200 transition-colors">
                            {component.title}
                          </CardTitle>
                          <CardDescription className="text-gray-400 mt-2">
                            {component.description}
                          </CardDescription>
                        </div>

                        {/* Actions */}
                        {component.implemented && (
                          <div className="flex gap-2 pt-2">
                            {component.hasPlayground && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-transparent border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
                                onClick={(e) => {
                                  e.preventDefault();
                                  openPlayground(component.id);
                                }}
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Playground
                              </Button>
                            )}
                          </div>
                        )}
                      </CardHeader>
                    </Card>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Compare Panel */}
        {compareMode && selectedForCompare.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="text-white font-medium">
                {selectedForCompare.length} selected
              </span>
              <Button
                size="sm"
                disabled={selectedForCompare.length < 2}
                onClick={handleCompareNavigation}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700"
              >
                Compare
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedForCompare([])}
                className="border-gray-700 hover:bg-gray-800"
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredComponents.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">
              No components found matching your criteria
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Playground Modal */}
        {playgroundConfig && (
          <PlaygroundModal
            isOpen={!!playgroundComponent}
            onClose={closePlayground}
            config={playgroundConfig}
          />
        )}

        {/* Presentation Modal */}
        <PresentationModal
          isOpen={showPresentation}
          onClose={() => setShowPresentation(false)}
        />
      </div>
    </div>
  );
}