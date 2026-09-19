import { useState } from 'react';
import { Sparkles, Play, Layers, Activity } from 'lucide-react';
import { AgentStepTrace, ScenarioMode } from '../types/orca';
import { INITIAL_DAG_STEPS } from '../data/orcaConstants';

interface AgentDagExplorerProps {
  selectedPoint?: { lat: number; lon: number; name: string };
  activeScenario?: ScenarioMode;
  onRunDagQuery?: (query: string) => Promise<any>;
}

export default function AgentDagExplorer({
  selectedPoint,
  activeScenario = 'normal',
  onRunDagQuery
}: AgentDagExplorerProps) {
  const [queryInput, setQueryInput] = useState('Nearest High-Yield Tuna PFZ from Kochi');
  const [selectedAgent, setSelectedAgent] = useState<AgentStepTrace | null>(INITIAL_DAG_STEPS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [dagResult, setDagResult] = useState<any>(null);

  const agentNodes = [
    { id: 1, title: 'Master Supervisor', desc: 'LangGraph StateGraph Decomposition', role: 'Planner' },
    { id: 2, title: 'Marine Data Ingestion', desc: 'Oceansat-3 OCM & INSAT-3DR TIR', role: 'Telemetry' },
    { id: 3, title: 'Weather & Hazards', desc: 'INCOIS Wave & IMD Cyclones', role: 'Safety' },
    { id: 4, title: 'Safety & Geofence', desc: 'IMBL 5 NM Buffer & MPA Reserves', role: 'GIS' },
    { id: 5, title: 'Ocean Analytics & ML', desc: 'XGBoost FSI + Expected CPUE', role: 'Prediction' },
    { id: 6, title: 'Routing & Fuel', desc: 'A* Current-Aware Navigation', role: 'Optimization' },
    { id: 7, title: 'Sustainability Agent', desc: 'Fishing Pressure Density & Season', role: 'Conservation' },
    { id: 8, title: 'Evidence & Synthesis', desc: 'Gemini 3.6 Flash & Indic Speech', role: 'Synthesis' }
  ];

  const handleRun = async () => {
    if (!onRunDagQuery) return;
    setIsLoading(true);
    try {
      const res = await onRunDagQuery(queryInput);
      setDagResult(res);
    } catch (e) {
      console.error('DAG execution error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold tracking-wider mb-1">
            <Activity size={14} /> Agent Intelligence Plane — LangGraph Swarm
          </div>
          <h2 className="text-xl lg:text-2xl font-black tracking-tight text-white">
            8-Agent StateGraph Provenance Topology
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Collaborative agent execution trace. Typed state flows through parallel discovery, deterministic constraints, 
            machine learning models, and cognitive evidence synthesis.
          </p>
          {selectedPoint && (
            <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-cyan-300">
              <span className="bg-gray-800 px-2 py-0.5 rounded border border-gray-700">SECTOR: {selectedPoint.name}</span>
              <span className="bg-gray-800 px-2 py-0.5 rounded border border-gray-700 uppercase">MODE: {activeScenario}</span>
            </div>
          )}
        </div>

        {/* Query Input & Dispatch */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Enter mission query..."
            className="bg-gray-950 border border-gray-700 text-xs px-3.5 py-2.5 rounded-xl text-white focus:outline-none focus:border-cyan-500 w-full md:w-80"
          />
          <button
            onClick={handleRun}
            disabled={isLoading}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 shrink-0 disabled:opacity-50"
          >
            {isLoading ? (
              <><Sparkles size={13} className="animate-spin" /> Running...</>
            ) : (
              <><Play size={13} /> Dispatch DAG</>
            )}
          </button>
        </div>
      </div>

      {/* Visual Agent Graph Pipeline */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-cyan-600" />
            <span className="font-bold text-sm text-gray-900">LangGraph Execution Topology</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
            PARALLEL EXECUTION ACTIVE
          </span>
        </div>

        {/* 8 Nodes Flow Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {agentNodes.map((node) => {
            const stepData = INITIAL_DAG_STEPS.find(s => s.id === node.id);
            const isSelected = selectedAgent?.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => stepData && setSelectedAgent(stepData)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected 
                    ? 'bg-cyan-50 border-cyan-500 shadow-md ring-2 ring-cyan-400/30' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="w-6 h-6 rounded-full bg-gray-900 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">
                    {node.id}
                  </span>
                  <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-gray-200/80 text-gray-700 uppercase">
                    {node.role}
                  </span>
                </div>

                <div className="mt-2.5">
                  <h4 className="font-bold text-xs text-gray-900">{node.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{node.desc}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px] font-mono text-gray-400">
                  <span className="text-emerald-700 font-semibold">✓ Completed</span>
                  <span>{stepData?.time || '0.05 ms'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Agent Inspector Drawer */}
      {selectedAgent && (
        <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 text-white shadow-xl space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-mono font-bold flex items-center justify-center">
                #{selectedAgent.id}
              </span>
              <div>
                <h3 className="font-bold text-base text-white">{selectedAgent.name}</h3>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  Type: {selectedAgent.agent_type}
                </span>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-700 px-2.5 py-1 rounded-full font-bold">
              Latency: {selectedAgent.time}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 bg-gray-900 rounded-xl border border-gray-800 space-y-1">
              <div className="text-[10px] text-gray-400 uppercase font-bold">EXECUTION DETAIL</div>
              <p className="text-gray-300 font-normal leading-relaxed">{selectedAgent.detail}</p>
            </div>

            <div className="p-3.5 bg-gray-900 rounded-xl border border-gray-800 space-y-1">
              <div className="text-[10px] text-emerald-400 uppercase font-bold">SUBTASK VALIDATION</div>
              <p className="text-emerald-300 font-normal leading-relaxed">{selectedAgent.subtask}</p>
            </div>
          </div>
        </div>
      )}

      {/* Live Dispatched Result (If query was executed) */}
      {dagResult && (
        <div className="bg-white p-6 rounded-2xl border border-cyan-200 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2 font-bold text-sm text-cyan-950">
              <Sparkles size={16} className="text-cyan-600" />
              <span>Live Multi-Agent Synthesis</span>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold">
              Latency: {dagResult.latencyMs} ms
            </span>
          </div>
          <div className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
            {dagResult.answer}
          </div>
        </div>
      )}
    </div>
  );
}
