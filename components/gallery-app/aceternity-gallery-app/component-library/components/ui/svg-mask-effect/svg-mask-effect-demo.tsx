"use client";
import { MaskContainer } from "./svg-mask-effect-base";

export function SVGMaskEffectDemo() {
  return (
    <div className="flex h-[40rem] w-full items-center justify-center overflow-hidden">
      <MaskContainer
        revealText={
          <p className="mx-auto max-w-4xl text-center text-4xl font-bold text-slate-800 dark:text-white">
            The first rule of MRR Club is you do not talk about MRR Club. The
            second rule of MRR Club is you DO NOT talk about MRR Club.
          </p>
        }
        className="h-[40rem] rounded-md border text-white dark:text-black"
      >
        Discover the power of{" "}
        <span className="text-blue-500">Tailwind CSS v4</span> with native CSS
        variables and container queries with{" "}
        <span className="text-blue-500">advanced animations</span>.
      </MaskContainer>
    </div>
  );
}

export function SVGMaskEffectMinimal() {
  return (
    <div className="flex h-[40rem] w-full items-center justify-center overflow-hidden">
      <MaskContainer
        revealText={
          <p className="text-center text-2xl font-semibold text-slate-800 dark:text-white">
            Hello World
          </p>
        }
        className="h-[40rem] rounded-md border text-white dark:text-black"
        size={5}
        revealSize={300}
      >
        <span className="text-sm">Hover to reveal</span>
      </MaskContainer>
    </div>
  );
}

export function SVGMaskEffectColorful() {
  return (
    <div className="flex h-[40rem] w-full items-center justify-center overflow-hidden">
      <MaskContainer
        revealText={
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              Welcome to the Future
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Experience the magic of interactive design with smooth animations and beautiful gradients.
            </p>
          </div>
        }
        className="h-[40rem] rounded-md border text-white dark:text-black"
      >
        <div>
          <h2 className="text-3xl mb-2">✨ Interactive Design</h2>
          <p className="text-lg opacity-90">Move your cursor to explore</p>
        </div>
      </MaskContainer>
    </div>
  );
}

export function SVGMaskEffectLarge() {
  return (
    <div className="flex h-[40rem] w-full items-center justify-center overflow-hidden">
      <MaskContainer
        revealText={
          <div className="mx-auto max-w-5xl text-center space-y-8">
            <h1 className="text-6xl font-bold text-slate-800 dark:text-white">
              Unleash Your Creativity
            </h1>
            <p className="text-2xl text-gray-600 dark:text-gray-300">
              Build stunning interfaces with cutting-edge web technologies
            </p>
            <div className="flex justify-center gap-4">
              <div className="px-6 py-3 bg-blue-500 text-white rounded-lg">React</div>
              <div className="px-6 py-3 bg-green-500 text-white rounded-lg">Tailwind</div>
              <div className="px-6 py-3 bg-purple-500 text-white rounded-lg">Framer Motion</div>
            </div>
          </div>
        }
        className="h-[40rem] rounded-md border text-white dark:text-black"
        size={20}
        revealSize={800}
      >
        <div className="text-center">
          <div className="text-8xl mb-4">🎨</div>
          <p className="text-2xl">Hover to see the magic</p>
        </div>
      </MaskContainer>
    </div>
  );
}

export function SVGMaskEffectMultiline() {
  return (
    <div className="flex h-[40rem] w-full items-center justify-center overflow-hidden">
      <MaskContainer
        revealText={
          <div className="mx-auto max-w-4xl space-y-6">
            <blockquote className="text-3xl font-medium text-slate-800 dark:text-white border-l-4 border-blue-500 pl-4">
              "The only way to do great work is to love what you do."
            </blockquote>
            <p className="text-xl text-gray-600 dark:text-gray-400 text-right">
              — Steve Jobs
            </p>
            <div className="pt-8">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                This quote reminds us that passion is the key to excellence. When you love what you do, 
                work becomes a journey of discovery and creation, not just a means to an end.
              </p>
            </div>
          </div>
        }
        className="h-[40rem] rounded-md border bg-gradient-to-b from-gray-900 to-gray-800 text-white dark:text-black"
      >
        <div className="space-y-4">
          <p className="text-2xl">💡 Inspiration</p>
          <p className="text-lg opacity-80">Hover to reveal wisdom</p>
        </div>
      </MaskContainer>
    </div>
  );
}