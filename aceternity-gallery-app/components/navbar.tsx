"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mouse, Layers, Home, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/components-gallery", 
      label: "Components",
      icon: Layers,
    },
    {
      href: "/packs-gallery", 
      label: "Component Packs",
      icon: Package,
    },
    {
      href: "/buttons",
      label: "Buttons", 
      icon: Mouse,
    }
  ];

  return (
    <nav className="relative border-b border-gray-800/50 bg-black/50 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/10 to-transparent"></div>
      <div className="container mx-auto px-4 relative">
        <div className="flex h-14 items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="h-6 w-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-sm group-hover:shadow-lg group-hover:shadow-purple-600/25 transition-shadow"></div>
              <span className="font-bold text-white">Aceternity</span>
            </Link>
          </div>
          
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    pathname === link.href
                      ? "bg-gray-800/50 text-white shadow-lg shadow-purple-500/5"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
}