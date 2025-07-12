import dynamic from 'next/dynamic';

// Lazy-load Playground to avoid SSR issues
const Playground = dynamic(() => import('../../components/Playground/PlaygroundCanvas').then(m => m.PlaygroundCanvasWrapper), { ssr: false });

export default function PlaygroundPage() {
  return <Playground />;
} 