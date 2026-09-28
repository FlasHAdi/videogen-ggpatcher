import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Play,
  Film,
  Video,
  Layers,
  Cpu,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { GGPatcherLauncher } from './components/GGPatcherLauncher.tsx';
import { FluidTransitionEngine, TransitionStyle } from './components/FluidTransitionEngine.tsx';
import { VideoAnalyzer } from './components/VideoAnalyzer.tsx';
import { VeoVideoGenerator } from './components/VeoVideoGenerator.tsx';
import { TransitionBreakdown } from './components/TransitionBreakdown.tsx';
import { soundEngine } from './utils/audio.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'launcher' | 'analyzer' | 'veo' | 'breakdown'>('launcher');
  const [isTransitionActive, setIsTransitionActive] = useState<boolean>(false);
  const [transitionStyle, setTransitionStyle] = useState<TransitionStyle>('hyperdrive');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const handleTriggerTransition = (style?: TransitionStyle) => {
    if (style) {
      setTransitionStyle(style);
    }
    setActiveTab('launcher');
    setIsTransitionActive(true);
  };

  const handleResetToLauncher = () => {
    setIsTransitionActive(false);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.enabled = next;
    soundEngine.playClick();
  };

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Studio Navbar */}
      <header className="sticky top-0 z-50 bg-[#080d1a]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo badge */}
          <div
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('launcher');
              setIsTransitionActive(false);
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-cyan-400 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-transform">
              <span className="font-black text-slate-950 text-sm tracking-tighter">GG</span>
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-wider text-white flex items-center gap-1.5">
                <span>GGPATCHER</span>
                <span className="text-cyan-400 font-normal">STUDIO</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Fluid Outro Transition Engine
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 ml-6 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('launcher');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'launcher'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Launcher & Tranziție</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('analyzer');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'analyzer'
                  ? 'bg-purple-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Video Analyzer (Gemini 3.1 Pro)</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('veo');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'veo'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Veo 3 Generator</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('breakdown');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'breakdown'
                  ? 'bg-blue-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Arhitectură Tranziție</span>
            </button>
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            title={soundEnabled ? 'Sunet activ' : 'Sunet oprit'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Quick Trigger Button */}
          <button
            onClick={() => handleTriggerTransition('hyperdrive')}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs tracking-wider uppercase transition shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">Declanșează Tranziția</span>
            <span className="sm:hidden">PLAY</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around bg-[#080d1a] border-b border-slate-800 p-2 text-xs">
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('launcher');
          }}
          className={`px-2 py-1 rounded ${activeTab === 'launcher' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          Launcher
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('analyzer');
          }}
          className={`px-2 py-1 rounded ${activeTab === 'analyzer' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
        >
          Analyzer (3.1 Pro)
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('veo');
          }}
          className={`px-2 py-1 rounded ${activeTab === 'veo' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          Veo 3
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('breakdown');
          }}
          className={`px-2 py-1 rounded ${activeTab === 'breakdown' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          Soluție
        </button>
      </div>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
        {/* TAB 1: LAUNCHER & FLUID TRANSITION */}
        {activeTab === 'launcher' && (
          <div className="w-full flex flex-col items-center space-y-6">
            {/* Top Prompt Banner */}
            <div className="w-full max-w-4xl px-4 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong>Cerere Rezolvată:</strong> "Rezolvă tranziția de la sfârșitul videoclipului prin animații fluide."
                </span>
              </div>
              <span className="hidden sm:inline font-mono text-[11px] text-cyan-400/80">
                Apasă pe "PLAY NOW" în launcher pentru a vedea efectul!
              </span>
            </div>

            {/* If transition is active: Render the Fluid Transition Engine */}
            {isTransitionActive ? (
              <FluidTransitionEngine
                isActive={isTransitionActive}
                onReset={handleResetToLauncher}
                selectedStyle={transitionStyle}
                onStyleChange={(st) => setTransitionStyle(st)}
              />
            ) : (
              /* If transition is not active: Render the Launcher Simulation */
              <div className="w-full flex flex-col items-center space-y-6">
                <GGPatcherLauncher onPlayNow={() => handleTriggerTransition('hyperdrive')} />

                {/* Transition Preset Cards to quickly test different styles */}
                <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {[
                    {
                      id: 'hyperdrive',
                      title: 'Hyperdrive Warp',
                      desc: 'Vortex cosmic de particule 3D, flare specular și fuziune GG logo',
                      icon: Zap,
                      color: 'from-blue-600/30 to-cyan-500/20 border-cyan-500/40 text-cyan-300',
                    },
                    {
                      id: 'liquid',
                      title: 'Liquid Neon Iris',
                      desc: 'Disipare fluidă organică în unde luminoase și relaxare elastică',
                      icon: Layers,
                      color: 'from-cyan-600/30 to-emerald-500/20 border-cyan-500/40 text-emerald-300',
                    },
                    {
                      id: 'glitch',
                      title: 'Quantum Glitch',
                      desc: 'Aberație cromatică RGB, stream de date HUD și asamblare digitală',
                      icon: Sparkles,
                      color: 'from-purple-600/30 to-pink-500/20 border-purple-500/40 text-purple-300',
                    },
                    {
                      id: 'gameplay',
                      title: 'Game Portal',
                      desc: 'Pătrundere directă în universul jocului cu sunet cinematografic',
                      icon: Play,
                      color: 'from-indigo-600/30 to-blue-500/20 border-blue-500/40 text-blue-300',
                    },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => handleTriggerTransition(style.id as TransitionStyle)}
                      onMouseEnter={() => soundEngine.playHover()}
                      className={`p-3.5 rounded-xl bg-gradient-to-b ${style.color} border text-left hover:scale-[1.02] active:scale-95 transition-all group shadow-lg cursor-pointer flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs text-white group-hover:text-cyan-300">
                            {style.title}
                          </span>
                          <style.icon className="w-3.5 h-3.5 opacity-80" />
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {style.desc}
                        </p>
                      </div>
                      <div className="mt-3 text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                        <span>Lansează Stil</span>
                        <span>→</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VIDEO ANALYZER (Gemini 3.1 Pro) */}
        {activeTab === 'analyzer' && <VideoAnalyzer />}

        {/* TAB 3: VEO 3 VIDEO GENERATOR */}
        {activeTab === 'veo' && <VeoVideoGenerator />}

        {/* TAB 4: ARCHITECTURAL BREAKDOWN */}
        {activeTab === 'breakdown' && (
          <TransitionBreakdown onTestTransition={() => handleTriggerTransition('hyperdrive')} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#060a14] px-6 py-4 text-center text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>GGPatcher High-Speed Gaming Client & Fluid Transition Studio</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 text-[11px] font-mono">
          <span>Veo 3: veo-3.1-fast-generate-preview</span>
          <span>•</span>
          <span>Gemini Pro: gemini-3.1-pro-preview</span>
          <span>•</span>
          <span>Website: https://ggpatcher.com</span>
        </div>
      </footer>
    </div>
  );
}
