import { useState, useCallback, useEffect, useMemo } from "react";
import { ComponentMapper } from "./mapper";
import { StyleResolver } from "./style-resolver";
import { ThemeApplicator } from "./theme-applicator";
import { COMPONENT_REGISTRY, findComponentsForUIStyle, canComponentHandleData } from "./component-registry";
import { ComponentType } from "./general-adapter";
import { SectionConfig, ThemeConfig, UIStyle } from "./types/backend-types";

interface UsePortfolioAdapterOptions {
  sections: SectionConfig[];
  globalTheme: ThemeConfig;
  onError?: (error: Error) => void;
}

interface AdaptedSection {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  component: ComponentType;
  props: any;
  order: number;
  visible: boolean;
}

export function usePortfolioAdapter({
  sections,
  globalTheme,
  onError,
}: UsePortfolioAdapterOptions) {
  const [adaptedSections, setAdaptedSections] = useState<AdaptedSection[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, Error>>({});

  // Apply global theme on mount and when it changes
  useEffect(() => {
    ThemeApplicator.applyGlobalTheme(globalTheme);
  }, [globalTheme]);

  // Process all sections
  const processSections = useCallback(async () => {
    setIsProcessing(true);
    const adapted: AdaptedSection[] = [];
    const newErrors: Record<string, Error> = {};

    for (const section of sections) {
      try {
        const adaptedSection = await processSection(section);
        if (adaptedSection) {
          adapted.push(adaptedSection);
        }
      } catch (error) {
        const err = error as Error;
        newErrors[section.id] = err;
        onError?.(err);
      }
    }

    // Sort by order
    adapted.sort((a, b) => a.order - b.order);

    setAdaptedSections(adapted);
    setErrors(newErrors);
    setIsProcessing(false);
  }, [sections, globalTheme, onError]);

  // Process a single section
  const processSection = async (section: SectionConfig): Promise<AdaptedSection | null> => {
    if (!section.visible) return null;

    // Find suitable components for this UI style
    const suitableComponents = findComponentsForUIStyle(section.uiStyle);
    if (suitableComponents.length === 0) {
      throw new Error(`No components found for UI style: ${section.uiStyle}`);
    }

    // Get the first suitable component (or implement selection logic)
    const componentMapping = suitableComponents[0];
    const componentType = componentMapping.componentType;

    // Map data to component props
    const mappedData = ComponentMapper.mapDataToComponent(
      componentType,
      section.data,
      section.uiStyle
    );

    if (!mappedData) {
      throw new Error(`Failed to map data for component: ${componentType}`);
    }

    // Apply style configuration
    const styleConfig = StyleResolver.resolveStyle(componentType, section.uiStyle);
    const styledProps = {
      ...mappedData.props,
      ...styleConfig.additionalProps,
      className: StyleResolver.mergeClassNames(
        mappedData.props.className,
        styleConfig.className
      ),
      containerClassName: styleConfig.containerClassName,
    };

    // Apply theme (section theme overrides global theme)
    const effectiveTheme = section.theme 
      ? { ...globalTheme, ...section.theme }
      : globalTheme;
    
    const themedProps = ThemeApplicator.applyTheme(
      styledProps,
      effectiveTheme,
      componentType
    );

    return {
      id: section.id,
      type: section.type,
      title: section.title,
      subtitle: section.subtitle,
      component: componentType,
      props: themedProps,
      order: section.order,
      visible: section.visible,
    };
  };

  // Auto-process sections when they change
  useEffect(() => {
    processSections();
  }, [processSections]);

  // Get adapted section by ID
  const getSectionById = useCallback(
    (id: string) => adaptedSections.find(section => section.id === id),
    [adaptedSections]
  );

  // Get adapted sections by type
  const getSectionsByType = useCallback(
    (type: string) => adaptedSections.filter(section => section.type === type),
    [adaptedSections]
  );

  // Update section visibility
  const setSectionVisibility = useCallback(
    (id: string, visible: boolean) => {
      const updatedSections = sections.map(section =>
        section.id === id ? { ...section, visible } : section
      );
      // This would trigger re-processing through the effect
      // In real implementation, you'd update the sections state
    },
    [sections]
  );

  // Reorder sections
  const reorderSections = useCallback(
    (sectionIds: string[]) => {
      const reordered = adaptedSections.sort((a, b) => {
        const aIndex = sectionIds.indexOf(a.id);
        const bIndex = sectionIds.indexOf(b.id);
        return aIndex - bIndex;
      });
      setAdaptedSections([...reordered]);
    },
    [adaptedSections]
  );

  // Get component registry info
  const componentInfo = useMemo(() => {
    const info: Record<string, any> = {};
    adaptedSections.forEach(section => {
      info[section.id] = COMPONENT_REGISTRY[section.component];
    });
    return info;
  }, [adaptedSections]);

  // Validate if a component can handle specific data
  const validateComponent = useCallback(
    (componentType: ComponentType, dataType: string, uiStyle?: UIStyle) => {
      return canComponentHandleData(componentType, dataType, uiStyle);
    },
    []
  );

  return {
    // State
    adaptedSections,
    isProcessing,
    errors,
    componentInfo,

    // Actions
    processSections,
    setSectionVisibility,
    reorderSections,

    // Queries
    getSectionById,
    getSectionsByType,
    validateComponent,

    // Theme
    applyTheme: (theme: ThemeConfig) => ThemeApplicator.applyGlobalTheme(theme),
  };
}

// Hook for individual component adaptation (for custom use cases)
export function useComponentAdapter() {
  const adaptComponent = useCallback(
    (
      componentType: ComponentType,
      data: any,
      uiStyle?: UIStyle,
      theme?: ThemeConfig
    ) => {
      // Map data
      const mapped = ComponentMapper.mapDataToComponent(componentType, data, uiStyle);
      if (!mapped) return null;

      // Apply style
      const styleConfig = uiStyle 
        ? StyleResolver.resolveStyle(componentType, uiStyle)
        : {};
      
      const styledProps = {
        ...mapped.props,
        ...styleConfig.additionalProps,
        className: StyleResolver.mergeClassNames(
          mapped.props.className,
          styleConfig.className
        ),
      };

      // Apply theme if provided
      const finalProps = theme
        ? ThemeApplicator.applyTheme(styledProps, theme, componentType)
        : styledProps;

      return {
        component: componentType,
        props: finalProps,
      };
    },
    []
  );

  return { adaptComponent };
}