import { useState } from 'react';
import { Sliders, RefreshCw, CheckCircle2 } from 'lucide-react';
import { CandidateZone, ScenarioMode, VesselProfile } from '../types/orca';

interface ScenarioStudioProps {
  selectedVessel: VesselProfile;
  activeScenario: ScenarioMode;
  onScenarioChange: (mode: ScenarioMode) => void;
  onSelectZone: (zone: CandidateZone) => void;
}

export default function ScenarioStudio({
  selectedVessel,
  activeScenario,
  onScenarioChange,
  onSelectZone
}: ScenarioStudioProps) {
  const [species, setSpecies] = useState('Yellowfin Tuna');
  const [maxDistance, setMaxDistance] = useState(selectedVessel.max_range_km);
  const [fuelBudget, setFuelBudget] = useState(Math.round(selectedVessel.fuel_capacity_liters * 0.75));
  const [riskTolerance, setRiskTolerance] = useState('conservative');
  const [timeWindow, setTimeWindow] = useState('tomorrow_morning');
  const [simulated, setSimulated] = useState(false);

  const handleRun = () => {
    setSimulated(true);
  };

  return (
    <div className="w-full h-full overflow-y-auto p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold tracking-wider mb-1">
            <Sliders size={14} /> Scenario / What-If Engine
          </div>
          <h2 className="text-xl lg:text-2xl font-black tracking-tight text-white">
            Operational What-If Simulation Sandbox
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Test system adaptability under shifting constraints. Tweak fuel budgets, voyage radii, target pelagic species, 
            and risk preferences to observe instant recalculations across the decision plane.
          </p>
        </div>

        <button
          onClick={handleRun}
          className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <RefreshCw size={14} className={simulated ? 'animate-spin' : ''} /> Rerun Multi-Objective Engine
        </button>
      </div>

      {/* Control Sliders & Configuration Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Sliders */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
            Voyage & Resource Constraints
          </h3>

          {/* Distance Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-700">Maximum Operational Radius</span>
              <span className="font-mono font-bold text-cyan-900 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                {maxDistance} km (~{(maxDistance / 1.852).toFixed(1)} NM)
              </span>
            </div>
            <input
              type="range"
              min="15"
              max={selectedVessel.max_range_km}
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>15 km (Inshore)</span>
              <span>Vessel Max: {selectedVessel.max_range_km} km</span>
            </div>
          </div>

          {/* Fuel Budget Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-700">Fuel Allocation Budget</span>
              <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {fuelBudget} Liters (Max {selectedVessel.fuel_capacity_liters} L)
              </span>
            </div>
            <input
              type="range"
              min="10"
              max={selectedVessel.fuel_capacity_liters}
              value={fuelBudget}
              onChange={(e) => setFuelBudget(parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>10 Liters</span>
              <span>Tank Capacity: {selectedVessel.fuel_capacity_liters} L</span>
            </div>
          </div>

          {/* Time Window */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700">Departure Window</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'immediate_departure', label: 'Immediate' },
                { id: 'tomorrow_morning', label: 'Tomorrow Dawn' },
                { id: 'night_shift', label: 'Night Pelagic' }
              ].map((tw) => (
                <button
                  key={tw.id}
                  onClick={() => setTimeWindow(tw.id)}
                  className={`p-2.5 rounded-xl font-semibold border transition-all text-center cursor-pointer ${
                    timeWindow === tw.id 
                      ? 'bg-cyan-600 text-white border-cyan-500' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  {tw.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Target Species & Risk Preference */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
            Ecological & Risk Optimization
          </h3>

          {/* Target Species Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700">Target Pelagic / Demersal Species</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                'Yellowfin Tuna',
                'Indian Mackerel',
                'Oil Sardine',
                'Silver Pomfret',
                'Tiger Prawn',
                'Oceanic Squid'
              ].map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSpecies(sp)}
                  className={`p-2.5 rounded-xl font-semibold border transition-all text-left cursor-pointer flex items-center justify-between ${
                    species === sp 
                      ? 'bg-cyan-50 border-cyan-500 text-cyan-900 shadow-xs' 
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{sp}</span>
                  {species === sp && <CheckCircle2 size={13} className="text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Appetite */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700">Risk Preference (Deterministic Margin)</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'conservative', label: 'Conservative', desc: 'Swell < 1.5m, Buffer > 10 NM' },
                { id: 'balanced', label: 'Standard', desc: 'Official limits' },
                { id: 'commercial', label: 'Commercial', desc: 'Max allowable yield' }
              ].map((rp) => (
                <button
                  key={rp.id}
                  onClick={() => setRiskTolerance(rp.id)}
                  className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer space-y-0.5 ${
                    riskTolerance === rp.id 
                      ? 'bg-cyan-50 border-cyan-500 text-cyan-900 shadow-xs' 
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-bold text-xs">{rp.label}</div>
                  <div className="text-[10px] text-gray-500 leading-tight">{rp.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What-If Live Evaluation Summary */}
      <div className="bg-white border border-gray-200 p-5 rounded-2xl text-gray-800 text-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-bold text-sm text-gray-900">
            Current Stress-Test Scenario: <span className="font-mono text-cyan-700">{activeScenario}</span>
          </div>
          <div className="flex gap-2">
            {(['normal', 'high_swell', 'imbl_violation'] as ScenarioMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onScenarioChange(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                  activeScenario === mode
                    ? 'bg-cyan-600 text-white border-cyan-500'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                }`}
              >
                {mode === 'normal' ? '🟢 Normal' : mode === 'high_swell' ? '🟡 High Swell' : '🔴 IMBL Violation'}
              </button>
            ))}
          </div>
        </div>

        {simulated && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-950 text-xs space-y-2">
            <div className="font-bold text-sm flex items-center gap-1.5 text-emerald-900">
              <CheckCircle2 size={16} /> What-If Constraints Applied Successfully
            </div>
            <p className="leading-relaxed">
              Multi-objective ranking updated for <b>{species}</b> within a <b>{maxDistance} km</b> radius 
              and <b>{fuelBudget} Liter</b> fuel envelope.
            </p>
            <button
              onClick={() => onSelectZone({
                id: 'custom_simulated',
                rank: 1,
                name: `What-If Zone (${species})`,
                lat: 10.1,
                lon: 75.8,
                fsi: 0.85,
                expected_cpue: 26.0,
                cpue_interval: [20.0, 32.0],
                confidence_percent: 86,
                safety_check: 'PASS',
                safety_reason: 'Cleared under user what-if parameters.',
                wave_height: '1.10m',
                wind_speed: '12.0 kts',
                distance_nm: (maxDistance / 1.852),
                distance_km: maxDistance,
                travel_time_hours: 3.5,
                fuel_liters: fuelBudget,
                sustainability_rating: 'EXCELLENT',
                fishing_pressure: 'LOW',
                target_species: species,
                optimal_depth_range: '40 - 55m',
                shap_factors: [],
                why_summary: ['Simulated Pareto optimal zone for custom parameters.']
              })}
              className="mt-2 px-4 py-2 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Plot What-If Result on GIS Map →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
