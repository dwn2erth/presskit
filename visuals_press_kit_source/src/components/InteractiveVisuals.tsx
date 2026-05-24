import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Camera, Radio, Sparkles, Sliders, ToggleLeft, ToggleRight, Music } from "lucide-react";

interface InteractiveVisualsProps {
  accentColor: string; // "cyan" | "violet" | "emerald" | "amber"
}

export default function InteractiveVisuals({ accentColor }: InteractiveVisualsProps) {
  const [activePreset, setActivePreset] = useState<"nodes" | "glitch" | "waves">("nodes");
  const [speed, setSpeed] = useState<number>(30); // scale 1-100
  const [feedback, setFeedback] = useState<boolean>(true);
  const [pixelDensity, setPixelDensity] = useState<number>(14);
  const [useCamera, setUseCamera] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [bpm, setBpm] = useState<number>(120);
  const [pulseScale, setPulseScale] = useState<number>(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Hidden offscreen canvas for webcam pixel crunching
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Track beat timing
  const lastPulseTimeRef = useRef<number>(0);

  // Retrieve color hexes
  const getColorHex = (op: number = 1) => {
    switch (accentColor) {
      case "violet":
        return `rgba(139, 92, 246, ${op})`; // violet-500
      case "emerald":
        return `rgba(16, 185, 129, ${op})`; // emerald-500
      case "amber":
        return `rgba(245, 158, 11, ${op})`; // amber-500
      case "cyan":
      default:
        return `rgba(6, 182, 212, ${op})`; // cyan-500
    }
  };

  const getSecondaryColorHex = (op: number = 1) => {
    switch (accentColor) {
      case "violet":
        return `rgba(236, 72, 153, ${op})`; // pink-500
      case "emerald":
        return `rgba(45, 212, 191, ${op})`; // teal-400
      case "amber":
        return `rgba(239, 68, 68, ${op})`; // red-500
      case "cyan":
      default:
        return `rgba(59, 130, 246, ${op})`; // blue-500
    }
  };

  // Setup video stream on toggles
  useEffect(() => {
    if (useCamera) {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 160, height: 120 } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch((err) => console.warn(err));
          }
          streamRef.current = stream;
        })
        .catch((err) => {
          console.warn("Camera block or error:", err);
          setUseCamera(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useCamera]);

  // Handle Resize correctly
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight || 400;
      }
    };

    window.addEventListener("resize", handleResize);
    // Initial trigger
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Main canvas rendering animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Generate stable points for presets
    const count = 75;
    const points: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    for (let i = 0; i < count; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        r: Math.random() * 2 + 1,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    let animationFrameId: number;
    let localFrame = 0;

    const render = (time: number) => {
      localFrame++;

      // 1. Calculate BPM heartbeat pulse
      const beatsMs = (60 / bpm) * 1000;
      const progress = (time - lastPulseTimeRef.current) % beatsMs;
      if (time - lastPulseTimeRef.current >= beatsMs) {
        lastPulseTimeRef.current = time;
      }
      // Simple decay curve for visual sync flashing
      const currentPulse = Math.max(1, 1.25 * Math.exp(-progress / 200));
      setPulseScale(currentPulse);

      // 2. Erase or feedback trail
      if (feedback) {
        ctx.fillStyle = "rgba(15, 15, 15, 0.15)"; // #0F0F0F trail for Geometric theme consistency
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Check if speed multiplier is paused
      const speedMult = isPlaying ? speed / 30 : 0;

      // 3. Optional Camera Processing Overlay
      let cameraPixelData: Uint8ClampedArray | null = null;
      let camW = 0;
      let camH = 0;

      if (useCamera && videoRef.current && offscreenCanvasRef.current) {
        const offscreen = offscreenCanvasRef.current;
        const oCtx = offscreen.getContext("2d");
        if (oCtx && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          oCtx.drawImage(videoRef.current, 0, 0, offscreen.width, offscreen.height);
          cameraPixelData = oCtx.getImageData(0, 0, offscreen.width, offscreen.height).data;
          camW = offscreen.width;
          camH = offscreen.height;
        }
      }

      // If camera is feeding, render low-fi cyberpunk camera raster first
      if (cameraPixelData && camW > 0) {
        const gridX = camW;
        const gridY = camH;
        const cellW = canvas.width / gridX;
        const cellH = canvas.height / gridY;

        ctx.strokeStyle = getColorHex(0.08);
        ctx.lineWidth = 0.5;

        for (let y = 0; y < gridY; y += 2) {
          for (let x = 0; x < gridX; x += 1) {
            const idx = (y * gridX + x) * 4;
            const r = cameraPixelData[idx];
            const g = cameraPixelData[idx + 1];
            const b = cameraPixelData[idx + 2];
            const brightness = (r + g + b) / 3;

            if (brightness > 40) {
              const cx = x * cellW + cellW / 2;
              const cy = y * cellH + cellH / 2;
              const size = (brightness / 255) * pixelDensity * 0.8;

              ctx.fillStyle = getSecondaryColorHex((brightness / 255) * 0.4);
              ctx.beginPath();
              
              if (activePreset === "glitch") {
                // Rectangles glitch representation
                ctx.fillRect(cx - size / 2, cy - 1, size * 1.5, 2);
              } else if (activePreset === "waves") {
                // Slanted visual lines representation
                ctx.arc(cx, cy, size / 3, 0, Math.PI * 2);
                ctx.fill();
              } else {
                // Circle mesh representation
                ctx.arc(cx, cy, size / 4, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        }
      }

      // 4. Render main algorithmic preset
      if (activePreset === "nodes") {
        // --- PRESET A: Generative Particle Nodes (Joaquín's creative system style) ---
        ctx.strokeStyle = getColorHex(0.12);
        ctx.lineWidth = 0.5;

        // Draw connections
        for (let i = 0; i < points.length; i++) {
          const pi = points[i];
          for (let j = i + 1; j < points.length; j++) {
            const pj = points[j];
            const dx = pi.x - pj.x;
            const dy = pi.y - pj.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 110) {
              const alpha = (1 - dist / 110) * 0.25 * currentPulse;
              ctx.strokeStyle = getColorHex(alpha);
              ctx.beginPath();
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
              ctx.stroke();
            }
          }

          // Move points
          pi.x += pi.vx * speedMult;
          pi.y += pi.vy * speedMult;

          // Boundary bounce or warp
          if (pi.x < 0) pi.x = canvas.width;
          if (pi.x > canvas.width) pi.x = 0;
          if (pi.y < 0) pi.y = canvas.height;
          if (pi.y > canvas.height) pi.y = 0;

          // Mouse attraction vortex
          if (mouseX > 0) {
            const mdx = mouseX - pi.x;
            const mdy = mouseY - pi.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 180) {
              const force = (1 - mdist / 180) * 0.15;
              pi.x += mdx * force;
              pi.y += mdy * force;
            }
          }

          // Draw the original point
          ctx.fillStyle = getColorHex(0.6);
          ctx.beginPath();
          ctx.arc(pi.x, pi.y, pi.r * (currentPulse * 0.9), 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (activePreset === "glitch") {
        // --- PRESET B: Glitch Grid Vector Matrix (Shared duo performance aesthetic) ---
        const rows = 12;
        const cols = 20;
        const cellW = canvas.width / cols;
        const cellH = canvas.height / rows;

        ctx.lineWidth = 1;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = c * cellW;
            const y = r * cellH;
            
            // Calc distance to mouse or center pulse
            let influence = 1;
            if (mouseX > 0) {
              const dx = mouseX - (x + cellW / 2);
              const dy = mouseY - (y + cellH / 2);
              const dist = Math.sqrt(dx * dx + dy * dy);
              influence += Math.max(0, (1 - dist / 220) * 4);
            }

            // Pulse wave
            const pulseFactor = Math.sin((localFrame * 0.05) + (r * 0.1) + (c * 0.08)) * 0.5 + 0.5;
            const activeAlpha = 0.08 + (pulseFactor * 0.15) * currentPulse;

            ctx.strokeStyle = getColorHex(activeAlpha);
            ctx.strokeRect(x + 2, y + 2, cellW - 4, cellH - 4);

            // Tech indicators / crosses
            if ((r + c) % 6 === 0) {
              ctx.strokeStyle = getSecondaryColorHex(0.35 * currentPulse);
              const cx = x + cellW / 2;
              const cy = y + cellH / 2;
              const size = 3 * influence * (currentPulse * 0.82);
              
              ctx.beginPath();
              ctx.moveTo(cx - size, cy);
              ctx.lineTo(cx + size, cy);
              ctx.moveTo(cx, cy - size);
              ctx.lineTo(cx, cy + size);
              ctx.stroke();
            }
          }
        }

        // Horizontal visual glitch lines matching typical live projections
        if (localFrame % 45 === 0 && Math.random() > 0.4) {
          const hY = Math.random() * canvas.height;
          ctx.fillStyle = getSecondaryColorHex(0.18 * currentPulse);
          ctx.fillRect(0, hY, canvas.width, Math.random() * 8 + 2);
        }

      } else if (activePreset === "waves") {
        // --- PRESET C: Audio Reactivity Wave Synthesizer (Sofía's analog video signature) ---
        const waveY = canvas.height * 0.5;
        const pointCount = 60;
        const spacing = canvas.width / (pointCount - 1);

        ctx.lineWidth = 1.8;

        // Visual outer wave loop (simulating oscilloscope vectors)
        for (let waveIdx = 0; waveIdx < 4; waveIdx++) {
          const alphaScale = (1 - waveIdx * 0.25) * 0.45 * currentPulse;
          const amp = 30 + waveIdx * 15 + currentPulse * 45;
          const noiseFreq = 0.02 + waveIdx * 0.01;

          ctx.strokeStyle = waveIdx % 2 === 0 ? getColorHex(alphaScale) : getSecondaryColorHex(alphaScale);
          ctx.beginPath();

          for (let i = 0; i < pointCount; i++) {
            const x = i * spacing;
            
            // Interaction factor
            let dFactor = 1;
            if (mouseX > 0) {
              const dx = mouseX - x;
              const dist = Math.abs(dx);
              if (dist < 150) {
                dFactor = 1.0 + (1 - dist / 150) * 1.5;
              }
            }

            const phase = localFrame * 0.04 * (speedMult || 1) + (waveIdx * Math.PI / 2);
            // Dynamic sine calculations
            const localY = waveY + Math.sin(i * noiseFreq * Math.PI + phase) * amp * dFactor * Math.sin(localFrame * 0.01);
            
            if (i === 0) {
              ctx.moveTo(x, localY);
            } else {
              ctx.lineTo(x, localY);
            }
          }
          ctx.stroke();
        }

        // Floating particle specks
        ctx.fillStyle = getColorHex(0.4);
        for (let i = 0; i < 15; i++) {
          const px = (Math.sin(localFrame * 0.005 + i) * 0.5 + 0.5) * canvas.width;
          const py = (Math.cos(localFrame * 0.01 + i * 2) * 0.4 + 0.5) * canvas.height;
          ctx.beginPath();
          ctx.arc(px, py, Math.max(1, (i % 3) * currentPulse), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Call recursively
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [activePreset, speed, feedback, useCamera, isPlaying, bpm, accentColor, pixelDensity]);

  return (
    <div
      id="visualizer-container"
      ref={containerRef}
      className="relative w-full h-[450px] bg-[#111111] border border-[#2D2D2D] rounded-none overflow-hidden flex flex-col group select-none shadow-xl"
    >
      {/* Hidden elements for tracking video data and scaling */}
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        muted
        width={80}
        height={60}
      />
      <canvas
        ref={offscreenCanvasRef}
        width={80}
        height={60}
        className="hidden"
      />

      {/* Primary canvas graphics layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair block"
      />

      {/* Grid background overlay for visual modular synths vibes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-zinc-950/80 pointer-events-none" />

      {/* Visualizer header display metrics */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none select-none">
        <div className="flex items-center gap-2 bg-[#121213]/95 border border-[#2D2D30] px-2.5 py-1 rounded-none text-[10px] font-mono tracking-widest text-zinc-400 uppercase backdrop-blur-md">
          <span className="flex h-1.5 w-1.5 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`} style={{ backgroundColor: getColorHex(1) }}></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: getColorHex(1) }}></span>
          </span>
          LIVE_SIGNAL: FEEDBACK_{activePreset.toUpperCase()}
        </div>

        <div className="flex items-center gap-2 bg-[#121213]/95 border border-[#2D2D30] px-2.5 py-1 rounded-none text-[10px] font-mono text-zinc-400 backdrop-blur-md">
          <Music className="w-3 h-3 text-zinc-500 animate-pulse" />
          <span>{bpm} BPM</span>
          <div
            className="w-1.5 h-1.5 rounded-full transition-transform duration-75"
            style={{
              backgroundColor: getColorHex(1),
              transform: `scale(${pulseScale})`,
              boxShadow: pulseScale > 1.1 ? `0 0 8px ${getColorHex(0.8)}` : "none"
            }}
          />
        </div>
      </div>

      {/* Quick interactive control panel overlays */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 items-center justify-between bg-[#121213]/95 border border-[#2A2A2D] p-2 rounded-none backdrop-blur-md transition-opacity duration-300 opacity-90 sm:opacity-75 sm:group-hover:opacity-100">
        
        {/* Preset Selector */}
        <div className="flex items-center gap-1.5">
          <button
            id="vj-preset-nodes"
            onClick={() => setActivePreset("nodes")}
            className={`px-2.5 py-1.5 rounded-none text-xs font-mono transition-all flex items-center gap-1 ${
              activePreset === "nodes"
                ? "bg-zinc-800 text-white border border-zinc-700 font-medium"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            style={activePreset === "nodes" ? { borderLeft: `2px solid ${getColorHex()}` } : {}}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nodos Joaquín</span>
            <span className="sm:hidden">Nodos</span>
          </button>

          <button
            id="vj-preset-glitch"
            onClick={() => setActivePreset("glitch")}
            className={`px-2.5 py-1.5 rounded-none text-xs font-mono transition-all flex items-center gap-1 ${
              activePreset === "glitch"
                ? "bg-zinc-800 text-white border border-zinc-700 font-medium"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            style={activePreset === "glitch" ? { borderLeft: `2px solid ${getColorHex()}` } : {}}
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Matriz Dúo</span>
            <span className="sm:hidden">Matriz</span>
          </button>

          <button
            id="vj-preset-waves"
            onClick={() => setActivePreset("waves")}
            className={`px-2.5 py-1.5 rounded-none text-xs font-mono transition-all flex items-center gap-1 ${
              activePreset === "waves"
                ? "bg-zinc-800 text-white border border-zinc-700 font-medium"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            style={activePreset === "waves" ? { borderLeft: `2px solid ${getColorHex()}` } : {}}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Oscilar Sofía</span>
            <span className="sm:hidden">Oscilar</span>
          </button>
        </div>

        {/* Sliders and Toggles */}
        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
          {/* Speed slider */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Frec</span>
            <input
              id="vj-speed-input"
              type="range"
              min="5"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-16 sm:w-20 accent-zinc-300 cursor-pointer h-1 rounded-none"
            />
          </div>

          {/* Feedback loop toggler */}
          <button
            id="vj-toggle-feedback"
            onClick={() => setFeedback(!feedback)}
            className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-zinc-100 transition-colors"
            title="Activa o desactiva la estela/persistencia analogica de los fotogramas"
          >
            <span>Estela:</span>
            {feedback ? (
              <ToggleRight className="w-5 h-5 text-zinc-200" style={{ color: getColorHex(1) }} />
            ) : (
              <ToggleLeft className="w-5 h-5 text-zinc-600" />
            )}
          </button>

          {/* Camera integration toggler */}
          <button
            id="vj-toggle-camera"
            onClick={() => setUseCamera(!useCamera)}
            className={`px-2 py-1 rounded-none text-[10px] font-mono flex items-center gap-1 transition-all ${
              useCamera
                ? "bg-zinc-800 border border-zinc-700 text-white"
                : "bg-zinc-950/40 border border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
            title="Usa tu cámara web para procesar feeds de video interactivos con la señal de dibujo"
            style={useCamera ? { boxShadow: `0 0 10px ${getColorHex(0.3)}` } : {}}
          >
            <Camera className="w-3.5 h-3.5" style={useCamera ? { color: getColorHex(1) } : {}} />
            <span>Interactive Cam</span>
          </button>

          {/* Pause / Play button */}
          <button
            id="vj-toggle-play"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-none bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="absolute right-3 top-14 flex flex-col gap-1.5 pointer-events-auto">
        <div className="flex items-center gap-1 bg-[#121213]/95 border border-[#2D2D30] px-2 py-1 rounded-none text-[10px] font-mono text-zinc-400 backdrop-blur-md">
          <span className="text-zinc-500">BPM</span>
          <input
            id="vj-bpm-slider"
            type="range"
            min="60"
            max="180"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-14 accent-zinc-300 cursor-pointer h-1 rounded-none"
          />
        </div>
        
        {useCamera && (
          <div className="flex items-center gap-1 bg-[#121213]/95 border border-[#2D2D30] px-2 py-1 rounded-none text-[10px] font-mono text-zinc-400 backdrop-blur-md">
            <span className="text-zinc-500">Resol:</span>
            <select
              id="vj-resolution-select"
              value={pixelDensity}
              onChange={(e) => setPixelDensity(Number(e.target.value))}
              className="bg-transparent border-0 py-0.5 text-[10px] focus:ring-0 text-zinc-300 font-mono outline-none cursor-pointer"
            >
              <option value="6" className="bg-[#121213]">Pixelada</option>
              <option value="12" className="bg-[#121213]">Estándar</option>
              <option value="18" className="bg-[#121213]">Detallada</option>
              <option value="26" className="bg-[#121213]">Fina</option>
            </select>
          </div>
        )}
      </div>

      {/* User advice to move mouse */}
      <div className="absolute bottom-16 right-3 pointer-events-none select-none text-[9px] font-mono text-zinc-500 opacity-60 animate-pulse uppercase tracking-wider hidden sm:block">
        Mover mouse sobre el canvas para modular
      </div>
    </div>
  );
}
