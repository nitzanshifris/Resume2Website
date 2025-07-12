import { ReactElement } from 'react';
import { 
  FloatingNavbar,
  FloatingNavbarStandard,
  FloatingNavbarMinimal,
  FloatingNavbarPortfolio,
  type NavItem 
} from '@/components/ui/floating-navbar';

export interface FloatingNavbarAdapterConfig {
  componentType: 'floating-navbar';
  variant?: 'standard' | 'minimal' | 'portfolio' | 'custom';
  navItems?: NavItem[];
  className?: string;
}

export class FloatingNavbarAdapter {
  static adapt(config: FloatingNavbarAdapterConfig): ReactElement {
    const { variant = 'standard', navItems, className } = config;

    // If custom nav items are provided, use base component
    if (navItems && navItems.length > 0) {
      return <FloatingNavbar navItems={navItems} className={className} />;
    }

    // Otherwise use variant components
    switch (variant) {
      case 'standard':
        return <FloatingNavbarStandard className={className} />;
      case 'minimal':
        return <FloatingNavbarMinimal className={className} />;
      case 'portfolio':
        return <FloatingNavbarPortfolio className={className} />;
      default:
        return <FloatingNavbarStandard className={className} />;
    }
  }

  static generateCode(config: FloatingNavbarAdapterConfig): string {
    const { variant = 'standard', navItems, className } = config;

    if (navItems && navItems.length > 0) {
      const navItemsCode = navItems.map((item) => {
        const iconCode = item.icon ? `, icon: <YourIcon />` : '';
        return `    { name: "${item.name}", link: "${item.link}"${iconCode} }`;
      }).join(',\n');

      return `import { FloatingNavbar } from "@/components/ui/floating-navbar";

const navItems = [
${navItemsCode}
];

export function MyComponent() {
  return <FloatingNavbar navItems={navItems}${className ? ` className="${className}"` : ''} />;
}`;
    }

    const componentName = variant === 'standard' ? 'FloatingNavbarStandard' :
                         variant === 'minimal' ? 'FloatingNavbarMinimal' :
                         variant === 'portfolio' ? 'FloatingNavbarPortfolio' :
                         'FloatingNavbarStandard';

    return `import { ${componentName} } from "@/components/ui/floating-navbar";

export function MyComponent() {
  return <${componentName}${className ? ` className="${className}"` : ''} />;
}`;
  }
}