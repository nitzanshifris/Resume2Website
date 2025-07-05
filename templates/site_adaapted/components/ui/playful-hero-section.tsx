"use client"

import { cn } from "@/lib/utils"
import { Manrope } from "next/font/google"
import { useEffect, useRef } from "react"
import { RoughNotation, RoughNotationGroup } from "react-rough-notation"
import { animate, stagger, useInView } from "motion/react"
import { Linkedin, Mail, Phone, Youtube, Instagram, Facebook, CheckCircle2 } from "lucide-react"
import Image from "next/image"

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "700"] })

// Corrected SVGDataURI with a white frame
const SVGDataURI =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIxIiBoZWlnaHQ9Ijg1MiIgdmlld0JveD0iMCAwIDQyMSA4NTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03MyAwSDM0OEMzODYuNjYgMCA0MTggMzEuMzQwMSA0MTggNzBWNzgyQzQxOCA4MjAuNjYgMzg2LjY2IDg1MiAzNDggODUySDczQzM0LjM0MDEgODUyIDMgODIwLjY2IDMgNzgyVjcwQzMgMzEuMzQwMSAzNC4zNDAxIDAgNzMgMFpNMzQ4IDZINzNDMzcuNjUzOCA2IDkgMzQuNjUzOCA5IDcwVjc4MkM5IDgxNy4zNDYgMzcuNjUzOCA4NDYgNzMgODQ2SDM0OEMzODMuMzQ2IDg0NiA0MTIgODE3LjM0NiA0MTIgNzgyVjcwQzQxMiAzNC42NTM4IDM4My4zNDYgNiAzNDggNloiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iMTUwIiB5PSIzMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIzNSIgcng9IjE3LjUiIGZpbGw9IiMxMTExMTIiLz48cmVjdCB4PSIyNDQiIHk9IjQxIiB3aWR0aD0iMTMiIGhlaWdodD0iMTMiIHJ4PSI2LjUiIGZpbGw9IiMxMTExMTIiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PC9zdmc+"

export function PlayfulHeroSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="w-full bg-[#0B0B0F]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 overflow-hidden py-10 sm:grid-cols-2 md:py-20 lg:grid-cols-3">
        <div className="px-4 py-10 md:px-8 lg:col-span-2">
          <RoughNotationGroup show={isInView}>
            <h2
              className={cn(
                "text-center text-2xl font-bold tracking-tight text-white sm:text-left sm:text-5xl lg:text-6xl",
                manrope.className,
              )}
            >
              Michelle Jewett, a dedicated{" "}
              <RoughNotation
                type="highlight"
                animationDuration={2000}
                iterations={3}
                color="#0ea5e940"
                multiline
                padding={[0, 2]}
              >
                <span className="text-currentColor">Marketing & Business Graduate</span>
              </RoughNotation>{" "}
              is seeking an internship{" "}
              <RoughNotation type="underline" animationDuration={2000} iterations={10} color="#38bdf8">
                opportunity
              </RoughNotation>
            </h2>
            <p className="mt-4 max-w-2xl text-center text-sm text-slate-300 sm:text-left md:mt-10 md:text-lg">
              A recent graduate seeking to apply theoretical knowledge in the advertising field. Experienced with social
              media and blogging from university work,{" "}
              <RoughNotation type="underline" animationDuration={2000} iterations={10} color="#38bdf8" multiline>
                ready to add value
              </RoughNotation>{" "}
              to a dynamic marketing team.
            </p>
          </RoughNotationGroup>
          <div className="mt-10 flex flex-col items-center gap-4 [perspective:800px] sm:flex-row">
            <button className="w-full origin-left rounded-lg bg-sky-500 px-4 py-2 text-base font-bold text-white transition duration-200 hover:bg-sky-600 hover:shadow-lg hover:[transform:rotateX(10deg)] sm:w-auto">
              View Full CV
            </button>
          </div>
        </div>
        <div className="relative flex h-full w-full flex-shrink-0 items-center justify-center overflow-hidden">
          <Skeleton />
        </div>
      </div>
    </div>
  )
}

export const Skeleton = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const contacts = [
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-6 w-6" />,
      href: "#",
      color: "bg-blue-700",
    },
    {
      name: "Gmail",
      icon: <Mail className="h-6 w-6" />,
      href: "mailto:email@email.com",
      color: "bg-red-600",
    },
    {
      name: "Phone",
      icon: <Phone className="h-6 w-6" />,
      href: "tel:541-754-3010",
      color: "bg-green-500",
    },
    {
      name: "YouTube",
      icon: <Youtube className="h-6 w-6" />,
      href: "#",
      color: "bg-red-700",
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-6 w-6" />,
      href: "#",
      color: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500",
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-6 w-6" />,
      href: "#",
      color: "bg-blue-800",
    },
  ]

  useEffect(() => {
    if (isInView) {
      animate([
        [".contact-title", { opacity: [0, 1], y: [-20, 0] }, { duration: 0.5, delay: 0.2 }],
        [
          ".contact-icon",
          { opacity: [0, 1], scale: [0.5, 1] },
          { duration: 0.5, delay: stagger(0.1, { from: "center" }) },
        ],
        [".availability-badge", { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, at: "-0.5" }],
      ])
    }
  }, [isInView])

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[550px] w-[270px] bg-transparent"
      style={{
        backgroundImage: `url('${SVGDataURI}')`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-x-[12px] inset-y-[11px] overflow-hidden rounded-[30px]">
        <Image
          src="/dark-abstract-gradient.png"
          alt="iPhone wallpaper"
          fill
          className="pointer-events-none absolute inset-0 z-0 object-cover"
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-start gap-8 px-4 pt-16">
          <h3 className="contact-title text-3xl font-bold text-white opacity-0 drop-shadow-md">Get in Touch</h3>
          <div className="grid grid-cols-3 gap-4">
            {contacts.map((contact) => (
              <a
                key={contact.name}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-icon flex flex-col items-center gap-2 text-center text-white opacity-0"
              >
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-xl shadow-lg transition-transform duration-200 ease-in-out hover:scale-110",
                    contact.color,
                  )}
                >
                  {contact.icon}
                </div>
                <span className="text-[10px] font-medium text-white drop-shadow-sm">{contact.name}</span>
              </a>
            ))}
          </div>
          <div className="availability-badge mt-auto mb-6 flex items-center gap-2 rounded-full bg-green-400/20 px-4 py-2 text-sm font-medium text-green-200 opacity-0 ring-1 ring-inset ring-green-400/30">
            <CheckCircle2 className="h-4 w-4" />
            <span>Immediate Availability</span>
          </div>
        </div>
      </div>
    </div>
  )
}
