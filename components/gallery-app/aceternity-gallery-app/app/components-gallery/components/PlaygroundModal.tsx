"use client";

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Play, RotateCcw, X } from 'lucide-react';
import { ComponentConfig, generateCode, PropConfig } from '@/component-library/metadata/component-configs';
import dynamic from 'next/dynamic';

// Dynamic imports for gallery components
const BackgroundBoxes = dynamic(() => import('@/component-library/components/ui/background-boxes').then(mod => mod.BackgroundBoxesGalleryHero), { ssr: false });
const BackgroundGradient = dynamic(() => import('@/component-library/components/ui/background-gradient').then(mod => mod.BackgroundGradientGalleryProduct), { ssr: false });
const BackgroundLines = dynamic(() => import('@/component-library/components/ui/background-lines').then(mod => mod.BackgroundLinesGalleryHero), { ssr: false });
const BentoGridBasic = dynamic(() => import('@/component-library/components/ui/bento-grid').then(mod => mod.BentoGridGalleryBasic), { ssr: false });
const BentoGridAnimated = dynamic(() => import('@/component-library/components/ui/bento-grid').then(mod => mod.BentoGridGalleryAnimated), { ssr: false });
const BentoGridTwoColumn = dynamic(() => import('@/component-library/components/ui/bento-grid').then(mod => mod.BentoGridTwoColumn), { ssr: false });
const BentoGridSkillsShowcase = dynamic(() => import('@/component-library/components/ui/bento-grid').then(mod => mod.BentoGridGallerySkills), { ssr: false });
const BentoGridProjectsShowcase = dynamic(() => import('@/component-library/components/ui/bento-grid').then(mod => mod.BentoGridProjectsShowcase), { ssr: false });
const BentoGridServicesShowcase = dynamic(() => import('@/component-library/components/ui/bento-grid').then(mod => mod.BentoGridGalleryServices), { ssr: false });
const ColourfulText = dynamic(() => import('@/component-library/components/ui/colourful-text').then(mod => mod.ColourfulTextGalleryPreview), { ssr: false });
const Compare = dynamic(() => import('@/component-library/components/ui/compare').then(mod => mod.CompareGalleryPreview), { ssr: false });
const Cover = dynamic(() => import('@/component-library/components/ui/cover').then(mod => mod.CoverGalleryPreview), { ssr: false });
const ContainerScrollAnimation = dynamic(() => import('@/component-library/components/ui/container-scroll-animation').then(mod => mod.ContainerScrollGalleryPreview), { ssr: false });
const ContainerTextFlip = dynamic(() => import('@/component-library/components/ui/container-text-flip').then(mod => mod.ContainerTextFlipGalleryPreview), { ssr: false });
const DirectionAwareHover = dynamic(() => import('@/component-library/components/ui/direction-aware-hover').then(mod => mod.DirectionAwareHoverGalleryPreview), { ssr: false });

interface PlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ComponentConfig;
}

const componentMap = {
  'background-boxes': BackgroundBoxes,
  'background-gradient': BackgroundGradient,
  'background-lines': BackgroundLines,
  'bento-grid-basic': BentoGridBasic,
  'bento-grid-animated': BentoGridAnimated,
  'bento-grid-two-column': BentoGridTwoColumn,
  'bento-grid-skills-showcase': BentoGridSkillsShowcase,
  'bento-grid-projects-showcase': BentoGridProjectsShowcase,
  'bento-grid-services-showcase': BentoGridServicesShowcase,
  'colourful-text': ColourfulText,
  'compare': Compare,
  'cover': Cover,
  'container-scroll-animation': ContainerScrollAnimation,
  'container-text-flip': ContainerTextFlip,
  'direction-aware-hover': DirectionAwareHover,
};

