"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ExportButtonProps {
  data: any
  filename?: string
}

export function ExportButton({ data, filename = "portfolio-data.json" }: ExportButtonProps) {
  const handleExport = () => {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data, null, 2)
    
    // Create a blob from the JSON string
    const blob = new Blob([jsonString], { type: "application/json" })
    
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob)
    
    // Create a temporary anchor element and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    
    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      onClick={handleExport}
      size="icon"
      variant="outline"
      className={cn(
        "fixed bottom-8 right-48 z-50",
        "h-14 w-14 rounded-full",
        "bg-background dark:bg-background light:bg-purple-500",
        "border-0",
        "text-white",
        "shadow-lg hover:shadow-2xl",
        "hover:bg-background/80 dark:hover:bg-background/80 light:hover:bg-purple-600",
        "hover:scale-110",
        "transition-all duration-300 ease-out",
        "group"
      )}
      title="Export portfolio data"
    >
      <Download className="h-6 w-6 group-hover:animate-bounce" />
    </Button>
  )
}