import dynamic from 'next/dynamic'
import React from 'react'

// Define the props interface
interface PortfolioHeroPreviewProps {
  file: File
  onScrollAttempt?: () => void
}

// Dynamically import the component with no SSR to avoid DOMMatrix error
const DynamicPortfolioHeroPreview = dynamic(
  () => import('./portfolio-hero-preview').then(mod => ({ default: mod.default })),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-white/80 text-sm">Loading preview...</p>
        </div>
      </div>
    )
  }
)

// Wrapper component that properly passes all props
const PortfolioHeroPreview: React.FC<PortfolioHeroPreviewProps> = (props) => {
  return <DynamicPortfolioHeroPreview {...props} />
}

export default PortfolioHeroPreview