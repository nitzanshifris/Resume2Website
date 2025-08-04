"use client";
import React from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  language: string;
  filename: string;
  highlightLines?: number[];
} & (
  | {
      code: string;
      tabs?: never;
    }
  | {
      code?: never;
      tabs: Array<{
        name: string;
        code: string;
        language?: string;
        highlightLines?: number[];
      }>;
    }
);

export const CodeBlock = ({
  language,
  filename,
  code,
  highlightLines = [],
  tabs = [],
}: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  const tabsExist = tabs.length > 0;

  const copyToClipboard = async () => {
    const textToCopy = tabsExist ? tabs[activeTab].code : code;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeCode = tabsExist ? tabs[activeTab].code : code;
  const activeLanguage = tabsExist
    ? tabs[activeTab].language || language
    : language;
  const activeHighlightLines = tabsExist
    ? tabs[activeTab].highlightLines || []
    : highlightLines;

  // Very simple but working syntax highlighting
  const highlightLine = (line: string) => {
    const parts: React.ReactNode[] = [];
    let remainingLine = line;
    let key = 0;

    // Helper function to add colored text
    const addColoredText = (text: string, className: string) => {
      parts.push(
        <span key={key++} className={className}>
          {text}
        </span>
      );
    };

    // Helper function to add plain text
    const addPlainText = (text: string) => {
      parts.push(
        <span key={key++} className="text-neutral-200 dark:text-neutral-200 light:text-gray-900">
          {text}
        </span>
      );
    };

    // Process the line character by character for reliable highlighting
    let i = 0;
    while (i < remainingLine.length) {
      let matched = false;

      // Check for keywords
      const keywords = ['const', 'let', 'var', 'function', 'if', 'else', 'return', 'import', 'export', 'from', 'class'];
      for (const keyword of keywords) {
        if (remainingLine.substr(i).startsWith(keyword)) {
          // Check if it's a whole word
          const nextChar = remainingLine[i + keyword.length];
          if (!nextChar || !/[a-zA-Z0-9_]/.test(nextChar)) {
            addColoredText(keyword, 'text-pink-500 dark:text-pink-500 light:text-pink-700');
            i += keyword.length;
            matched = true;
            break;
          }
        }
      }

      if (!matched) {
        // Check for strings
        if (remainingLine[i] === '"' || remainingLine[i] === "'" || remainingLine[i] === '`') {
          const quote = remainingLine[i];
          let stringEnd = i + 1;
          while (stringEnd < remainingLine.length && remainingLine[stringEnd] !== quote) {
            if (remainingLine[stringEnd] === '\\') stringEnd++; // Skip escaped characters
            stringEnd++;
          }
          if (stringEnd < remainingLine.length) stringEnd++; // Include closing quote
          
          const stringText = remainingLine.slice(i, stringEnd);
          addColoredText(stringText, 'text-green-400 dark:text-green-400 light:text-green-700');
          i = stringEnd;
          matched = true;
        }
      }

      if (!matched) {
        // Check for numbers
        if (/\d/.test(remainingLine[i])) {
          let numEnd = i;
          while (numEnd < remainingLine.length && /[0-9.]/.test(remainingLine[numEnd])) {
            numEnd++;
          }
          const numberText = remainingLine.slice(i, numEnd);
          addColoredText(numberText, 'text-purple-400 dark:text-purple-400 light:text-purple-700');
          i = numEnd;
          matched = true;
        }
      }

      if (!matched) {
        // Check for comments
        if (remainingLine.substr(i).startsWith('//')) {
          const commentText = remainingLine.slice(i);
          addColoredText(commentText, 'text-gray-500 dark:text-gray-500 light:text-gray-700');
          i = remainingLine.length;
          matched = true;
        }
      }

      if (!matched) {
        // Single character as plain text
        addPlainText(remainingLine[i]);
        i++;
      }
    }

    return parts.length > 0 ? parts : [<span key={0} className="text-neutral-200 dark:text-neutral-200 light:text-gray-900">{line}</span>];
  };

  const formatCodeWithLineNumbers = (code: string) => {
    const lines = code.split('\n');
    return lines.map((line, index) => {
      const lineNumber = index + 1;
      const isHighlighted = activeHighlightLines.includes(lineNumber);
      
      return (
        <div
          key={lineNumber}
          className={cn(
            "flex",
            isHighlighted && "bg-accent/10 border-l-2 border-accent"
          )}
        >
          <span className="text-neutral-600 dark:text-neutral-600 light:text-gray-400 text-right pr-4 select-none min-w-[2.5rem] py-0.5">
            {lineNumber}
          </span>
          <span className="flex-1 py-0.5 px-2 leading-relaxed">
            {line ? highlightLine(line) : <span>&nbsp;</span>}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="relative w-full rounded-lg bg-background/50 backdrop-blur-sm border border-neutral-800 dark:border-neutral-800 light:border-gray-300 p-4 font-mono text-sm overflow-hidden shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)] dark:shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)] light:shadow-none">
      <div className="flex flex-col gap-2">
        {tabsExist && (
          <div className="flex overflow-x-auto border-b border-neutral-800 dark:border-neutral-800 light:border-gray-300 -mx-4 px-4 -mt-4 pt-4">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "px-4 py-2 text-xs transition-all font-sans border-b-2 -mb-[2px]",
                  activeTab === index
                    ? "text-accent border-accent"
                    : "text-neutral-500 dark:text-neutral-500 light:text-gray-600 border-transparent hover:text-foreground hover:border-neutral-600"
                )}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}
        {!tabsExist && filename && (
          <div className="flex justify-between items-center -mx-4 px-4 -mt-4 pb-3 border-b border-neutral-800 dark:border-neutral-800 light:border-gray-300">
            <div className="text-xs text-accent font-medium">{filename}</div>
            <button
              onClick={copyToClipboard}
              className={cn(
                "flex items-center gap-1.5 text-xs transition-all font-sans group",
                "text-neutral-500 dark:text-neutral-500 light:text-gray-600",
                "hover:text-accent"
              )}
            >
              {copied ? (
                <>
                  <IconCheck size={14} className="text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <IconCopy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto mt-4">
        <div className="text-neutral-200 dark:text-neutral-200 light:text-gray-900 leading-relaxed">
          {formatCodeWithLineNumbers(activeCode || '')}
        </div>
      </div>
    </div>
  );
};