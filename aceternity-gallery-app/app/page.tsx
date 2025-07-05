import Link from 'next/link'
import { Mouse, Layers, Package } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="text-center relative z-10 px-4">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 -z-10 max-w-7xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/20 to-transparent blur-3xl" />
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 text-glow tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Aceternity</span> Components
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Explore our collection of <span className="text-white font-semibold">beautiful UI components</span>, 
          <span className="text-white font-semibold">component packs</span>, and 
          <span className="text-white font-semibold">button designs</span>
        </p>
        
        {/* Feature badges */}
        <div className="flex gap-4 justify-center mb-8 flex-wrap">
          <div className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-xs text-gray-400">
            ✨ 60+ Components
          </div>
          <div className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-xs text-gray-400">
            🎨 Modern Design
          </div>
          <div className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-xs text-gray-400">
            ⚡ Production Ready
          </div>
        </div>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link 
            href="/components-gallery"
            className="group relative inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-all duration-300 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 glow-effect shimmer-effect overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            <Layers className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative z-10">Component Gallery</span>
          </Link>
          <Link 
            href="/packs-gallery"
            className="group relative inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-all duration-300 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 glow-effect shimmer-effect overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            <Package className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="relative z-10">Component Packs</span>
          </Link>
          <Link 
            href="/buttons"
            className="group relative inline-flex items-center gap-2 px-6 py-3 text-gray-400 rounded-lg transition-all duration-300 border border-gray-800 hover:border-gray-700 hover:text-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-gray-700/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Mouse className="w-4 h-4 relative z-10 group-hover:animate-pulse" />
            <span className="relative z-10">Button Collection</span>
          </Link>
        </div>
      </div>
    </div>
  )
}