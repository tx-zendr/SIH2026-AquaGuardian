import { ShieldCheck, AlertOctagon, CheckCircle2, Navigation, Fuel, Waves, Wind, Compass, Sparkles, AlertTriangle } from 'lucide-react';
import { CandidateZone, VesselProfile, ScenarioMode } from '../types/orca';
import { INITIAL_CANDIDATE_ZONES } from '../data/orcaConstants';

interface DecisionMatrixProps {
  selectedVessel: VesselProfile;
  activeScenario: ScenarioMode;
  onSelectZoneOnMap: (zone: CandidateZone) => void;
}

export default function DecisionMatrix({
  selectedVessel,
  activeScenario,
  onSelectZoneOnMap
}: DecisionMatrixProps) {
  // Dynamically evaluate candidates based on vessel and scenario
  const evaluatedZones = INITIAL_CANDIDATE_ZONES.map((zone) => {
    let safetyCheck: 'PASS' | 'FAIL' = zone.safety_check;
    let safetyReason = zone.safety_reason;
    let waveHeight = zone.wave_height;
    let windSpeed = zone.wind_speed;

    if (activeScenario === 'high_swell') {
      waveHeight = '3.65m';
      windSpeed = '28.4 kts';
      safetyCheck = 'FAIL';
      safetyReason = `HARD SAFETY BLOCK: Significant wave height (3.65m) exceeds vessel limit (${selectedVessel.max_wave_height_m}m). Voyage prohibited.`;
    } else if (activeScenario === 'imbl_violation' && zone.id.includes('mannar')) {
      safetyCheck = 'FAIL';
      safetyReason = 'HARD SAFETY BLOCK: Candidate is within 3.2 NM of India-Sri Lanka IMBL (Threshold: 5 NM). Navigation restricted.';
    } else if (zone.distance_km > selectedVessel.max_range_km) {
      safetyCheck = 'FAIL';
      safetyReason = `VESSEL LIMIT BLOCK: Transit distance (${zone.distance_km}km) exceeds vessel maximum range (${selectedVessel.max_range_km}km).`;
    }

    return {
      ...zone,
      wave_height: waveHeight,
      wind_speed: windSpeed,
      safety_check: safetyCheck,
      safety_reason: safetyReason
    };
  });

  return (
    <div className="w-full h-full overflow-y-auto p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Philosophy */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-cyan-950 p-6 rounded-2xl border border-gray-800 shadow-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold tracking-wider mb-1">
            <Sparkles size={14} /> Decision Intelligence Plane — Multi-Objective Ranking
          </div>
          <h2 className="text-xl lg:text-2xl font-black tracking-tight text-white">
            Top-K Recommended Marine Fishing Zones
          </h2>
          <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
            Ranked by Pareto utility: <b>Utility = FSI + CPUE - Distance - Fuel - Risk + Sustainability</b>. 
            Subject to the <b>Deterministic Hard Safety Filter</b> (High suitability can NEVER override a safety violation).
          </p>
        </div>
        <div className="flex items-center gap-3 bg-gray-950/80 px-4 py-2.5 rounded-xl border border-gray-800 text-xs font-mono">
          <div>
            <div className="text-[10px] text-gray-400 uppercase">ACTIVE CRAFT</div>
            <div className="font-bold text-cyan-300">{selectedVessel.name}</div>
          </div>
          <div className="w-px h-6 bg-gray-800"></div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase">MAX WAVE</div>
            <div className="font-bold text-emerald-400">{selectedVessel.max_wave_height_m}m</div>
          </div>
        </div>
      </div>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {evaluatedZones.map((zone) => {
          const isPassed = zone.safety_check === 'PASS';
          return (
            <div
              key={zone.id}
              className={`rounded-2xl border transition-all p-5 shadow-sm space-y-4 flex flex-col justify-between ${
                isPassed 
                  ? 'bg-white border-gray-200 hover:border-cyan-400 hover:shadow-md' 
                  : 'bg-rose-50/40 border-rose-200 opacity-90'
              }`}
            >
              <div className="space-y-3">
                {/* Zone Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded uppercase ${
                        isPassed ? 'bg-cyan-100 text-cyan-900' : 'bg-gray-200 text-gray-700'
                      }`}>
                        RANK #{zone.rank}
                      </span>
                      <span className="text-xs font-mono text-gray-400 font-bold">
                        ({zone.lat.toFixed(2)}°N, {zone.lon.toFixed(2)}°E)
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mt-1">
                      {zone.name}
                    </h3>
                  </div>

                  {/* Safety Status Pill */}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shrink-0 ${
                    isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 animate-pulse'
                  }`}>
                    {isPassed ? (
                      <><ShieldCheck size={12} /> SAFETY CHECK: PASS</>
                    ) : (
                      <><AlertOctagon size={12} /> FAIL: BLOCKED</>
                    )}
                  </span>
                </div>

                {/* Core Dual Prediction: FSI vs Expected CPUE */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      FISHING SUITABILITY (FSI)
                    </div>
                    <div className="text-2xl font-black text-gray-900 mt-0.5">
                      {(zone.fsi * 100).toFixed(0)} <span className="text-xs font-normal text-gray-400">/ 100</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      Habitat Biological Aggregation
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      EXPECTED CATCH (CPUE)
                    </div>
                    <div className="text-2xl font-black text-cyan-700 mt-0.5">
                      {zone.expected_cpue} <span className="text-xs font-normal text-gray-400">kg/hr</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                      90% Interval: [{zone.cpue_interval[0]} - {zone.cpue_interval[1]} kg/hr]
                    </div>
                  </div>
                </div>

                {/* Telemetry Matrix: Distance, Fuel, Wave, Wind */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <Navigation size={13} className="mx-auto text-blue-600 mb-0.5" />
                    <div className="text-[10px] text-gray-400 uppercase font-mono">DIST</div>
                    <div className="font-bold text-gray-900">{zone.distance_km} km</div>
                  </div>

                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <Fuel size={13} className="mx-auto text-amber-600 mb-0.5" />
                    <div className="text-[10px] text-gray-400 uppercase font-mono">FUEL</div>
                    <div className="font-bold text-gray-900">{zone.fuel_liters} L</div>
                  </div>

                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <Waves size={13} className="mx-auto text-cyan-600 mb-0.5" />
                    <div className="text-[10px] text-gray-400 uppercase font-mono">WAVE</div>
                    <div className={`font-bold ${zone.wave_height.startsWith('3') ? 'text-rose-600' : 'text-gray-900'}`}>
                      {zone.wave_height}
                    </div>
                  </div>

                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <Wind size={13} className="mx-auto text-purple-600 mb-0.5" />
                    <div className="text-[10px] text-gray-400 uppercase font-mono">WIND</div>
                    <div className="font-bold text-gray-900">{zone.wind_speed}</div>
                  </div>
                </div>

                {/* Hard Safety Block Notice (If applicable) */}
                {!isPassed && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-start gap-2">
                    <AlertTriangle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <span className="font-bold uppercase tracking-wider block text-[10px] text-rose-700">
                        DETERMINISTIC HARD SAFETY FILTER ENGAGED
                      </span>
                      {zone.safety_reason}
                    </div>
                  </div>
                )}

                {/* Evidence / Why Summary */}
                {isPassed && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">
                      DECISION EVIDENCE (SHAP EXPLANATION):
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1 pl-1">
                      {zone.why_summary.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-[11px] text-gray-500">
                  Target Species: <span className="font-bold text-gray-800">{zone.target_species}</span>
                </div>
                <button
                  onClick={() => onSelectZoneOnMap(zone)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                    isPassed 
                      ? 'bg-gray-900 hover:bg-cyan-700 text-white cursor-pointer' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!isPassed}
                >
                  <Compass size={13} /> Target on GIS Map
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
