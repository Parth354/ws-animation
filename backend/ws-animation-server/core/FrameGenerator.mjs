import { FRAME_RATE } from '../config.mjs';

export function generateFrame(
  frameId,
  startTime,
  frameRate = FRAME_RATE,
  canvasWidth = 1000,
  canvasHeight = 700
) {
  const elapsed = (Date.now() - startTime) / 1000;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  const orbits = Array.from({ length: 5 }, (_, i) => {
    const speed = 0.5 + i * 0.35;
    const dist = 100 + i * 35;
    const radius = 10 + i * 4 + Math.sin(elapsed * speed * 2 + i) * 3;
    const hue = (elapsed * speed * 50 + i * 60) % 360;
    return {
      id: `orb${i}`,
      type: 'circle',
      x: centerX + Math.cos(elapsed * speed) * dist,
      y: centerY + Math.sin(elapsed * speed) * dist,
      radius,
      color: `hsl(${hue}, 80%, 65%)`
    };
  });

  const burstInterval = Math.floor(frameRate * 3);
  const starburst = frameId % burstInterval === 0
    ? Array.from({ length: 12 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 12;
        const speed = 100 + Math.random() * 80;
        return {
          id: `star${frameId}_${i}`,
          type: 'particle',
          x: centerX,
          y: centerY,
          radius: 3 + Math.random() * 2,
          color: `hsla(${Math.random() * 360},100%,90%,1)`,
          velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
          start: elapsed
        };
      })
    : [];

  return {
    frameId,
    timestamp: Date.now(),
    elapsed,
    objects: [...orbits, ...starburst],
    metadata: {
      totalObjects: orbits.length + starburst.length,
      fps: frameRate,
      canvas: { width: canvasWidth, height: canvasHeight }
    }
  };
}
