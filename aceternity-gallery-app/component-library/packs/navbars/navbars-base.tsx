"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX, IconChevronDown } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export function SimpleNavbarWithHoverEffects() {
  return (
    <div className="w-full bg-black">
      <div className="py-4">
        <Navbar />
      </div>
      <div className="h-[500px] flex items-center justify-center">
        <p className="text-neutral-500">Your content here</p>
      </div>
    </div>
  );
}

const Navbar = () => {
  const navItems = [
    { name: "Work", link: "#" },
    { name: "Services", link: "#" },
    { name: "Pricing", link: "#" },
    { name: "Contact", link: "#" },
  ];

  return (
    <div className="w-full">
      <DesktopNav navItems={navItems} />
      <MobileNav navItems={navItems} />
    </div>
  );
};

const DesktopNav = ({ navItems }: any) => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <motion.div
      onMouseLeave={() => {
        setHovered(null);
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start px-4 py-2 lg:flex"
      )}
    >
      <Logo />
      <div className="hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium lg:flex lg:space-x-2">
        {navItems.map((navItem: any, idx: number) => (
          <Link
            onMouseEnter={() => setHovered(idx)}
            className="relative px-4 py-2 text-white transition-colors hover:text-neutral-300"
            key={`link=${idx}`}
            href={navItem.link}
          >
            {hovered === idx && (
              <motion.div
                layoutId="hovered"
                className="absolute inset-0 h-full w-full rounded-full bg-white/10"
              />
            )}
            <span className="relative z-20">{navItem.name}</span>
          </Link>
        ))}
      </div>
      <button className="hidden rounded-full bg-white px-8 py-2 text-sm font-bold text-black shadow-[0px_-2px_0px_0px_rgba(0,0,0,0.1)_inset] md:block">
        Book a call
      </button>
    </motion.div>
  );
};

const MobileNav = ({ navItems }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        animate={{ borderRadius: open ? "4px" : "2rem" }}
        key={String(open)}
        className="relative mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-4 py-2 lg:hidden"
      >
        <div className="flex w-full flex-row items-center justify-between">
          <Logo />
          {open ? (
            <IconX
              className="text-white cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          ) : (
            <IconMenu2
              className="text-white cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          )}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 top-16 z-20 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-neutral-900 px-4 py-8 dark:bg-neutral-900 border border-neutral-800"
            >
              {navItems.map((navItem: any, idx: number) => (
                <Link
                  key={`link=${idx}`}
                  href={navItem.link}
                  className="relative text-white hover:text-neutral-300"
                >
                  <motion.span className="block">{navItem.name} </motion.span>
                </Link>
              ))}
              <button className="w-full rounded-lg bg-white px-8 py-2 font-medium text-black shadow-[0px_-2px_0px_0px_rgba(0,0,0,0.1)_inset]">
                Book a call
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

const Logo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
    >
      <div className="h-[30px] w-[30px] rounded-lg bg-white dark:bg-white flex items-center justify-center">
        <span className="text-black font-bold text-lg">A</span>
      </div>
      <span className="font-medium text-white">DevStudio</span>
    </Link>
  );
};

export function NavbarWithChildren() {
  return (
    <div className="w-full bg-black">
      <div className="py-4">
        <NavbarWithChildrenMenu />
      </div>
      <div className="h-[500px] flex items-center justify-center">
        <p className="text-neutral-500">Your content here</p>
      </div>
    </div>
  );
}

const NavbarWithChildrenMenu = () => {
  const navItems = [
    {
      name: "Services",
      link: "#",
      children: [
        { name: "Web Development", link: "#" },
        { name: "Interface Design", link: "#" },
        { name: "Search Engine Optimization", link: "#" },
        { name: "Branding", link: "#" },
      ],
    },
    {
      name: "Products",
      link: "#",
      children: [
        { name: "Algochurn", link: "#" },
        { name: "Tailwind Master Kit", link: "#" },
      ],
    },
    {
      name: "Pricing",
      link: "#",
      children: [
        { name: "Hobby", link: "#" },
        { name: "Individual", link: "#" },
        { name: "Team", link: "#" },
      ],
    },
  ];

  return (
    <div className="w-full">
      <DesktopNavWithChildren navItems={navItems} />
      <MobileNavWithChildren navItems={navItems} />
    </div>
  );
};

const DesktopNavWithChildren = ({ navItems }: any) => {
  const [active, setActive] = useState<string | null>(null);
  return (
    <motion.div
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start px-4 py-2 lg:flex"
      )}
    >
      <Logo />
      <div className="hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium lg:flex lg:space-x-2">
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Services">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/#">Web Development</HoveredLink>
              <HoveredLink href="/#">Interface Design</HoveredLink>
              <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
              <HoveredLink href="/branding">Branding</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Products">
            <div className="grid grid-cols-2 gap-10 p-4 text-sm">
              <ProductItem
                title="Algochurn"
                href="https://algochurn.com"
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=250&fit=crop"
                description="Prepare for tech interviews like never before."
              />
              <ProductItem
                title="Tailwind Master Kit"
                href="https://tailwindmasterkit.com"
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=250&fit=crop"
                description="Production ready Tailwind css components for your next project"
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
      <button className="hidden rounded-full bg-white px-8 py-2 text-sm font-bold text-black shadow-[0px_-2px_0px_0px_rgba(0,0,0,0.1)_inset] md:block">
        Book a call
      </button>
    </motion.div>
  );
};

