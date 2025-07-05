/**
 * TEMPLATE FOR ADDING NEW COMPONENTS TO THE ADAPTER SYSTEM
 * 
 * When you add a new Aceternity component, follow these steps:
 */

// 1. Add to component-registry.ts
/*
export const COMPONENT_REGISTRY = {
  // ... existing components
  
  "new-component": {
    componentType: "new-component",
    supportedDataTypes: ["DataType1", "DataType2"], // What backend data it can handle
    supportedUIStyles: ["style-1", "style-2"], // What UI styles it supports
    requiredProps: ["prop1", "prop2"], // Required props
    optionalProps: ["prop3", "prop4"], // Optional props
    defaultProps: {
      // Default prop values
      animationSpeed: "normal",
    },
  },
};
*/

// 2. Add to mapper.ts
/*
private static mapNewComponent(data: BackendTypes.DataType, uiStyle?: string): any {
  return {
    prop1: data.field1,
    prop2: data.field2,
    // Map backend data to component props
    children: (
      <div>
        {data.field3}
      </div>
    ),
  };
}

// Don't forget to add to getMapperFunction():
"new-component": this.mapNewComponent,
*/

// 3. Add style configurations if needed (style-resolver.ts)
/*
// Add UI style specific configurations
"new-ui-style": () => ({
  className: "specific-classes",
  animationSpeed: "slow",
  additionalProps: {
    customProp: "value",
  },
}),

// Add component-specific overrides if needed
private static getComponentOverrides() {
  "new-ui-style": {
    "new-component": {
      containerClassName: "special-container-class",
    },
  },
}
*/

// 4. Add theme-specific props if needed (theme-applicator.ts)
/*
private static getComponentThemeProps() {
  "new-component": {
    color: theme.colors.primary,
    gradient: theme.primaryGradient,
  },
}
*/

// 5. Add backend data type if needed (backend-types.ts)
/*
export interface NewDataType {
  id: string;
  field1: string;
  field2: number;
  field3?: any;
}
*/

// EXAMPLE: Adding a hypothetical "GlowCard" component
export const GlowCardAdapterExample = {
  // 1. Registry entry
  registry: {
    "glow-card": {
      componentType: "glow-card",
      supportedDataTypes: ["Card3DData", "ProjectData"],
      supportedUIStyles: ["cards-glow", "projects-glow"],
      requiredProps: ["title", "description"],
      optionalProps: ["glowColor", "glowIntensity", "image"],
      defaultProps: {
        glowIntensity: 0.5,
        glowColor: "#3b82f6",
      },
    },
  },

  // 2. Mapper function
  mapper: (data: any, uiStyle?: string) => {
    return {
      title: data.title || data.name,
      description: data.description,
      image: data.image,
      glowColor: uiStyle?.includes("projects") ? "#10b981" : "#3b82f6",
      glowIntensity: uiStyle?.includes("intense") ? 0.8 : 0.5,
      children: (
        <div className="p-6">
          <h3 className="text-xl font-bold">{data.title || data.name}</h3>
          <p className="text-gray-600 mt-2">{data.description}</p>
        </div>
      ),
    };
  },

  // 3. Style configuration
  styleConfig: {
    "cards-glow": () => ({
      className: "relative overflow-hidden rounded-xl",
      containerClassName: "p-4",
      animationSpeed: "slow",
      additionalProps: {
        hoverScale: 1.05,
      },
    }),
  },

  // 4. Theme props
  themeProps: (theme: any) => ({
    glowColor: theme.colors.accent,
    style: {
      "--glow-color": theme.colors.accent,
      "--glow-intensity": "0.5",
    },
  }),
};

// AUTOMATED ADAPTER GENERATOR FUNCTION
export function generateAdapterCode(componentName: string, componentInfo: {
  requiredProps: string[];
  optionalProps?: string[];
  supportedDataTypes: string[];
  supportedUIStyles: string[];
}) {
  const camelCase = componentName.replace(/-./g, x => x[1].toUpperCase());
  const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);

  return `
// Add to component-registry.ts
"${componentName}": {
  componentType: "${componentName}",
  supportedDataTypes: ${JSON.stringify(componentInfo.supportedDataTypes)},
  supportedUIStyles: ${JSON.stringify(componentInfo.supportedUIStyles)},
  requiredProps: ${JSON.stringify(componentInfo.requiredProps)},
  optionalProps: ${JSON.stringify(componentInfo.optionalProps || [])},
  defaultProps: {
    // Add default props here
  },
},

// Add to mapper.ts
private static map${pascalCase}(data: any, uiStyle?: string): any {
  return {
    ${componentInfo.requiredProps.map(prop => `${prop}: data.${prop},`).join('\n    ')}
    ${componentInfo.optionalProps?.map(prop => `// ${prop}: data.${prop},`).join('\n    ') || ''}
  };
}

// Add to getMapperFunction():
"${componentName}": this.map${pascalCase},
`;
}