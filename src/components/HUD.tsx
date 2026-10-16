/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { FastTravelPoint, MovementMode, TimeOfDay, CrowdMember } from '../types.ts';
import { RomeSimulation } from '../scene/RomeSimulation.ts';
import {
  Volume2,
  VolumeX,
  Compass,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Eye,
  Footprints,
  Plane,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  MessageSquare
} from 'lucide-react';

interface HUDProps {
  simulation: RomeSimulation | null;
  fps: number;
  coords: { x: number; z: number };
  activeLandmark: { zone: string; title: string; desc: string };
  nearbyCitizen: CrowdMember | null;
}

export const HUD: React.FC<HUDProps> = ({
  simulation,
  fps,
  coords,
  activeLandmark,
  nearbyCitizen
}) => {
  const [activeTravelId, setActiveTravelId] = useState(0);
  const [activeTimeOfDay, setActiveTimeOfDay] = useState<TimeOfDay>('golden');
  const [movementMode, setMovementMode] = useState<MovementMode>('walk');
  const [isMuted, setIsMuted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);

  const minimapCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keyboard shortcut listener for 'H' to toggle dock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyH') {
        setIsCollapsed((prev) => !prev);
      }
      if (e.code === 'KeyM') {
        setShowMinimap((prev) => !prev);
      }
      if (e.code === 'Digit1') setActiveTravelId(0);
      if (e.code === 'Digit2') setActiveTravelId(1);
      if (e.code === 'Digit3') setActiveTravelId(2);
      if (e.code === 'Digit4') setActiveTravelId(3);
      if (e.code === 'Digit5') setActiveTravelId(4);
      if (e.code === 'Digit6') setActiveTravelId(5);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync state with simulation
  useEffect(() => {
    if (!simulation) return;
    setActiveTimeOfDay(simulation.getActiveTimeOfDay());
    setMovementMode(simulation.getMovementMode());
  }, [simulation]);

  // Mini-Map rendering loop
  useEffect(() => {
    if (!simulation || !minimapCanvasRef.current || !showMinimap) return;
    const canvas = minimapCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const renderMap = () => {
      const W = canvas.width;
      const H = canvas.height;

      // Coordinate converter: World X [-185..205], World Z [-125..125] -> Canvas [W x H]
      const worldToMap = (wx: number, wz: number) => ({
        x: ((wx + 185) / 390) * W,
        y: ((wz + 125) / 250) * H
      });

      // Background
      ctx.fillStyle = '#14110e';
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.08)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 24) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += 24) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }

      // Tiber River
      ctx.strokeStyle = '#2d6c7a';
      ctx.lineWidth = 9;
      ctx.beginPath();
      const r1 = worldToMap(-180, -120);
      const r2 = worldToMap(-135, -15);
      const r3 = worldToMap(-160, 120);
      ctx.moveTo(r1.x, r1.y);
      ctx.quadraticCurveTo(r2.x, r2.y, r3.x, r3.y);
      ctx.stroke();

      // Via Sacra & Diagonal Road
      ctx.strokeStyle = '#6e6559';
      ctx.lineWidth = 4.5;
      const vs1 = worldToMap(-65, 0);
      const vs2 = worldToMap(85, 0);
      ctx.beginPath(); ctx.moveTo(vs1.x, vs1.y); ctx.lineTo(vs2.x, vs2.y); ctx.stroke();

      const dr1 = worldToMap(-48, 0);
      const dr2 = worldToMap(-70, -65);
      ctx.beginPath(); ctx.moveTo(dr1.x, dr1.y); ctx.lineTo(dr2.x, dr2.y); ctx.stroke();

      // Pantheon Rotunda
      const panM = worldToMap(-115, -65);
      ctx.fillStyle = '#b87a56';
      ctx.strokeStyle = '#e0c080';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(panM.x, panM.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Obelisk fountain dot
      const fntM = worldToMap(-68, -65);
      ctx.fillStyle = '#48b2cc';
      ctx.beginPath(); ctx.arc(fntM.x, fntM.y, 3.2, 0, Math.PI * 2); ctx.fill();

      // Colosseum Ellipse
      const colM = worldToMap(135, 0);
      ctx.fillStyle = '#c8b08a';
      ctx.strokeStyle = '#f3e5ab';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(colM.x, colM.y, 25, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner Arena Sand
      ctx.fillStyle = '#dfb874';
      ctx.beginPath();
      ctx.ellipse(colM.x, colM.y, 14, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Citizen dots (animated crowd on map!)
      if (simulation.crowdSystem) {
        const citizens = simulation.crowdSystem.getMembers();
        ctx.fillStyle = '#ff6b6b';
        citizens.forEach((c) => {
          const cp = worldToMap(c.group.position.x, c.group.position.z);
          ctx.beginPath();
          ctx.arc(cp.x, cp.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Player Position & FOV Cone
      const pPos = simulation.camera.position;
      const pM = worldToMap(pPos.x, pPos.z);
      const camRot = simulation.camera.rotation;
      const lookAng = -camRot.y - Math.PI / 2;

      ctx.save();
      ctx.translate(pM.x, pM.y);
      ctx.rotate(lookAng);

      const coneGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 24);
      coneGrad.addColorStop(0, 'rgba(255, 215, 70, 0.55)');
      coneGrad.addColorStop(1, 'rgba(255, 215, 70, 0.0)');
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 24, -0.52, 0.52);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffd700';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 3.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(renderMap);
    };

    renderMap();
    return () => cancelAnimationFrame(animId);
  }, [simulation, showMinimap]);

  const handleMinimapClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!simulation || !minimapCanvasRef.current) return;
    const canvas = minimapCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const wx = (mx / canvas.width) * 390 - 185;
    const wz = (my / canvas.height) * 250 - 125;
    simulation.teleportToCoords(wx, wz);
  };

  const handleTravelClick = (id: number) => {
    setActiveTravelId(id);
    if (simulation) {
      simulation.teleportTo(id);
      setActiveTimeOfDay(simulation.getActiveTimeOfDay());
      setMovementMode(simulation.getMovementMode());
    }
  };

  const handleTimePresetClick = (preset: TimeOfDay) => {
    setActiveTimeOfDay(preset);
    if (simulation) {
      simulation.setLightingPreset(preset);
    }
  };

  const handleModeToggle = () => {
    if (!simulation) return;
    const newMode = simulation.toggleMovementMode();
    setMovementMode(newMode);
  };

  const handleMuteToggle = () => {
    if (!simulation) return;
    const muted = simulation.soundscape.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 sm:p-4 font-sans text-stone-100">
      {/* TOP BAR: Mini-Map (Left) & Dynamic Landmark Header (Center) */}
      <div className="flex items-start justify-between gap-3 w-full">
        {/* Left: Forma Urbis Romae Mini-Map */}
        <div className="flex flex-col items-start gap-1">
          {showMinimap && (
            <div className="hud-glass rounded-xl p-2.5 pointer-events-auto flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-1 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="font-roman text-[10px] font-bold text-amber-200 tracking-wider">
                    FORMA URBIS
                  </span>
                </div>
                <span className="text-[10px] font-mono text-stone-300">
                  X:{coords.x} Z:{coords.z}
                </span>
              </div>
              <div className="relative rounded-lg overflow-hidden border border-amber-500/30 bg-stone-950/90 shadow-inner">
                <canvas
                  ref={minimapCanvasRef}
                  width="180"
                  height="135"
                  className="block cursor-pointer"
                  onClick={handleMinimapClick}
                  title="Click anywhere to teleport"
                />
                <div className="absolute bottom-1 right-1 text-[8.5px] text-amber-200/80 bg-black/70 px-1.5 py-0.5 rounded pointer-events-none">
                  Click map to teleport
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowMinimap(!showMinimap)}
            className="hud-glass hud-btn rounded-lg px-2.5 py-1 text-[10px] pointer-events-auto flex items-center gap-1.5 text-stone-300 hover:text-amber-200"
          >
            <Compass className="w-3 h-3 text-amber-300" />
            <span>{showMinimap ? 'Hide Map (M)' : 'Show Map (M)'}</span>
          </button>
        </div>

        {/* Center: Dynamic Historical Landmark Card */}
        <div className="hud-glass rounded-xl px-4 py-2.5 max-w-lg pointer-events-auto text-center mx-auto transition-all duration-300">
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-red-950/80 border border-amber-500/30 text-amber-300 font-semibold font-roman">
              {activeLandmark.zone}
            </span>
            <span className="text-[10px] text-amber-200/80 font-mono">
              {fps} FPS
            </span>
          </div>
          <h2 className="font-roman text-base sm:text-lg font-bold text-amber-200 tracking-wide">
            {activeLandmark.title}
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed mt-0.5 line-clamp-2">
            {activeLandmark.desc}
          </p>
        </div>

        {/* Right: Quick Toggles (Audio, Help, Zen Mode) */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={handleMuteToggle}
            className={`hud-glass hud-btn rounded-xl p-2.5 text-stone-200 hover:text-amber-200 ${
              isMuted ? 'text-stone-500' : 'text-amber-300'
            }`}
            title={isMuted ? 'Unmute Ambient Roman Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsHelpOpen(true)}
            className="hud-glass hud-btn rounded-xl p-2.5 text-amber-200"
            title="Controls & History Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* NEARBY CITIZEN DIALOGUE CARD (Appears when near an NPC) */}
      {nearbyCitizen && (
        <div className="self-center max-w-md w-full pointer-events-auto transition-all duration-300 mb-2">
          <div className="hud-glass rounded-xl p-3 border-l-4 border-l-amber-400 bg-stone-950/85">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-roman text-sm font-bold text-amber-200">
                  {nearbyCitizen.info.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300">
                  {nearbyCitizen.info.role}
                </span>
              </div>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                {nearbyCitizen.info.socialClass}
              </span>
            </div>
            <p className="text-xs italic text-amber-100/90 leading-snug">
              {nearbyCitizen.info.quote}
            </p>
            <p className="text-[10.5px] text-stone-400 mt-1">
              {nearbyCitizen.info.historicalNote}
            </p>
          </div>
        </div>
      )}

      {/* BOTTOM CONTROL DOCK (Collapsible, Ergonomic Zero-Occlusion Dock) */}
      <div className="flex flex-col items-center gap-1.5 w-full pointer-events-none">
        {/* Collapse / Expand Tab */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hud-glass hud-btn rounded-full px-3 py-1 text-[11px] font-roman font-semibold text-amber-200 pointer-events-auto flex items-center gap-1.5 transition-transform"
          title="Toggle Dock (H Key)"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-amber-300" />
              <span>Show Controls (H)</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-amber-300" />
              <span>Zen View / Hide Controls (H)</span>
            </>
          )}
        </button>

        {/* Main Dock Container */}
        <div
          className={`transition-all duration-300 ease-in-out w-full max-w-5xl pointer-events-auto flex flex-col gap-2 ${
            isCollapsed
              ? 'translate-y-32 opacity-0 pointer-events-none h-0'
              : 'translate-y-0 opacity-100'
          }`}
        >
          {/* Controls Bar Pill */}
          <div className="hud-glass rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-2.5">
            {/* Time of Day Presets */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-amber-500/20">
              <span className="text-[10px] font-roman uppercase tracking-wider text-amber-300/80 px-1.5 font-semibold hidden sm:inline">
                SOL
              </span>
              <button
                onClick={() => handleTimePresetClick('golden')}
                className={`hud-btn rounded-lg px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 ${
                  activeTimeOfDay === 'golden' ? 'active' : ''
                }`}
                title="Golden Hour Sunset Glow"
              >
                <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Golden</span>
              </button>
              <button
                onClick={() => handleTimePresetClick('noon')}
                className={`hud-btn rounded-lg px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 ${
                  activeTimeOfDay === 'noon' ? 'active' : ''
                }`}
                title="Calibrated High Noon"
              >
                <Sun className="w-3.5 h-3.5 text-sky-300" />
                <span className="hidden md:inline">Noon</span>
              </button>
              <button
                onClick={() => handleTimePresetClick('sunset')}
                className={`hud-btn rounded-lg px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 ${
                  activeTimeOfDay === 'sunset' ? 'active' : ''
                }`}
                title="Dusk / Twilight"
              >
                <Sunset className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden md:inline">Sunset</span>
              </button>
              <button
                onClick={() => handleTimePresetClick('night')}
                className={`hud-btn rounded-lg px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 ${
                  activeTimeOfDay === 'night' ? 'active' : ''
                }`}
                title="Torchlit Night"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Night</span>
              </button>
            </div>

            {/* Movement Mode Toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleModeToggle}
                className="hud-btn rounded-xl px-3 py-1.5 text-xs font-medium flex items-center gap-2 border border-amber-500/30"
              >
                {movementMode === 'walk' ? (
                  <>
                    <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Walk Mode (F)</span>
                  </>
                ) : (
                  <>
                    <Plane className="w-3.5 h-3.5 text-amber-400" />
                    <span>Drone Fly (F)</span>
                  </>
                )}
              </button>
            </div>

            {/* Controls Prompt */}
            <div className="hidden lg:flex items-center gap-3 text-[11px] text-stone-300">
              <span>
                <strong className="text-amber-300">Drag</strong> Look
              </span>
              <span>
                <span className="kbd-badge">WASD</span> Walk
              </span>
              <span>
                <span className="kbd-badge">Shift</span> Sprint
              </span>
              <span>
                <span className="kbd-badge">Space</span> Jump
              </span>
              <span>
                <span className="kbd-badge">Q</span>/<span className="kbd-badge">E</span> Altitude
              </span>
            </div>
          </div>

          {/* Fast Travel Viewpoints */}
          <div className="hud-glass rounded-2xl p-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden md:flex items-center px-2.5 border-r border-amber-500/30">
                <span className="font-roman text-[10px] font-bold text-amber-300 tracking-wider whitespace-nowrap">
                  FAST TRAVEL
                </span>
              </div>

              {RomeSimulation.FAST_TRAVEL_POINTS.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => handleTravelClick(pt.id)}
                  className={`hud-btn rounded-xl px-3 py-1.5 text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeTravelId === pt.id ? 'active' : ''
                  }`}
                >
                  <span className="kbd-badge">{pt.key}</span>
                  <div className="text-left">
                    <div className="font-semibold text-amber-100 leading-tight">
                      {pt.name}
                    </div>
                    <div className="text-[9.5px] text-stone-400">
                      {pt.subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ARCHITECTURAL & CONTROLS GUIDE MODAL */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md pointer-events-auto">
          <div className="hud-glass rounded-2xl max-w-xl w-full p-6 border border-amber-400/50 text-stone-200">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-4">
              <h3 className="font-roman text-xl font-bold text-amber-200">
                ROMA AETERNA (117 AD) — GUIDE
              </h3>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="hud-btn rounded-lg px-2.5 py-1 text-xs font-bold text-amber-300"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
              <p className="text-amber-100/90">
                Explore Rome during the pinnacle of its Imperial glory under Emperor Trajan
                (Anno Domini CXVII). Every monument, column, and citizen has been recreated
                with historical fidelity and PBR surface rendering.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/40 p-3 rounded-xl border border-amber-500/20">
                <div>
                  <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                    <Footprints className="w-3.5 h-3.5" /> Navigation Controls
                  </div>
                  <ul className="space-y-1 text-stone-300">
                    <li>• <strong>Click + Drag:</strong> Look 360°</li>
                    <li>• <strong>WASD / Arrows:</strong> Walk / Fly</li>
                    <li>• <strong>Shift:</strong> Sprint</li>
                    <li>• <strong>Space:</strong> Jump (Walk) / Ascend (Fly)</li>
                    <li>• <strong>F Key:</strong> Toggle Ground Walk vs. Drone Fly</li>
                    <li>• <strong>1–6 Keys:</strong> Fast Travel hotkeys</li>
                    <li>• <strong>H Key:</strong> Toggle Zen View (Hide HUD)</li>
                    <li>• <strong>M Key:</strong> Toggle Mini-Map radar</li>
                  </ul>
                </div>

                <div>
                  <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Living Population
                  </div>
                  <ul className="space-y-1 text-stone-300">
                    <li>• <strong>Senators:</strong> Toga Praetexta with purple border and parchment scrolls</li>
                    <li>• <strong>Legionaries:</strong> Lorica Segmentata, Scutum shield, Gallic helmet &amp; Pilum</li>
                    <li>• <strong>Centurions:</strong> Transverse crimson crest, scale armor &amp; vine staff</li>
                    <li>• <strong>Matronas:</strong> Pleated stola gowns and coiled Flavian coiffures</li>
                    <li>• <strong>Merchants &amp; Laborers:</strong> Market stalls with Falernian wine &amp; oil</li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-500/20">
                <div className="font-semibold text-amber-200 mb-1">Key Monuments &amp; Features</div>
                <p className="text-stone-300">
                  • <strong>Flavian Amphitheatre:</strong> 48-arch elliptical tiers, linen Velarium canopy sails, and the Emperor’s Pulvinar box.<br />
                  • <strong>Pantheon:</strong> Octastyle Egyptian granite portico with inscribed Agrippa frieze and 43.3m dome with open oculus.<br />
                  • <strong>Via Sacra &amp; Forum:</strong> Temple of Saturn, Temple of Vespasian, Arch of Septimius Severus with gilded quadriga.<br />
                  • <strong>Aqua Claudia:</strong> Double-tiered stone arches supplying imperial fountains and baths.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
