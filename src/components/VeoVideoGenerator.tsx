import React, { useState, useEffect } from 'react';
import {
  Video,
  Sparkles,
  Play,
  Download,
  AlertCircle,
  RefreshCw,
  Sliders,
  Check,
} from 'lucide-react';
import { soundEngine } from '../utils/audio.ts';

export const VeoVideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState(
    'Cinematic high-tech game launcher outro with glowing blue neon cyber logo, floating particles, hyper-speed camera zoom 60fps'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presetPrompts = [
    {
      title: 'Outro Cinematic Cyber',
      text: 'Cinematic high-tech game launcher outro with glowing blue neon cyber logo, floating particles, hyper-speed camera zoom, 4K quality',
    },
    {
      title: 'Portal de Lansare Gaming',
      text: 'Epic gaming launch sequence, futuristic tech portal opening with electric blue plasma arcs and metallic surface reflections',
    },
    {
      title: 'Emblemă 3D Interconectată',
      text: 'Interlocking cyan geometric prism emblem floating in deep space with particle vortex and laser grid scanning, 16:9',
    },
  ];

  const reassuringMessages = [
    'Inițializare model Veo 3 (veo-3.1-fast-generate-preview)...',
    'Generare traiectorie cameră și iluminare volumetrică...',
    'Sinteză fluidă a particulelor și dinamică cinematografică...',
    'Randare finală și optimizare cadre video...',
    'Descărcare stream video generat...',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    soundEngine.playClick();
    setIsGenerating(true);
    setError(null);
    setGeneratedVideoUrl(null);
    setStatusMessage(reassuringMessages[0]);

    try {
      // Step 1: Start video generation
      const startRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
        }),
      });

      const startData = await startRes.json();
      if (!startRes.ok || !startData.success) {
        throw new Error(startData.error || 'Generarea video a eșuat la inițializare.');
      }

      const operationName = startData.operationName;
      let msgIndex = 1;
      const intervalMsg = setInterval(() => {
        setStatusMessage(reassuringMessages[msgIndex % reassuringMessages.length]);
        msgIndex++;
      }, 7000);

      // Step 2: Poll operation status
      let isDone = false;
      let pollCount = 0;
      const maxPolls = 60; // Up to 5 minutes

      while (!isDone && pollCount < maxPolls) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        pollCount++;

        const statusRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });

        const statusData = await statusRes.json();
        if (statusData.error) {
          clearInterval(intervalMsg);
          throw new Error(statusData.error.message || 'Eroare raportată de operația Veo.');
        }

        if (statusData.done) {
          isDone = true;
          clearInterval(intervalMsg);
          break;
        }
      }

      if (!isDone) {
        clearInterval(intervalMsg);
        throw new Error('Timpul de generare a expirat. Vă rugăm să încercați din nou.');
      }

      setStatusMessage('Descărcare video generat...');

      // Step 3: Download video stream
      const downloadRes = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName }),
      });

      if (!downloadRes.ok) {
        throw new Error('Eroare la descărcarea fișierului video generat.');
      }

      const blob = await downloadRes.blob();
      const videoObjectUrl = URL.createObjectURL(blob);
      setGeneratedVideoUrl(videoObjectUrl);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'A apărut o problemă în timpul generării cu Veo 3.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-[#090e1a] p-6 text-slate-100 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Veo 3 Video Generator</h2>
              <span className="px-2 py-0.5 rounded text-[11px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                veo-3.1-fast-generate-preview
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Generează clipuri outro cinematice și fundaluri de tranziție fotorealiste
            </p>
          </div>
        </div>

        {/* Aspect Ratio Selector: 16:9 or 9:16 */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => {
              soundEngine.playClick();
              setAspectRatio('16:9');
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              aspectRatio === '16:9'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>16:9</span>
            <span className="text-[10px] opacity-75">(Landscape)</span>
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setAspectRatio('9:16');
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              aspectRatio === '9:16'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>9:16</span>
            <span className="text-[10px] opacity-75">(Portrait)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left: Prompt & Preset Controls */}
        <div className="md:col-span-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Preseturi Tranziții Gaming GGPatcher
            </label>
            <div className="flex flex-col gap-2">
              {presetPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundEngine.playClick();
                    setPrompt(p.text);
                  }}
                  className="p-2.5 text-left rounded-lg bg-[#0d1424] hover:bg-[#111a30] border border-slate-800 hover:border-cyan-500/40 transition group"
                >
                  <div className="text-xs font-semibold text-cyan-300 group-hover:text-cyan-200">
                    {p.title}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-mono">
                    {p.text}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Prompt Video Text-to-Video
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Descrie videoclipul cinematic pe care dorești să-l generezi..."
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed font-mono"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generare în curs cu Veo 3...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generează Video ({aspectRatio})</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Video Output or Loading State */}
        <div className="md:col-span-6 bg-[#0d1424] rounded-xl border border-slate-800 p-4 flex flex-col justify-center items-center min-h-[300px] relative overflow-hidden">
          {isGenerating ? (
            <div className="text-center p-6 space-y-4 max-w-sm">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping" />
                <div className="w-16 h-16 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Veo 3 Lucrează</h4>
                <p className="text-xs text-cyan-300 font-mono animate-pulse">{statusMessage}</p>
                <p className="text-[10px] text-slate-500 mt-2">
                  Generarea video de înaltă fidelitate poate dura câteva secunde.
                </p>
              </div>
            </div>
          ) : generatedVideoUrl ? (
            <div className="w-full flex flex-col items-center gap-3">
              <div
                className={`w-full rounded-lg overflow-hidden bg-black border border-cyan-500/40 shadow-xl ${
                  aspectRatio === '9:16' ? 'max-w-[240px] aspect-[9/16]' : 'aspect-video'
                }`}
              >
                <video
                  src={generatedVideoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-3 mt-2">
                <a
                  href={generatedVideoUrl}
                  download={`veo-video-${Date.now()}.mp4`}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descarcă Video MP4</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-slate-500">
              <Video className="w-12 h-12 mx-auto mb-3 opacity-30 text-cyan-400" />
              <div className="text-sm font-semibold text-slate-400">Niciun video generat încă</div>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Alege un preset sau scrie un prompt pentru a genera videoclipuri cu modelul Veo 3.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
