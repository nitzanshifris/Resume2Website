"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, GithubIcon, ExternalLinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Glow component implementation
const glowVariants = cva("absolute w-full", {
  variants: {
    variant: {
      top: "top-0",
      above: "-top-[128px]",
      bottom: "bottom-0",
      below: "-bottom-[128px]",
      center: "top-[50%]",
    },
  },
  defaultVariants: {
    variant: "top",
  },
});

const Glow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof glowVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(glowVariants({ variant }), className)}
    {...props}
  >
    <div
      className={cn(
        "absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(var(--brand-foreground)/.5)_10%,_hsla(var(--brand-foreground)/0)_60%)] sm:h-[512px]",
        variant === "center" && "-translate-y-1/2",
      )}
    />
    <div
      className={cn(
        "absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 scale-[2] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(var(--brand)/.3)_10%,_hsla(var(--brand-foreground)/0)_60%)] sm:h-[256px]",
        variant === "center" && "-translate-y-1/2",
      )}
    />
  </div>
));
Glow.displayName = "Glow";

// Mockup components implementation
const mockupVariants = cva(
  "flex relative z-10 overflow-hidden shadow-2xl border border-border/5 border-t-border/15",
  {
    variants: {
      type: {
        mobile: "rounded-[48px] max-w-[350px]",
        responsive: "rounded-md",
      },
    },
    defaultVariants: {
      type: "responsive",
    },
  },
);

export interface MockupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mockupVariants> {}

const Mockup = React.forwardRef<HTMLDivElement, MockupProps>(
  ({ className, type, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(mockupVariants({ type, className }))}
      {...props}
    />
  ),
);
Mockup.displayName = "Mockup";

const frameVariants = cva(
  "bg-accent/5 flex relative z-10 overflow-hidden rounded-2xl",
  {
    variants: {
      size: {
        small: "p-2",
        large: "p-4",
      },
    },
    defaultVariants: {
      size: "small",
    },
  },
);

export interface MockupFrameProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof frameVariants> {}

const MockupFrame = React.forwardRef<HTMLDivElement, MockupFrameProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(frameVariants({ size, className }))}
      {...props}
    />
  ),
);
MockupFrame.displayName = "MockupFrame";

// Typing animation hook
const useTypingAnimation = (
  text: string,
  speed: number = 100,
  startDelay: number = 0
) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let index = 0;

    const startTyping = () => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
        timeoutId = setTimeout(startTyping, speed);
      } else {
        setIsComplete(true);
      }
    };

    timeoutId = setTimeout(startTyping, startDelay);

    return () => clearTimeout(timeoutId);
  }, [text, speed, startDelay]);

  return { displayText, isComplete };
};

// Main CV2WEB Portfolio Hero Component
interface CV2WEBHeroProps {
  badge?: {
    text: string;
    action: {
      text: string;
      href: string;
    };
  };
  name?: string;
  title?: string;
  description?: string;
  actions?: {
    text: string;
    href: string;
    icon?: React.ReactNode;
    variant?: "default" | "outline";
  }[];
  skills?: string[];
  showMockup?: boolean;
}

