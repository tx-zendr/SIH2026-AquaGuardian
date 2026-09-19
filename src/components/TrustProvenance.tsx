import { ShieldCheck, Database, Wifi, AlertTriangle, Users, CheckCircle2 } from 'lucide-react';
import { INITIAL_PROVENANCE_DATA } from '../data/orcaConstants';
import { ScenarioMode } from '../types/orca';

interface TrustProvenanceProps {
  selectedPoint?: { lat: number; lon: number; name: string };
  activeScenario?: ScenarioMode;
}

export default function TrustProvenance({
  selectedPoint,
  activeScenario = 'normal'
}: TrustProvenanceProps) {
  return (
    <div className="w-full h-full overflow-y-auto p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold tracking-wider mb-1">
            <ShieldCheck size={14} /> Trust & Governance Plane
          </div>
          <h2 className="text-xl lg:text-2xl font-black tracking-tight text-white">
            Data Provenance, Source Conflict & Resilience
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Every operational inference maintains strict data lineage. A prediction without trustworthy, fresh input 
            data must never receive high confidence.
          </p>
          {selectedPoint && (
            <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-cyan-300">
              <span className="bg-gray-800 px-2 py-0.5 rounded border border-gray-700">AUDITED SECTOR: {selectedPoint.name}</span>
              <span className="bg-gray-800 px-2 py-0.5 rounded border border-gray-700 uppercase">MODE: {activeScenario}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 px-3.5 py-2 rounded-xl text-xs font-mono">
          <CheckCircle2 size={13} />
          <span>PROVENANCE AUDIT: VERIFIED</span>
        </div>
      </div>

      {/* Provenance Lineage Records Table */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-cyan-600" />
            <h3 className="font-bold text-sm text-gray-900">Authoritative Ingestion Lineage</h3>
          </div>
          <span className="text-[10px] font-mono text-gray-500">
            Source Resolution: Continuous 1 km Common Analysis Grid
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-[10px] font-mono uppercase text-gray-400">
                <th className="py-2.5 px-3">Agency / Source</th>
                <th className="py-2.5 px-3">Product Description</th>
                <th className="py-2.5 px-3">Sensor Payload</th>
                <th className="py-2.5 px-3">Observation Time</th>
                <th className="py-2.5 px-3">Quality Score</th>
                <th className="py-2.5 px-3 text-right">Conflict Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {INITIAL_PROVENANCE_DATA.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                    {item.agency}
                  </td>
                  <td className="py-3 px-3 font-medium">{item.product}</td>
                  <td className="py-3 px-3 font-mono text-gray-500">{item.sensor}</td>
                  <td className="py-3 px-3 font-mono text-gray-500">{item.timestamp}</td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {item.quality_score}% QC
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">
                      CONCORDANT (0 CONFLICTS)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Source Conflict Resolution & Human-In-The-Loop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Source Conflict Engine */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 text-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
            <AlertTriangle size={15} className="text-amber-500" />
            Source Conflict Resolution Engine
          </div>
          <p className="text-gray-600 leading-relaxed">
            When satellite observations (e.g. Oceansat-3 OCM vs MODIS-Aqua) report divergent chlorophyll or SST values, 
            the system records the conflict in metadata and automatically downgrades prediction confidence.
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 font-mono text-[11px] space-y-1">
            <div className="font-bold">CONCORDANCE RULE:</div>
            <div>Agreement ≥ 95%: Full Confidence Inferred.</div>
            <div>Conflict &gt; 15%: Automatic 20% Confidence Penalty + Flagged in Advisory.</div>
          </div>
        </div>

        {/* Human-In-The-Loop (HITL) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 text-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
            <Users size={15} className="text-cyan-600" />
            Human-In-The-Loop (HITL) Escalation Gate
          </div>
          <p className="text-gray-600 leading-relaxed">
            AI operates autonomously for standard operations. However, if cyclone depressions, extreme swell (&gt; 3.5m), 
            or sudden border buffer shifts are identified, the system halts autonomous clearance and prompts escalation to official port controllers.
          </p>
          <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-950 font-mono text-[11px] space-y-1">
            <div className="font-bold">ESCALATION THRESHOLD:</div>
            <div>Severe Hazard OR Confidence &lt; 65% ➔ Escalate to INCOIS duty scientist.</div>
          </div>
        </div>
      </div>

      {/* Resilience & Edge Plane (Offline Mode) */}
      <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi size={16} className="text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Edge / Offline Operation Architecture</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-700 px-2.5 py-0.5 rounded font-bold">
            PWA READY
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3.5 bg-gray-900 rounded-xl border border-gray-800 space-y-1">
            <div className="text-[10px] text-gray-400 uppercase">LOCAL DATABASE</div>
            <div className="text-sm font-bold text-white">SQLite-WASM</div>
            <p className="text-[10px] text-gray-400 font-sans">Cached bathymetry, safety masks, and vessel profile stored client-side.</p>
          </div>

          <div className="p-3.5 bg-gray-900 rounded-xl border border-gray-800 space-y-1">
            <div className="text-[10px] text-gray-400 uppercase">STORE & FORWARD QUEUE</div>
            <div className="text-sm font-bold text-cyan-300">Sync Pending: 0 Events</div>
            <p className="text-[10px] text-gray-400 font-sans">Trip logs sync to shore servers as soon as cellular or NavIC link returns.</p>
          </div>

          <div className="p-3.5 bg-gray-900 rounded-xl border border-gray-800 space-y-1">
            <div className="text-[10px] text-gray-400 uppercase">DEGRADATION PRINCIPLE</div>
            <div className="text-sm font-bold text-emerald-400">Never Hallucinate</div>
            <p className="text-[10px] text-gray-400 font-sans">If live telemetry drops, UI displays exact timestamp of cached forecast.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
