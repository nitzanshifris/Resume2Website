"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RotateCcw, Eye, Code, Palette } from "lucide-react";
import { CardSpotlight } from "./card-spotlight";

interface CardSpotlightPlaygroundProps {
  className?: string;
}

export function CardSpotlightPlayground({ className }: CardSpotlightPlaygroundProps) {
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [props, setProps] = useState({
    radius: 350,
    color: "#262626",
    title: "Card Spotlight Effect",
    subtitle: "Interactive Demo",
    content: "Move your mouse over this card to see the spotlight effect in action. The spotlight follows your cursor and creates a beautiful highlight effect.",
    width: "400px",
    height: "300px",
    showCanvasEffect: true,
  });

  const [generatedCode, setGeneratedCode] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Generate code based on current props
  useEffect(() => {
    const code = `import { CardSpotlight } from "@/component-library/components/ui/card-spotlight";

export function MyCardSpotlight() {
  return (
    <CardSpotlight 
      radius={${props.radius}}
      color="${props.color}"
      className="w-[${props.width}] h-[${props.height}] relative"
    >
      <h3 className="text-xl font-bold relative z-20 mt-2 text-white">
        ${props.title}
      </h3>
      <p className="text-neutral-200 mt-2 relative z-20 text-sm font-medium">
        ${props.subtitle}
      </p>
      <div className="text-neutral-300 mt-4 relative z-20 text-sm">
        ${props.content}
      </div>
    </CardSpotlight>
  );
}`;

    setGeneratedCode(code);
  }, [props]);

  const updateProp = (key: string, value: any) => {
    setProps(prev => ({ ...prev, [key]: value }));
  };

  const resetProps = () => {
    setProps({
      radius: 350,
      color: "#262626",
      title: "Card Spotlight Effect",
      subtitle: "Interactive Demo",
      content: "Move your mouse over this card to see the spotlight effect in action. The spotlight follows your cursor and creates a beautiful highlight effect.",
      width: "400px",
      height: "300px",
      showCanvasEffect: true,
    });
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const colorPresets = [
    { name: "Dark Gray", value: "#262626" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Green", value: "#10b981" },
    { name: "Orange", value: "#f97316" },
    { name: "Red", value: "#ef4444" },
    { name: "Cyan", value: "#06b6d4" },
  ];

  const sizePresets = [
    { name: "Small", width: "300px", height: "200px" },
    { name: "Medium", width: "400px", height: "300px" },
    { name: "Large", width: "500px", height: "400px" },
    { name: "Wide", width: "600px", height: "250px" },
    { name: "Square", width: "400px", height: "400px" },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Card Spotlight Playground</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetProps}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm">
                💾 Save Variant
              </Button>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "preview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("preview")}
                className="h-8"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                variant={viewMode === "code" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("code")}
                className="h-8"
              >
                <Code className="h-4 w-4 mr-2" />
                Code
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Properties Panel */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Properties</h2>

              <div className="space-y-6">
                {/* Spotlight Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Spotlight</h3>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">radius</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[props.radius]}
                        onValueChange={([value]) => updateProp("radius", value)}
                        min={50}
                        max={800}
                        step={10}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500">{props.radius}px</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">color</Label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="color"
                        value={props.color}
                        onChange={(e) => updateProp("color", e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <Input
                        value={props.color}
                        onChange={(e) => updateProp("color", e.target.value)}
                        className="flex-1"
                        placeholder="#262626"
                      />
                    </div>
                    <Select
                      value={props.color}
                      onValueChange={(value) => updateProp("color", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select preset" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorPresets.map((preset) => (
                          <SelectItem key={preset.name} value={preset.value}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded border border-gray-300"
                                style={{ backgroundColor: preset.value }}
                              />
                              {preset.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Size Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Card Size</h3>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">size preset</Label>
                    <Select
                      value={`${props.width},${props.height}`}
                      onValueChange={(value) => {
                        const [width, height] = value.split(",");
                        updateProp("width", width);
                        updateProp("height", height);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizePresets.map((preset) => (
                          <SelectItem key={preset.name} value={`${preset.width},${preset.height}`}>
                            {preset.name} ({preset.width} × {preset.height})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">width</Label>
                      <Input
                        value={props.width}
                        onChange={(e) => updateProp("width", e.target.value)}
                        className="mt-1"
                        placeholder="400px"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">height</Label>
                      <Input
                        value={props.height}
                        onChange={(e) => updateProp("height", e.target.value)}
                        className="mt-1"
                        placeholder="300px"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Content</h3>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">title</Label>
                    <Input
                      value={props.title}
                      onChange={(e) => updateProp("title", e.target.value)}
                      className="mt-1"
                      placeholder="Card title"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">subtitle</Label>
                    <Input
                      value={props.subtitle}
                      onChange={(e) => updateProp("subtitle", e.target.value)}
                      className="mt-1"
                      placeholder="Card subtitle"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">content</Label>
                    <Textarea
                      value={props.content}
                      onChange={(e) => updateProp("content", e.target.value)}
                      className="mt-1 min-h-[80px]"
                      placeholder="Card content description..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden bg-gray-900">
          {viewMode === "preview" ? (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-8">
              {/* Grid pattern overlay */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                  backgroundSize: '50px 50px'
                }}
              />
              
              <div className="relative z-10 flex items-center justify-center">
                <CardSpotlight
                  radius={props.radius}
                  color={props.color}
                  className="relative"
                  style={{
                    width: props.width,
                    height: props.height,
                  }}
                >
                  <h3 className="text-xl font-bold relative z-20 mt-2 text-white">
                    {props.title}
                  </h3>
                  <p className="text-neutral-200 mt-2 relative z-20 text-sm font-medium">
                    {props.subtitle}
                  </p>
                  <div className="text-neutral-300 mt-4 relative z-20 text-sm">
                    {props.content}
                  </div>
                </CardSpotlight>
              </div>
            </div>
          ) : (
            <div className="h-full bg-gray-900 text-gray-100 p-6 overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Generated Code</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCode}
                  className="bg-transparent border-gray-600 text-gray-400 hover:bg-gray-800"
                >
                  {copySuccess ? (
                    <span className="text-green-400">Copied!</span>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <pre className="bg-black/50 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{generatedCode}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}