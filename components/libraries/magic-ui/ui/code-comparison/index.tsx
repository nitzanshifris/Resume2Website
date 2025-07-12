// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CodeComparisonProps {
  className?: string;
  beforeCode: string;
  afterCode: string;
  language?: string;
  filename?: string;
  lightTheme?: string;
  darkTheme?: string;
  // highlightColor?: string; // TODO: Implement highlight functionality
}

export function CodeComparison({
  className,
  beforeCode,
  afterCode,
  language = "typescript",
  filename,
  lightTheme = "github-light",
  darkTheme = "github-dark",
}: CodeComparisonProps) {
  const [beforeHtml, setBeforeHtml] = useState<string>("");
  const [afterHtml, setAfterHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const processCode = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dynamically import shiki
        const { codeToHtml } = await import("shiki");
        
        if (!isMounted) return;

        // Process before code
        const processedBeforeCode = processCodeAnnotations(beforeCode || "");
        if (processedBeforeCode.code) {
          const beforeResult = await codeToHtml(processedBeforeCode.code, {
            lang: language,
            themes: {
              light: lightTheme,
              dark: darkTheme,
            },
          });
          
          if (!isMounted) return;
          setBeforeHtml(beforeResult);
        } else {
          setBeforeHtml("<pre></pre>");
        }

        // Process after code
        const processedAfterCode = processCodeAnnotations(afterCode || "");
        if (processedAfterCode.code) {
          const afterResult = await codeToHtml(processedAfterCode.code, {
            lang: language,
            themes: {
              light: lightTheme,
              dark: darkTheme,
            },
          });
          
          if (!isMounted) return;
          setAfterHtml(afterResult);
        } else {
          setAfterHtml("<pre></pre>");
        }
      } catch (err) {
        console.error("Error processing code:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to process code");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    processCode();

    return () => {
      isMounted = false;
    };
  }, [beforeCode, afterCode, language, lightTheme, darkTheme]);

  if (loading) {
    return (
      <div className={cn("w-full overflow-hidden rounded-lg border bg-muted/10", className)}>
        <div className="p-8 text-center text-muted-foreground">
          Loading code comparison...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("w-full overflow-hidden rounded-lg border border-destructive", className)}>
        <div className="p-8 text-center text-destructive">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-hidden rounded-lg border", className)}>
      {filename && (
        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
          <span className="text-sm font-medium text-muted-foreground">{filename}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-b md:border-b-0 md:border-r">
          <div className="border-b bg-muted/20 px-4 py-2">
            <span className="text-xs font-medium uppercase text-muted-foreground">Before</span>
          </div>
          <div className="overflow-x-auto bg-background">
            <div
              className="code-comparison-content p-4 text-sm [&_pre]:!bg-transparent [&_pre]:!p-0"
              dangerouslySetInnerHTML={{ __html: beforeHtml }}
            />
          </div>
        </div>
        <div>
          <div className="border-b bg-muted/20 px-4 py-2">
            <span className="text-xs font-medium uppercase text-muted-foreground">After</span>
          </div>
          <div className="overflow-x-auto bg-background">
            <div
              className="code-comparison-content p-4 text-sm [&_pre]:!bg-transparent [&_pre]:!p-0"
              dangerouslySetInnerHTML={{ __html: afterHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProcessedCode {
  code: string;
  highlights: number[];
}

function processCodeAnnotations(code: string): ProcessedCode {
  const lines = code.split('\n');
  const highlights: number[] = [];
  const processedLines: string[] = [];

  lines.forEach((line, index) => {
    // Remove all annotation patterns
    let processedLine = line;
    
    // Remove various comment styles with annotations
    processedLine = processedLine
      .replace(/\s*\/\/\s*\[!code\s+(highlight|focus|--|\+\+)\]/g, '')
      .replace(/\s*#\s*\[!code\s+(highlight|focus|--|\+\+)\]/g, '')
      .replace(/\s*\/\*\s*\[!code\s+(highlight|focus|--|\+\+)\]\s*\*\//g, '');
    
    // Track which lines had annotations
    if (line.includes('[!code highlight]') || line.includes('[!code focus]')) {
      highlights.push(index);
    }
    
    processedLines.push(processedLine);
  });

  return {
    code: processedLines.join('\n'),
    highlights,
  };
}