import { Radio, Wifi, AlertTriangle } from 'lucide-react';
import { Page, LanguageCode, ScenarioMode, VesselProfile, User } from '../types/orca';
import { DEFAULT_VESSEL_PROFILES } from '../data/orcaConstants';
import { OrcaLogo } from './BrandingLogos';

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
  currentUser: User | null;
  onOpenAuth: () => void;
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
  edgeOffline,
  currentUser,
  onOpenAuth
}: HeaderNavProps) {
  const tabs: { id: Page; label: string; tag?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'gis', label: 'GIS Command' },
    { id: 'decision_matrix', label: 'Top-3 Matrix', tag: 'Ranked' },
    { id: 'explainable_ai', label: 'XAI (SHAP)', tag: 'ML' },
    { id: 'agent_dag', label: 'Agent DAG', tag: '8 Swarm' },
    { id: 'vessel_intel', label: 'Vessel Envelope' },
    { id: 'scenario_studio', label: 'What-If Engine' },
    { id: 'trust_provenance', label: 'Provenance & Trust' },
    { id: 'chatbot', label: 'Console' },
    { id: 'admin', label: 'Admin Command', tag: 'HITL' }
  ];

  return (
    <header className="w-full z-30 bg-marine-950/95 backdrop-blur-md text-white px-3 lg:px-6 py-2.5 flex flex-wrap justify-between items-center shadow-xl border-b border-marine-800 gap-3 font-sans">
      {/* Brand & Project ORCA Title */}
      <div 
        className="flex items-center gap-3 cursor-pointer group" 
        onClick={() => onPageChange('home')}
        title="Return to Home Landing Page"
      >
        <div className="relative flex items-center justify-center transform group-hover:scale-105 transition">
          <OrcaLogo size={36} />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-display font-extrabold tracking-wider text-white flex items-center gap-1.5">
              AQUA GUARDIAN <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60">PROJECT ORCA</span>
            </h1>
          </div>
          <p className="text-[10px] text-gray-400 font-mono tracking-wider hidden sm:block">
            ISRO SIH 2026 | PS 26176 — Autonomous Marine Decision Intelligence
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="hidden xl:flex items-center gap-1 bg-marine-900/80 p-1 rounded-xl border border-marine-800 text-xs">
        {tabs.map((tab) => {
          const isActive = currentPage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onPageChange(tab.id)}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer font-medium text-xs ${
                isActive 
                  ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30' 
                  : 'text-gray-400 hover:text-white hover:bg-marine-800'
              }`}
            >
              {tab.label}
              {tab.tag && (
                <span className={`text-[8px] px-1 py-0.2 rounded font-mono ${
                  isActive ? 'bg-cyan-800 text-cyan-200' : 'bg-marine-800 text-gray-400'
                }`}>
                  {tab.tag}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Vessel, Language, Scenario, Edge Status, User & SOS */}
      <div className="flex items-center gap-2 text-xs">
        {/* Vessel Profile Dropdown (Only visible on operation pages) */}
        {currentPage !== 'home' && currentPage !== 'admin' && (
          <div className="hidden md:flex items-center bg-marine-900 border border-marine-800 rounded-lg px-2.5 py-1.5">
            <span className="text-[10px] text-gray-400 mr-1.5 font-mono">VESSEL:</span>
            <select
              value={selectedVessel.id}
              onChange={(e) => {
                const found = DEFAULT_VESSEL_PROFILES.find(v => v.id === e.target.value);
                if (found) onVesselChange(found);
              }}
              className="bg-transparent text-cyan-300 font-semibold focus:outline-none cursor-pointer text-xs pr-1 font-mono"
            >
              {DEFAULT_VESSEL_PROFILES.map((v) => (
                <option key={v.id} value={v.id} className="bg-marine-900 text-white">
                  {v.name} ({v.max_range_km}km)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Vernacular Language Selector */}
        <div className="flex items-center bg-marine-900 border border-marine-800 rounded-lg px-2 py-1.5">
          <Radio size={12} className="text-cyan-400 animate-pulse mr-1" />
          <select
            value={activeLang}
            onChange={(e) => onLangChange(e.target.value as LanguageCode)}
            className="bg-transparent text-gray-200 focus:outline-none cursor-pointer text-xs"
          >
            <option value="en" className="bg-marine-900 text-white">English</option>
            <option value="hi" className="bg-marine-900 text-white">हिंदी (Hindi)</option>
            <option value="ml" className="bg-marine-900 text-white">മലയാളം (Malayalam)</option>
            <option value="ta" className="bg-marine-900 text-white">தமிழ் (Tamil)</option>
          </select>
        </div>

        {/* Scenario Stress-Test Selector */}
        {currentPage !== 'home' && (
          <div className="hidden lg:flex items-center bg-marine-900 border border-marine-800 rounded-lg px-2 py-1.5 gap-1">
            <span className="text-[10px] text-amber-400 font-bold font-mono">SCENARIO:</span>
            <select
              value={activeScenario}
              onChange={(e) => onScenarioChange(e.target.value as ScenarioMode)}
              className="bg-transparent text-gray-200 focus:outline-none cursor-pointer text-xs font-medium"
            >
              <option value="normal" className="bg-marine-900 text-white">🟢 Normal Weather (74/100)</option>
              <option value="high_swell" className="bg-marine-900 text-white">🟡 High Swell (3.65m)</option>
              <option value="imbl_violation" className="bg-marine-900 text-white">🔴 IMBL Buffer (3.2 NM)</option>
            </select>
          </div>
        )}

        {/* Resilience / Edge Badge */}
        <div className={`hidden sm:flex items-center gap-1.5 border px-2 py-1.5 rounded-lg font-mono text-[10px] ${
          edgeOffline 
            ? 'bg-amber-950/80 border-amber-600 text-amber-300 animate-pulse' 
            : 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
        }`} title={edgeOffline ? 'Operating on Local SQLite-WASM Cache' : 'Cloud Sync Active'}>
          <Wifi size={11} className={edgeOffline ? 'text-amber-400' : 'text-emerald-400'} />
          <span className="hidden md:inline">{edgeOffline ? 'EDGE: OFFLINE' : 'EDGE: SYNCED'}</span>
        </div>

        {/* User Auth Portal Button */}
        <button
          onClick={onOpenAuth}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium border flex items-center gap-1.5 transition ${
            currentUser 
              ? 'bg-marine-900 border-cyan-500/40 text-cyan-300 hover:bg-marine-850' 
              : 'bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 border-cyan-500/50 text-white shadow-md shadow-cyan-900/40'
          }`}
          title={currentUser ? `Logged in as ${currentUser.name} (${currentUser.role})` : 'Sign in to access custom profiles & Admin Command'}
        >
          <span>{currentUser?.avatar || '👤'}</span>
          <span className="hidden sm:inline">
            {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
          </span>
          {currentUser && (
            <span className="text-[9px] uppercase px-1 py-0.2 bg-marine-800 rounded font-semibold text-cyan-400">
              {currentUser.role}
            </span>
          )}
        </button>

        {/* SOS Emergency Button */}
        <button
          onClick={onSosTrigger}
          className="bg-red-600 hover:bg-red-700 active:scale-95 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-red-900/30 transition-all cursor-pointer font-mono"
        >
          <AlertTriangle size={13} />
          <span>SOS</span>
        </button>
      </div>
    </header>
  );
}
