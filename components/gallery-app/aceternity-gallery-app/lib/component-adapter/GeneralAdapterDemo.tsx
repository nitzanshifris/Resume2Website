"use client";

import { useState } from "react";
import { useGeneralAdapter } from "./useGeneralAdapter";
import { ComponentType } from "./general-adapter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Tabs component not available in this project
import { Badge } from "@/components/ui/badge";
import { CVData } from "@/types/cv";

// Example CV data
const exampleCVData: CVData = {
  personalInfo: {
    name: "John Doe",
    title: "Full Stack Developer",
    email: "john@example.com",
    phone: "+1234567890",
    location: "San Francisco, CA",
    summary: "Experienced developer with a passion for creating innovative solutions using modern technologies",
    avatar: "https://via.placeholder.com/150",
    website: "https://johndoe.dev",
  },
  experience: [
    {
      company: "Tech Corp",
      position: "Senior Developer",
      startDate: "2020",
      endDate: "Present",
      description: "Leading development of scalable web applications",
      achievements: [
        "Improved performance by 40%",
        "Led team of 5 developers",
        "Implemented CI/CD pipeline",
      ],
    },
    {
      company: "StartupXYZ",
      position: "Full Stack Developer",
      startDate: "2018",
      endDate: "2020",
      description: "Built core features for SaaS platform",
    },
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "BS Computer Science",
      startDate: "2014",
      endDate: "2018",
      description: "Graduated with honors, GPA: 3.8/4.0",
    },
  ],
  skills: [
    { name: "React", level: "Expert" },
    { name: "TypeScript", level: "Advanced" },
    { name: "Node.js", level: "Advanced" },
    { name: "Python", level: "Intermediate" },
    { name: "AWS", level: "Intermediate" },
    { name: "Docker", level: "Intermediate" },
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built a scalable e-commerce solution serving 10k+ users",
      technologies: ["React", "Node.js", "MongoDB"],
      url: "https://example.com",
      image: "https://source.unsplash.com/random/800x600?ecommerce",
    },
    {
      name: "Task Management App",
      description: "Real-time collaborative task management with team features",
      technologies: ["React", "Socket.io", "PostgreSQL"],
      url: "https://example.com",
      image: "https://source.unsplash.com/random/800x600?productivity",
    },
    {
      name: "AI Chat Assistant",
      description: "Intelligent chat assistant using GPT-4 API",
      technologies: ["Python", "FastAPI", "OpenAI"],
      url: "https://example.com",
      image: "https://source.unsplash.com/random/800x600?ai",
    },
  ],
  achievements: [
    {
      title: "Best Innovation Award",
      date: "2023",
      description: "Recognized for innovative AI solution that improved customer service efficiency by 60%",
    },
    {
      title: "Tech Lead of the Year",
      date: "2022",
      description: "Led successful product launch reaching 50k users in first month",
    },
  ],
};

export function GeneralAdapterDemo() {
  const [selectedComponent, setSelectedComponent] = useState<ComponentType | null>(null);
  const [selectedSize, setSelectedSize] = useState<"small" | "medium" | "large" | "full">("medium");
  const [selectedTheme, setSelectedTheme] = useState<"professional" | "creative" | "minimal" | "bold" | "modern">("professional");

  const {
    adaptedComponents,
    availableComponents,
    currentPreset,
    adaptComponent,
    adaptAll,
    applyPreset,
    clearAll,
    getComponentsByCategory,
    presets,
  } = useGeneralAdapter({
    cvData: exampleCVData,
    defaultSize: selectedSize,
    defaultTheme: { style: selectedTheme },
  });

  const categories = ["background", "card", "carousel", "interactive", "navigation", "content", "utility"];

  const handleAdaptComponent = () => {
    if (selectedComponent) {
      adaptComponent(selectedComponent, {
        size: selectedSize,
        theme: { style: selectedTheme },
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">General Component Adapter</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Automatically adapt any Aceternity component to work with your CV data. 
          Select options below to see how components adapt to different configurations.
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Adapter Controls</CardTitle>
          <CardDescription>Configure how components should be adapted</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Presets */}
          <div>
            <label className="block text-sm font-medium mb-2">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(presets).map(([key, preset]) => (
                <Button
                  key={key}
                  variant={currentPreset === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => applyPreset(key)}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Manual Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Component</label>
              <Select value={selectedComponent || ""} onValueChange={(v) => setSelectedComponent(v as ComponentType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select component" />
                </SelectTrigger>
                <SelectContent>
                  {availableComponents.map((comp) => (
                    <SelectItem key={comp.type} value={comp.type}>
                      {comp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <Select value={selectedSize} onValueChange={(v) => setSelectedSize(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <Select value={selectedTheme} onValueChange={(v) => setSelectedTheme(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleAdaptComponent} disabled={!selectedComponent}>
              Adapt Selected
            </Button>
            <Button onClick={() => adaptAll({ size: selectedSize, theme: { style: selectedTheme } })} variant="secondary">
              Adapt All Available
            </Button>
            <Button onClick={clearAll} variant="outline">
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Adapted Components ({Object.keys(adaptedComponents).length})</CardTitle>
          <CardDescription>Components configured with your CV data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Adapted Components</h3>
            {Object.values(adaptedComponents).map((comp) => (
              <ComponentCard key={comp.type} component={comp} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Components */}
      <Card>
        <CardHeader>
          <CardTitle>Available Components</CardTitle>
          <CardDescription>
            Components that can work with your CV data ({availableComponents.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableComponents.map((comp) => (
              <div key={comp.type} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{comp.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {comp.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {comp.description}
                </p>
                <div className="space-y-1">
                  <p className="text-xs font-medium">Best for:</p>
                  <div className="flex flex-wrap gap-1">
                    {comp.bestFor.map((use) => (
                      <Badge key={use} variant="secondary" className="text-xs">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Component card to display adapted component info
function ComponentCard({ component }: { component: any }) {
  const [showProps, setShowProps] = useState(false);

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-medium">{component.metadata.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {component.metadata.description}
          </p>
        </div>
        <Badge>{component.metadata.category}</Badge>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowProps(!showProps)}
        className="mt-2"
      >
        {showProps ? "Hide" : "Show"} Props
      </Button>

      {showProps && (
        <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs overflow-x-auto">
          {JSON.stringify(component.props, null, 2)}
        </pre>
      )}
    </div>
  );
}