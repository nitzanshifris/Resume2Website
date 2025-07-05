"use client";

import { useState, useEffect } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Textarea } from "../textarea";
import { Switch } from "../switch";
import { Slider } from "../slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { Copy, RotateCcw, Eye, Code } from "lucide-react";
import { CarouselEnhanced } from "./carousel-enhanced";

interface CarouselPlaygroundProps {
  className?: string;
}

// Default carousel data
const defaultSlides = [
  {
    title: "Mystic Mountains",
    subtitle: "Adventure Awaits", 
    button: "Explore Journey",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=3540&auto=format&fit=crop",
    gradient: "linear-gradient(to bottom, transparent 0%, rgba(59, 130, 246, 0.3) 50%, rgba(30, 58, 138, 0.9) 100%)",
  },
  {
    title: "Urban Dreams",
    subtitle: "City Lights",
    button: "Discover More", 
    src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=3456&auto=format&fit=crop",
    gradient: "linear-gradient(to bottom, transparent 0%, rgba(168, 85, 247, 0.3) 50%, rgba(88, 28, 135, 0.9) 100%)",
  },
  {
    title: "Neon Nights",
    subtitle: "Electric Vibes",
    button: "Experience Now",
    src: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=3540&auto=format&fit=crop",
    gradient: "linear-gradient(to bottom, transparent 0%, rgba(236, 72, 153, 0.3) 50%, rgba(157, 23, 77, 0.9) 100%)",
  },
];

