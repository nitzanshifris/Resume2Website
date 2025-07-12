import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

export interface RegistryItem {
  id: string;
  title: string;
  load: () => Promise<{ default: ComponentType<any> }>;
}

// TODO: auto-generate. For prototype we list a subset.
export const componentRegistry: RegistryItem[] = [
  {
    id: 'card-hover-effect',
    title: 'Card Hover Effect',
    load: () =>
      import('@/component-library/components/ui/card-hover-effect').then((m) => ({
        default: m.HoverEffectV2 ?? m.HoverEffect ?? (Object.values(m)[0] as any),
      })),
  },
  {
    id: 'hover-border-gradient',
    title: 'Hover Border Gradient',
    load: () =>
      import('@/component-library/components/ui/hover-border-gradient').then((m) => ({
        default: m.default ?? (Object.values(m)[0] as any),
      })),
  },
  {
    id: 'wobble-card',
    title: 'Wobble Card',
    load: () =>
      import('@/component-library/components/ui/wobble-card').then((m) => ({
        default: m.default ?? (Object.values(m)[0] as any),
      })),
  },
];

export const getComponentById = (id: string) => componentRegistry.find((c) => c.id === id); 