import React, { useState } from 'react';
import { User, Page } from '../types/orca';
import { FLEET_VESSELS } from '../data/orcaConstants';
import { OrcaLogo, IsroBadge, IncoisBadge, CoastGuardBadge } from './BrandingLogos';

interface AdminDashboardProps {
  currentUser: User | null;
  onNavigate: (page: Page) => void;
  onOpenAuth: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth
}) => {
  const [fleet, setFleet] = useState(FLEET_VESSELS);
  const [maxWaveThreshold, setMaxWaveThreshold] = useState(3.5);
  const [imblBufferThreshold, setImblBufferThreshold] = useState(5.0);
  const [autoNavicBroadcast, setAutoNavicBroadcast] = useState(true);
  const [alertSaved, setAlertSaved] = useState(false);
  const [hitlActionTaken, setHitlActionTaken] = useState<string | null>(null);

  const handleSavePolicy = () => {
    setAlertSaved(true);
    setTimeout(() => setAlertSaved(false), 3000);
  };

  const handleClearanceDecision = (decision: 'GRANTED' | 'REJECTED') => {
    setHitlActionTaken(decision);
    if (decision === 'GRANTED') {
      setFleet(prev => prev.map(v => v.id === 'IND-TN-11-TR-9043' ? { ...v, status: 'CLEARED' as const } : v));
    }
  };

  return (
    <div className="min-h-screen bg-marine-950 text-white font-sans pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-marine-900 via-marine-800 to-marine-900 border-b border-marine-700/80 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <OrcaLogo size={44} />
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="font-display font-bold text-xl md:text-2xl text-white tracking-wide">
                  MISSION COMMAND & FLEET TELEMETRY
                </h1>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-500/40">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-xs text-cyan-400/90 font-mono mt-0.5">
                ISRO Space Applications Centre • INCOIS Joint Ocean Surveillance • Indian Coast Guard MRCC 1554
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-marine-950/80 border border-marine-700/80 rounded-xl px-3 py-2 flex items-center space-x-3 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-gray-300">GSAT-7R / NAVIC-2A: <span className="text-emerald-400 font-semibold">SYNCHRONIZED</span></span>
            </div>
            {currentUser ? (
              <div 
                onClick={onOpenAuth}
                className="bg-marine-800 hover:bg-marine-700 border border-marine-600 rounded-xl px-3 py-2 flex items-center space-x-2 cursor-pointer transition"
                title="Click to manage credentials"
              >
                <span className="text-lg">{currentUser.avatar || '👤'}</span>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase">{currentUser.role}</div>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-mono font-medium transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 space-y-6">
        {/* KPI Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-marine-900/70 border border-marine-800/80 rounded-2xl p-4">
            <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Active Monitored Fleet</div>
            <div className="text-2xl md:text-3xl font-display font-bold text-cyan-400 mt-1">8 Vessels</div>
            <div className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center space-x-1">
              <span>● 7 Cleared</span>
              <span className="text-amber-400">● 1 Review</span>
            </div>
          </div>

          <div className="bg-marine-900/70 border border-marine-800/80 rounded-2xl p-4">
            <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Satellite Feeds Ingested</div>
            <div className="text-2xl md:text-3xl font-display font-bold text-white mt-1">4 Sensors</div>
            <div className="text-[11px] font-mono text-emerald-400 mt-1">
              Oceansat-3 + INSAT-3DR 100%
            </div>
          </div>

          <div className="bg-marine-900/70 border border-marine-800/80 rounded-2xl p-4">
            <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Inference Throughput</div>
            <div className="text-2xl md:text-3xl font-display font-bold text-purple-400 mt-1">1,280 Zones/hr</div>
            <div className="text-[11px] font-mono text-gray-400 mt-1">
              1 km Spatial Resolution
            </div>
          </div>

          <div className="bg-marine-900/70 border border-marine-800/80 rounded-2xl p-4">
            <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">HITL Safety Interventions</div>
            <div className="text-2xl md:text-3xl font-display font-bold text-amber-400 mt-1">1 Action Pending</div>
            <div className="text-[11px] font-mono text-amber-300 mt-1">
              Palk Strait Boundary Guard
            </div>
          </div>
        </div>

        {/* Fleet Tracking Table */}
        <div className="bg-marine-900/70 border border-marine-800/80 rounded-2xl p-5 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-white flex items-center space-x-2">
                <span>🛰️ Real-Time Vessel Fleet Telemetry</span>
                <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
                  AIS + NavIC Broadcast
                </span>
              </h2>
              <p className="text-xs text-gray-400">Live position tracking against real-time INCOIS wave fields and sovereign IMBL bounds</p>
            </div>
            <button
              onClick={() => onNavigate('gis')}
              className="px-3.5 py-1.5 bg-marine-800 hover:bg-marine-700 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-mono transition"
            >
              Open Interactive GIS Map →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-marine-950/60 text-xs font-mono text-gray-400 uppercase border-b border-marine-800">
                <tr>
                  <th className="py-3 px-4">Vessel ID & Name</th>
                  <th className="py-3 px-4">Class & Skipper</th>
                  <th className="py-3 px-4">Coordinates</th>
                  <th className="py-3 px-4">Wave Condition</th>
                  <th className="py-3 px-4">IMBL Clearance</th>
                  <th className="py-3 px-4">Safety Status</th>
                  <th className="py-3 px-4 text-right">Telemetry Ping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-marine-800/50 font-sans">
                {fleet.map((v) => (
                  <tr key={v.id} className="hover:bg-marine-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{v.name}</div>
                      <div className="text-xs font-mono text-cyan-400">{v.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-gray-200">{v.type}</div>
                      <div className="text-xs text-gray-400">{v.captain}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-300">
                      {v.lat.toFixed(2)}°N, {v.lon.toFixed(2)}°E
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs text-white">{v.wave}</span>
                      <span className="text-[11px] text-gray-400 font-mono"> / {v.waveLimit}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-gray-200">
                      {v.imblClearance}
                    </td>
                    <td className="py-3.5 px-4">
                      {v.status === 'CLEARED' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          ✓ CLEARED
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                          ⚠ BUFFER WARNING
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-gray-400">
                      {v.lastPing}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dual Grid: Sensor Pipelines & HITL Approval Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sensor Health */}
          <div className="bg-marine-900/70 border border-marine-800/80 rounded-2xl p-5 space-y-4">
            <h2 className="font-display text-lg font-bold text-white flex items-center space-x-2">
              <span>🛰️ Earth Observation & Ocean Ingestion Pipelines</span>
            </h2>

            <div className="space-y-3 font-sans">
              <div className="p-3.5 bg-marine-950/60 rounded-xl border border-marine-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white text-sm">Oceansat-3 (OCM-3)</span>
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 font-mono">1 km Gridded</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Chlorophyll-a ocean color bloom analysis & Kd(490) turbidity</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-emerald-400 font-semibold">99.8% NOMINAL</div>
                  <div className="text-[10px] font-mono text-gray-400">Lag: 4.2 mins</div>
                </div>
              </div>

              <div className="p-3.5 bg-marine-950/60 rounded-xl border border-marine-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white text-sm">INSAT-3DR (Thermal Infrared)</span>
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 font-mono">4 km Geostationary</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Sub-surface temperature fronts, gradients |∇SST|, and thermal eddies</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-emerald-400 font-semibold">100% NOMINAL</div>
                  <div className="text-[10px] font-mono text-gray-400">Lag: 2.1 mins</div>
                </div>
              </div>

              <div className="p-3.5 bg-marine-950/60 rounded-xl border border-marine-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white text-sm">INCOIS WaveWatch-III</span>
                    <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 font-mono">Ocean State</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Significant wave height (Hs), swell period (Tp), and surface currents</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-emerald-400 font-semibold">ONLINE</div>
                  <div className="text-[10px] font-mono text-gray-400">Lag: 6.0 mins</div>
                </div>
              </div>

              <div className="p-3.5 bg-marine-950/60 rounded-xl border border-marine-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white text-sm">IMD Doppler Weather Radar</span>
                    <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800 font-mono">Meteorological</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Squall detection, cyclone track prediction, and precipitation reflectivity</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-emerald-400 font-semibold">STABLE</div>
                  <div className="text-[10px] font-mono text-gray-400">Lag: 1.5 mins</div>
                </div>
              </div>
            </div>
          </div>

          {/* HITL Escalation Queue */}
          <div className="bg-marine-900/70 border border-marine-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white flex items-center space-x-2">
                <span>🛡️ Human-In-The-Loop (HITL) Clearances</span>
              </h2>
              <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded border border-amber-500/30">
                1 Pending Override
              </span>
            </div>

            <div className="bg-marine-950/80 border border-amber-500/40 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-amber-400 font-bold font-mono text-xs">ESCALATION #HITL-2026-09</span>
                    <span className="text-[10px] bg-marine-900 text-gray-400 font-mono px-2 py-0.5 rounded">Priority: HIGH</span>
                  </div>
                  <h4 className="font-display font-semibold text-white mt-1">
                    Danush Deepsea V (IND-TN-11-TR-9043)
                  </h4>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Skipper Capt. K. Murugan requested transit through Palk Bay sector. Vessel is currently 3.8 NM from International Maritime Boundary Line (IMBL buffer: 5.0 NM).
                  </p>
                </div>
              </div>

              <div className="bg-marine-900/90 rounded-lg p-3 border border-marine-800 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Position:</span>
                  <span className="text-white">09.18°N, 79.22°E (Mandapam Outer)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Significant Wave Height:</span>
                  <span className="text-emerald-400">1.25m (Permissible for Trawler)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IMBL Proximity:</span>
                  <span className="text-rose-400 font-semibold">3.8 NM (VIOLATES 5.0 NM BUFFER)</span>
                </div>
              </div>

              {hitlActionTaken ? (
                <div className={`p-3 rounded-lg border text-xs font-mono font-medium text-center ${
                  hitlActionTaken === 'GRANTED' 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  {hitlActionTaken === 'GRANTED' 
                    ? '✓ 1-Hour Emergency Transit Clearance Granted & Broadcast via NavIC' 
                    : '✕ Request Denied. Vessel instructed to alter course westwards to 79.10°E'}
                </div>
              ) : (
                <div className="pt-1 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => handleClearanceDecision('REJECTED')}
                    className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-mono transition"
                  >
                    Enforce Return Corridor
                  </button>
                  <button
                    onClick={() => handleClearanceDecision('GRANTED')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold rounded-lg shadow-lg shadow-emerald-900/40 transition"
                  >
                    Grant Temporary 1-Hr Clearance
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Policy & Threshold Sliders */}
        <div className="bg-marine-900/70 border border-marine-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-bold text-white flex items-center space-x-2">
                <span>⚙️ Dynamic Safety Policies & Sensor Thresholds</span>
              </h2>
              <p className="text-xs text-gray-400">Real-time parameters injected into the multi-agent decision DAG and safety planes</p>
            </div>
            {alertSaved && (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-lg animate-fade-in">
                ✓ Policies Synced Across AI Agents
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 font-mono">
            {/* Slider 1 */}
            <div className="bg-marine-950/60 border border-marine-800/80 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">Max Wave Height Cutoff</span>
                <span className="text-cyan-400 font-bold">{maxWaveThreshold} m</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="5.0"
                step="0.1"
                value={maxWaveThreshold}
                onChange={(e) => setMaxWaveThreshold(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-[10px] text-gray-400 font-sans">Zones with wave heights exceeding this value trigger hard veto in Safety Agent.</p>
            </div>

            {/* Slider 2 */}
            <div className="bg-marine-950/60 border border-marine-800/80 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">IMBL Safety Buffer</span>
                <span className="text-cyan-400 font-bold">{imblBufferThreshold} NM</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="12.0"
                step="0.5"
                value={imblBufferThreshold}
                onChange={(e) => setImblBufferThreshold(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-[10px] text-gray-400 font-sans">Minimum nautical miles to keep fishing recommendations clear of international borders.</p>
            </div>

            {/* Toggle */}
            <div className="bg-marine-950/60 border border-marine-800/80 rounded-xl p-4 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-300">Auto NavIC Broadcast</span>
                  <input
                    type="checkbox"
                    checked={autoNavicBroadcast}
                    onChange={(e) => setAutoNavicBroadcast(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer rounded"
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-sans mt-2">Instantly transmit newly approved advisory vectors to low-cost satellite transceivers.</p>
              </div>
              <button
                onClick={handleSavePolicy}
                className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-semibold rounded-lg shadow-lg shadow-cyan-950/50 transition"
              >
                Apply & Propagate Policies
              </button>
            </div>
          </div>
        </div>

        {/* Agency Badges Footer */}
        <div className="pt-4 border-t border-marine-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <IsroBadge size={28} />
              <span className="text-xs font-mono text-gray-400">ISRO SAC</span>
            </div>
            <div className="flex items-center space-x-2">
              <IncoisBadge size={28} />
              <span className="text-xs font-mono text-gray-400">INCOIS MoES</span>
            </div>
            <div className="flex items-center space-x-2">
              <CoastGuardBadge size={28} />
              <span className="text-xs font-mono text-gray-400">ICG MRCC</span>
            </div>
          </div>
          <div className="text-xs font-mono text-gray-500">
            Project ORCA SIH 26176 • Human-In-The-Loop Clearance Level 4
          </div>
        </div>
      </div>
    </div>
  );
};
