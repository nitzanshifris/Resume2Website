"use client"

import React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  language: string
  code: string
  filename?: string
  highlightLines?: number[]
  className?: string
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code, filename, highlightLines = [], className }) => {
  const [isCopied, setIsCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className={cn("rounded-xl border border-border/50 overflow-hidden bg-[#1e1e1e]", className)}>
      {filename && (
        <div className="flex justify-between items-center px-4 py-2 border-b border-border/50">
          <span className="text-sm text-muted-foreground">{filename}</span>
          <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
            {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers
        wrapLines={true}
        customStyle={{ margin: 0, borderRadius: 0, padding: "1.5rem 1rem" }}
        lineProps={(lineNumber) => {
          const style: React.CSSProperties = { display: "block", width: "100%" }
          if (highlightLines.includes(lineNumber)) {
            style.backgroundColor = "rgba(255, 255, 255, 0.1)"
            style.boxShadow = "inset 3px 0 0 0 hsl(var(--accent))"
          }
          return { style }
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
