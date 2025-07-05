import { useState, useCallback, useMemo } from "react";
import { GeneralComponentAdapter, GeneralAdapterConfig, ComponentType } from "./general-adapter";
import { COMPONENT_REGISTRY, ADAPTER_PRESETS, ComponentSize, ThemeStyle } from "./adapter-types";
import { CVData } from "@/types/cv";

interface UseGeneralAdapterOptions {
  cvData: CVData;
  defaultSize?: ComponentSize;
  defaultTheme?: {
    style?: ThemeStyle;
    colorScheme?: "light" | "dark" | "auto";
    accentColor?: string;
  };
}

interface AdaptedComponent {
  type: ComponentType;
  props: any;
  metadata: typeof COMPONENT_REGISTRY[ComponentType];
}

export function useGeneralAdapter({ 
  cvData, 
  defaultSize = "medium",
  defaultTheme = { style: "professional", colorScheme: "auto" }
}: UseGeneralAdapterOptions) {
  const [adaptedComponents, setAdaptedComponents] = useState<Record<string, AdaptedComponent>>({});
  const [currentPreset, setCurrentPreset] = useState<string | null>(null);

  // Get all available components
  const availableComponents = useMemo(() => {
    return Object.values(COMPONENT_REGISTRY).filter(component => {
      // Check if CV has required data for this component
      if (component.requiredData.length === 0) return true;
      
      return component.requiredData.some(dataType => {
        switch (dataType) {
          case "personalInfo":
            return cvData.personalInfo;
          case "experience":
            return cvData.experience && cvData.experience.length > 0;
          case "education":
            return cvData.education && cvData.education.length > 0;
          case "skills":
            return cvData.skills && cvData.skills.length > 0;
          case "projects":
            return cvData.projects && cvData.projects.length > 0;
          case "achievements":
            return cvData.achievements && cvData.achievements.length > 0;
          default:
            return false;
        }
      });
    });
  }, [cvData]);

  // Adapt a single component
  const adaptComponent = useCallback(
    (componentType: ComponentType, options?: Partial<GeneralAdapterConfig>) => {
      const config: GeneralAdapterConfig = {
        cvData,
        componentType,
        size: options?.size || defaultSize,
        theme: options?.theme || defaultTheme,
        variant: options?.variant,
        customPrompt: options?.customPrompt,
      };

      const adapter = new GeneralComponentAdapter(config);
      const props = adapter.adapt();
      const metadata = COMPONENT_REGISTRY[componentType];

      const adapted: AdaptedComponent = {
        type: componentType,
        props,
        metadata,
      };

      setAdaptedComponents(prev => ({
        ...prev,
        [componentType]: adapted,
      }));

      return adapted;
    },
    [cvData, defaultSize, defaultTheme]
  );

  // Adapt multiple components at once
  const adaptMultiple = useCallback(
    (componentTypes: ComponentType[], options?: Partial<GeneralAdapterConfig>) => {
      const results: Record<string, AdaptedComponent> = {};
      
      componentTypes.forEach(type => {
        const adapted = adaptComponent(type, options);
        results[type] = adapted;
      });

      return results;
    },
    [adaptComponent]
  );

  // Apply a preset
  const applyPreset = useCallback(
    (presetName: string) => {
      const preset = ADAPTER_PRESETS[presetName];
      if (!preset) return;

      setCurrentPreset(presetName);

      // Get all components that work well with this preset
      const componentsToAdapt = availableComponents
        .filter(comp => comp.supportsSizes.includes(preset.size))
        .filter(comp => comp.supportsThemes.includes(preset.theme.style))
        .map(comp => comp.type);

      // Adapt all compatible components with preset settings
      adaptMultiple(componentsToAdapt, {
        size: preset.size,
        theme: preset.theme,
      });
    },
    [availableComponents, adaptMultiple]
  );

  // Get components by category
  const getComponentsByCategory = useCallback(
    (category: string) => {
      return Object.values(adaptedComponents).filter(
        comp => comp.metadata.category === category
      );
    },
    [adaptedComponents]
  );

  // Get recommended components for specific use cases
  const getRecommendations = useCallback(
    (useCase: string) => {
      const recommendations = availableComponents.filter(comp =>
        comp.bestFor.some(use => use.toLowerCase().includes(useCase.toLowerCase()))
      );
      
      return recommendations;
    },
    [availableComponents]
  );

  // Adapt all available components
  const adaptAll = useCallback(
    (options?: Partial<GeneralAdapterConfig>) => {
      const allTypes = availableComponents.map(comp => comp.type);
      return adaptMultiple(allTypes, options);
    },
    [availableComponents, adaptMultiple]
  );

  // Clear all adaptations
  const clearAll = useCallback(() => {
    setAdaptedComponents({});
    setCurrentPreset(null);
  }, []);

  return {
    // State
    adaptedComponents,
    availableComponents,
    currentPreset,
    
    // Actions
    adaptComponent,
    adaptMultiple,
    adaptAll,
    applyPreset,
    clearAll,
    
    // Queries
    getComponentsByCategory,
    getRecommendations,
    
    // Presets
    presets: ADAPTER_PRESETS,
  };
}