const MobileNavWithChildren = ({ navItems }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        animate={{ borderRadius: open ? "4px" : "2rem" }}
        key={String(open)}
        className="relative mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-4 py-2 lg:hidden"
      >
        <div className="flex w-full flex-row items-center justify-between">
          <Logo />
          {open ? (
            <IconX
              className="text-white cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          ) : (
            <IconMenu2
              className="text-white cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          )}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 top-16 z-20 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-neutral-900 px-4 py-8 dark:bg-neutral-900 border border-neutral-800"
            >
              {navItems.map((navItem: any, idx: number) => (
                <div key={`navItem-${idx}`} className="w-full">
                  {navItem.children ? (
                    <MobileChildNavItems navItem={navItem} />
                  ) : (
                    <Link
                      href={navItem.link}
                      className="relative text-white hover:text-neutral-300"
                    >
                      <motion.span className="block">
                        {navItem.name}
                      </motion.span>
                    </Link>
                  )}
                </div>
              ))}
              <button className="w-full rounded-lg bg-white px-8 py-2 font-medium text-black shadow-[0px_-2px_0px_0px_rgba(0,0,0,0.1)_inset]">
                Book a call
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

const MobileChildNavItems = ({ navItem }: { navItem: any }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div className="overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex w-full justify-between text-white hover:text-neutral-300"
      >
        <motion.span className="block">{navItem.name}</motion.span>
        <IconChevronDown className="text-white" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0 }}
            className="pl-4"
          >
            {navItem.children.map((child: any, childIdx: number) => (
              <Link
                key={`child-${childIdx}`}
                href={child.link}
                className="relative text-neutral-400 hover:text-white block py-1"
              >
                <motion.span className="block">{child.name}</motion.span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-white hover:text-neutral-300"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute left-1/2 top-[calc(100%_+_0.2rem)] -translate-x-1/2 transform pt-4">
              <div className="">
                <motion.div
                  transition={transition}
                  layoutId="active" // layoutId ensures smooth animation
                  className="mt-4 overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl backdrop-blur-sm"
                >
                  <motion.div
                    layout // layout ensures smooth animation
                    className="h-full w-max p-4"
                  >
                    {children}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className="relative flex justify-center space-x-4 rounded-full bg-transparent px-4 py-3"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link href={href} className="flex gap-4">
      <div className="w-[140px] h-[70px] flex-shrink-0 rounded-md overflow-hidden">
        <img
          src={src}
          width={140}
          height={70}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h4 className="mb-1 text-base font-normal text-white">
          {title}
        </h4>
        <p className="max-w-[10rem] text-sm text-neutral-400">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      className="text-neutral-400 hover:text-white"
    >
      {children}
    </Link>
  );
};