import React, { useContext, useEffect, useRef, useState } from 'react';
import { WebSocketContext } from '../context/WebSocketProvider';

export default function AnimationCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [frameData, setFrameData] = useState(null);
  const [fps, setFps] = useState(0);
  const [isAnimating, setAnimating] = useState(false);
  const fpsTracker = useRef({ frames: 0, last: Date.now() });
  const trails = useRef({});
  const { connectionStatus, lastMessage } = useContext(WebSocketContext);

  // Handle WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;
    const { type, payload } = lastMessage;
    if (type === 'FRAME') setFrameData(payload.frameData);
    else if (type === 'ANIMATION_STARTED') setAnimating(true);
    else if (type === 'ANIMATION_STOPPED') setAnimating(false);
  }, [lastMessage]);

  // Draw loop
  useEffect(() => {
    if (!frameData) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { objects, frameId, elapsed } = frameData;

    // Reset trails at start of animation
    if (frameId === 0) trails.current = {};

    const render = () => {
      // Background
      const g = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 50,
        canvas.width/2, canvas.height/2, canvas.width / 1.2
      );
      g.addColorStop(0, '#00000a');
      g.addColorStop(1, '#000000');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      objects.forEach(obj => {
        ctx.save();

        if (obj.type === 'circle') {
          // Initialize trail list
          if (!trails.current[obj.id]) trails.current[obj.id] = [];
          const trail = trails.current[obj.id];
          trail.push({ x: obj.x, y: obj.y });
          if (trail.length > 30) trail.shift();

          // Draw trail
          if (trail.length >= 6) {
            ctx.beginPath();
            trail.forEach((p, i) => {
              ctx.globalAlpha = i / trail.length;
              i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
            });
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }

          // Draw orb
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
          ctx.fillStyle = obj.color;
          ctx.shadowColor = obj.color;
          ctx.shadowBlur = 30;
          ctx.fill();
        }

        if (obj.type === 'particle') {
          const age = elapsed - obj.start;
          const life = 1.2;
          if (age <= life) {
            const progress = age / life;
            const x = obj.x + obj.velocity.x * progress;
            const y = obj.y + obj.velocity.y * progress;
            const alpha = Math.max(0, 1 - progress);
            const size = obj.radius * (1 - progress);

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(x, y);
            ctx.rotate(obj.start + elapsed); // Rotate outward
            const starSize = size * (0.6 + Math.sin(progress * Math.PI) * 0.4);

            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
              const angle = (i * 2 * Math.PI) / 5;
              ctx.lineTo(starSize * Math.cos(angle), starSize * Math.sin(angle));
              ctx.lineTo((starSize / 2) * Math.cos(angle + Math.PI / 5), (starSize / 2) * Math.sin(angle + Math.PI / 5));
            }
            ctx.closePath();
            ctx.fillStyle = obj.color;
            ctx.shadowColor = obj.color;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.restore();
          }
        }

        ctx.restore();
      });

      // Overlay
      ctx.fillStyle = '#fff';
      ctx.font = '14px monospace';
      ctx.fillText(`Frame: ${frameId}`, 10, 25);
      ctx.fillText(`Objs: ${objects.length}`, 10, 45);
      ctx.fillText(`FPS: ${fps}`, 10, 65);

      // Update FPS
      fpsTracker.current.frames++;
      const now = Date.now();
      if (now - fpsTracker.current.last >= 1000) {
        setFps(fpsTracker.current.frames);
        fpsTracker.current.frames = 0;
        fpsTracker.current.last = now;
      }
    };

    const animate = () => {
      render();
      if (isAnimating) animRef.current = requestAnimationFrame(animate);
    };

    if (isAnimating) animate();
    else render();

    return () => cancelAnimationFrame(animRef.current);
  }, [frameData, isAnimating]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="relative w-full h-full bg-black rounded overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
      {connectionStatus !== 'connected' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-xl text-white">
          {connectionStatus === 'error' ? '❌ Error' : '🔌 Connecting...'}
        </div>
      )}
    </div>
  );
}
