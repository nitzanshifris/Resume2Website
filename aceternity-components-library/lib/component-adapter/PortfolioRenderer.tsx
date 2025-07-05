"use client";

import React, { Suspense } from "react";
import { usePortfolioAdapter } from "./usePortfolioAdapter";
import { SectionConfig, ThemeConfig } from "./types/backend-types";
import dynamic from "next/dynamic";
import { ComponentType } from "./general-adapter";

// Dynamically import all Aceternity components
const componentMap: Record<ComponentType, React.ComponentType<any>> = {
  "3d-card": dynamic(() => import("@/component-library/components/ui/3d-card").then(m => m.CardContainer)),
  "3d-marquee": dynamic(() => import("@/component-library/components/ui/3d-marquee").then(m => m.Marquee3D)),
  "3d-pin": dynamic(() => import("@/component-library/components/ui/3d-pin").then(m => m.PinContainer)),
  "animated-modal": dynamic(() => import("@/component-library/components/ui/animated-modal").then(m => m.AnimatedModal)),
  "animated-testimonials": dynamic(() => import("@/component-library/components/ui/animated-testimonials").then(m => m.AnimatedTestimonials)),
  "animated-tooltip": dynamic(() => import("@/component-library/components/ui/animated-tooltip").then(m => m.AnimatedTooltip)),
  "apple-cards-carousel": dynamic(() => import("@/component-library/components/ui/apple-cards-carousel").then(m => m.AppleCardsCarousel)),
  "aurora-background": dynamic(() => import("@/component-library/components/ui/aurora-background").then(m => m.AuroraBackground)),
  "background-beams": dynamic(() => import("@/component-library/components/ui/background-beams").then(m => m.BackgroundBeams)),
  "background-beams-with-collision": dynamic(() => import("@/component-library/components/ui/background-beams-with-collision").then(m => m.BackgroundBeamsWithCollision)),
  "background-boxes": dynamic(() => import("@/component-library/components/ui/background-boxes").then(m => m.BackgroundBoxes)),
  "background-gradient": dynamic(() => import("@/component-library/components/ui/background-gradient").then(m => m.BackgroundGradient)),
  "background-lines": dynamic(() => import("@/component-library/components/ui/background-lines").then(m => m.BackgroundLines)),
  "bento-grid": dynamic(() => import("@/component-library/components/ui/bento-grid").then(m => m.BentoGrid)),
  "canvas-reveal-effect": dynamic(() => import("@/component-library/components/ui/canvas-reveal-effect").then(m => m.CanvasRevealEffect)),
  "card-hover-effect": dynamic(() => import("@/component-library/components/ui/card-hover-effect").then(m => m.HoverEffect)),
  "card-spotlight": dynamic(() => import("@/component-library/components/ui/card-spotlight").then(m => m.CardSpotlight)),
  "card-stack": dynamic(() => import("@/component-library/components/ui/card-stack").then(m => m.CardStack)),
  "cards": dynamic(() => import("@/component-library/components/ui/cards").then(m => m.FeatureBlockCard)),
  "carousel": dynamic(() => import("@/component-library/components/ui/carousel").then(m => m.Carousel)),
  "floating-navbar": dynamic(() => import("@/component-library/components/ui/floating-navbar").then(m => m.FloatingNavbar)),
  "hover-effect-v2": dynamic(() => import("@/component-library/components/ui/card-hover-effect").then(m => m.HoverEffectV2)),
  "meteors": dynamic(() => import("@/component-library/components/ui/meteors").then(m => m.Meteors)),
  "timeline": dynamic(() => import("@/component-library/components/ui/timeline").then(m => m.Timeline)),
  "code-block": dynamic(() => import("@/component-library/components/ui/code-block").then(m => m.CodeBlock)),
  "colourful-text": dynamic(() => import("@/component-library/components/ui/colourful-text").then(m => m.ColourfulText)),
  "compare": dynamic(() => import("@/component-library/components/ui/compare").then(m => m.Compare)),
  "cover": dynamic(() => import("@/component-library/components/ui/cover").then(m => m.Cover)),
  "container-scroll-animation": dynamic(() => import("@/component-library/components/ui/container-scroll-animation").then(m => m.ContainerScroll)),
  "container-text-flip": dynamic(() => import("@/component-library/components/ui/container-text-flip").then(m => m.ContainerTextFlip)),
  "direction-aware-hover": dynamic(() => import("@/component-library/components/ui/direction-aware-hover").then(m => m.DirectionAwareHover)),
  "draggable-card": dynamic(() => import("@/component-library/components/ui/draggable-card").then(m => ({ DraggableCardBody: m.DraggableCardBody, DraggableCardContainer: m.DraggableCardContainer }))),
  "evervault-card": dynamic(() => import("@/component-library/components/ui/evervault-card").then(m => m.EvervaultCard)),
  "expandable-cards": dynamic(() => import("@/component-library/components/ui/expandable-cards").then(m => m.ExpandableCards)),
  "feature-sections": dynamic(() => import("@/component-library/components/ui/feature-sections").then(m => m.FeatureSections)),
};

interface PortfolioRendererProps {
  sections: SectionConfig[];
  theme: ThemeConfig;
  className?: string;
  onSectionError?: (sectionId: string, error: Error) => void;
}

export function PortfolioRenderer({
  sections,
  theme,
  className = "",
  onSectionError,
}: PortfolioRendererProps) {
  const {
    adaptedSections,
    isProcessing,
    errors,
  } = usePortfolioAdapter({
    sections,
    globalTheme: theme,
    onError: (error) => console.error("Portfolio adapter error:", error),
  });

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`portfolio-container ${className}`}>
      {adaptedSections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          error={errors[section.id]}
          onError={(error) => onSectionError?.(section.id, error)}
        />
      ))}
    </div>
  );
}

interface SectionRendererProps {
  section: any;
  error?: Error;
  onError?: (error: Error) => void;
}

function SectionRenderer({ section, error, onError }: SectionRendererProps) {
  const Component = componentMap[section.component];

  if (error) {
    return (
      <div className="p-8 bg-red-50 dark:bg-red-900/20 rounded-lg m-4">
        <h3 className="text-red-600 dark:text-red-400 font-semibold">
          Error rendering {section.title || section.type}
        </h3>
        <p className="text-red-500 dark:text-red-300 text-sm mt-2">
          {error.message}
        </p>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="p-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg m-4">
        <p className="text-yellow-600 dark:text-yellow-400">
          Component not found: {section.component}
        </p>
      </div>
    );
  }

  return (
    <section
      id={section.id}
      className={`portfolio-section ${section.type}`}
      data-order={section.order}
    >
      {(section.title || section.subtitle) && (
        <div className="section-header mb-8 text-center">
          {section.title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {section.title}
            </h2>
          )}
          {section.subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {section.subtitle}
            </p>
          )}
        </div>
      )}
      
      <Suspense fallback={<SectionLoader />}>
        <ErrorBoundary onError={onError}>
          <Component {...section.props} />
        </ErrorBoundary>
      </Suspense>
    </section>
  );
}

function SectionLoader() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Component error:", error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-red-600 dark:text-red-400">
            Something went wrong rendering this component.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}