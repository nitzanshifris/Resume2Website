"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function TestIframePage() {
  // Some example Vercel deployed portfolios or any website
  const [portfolioUrl, setPortfolioUrl] = useState('https://portfolio-demo-ten-kappa.vercel.app/')
  const [inputUrl, setInputUrl] = useState('')
  
  const testUrls = [
    { name: 'Vercel Example', url: 'https://nextjs.org' },
    { name: 'Portfolio Demo', url: 'https://portfolio-demo-ten-kappa.vercel.app/' },
    { name: 'Local Test', url: 'http://localhost:4000' },
    { name: 'Resume2Website', url: 'https://resume2website.com' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Iframe MacBook Display Test</h1>
        
        {/* URL Input Section */}
        <Card className="p-6 bg-gray-800/50 backdrop-blur mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Test Any URL</h2>
          <div className="flex gap-4">
            <Input
              type="url"
              placeholder="Enter a URL to test (e.g., https://example.vercel.app)"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 bg-gray-700 text-white border-gray-600"
            />
            <Button 
              onClick={() => setPortfolioUrl(inputUrl)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Load URL
            </Button>
          </div>
          
          {/* Quick Test Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            {testUrls.map((test) => (
              <Button
                key={test.name}
                onClick={() => setPortfolioUrl(test.url)}
                variant="outline"
                size="sm"
                className="text-white border-gray-600 hover:bg-gray-700"
              >
                {test.name}
              </Button>
            ))}
          </div>
        </Card>

        {/* Current URL Display */}
        <Card className="p-4 bg-gray-800/50 backdrop-blur mb-8">
          <p className="text-white">
            <span className="text-gray-400">Currently displaying:</span>{' '}
            <span className="text-purple-400 font-mono">{portfolioUrl}</span>
          </p>
        </Card>

        {/* MacBook Display */}
        <div className="relative mx-auto" style={{ maxWidth: '1200px' }}>
          {/* MacBook Frame */}
          <div className="relative">
            {/* Screen Bezel */}
            <div className="bg-gray-900 rounded-t-3xl p-3 shadow-2xl">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              
              {/* URL Bar */}
              <div className="bg-gray-800 rounded-lg px-4 py-2 mb-3">
                <p className="text-xs text-gray-400 truncate">{portfolioUrl}</p>
              </div>
              
              {/* Screen Content - The Iframe */}
              <div className="relative bg-white rounded-lg overflow-hidden" style={{ aspectRatio: '16/10' }}>
                {portfolioUrl ? (
                  <iframe
                    src={portfolioUrl}
                    className="w-full h-full"
                    title="Portfolio Preview"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <p className="text-gray-500">Enter a URL to preview</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* MacBook Base */}
            <div className="bg-gray-800 h-6 rounded-b-xl shadow-xl">
              <div className="h-1 bg-gray-700 rounded-b-xl mx-auto" style={{ width: '20%' }}></div>
            </div>
          </div>
        </div>

        {/* CSP Information */}
        <Card className="mt-8 p-6 bg-gray-800/50 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Testing Notes:</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• If iframe is blank, the site may block embedding (X-Frame-Options or CSP)</li>
            <li>• Check browser console for CSP errors</li>
            <li>• Some sites like Google don't allow iframe embedding</li>
            <li>• Vercel sites usually allow embedding</li>
            <li>• Local URLs (localhost) won't work when deployed to production</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}