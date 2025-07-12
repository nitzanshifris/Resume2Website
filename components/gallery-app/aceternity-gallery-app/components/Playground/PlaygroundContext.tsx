"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { nanoid } from 'nanoid';

export interface Widget {
  id: string;
  componentId: string;
  props: Record<string, any>;
  layout: { x: number; y: number; w: number; h: number };
}

interface PlaygroundState {
  widgets: Widget[];
  addWidget: (componentId: string, defaultProps?: Record<string, any>) => void;
  updateWidget: (id: string, newProps: Partial<Widget>) => void;
  removeWidget: (id: string) => void;
}

const PlaygroundContext = createContext<PlaygroundState | null>(null);

export const usePlayground = () => {
  const ctx = useContext(PlaygroundContext);
  if (!ctx) throw new Error('usePlayground must be within provider');
  return ctx;
};

export function PlaygroundProvider({ children }: { children: ReactNode }) {
  const [widgets, setWidgets] = useState<Widget[]>([]);

  const addWidget = (componentId: string, defaultProps: Record<string, any> = {}) => {
    setWidgets((prev) => [
      ...prev,
      {
        id: nanoid(),
        componentId,
        props: defaultProps,
        layout: { x: 50, y: 50, w: 300, h: 300 },
      },
    ]);
  };

  const updateWidget = (id: string, newProps: Partial<Widget>) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, ...newProps } : w)));
  };

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <PlaygroundContext.Provider value={{ widgets, addWidget, updateWidget, removeWidget }}>
      {children}
    </PlaygroundContext.Provider>
  );
} 