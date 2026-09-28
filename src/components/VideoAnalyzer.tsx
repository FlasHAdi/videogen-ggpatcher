import React, { useState } from 'react';
import {
  FileVideo,
  Sparkles,
  Upload,
  Cpu,
  CheckCircle,
  AlertTriangle,
  Play,
  Film,
  TrendingUp,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { soundEngine } from '../utils/audio.ts';

export const VideoAnalyzer: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [selectedVideoSource, setSelectedVideoSource] = useState<'ggpatcher' | 'custom'>('ggpatcher');
  const [customFile, setCustomFile] = useState<{ name: string; base64: string; mimeType: string } | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setError('Dimensiunea fișierului depășește 25MB. Vă rugăm să alegeți un clip mai scurt.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setCustomFile({
        name: file.name,
        base64,
        mimeType: file.type || 'video/mp4',
      });
      setSelectedVideoSource('custom');
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    soundEngine.playClick();
    setAnalyzing(true);
    setError(null);

    try {
      const payload: any = {
        videoPreset: selectedVideoSource,
        userPrompt: userPrompt.trim() || undefined,
      };

      if (selectedVideoSource === 'custom' && customFile) {
        payload.videoBase64 = customFile.base64;
        payload.mimeType = customFile.mimeType;
      }

      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Analiza videoclipului nu a putut fi finalizată.');
      }

      setAnalysisResult(data.analysis);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Eroare la analiza videoclipului cu Gemini 3.1 Pro.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-[#090e1a] p-6 text-slate-100 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Video Understanding & Transition Analyzer</h2>
              <span className="px-2 py-0.5 rounded text-[11px] bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                gemini-3.1-pro-preview
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Analiză avansată a videoclipului GGPatcher, detectare tăieturi și optimizare tranziții fluide
            </p>
          </div>
        </div>

        {/* Source selector */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => {
              soundEngine.playClick();
              setSelectedVideoSource('ggpatcher');
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              selectedVideoSource === 'ggpatcher'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Clip GGPatcher (00:00 - 00:11)
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setSelectedVideoSource('custom');
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              selectedVideoSource === 'custom'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Încarcă Video Propriu
          </button>
        </div>
      </div>

      {/* Preset Card / Upload */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left: Video Source Preview */}
        <div className="md:col-span-5 bg-[#0d1424] rounded-xl border border-slate-800/80 p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-purple-400" />
              Sursă Video Selectată
            </div>

            {selectedVideoSource === 'ggpatcher' ? (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-black aspect-video flex items-center justify-center group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  <div className="text-center z-20 p-4">
                    <div className="text-sm font-bold text-cyan-300">GGPatcher Promo Clip</div>
                    <div className="text-[11px] text-slate-400 mt-1 font-mono">00:00 - 00:11 | 1080p</div>
                  </div>
                  <div className="absolute bottom-2 left-2 z-20 text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Video Original cu tăietură la 00:08
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1 font-mono text-[11px] bg-slate-900/60 p-2.5 rounded border border-slate-800">
                  <div className="text-purple-300 font-semibold">• 00:00 - 00:07: Prezentare Launcher</div>
                  <div className="text-cyan-300 font-semibold">• 00:08: Clic pe "PLAY NOW" (Riplu)</div>
                  <div className="text-amber-300 font-semibold">• 00:09: Tăietură dură către ecran final</div>
                  <div className="text-slate-400">• 00:10 - 00:11: Logo GG Patcher & URL</div>
                </div>
              </div>
            ) : (
              <div>
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-xl cursor-pointer bg-slate-900/40 transition">
                  <Upload className="w-8 h-8 text-purple-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-200">
                    {customFile ? customFile.name : 'Alege un fișier video (MP4/WebM)'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">Maxim 25MB</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.4)] disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Se analizează cu Gemini 3.1 Pro...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Rulează Analiza Detaliată</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Custom Question / Prompt and Analysis Report */}
        <div className="md:col-span-7 bg-[#0d1424] rounded-xl border border-slate-800/80 p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Instrucțiuni sau întrebări specifice (opțional)
              </label>
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Ex: Cum îmbunătățim tranziția de la 00:08? Ce curbe de easing sunt ideale?"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Analysis Output Section */}
            <div className="rounded-lg bg-[#070b14] border border-slate-800 p-4 min-h-[220px] max-h-[340px] overflow-y-auto text-xs text-slate-300 leading-relaxed font-sans">
              {analyzing ? (
                <div className="h-full flex flex-col items-center justify-center py-10 space-y-3">
                  <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                  <div className="text-xs text-purple-300 font-mono animate-pulse">
                    Gemini 3.1 Pro procesează cadrele video și dinamica mișcării...
                  </div>
                </div>
              ) : analysisResult ? (
                <div className="prose prose-invert prose-xs max-w-none space-y-2 whitespace-pre-wrap">
                  {analysisResult}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-10 text-slate-500 text-center">
                  <Film className="w-8 h-8 mb-2 opacity-40 text-purple-400" />
                  <p className="text-xs text-slate-400">
                    Apasă pe "Rulează Analiza Detaliată" pentru raportul Gemini 3.1 Pro asupra tăieturii de la 00:08 și soluțiilor de tranziție fluidă.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
              <div className="text-slate-400">Tăietură Originală</div>
              <div className="text-amber-400 font-bold font-mono">Abruptă (00:08)</div>
            </div>
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
              <div className="text-slate-400">Recomandare</div>
              <div className="text-cyan-400 font-bold font-mono">Hyperdrive Warp</div>
            </div>
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
              <div className="text-slate-400">Fluiditate Țintă</div>
              <div className="text-emerald-400 font-bold font-mono">60 FPS Ease-Out</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
