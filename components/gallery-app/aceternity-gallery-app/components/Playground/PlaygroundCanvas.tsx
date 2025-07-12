"use client";
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PlaygroundProvider, usePlayground } from './PlaygroundContext';
import { componentRegistry, getComponentById } from './componentRegistry';
import { DynamicBox } from "../../component-library/components/ui/dynamic-box";

export function PlaygroundCanvasWrapper() {
  return (
    <PlaygroundProvider>
      <PlaygroundCanvas />
    </PlaygroundProvider>
  );
}

function PlaygroundCanvas() {
  const { widgets, addWidget, updateWidget, removeWidget } = usePlayground();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    componentRegistry.filter((c) => c.title.toLowerCase().includes(search.toLowerCase())), [search]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 border-r border-neutral-700 bg-neutral-900 p-4 space-y-4 overflow-y-auto">
        <input
          className="w-full rounded bg-neutral-800 p-2 text-sm text-white placeholder:text-neutral-400"
          placeholder="Search components…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="space-y-2">
          {filtered.map((c) => (
            <button
              key={c.id}
              className="block w-full rounded bg-neutral-800 px-3 py-2 text-left text-sm text-white hover:bg-neutral-700"
              onClick={() => addWidget(c.id)}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 overflow-auto bg-neutral-950">
        {widgets.map((w) => {
          const reg = getComponentById(w.componentId);
          if (!reg) return null;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore – dynamic expects specific signature
          const Comp = dynamic(() => reg.load() as any, { ssr: false }) as any;
          return (
            <DynamicBox
              key={w.id}
              mode="absolute"
              draggable
              resizable
              bounds="parent"
              initialX={w.layout.x}
              initialY={w.layout.y}
              initialWidth={w.layout.w}
              initialHeight={w.layout.h}
              onLayoutChange={(l: any) =>
                updateWidget(w.id, {
                  layout: { x: l.x, y: l.y, w: l.width, h: l.height },
                })
              }
            >
              <div className="relative h-full w-full border border-neutral-700 bg-neutral-800">
                <button
                  className="absolute right-1 top-1 z-10 rounded bg-red-500 px-1 text-xs text-white"
                  onClick={() => removeWidget(w.id)}
                >
                  ×
                </button>
                <Comp {...w.props} />
              </div>
            </DynamicBox>
          );
        })}
      </div>
    </div>
  );
} 