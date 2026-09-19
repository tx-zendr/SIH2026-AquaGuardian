import { Compass, ShieldCheck, ArrowRight, Activity, Layers } from 'lucide-react';
import { Page, User } from '../types/orca';
import { OrcaLogo, IsroBadge, IncoisBadge, CoastGuardBadge, SihBadge } from './BrandingLogos';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
}

export default function HomePage({ onNavigate, currentUser, onOpenAuth }: HomePageProps) {
  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-slate-950 via-[#07111e] to-slate-950 text-white selection:bg-cyan-500 selection:text-white">
      
      {/* 1. Hero Section with Cybernetic Marine Theme */}
      <section className="relative px-6 lg:px-12 pt-10 pb-16 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Partner Badges Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          <SihBadge />
          <IsroBadge />
          <IncoisBadge />
          <CoastGuardBadge />
        </div>

        {/* Center Title & Crest */}
        <div className="text-center space-y-5 max-w-4xl mx-auto">
          <div className="flex justify-center mb-2">
            <OrcaLogo size={76} />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-teal-300">
            AQUA GUARDIAN
          </h1>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase">
            <span>Project ORCA</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>ISRO PS 26176</span>
          </div>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Multi-Agent Marine Decision Intelligence System. Combining satellite earth observation, 
            hydrodynamic safety boundaries, and LangGraph swarms for safe and sustainable fishing.
          </p>

          {/* Philosophy Banner */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl max-w-3xl mx-auto text-xs sm:text-sm font-mono text-cyan-200/90 leading-relaxed">
            <span className="text-cyan-400 font-bold">"AI Predicts. Deterministic Rules Protect. GIS Constrains.</span><br className="hidden sm:inline" />
            <span className="text-teal-300">Agents Orchestrate. Routing Optimizes. Evidence Explains. Humans Oversee."</span>
          </div>

          {/* Action Button Row */}
          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('gis')}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-sm rounded-xl flex items-center gap-2.5 shadow-lg shadow-cyan-900/30 transition-all active:scale-95 cursor-pointer"
            >
              <Compass size={18} />
              <span>Launch GIS Command Center</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onNavigate('decision_matrix')}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>Top-3 Pareto Decision Matrix</span>
            </button>

            {!currentUser ? (
              <button
                onClick={onOpenAuth}
                className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 font-mono text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>🔑 Sign In / Demo Accounts</span>
              </button>
            ) : currentUser.role === 'admin' || currentUser.role === 'officer' ? (
              <button
                onClick={() => onNavigate('admin')}
                className="px-5 py-3.5 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700 font-mono text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>🛰️ Admin Command Center</span>
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* 2. Live Telemetry Metric Strip */}
      <section className="border-y border-slate-800/80 bg-slate-950/70 py-6 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-display">1 km</div>
            <div className="text-[11px] text-slate-400 uppercase mt-1">Common Ocean Grid (WGS84)</div>
          </div>
          <div className="p-3 border-l border-slate-800">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-display">8 Swarm</div>
            <div className="text-[11px] text-slate-400 uppercase mt-1">LangGraph Agent Graph</div>
          </div>
          <div className="p-3 border-l border-slate-800">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display">5 NM</div>
            <div className="text-[11px] text-slate-400 uppercase mt-1">Deterministic IMBL Buffer</div>
          </div>
          <div className="p-3 border-l border-slate-800">
            <div className="text-2xl sm:text-3xl font-black text-purple-400 font-display">100% Free</div>
            <div className="text-[11px] text-slate-400 uppercase mt-1">OpenStreetMap (Zero API Keys)</div>
          </div>
        </div>
      </section>

      {/* 3. Choose Your Dedicated Portal */}
      <section className="py-14 px-6 lg:px-12 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            Operational Portals
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Select your functional interface tailored for seafaring navigation or shore authority control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Fisherman & Seafarer Portal */}
          <div 
            onClick={() => onNavigate('gis')}
            className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500 transition-all cursor-pointer space-y-4 hover:shadow-xl hover:shadow-cyan-950/30 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass size={24} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                PORTAL #1: AT-SEA VOYAGE
              </span>
              <h3 className="text-lg font-bold text-white mt-1">Fisherman & Navigator Console</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Click-anywhere GIS map sonar, real-time wave safety margin, thermal front PFZ discovery, and Indic voice TTS advisories.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Navigator</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 2: Decision Science & SHAP */}
          <div 
            onClick={() => onNavigate('decision_matrix')}
            className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500 transition-all cursor-pointer space-y-4 hover:shadow-xl hover:shadow-emerald-950/30 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                PORTAL #2: DECISION PLANE
              </span>
              <h3 className="text-lg font-bold text-white mt-1">Top-3 Pareto Decision Matrix</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Pareto multi-objective candidate ranking, FSI vs CPUE distinction, conformal uncertainty bounds, and SHAP evidence breakdown.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>View Top-3 Matrix</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 3: ISRO & Port Authority Admin */}
          <div 
            onClick={() => onNavigate('admin')}
            className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500 transition-all cursor-pointer space-y-4 hover:shadow-xl hover:shadow-indigo-950/30 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-950 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">
                PORTAL #3: COMMAND & CONTROL
              </span>
              <h3 className="text-lg font-bold text-white mt-1">ISRO Admin & Fleet Command</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Live fleet radar, satellite sensor health status, deterministic safety threshold tuner, and Human-in-the-Loop escalation approval.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Access Control Center</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* 4. The 6-Plane Architecture Topology Grid */}
      <section className="py-14 px-6 lg:px-12 max-w-7xl mx-auto space-y-8 border-t border-slate-800/80">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Layers size={14} /> 6-Plane Master Topology
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            Engineered for Extreme Marine Safety & Scalability
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          <div 
            onClick={() => onNavigate('gis')}
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 cursor-pointer space-y-2"
          >
            <div className="font-mono text-cyan-400 font-bold uppercase text-[10px]">PLANE 1: EXPERIENCE PLANE</div>
            <h4 className="font-bold text-sm text-white">GIS Map & Vernacular Voice</h4>
            <p className="text-slate-400 leading-relaxed">Zero-token OpenStreetMap, Leaflet overlays, and multi-lingual voice synthesis in 4 Indian languages.</p>
          </div>

          <div 
            onClick={() => onNavigate('agent_dag')}
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 cursor-pointer space-y-2"
          >
            <div className="font-mono text-teal-400 font-bold uppercase text-[10px]">PLANE 2: INTELLIGENCE PLANE</div>
            <h4 className="font-bold text-sm text-white">8-Agent LangGraph Swarm</h4>
            <p className="text-slate-400 leading-relaxed">Compiled StateGraph orchestrating supervisor, ocean analytics, weather hazards, and Gemini 3.6 Flash.</p>
          </div>

          <div 
            onClick={() => onNavigate('explainable_ai')}
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 cursor-pointer space-y-2"
          >
            <div className="font-mono text-emerald-400 font-bold uppercase text-[10px]">PLANE 3: DATA & ANALYTICS</div>
            <h4 className="font-bold text-sm text-white">Explainable AI & SHAP</h4>
            <p className="text-slate-400 leading-relaxed">Feature attribution breakdown for thermal fronts and chlorophyll with 90% conformal intervals.</p>
          </div>

          <div 
            onClick={() => onNavigate('vessel_intel')}
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 cursor-pointer space-y-2"
          >
            <div className="font-mono text-amber-400 font-bold uppercase text-[10px]">PLANE 4: DECISION INTELLIGENCE</div>
            <h4 className="font-bold text-sm text-white">Hard Safety & Vessel Envelope</h4>
            <p className="text-slate-400 leading-relaxed">Craft-specific structural limits prune unsafe cells before A* pathfinding calculates corridors.</p>
          </div>

          <div 
            onClick={() => onNavigate('trust_provenance')}
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 cursor-pointer space-y-2"
          >
            <div className="font-mono text-purple-400 font-bold uppercase text-[10px]">PLANE 5: TRUST & GOVERNANCE</div>
            <h4 className="font-bold text-sm text-white">Provenance & Conflict Engine</h4>
            <p className="text-slate-400 leading-relaxed">Authoritative sensor audit trail with automated 20% confidence penalties upon sensor conflict.</p>
          </div>

          <div 
            onClick={() => onNavigate('scenario_studio')}
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 cursor-pointer space-y-2"
          >
            <div className="font-mono text-rose-400 font-bold uppercase text-[10px]">PLANE 6: RESILIENCE & EDGE</div>
            <h4 className="font-bold text-sm text-white">What-If & SQLite-WASM Cache</h4>
            <p className="text-slate-400 leading-relaxed">Operates client-side even when high-seas satellite connectivity drops. Store-and-forward telemetry.</p>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs font-mono text-slate-500">
        <p>AQUA GUARDIAN — Developed for Indian Space Research Organisation (ISRO) | SIH 2026 PS 26176</p>
        <p className="text-[10px] mt-1 text-slate-600">Geodetic Datum: WGS 84 / NavIC | Satellite Feeds: Oceansat-3 OCM-3 & INSAT-3DR TIR</p>
      </footer>
    </div>
  );
}
