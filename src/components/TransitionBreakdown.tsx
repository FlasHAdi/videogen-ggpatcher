import React from 'react';
import {
  AlertOctagon,
  Sparkles,
  ArrowRight,
  Zap,
  Activity,
  CheckCircle2,
  Sliders,
  Eye,
  Layers,
} from 'lucide-react';
import { soundEngine } from '../utils/audio.ts';

export const TransitionBreakdown: React.FC<{ onTestTransition: () => void }> = ({
  onTestTransition,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-[#090e1a] p-6 text-slate-100 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">
              Cum am rezolvat tranziția de la sfârșitul videoclipului
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
              SOLUȚIE ARHITECTURALĂ
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comparație detaliată între tăietura abruptă originală (00:08) și sistemul de animații fluide
          </p>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            onTestTransition();
          }}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-[0_0_15px_rgba(6,182,212,0.5)] active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
          <span>Testează Tranziția în Timp Real</span>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* The Problem in the Original Video */}
        <div className="p-5 rounded-xl bg-red-950/20 border border-red-900/40 space-y-4">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>Problema din videoclipul original (la 00:08)</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-red-950 border border-red-600/40 text-red-400 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-white">Tăietură instantanee (Hard Cut):</strong> În clipul
                original, la secunda 00:08, utilizatorul dă clic pe "PLAY NOW", iar în următorul
                cadru ecranul devine negru cu logo-ul static GG Patcher. Nu există continuitate
                spațială.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-red-950 border border-red-600/40 text-red-400 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-white">Lipsă de anticipare (Anticipation):</strong> Ochiul
                privitorului nu primește niciun indiciu că urmează o schimbare majoră de scenă,
                rezultând într-un salt vizual deranjant (jarring cut).
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-red-950 border border-red-600/40 text-red-400 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-white">Absența efectelor de viteză și profunzime:</strong>{' '}
                Logo-ul final și link-ul <code>https://ggpatcher.com</code> apar fără impuls cinetic,
                fără particule fluide și fără unire organică.
              </div>
            </div>
          </div>
        </div>

        {/* The Solution implemented */}
        <div className="p-5 rounded-xl bg-cyan-950/20 border border-cyan-900/40 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Soluția implementată: Motorul de Tranziție Fluidă</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-white">Unde de șoc & scalare anticipatorie:</strong> În clipa
                apăsării, se generează o undă circulară cyan și un micro-zoom pe fereastră,
                ancorând privirea către centru.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-white">Tunel de particule Hyperdrive (60 FPS):</strong>{' '}
                Launcher-ul se disipă fluid în perspectivă 3D printr-un vortex cosmic de viteză,
                creând iluzia că utilizatorul este propulsat în universul jocului.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-white">Fuziune geometrică & Specular Flare:</strong>{' '}
                Prismele 3D ale logo-ului GG converg din margini cu curbă quintică de decelerare,
                urmate de apariția holografică a cardului URL și a scanării laser.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Infographic */}
      <div className="mt-6 pt-5 border-t border-slate-800">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Cronologia Cadrelor Animate (Timeline de Tranziție)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-[10px] font-mono text-cyan-400 mb-1">0.00s - 0.35s</div>
            <div className="font-semibold text-white">1. Impuls Șoc</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Riplu energetic la clic, pregătire optică a privitorului
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-[10px] font-mono text-cyan-400 mb-1">0.35s - 0.85s</div>
            <div className="font-semibold text-white">2. Disipare & Warp</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Fereastra se desface în particule de viteză și adâncime
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-[10px] font-mono text-cyan-400 mb-1">0.85s - 1.40s</div>
            <div className="font-semibold text-white">3. Asamblare Emblemă</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Fuziunea prismelor GG cu flare luminos și sub-bass audio
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-[10px] font-mono text-cyan-400 mb-1">1.40s - 1.80s+</div>
            <div className="font-semibold text-white">4. Card Holografic</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Slide-in tipografic "Patcher" și iluminare URL ggpatcher.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
