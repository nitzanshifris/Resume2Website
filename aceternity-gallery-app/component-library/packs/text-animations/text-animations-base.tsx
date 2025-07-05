"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, AnimationProps, motion, LayoutGroup } from "motion/react";
import React, { useEffect, useState } from "react";

const FlippingText = ({
  words,
  className,
}: {
  words: string[];
  className?: string;
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentWord = words[currentWordIndex];

  useEffect(() => {
    const typingSpeed = 50; // Speed for typing characters
    const deletingSpeed = 50; // Speed for deleting characters
    const pauseBeforeDelete = 1000; // Pause before starting to delete

    let timeout: NodeJS.Timeout;

    if (!isDeleting && visibleCharacters < currentWord.length) {
      // Typing mode - add characters
      timeout = setTimeout(() => {
        setVisibleCharacters((prev) => prev + 1);
      }, typingSpeed);
    } else if (!isDeleting && visibleCharacters === currentWord.length) {
      // Finished typing - pause before deleting
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseBeforeDelete);
    } else if (isDeleting && visibleCharacters > 0) {
      // Deleting mode - remove characters
      timeout = setTimeout(() => {
        setVisibleCharacters((prev) => prev - 1);
      }, deletingSpeed);
    } else if (isDeleting && visibleCharacters === 0) {
      // Finished deleting - move to next word
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [
    currentWord,
    currentWordIndex,
    isDeleting,
    visibleCharacters,
    words.length,
  ]);

  return (
    <span className={cn("relative inline-block", className)}>
      <span className="tracking-tighter">
        {currentWord
          .substring(0, visibleCharacters)
          .split("")
          .map((char, index) => (
            <motion.span
              key={`${index}-${char}`}
              initial={{
                opacity: 0,
                rotateY: 90,
                y: 10,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                rotateY: 0,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                rotateY: -90,
                y: -10,
                filter: "blur(10px)",
              }}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
      </span>
      <motion.span
        layout
        className="absolute -right-4 bottom-2 inline-block rounded-full bg-black"
        style={{
          width: isDeleting ? "0.45em" : "0.25em",
          height: "0.25em",
        }}
        animate={{
          backgroundColor: isDeleting
            ? "#ef4444" // hex for red-500
            : [
                "#60a5fa", // hex for blue-400
                "#22c55e", // hex for green-500
                "#3b82f6", // hex for blue-500
              ],
        }}
        transition={{
          duration: 0.1,
        }}
      />
    </span>
  );
};

export function TextAnimationFlippingWords() {
  const words = ["Next.js", "Tailwind CSS", "Motion", "Typescript", "Web GL"];

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 md:grid-cols-2 md:px-8">
      <div>
        <h1 className="mb-4 text-left text-2xl font-bold md:text-5xl">
          Built with <FlippingText words={words} />
        </h1>
        <p className="mt-4 text-left text-base text-neutral-600 dark:text-neutral-400">
          Create stunning animations that bring your website to life. Elevate
          your user experience with smooth transitions and eye-catching effects
          that captivate visitors and keep them engaged.
        </p>

        <LogoCloud />
      </div>
      <IphoneMockup>
        <div className="flex flex-col space-y-4 overflow-y-auto p-4">
          {[
            {
              title: "Getting Started",
              description: "Learn how to build your first animation in minutes",
              icon: "🚀",
            },
            {
              title: "Advanced Techniques",
              description:
                "Take your animations to the next level with these pro tips",
              icon: "⚡",
            },
            {
              title: "Performance Tips",
              description: "Optimize your animations for smooth rendering",
              icon: "⚙️",
            },
            {
              title: "Animation Library",
              description: "Browse our collection of pre-built animations",
              icon: "📚",
            },
            {
              title: "Community Showcase",
              description: "See what others are building with our tools",
              icon: "🌟",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-4 shadow-md transition-all hover:shadow-lg dark:bg-neutral-800"
            >
              <div className="flex items-start space-x-3">
                <div className="text-xl">{card.icon}</div>
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                    {card.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </IphoneMockup>
    </div>
  );
}

const LogoCloud = () => {
  return (
    <div className="mt-8">
      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        Trusted by leading companies
      </p>
      {/* Company logos display */}
      <div className="mt-4 flex flex-wrap gap-6">
        {[
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
        ].map((logo) => (
          <div key={logo.name} className="flex items-center">
            <img
              src={logo.src}
              alt={logo.name}
              className="h-10 w-auto object-contain transition-all dark:invert dark:filter"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

interface IphoneMockupProps {
  image?: string;
  children?: React.ReactNode;
}

export const IphoneMockup = ({ image, children }: IphoneMockupProps) => {
  return (
    <div className="relative mx-auto h-[600px] w-[300px] md:h-[680px] md:w-[340px]">
      {/* iPhone frame */}
      <div className="absolute inset-0 rounded-[50px] border-[14px] border-black bg-black shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* Dynamic Island */}
        <div className="absolute top-[0.5rem] left-1/2 z-10 h-[1.8rem] w-[6rem] -translate-x-1/2 rounded-full bg-black dark:bg-neutral-800">
          <div className="absolute top-1/2 right-3 h-[0.6rem] w-[0.6rem] -translate-y-1/2 rounded-full bg-[#1a1a1a] ring-[1.5px] ring-[#2a2a2a] dark:bg-neutral-700 dark:ring-neutral-600">
            <div className="absolute inset-[1.5px] rounded-full bg-[#0f0f0f] dark:bg-neutral-800">
              <div className="absolute inset-[1.5px] rounded-full bg-[#151515] ring-[0.75px] ring-[#202020] dark:bg-neutral-700 dark:ring-neutral-600" />
            </div>
          </div>
        </div>
        {/* Status icons */}
        <div className="absolute inset-0 top-[0.5rem] z-20 flex h-[1.8rem] items-center justify-between px-4 text-[0.65rem] text-black dark:text-white">
          {/* Time */}
          <span className="text-[0.9rem] font-medium">9:41</span>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="13"
              viewBox="0 0 20 13"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.2 1.72656C19.2 1.10524 18.7224 0.601562 18.1333 0.601562H17.0667C16.4776 0.601562 16 1.10524 16 1.72656V11.4766C16 12.0979 16.4776 12.6016 17.0667 12.6016H18.1333C18.7224 12.6016 19.2 12.0979 19.2 11.4766V1.72656ZM11.7659 3H12.8326C13.4217 3 13.8992 3.51577 13.8992 4.152V11.448C13.8992 12.0842 13.4217 12.6 12.8326 12.6H11.7659C11.1768 12.6 10.6992 12.0842 10.6992 11.448V4.152C10.6992 3.51577 11.1768 3 11.7659 3ZM7.43411 5.60156H6.36745C5.77834 5.60156 5.30078 6.1239 5.30078 6.76823V11.4349C5.30078 12.0792 5.77834 12.6016 6.36745 12.6016H7.43411C8.02322 12.6016 8.50078 12.0792 8.50078 11.4349V6.76823C8.50078 6.1239 8.02322 5.60156 7.43411 5.60156ZM2.13333 8H1.06667C0.477563 8 0 8.51487 0 9.15V11.45C0 12.0851 0.477563 12.6 1.06667 12.6H2.13333C2.72244 12.6 3.2 12.0851 3.2 11.45V9.15C3.2 8.51487 2.72244 8 2.13333 8Z"
                fill="currentColor"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="13"
              viewBox="0 0 18 13"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.27052 3.11983C11.7576 3.11993 14.1496 4.02494 15.9521 5.6478C16.0879 5.77309 16.3048 5.77151 16.4385 5.64426L17.736 4.40419C17.8037 4.33964 17.8414 4.25222 17.8409 4.16125C17.8403 4.07029 17.8015 3.98328 17.733 3.9195C13.002 -0.374207 5.53829 -0.374207 0.807275 3.9195C0.738743 3.98324 0.699859 4.07021 0.699227 4.16118C0.698595 4.25214 0.736267 4.3396 0.803908 4.40419L2.10177 5.64426C2.23537 5.7717 2.45249 5.77328 2.58814 5.6478C4.39088 4.02483 6.78317 3.11982 9.27052 3.11983ZM9.26717 7.26377C10.6245 7.26369 11.9334 7.76595 12.9395 8.67297C13.0756 8.80169 13.2899 8.7989 13.4226 8.66668L14.7099 7.3718C14.7777 7.30388 14.8153 7.21174 14.8143 7.116C14.8133 7.02025 14.7738 6.92889 14.7047 6.86236C11.6408 4.02505 6.8961 4.02505 3.83227 6.86236C3.76306 6.92889 3.72357 7.0203 3.72266 7.11607C3.72176 7.21185 3.7595 7.30398 3.82744 7.3718L5.11435 8.66668C5.247 8.7989 5.46136 8.80169 5.59745 8.67297C6.6029 7.76655 7.91074 7.26433 9.26717 7.26377ZM11.7916 10.0035C11.7935 10.1069 11.7565 10.2066 11.6892 10.279L9.51249 12.6883C9.44868 12.7591 9.36169 12.799 9.27092 12.799C9.18015 12.799 9.09316 12.7591 9.02935 12.6883L6.85232 10.279C6.78507 10.2065 6.74808 10.1068 6.75007 10.0034C6.75206 9.90002 6.79287 9.8021 6.86286 9.73279C8.25296 8.44324 10.2889 8.44324 11.679 9.73279C11.7489 9.80216 11.7897 9.90011 11.7916 10.0035Z"
                fill="currentColor"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="14"
              viewBox="0 0 28 14"
              fill="none"
            >
              <rect
                opacity="0.35"
                x="0.699219"
                y="0.601562"
                width="24"
                height="12"
                rx="3.8"
                fill="currentColor"
                stroke="white"
              />
              <path
                opacity="0.4"
                d="M26.0977 4.76953V8.76953C26.9024 8.43075 27.4257 7.64266 27.4257 6.76953C27.4257 5.8964 26.9024 5.10831 26.0977 4.76953Z"
                fill="currentColor"
              />
              <rect
                x="2"
                y="2.10156"
                width="21"
                height="9"
                rx="2.5"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[35px] bg-white dark:bg-neutral-950">
          <div className="absolute inset-0 top-[2.3rem]">
            {image && (
              <img src={image} alt="App screenshot" className="object-cover" />
            )}
            {children}
          </div>
        </div>
      </div>

      {/* Side Buttons */}
      <div className="absolute top-[170px] -right-[2px] h-12 w-[3px] rounded-l-lg bg-black dark:bg-neutral-800"></div>
      <div className="absolute top-[120px] -left-[2px] h-12 w-[3px] rounded-r-lg bg-black dark:bg-neutral-800"></div>
      <div className="absolute top-[170px] -left-[2px] h-14 w-[3px] rounded-r-lg bg-black dark:bg-neutral-800"></div>
    </div>
  );
};

export function TextAnimationTypewriterEffect() {
  return (
    <div className="p-4">
      <h1 className="text-left text-2xl font-bold tracking-tighter text-neutral-800 md:text-7xl dark:text-neutral-200">
        Build awesome websites <br /> with
        <TypewriterEffect
          words={["Next.js", "Tailwind CSS", "Motion", "Typescript", "React"]}
          typingSpeed={80}
          duration={800}
          deletingSpeed={75}
        />
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
        Create stunning animated text effects with our typewriter component.
        Perfect for landing pages, portfolios, and interactive experiences.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-lg bg-neutral-900 px-6 py-3 font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Get Started
          <motion.span
            className="ml-2 inline-block"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-lg border border-neutral-300 px-6 py-3 font-medium text-neutral-900 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          <motion.span
            className="inline-block"
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          >
            ✨
          </motion.span>
          <span className="ml-2">View Examples</span>
        </motion.button>
      </div>
    </div>
  );
}

export function TypewriterEffect({
  words,
  className,
  typingSpeed = 50,
  duration = 800,
  deletingSpeed = 75,
}: {
  words: string[];
  className?: string;
  typingSpeed?: number;
  duration?: number;
  deletingSpeed?: number;
}) {
  const [currentWord, setCurrentWord] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(typingSpeed);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Current word being typed
      const word = words[currentIndex];

      if (!isDeleting) {
        // Typing forward
        setCurrentWord(word.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);

        // If word is complete, pause then start deleting
        if (charIndex >= word.length) {
          setIsDeleting(true);
          setCurrentSpeed(duration); // Pause before deleting
        }
      } else {
        // Deleting
        setCurrentWord(word.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
        setCurrentSpeed(deletingSpeed); // Delete faster than typing

        // If word is deleted, move to next word
        if (charIndex <= 1) {
          setIsDeleting(false);
          setCurrentIndex((currentIndex + 1) % words.length);
          setCurrentSpeed(typingSpeed); // Reset typing speed
        }
      }
    }, currentSpeed);

    return () => clearTimeout(timeout);
  }, [
    currentWord,
    charIndex,
    currentIndex,
    isDeleting,
    currentSpeed,
    words,
    typingSpeed,
    duration,
    deletingSpeed,
  ]);

  return (
    <span
      className={cn(
        "relative inline-block [perspective:1000px] [transform-style:preserve-3d]",
        className,
      )}
    >
      &nbsp;
      <span>
        {currentWord.split("").map((char, index) => (
          <motion.span
            layout
            key={`${index}-${char}`}
            initial={{
              opacity: 0,
              y: 20,
              rotateY: 90,
              rotateX: 10,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotateY: 0,
              rotateX: 0,
              filter: "blur(0px)",
            }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </span>
      &nbsp;
      <motion.span
        layoutId="cursor"
        className="absolute inline-block w-[3px] rounded-full bg-gradient-to-b from-neutral-700 via-neutral-900 to-neutral-700 dark:from-neutral-400 dark:via-neutral-100 dark:to-neutral-400"
        style={{
          height: "1em",
          bottom: "0.05em",
          marginLeft: "0.1em",
        }}
        animate={{
          opacity: [1, 0, 1],
        }}
        transition={{
          duration: 0.1,
          opacity: {
            duration: 0.8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          },
        }}
      />
    </span>
  );
}

export function TextAnimationBlurFadeInDemo() {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <BlurFadeText className="mb-4 text-center text-2xl font-bold tracking-tight md:text-7xl">
        Animations that stand out from the rest.
      </BlurFadeText>
      <BlurFadeText
        className="mx-auto max-w-2xl text-center text-xl font-normal text-neutral-600 dark:text-neutral-600"
        delay={0.2}
      >
        Appearing text sets aside the text from the rest, it is a great way to
        make the text more engaging and interesting.
      </BlurFadeText>

      <div className="mt-8 flex flex-col justify-center gap-4 md:flex-row">
        <motion.button
          className="rounded-full bg-black px-6 py-3 text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          Get Started
        </motion.button>
        <motion.button
          className="rounded-full border border-black px-6 py-3 text-black transition-colors hover:bg-black/5 dark:border-white dark:text-white dark:hover:bg-white/5"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1 }}
        >
          Learn More
        </motion.button>
      </div>
    </div>
  );
}

const BlurFadeText = ({
  children,
  className,
  delay = 0,
  ...animationProps
}: {
  children: string;
  className?: string;
  delay?: number;
} & AnimationProps) => {
  return (
    <motion.p
      {...animationProps}
      className={cn("text-4xl font-medium", className)}
    >
      {children.split(" ").map((word, index) => (
        <motion.span
          key={`word-${index}-${word}`}
          initial={{
            opacity: 0,
            filter: "blur(10px)",
            y: 10,
          }}
          whileInView={{
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
          }}
          transition={{
            duration: 0.2,
            delay: delay + index * 0.02,
          }}
          className="inline-block"
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.p>
  );
};