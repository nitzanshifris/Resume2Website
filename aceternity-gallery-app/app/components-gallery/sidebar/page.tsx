"use client";

import React from "react";
import { SidebarDemo, SidebarDemoNoAnimation } from "@/components/ui/sidebar/sidebar-demo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SidebarGalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <Link href="/components-gallery">
          <Button
            variant="ghost"
            className="mb-8 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sidebar
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl">
            Expandable sidebar that expands on hover, mobile responsive and dark mode support
          </p>
        </div>

        {/* Examples */}
        <div className="space-y-16">
          {/* Default Demo */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Default Sidebar
            </h2>
            <div className="bg-zinc-900/50 rounded-lg p-8 border border-zinc-800">
              <SidebarDemo />
            </div>
          </section>

          {/* No Animation Demo */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Sidebar without Animation
            </h2>
            <p className="text-zinc-400 mb-4">
              Use the prop animate={false} to disable the animation
            </p>
            <div className="bg-zinc-900/50 rounded-lg p-8 border border-zinc-800">
              <SidebarDemoNoAnimation />
            </div>
          </section>

          {/* Code Example */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Usage Example
            </h2>
            <div className="bg-zinc-800 rounded-lg p-6">
              <pre className="text-zinc-300 overflow-x-auto">
                <code>{`import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconBrandTabler, IconUserBolt } from "@tabler/icons-react";

export function MySidebar() {
  const [open, setOpen] = useState(false);
  
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <IconBrandTabler className="h-5 w-5" />,
    },
    {
      label: "Profile",
      href: "#",
      icon: <IconUserBolt className="h-5 w-5" />,
    },
  ];

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col gap-2">
          {links.map((link, idx) => (
            <SidebarLink key={idx} link={link} />
          ))}
        </div>
      </SidebarBody>
    </Sidebar>
  );
}`}</code>
              </pre>
            </div>
          </section>

          {/* Props Documentation */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Props Documentation
            </h2>
            <div className="bg-zinc-800 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Sidebar Props</h3>
                <ul className="space-y-2 text-zinc-300">
                  <li>• <code className="text-blue-400">open</code>: boolean - Controls the open state</li>
                  <li>• <code className="text-blue-400">setOpen</code>: function - Sets the open state</li>
                  <li>• <code className="text-blue-400">animate</code>: boolean - Enable/disable animations (default: true)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">SidebarLink Props</h3>
                <ul className="space-y-2 text-zinc-300">
                  <li>• <code className="text-blue-400">link</code>: object - Contains label, href, and icon</li>
                  <li>• <code className="text-blue-400">className</code>: string - Additional CSS classes</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}