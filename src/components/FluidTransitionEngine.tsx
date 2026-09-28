import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Zap,
  Layers,
  Sliders,
  Volume2,
  VolumeX,
  RotateCcw,
  Eye,
  CheckCircle2,
  Play,
  Pause,
  MonitorPlay,
  ArrowRight,
} from 'lucide-react';
import { ParticleCanvas } from './ParticleCanvas.tsx';
import { GGPatcherLogo } from './GGPatcherLogo.tsx';
import { soundEngine } from '../utils/audio.ts';

export type TransitionStyle = 'hyperdrive' | 'liquid' | 'glitch' | 'gameplay';

interface FluidTransitionEngineProps {
  isActive: boolean;
  onReset: () => void;
  selectedStyle?: TransitionStyle;
  onStyleChange?: (style: TransitionStyle) => void;
}

export const FluidTransitionEngine: React.FC<FluidTransitionEngineProps> = ({
  isActive,
  onReset,
  selectedStyle = 'hyperdrive',
  onStyleChange,
}) => {
  // Animation progress: 0 to 1
  const [progress, setProgress] = useState(0);
  const [isManualScrubbing, setIsManualScrubbing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(1.8); // seconds
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameraShake, setCameraShake] = useState(true);
  const [showOriginalComparison, setShowOriginalComparison] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Trigger animation when isActive changes to true
  useEffect(() => {
    if (isActive) {
      setProgress(0);
      setIsPlaying(true);
      startTimeRef.current = performance.now();

      if (soundEnabled && !showOriginalComparison) {
        soundEngine.playWarpTransition();
      }
    } else {
      setIsPlaying(false);
      setProgress(0);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
  }, [isActive, showOriginalComparison]);

  // Main animation ticker
  useEffect(() => {
    if (!isPlaying || isManualScrubbing) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const newProgress = Math.min(1, elapsed / duration);
      setProgress(newProgress);

      if (newProgress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isManualScrubbing, duration]);

  const handleReplay = () => {
    soundEngine.playClick();
    setProgress(0);
    setIsPlaying(true);
    startTimeRef.current = performance.now();
    if (soundEnabled && !showOriginalComparison) {
      soundEngine.playWarpTransition();
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.enabled = next;
    soundEngine.playClick();
  };

  const handleScrub = (val: number) => {
    setIsPlaying(false);
    setIsManualScrubbing(true);
    setProgress(val);
  };

  // Easing function: Smooth cubic-bezier(0.16, 1, 0.3, 1) - Quintic ease out
  const easeProgress = (t: number) => 1 - Math.pow(1 - t, 4);

  // Calculate phase values
  // Phase 1: Shockwave & Launcher Disintegration (0.0 -> 0.35)
  // Phase 2: Warp Particle Tunnel (0.25 -> 0.7)
  // Phase 3: Logo Fusion & Specular Flare (0.6 -> 0.95)
  // Phase 4: URL Card Reveal (0.85 -> 1.0)

  const shockwaveScale = Math.min(3, progress * 4);
  const shockwaveOpacity = Math.max(0, 1 - progress * 2.5);

  const launcherZoom = 1 + progress * 1.8;
  const launcherOpacity = Math.max(0, 1 - progress * 2.2);

  const warpTunnelOpacity = progress > 0.1 && progress < 0.85
    ? Math.min(1, Math.sin((progress - 0.1) / 0.75 * Math.PI))
    : 0;

  const logoScale = progress < 0.4 ? 0.3 : Math.min(1, 0.3 + (progress - 0.4) * 1.4);
  const logoOpacity = progress < 0.4 ? 0 : Math.min(1, (progress - 0.4) * 2.8);

  const flareOpacity = progress >= 0.55 && progress <= 0.85
    ? Math.sin((progress - 0.55) / 0.3 * Math.PI)
    : 0;

  const urlOpacity = progress < 0.75 ? 0 : Math.min(1, (progress - 0.75) * 4);
  const urlTranslateY = progress < 0.75 ? 20 : (1 - (progress - 0.75) * 4) * 20;

  // Shake effect around logo impact (progress ~ 0.6)
  const isShaking = cameraShake && progress > 0.52 && progress < 0.7;
  const shakeX = isShaking ? (Math.random() - 0.5) * 10 : 0;
  const shakeY = isShaking ? (Math.random() - 0.5) * 10 : 0;

  if (!isActive) return null;

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-cyan-500/40 bg-[#050913] text-slate-100 shadow-[0_25px_80px_rgba(0,180,255,0.25)] flex flex-col">
      {/* Top Header / Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3 bg-[#0a1122]/95 border-b border-cyan-900/40 z-30 backdrop-blur-md gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Tranziție Fluidă Rezolvată</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                60 FPS SMOOTH
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Transformă tăietura abruptă de la 00:08 într-un salt cinematic continuu
            </p>
          </div>
        </div>

        {/* Transition Style Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          {[
            { id: 'hyperdrive', label: 'Hyperdrive Warp', icon: Zap },
            { id: 'liquid', label: 'Liquid Iris', icon: Layers },
            { id: 'glitch', label: 'Quantum Glitch', icon: Sliders },
            { id: 'gameplay', label: 'Game Portal', icon: MonitorPlay },
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => {
                soundEngine.playClick();
                onStyleChange?.(style.id as TransitionStyle);
                handleReplay();
              }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                selectedStyle === style.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <style.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{style.label}</span>
            </button>
          ))}
        </div>

        {/* Comparison Toggle */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setShowOriginalComparison(!showOriginalComparison);
            handleReplay();
          }}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
            showOriginalComparison
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showOriginalComparison ? 'Original (Tăietură Abruptă)' : 'Compară cu Originalul'}</span>
        </button>
      </div>

      {/* Main Viewport Stage */}
      <div
        className="relative w-full h-[450px] sm:h-[500px] overflow-hidden bg-black flex items-center justify-center select-none"
        style={{
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* Background Cyber Grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        {/* COMPARISON: If "Original Video (Abrupt Cut)" is toggled */}
        {showOriginalComparison ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {progress < 0.5 ? (
              // Original Launcher Window before hard cut
              <div className="p-8 text-center bg-[#090d16] border border-slate-800 rounded-xl max-w-md w-full shadow-2xl">
                <div className="text-slate-400 text-xs mb-3 font-mono">00:08 - PLAY NOW Apăsat</div>
                <div className="text-2xl font-bold text-white mb-2">GGPATCHER</div>
                <div className="w-full h-2 rounded bg-cyan-600 mb-6" />
                <div className="px-6 py-3 rounded-lg bg-blue-600 text-white font-bold inline-block animate-pulse">
                  PLAY NOW
                </div>
                <div className="mt-4 text-xs text-amber-400 font-mono">
                  [Tăietură abruptă fără anticipare, fără mișcare camerei]
                </div>
              </div>
            ) : (
              // Sudden hard cut to logo with zero easing
              <div className="flex flex-col items-center justify-center">
                <GGPatcherLogo size="lg" animated={false} />
                <div className="mt-4 px-3 py-1 rounded bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono">
                  ⚠️ Tăietură dură (Hard cut la 00:09) - Lipsă continuitate vizuală
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ENHANCED FLUID TRANSITION ENGINE */
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Particle Canvas: idle, warp tunnel, or converging vortex */}
            <ParticleCanvas
              mode={progress < 0.25 ? 'idle' : progress < 0.8 ? 'warp' : 'converge'}
              density={selectedStyle === 'hyperdrive' ? 180 : 120}
              speedMultiplier={progress < 0.7 ? 2.5 : 0.8}
            />

            {/* Shockwave Rings on PLAY NOW press */}
            {progress < 0.5 && (
              <div
                className="absolute w-40 h-40 rounded-full border-4 border-cyan-400/80 pointer-events-none"
                style={{
                  transform: `scale(${shockwaveScale})`,
                  opacity: shockwaveOpacity,
                }}
              />
            )}

            {/* Style-specific effects: Chromatic Aberration in Glitch Mode */}
            {selectedStyle === 'glitch' && progress > 0.2 && progress < 0.6 && (
              <div className="absolute inset-0 mix-blend-screen opacity-70 pointer-events-none">
                <div className="absolute inset-0 bg-red-500/10 translate-x-2" />
                <div className="absolute inset-0 bg-cyan-500/10 -translate-x-2" />
              </div>
            )}

            {/* Specular Flare Explosion at Logo Fusion Point */}
            <div
              className="absolute w-72 h-72 rounded-full pointer-events-none transition-opacity duration-150"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(56,189,248,0.8) 35%, rgba(37,99,235,0.2) 70%, transparent 100%)',
                opacity: flareOpacity,
                transform: `scale(${1 + flareOpacity * 1.5})`,
              }}
            />

            {/* Fading Launcher Ghost / Disintegration Wireframe */}
            {launcherOpacity > 0.02 && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all"
                style={{
                  opacity: launcherOpacity,
                  transform: `scale(${launcherZoom})`,
                  filter: `blur(${progress * 15}px)`,
                }}
              >
                <div className="w-[500px] h-[300px] rounded-xl border border-cyan-400/40 bg-blue-950/20 backdrop-blur-sm p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-xs text-cyan-300 font-mono">
                    <span>GGPATCHER v0.8.3</span>
                    <span className="text-emerald-400">READY</span>
                  </div>
                  <div className="text-center text-3xl font-black text-cyan-200 tracking-wider">
                    LAUNCHING...
                  </div>
                  <div className="h-1.5 w-full bg-cyan-500 rounded" />
                </div>
              </div>
            )}

            {/* Assembling GG Patcher Logo with Fluid Ease */}
            <div
              className="relative z-20 flex flex-col items-center justify-center transition-transform"
              style={{
                opacity: logoOpacity,
                transform: `scale(${easeProgress(logoScale)})`,
              }}
            >
              <GGPatcherLogo
                size="hero"
                showUrl={false}
                animated={progress > 0.85}
              />

              {/* Holographic Glowing URL Badge with Smooth Slide-in */}
              <div
                className="transition-all duration-500"
                style={{
                  opacity: urlOpacity,
                  transform: `translateY(${urlTranslateY}px)`,
                }}
              >
                <div className="relative mt-8 group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 rounded-full blur-sm opacity-80 group-hover:opacity-100 transition duration-700 animate-pulse" />
                  <div className="relative px-8 py-3 rounded-full bg-[#0a1120]/95 border border-cyan-400/70 shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-md flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-lg sm:text-xl font-mono text-cyan-200 font-bold tracking-wider">
                      https://ggpatcher.com
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase Indicator Badge in Viewport */}
        <div className="absolute bottom-4 left-4 z-20 px-3 py-1 rounded-md bg-black/70 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>
            {progress < 0.25
              ? 'Faza 1: Anticipare & Impuls Șoc'
              : progress < 0.6
              ? 'Faza 2: Tunel Viteză Warp & Dezasamblare'
              : progress < 0.85
              ? 'Faza 3: Fuziune Emblemă & Specular Flare'
              : 'Faza 4: Card Holografic & Link GG Patcher'}
          </span>
          <span className="text-cyan-400 font-bold">{(progress * duration).toFixed(2)}s</span>
        </div>
      </div>

      {/* Bottom Timeline Scrubber & Studio Controls */}
      <div className="p-4 bg-[#0a101f] border-t border-slate-800 flex flex-col gap-3">
        {/* Timeline Scrubber Slider */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (progress >= 1) {
                handleReplay();
              } else {
                setIsPlaying(!isPlaying);
                setIsManualScrubbing(false);
              }
            }}
            className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-[0_0_10px_rgba(6,182,212,0.5)] active:scale-95"
            title={isPlaying ? 'Pauză' : 'Redă'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
          </button>

          <button
            onClick={handleReplay}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            title="Reia de la început"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Scrubber Track */}
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.005"
              value={progress}
              onChange={(e) => handleScrub(parseFloat(e.target.value))}
              onMouseUp={() => setIsManualScrubbing(false)}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            {/* Phase markers */}
            <div className="absolute left-[25%] top-4 text-[9px] font-mono text-slate-500">Warp</div>
            <div className="absolute left-[60%] top-4 text-[9px] font-mono text-slate-500">Logo</div>
            <div className="absolute left-[85%] top-4 text-[9px] font-mono text-slate-500">URL</div>
          </div>

          <div className="text-xs font-mono text-cyan-300 w-16 text-right">
            {(progress * 100).toFixed(0)}%
          </div>
        </div>

        {/* Secondary Parameters Bar */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-4">
            {/* Duration selector */}
            <div className="flex items-center gap-1.5">
              <span>Durată:</span>
              {[1.2, 1.8, 2.5].map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    soundEngine.playClick();
                    setDuration(d);
                    handleReplay();
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                    duration === d
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {d}s
                </button>
              ))}
            </div>

            {/* Sound toggle */}
            <button
              onClick={handleToggleSound}
              className="flex items-center gap-1 hover:text-white transition"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>{soundEnabled ? 'Sunet Sintetizator ON' : 'Sunet Muted'}</span>
            </button>

            {/* Camera Shake toggle */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setCameraShake(!cameraShake);
              }}
              className="flex items-center gap-1 hover:text-white transition"
            >
              <Zap className={`w-3.5 h-3.5 ${cameraShake ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>Camera Shake {cameraShake ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Close / Return to Launcher Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onReset();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span>Înapoi la Launcher</span>
          </button>
        </div>
      </div>
    </div>
  );
};
