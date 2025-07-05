"use client";

import { FileUploadStandard } from "@/components/ui/file-upload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code2, Copy, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function FileUploadGallery() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const installCommand = `npm install framer-motion @tabler/icons-react react-dropzone clsx tailwind-merge`;

  const basicUsageCode = `import { FileUpload } from "@/components/ui/file-upload";

function MyComponent() {
  const handleFileUpload = (files: File[]) => {
    console.log("Files uploaded:", files);
    // Process your files here
  };

  return (
    <FileUpload 
      onChange={handleFileUpload}
    />
  );
}`;

  const withRestrictionsCode = `import { FileUpload } from "@/components/ui/file-upload";

function MyComponent() {
  const handleFileUpload = (files: File[]) => {
    console.log("Files uploaded:", files);
  };

  return (
    <FileUpload 
      onChange={handleFileUpload}
      maxFiles={3}
      accept={{
        'image/*': ['.png', '.jpg', '.jpeg'],
        'application/pdf': ['.pdf']
      }}
      maxSize={2097152} // 2MB
    />
  );
}`;

  const componentCode = `"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const GridPattern = ({ width = 40, height = 40, x = -1, y = -1, squares, ...props }) => {
  const patternId = useRef(\`pattern-\${Math.floor(Math.random() * 100000)}\`);
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        props.className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={patternId.current}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={\`M.5,\${height}V.5H\${width}\`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={\`url(#\${patternId.current})\`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]) => (
            <rect
              strokeWidth="0"
              key={\`\${x}-\${y}\`}
              width={width - 1}
              height={height - 1}
              x={x * width + 1}
              y={y * height + 1}
            />
          ))}
        </svg>
      )}
    </svg>
  );
};

export function FileUpload({ onChange, className, containerClassName, maxFiles = 10, accept, maxSize, disabled = false }) {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (files) => {
    setFiles(files);
    onChange(files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileChange,
    maxFiles,
    accept,
    maxSize,
    disabled,
    multiple: maxFiles > 1,
  });

  return (
    <div className={cn("w-full", containerClassName)} {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className={cn(
          "group/file relative block cursor-pointer overflow-hidden rounded-lg p-10",
          "transition-colors duration-300",
          "bg-white dark:bg-black",
          "border-2 border-dashed",
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-neutral-200 dark:border-neutral-800",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <input
          {...getInputProps()}
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans text-base font-bold text-neutral-700 dark:text-neutral-300">
            Upload file
          </p>
          <p className="relative z-20 mt-2 font-sans text-base font-normal text-neutral-400 dark:text-neutral-400">
            Drag or drop your files here or click to upload
          </p>
          <div className="relative mt-10 w-full max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative z-40 mx-auto flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-white p-4 dark:bg-neutral-900",
                    "shadow-sm",
                    "mt-4"
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="max-w-xs truncate text-base text-neutral-700 dark:text-neutral-300"
                    >
                      {file.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="w-fit flex-shrink-0 rounded-lg px-2 py-1 text-sm text-neutral-600 shadow-input dark:bg-neutral-800 dark:text-white"
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>

                  <div className="mt-3 flex w-full flex-col items-start justify-between text-sm text-neutral-600 dark:text-neutral-400 md:flex-row md:items-center">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="truncate rounded-md bg-gray-100 px-2 py-1 dark:bg-neutral-800"
                    >
                      {file.type}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      modified {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md bg-white group-hover/file:shadow-2xl dark:bg-neutral-900",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                <IconUpload className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md border border-dashed border-sky-400 bg-transparent opacity-0"
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link 
              href="/components-gallery" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Gallery
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              File Upload
            </h1>
            <p className="text-xl text-gray-400">
              Beautiful file upload component with drag and drop support and smooth animations
            </p>
            <div className="flex gap-2 mt-4">
              <Badge variant="outline" className="border-gray-700">Drag & Drop</Badge>
              <Badge variant="outline" className="border-gray-700">Animations</Badge>
              <Badge variant="outline" className="border-gray-700">File Preview</Badge>
              <Badge variant="outline" className="border-gray-700">Dark Mode</Badge>
            </div>
          </div>

          {/* Demo Section */}
          <Card className="mb-8 bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Live Demo</CardTitle>
              <CardDescription className="text-gray-400">
                Try dragging and dropping files or click to upload
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadStandard />
            </CardContent>
          </Card>

          {/* Documentation */}
          <div className="space-y-4">
            {/* Installation */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Installation</CardTitle>
                <CardDescription className="text-gray-400">
                  Install the required dependencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 overflow-x-auto">
                    <code>{installCommand}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(installCommand, 'install')}
                  >
                    {copiedSection === 'install' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Basic Usage */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Basic Usage</CardTitle>
                <CardDescription className="text-gray-400">
                  Simple implementation with onChange callback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 overflow-x-auto">
                    <code>{basicUsageCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(basicUsageCode, 'basic')}
                  >
                    {copiedSection === 'basic' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* With Restrictions */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">With File Restrictions</CardTitle>
                <CardDescription className="text-gray-400">
                  Limit file types, size, and number of files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 overflow-x-auto">
                    <code>{withRestrictionsCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(withRestrictionsCode, 'restrictions')}
                  >
                    {copiedSection === 'restrictions' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            {/* Props */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Component Props</CardTitle>
                <CardDescription className="text-gray-400">
                  All available props for the FileUpload component
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-700">
                        <th className="text-left p-2 font-medium text-gray-300">Prop</th>
                        <th className="text-left p-2 font-medium text-gray-300">Type</th>
                        <th className="text-left p-2 font-medium text-gray-300">Default</th>
                        <th className="text-left p-2 font-medium text-gray-300">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-400">
                      <tr className="border-b border-zinc-800">
                        <td className="p-2 font-mono text-xs text-blue-400">onChange</td>
                        <td className="p-2 font-mono text-xs">(files: File[]) =&gt; void</td>
                        <td className="p-2">required</td>
                        <td className="p-2">Callback when files are selected</td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="p-2 font-mono text-xs text-blue-400">className</td>
                        <td className="p-2 font-mono text-xs">string</td>
                        <td className="p-2">-</td>
                        <td className="p-2">Additional CSS classes for the upload area</td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="p-2 font-mono text-xs text-blue-400">containerClassName</td>
                        <td className="p-2 font-mono text-xs">string</td>
                        <td className="p-2">-</td>
                        <td className="p-2">Additional CSS classes for the container</td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="p-2 font-mono text-xs text-blue-400">maxFiles</td>
                        <td className="p-2 font-mono text-xs">number</td>
                        <td className="p-2">10</td>
                        <td className="p-2">Maximum number of files allowed</td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="p-2 font-mono text-xs text-blue-400">accept</td>
                        <td className="p-2 font-mono text-xs">Record&lt;string, string[]&gt;</td>
                        <td className="p-2">-</td>
                        <td className="p-2">Accepted file types</td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="p-2 font-mono text-xs text-blue-400">maxSize</td>
                        <td className="p-2 font-mono text-xs">number</td>
                        <td className="p-2">-</td>
                        <td className="p-2">Maximum file size in bytes</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono text-xs text-blue-400">disabled</td>
                        <td className="p-2 font-mono text-xs">boolean</td>
                        <td className="p-2">false</td>
                        <td className="p-2">Disable the upload component</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            {/* Full Code */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Full Component Code</CardTitle>
                <CardDescription className="text-gray-400">
                  Copy and paste this code into your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 overflow-x-auto max-h-[600px]">
                    <code>{componentCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(componentCode, 'component')}
                  >
                    {copiedSection === 'component' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}