export function CarouselPlayground({ className }: CarouselPlaygroundProps) {
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [props, setProps] = useState({
    autoPlay: true,
    autoPlayInterval: 4000,
    slides: defaultSlides,
  });

  const [editingSlideIndex, setEditingSlideIndex] = useState(0);
  const [generatedCode, setGeneratedCode] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Generate code based on current props
  useEffect(() => {
    const slidesCode = props.slides.map((slide, index) => 
      `  {
    title: "${slide.title}",
    subtitle: "${slide.subtitle}",
    button: "${slide.button}",
    src: "${slide.src}",
    gradient: "${slide.gradient}",
  }`
    ).join(',\n');

    const code = `import { CarouselEnhanced } from "@/component-library/components/ui/carousel";

const slides = [
${slidesCode}
];

export function MyCarousel() {
  return (
    <CarouselEnhanced 
      slides={slides}
      autoPlay={${props.autoPlay}}
      autoPlayInterval={${props.autoPlayInterval}}
    />
  );
}`;

    setGeneratedCode(code);
  }, [props]);

  const updateProp = (key: string, value: any) => {
    setProps(prev => ({ ...prev, [key]: value }));
  };

  const updateSlide = (index: number, key: string, value: string) => {
    const newSlides = [...props.slides];
    newSlides[index] = { ...newSlides[index], [key]: value };
    updateProp("slides", newSlides);
  };

  const addSlide = () => {
    const newSlide = {
      title: "New Slide",
      subtitle: "Subtitle",
      button: "Click me", 
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=3540&auto=format&fit=crop",
      gradient: "linear-gradient(to bottom, transparent 0%, rgba(59, 130, 246, 0.3) 50%, rgba(30, 58, 138, 0.9) 100%)",
    };
    updateProp("slides", [...props.slides, newSlide]);
  };

  const removeSlide = (index: number) => {
    if (props.slides.length > 1) {
      const newSlides = props.slides.filter((_, i) => i !== index);
      updateProp("slides", newSlides);
      if (editingSlideIndex >= newSlides.length) {
        setEditingSlideIndex(Math.max(0, newSlides.length - 1));
      }
    }
  };

  const resetProps = () => {
    setProps({
      autoPlay: true,
      autoPlayInterval: 4000,
      slides: defaultSlides,
    });
    setEditingSlideIndex(0);
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

  const gradientPresets = [
    { name: "Blue Ocean", value: "linear-gradient(to bottom, transparent 0%, rgba(59, 130, 246, 0.3) 50%, rgba(30, 58, 138, 0.9) 100%)" },
    { name: "Purple Magic", value: "linear-gradient(to bottom, transparent 0%, rgba(168, 85, 247, 0.3) 50%, rgba(88, 28, 135, 0.9) 100%)" },
    { name: "Pink Sunset", value: "linear-gradient(to bottom, transparent 0%, rgba(236, 72, 153, 0.3) 50%, rgba(157, 23, 77, 0.9) 100%)" },
    { name: "Orange Fire", value: "linear-gradient(to bottom, transparent 0%, rgba(251, 146, 60, 0.3) 50%, rgba(194, 65, 12, 0.9) 100%)" },
    { name: "Teal Wave", value: "linear-gradient(to bottom, transparent 0%, rgba(34, 197, 214, 0.3) 50%, rgba(21, 94, 117, 0.9) 100%)" },
  ];

  return (
    <div className={className ? `min-h-screen bg-gray-50 ${className}` : "min-h-screen bg-gray-50"}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Playground</h1>
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
                {/* Auto Play Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Auto Play</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">enabled</Label>
                      <Switch
                        checked={props.autoPlay}
                        onCheckedChange={(checked) => updateProp("autoPlay", checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">interval (ms)</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[props.autoPlayInterval]}
                        onValueChange={([value]) => updateProp("autoPlayInterval", value)}
                        min={1000}
                        max={10000}
                        step={500}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500">{props.autoPlayInterval}ms</div>
                    </div>
                  </div>
                </div>

                {/* Slides Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Slides</h3>
                    <Button variant="outline" size="sm" onClick={addSlide}>
                      + Add Slide
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Edit Slide</Label>
                    <Select
                      value={editingSlideIndex.toString()}
                      onValueChange={(value) => setEditingSlideIndex(parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {props.slides.map((slide, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            Slide {index + 1}: {slide.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Current Slide Editor */}
                  {props.slides[editingSlideIndex] && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Slide {editingSlideIndex + 1}</span>
                        {props.slides.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSlide(editingSlideIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">title</Label>
                          <Input
                            value={props.slides[editingSlideIndex]?.title || ""}
                            onChange={(e) => updateSlide(editingSlideIndex, "title", e.target.value)}
                            className="mt-1"
                            placeholder="Enter slide title"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">subtitle</Label>
                          <Input
                            value={props.slides[editingSlideIndex]?.subtitle || ""}
                            onChange={(e) => updateSlide(editingSlideIndex, "subtitle", e.target.value)}
                            className="mt-1"
                            placeholder="Enter slide subtitle"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">button</Label>
                          <Input
                            value={props.slides[editingSlideIndex]?.button || ""}
                            onChange={(e) => updateSlide(editingSlideIndex, "button", e.target.value)}
                            className="mt-1"
                            placeholder="Button text"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">image URL</Label>
                          <Textarea
                            value={props.slides[editingSlideIndex]?.src || ""}
                            onChange={(e) => updateSlide(editingSlideIndex, "src", e.target.value)}
                            className="mt-1 min-h-[60px]"
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">gradient</Label>
                          <Select
                            value={props.slides[editingSlideIndex]?.gradient}
                            onValueChange={(value) => updateSlide(editingSlideIndex, "gradient", value)}
                          >
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="Select gradient" />
                            </SelectTrigger>
                            <SelectContent>
                              {gradientPresets.map((preset) => (
                                <SelectItem key={preset.name} value={preset.value}>
                                  {preset.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-700">custom gradient</Label>
                          <Textarea
                            value={props.slides[editingSlideIndex]?.gradient || ""}
                            onChange={(e) => updateSlide(editingSlideIndex, "gradient", e.target.value)}
                            className="mt-1 min-h-[40px] text-xs font-mono"
                            placeholder="linear-gradient(to bottom, ...)"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden bg-gray-900">
          {viewMode === "preview" ? (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
              {/* Grid pattern overlay */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                  backgroundSize: '50px 50px'
                }}
              />
              <div className="relative z-10 w-full flex items-center justify-center">
                <CarouselEnhanced
                  slides={props.slides}
                  autoPlay={props.autoPlay}
                  autoPlayInterval={props.autoPlayInterval}
                  containerSize="large"
                  className="scale-90"
                />
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