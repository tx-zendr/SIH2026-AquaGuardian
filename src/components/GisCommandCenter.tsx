import { useEffect, useRef, useState } from 'react';
import { Layers, Crosshair, Play, Volume2, Copy, ShieldCheck, AlertOctagon, CheckCircle2, Compass, Sparkles, X, Send } from 'lucide-react';
import L from 'leaflet';
import { Message, ScenarioMode, VesselProfile } from '../types/orca';
import { MARITIME_HARBOURS } from '../data/orcaConstants';

interface GisCommandCenterProps {
  selectedPoint: { lat: number; lon: number; name: string };
  onSelectPoint: (p: { lat: number; lon: number; name: string }) => void;
  metrics: { wave: string; wind: string; safety: string; status: string };
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onSpeak: (text: string) => void;
  speaking: boolean;
  activeScenario: ScenarioMode;
  selectedVessel: VesselProfile;
}

export default function GisCommandCenter({
  selectedPoint,
  onSelectPoint,
  metrics,
  messages,
  isTyping,
  onSendMessage,
  onSpeak,
  speaking,
  activeScenario,
  selectedVessel
}: GisCommandCenterProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const [layers, setLayers] = useState({
    pfz: true,
    imbl: true,
    mpa: true,
    cyclone: true,
    harbours: true,
    grid1km: false
  });

  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;

    if (leafletInstance.current) {
      leafletInstance.current.remove();
      leafletInstance.current = null;
    }

    const map = L.map(mapRef.current, {
      center: [selectedPoint.lat || 10.5, selectedPoint.lon || 76.5],
      zoom: 6,
      zoomControl: false,
      attributionControl: false
    });

    // 100% Free OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const group = L.layerGroup().addTo(map);
    layersGroupRef.current = group;

    map.on('click', (e: L.LeafletMouseEvent) => {
      const latF = parseFloat(e.latlng.lat.toFixed(2));
      const lonF = parseFloat(e.latlng.lng.toFixed(2));
      const pName = `Sector (${latF}°N, ${lonF}°E)`;
      onSelectPoint({ lat: latF, lon: lonF, name: pName });
      updateMapMarkerAndRoute(latF, lonF, map);
    });

    leafletInstance.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    renderLayers(map);
    updateMapMarkerAndRoute(selectedPoint.lat, selectedPoint.lon, map);

    return () => {
      clearTimeout(timer);
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, []);

  // Re-render layers when toggled or scenario changes
  useEffect(() => {
    if (leafletInstance.current) {
      renderLayers(leafletInstance.current);
    }
  }, [layers, activeScenario]);

  // Update marker & route when selectedPoint changes
  useEffect(() => {
    if (leafletInstance.current) {
      updateMapMarkerAndRoute(selectedPoint.lat, selectedPoint.lon, leafletInstance.current);
    }
  }, [selectedPoint]);

  const updateMapMarkerAndRoute = (lat: number, lon: number, map: L.Map) => {
    if (markerRef.current) map.removeLayer(markerRef.current);
    if (routeLineRef.current) map.removeLayer(routeLineRef.current);

    const pinIcon = L.divIcon({
      className: 'custom-pin-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-cyan-500/20 animate-ping absolute"></div>
          <div class="w-6 h-6 rounded-full bg-red-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-[10px] font-bold">
            📍
          </div>
        </div>
      `,
      iconSize: [24, 24]
    });

    const pin = L.marker([lat, lon], { icon: pinIcon }).addTo(map);
    markerRef.current = pin;

    const kochiLat = 9.93;
    const kochiLon = 76.26;
    const route = L.polyline([
      [kochiLat, kochiLon],
      [(kochiLat + lat) / 2 + 0.1, (kochiLon + lon) / 2 - 0.15],
      [lat, lon]
    ], {
      color: '#0284c7',
      weight: 3,
      dashArray: '6, 6',
      opacity: 0.85
    }).addTo(map);
    routeLineRef.current = route;
  };

  const renderLayers = (map: L.Map) => {
    if (!layersGroupRef.current) return;
    const group = layersGroupRef.current;
    group.clearLayers();

    // 1. PFZ Zones
    if (layers.pfz) {
      const pfz1 = L.polygon([
        [9.5, 75.3], [10.2, 75.5], [10.0, 75.9], [9.3, 75.7]
      ], {
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.35,
        weight: 2,
        dashArray: '4, 4'
      }).bindTooltip('<b>PFZ #1: Off Kochi Thermal Front</b><br>Chlorophyll: 2.85 mg/m³<br>Expected Catch: +4.5x', { sticky: true });

      const pfz2 = L.polygon([
        [12.3, 74.0], [13.1, 74.2], [12.9, 74.6], [12.2, 74.4]
      ], {
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.3,
        weight: 2
      }).bindTooltip('<b>PFZ #2: Mangaluru Upwelling Zone</b><br>Catch: +3.8x (Mackerel)', { sticky: true });

      group.addLayer(pfz1);
      group.addLayer(pfz2);
    }

    // 2. IMBL Border & 5 NM Buffer
    if (layers.imbl) {
      const imblLine = L.polyline([
        [10.08, 79.86], [9.53, 79.52], [9.10, 79.35], [8.65, 79.05], [7.95, 78.85]
      ], {
        color: '#dc2626',
        weight: 3,
        dashArray: '6, 6'
      }).bindTooltip('<b>IMBL (International Maritime Boundary Line)</b><br>Strict Sovereign Boundary', { sticky: true });

      const bufferZone = L.polygon([
        [10.15, 79.75], [9.58, 79.42], [9.15, 79.25], [8.70, 78.95],
        [8.65, 79.05], [9.10, 79.35], [9.53, 79.52], [10.08, 79.86]
      ], {
        color: '#f59e0b',
        fillColor: '#f59e0b',
        fillOpacity: 0.25,
        weight: 1
      }).bindTooltip('<b>5 NM IMBL Safety Buffer Zone</b><br>VHF Alert Required', { sticky: true });

      group.addLayer(imblLine);
      group.addLayer(bufferZone);
    }

    // 3. MPA Eco-Reserves
    if (layers.mpa) {
      const mpaZone = L.polygon([
        [8.95, 78.45], [9.25, 79.15], [9.05, 79.30], [8.75, 78.60]
      ], {
        color: '#d97706',
        fillColor: '#f59e0b',
        fillOpacity: 0.35,
        weight: 2
      }).bindTooltip('<b>Gulf of Mannar Biosphere Reserve</b><br>Fishing Prohibited (Wildlife Protection Act)', { sticky: true });
      group.addLayer(mpaZone);
    }

    // 4. Cyclone Alert
    if (layers.cyclone) {
      const cyclone = L.circle([12.5, 83.2], {
        radius: 120000,
        color: '#e11d48',
        fillColor: '#f43f5e',
        fillOpacity: 0.25,
        weight: 2,
        dashArray: '5, 5'
      }).bindTooltip('<b>Bay of Bengal Deep Depression Alert</b><br>Wind: 45 kts | Waves: 4.8m<br>STATUS: NO-SAIL ZONE', { sticky: true });
      group.addLayer(cyclone);
    }

    // 5. Harbours
    if (layers.harbours) {
      MARITIME_HARBOURS.forEach((h) => {
        const marker = L.circleMarker([h.lat, h.lon], {
          radius: 6,
          color: '#1e3a8a',
          fillColor: '#3b82f6',
          fillOpacity: 0.9,
          weight: 2
        }).bindTooltip(`<b>${h.name}</b><br>Region: ${h.region}`, { sticky: true });
        group.addLayer(marker);
      });
    }

    // 6. 1km Ocean Grid (ISRO/INCOIS Mesh)
    if (layers.grid1km) {
      const bounds = map.getBounds();
      const south = bounds.getSouth();
      const north = bounds.getNorth();
      const west = bounds.getWest();
      const east = bounds.getEast();

      for (let lat = Math.floor(south); lat <= Math.ceil(north); lat += 0.25) {
        const gridLine = L.polyline([[lat, west], [lat, east]], {
          color: '#06b6d4',
          weight: 0.5,
          opacity: 0.3
        });
        group.addLayer(gridLine);
      }
      for (let lon = Math.floor(west); lon <= Math.ceil(east); lon += 0.25) {
        const gridLine = L.polyline([[south, lon], [north, lon]], {
          color: '#06b6d4',
          weight: 0.5,
          opacity: 0.3
        });
        group.addLayer(gridLine);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row relative overflow-hidden bg-slate-950">
      {/* Interactive Leaflet Map Area */}
      <div className="flex-1 relative h-[55vh] lg:h-full">
        <div ref={mapRef} className="w-full h-full cursor-crosshair z-0" />

        {/* Floating Sector Evaluation Badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-gray-950/85 backdrop-blur-md text-cyan-300 border border-cyan-700/60 px-4 py-1.5 rounded-full text-xs font-mono shadow-xl pointer-events-none flex items-center gap-2">
          <Crosshair size={14} className="animate-spin text-cyan-400" style={{ animationDuration: '8s' }} />
          <span>Click anywhere to run Multi-Agent Hydrodynamic Reasoning</span>
        </div>

        {/* Left Floating Panel: GIS Layers */}
        <div className="absolute left-4 top-4 z-10 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-gray-200 pointer-events-auto">
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-100 bg-gray-50/70">
            <div className="flex items-center gap-2 font-bold text-gray-800 text-xs tracking-wide">
              <Layers size={14} className="text-cyan-600" />
              GIS Constraints
            </div>
            <span className="text-[10px] font-mono text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">ISRO/INCOIS</span>
          </div>

          <div className="p-3 space-y-2 text-xs font-semibold text-gray-700">
            {[
              { key: 'pfz', label: 'PFZ Thermal Fronts', dot: 'bg-emerald-500' },
              { key: 'imbl', label: 'IMBL 5 NM Buffer', dot: 'bg-red-500' },
              { key: 'mpa', label: 'MPA Reserves (Mannar)', dot: 'bg-amber-500' },
              { key: 'cyclone', label: 'Cyclone Alerts', dot: 'bg-rose-600' },
              { key: 'harbours', label: 'Major Harbours', dot: 'bg-blue-600' },
              { key: 'grid1km', label: '1km Ocean Grid', dot: 'bg-cyan-500' },
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => setLayers(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.dot}`}></div>
                  <span>{item.label}</span>
                </div>
                <span className={`text-[10px] font-mono font-bold ${layers[item.key as keyof typeof layers] ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {layers[item.key as keyof typeof layers] ? 'ON' : 'OFF'}
                </span>
              </div>
            ))}
          </div>

          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-500 font-medium">NavIC A* Route</span>
            <button
              onClick={() => setShowSimulateModal(true)}
              className="bg-gray-900 hover:bg-cyan-700 active:scale-95 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer"
            >
              <Play size={10} /> Simulate
            </button>
          </div>
        </div>

        {/* Bottom Bar: Telemetry Badges */}
        <div className="absolute left-4 bottom-4 z-10 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 flex items-center px-4 py-2 gap-4 text-xs font-mono pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">WAVE:</span>
            <span className={`font-bold ${metrics.wave.startsWith('3') ? 'text-rose-600' : 'text-gray-900'}`}>{metrics.wave}</span>
          </div>
          <div className="w-px h-3.5 bg-gray-200"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">WIND:</span>
            <span className="text-gray-900 font-bold">{metrics.wind}</span>
          </div>
          <div className="w-px h-3.5 bg-gray-200"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">STATUS:</span>
            <span className={`font-bold ${metrics.status === 'BLOCKED_BY_SAFETY_ENGINE' ? 'text-rose-600' : 'text-emerald-600'}`}>
              {metrics.status === 'BLOCKED_BY_SAFETY_ENGINE' ? 'BLOCKED' : 'CLEARED'}
            </span>
          </div>
        </div>
      </div>

      {/* Right Assistant & Output Drawer */}
      <div className="w-full lg:w-[420px] xl:w-[460px] h-[45vh] lg:h-full bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col z-20 shadow-xl shrink-0">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            Aqua Guardian Assistant
          </div>
          <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
            LangGraph + Gemini 3.6 Flash
          </span>
        </div>

        {/* Message / Decision Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/40">
          {messages.length === 0 ? (
            <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 text-gray-500">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mb-3 shadow-2xs">
                <Sparkles size={22} className="animate-pulse" />
              </div>
              <div className="font-bold text-gray-800 text-sm">Ready for Marine Queries</div>
              <p className="text-xs text-gray-500 mt-1 max-w-[240px] leading-relaxed">
                Click any point on the GIS Map to trigger multi-agent reasoning for that sector.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[95%] rounded-2xl p-4 text-[13px] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-gray-900 text-white rounded-br-sm shadow-md' 
                    : 'bg-white border border-gray-200 shadow-sm rounded-bl-sm text-gray-800'
                }`}>
                  {msg.role === 'agent' && (
                    <div className="flex justify-between items-center mb-2.5 pb-2 border-b border-gray-100">
                      <span className="font-extrabold text-[10px] text-gray-400 tracking-wider uppercase">
                        {selectedPoint.name}
                      </span>
                      <div className="flex gap-2 text-gray-400">
                        <button
                          type="button"
                          className={`cursor-pointer hover:text-cyan-600 transition-colors ${speaking ? 'text-cyan-600 animate-bounce' : ''}`}
                          onClick={() => onSpeak(msg.content)}
                          title="Listen in Vernacular Voice"
                        >
                          <Volume2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer hover:text-gray-700 transition-colors"
                          onClick={() => navigator.clipboard.writeText(msg.content)}
                          title="Copy advisory"
                        >
                          <Copy size={15} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Explicit Hero Verdict Banner */}
                  {msg.role === 'agent' && (
                    <div className="space-y-3">
                      <div className={`p-3 rounded-xl border flex items-center justify-between ${
                        msg.verdict === 'BLOCKED_BY_SAFETY_ENGINE'
                          ? 'bg-rose-50 border-rose-200 text-rose-950'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      }`}>
                        <div className="flex items-center gap-2">
                          {msg.verdict === 'BLOCKED_BY_SAFETY_ENGINE' ? (
                            <AlertOctagon size={20} className="text-rose-600 animate-pulse shrink-0" />
                          ) : (
                            <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
                          )}
                          <div>
                            <div className="text-[10px] font-bold tracking-widest uppercase opacity-75">
                              MISSION STATUS VERDICT
                            </div>
                            <div className="text-xs font-black">
                              {msg.verdict === 'BLOCKED_BY_SAFETY_ENGINE' ? 'VOYAGE BLOCKED: CRITICAL HAZARD' : 'CLEARED FOR SEA VENTURE (GO)'}
                            </div>
                          </div>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          msg.verdict === 'BLOCKED_BY_SAFETY_ENGINE' ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-950'
                        }`}>
                          {msg.verdict === 'BLOCKED_BY_SAFETY_ENGINE' ? 'NO-GO' : 'GO APPROVED'}
                        </span>
                      </div>

                      {/* 4-Metric Breakdown Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="text-[10px] text-gray-400 font-bold uppercase font-mono">TARGET SPECIES</div>
                          <div className="font-extrabold text-gray-900 mt-0.5">{msg.species || 'Yellowfin Tuna'}</div>
                          <div className="text-[10px] text-emerald-600 font-bold">+4.5x catch yield</div>
                        </div>

                        <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="text-[10px] text-gray-400 font-bold uppercase font-mono">WAVE STATE</div>
                          <div className="font-extrabold text-gray-900 mt-0.5">{metrics.wave}</div>
                          <div className="text-[10px] text-gray-500">Margin: Safe for {selectedVessel.name.split(' ')[0]}</div>
                        </div>

                        <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="text-[10px] text-gray-400 font-bold uppercase font-mono">IMBL BORDER</div>
                          <div className="font-extrabold text-gray-900 mt-0.5">{msg.imbl || '178 NM'}</div>
                          <div className="text-[10px] text-gray-500">Indian Sovereign Waters</div>
                        </div>

                        <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="text-[10px] text-gray-400 font-bold uppercase font-mono">OPTIMAL HEADING</div>
                          <div className="font-extrabold text-cyan-900 mt-0.5">274° W (Kochi)</div>
                          <div className="text-[10px] text-cyan-700">A* Current Assisted</div>
                        </div>
                      </div>

                      {/* Expandable Natural Language Advisory */}
                      <div className="pt-2 border-t border-gray-100">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono mb-1">
                          SCIENTIFIC ADVISORY (GEMINI 3.6 FLASH):
                        </div>
                        <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  )}

                  {msg.role === 'user' && (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="p-4 bg-white border border-cyan-200 rounded-2xl shadow-sm text-xs text-cyan-900 flex items-center gap-2 font-mono">
              <Sparkles size={14} className="animate-spin text-cyan-600" />
              <span>Multi-Agent LangGraph Swarm Synthesizing Clearance...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputPrompt.trim()) {
                onSendMessage(inputPrompt);
                setInputPrompt('');
              }
            }}
            placeholder="Ask Aqua Guardian for this sector..."
            className="flex-1 bg-gray-50 border border-gray-200 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs focus:outline-none"
          />
          <button
            onClick={() => {
              if (inputPrompt.trim()) {
                onSendMessage(inputPrompt);
                setInputPrompt('');
              }
            }}
            disabled={!inputPrompt.trim() || isTyping}
            className="p-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-200 text-white rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <Send size={13} />
          </button>
        </div>
      </div>

      {/* Trawler Route Telemetry Simulation Modal */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Compass size={18} className="text-cyan-600" />
                <h3 className="font-bold text-sm text-gray-900">A* NavIC Navigational Corridor</h3>
              </div>
              <button onClick={() => setShowSimulateModal(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl grid grid-cols-2 gap-3 font-mono">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase">ORIGIN HARBOUR</div>
                  <div className="font-bold text-gray-900">Kochi Fishing Harbour</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase">TARGET SECTOR</div>
                  <div className="font-bold text-cyan-700">{selectedPoint.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase">TRANSIT DISTANCE</div>
                  <div className="font-bold text-gray-900">38.2 Nautical Miles</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase">ESTIMATED DIESEL FUEL</div>
                  <div className="font-bold text-amber-700">22.1 Liters</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1 text-emerald-900">
                  <CheckCircle2 size={13} /> Current Assistance Vector: +0.4 kts
                </div>
                <div className="text-[11px] leading-relaxed">
                  Surface currents flowing northward provide optimal drift assistance, cutting transit fuel by ~8.5%.
                  Geofence collision risk: 0% overlap with restricted naval corridors or MPA sanctuaries.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSimulateModal(false)}
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Close Telemetry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
