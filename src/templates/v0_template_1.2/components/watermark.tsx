export function Watermark() {
  return (
    <>
      {/* Corner badges */}
      <div className="fixed top-8 right-8 z-50 pointer-events-none select-none">
        <div
          className="bg-black/10 dark:bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-black/10 dark:border-white/10"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">DEMO VERSION</span>
          </div>
        </div>
      </div>

      {/* Floating watermark elements */}
      <div className="fixed top-1/4 left-10 z-50 pointer-events-none select-none opacity-10 transform rotate-[-25deg]">
        <div className="text-7xl font-black text-gray-800 dark:text-gray-200">R2W</div>
      </div>

      <div className="fixed bottom-1/4 right-10 z-50 pointer-events-none select-none opacity-10 transform rotate-[25deg]">
        <div className="text-7xl font-black text-gray-800 dark:text-gray-200">R2W</div>
      </div>

      {/* Bottom banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none select-none">
        <div
          className="bg-gradient-to-t from-black/5 to-transparent dark:from-white/5 py-8"
          style={{ backdropFilter: "blur(2px)" }}
        >
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 opacity-60">
              This is a preview of your Resume2Web portfolio
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 opacity-50 mt-1">
              Upgrade to remove watermarks and unlock all features
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
