/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { RomeSimulation } from './scene/RomeSimulation.ts';
import { HUD } from './components/HUD.tsx';
import { CrowdMember } from './types.ts';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [simulation, setSimulation] = useState<RomeSimulation | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Carving Carrara marble & generating travertine ashlar...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fps, setFps] = useState(60);
  const [coords, setCoords] = useState<{ x: number; z: number }>({ x: -48, z: -1 });
  const [activeLandmark, setActiveLandmark] = useState({
    zone: 'REGIO IV • VIA SACRA',
    title: 'Via Sacra & Forum Romanum',
    desc: 'The sacred ceremonial avenue of Imperial Rome leading past Corinthian temples and triumphal arches to the Colosseum.'
  });
  const [nearbyCitizen, setNearbyCitizen] = useState<CrowdMember | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let sim: RomeSimulation | null = null;

    try {
      setLoadingText('Initializing WebGL ACESFilmic PBR renderer & room environment...');
      sim = new RomeSimulation(containerRef.current);
      setSimulation(sim);

      sim.onFpsUpdate = (currentFps) => setFps(currentFps);
      sim.onCoordsUpdate = (pos) => setCoords(pos);
      sim.onLandmarkUpdate = (zone, title, desc) => {
        setActiveLandmark({ zone, title, desc });
      };
      sim.onCitizenNearby = (citizen) => setNearbyCitizen(citizen);

      setLoadingText('Assembling Flavian Amphitheatre, Forum Temples & Pantheon...');
      sim.start();

      const timer = setTimeout(() => {
        setLoadingText('Entering Rome at its Imperial Peak (117 AD)...');
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }, 500);

      return () => {
        clearTimeout(timer);
        if (sim) {
          sim.dispose();
        }
        setSimulation(null);
      };
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to initialize WebGL 3D context.');
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0c0a08] select-none">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        id="webgl-container"
        className="fixed inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
      />

      {/* Crosshair Reticle */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10 opacity-35">
        <div className="absolute top-[7px] left-0.5 right-0.5 h-[2px] bg-[#f3e5ab] shadow-[0_0_3px_rgba(0,0,0,0.8)]" />
        <div className="absolute left-[7px] top-0.5 bottom-0.5 w-[2px] bg-[#f3e5ab] shadow-[0_0_3px_rgba(0,0,0,0.8)]" />
      </div>

      {/* Interactive HUD Layer */}
      {simulation && (
        <HUD
          simulation={simulation}
          fps={fps}
          coords={coords}
          activeLandmark={activeLandmark}
          nearbyCitizen={nearbyCitizen}
        />
      )}

      {/* Error Fallback Banner */}
      {errorMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="hud-glass rounded-2xl max-w-md w-full p-6 text-center border border-red-500/40">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h2 className="font-roman text-xl font-bold text-amber-200 mb-2">
              WebGL Initialization Issue
            </h2>
            <p className="text-xs text-stone-300 mb-4">{errorMsg}</p>
            <button
              onClick={() => window.location.reload()}
              className="hud-btn rounded-xl px-4 py-2 text-xs font-semibold text-amber-200 inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Simulation</span>
            </button>
          </div>
        </div>
      )}

      {/* Initial Loading Overlay */}
      {isLoading && !errorMsg && (
        <div className="fixed inset-0 z-50 bg-[radial-gradient(circle_at_center,#1d1610_0%,#090705_100%)] flex flex-col items-center justify-center p-6 transition-opacity duration-700">
          <div className="text-center max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-950/40 text-amber-300 text-xs tracking-widest uppercase mb-4 font-roman">
              SENATVS POPVLVSQVE ROMANVS
            </div>
            <h1 className="font-roman text-4xl sm:text-5xl font-bold text-amber-200 tracking-wider mb-2">
              ROMA AETERNA
            </h1>
            <p className="font-roman text-xs sm:text-sm text-amber-400/90 tracking-widest uppercase mb-6">
              Imperial Peak • Anno Domini CXVII (117 AD)
            </p>

            <div className="w-72 sm:w-80 h-2 bg-stone-900 rounded-full overflow-hidden border border-amber-500/40 mx-auto mb-3">
              <div className="h-full bg-gradient-to-r from-red-800 via-amber-500 to-amber-200 animate-pulse w-full" />
            </div>

            <p className="text-xs text-stone-400 tracking-wide">
              {loadingText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
