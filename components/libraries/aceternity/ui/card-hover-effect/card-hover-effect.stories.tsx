import type { Meta, StoryObj } from '@storybook/react';
import { HoverEffectV2 as Component, Card, CardTitle, CardDescription } from './index';
import type { HoverEffectProps } from './card-hover-effect.types';
import React from 'react';
import { DynamicBox } from '../dynamic-box';

// ---------- Helper component: draggable & editable card ----------
interface DynamicHoverCardProps {
  itm: any;
  idx: number;
  mode: 'flow' | 'absolute';
  draggable: boolean;
  resizable: boolean;
  initialX: number;
  initialY: number;
  initialWidth: number | string;
  initialHeight: number | string;
  bounds: string;
  showOutline: boolean;
  titleSize: string;
  descSize: string;
  titleCol: string;
  descCol: string;
  cardBg: string;
  className: string;
}

const DynamicHoverCard: React.FC<DynamicHoverCardProps> = React.memo(
  ({
    itm,
    idx,
    mode,
    draggable,
    resizable,
    initialX,
    initialY,
    initialWidth,
    initialHeight,
    bounds,
    showOutline,
    titleSize,
    descSize,
    titleCol,
    descCol,
    cardBg,
    className,
  }) => {
    const [localTitle, setLocalTitle] = React.useState(itm.title);
    const [localDesc, setLocalDesc] = React.useState(itm.description);

    const [layout, setLayout] = React.useState({
      x: initialX + idx * 60,
      y: initialY + idx * 60,
      width: typeof initialWidth === 'number' ? initialWidth : 450,
      height: typeof initialHeight === 'number' ? initialHeight : 450,
    });

    const handleLayout = (l: { x: number; y: number; width: number; height: number }) =>
      setLayout(l);

    return (
      <DynamicBox
        mode={mode}
        draggable={draggable}
        resizable={resizable}
        initialX={layout.x}
        initialY={layout.y}
        initialWidth={layout.width}
        initialHeight={layout.height}
        position={{ x: layout.x, y: layout.y }}
        controlledSize={{ width: layout.width, height: layout.height }}
        bounds={bounds}
        showOutline={showOutline}
        onLayoutChange={handleLayout}
        className="group inline-block"
      >
        <span className="pointer-events-none absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/80 rounded-3xl opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <Card className={className} style={{ backgroundColor: cardBg }}>
          <h4
            className={`focus:outline-none font-bold tracking-wide mt-4 text-${titleSize}`}
            style={{ color: titleCol }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e: any) => setLocalTitle(e.target.textContent)}
          >
            {localTitle}
          </h4>
          <p
            className={`focus:outline-none mt-2 tracking-wide leading-relaxed text-${descSize}`}
            style={{ color: descCol }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e: any) => setLocalDesc(e.target.textContent)}
          >
            {localDesc}
          </p>
        </Card>
      </DynamicBox>
    );
  }
);

// ----------------------------------------------------------------

