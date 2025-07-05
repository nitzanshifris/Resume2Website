import { cn } from "@/lib/utils";
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export function SimpleFooterWithFourGrids() {
  const pages = [
    {
      title: "All Products",
      href: "#",
    },
    {
      title: "Studio",
      href: "#",
    },
    {
      title: "Clients",
      href: "#",
    },
    {
      title: "Pricing",
      href: "#",
    },
    {
      title: "Blog",
      href: "#",
    },
  ];

  const socials = [
    {
      title: "Facebook",
      href: "#",
    },
    {
      title: "Instagram",
      href: "#",
    },
    {
      title: "Twitter",
      href: "#",
    },
    {
      title: "LinkedIn",
      href: "#",
    },
  ];
  const legals = [
    {
      title: "Privacy Policy",
      href: "#",
    },
    {
      title: "Terms of Service",
      href: "#",
    },
    {
      title: "Cookie Policy",
      href: "#",
    },
  ];

  const signups = [
    {
      title: "Sign Up",
      href: "#",
    },
    {
      title: "Login",
      href: "#",
    },
    {
      title: "Forgot Password",
      href: "#",
    },
  ];
  return (
    <div className="border-t border-neutral-100 dark:border-white/[0.1] px-8 py-20 bg-white dark:bg-neutral-950 w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-sm text-neutral-500 flex sm:flex-row flex-col justify-between items-start  md:px-8">
        <div>
          <div className="mr-0 md:mr-4  md:flex mb-4">
            <Logo />
          </div>

          <div className="mt-2 ml-2">
            &copy; copyright DevStudios 2024. All rights reserved.
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 items-start mt-10 sm:mt-0 md:mt-0">
          <div className="flex justify-center space-y-4 flex-col w-full">
            <p className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold">
              Pages
            </p>
            <ul className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 list-none space-y-4">
              {pages.map((page, idx) => (
                <li key={"pages" + idx} className="list-none">
                  <Link
                    className="transition-colors hover:text-text-neutral-800 "
                    href="/products"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center space-y-4 flex-col">
            <p className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold">
              Socials
            </p>
            <ul className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 list-none space-y-4">
              {socials.map((social, idx) => (
                <li key={"social" + idx} className="list-none">
                  <Link
                    className="transition-colors hover:text-text-neutral-800 "
                    href="/products"
                  >
                    {social.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center space-y-4 flex-col">
            <p className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold">
              Legal
            </p>
            <ul className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 list-none space-y-4">
              {legals.map((legal, idx) => (
                <li key={"legal" + idx} className="list-none">
                  <Link
                    className="transition-colors hover:text-text-neutral-800 "
                    href="/products"
                  >
                    {legal.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center space-y-4 flex-col">
            <p className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold">
              Register
            </p>
            <ul className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 list-none space-y-4">
              {signups.map((auth, idx) => (
                <li key={"auth" + idx} className="list-none">
                  <Link
                    className="transition-colors hover:text-text-neutral-800 "
                    href="/products"
                  >
                    {auth.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="text-center mt-20 text-5xl md:text-9xl lg:text-[12rem] xl:text-[13rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 dark:from-neutral-950 to-neutral-200 dark:to-neutral-800 inset-x-0">
        DevStudio
      </p>
    </div>
  );
}

const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm mr-4  text-black px-2 py-1  relative z-20"
    >
      <div className="h-[30px] w-[30px] rounded-lg bg-white dark:bg-white flex items-center justify-center">
        <span className="text-black font-bold text-lg">A</span>
      </div>
      <span className="font-medium text-black dark:text-white">DevStudio</span>
    </Link>
  );
};

export function CenteredWithLogo() {
  const pages = [
    {
      title: "Products",
      href: "#",
    },
    {
      title: "Studio",
      href: "#",
    },
    {
      title: "Clients",
      href: "#",
    },
    {
      title: "Pricing",
      href: "#",
    },
    {
      title: "Blog",
      href: "#",
    },
    {
      title: "Privacy",
      href: "#",
    },
    {
      title: "Terms",
      href: "#",
    },
  ];

  return (
    <div className="border-t border-neutral-100 dark:border-white/[0.1] px-8 py-20 bg-white dark:bg-neutral-950 w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-sm text-neutral-500  justify-between items-start  md:px-8">
        <div className="flex flex-col items-center justify-center w-full relative">
          <div className="mr-0 md:mr-4  md:flex mb-4">
            <Logo />
          </div>

          <ul className="transition-colors flex sm:flex-row flex-col hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 list-none gap-4">
            {pages.map((page, idx) => (
              <li key={"pages" + idx} className="list-none">
                <Link
                  className="transition-colors hover:text-text-neutral-800 "
                  href="/products"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>

          <GridLineHorizontal className="max-w-7xl mx-auto mt-8" />
        </div>
        <div className="flex sm:flex-row flex-col justify-between mt-8 items-center w-full">
          <p className="text-neutral-500 dark:text-neutral-400 mb-8 sm:mb-0">
            &copy; DevStudios LLABC
          </p>
          <div className="flex gap-4">
            <Link href="#">
              <IconBrandTwitter className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
            </Link>
            <Link href="#">
              <IconBrandLinkedin className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
            </Link>
            <Link href="#">
              <IconBrandGithub className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
            </Link>
            <Link href="#">
              <IconBrandFacebook className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
            </Link>
            <Link href="#">
              <IconBrandInstagram className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px", //-100px if you want to keep the line inside
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "w-[calc(100%+var(--offset))] h-[var(--height)]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    ></div>
  );
};

export function FooterWithGrid() {
  return (
    <div className="bg-gray-50 dark:bg-neutral-800">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="border-b border-neutral-200 pb-2 dark:border-neutral-700">
          <div className="mb-10 max-w-xl">
            <FooterLogo className="justify-start" />
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Access an ever-growing collection of premium, meticulously crafted
              templates and component packs. Built by the founders of Aceternity
              UI.
            </p>
            <div className="text-sm text-neutral-700 dark:text-neutral-300">
              A product by{" "}
              <Link
                href="https://aceternity.com"
                target="__blank"
                className="font-medium text-neutral-800 underline dark:text-neutral-400"
              >
                Aceternity
              </Link>
            </div>
            <div className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              Building in public at{" "}
              <Link
                href="https://twitter.com/mannupaaji"
                className="font-medium text-neutral-800 underline dark:text-neutral-400"
                target="__blank"
              >
                @mannupaaji
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 border-b border-neutral-200 pb-10 pt-10 md:grid-cols-4 dark:border-neutral-700">
          <ul className="text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="mb-4 text-sm font-bold text-black dark:text-white">
              Components
            </li>
            {COMPONENT_PACKS.map((item, idx) => (
              <li key={"first" + idx} className="mb-4 text-sm font-normal">
                <Link
                  href={item.href}
                  className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="mb-4 text-sm font-bold text-black dark:text-white">
              Templates
            </li>
            {TEMPLATES.map((item, idx) => (
              <li key={"first" + idx} className="mb-4 text-sm font-normal">
                <Link
                  href={item.href}
                  className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="mb-4 text-sm font-bold text-black dark:text-white">
              Pages
            </li>
            {PAGES.map((item, idx) => (
              <li key={"first" + idx} className="mb-4 text-sm font-normal">
                <Link
                  href={item.href}
                  className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="mb-4 text-sm font-bold text-black dark:text-white">
              Pages
            </li>
            {PROGRAMMATIC_SEO_PAGES.map((item, idx) => (
              <li key={"first" + idx} className="mb-4 text-sm font-normal">
                <Link
                  href={item.href}
                  className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mb-4 pt-10 text-sm text-neutral-600 dark:text-neutral-400">
          &copy; {new Date().getFullYear()} Aceternity Labs LLC. All Rights
          Reserved.
        </p>
      </div>
    </div>
  );
}

const TEMPLATES = [
  {
    title: "Startup Landing Page Template",
    href: "/templates/startup-landing-page",
  },
  { title: "AI SaaS Template", href: "/templates/ai-saas-template" },
  {
    title: "Proactiv Marketing Template",
    href: "/templates/proactiv-marketing-template",
  },
  {
    title: "Agenlabs Agency Template",
    href: "/templates/agenlabs-agency-template",
  },
  {
    title: "DevPro Portfolio Template",
    href: "/templates/devpro-portfolio-template",
  },
  {
    title: "Foxtrot Marketing Template",
    href: "/templates/foxtrot-marketing-template",
  },
];

const COMPONENT_PACKS = [
  { title: "Hero Sections", href: "/components/hero-sections" },
  { title: "Logo Clouds", href: "/components/logo-clouds" },
  { title: "Bento Grids", href: "/components/bento-grids" },
  { title: "CTA Sections", href: "/components/cta-sections" },
  { title: "Testimonials", href: "/components/testimonials" },
  { title: "Feature Sections", href: "/components/feature-sections" },
  { title: "Pricing Sections", href: "/components/pricing-sections" },
  { title: "Cards", href: "/components/cards" },
  { title: "Navbars", href: "/components/navbars" },
  { title: "Footers", href: "/components/footers" },
  { title: "Login and Signup", href: "/components/login-and-signup-sections" },
  { title: "Contact sections", href: "/components/contact-sections" },
  { title: "Blog Sections", href: "/components/blog-sections" },
  { title: "Blog Content Sections", href: "/components/blog-content-sections" },
  { title: "FAQs", href: "/components/faqs" },
  { title: "Sidebars", href: "/components/sidebars" },
  { title: "Stats Sections", href: "/components/stats-sections" },
];

const PAGES = [
  { title: "All Products", href: "/products" },
  { title: "Components", href: "/components" },
  { title: "Templates", href: "/templates" },
  { title: "Categories", href: "/categories" },
  { title: "Box Shadows", href: "https://ui.aceternity.com/tools/box-shadows" },
  { title: "Pricing", href: "/pricing" },
  { title: "Aceternity UI", href: "https://ui.aceternity.com/" },
  { title: "Aceternity Studio", href: "https://aceternity.com/" },
  { title: "Licence", href: "/licence" },
  { title: "Refunds", href: "/refunds" },
  { title: "Privacy Policy", href: "/privacy" },
  { title: "Terms and Conditions", href: "/terms" },
  { title: "Twitter", href: "https://twitter.com/aceternitylabs" },
  { title: "Discord", href: "https://discord.gg/ftZbQvCdN7" },
];

const PROGRAMMATIC_SEO_PAGES = [
  {
    title: "Best Modern Design Templates",
    href: "/best-modern-design-templates",
  },
  { title: "Best AI SaaS Templates", href: "/best-ai-saas-templates" },
  { title: "Best Marketing Templates", href: "/best-marketing-templates" },
  {
    title: "Best Minimal Templates in React and Next.js",
    href: "/best-minimal-templates-in-react-and-nextjs",
  },
  {
    title: "Best components and templates with Framer Motion",
    href: "/best-components-and-templates-with-motion/react",
  },
  {
    title: "Amazing Tailwind CSS and Framer Motion Components",
    href: "/amazing-tailwindcss-and-motion/react-components",
  },
];

const FooterLogo = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/"
      className={cn(
        "flex flex-shrink-0 items-center justify-center space-x-2 py-6 text-center text-2xl font-bold text-neutral-600 selection:bg-emerald-500 dark:text-gray-100",
        className,
      )}
    >
      <div className="relative flex h-8 w-8 items-center justify-center rounded-md border border-slate-800 bg-black text-sm text-white antialiased md:h-6 md:w-6">
        <div className="absolute inset-x-0 -top-10 h-10 w-full rounded-full bg-white/[0.2] blur-xl" />
        <div className="relative z-20 text-sm text-emerald-500">
          <div className="h-[30px] w-[30px] rounded-lg bg-white flex items-center justify-center">
            <span className="text-black font-bold text-lg">A</span>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "flex items-center gap-2 font-sans text-xl text-black dark:text-white",
        )}
      >
        Aceternity UI{" "}
        <div className="shadow-input relative rounded-sm border border-transparent bg-white px-2 py-0.5 text-xs font-bold text-black dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:shadow-none">
          pro
        </div>
      </div>
    </Link>
  );
};