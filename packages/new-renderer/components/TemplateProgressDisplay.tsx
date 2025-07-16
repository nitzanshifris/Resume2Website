"use client";

import { useState, useEffect } from "react";

// Template-specific message types for CV2WEB
interface TemplateMessage {
  type: "cv_processing" | "template_selection" | "template_generation" | "preview_ready" | "error" | "complete";
  content?: string;
  step?: string;
  progress?: number;
  template?: string;
  previewUrl?: string;
  timestamp?: string;
  details?: any;
}

interface TemplateProgressDisplayProps {
  messages: TemplateMessage[];
  isGenerating: boolean;
  currentTemplate?: string;
}

export default function TemplateProgressDisplay({ 
  messages, 
  isGenerating,
  currentTemplate 
}: TemplateProgressDisplayProps) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  useEffect(() => {
    // Track completed steps
    const completed = messages
      .filter(m => m.type !== 'error')
      .map(m => m.step)
      .filter((step): step is string => Boolean(step));
    
    setCompletedSteps([...new Set(completed)]);
  }, [messages]);

  if (messages.length === 0 && !isGenerating) return null;

  // Filter to show relevant messages for template generation
  const displayMessages = messages.filter(m => 
    m.type !== 'error' || m.content // Show errors only if they have content
  );

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 max-h-[600px] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Portfolio Generation</h3>
            {currentTemplate && (
              <p className="text-sm text-gray-400 mt-1">Using template: {currentTemplate}</p>
            )}
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {isGenerating ? (
              <div className="flex items-center gap-2 text-sm text-blue-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Generating...</span>
              </div>
            ) : completedSteps.length > 0 ? (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Ready</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>CV Processing</span>
            <span>Template Selection</span>
            <span>Generation</span>
            <span>Preview</span>
          </div>
          
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(100, (completedSteps.length / 4) * 100)}%` 
              }}
            />
          </div>
        </div>
        
        {/* Messages */}
        <div className="space-y-3">
          {displayMessages.map((message, index) => {
            
            // CV Processing step
            if (message.type === 'cv_processing') {
              return (
                <div key={index} className="animate-fadeIn">
                  <div className="flex items-center gap-3 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-blue-300 font-medium">Processing CV Data</div>
                      <div className="text-gray-400 text-sm">{message.content || message.step}</div>
                    </div>
                  </div>
                </div>
              );
            }

            // Template Selection step
            if (message.type === 'template_selection') {
              return (
                <div key={index} className="animate-fadeIn">
                  <div className="flex items-center gap-3 p-3 bg-purple-900/20 border border-purple-700/30 rounded-lg">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-purple-300 font-medium">Template Selection</div>
                      <div className="text-gray-400 text-sm">{message.content || `Selected: ${message.template}`}</div>
                    </div>
                  </div>
                </div>
              );
            }

            // Template Generation step
            if (message.type === 'template_generation') {
              return (
                <div key={index} className="animate-fadeIn">
                  <div className="flex items-center gap-3 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-yellow-300 font-medium">Generating Portfolio</div>
                      <div className="text-gray-400 text-sm">{message.content || message.step}</div>
                      {message.progress !== undefined && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-700 rounded-full h-1">
                            <div 
                              className="bg-yellow-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${message.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{message.progress}% complete</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // Preview Ready step
            if (message.type === 'preview_ready') {
              return (
                <div key={index} className="animate-fadeIn">
                  <div className="flex items-center gap-3 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-green-300 font-medium">Preview Ready</div>
                      <div className="text-gray-400 text-sm">{message.content || 'Portfolio preview is ready'}</div>
                      {message.previewUrl && (
                        <a
                          href={message.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                        >
                          View Preview
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // Error messages
            if (message.type === 'error') {
              return (
                <div key={index} className="animate-fadeIn">
                  <div className="flex items-center gap-3 p-3 bg-red-900/20 border border-red-700/30 rounded-lg">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-red-300 font-medium">Error</div>
                      <div className="text-gray-400 text-sm">{message.content}</div>
                    </div>
                  </div>
                </div>
              );
            }

            // Complete message
            if (message.type === 'complete') {
              return (
                <div key={index} className="animate-fadeIn">
                  <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-green-300 font-semibold">Portfolio Generated Successfully!</div>
                      <div className="text-gray-400 text-sm">Your portfolio is ready for preview and deployment</div>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}
          
          {/* Show loading indicator if still generating */}
          {isGenerating && (
            <div className="flex items-center gap-3 p-3 text-gray-400">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
              </div>
              <span className="text-sm">Processing your portfolio...</span>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}