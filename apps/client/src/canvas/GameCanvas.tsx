import { Application, extend } from '@pixi/react';
import { Application as App, Container, Graphics, Renderer } from 'pixi.js';
import { useRef, useEffect, useCallback } from 'react';
import { CrashScene } from './scenes/CrashScene.js';

extend({ Container, Graphics });

interface GameCanvasProps {
  width: number;
  height: number;
}

export function GameCanvas({ width, height }: GameCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMount = useCallback((app: App<Renderer>) => {
    // expose for devtools
    // todo: use env variables to prevent this from being in prod builds
    (globalThis as any).__PIXI_APP__ = app;
  }, []);

  // Force the canvas element to match container size after mount
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const canvas = wrapper.querySelector('canvas');
    if (canvas) {
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }
  }, [width, height]);

  return (
    <div ref={wrapperRef} style={{ position: 'absolute', inset: 0 }}>
      <Application
        width={width}
        height={height}
        backgroundColor={0x030712}
        antialias
        resolution={1}
        onInit={handleMount}
      >
        <CrashScene width={width} height={height} />
      </Application>
    </div>
  );
}
