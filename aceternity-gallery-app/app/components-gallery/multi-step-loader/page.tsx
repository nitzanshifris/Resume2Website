"use client";

import { useState } from "react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

const loadingStates = [
  {
    text: "Buying a condo",
  },
  {
    text: "Travelling around the world",
  },
  {
    text: "Meeting Elon Musk",
  },
  {
    text: "Building a spaceship",
  },
  {
    text: "Going to the moon",
  },
  {
    text: "Planting flag on moon",
  },
  {
    text: "Celebrating on moon",
  },
];

const workStates = [
  {
    text: "Analyzing requirements",
  },
  {
    text: "Setting up environment",
  },
  {
    text: "Installing dependencies",
  },
  {
    text: "Configuring settings",
  },
  {
    text: "Building application",
  },
  {
    text: "Running tests",
  },
  {
    text: "Deployment complete",
  },
];

const learningStates = [
  {
    text: "Reading documentation",
  },
  {
    text: "Watching tutorials",
  },
  {
    text: "Practicing exercises",
  },
  {
    text: "Building projects",
  },
  {
    text: "Getting feedback",
  },
  {
    text: "Mastering concepts",
  },
];

const gameStates = [
  {
    text: "Loading game assets",
  },
  {
    text: "Initializing world",
  },
  {
    text: "Spawning characters",
  },
  {
    text: "Connecting to server",
  },
  {
    text: "Syncing data",
  },
  {
    text: "Ready to play",
  },
];

export default function MultiStepLoaderPage() {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Multi Step Loader</h1>
          <p className="text-xl text-gray-400">
            A step loader showing progress through multiple states with checkmarks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dream Loader */}
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Dream Loader</h3>
            <p className="text-gray-400 mb-4">
              A fun loader with dream-like states and goals
            </p>
            <button
              onClick={() => setLoading1(!loading1)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {loading1 ? "Stop Loading" : "Start Loading"}
            </button>
            <MultiStepLoader loadingStates={loadingStates} loading={loading1} duration={2000} />
          </div>

          {/* Work Loader */}
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Development Process</h3>
            <p className="text-gray-400 mb-4">
              Typical steps in a development workflow
            </p>
            <button
              onClick={() => setLoading2(!loading2)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              {loading2 ? "Stop Process" : "Start Process"}
            </button>
            <MultiStepLoader loadingStates={workStates} loading={loading2} duration={1500} />
          </div>

          {/* Learning Loader */}
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Learning Journey</h3>
            <p className="text-gray-400 mb-4">
              Steps in a typical learning process
            </p>
            <button
              onClick={() => setLoading3(!loading3)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              {loading3 ? "Stop Learning" : "Start Learning"}
            </button>
            <MultiStepLoader loadingStates={learningStates} loading={loading3} duration={2500} />
          </div>

          {/* Game Loader */}
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Game Loading</h3>
            <p className="text-gray-400 mb-4">
              Loading sequence for a game startup
            </p>
            <button
              onClick={() => setLoading4(!loading4)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
            >
              {loading4 ? "Stop Game" : "Start Game"}
            </button>
            <MultiStepLoader loadingStates={gameStates} loading={loading4} duration={1800} />
          </div>
        </div>
      </div>
    </div>
  );
}