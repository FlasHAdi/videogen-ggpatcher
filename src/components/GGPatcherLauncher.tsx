import React, { useState } from 'react';
import {
  Check,
  Server,
  Wrench,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  DownloadCloud,
  Terminal,
} from 'lucide-react';
import { soundEngine } from '../utils/audio.ts';

interface GGPatcherLauncherProps {
  onPlayNow: () => void;
  isTransitioning?: boolean;
}

export const GGPatcherLauncher: React.FC<GGPatcherLauncherProps> = ({
  onPlayNow,
  isTransitioning = false,
}) => {
  const [clickRipple, setClickRipple] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(4);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    setClickRipple(true);
    setTimeout(() => {
      setClickRipple(false);
    }, 600);
    onPlayNow();
  };

  const handleRepair = () => {
    soundEngine.playClick();
    setIsRepairing(true);
    setTimeout(() => {
      setIsRepairing(false);
    }, 1500);
  };

  const steps = [
    { id: 1, label: 'Check' },
    { id: 2, label: 'Patch' },
    { id: 3, label: 'Verify' },
    { id: 4, label: 'Ready' },
  ];

  return (
    <div
      className={`relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-slate-700/80 bg-[#090d16] text-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.85)] transition-all duration-700 ${
        isTransitioning
          ? 'scale-105 opacity-0 blur-md pointer-events-none'
          : 'scale-100 opacity-100 blur-0'
      }`}
    >
      {/* Top Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1322] border-b border-slate-800 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950/70 border border-blue-500/40 text-xs font-semibold text-blue-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>GGPATCHER</span>
            <span className="text-slate-400 font-normal">v0.8.3</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-300 ml-2">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium text-slate-400">PATCHER SERVER:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              Online
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4 text-xs">
          {/* Language selector */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700 text-slate-300 cursor-pointer hover:bg-slate-700 transition">
            <span className="text-sm">🇬🇧</span>
            <span className="font-mono text-xs">EN</span>
          </div>

          {/* Window Buttons */}
          <div className="flex items-center gap-2 text-slate-400">
            <button
              onClick={() => soundEngine.playClick()}
              className="w-5 h-5 flex items-center justify-center hover:text-white hover:bg-slate-800 rounded transition"
              title="Minimize"
            >
              —
            </button>
            <button
              onClick={() => soundEngine.playClick()}
              className="w-5 h-5 flex items-center justify-center hover:text-white hover:bg-slate-800 rounded transition"
              title="Maximize"
            >
              □
            </button>
            <button
              onClick={() => soundEngine.playClick()}
              className="w-5 h-5 flex items-center justify-center hover:text-red-400 hover:bg-red-950/40 rounded transition text-sm"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="relative min-h-[380px] p-6 bg-gradient-to-br from-[#0c1220] via-[#080d18] to-[#05080f] overflow-hidden flex flex-col justify-between">
        {/* Dragon / Fantasy Crest Watermark & Cyber Circuit Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Ambient Dark Dragon Glow */}
        <div className="absolute -left-20 top-10 w-96 h-96 rounded-full bg-red-900/10 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-blue-900/15 blur-3xl pointer-events-none" />

        {/* Middle Section: Left Brand & Right Status Card */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Launcher Splash Brand */}
          <div className="md:col-span-5 flex flex-col justify-center items-start pl-2">
            <div className="relative">
              <h1 className="text-4xl font-extrabold tracking-wider text-slate-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                GGPATCHER
              </h1>
              <p className="text-xs text-slate-400 tracking-wide mt-1 font-mono">
                No surveyed — Click back soon!
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-950/60 border border-blue-500/30 text-[11px] text-blue-300 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Anti-Cheat Active
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/50 border border-slate-700 text-[11px] text-slate-300 font-mono">
                <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" />
                Fast CDN Mirror #1
              </span>
            </div>
          </div>

          {/* Right: Patcher Status Card */}
          <div className="md:col-span-7 bg-[#0b101c]/90 rounded-lg border border-slate-800/90 p-4 shadow-xl backdrop-blur-sm">
            {/* Step Indicators */}
            <div className="mb-4">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                PATCHER STATUS
              </div>
              <div className="flex items-center justify-between relative px-2">
                {/* Connecting Line */}
                <div className="absolute top-4 left-6 right-6 h-[2px] bg-slate-800 z-0" />
                <div className="absolute top-4 left-6 right-6 h-[2px] bg-emerald-500/80 z-0" />

                {steps.map((step) => {
                  const isDone = activeStep >= step.id;
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center group">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.7)]'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <span className="text-[11px] font-medium text-slate-300 mt-1">
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* File Telemetry / Logs */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="space-y-1 text-slate-400 text-[11px] font-mono leading-tight">
                <div className="text-slate-300 font-semibold">Files:</div>
                <div className="truncate text-slate-400">Doulata Patch has bonger updated</div>
                <div className="truncate text-slate-400">Download troh has completed. (103)</div>
                <div className="truncate text-slate-400">You heed makhas conlat.</div>
                <div className="truncate text-slate-400">Time left: has eerioo...</div>
              </div>

              <div className="space-y-1 text-right text-[11px] font-mono">
                <div className="text-slate-400">
                  Files: <span className="text-cyan-300 font-bold">26.58 / 50 MB</span>
                </div>
                <div className="text-slate-400">
                  Download: <span className="text-emerald-400 font-bold">14.2 MB/s</span>
                </div>
                <div className="text-slate-400">
                  Speed: <span className="text-slate-300">0 B/s (Done)</span>
                </div>
                <div className="text-slate-400">
                  Time left: <span className="text-slate-400">0s</span>
                </div>
              </div>
            </div>

            {/* Update Log Terminal Box */}
            <div className="mt-3 bg-[#060a12] rounded border border-slate-800/80 p-2 font-mono text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Terminal className="w-3 h-3 text-cyan-400" />
                <span className="uppercase text-[9px] tracking-wider">UPDATE LOG</span>
              </div>
              <div className="text-emerald-400/90 truncate">
                [03:54:40] patch cepad in (8-Rla(s)... OK
              </div>
              <div className="text-cyan-400/90 truncate">
                [03:54:41] files verified integrity 100%
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Status, Progress, Repair & PLAY NOW */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status & Progress */}
          <div className="w-full md:w-1/2 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                Already up to date
              </span>
              <span className="font-mono text-[10px] text-slate-400">GAME: 1.0.6</span>
            </div>

            {/* Sleek Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
              <div className="h-full w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.8)] relative">
                <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]" />
              </div>
            </div>
          </div>

          {/* Action Buttons: Repair & PLAY NOW */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={handleRepair}
              disabled={isRepairing}
              onMouseEnter={() => soundEngine.playHover()}
              className="px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Wrench className={`w-3.5 h-3.5 ${isRepairing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isRepairing ? 'Repairing...' : 'Repair'}</span>
            </button>

            {/* PLAY NOW button with authentic glowing ripple from video */}
            <div className="relative">
              {clickRipple && (
                <div className="absolute inset-0 -m-3 rounded-xl border-2 border-cyan-300/80 animate-ping pointer-events-none" />
              )}
              <button
                onClick={handlePlayClick}
                onMouseEnter={() => soundEngine.playHover()}
                className="relative px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:via-cyan-500 hover:to-blue-600 text-white font-extrabold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(37,99,235,0.7)] hover:shadow-[0_0_35px_rgba(56,189,248,0.9)] active:scale-95 transition-all flex items-center gap-2 group cursor-pointer border border-blue-400/40"
              >
                <Play className="w-4 h-4 fill-white group-hover:translate-x-0.5 transition-transform" />
                <span>PLAY NOW</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
