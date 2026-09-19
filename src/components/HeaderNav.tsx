import { Compass, Radio, Wifi, AlertTriangle } from 'lucide-react';
import { Page, LanguageCode, ScenarioMode, VesselProfile } from '../types/orca';
import { DEFAULT_VESSEL_PROFILES } from '../data/orcaConstants';

interface HeaderNavProps {
  currentPage: Page;
  onPageChange: (p: Page) => void;
  activeLang: LanguageCode;
  onLangChange: (l: LanguageCode) => void;
  activeScenario: ScenarioMode;
  onScenarioChange: (s: ScenarioMode) => void;
  selectedVessel: VesselProfile;
  onVesselChange: (v: VesselProfile) => void;
  onSosTrigger: () => void;
  edgeOffline: boolean;
}

export default function HeaderNav({
  currentPage,
  onPageChange,
  activeLang,
  onLangChange,
  activeScenario,
  onScenarioChange,
  selectedVessel,
  onVesselChange,
  onSosTrigger,
  edgeOffline
}: HeaderNavProps) {
  const tabs: { id: Page; label: string; tag?: string }[] = [
    { id: 'gis', label: 'GIS Command' },
    { id: 'decision_matrix', label: 'Top-3 Matrix', tag: 'Ranked' },
    { id: 'explainable_ai', label: 'XAI (SHAP)', tag: 'ML' },
    { id: 'agent_dag', label: 'Agent DAG', tag: '8 Swarm' },
    { id: 'vessel_intel', label: 'Vessel Envelope' },
    { id: 'scenario_studio', label: 'What-If Engine' },
    { id: 'trust_provenance', label: 'Provenance & Trust' },
    { id: 'chatbot', label: 'Conversational Console' }
  ];

  return (
    <header className="w-full z-30 bg-gray-950/95 backdrop-blur-md text-white px-4 lg:px-6 py-2.5 flex flex-wrap justify-between items-center shadow-xl border-b border-gray-800 gap-3">
      {/* Brand & Project ORCA Title */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onPageChange('gis')}>
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Compass size={22} className="text-white animate-spin" style={{ animationDuration: '24s' }} />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              AQUA GUARDIAN <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60">PROJECT ORCA</span>
            </h1>
          </div>
          <p className="text-[10px] text-gray-400 font-mono tracking-wider">
            ISRO SIH 2026 | PS 26176 — Multi-Agent Marine Decision Intelligence
          </p>
        </div>
      </div>

      {/* 6-Plane Navigation Tabs */}
      <nav className="hidden xl:flex items-center gap-1 bg-gray-900/80 p-1 rounded-xl border border-gray-800 text-xs">
        {tabs.map((tab) => {
          const isActive = currentPage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onPageChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer font-medium ${
                isActive 
                  ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab.label}
              {tab.tag && (
                <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                  isActive ? 'bg-cyan-800 text-cyan-200' : 'bg-gray-800 text-gray-400'
                }`}>
                  {tab.tag}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Vessel, Language, Scenario, Edge Status, SOS */}
      <div className="flex items-center gap-2 text-xs">
        {/* Vessel Profile Dropdown */}
        <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5">
          <span className="text-[10px] text-gray-400 mr-1.5 hidden md:inline font-mono">VESSEL:</span>
          <select
            value={selectedVessel.id}
            onChange={(e) => {
              const found = DEFAULT_VESSEL_PROFILES.find(v => v.id === e.target.value);
              if (found) onVesselChange(found);
            }}
            className="bg-transparent text-cyan-300 font-semibold focus:outline-none cursor-pointer text-xs pr-1"
          >
            {DEFAULT_VESSEL_PROFILES.map((v) => (
              <option key={v.id} value={v.id} className="bg-gray-900 text-white">
                {v.name} ({v.max_range_km}km)
              </option>
            ))}
          </select>
        </div>

        {/* Vernacular Language Selector */}
        <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg px-2 py-1.5">
          <Radio size={12} className="text-cyan-400 animate-pulse mr-1" />
          <select
            value={activeLang}
            onChange={(e) => onLangChange(e.target.value as LanguageCode)}
            className="bg-transparent text-gray-200 focus:outline-none cursor-pointer text-xs"
          >
            <option value="en" className="bg-gray-900 text-white">English</option>
            <option value="hi" className="bg-gray-900 text-white">हिंदी (Hindi)</option>
            <option value="ml" className="bg-gray-900 text-white">മലയാളം (Malayalam)</option>
            <option value="ta" className="bg-gray-900 text-white">தமிழ் (Tamil)</option>
          </select>
        </div>

        {/* Scenario Stress-Test Selector */}
        <div className="hidden lg:flex items-center bg-gray-900 border border-gray-800 rounded-lg px-2 py-1.5 gap-1">
          <span className="text-[10px] text-amber-400 font-bold font-mono">SCENARIO:</span>
          <select
            value={activeScenario}
            onChange={(e) => onScenarioChange(e.target.value as ScenarioMode)}
            className="bg-transparent text-gray-200 focus:outline-none cursor-pointer text-xs font-medium"
          >
            <option value="normal" className="bg-gray-900 text-white">🟢 Normal Weather (74/100)</option>
            <option value="high_swell" className="bg-gray-900 text-white">🟡 High Swell Alert (3.65m Limit)</option>
            <option value="imbl_violation" className="bg-gray-900 text-white">🔴 IMBL Violation (3.2 NM Buffer)</option>
          </select>
        </div>

        {/* Resilience / Edge Badge */}
        <div className={`hidden sm:flex items-center gap-1.5 border px-2.5 py-1.5 rounded-lg font-mono text-[10px] ${
          edgeOffline 
            ? 'bg-amber-950/80 border-amber-600 text-amber-300 animate-pulse' 
            : 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
        }`} title={edgeOffline ? 'Operating on Local SQLite-WASM Cache' : 'Cloud Sync Active'}>
          <Wifi size={11} className={edgeOffline ? 'text-amber-400' : 'text-emerald-400'} />
          <span>{edgeOffline ? 'EDGE: OFFLINE' : 'EDGE: SYNCED'}</span>
        </div>

        {/* SOS Emergency Button */}
        <button
          onClick={onSosTrigger}
          className="bg-red-600 hover:bg-red-700 active:scale-95 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-red-900/30 transition-all cursor-pointer"
        >
          <AlertTriangle size={13} />
          <span>SOS 1554</span>
        </button>
      </div>
    </header>
  );
}