const meta: Meta<typeof Component> = {
  title: 'Aceternity/CardHoverEffect',
  component: Component,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0d0d0d' },
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Component>;

export const Website: Story = {
  args: {
    className: 'max-w-7xl mx-auto',
    textSize: 'lg',
    descriptionSize: 'sm',
    titleColor: '#ffffff',
    descriptionColor: '#a1a1aa',
    items: [
      { title: 'Stripe', description: 'A technology company that builds economic infrastructure for the internet.', link: '#' },
      { title: 'Netflix', description: 'A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more.', link: '#' },
      { title: 'Google', description: 'A multinational technology company that specializes in Internet-related services and products.', link: '#' },
      { title: 'Meta', description: "A technology company that focuses on products that advance Facebook's mission of bringing the world closer together.", link: '#' },
      { title: 'Amazon', description: 'A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.', link: '#' },
      { title: 'Microsoft', description: 'A multinational technology company that develops, manufactures, licenses, supports, and sells computer software and services.', link: '#' },
    ],
  } as any,
  argTypes: {
    className: { control: 'text' },
    textSize: { control: { type: 'select' }, options: ['xs','sm','md','lg','xl','2xl','3xl','4xl','5xl','6xl','7xl','8xl','9xl'], description: 'Tailwind font-size applied via Storybook decorator' },
    descriptionSize: { control: { type: 'select' }, options: ['xs','sm','md','lg','xl','2xl','3xl','4xl','5xl'], description: 'Tailwind size for description text' },
    titleColor: { control: 'color', description: 'Color for card title text' },
    descriptionColor: { control: 'color', description: 'Color for card description text' },
    items: { control: 'object', description: 'Array of objects with title, description, link' },
    render: {
      action: 'render',
      description: 'Custom render function',
    },
  } as any,
  render: (args: any) => {
    const { descriptionSize = 'sm', className, items, titleColor, descriptionColor } = args;
    const descClass = `text-${descriptionSize}`;
    const countOptions = Array.from({ length: items.length }, (_, i) => i + 1);
    const [cardsCount, setCardsCount] = React.useState(items.length);

    return (
      <div className={className}>
        <div className="flex items-center gap-2 mb-4">
          <label className="text-sm text-gray-400">Cards to show
            <select
              value={cardsCount}
              onChange={(e)=>setCardsCount(parseInt(e.target.value))}
              className="ml-2 bg-neutral-800 text-white border border-neutral-600 rounded px-2 py-1"
            >
              {countOptions.map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10">
          {items.slice(0, cardsCount).map((item: any) => (
            <a href={item.link} key={item.link} className="relative group block p-2 h-full w-full">
              <span className="pointer-events-none absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/80 rounded-3xl opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <Card>
                <h4 className="text-zinc-100 font-bold tracking-wide mt-4" style={{ color: titleColor }}>
                  {item.title}
                </h4>
                <p className={`${descClass} mt-8 tracking-wide leading-relaxed`} style={{ color: descriptionColor }}>
                  {item.description}
                </p>
              </Card>
            </a>
          ))}
        </div>
      </div>
    );
  },
};

export const Bare: Story = {
  args: {
    textSize: 'md',
    descriptionSize: 'sm',
    titleColor: '#000000',
    descriptionColor: '#52525b',
    items: [
      { title: 'Demo', description: 'Simple demo card', link: '#' },
      { title: 'Second', description: 'Another card', link: '#' },
    ],
  } as any,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  argTypes: {
    textSize: { control: { type: 'select' }, options: ['xs','sm','md','lg','xl','2xl','3xl','4xl','5xl','6xl','7xl','8xl','9xl'] },
    descriptionSize: { control: { type: 'select' }, options: ['xs','sm','md','lg','xl','2xl','3xl','4xl','5xl'] },
    titleColor: { control: 'color' },
    descriptionColor: { control: 'color' },
    items: { control: 'object' },
    render: {
      action: 'render',
      description: 'Custom render function',
    },
  } as any,
  render: (args: any) => {
    const { descriptionSize = 'sm', items, titleColor, descriptionColor } = args;
    const descClass = `text-${descriptionSize}`;
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: any) => (
            <Card key={item.title}>
              <h4 className="text-zinc-900 font-bold tracking-wide mt-4" style={{ color: titleColor }}>
                {item.title}
              </h4>
              <p className={`${descClass} mt-4 tracking-wide leading-relaxed`} style={{ color: descriptionColor }}>
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    );
  },
};

export const Dynamic: Story = {
  args: {
    mode: 'absolute',
    draggable: true,
    resizable: true,
    initialX: 50,
    initialY: 50,
    initialWidth: 450,
    initialHeight: 450,
    className: 'inline-block',
    bounds: 'window',
    showOutline: false,
    textSize: 'lg',
    descriptionSize: 'sm',
    titleColor: '#ffffff',
    descriptionColor: '#a1a1aa',
    items: [
      { title: 'Dynamic', description: 'Drag me around & resize', link: '#' },
      { title: 'Second', description: 'Another draggable card', link: '#' },
      { title: 'Third', description: 'Yet another one', link: '#' },
      { title: 'Fourth', description: 'More draggable fun', link: '#' },
      { title: 'Fifth', description: 'Keep exploring', link: '#' },
      { title: 'Sixth', description: 'Last card in the set', link: '#' },
    ],
  } as any,
  argTypes: {
    mode: { control: { type: 'radio' }, options: ['flow', 'absolute'] },
    draggable: { control: 'boolean' },
    resizable: { control: 'boolean' },
    initialX: { control: 'number' },
    initialY: { control: 'number' },
    initialWidth: { control: 'number' },
    initialHeight: { control: 'number' },
    bounds: { control: 'text' },
    showOutline: { control: 'boolean' },
  } as any,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0d0d0d' },
      ],
    },
  },
  render: (args: any) => {
    const {
      mode,
      draggable,
      resizable,
      initialX,
      initialY,
      initialWidth,
      initialHeight,
      className,
      bounds,
      showOutline,
      ...componentArgs
    } = args;

    const sizeOptions = ['xs','sm','md','lg','xl','2xl','3xl','4xl','5xl','6xl'];
    const [titleSize, setTitleSize] = React.useState(componentArgs.textSize || 'lg');
    const [descSize, setDescSize] = React.useState(componentArgs.descriptionSize || 'sm');
    const [titleCol, setTitleCol] = React.useState(componentArgs.titleColor);
    const [descCol, setDescCol] = React.useState(componentArgs.descriptionColor);
    const [cardBg, setCardBg] = React.useState<string>("#000000");

    const [cardsCount, setCardsCount] = React.useState(componentArgs.items.length);
    const countOptions = Array.from({ length: componentArgs.items.length }, (_, i) => i + 1);

    return (
      <div className="relative h-screen w-full flex flex-col items-center justify-center gap-4">
        <div className="flex gap-4">
          <label className="text-sm text-gray-600">Title size
            <select value={titleSize} onChange={e=>setTitleSize(e.target.value)} className="ml-2 border px-2 py-1 rounded">
              {sizeOptions.map(s=>(<option key={s} value={s}>{s}</option>))}
            </select>
          </label>
          <label className="text-sm text-gray-600">Desc size
            <select value={descSize} onChange={e=>setDescSize(e.target.value)} className="ml-2 border px-2 py-1 rounded">
              {sizeOptions.map(s=>(<option key={s} value={s}>{s}</option>))}
            </select>
          </label>
          <label className="text-sm text-gray-600">Cards
            <select value={cardsCount} onChange={e=>setCardsCount(parseInt(e.target.value))} className="ml-2 border px-2 py-1 rounded">
              {countOptions.map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>

        <div className="flex gap-4">
          <label className="text-sm text-gray-600 flex items-center gap-2">Title color
            <input
              type="color"
              value={titleCol}
              onChange={e => setTitleCol(e.target.value)}
              className="w-8 h-8 p-0 border rounded"
            />
          </label>
          <label className="text-sm text-gray-600 flex items-center gap-2">Desc color
            <input
              type="color"
              value={descCol}
              onChange={e => setDescCol(e.target.value)}
              className="w-8 h-8 p-0 border rounded"
            />
          </label>
          <label className="text-sm text-gray-600 flex items-center gap-2">Card bg
            <input
              type="color"
              value={cardBg}
              onChange={e => setCardBg(e.target.value)}
              className="w-8 h-8 p-0 border rounded"
            />
          </label>
        </div>

        <div className="relative w-full h-full">
          {componentArgs.items.slice(0, cardsCount).map((itm: any, idx: number) => (
            <DynamicHoverCard
              key={itm.title + idx}
              itm={itm}
              idx={idx}
              mode={mode}
              draggable={draggable}
              resizable={resizable}
              initialX={initialX}
              initialY={initialY}
              initialWidth={initialWidth}
              initialHeight={initialHeight}
              bounds={bounds}
              showOutline={showOutline}
              titleSize={titleSize}
              descSize={descSize}
              titleCol={titleCol}
              descCol={descCol}
              cardBg={cardBg}
              className={className}
            />
          ))}
        </div>
      </div>
    );
  },
};
