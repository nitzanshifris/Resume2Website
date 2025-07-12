"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import Marquee from "react-fast-marquee";

export function LogosWithBlurFlip() {
  const [logos, setLogos] = useState([
    [
      {
        name: "Aceternity UI",
        src: "https://assets.aceternity.com/pro/logos/aceternity-ui.png",
      },
      {
        name: "Gamity",
        src: "https://assets.aceternity.com/pro/logos/gamity.png",
      },
      {
        name: "Host it",
        src: "https://assets.aceternity.com/pro/logos/hostit.png",
      },
      {
        name: "Asteroid Kit",
        src: "https://assets.aceternity.com/pro/logos/asteroid-kit.png",
      },
    ],
    [
      {
        name: "Aceternity UI 2",
        src: "https://assets.aceternity.com/pro/logos/aceternity-ui.png",
      },
      {
        name: "Gamity 2",
        src: "https://assets.aceternity.com/pro/logos/gamity.png",
      },
      {
        name: "Host it 2",
        src: "https://assets.aceternity.com/pro/logos/hostit.png",
      },
      {
        name: "Asteroid Kit 2",
        src: "https://assets.aceternity.com/pro/logos/asteroid-kit.png",
      },
    ],
  ]);
  const [activeLogoSet, setActiveLogoSet] = useState(logos[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const flipLogos = () => {
    setLogos((currentLogos) => {
      const newLogos = [...currentLogos.slice(1), currentLogos[0]];
      setActiveLogoSet(newLogos[0]);
      setIsAnimating(true);
      return newLogos;
    });
  };

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        flipLogos();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <div className="relative z-20 px-4 py-10 md:px-8 md:py-40">
      <h2 className="bg-gradient-to-b from-neutral-900 to-neutral-600 bg-clip-text text-center font-sans text-2xl font-bold text-transparent md:text-5xl dark:from-white dark:to-neutral-600">
        Trusted by the best companies
      </h2>
      <p className="mt-4 text-center font-sans text-base text-neutral-700 dark:text-neutral-300">
        Companies that have been using our product from the very start.
      </p>
      <div className="relative mt-20 flex h-full w-full flex-wrap justify-center gap-10 md:gap-10">
        <AnimatePresence
          mode="popLayout"
          onExitComplete={() => {
            setIsAnimating(false);
          }}
        >
          {activeLogoSet.map((logo, idx) => (
            <motion.div
              initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -40, opacity: 0, filter: "blur(10px)" }}
              transition={{
                duration: 0.8,
                delay: 0.1 * idx,
                ease: [0.4, 0, 0.2, 1],
              }}
              key={logo.name + idx + "logo-flip"}
              className="relative"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width="100"
                height="100"
                className="h-10 w-20 object-contain filter md:h-20 md:w-40 dark:invert"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function LogoCloudMarquee() {
  const logos = [
    {
      name: "Aceternity UI",
      src: "https://assets.aceternity.com/pro/logos/aceternity-ui.png",
    },
    {
      name: "Gamity",
      src: "https://assets.aceternity.com/pro/logos/gamity.png",
    },
    {
      name: "Host it",
      src: "https://assets.aceternity.com/pro/logos/hostit.png",
    },
    {
      name: "Asteroid Kit",
      src: "https://assets.aceternity.com/pro/logos/asteroid-kit.png",
    },
    {
      name: "Aceternity UI 2",
      src: "https://assets.aceternity.com/pro/logos/aceternity-ui.png",
    },
    {
      name: "Gamity 2",
      src: "https://assets.aceternity.com/pro/logos/gamity.png",
    },
    {
      name: "Host it 2",
      src: "https://assets.aceternity.com/pro/logos/hostit.png",
    },
    {
      name: "Asteroid Kit 2",
      src: "https://assets.aceternity.com/pro/logos/asteroid-kit.png",
    },
  ];

  return (
    <div className="relative z-20 px-4 py-10 md:px-8 md:py-40">
      <h2 className="bg-gradient-to-b from-neutral-900 to-neutral-600 bg-clip-text text-center font-sans text-2xl font-bold text-transparent md:text-5xl dark:from-white dark:to-neutral-600">
        Brands love us
      </h2>
      <p className="mt-4 text-center font-sans text-base text-neutral-700 dark:text-neutral-300">
        Aceternity UI is loved by the best companies who are serious about what
        they do.
      </p>

      <div className="relative mx-auto mt-20 flex h-full w-full max-w-7xl flex-wrap justify-center gap-10 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
        <Marquee pauseOnHover direction="right">
          {logos.map((logo, idx) => (
            <Image
              key={logo.name + "logo-marquee" + idx}
              src={logo.src}
              alt={logo.name}
              width="100"
              height="100"
              className="mx-0 w-32 object-contain filter md:mx-10 md:w-40 dark:invert"
            />
          ))}
        </Marquee>
      </div>
      <div className="relative mx-auto mt-4 flex h-full w-full max-w-7xl flex-wrap justify-center gap-10 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] md:mt-20 md:gap-40">
        <Marquee pauseOnHover direction="left" speed={30}>
          {logos.map((logo, idx) => (
            <Image
              key={logo.name + "logo-marquee-second" + idx}
              src={logo.src}
              alt={logo.name}
              width="100"
              height="100"
              className="mx-0 w-32 object-contain filter md:mx-10 md:w-40 dark:invert"
            />
          ))}
        </Marquee>
      </div>
    </div>
  );
}

export function SpotlightLogoCloud() {
  const logos = [
    {
      name: "Aceternity UI",
      src: "https://assets.aceternity.com/pro/logos/aceternity-ui.png",
    },
    {
      name: "Gamity",
      src: "https://assets.aceternity.com/pro/logos/gamity.png",
    },
    {
      name: "Host it",
      src: "https://assets.aceternity.com/pro/logos/hostit.png",
    },
    {
      name: "Asteroid Kit",
      src: "https://assets.aceternity.com/pro/logos/asteroid-kit.png",
    },
    {
      name: "Asteroid Kit 2",
      src: "https://assets.aceternity.com/pro/logos/asteroid-kit.png",
    },

    {
      name: "Host it 2",
      src: "https://assets.aceternity.com/pro/logos/hostit.png",
    },
    {
      name: "Aceternity UI 2",
      src: "https://assets.aceternity.com/pro/logos/aceternity-ui.png",
    },
    {
      name: "Gamity 2",
      src: "https://assets.aceternity.com/pro/logos/gamity.png",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden py-40">
      <AmbientColor />
      <h2 className="bg-gradient-to-b from-neutral-900 to-neutral-600 bg-clip-text pb-4 text-center font-sans text-2xl font-bold text-transparent md:text-5xl dark:from-white dark:to-neutral-600">
        Brands with a spotlight
      </h2>
      <p className="text-neutral-7000 mb-10 mt-4 text-center font-sans text-base dark:text-neutral-300">
        Brands who funded us deserve more than a spotlight. Check out what they
        are saying.
      </p>
      <div className="relative mx-auto grid w-full max-w-3xl grid-cols-4 gap-10">
        {logos.map((logo, idx) => (
          <div
            key={logo.src + idx + "logo-spotlight"}
            className="flex items-center justify-center"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              width={100}
              height={100}
              className="w-full select-none object-contain dark:invert dark:filter"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export const AmbientColor = () => {
  return (
    <div className="pointer-events-none absolute left-40 top-0 z-40 h-screen w-screen">
      <div
        style={{
          transform: "translateY(-350px) rotate(-45deg)",
          width: "560px",
          height: "1380px",
          background:
            "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(240, 100%, 85%, .2) 0, hsla(240, 100%, 55%, .1) 50%, hsla(240, 100%, 45%, .05) 80%)",
          filter: "blur(20px)",
          borderRadius: "50%",
        }}
        className="absolute left-0 top-0"
      />

      <div
        style={{
          transform: "rotate(-45deg) translate(5%, -50%)",
          transformOrigin: "top left",
          width: "240px",
          height: "1380px",
          background:
            "radial-gradient(50% 50% at 50% 50%, hsla(240, 100%, 85%, .15) 0, hsla(240, 100%, 45%, .1) 80%, transparent 100%)",
          filter: "blur(20px)",
          borderRadius: "50%",
        }}
        className="absolute left-0 top-0"
      />

      <div
        style={{
          position: "absolute",
          borderRadius: "50%",
          transform: "rotate(-45deg) translate(-180%, -70%)",
          transformOrigin: "top left",
          top: 0,
          left: 0,
          width: "240px",
          height: "1380px",
          background:
            "radial-gradient(50% 50% at 50% 50%, hsla(240, 100%, 85%, .1) 0, hsla(240, 100%, 45%, .05) 80%, transparent 100%)",
          filter: "blur(20px)",
        }}
        className="absolute left-0 top-0"
      />
    </div>
  );
};