const CV2WEBHero: React.FC<CV2WEBHeroProps> = ({
  badge = {
    text: "🚀 CV2WEB Project",
    action: {
      text: "View on GitHub",
      href: "https://github.com/cv2web",
    },
  },
  name = "CV2WEB",
  title = "Transform Your CV into a Stunning Web Portfolio",
  description = "Automatically convert your traditional CV into a modern, responsive web portfolio with beautiful animations and professional design.",
  actions = [
    {
      text: "Get Started",
      href: "#get-started",
      variant: "default" as const,
    },
    {
      text: "View Demo",
      href: "#demo",
      variant: "outline" as const,
      icon: <ExternalLinkIcon className="h-4 w-4" />,
    },
  ],
  skills = ["React", "TypeScript", "Tailwind CSS", "Next.js", "AI-Powered"],
  showMockup = true,
}) => {
  const nameTyping = useTypingAnimation(name, 150, 500);
  const titleTyping = useTypingAnimation(title, 50, 1500);
  const descriptionTyping = useTypingAnimation(description, 30, 3000);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <section className="relative z-10 py-12 sm:py-24 md:py-32 px-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 pt-16 sm:gap-24">
          <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
            {/* Badge */}
            <Badge 
              variant="outline" 
              className="animate-appear gap-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
            >
              <span className="text-primary/80">{badge.text}</span>
              <a href={badge.action.href} className="flex items-center gap-1 text-primary hover:text-primary/80">
                {badge.action.text}
                <ArrowRightIcon className="h-3 w-3" />
              </a>
            </Badge>

            {/* Animated Name */}
            <div className="relative">
              <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                {nameTyping.displayText}
                <span className={`inline-block w-1 h-16 sm:h-24 md:h-32 bg-primary ml-2 ${nameTyping.isComplete ? 'animate-pulse' : 'animate-pulse'}`} />
              </h1>
            </div>

            {/* Animated Title */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold text-foreground max-w-4xl leading-tight">
              {titleTyping.displayText}
              {!titleTyping.isComplete && <span className="animate-pulse">|</span>}
            </h2>

            {/* Animated Description */}
            <p className="text-lg sm:text-xl max-w-3xl text-muted-foreground leading-relaxed">
              {descriptionTyping.displayText}
              {!descriptionTyping.isComplete && <span className="animate-pulse">|</span>}
            </p>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
              {skills.map((skill, index) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className={cn(
                    "opacity-0 animate-appear bg-secondary/50 border-secondary text-secondary-foreground",
                    `delay-[${4000 + index * 200}ms]`
                  )}
                  style={{ animationDelay: `${4000 + index * 200}ms` }}
                >
                  {skill}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className={cn(
              "flex flex-col sm:flex-row gap-4 opacity-0 animate-appear",
              "delay-[5000ms]"
            )}
            style={{ animationDelay: "5000ms" }}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  size="lg"
                  asChild
                  className="min-w-[160px]"
                >
                  <a href={action.href} className="flex items-center gap-2">
                    {action.icon}
                    {action.text}
                  </a>
                </Button>
              ))}
            </div>

            {/* Mockup Preview */}
            {showMockup && (
              <div className={cn(
                "relative pt-12 opacity-0 animate-appear",
                "delay-[6000ms]"
              )}
              style={{ animationDelay: "6000ms" }}>
                <MockupFrame size="small">
                  <Mockup type="responsive">
                    <div className="w-full h-64 sm:h-80 md:h-96 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center rounded-md">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-2xl">📄</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-primary/30 rounded w-32 mx-auto" />
                          <div className="h-2 bg-muted rounded w-24 mx-auto" />
                          <div className="h-2 bg-muted rounded w-28 mx-auto" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          CV → Web Portfolio
                        </div>
                      </div>
                    </div>
                  </Mockup>
                </MockupFrame>
                <Glow variant="top" className="opacity-30" />
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes appear {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-appear {
          animation: appear 0.6s ease-out forwards;
        }

        :root {
          --brand: 220 100% 60%;
          --brand-foreground: 220 100% 70%;
        }

        .dark {
          --brand: 220 100% 70%;
          --brand-foreground: 220 100% 60%;
        }
      `}</style>
    </div>
  );
};

// Usage example
export default function CV2WEBPortfolioHero() {
  return (
    <CV2WEBHero
      badge={{
        text: "🎯 CV2WEB Beta",
        action: {
          text: "Star on GitHub",
          href: "https://github.com/cv2web/cv2web",
        },
      }}
      name="CV2WEB"
      title="Transform Your CV into a Stunning Web Portfolio"
      description="Leverage AI and modern web technologies to automatically convert your traditional CV into a beautiful, responsive portfolio website that stands out from the crowd."
      actions={[
        {
          text: "Try CV2WEB",
          href: "#get-started",
          variant: "default",
        },
        {
          text: "GitHub",
          href: "https://github.com/cv2web",
          variant: "outline",
          icon: <GithubIcon className="h-4 w-4" />,
        },
      ]}
      skills={["React", "TypeScript", "AI-Powered", "Responsive Design", "Modern UI"]}
      showMockup={true}
    />
  );
}
