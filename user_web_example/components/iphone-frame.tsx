import React from "react"

export default function IPhoneFrame({ children, className = "", onExpand, onClose, onMinimize, iframeUrl }: {
  children: React.ReactNode;
  className?: string;
  onExpand?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
  iframeUrl?: string;
}) {
  // Handler for expand
  const handleExpand = () => {
    if (iframeUrl) {
      window.open(iframeUrl, '_blank', 'noopener,noreferrer')
    } else if (onExpand) {
      onExpand()
    }
  }
  // Handler for close
  const handleClose = () => {
    if (onClose) onClose();
    else console.log('Close clicked')
  }
  // Handler for minimize
  const handleMinimize = () => {
    if (onMinimize) onMinimize();
    else console.log('Minimize clicked')
  }
  return (
    <div
      className={`relative mx-auto flex items-center justify-center rounded-[2.5rem] shadow-2xl border w-[320px] h-[580px] p-2 overflow-hidden ${className}`}
      style={{
        borderWidth: 1,
        borderColor: '#222',
        background: 'linear-gradient(160deg, rgba(30,30,35,0.95) 0%, rgba(10,10,15,1) 100%)',
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)"
      }}
    >
      {/* Top bar for controls, left-aligned, smaller icons, rounded corners */}
      <div className="absolute top-0 left-0 w-full h-6 flex items-center z-30 rounded-t-[2.5rem]"
        style={{
          background: 'rgba(0,0,0,0.18)',
          borderTopLeftRadius: '2.5rem',
          borderTopRightRadius: '2.5rem',
        }}
      >
        <div className="flex items-center gap-1.5 pl-4 pt-0.5 pb-0.5">
          <button
            className="w-2 h-2 rounded-full bg-red-400 border border-red-300 shadow-sm focus:outline-none"
            title="Close"
            tabIndex={-1}
            onClick={handleClose}
            style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.10)' }}
          />
          <button
            className="w-2 h-2 rounded-full bg-yellow-300 border border-yellow-200 shadow-sm focus:outline-none"
            title="Minimize"
            tabIndex={-1}
            onClick={handleMinimize}
            style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.10)' }}
          />
          <button
            className="w-2 h-2 rounded-full bg-green-400 border border-green-300 shadow-sm focus:outline-none"
            title="Expand"
            tabIndex={-1}
            onClick={handleExpand}
            style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.10)' }}
          />
        </div>
      </div>
      {/* Screen with Dynamic Island Notch fully inside */}
      <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-black mt-6 flex flex-col items-center">
        {/* Dynamic Island Notch (inside screen, not border) */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-[1.25rem] shadow-md z-20 flex items-center justify-center border border-gray-800" />
        {/* Actual screen content */}
        <div className="w-full h-full">
          {children}
        </div>
      </div>
    </div>
  )
} 