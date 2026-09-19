import { Compass, Fuel, Waves, Wind, Check } from 'lucide-react';
import { VesselProfile } from '../types/orca';
import { DEFAULT_VESSEL_PROFILES } from '../data/orcaConstants';

interface VesselIntelligenceProps {
  selectedVessel: VesselProfile;
  onSelectVessel: (v: VesselProfile) => void;
}

export default function VesselIntelligence({
  selectedVessel,
  onSelectVessel
}: VesselIntelligenceProps) {
  return (
    <div className="w-full h-full overflow-y-auto p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold tracking-wider mb-1">
            <Compass size={14} /> Decision Intelligence Plane — Vessel Capability
          </div>
          <h2 className="text-xl lg:text-2xl font-black tracking-tight text-white">
            Personalized Reachability Envelope & Limits
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Recommendations are strictly constrained by your craft's physical seaworthiness, fuel autonomy, 
            cruising velocity, and structural wave tolerance.
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-700 px-3 py-1.5 rounded-xl font-bold">
          Active: {selectedVessel.name}
        </span>
      </div>

      {/* Vessel Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {DEFAULT_VESSEL_PROFILES.map((vessel) => {
          const isSelected = selectedVessel.id === vessel.id;
          return (
            <div
              key={vessel.id}
              onClick={() => onSelectVessel(vessel)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-4 relative ${
                isSelected 
                  ? 'bg-cyan-50/50 border-cyan-500 shadow-md ring-2 ring-cyan-400/30' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 bg-cyan-600 text-white rounded-full p-1 shadow-sm">
                  <Check size={14} />
                </div>
              )}

              <div>
                <div className="text-[10px] font-mono text-cyan-800 font-bold uppercase tracking-wider">
                  {vessel.vessel_type}
                </div>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">{vessel.name}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{vessel.description}</p>
              </div>

              {/* Spec Attributes */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-gray-100">
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <div className="text-[10px] text-gray-400 uppercase flex items-center gap-1">
                    <Compass size={11} className="text-blue-600" /> Max Range
                  </div>
                  <div className="font-black text-gray-800 text-sm mt-0.5">{vessel.max_range_km} km</div>
                  <div className="text-[9px] text-gray-500">~{(vessel.max_range_km / 1.852).toFixed(0)} Nautical Miles</div>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <div className="text-[10px] text-gray-400 uppercase flex items-center gap-1">
                    <Waves size={11} className="text-cyan-600" /> Max Wave
                  </div>
                  <div className="font-black text-gray-800 text-sm mt-0.5">{vessel.max_wave_height_m} meters</div>
                  <div className="text-[9px] text-gray-500">Hard limit cutoff</div>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <div className="text-[10px] text-gray-400 uppercase flex items-center gap-1">
                    <Fuel size={11} className="text-amber-600" /> Fuel Tank
                  </div>
                  <div className="font-black text-gray-800 text-sm mt-0.5">{vessel.fuel_capacity_liters} L</div>
                  <div className="text-[9px] text-gray-500">Burn: {vessel.burn_rate_lph} L/hr</div>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <div className="text-[10px] text-gray-400 uppercase flex items-center gap-1">
                    <Wind size={11} className="text-teal-600" /> Max Wind
                  </div>
                  <div className="font-black text-gray-800 text-sm mt-0.5">{vessel.max_wind_speed_kts} kts</div>
                  <div className="text-[9px] text-gray-500">Beaufort threshold</div>
                </div>
              </div>

              <button
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                  isSelected ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isSelected ? 'Currently Selected' : 'Select Craft Profile'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Reachability Workflow Explainer */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-gray-900">How Vessel Intelligence Constrains Decision Making</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
            <div className="font-mono text-cyan-600 font-bold text-xs">STEP 1: ORIGIN</div>
            <div className="font-bold text-gray-800">Homeport Departure</div>
            <p className="text-gray-500 text-[11px] leading-relaxed">Origin coordinates locked from vessel GNSS or selected harbour.</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
            <div className="font-mono text-cyan-600 font-bold text-xs">STEP 2: ENVELOPE</div>
            <div className="font-bold text-gray-800">Reachable Radius Mask</div>
            <p className="text-gray-500 text-[11px] leading-relaxed">Circle computed from (Speed × Operational Hours) with safety fuel reserve.</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
            <div className="font-mono text-rose-600 font-bold text-xs">STEP 3: SAFETY HARD FILTER</div>
            <div className="font-bold text-gray-800">Wave & Wind Pruning</div>
            <p className="text-gray-500 text-[11px] leading-relaxed">Any ocean cell exceeding {selectedVessel.max_wave_height_m}m wave limit is completely blocked.</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
            <div className="font-mono text-emerald-600 font-bold text-xs">STEP 4: A* ROUTING</div>
            <div className="font-bold text-gray-800">Safe Corridor Generation</div>
            <p className="text-gray-500 text-[11px] leading-relaxed">NavIC waypoints calculated through legal waters avoiding restricted areas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
