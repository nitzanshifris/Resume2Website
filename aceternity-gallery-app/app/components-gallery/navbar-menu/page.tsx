"use client";

import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";

// Default Services Navbar
function ServicesNavbar({ containerClassName }: { containerClassName?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className={cn("relative w-full flex items-center justify-center", containerClassName)}>
      <div className="relative top-0 inset-x-0 max-w-2xl mx-auto z-10">
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Services">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/web-dev">Web Development</HoveredLink>
              <HoveredLink href="/interface-design">Interface Design</HoveredLink>
              <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
              <HoveredLink href="/branding">Branding</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="About">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/team">Our Team</HoveredLink>
              <HoveredLink href="/history">Company History</HoveredLink>
              <HoveredLink href="/mission">Mission</HoveredLink>
              <HoveredLink href="/values">Values</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Contact">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/contact">Get in Touch</HoveredLink>
              <HoveredLink href="/support">Support</HoveredLink>
              <HoveredLink href="/sales">Sales</HoveredLink>
            </div>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

// Products Navbar with ProductItem
function ProductsNavbar({ containerClassName }: { containerClassName?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className={cn("relative w-full flex items-center justify-center", containerClassName)}>
      <div className="relative top-0 inset-x-0 max-w-2xl mx-auto z-10">
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Products">
            <div className="text-sm grid grid-cols-2 gap-10 p-4">
              <ProductItem
                title="Algochurn"
                href="https://algochurn.com"
                src="https://assets.aceternity.com/demos/algochurn.webp"
                description="Prepare for tech interviews like never before."
              />
              <ProductItem
                title="Tailwind Master Kit"
                href="https://tailwindmasterkit.com"
                src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
                description="Production ready Tailwind css components for your next project"
              />
              <ProductItem
                title="Moonbeam"
                href="https://gomoonbeam.com"
                src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
                description="Never write from scratch again. Go from idea to blog in minutes."
              />
              <ProductItem
                title="Rogue"
                href="https://userogue.com"
                src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
                description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
              />
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Pricing">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/hobby">Hobby</HoveredLink>
              <HoveredLink href="/individual">Individual</HoveredLink>
              <HoveredLink href="/team">Team</HoveredLink>
              <HoveredLink href="/enterprise">Enterprise</HoveredLink>
            </div>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

// Minimal Navbar
function MinimalNavbar({ containerClassName }: { containerClassName?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className={cn("relative w-full flex items-center justify-center", containerClassName)}>
      <div className="relative top-0 inset-x-0 max-w-lg mx-auto z-10">
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Home">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/">Dashboard</HoveredLink>
              <HoveredLink href="/analytics">Analytics</HoveredLink>
              <HoveredLink href="/overview">Overview</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Docs">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/getting-started">Getting Started</HoveredLink>
              <HoveredLink href="/api">API Reference</HoveredLink>
              <HoveredLink href="/examples">Examples</HoveredLink>
            </div>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

// E-commerce Navbar
function EcommerceNavbar({ containerClassName }: { containerClassName?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className={cn("relative w-full flex items-center justify-center", containerClassName)}>
      <div className="relative top-0 inset-x-0 max-w-3xl mx-auto z-10">
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Shop">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/electronics">Electronics</HoveredLink>
              <HoveredLink href="/clothing">Clothing</HoveredLink>
              <HoveredLink href="/home-garden">Home & Garden</HoveredLink>
              <HoveredLink href="/sports">Sports</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Brands">
            <div className="text-sm grid grid-cols-2 gap-6 p-4">
              <ProductItem
                title="Apple"
                href="/apple"
                src="https://assets.aceternity.com/demos/algochurn.webp"
                description="Latest iPhone, MacBook, and iPad products"
              />
              <ProductItem
                title="Samsung"
                href="/samsung"
                src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
                description="Galaxy phones, tablets, and smart devices"
              />
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Support">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/help">Help Center</HoveredLink>
              <HoveredLink href="/returns">Returns & Exchanges</HoveredLink>
              <HoveredLink href="/shipping">Shipping Info</HoveredLink>
              <HoveredLink href="/warranty">Warranty</HoveredLink>
            </div>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default function NavbarMenuPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Navbar Menu</h1>
          <p className="text-xl text-gray-400">
            A navbar menu that animates its children on hover, makes a beautiful bignav
          </p>
        </div>

        <div className="space-y-16">
          {/* Services Navbar */}
          <div className="bg-zinc-900 rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Services Navigation</h3>
              <p className="text-gray-400 mb-6">
                Simple services navigation with dropdown links
              </p>
            </div>
            <div className="h-40 bg-gradient-to-br from-blue-50 to-cyan-50 relative">
              <ServicesNavbar containerClassName="h-full pt-8" />
            </div>
          </div>

          {/* Products Navbar */}
          <div className="bg-zinc-900 rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Products Navigation</h3>
              <p className="text-gray-400 mb-6">
                Product showcase navigation with rich product items
              </p>
            </div>
            <div className="h-60 bg-gradient-to-br from-purple-50 to-pink-50 relative">
              <ProductsNavbar containerClassName="h-full pt-8" />
            </div>
          </div>

          {/* Minimal Navbar */}
          <div className="bg-zinc-900 rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Minimal Navigation</h3>
              <p className="text-gray-400 mb-6">
                Clean and minimal navigation for documentation sites
              </p>
            </div>
            <div className="h-40 bg-gradient-to-br from-green-50 to-emerald-50 relative">
              <MinimalNavbar containerClassName="h-full pt-8" />
            </div>
          </div>

          {/* E-commerce Navbar */}
          <div className="bg-zinc-900 rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">E-commerce Navigation</h3>
              <p className="text-gray-400 mb-6">
                Comprehensive e-commerce navigation with categories and brands
              </p>
            </div>
            <div className="h-60 bg-gradient-to-br from-orange-50 to-red-50 relative">
              <EcommerceNavbar containerClassName="h-full pt-8" />
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-16 bg-zinc-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Usage Tips</h3>
          <ul className="text-gray-400 space-y-2">
            <li>• Hover over menu items to see dropdown animations</li>
            <li>• Use ProductItem for rich content with images</li>
            <li>• Use HoveredLink for simple navigation links</li>
            <li>• Menu automatically closes when mouse leaves the area</li>
            <li>• Smooth spring animations powered by Framer Motion</li>
          </ul>
        </div>
      </div>
    </div>
  );
}