export function PlaygroundModal({ isOpen, onClose, config }: PlaygroundModalProps) {
  const [props, setProps] = useState<Record<string, any>>(config.defaultProps);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setProps(config.defaultProps);
  }, [config]);

  useEffect(() => {
    setGeneratedCode(generateCode(config, props));
  }, [config, props]);

  const updateProp = (key: string, value: any) => {
    setProps(prev => ({ ...prev, [key]: value }));
  };

  const resetProps = () => {
    setProps(config.defaultProps);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const renderPropControl = (key: string, propConfig: PropConfig) => {
    const value = props[key];

    switch (propConfig.type) {
      case 'string':
        return (
          <Input
            value={value || ''}
            onChange={(e) => updateProp(key, e.target.value)}
            placeholder={propConfig.defaultValue}
            className="bg-gray-900 border-gray-800 text-white"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => updateProp(key, e.target.value)}
            placeholder={propConfig.defaultValue}
            className="bg-gray-900 border-gray-800 text-white min-h-[80px]"
          />
        );

      case 'boolean':
        return (
          <Switch
            checked={value}
            onCheckedChange={(checked) => updateProp(key, checked)}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => updateProp(key, parseFloat(e.target.value) || 0)}
            className="bg-gray-900 border-gray-800 text-white"
          />
        );

      case 'range':
        return (
          <div className="space-y-2">
            <Slider
              value={[value || propConfig.defaultValue]}
              onValueChange={([newValue]) => updateProp(key, newValue)}
              min={propConfig.min || 0}
              max={propConfig.max || 100}
              step={propConfig.step || 1}
              className="flex-1"
            />
            <div className="text-xs text-gray-400 text-center">
              {value || propConfig.defaultValue}
            </div>
          </div>
        );

      case 'select':
        return (
          <Select
            value={value || propConfig.defaultValue}
            onValueChange={(newValue) => updateProp(key, newValue)}
          >
            <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800">
              {propConfig.options?.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'color':
        return (
          <div className="flex gap-2">
            <Input
              type="color"
              value={value || propConfig.defaultValue}
              onChange={(e) => updateProp(key, e.target.value)}
              className="w-12 h-10 p-1 bg-gray-900 border-gray-800"
            />
            <Input
              value={value || propConfig.defaultValue}
              onChange={(e) => updateProp(key, e.target.value)}
              className="flex-1 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => updateProp(key, e.target.value)}
            className="bg-gray-900 border-gray-800 text-white"
          />
        );
    }
  };

  const renderComponent = () => {
    try {
      const componentKey = config.id === 'bento-grid' 
        ? `bento-grid-${props.variant || 'basic'}` 
        : config.id;
      
      const Component = componentMap[componentKey as keyof typeof componentMap];
      
      if (!Component) {
        return (
          <div className="flex items-center justify-center h-64 text-gray-400">
            Component preview not available (Key: {componentKey})
          </div>
        );
      }

      console.log('Rendering component:', componentKey, Component);

      // These are complete demo components, render them directly
      return (
        <div className="h-64 overflow-hidden rounded-lg">
          <Component />
        </div>
      );
    } catch (error) {
      console.error('Component render error:', error);
      return (
        <div className="flex items-center justify-center h-64 text-red-400">
          Error rendering component
        </div>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-7xl h-[90vh] mx-4 bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">{config.title} Playground</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetProps}
              className="bg-transparent border-gray-700 text-gray-400 hover:bg-gray-800"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-transparent border-gray-700 text-gray-400 hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-hidden">
          {/* Controls Panel */}
          <div className="space-y-6 overflow-y-auto pr-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Props Configuration</h3>
              <div className="space-y-4">
                {Object.entries(config.propConfigs).map(([key, propConfig]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300">
                      {propConfig.label}
                    </Label>
                    {renderPropControl(key, propConfig)}
                    {propConfig.description && (
                      <p className="text-xs text-gray-500">{propConfig.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Code */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Generated Code</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCode}
                  className="bg-transparent border-gray-700 text-gray-400 hover:bg-gray-800"
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
              <pre className="bg-black/50 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto max-h-[32rem]">
                <code>{generatedCode}</code>
              </pre>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-4 overflow-hidden">
            <h3 className="text-lg font-semibold">Live Preview</h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-auto flex-1 min-h-[32rem] border border-gray-800">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    Loading component...
                  </div>
                }
              >
                {renderComponent()}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}