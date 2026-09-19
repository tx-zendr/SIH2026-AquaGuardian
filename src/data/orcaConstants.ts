import { MaritimeHarbour, VesselProfile, CandidateZone, DataProvenanceRecord, AgentStepTrace } from '../types/orca';

export const MARITIME_HARBOURS: MaritimeHarbour[] = [
  { name: 'Kochi Fishing Harbour', lat: 9.93, lon: 76.26, region: 'Arabian Sea - South', state: 'Kerala' },
  { name: 'Mangaluru Old Port', lat: 12.85, lon: 74.83, region: 'Arabian Sea - Central', state: 'Karnataka' },
  { name: 'Goa Mormugao Port', lat: 15.41, lon: 73.80, region: 'Arabian Sea - Konkan', state: 'Goa' },
  { name: 'Mumbai Sassoon Dock', lat: 18.91, lon: 72.82, region: 'Arabian Sea - North', state: 'Maharashtra' },
  { name: 'Rameswaram Jetty', lat: 9.28, lon: 79.31, region: 'Palk Bay / Gulf of Mannar', state: 'Tamil Nadu' },
  { name: 'Chennai Kasimedu Harbour', lat: 13.12, lon: 80.30, region: 'Bay of Bengal - South', state: 'Tamil Nadu' },
  { name: 'Visakhapatnam Fishing Harbour', lat: 17.69, lon: 83.30, region: 'Bay of Bengal - Central', state: 'Andhra Pradesh' },
];

export const DEFAULT_VESSEL_PROFILES: VesselProfile[] = [
  {
    id: 'artisanal_motorboat',
    name: 'Artisanal Motorboat (OBM)',
    vessel_type: 'Outboard Motor (9.9-25 HP FRP Craft)',
    max_range_km: 50,
    cruising_speed_kts: 9.5,
    fuel_capacity_liters: 60,
    burn_rate_lph: 5.5,
    max_wave_height_m: 2.2,
    max_wind_speed_kts: 22.0,
    crew_capacity: 4,
    color: '#0284c7',
    description: 'Traditional artisanal craft operating within territorial waters (< 12 NM). High vulnerability to swell and squalls.'
  },
  {
    id: 'mechanized_gillnetter',
    name: 'Mechanized Gillnetter / Longliner',
    vessel_type: 'Inboard Diesel Wooden/Steel Hull (40-60 ft)',
    max_range_km: 120,
    cruising_speed_kts: 8.5,
    fuel_capacity_liters: 220,
    burn_rate_lph: 12.0,
    max_wave_height_m: 3.2,
    max_wind_speed_kts: 28.0,
    crew_capacity: 8,
    color: '#059669',
    description: 'Medium-range mechanized vessel equipped with NavIC transceiver and mechanical winches for offshore shelf-edge operations.'
  },
  {
    id: 'deepsea_trawler',
    name: 'Deep-Sea Pelagic Trawler',
    vessel_type: 'Multi-day Offshore Vessel (> 65 ft)',
    max_range_km: 260,
    cruising_speed_kts: 10.0,
    fuel_capacity_liters: 650,
    burn_rate_lph: 22.0,
    max_wave_height_m: 4.5,
    max_wind_speed_kts: 36.0,
    crew_capacity: 12,
    color: '#7c3aed',
    description: 'Heavy ocean-going trawler designed for multi-day voyages along the continental slope and high-seas EEZ boundary.'
  }
];

export const INITIAL_CANDIDATE_ZONES: CandidateZone[] = [
  {
    id: 'zone_kochi_front',
    rank: 1,
    name: 'Zone #1: Off Kochi - Alleppey Thermal Front',
    lat: 9.72,
    lon: 75.65,
    fsi: 0.88,
    expected_cpue: 28.5,
    cpue_interval: [22.4, 34.6],
    confidence_percent: 88,
    safety_check: 'PASS',
    safety_reason: 'Wave 1.15m within artisanal limit (2.2m). IMBL distance 178 NM. Zero MPA/Naval overlap.',
    wave_height: '1.15m',
    wind_speed: '12.4 kts',
    distance_nm: 38.2,
    distance_km: 70.7,
    travel_time_hours: 4.0,
    fuel_liters: 22.1,
    sustainability_rating: 'EXCELLENT',
    fishing_pressure: 'LOW',
    target_species: 'Yellowfin Tuna & Skipjack',
    optimal_depth_range: '45 - 65m',
    shap_factors: [
      { name: 'SST Gradient Front (|∇SST| = 1.12°C/10km)', feature_value: '1.12°C/10km', impact_percent: 34.2, positive: true },
      { name: 'Chlorophyll-a Bloom (2.85 mg/m³)', feature_value: '2.85 mg/m³', impact_percent: 28.5, positive: true },
      { name: 'Continental Shelf Slope (48m)', feature_value: '48m depth', impact_percent: 18.2, positive: true },
      { name: 'Anticyclonic Eddy Convergence (+0.4 kts)', feature_value: '+0.4 kts', impact_percent: 12.1, positive: true },
      { name: 'Historical Fishing Pressure', feature_value: 'Low Density', impact_percent: -7.0, positive: false }
    ],
    why_summary: [
      'Strong sea surface temperature gradient front detected from INSAT-3DR TIR.',
      'High chlorophyll bloom concentration (2.85 mg/m³) from Oceansat-3 OCM-3.',
      'Favorable ocean surface current divergence assisting pelagic tuna aggregation.',
      '100% legal clearance with zero sovereign boundary or protected reserve overlap.'
    ]
  },
  {
    id: 'zone_mangalore_ridge',
    rank: 2,
    name: 'Zone #2: Mangaluru Coastal Upwelling Ridge',
    lat: 12.65,
    lon: 74.32,
    fsi: 0.81,
    expected_cpue: 24.2,
    cpue_interval: [18.5, 29.8],
    confidence_percent: 83,
    safety_check: 'PASS',
    safety_reason: 'Wave 1.32m safe for mechanized craft. Clear from shipping corridors.',
    wave_height: '1.32m',
    wind_speed: '14.1 kts',
    distance_nm: 32.5,
    distance_km: 60.2,
    travel_time_hours: 3.4,
    fuel_liters: 19.4,
    sustainability_rating: 'GOOD',
    fishing_pressure: 'MODERATE',
    target_species: 'Indian Mackerel & Oil Sardine',
    optimal_depth_range: '30 - 45m',
    shap_factors: [
      { name: 'Upwelling Nitrate Index', feature_value: 'High index', impact_percent: 31.0, positive: true },
      { name: 'SST Cool Pocket (26.8°C)', feature_value: '26.8°C', impact_percent: 24.5, positive: true },
      { name: 'Chlorophyll Gradient', feature_value: '2.10 mg/m³', impact_percent: 19.8, positive: true },
      { name: 'Distance to Port (32.5 NM)', feature_value: '32.5 NM', impact_percent: 14.5, positive: true },
      { name: 'Active Trawler Concentration', feature_value: 'Moderate Density', impact_percent: -10.2, positive: false }
    ],
    why_summary: [
      'Subsurface upwelling brings cold nutrient-rich water stimulating shoaling fish.',
      'Moderate swell allows standard drift-net and purse-seine deployment.',
      'Safe transit corridor outside major New Mangalore Port navigational channel.'
    ]
  },
  {
    id: 'zone_karwar_slope',
    rank: 3,
    name: 'Zone #3: Karwar Continental Edge Sector',
    lat: 14.45,
    lon: 73.75,
    fsi: 0.74,
    expected_cpue: 19.8,
    cpue_interval: [14.2, 25.1],
    confidence_percent: 79,
    safety_check: 'PASS',
    safety_reason: 'Swell 1.45m within operational limits. High biological suitability.',
    wave_height: '1.45m',
    wind_speed: '15.6 kts',
    distance_nm: 44.0,
    distance_km: 81.5,
    travel_time_hours: 4.6,
    fuel_liters: 26.8,
    sustainability_rating: 'GOOD',
    fishing_pressure: 'LOW',
    target_species: 'Silver Pomfret & Oceanic Squid',
    optimal_depth_range: '50 - 75m',
    shap_factors: [
      { name: 'Bathymetric Gradient (Steep Shelf)', feature_value: '62m drop', impact_percent: 27.8, positive: true },
      { name: 'SST Stability Window', feature_value: '27.4°C', impact_percent: 22.0, positive: true },
      { name: 'Thermal Front Convergence', feature_value: '0.85°C/10km', impact_percent: 18.4, positive: true },
      { name: 'Higher Fuel Transit Cost', feature_value: '44 NM transit', impact_percent: -14.2, positive: false }
    ],
    why_summary: [
      'Promising shelf-edge drop-off creating micro-eddy trapping baitfish.',
      'Low competitor pressure ensures high catch-per-effort efficiency.',
      'Requires moderate fuel allowance; best suited for mechanized craft.'
    ]
  },
  {
    id: 'zone_gulf_mannar_blocked',
    rank: 4,
    name: 'Sector 4: Gulf of Mannar Marine National Park',
    lat: 9.12,
    lon: 79.15,
    fsi: 0.89,
    expected_cpue: 31.0,
    cpue_interval: [25.0, 38.0],
    confidence_percent: 92,
    safety_check: 'FAIL',
    safety_reason: 'CRITICAL BLOCK: Candidate is inside designated Marine Protected Area (MPA) Eco-Reserve. Fishing strictly prohibited by Wildlife Protection Act.',
    wave_height: '0.85m',
    wind_speed: '10.2 kts',
    distance_nm: 18.2,
    distance_km: 33.7,
    travel_time_hours: 1.9,
    fuel_liters: 10.5,
    sustainability_rating: 'CONSTRAINED',
    fishing_pressure: 'LOW',
    target_species: 'Protected Reef Species',
    optimal_depth_range: '12 - 25m',
    shap_factors: [
      { name: 'MPA Geofence Hard Exclusion', feature_value: '100% overlap', impact_percent: -99.9, positive: false }
    ],
    why_summary: [
      'High theoretical biomass but strictly BLOCKED by Deterministic Hard Safety Engine.',
      'Demonstrates that AI Suitability can NEVER override physical or legal geofences.'
    ]
  }
];

export const INITIAL_PROVENANCE_DATA: DataProvenanceRecord[] = [
  {
    id: 'prov_ocm3',
    agency: 'ISRO MOSDAC',
    product: 'Oceansat-3 OCM-3 Chlorophyll-a Level-3',
    sensor: 'Ocean Colour Monitor-3 (OCM-3)',
    timestamp: '2026-09-19T22:30:00Z (3h 54m ago)',
    freshness_level: 'OPTIMAL',
    quality_score: 98.4,
    resolution: '1 km Resampled Grid',
    conflict_detected: false
  },
  {
    id: 'prov_insat3dr',
    agency: 'ISRO MOSDAC',
    product: 'INSAT-3DR Sea Surface Temperature (SST)',
    sensor: 'Thermal Infrared (TIR) Sounder',
    timestamp: '2026-09-20T00:15:00Z (2h 09m ago)',
    freshness_level: 'OPTIMAL',
    quality_score: 97.1,
    resolution: '4 km Sensor -> 1 km Analysis Fusion',
    conflict_detected: false
  },
  {
    id: 'prov_incois_osf',
    agency: 'INCOIS Hyderabad',
    product: 'Ocean State Forecast (Wave, Swell & Current)',
    sensor: 'Global Wave Model + Moored Buoys Network',
    timestamp: '2026-09-20T01:00:00Z (1h 24m ago)',
    freshness_level: 'OPTIMAL',
    quality_score: 99.2,
    resolution: 'Regional High-Res Mesh',
    conflict_detected: false
  },
  {
    id: 'prov_imd_radar',
    agency: 'IMD New Delhi',
    product: 'Doppler Weather Radar & Cyclone Depression Alert',
    sensor: 'DWR Kochi & DWR Chennai + INSAT-3D Imager',
    timestamp: '2026-09-20T01:45:00Z (39m ago)',
    freshness_level: 'OPTIMAL',
    quality_score: 96.5,
    resolution: 'Sub-district Coastal Polygons',
    conflict_detected: false
  },
  {
    id: 'prov_gis_imbl',
    agency: 'National Hydrographic Office (NHO) / Navy',
    product: 'International Maritime Boundary Line (IMBL) Geofence',
    sensor: 'Official Maritime Boundary Treaty Coordinates',
    timestamp: 'Static Verified Baseline v2026.1',
    freshness_level: 'OPTIMAL',
    quality_score: 100.0,
    resolution: 'Vector Exact Boundary + 5 NM Buffer',
    conflict_detected: false
  }
];

export const INITIAL_DAG_STEPS: AgentStepTrace[] = [
  {
    id: 1,
    name: 'Master Supervisor & Dynamic DAG Planner',
    agent_type: 'LangGraph Orchestrator',
    time: '0.01 ms',
    detail: 'Decomposed structured intent into 6 parallel sub-agent task branches.',
    subtask: 'Intent: SAFE_FISHING_ZONE_SEARCH | Species: Tuna | Origin: Kochi Harbour.',
    status: 'COMPLETED'
  },
  {
    id: 2,
    name: 'Marine Data Discovery & Ingestion Agent',
    agent_type: 'Data Plane Connector',
    time: '0.02 ms',
    detail: 'Retrieved ISRO Oceansat-3 (Chl: 2.85 mg/m³) and INSAT-3DR (SST: 27.8°C). Radiometric QC verified.',
    subtask: 'Merged into 1km Common Ocean Analysis Grid.',
    status: 'COMPLETED'
  },
  {
    id: 3,
    name: 'Weather & Marine Disaster Hazard Agent',
    agent_type: 'Hazard Engine',
    time: '0.02 ms',
    detail: 'Assessed significant wave height (1.15m) and surface wind (12.4 kts) against vessel threshold (2.2m).',
    subtask: 'Wave & Wind clearance: SAFE_FOR_VENTURE.',
    status: 'COMPLETED'
  },
  {
    id: 4,
    name: 'Safety & Geofence Agent',
    agent_type: 'GIS Constraint Engine',
    time: '0.08 ms',
    detail: 'Ran Point-in-Polygon check against IMBL buffer (5 NM) and MPA Eco-Reserves.',
    subtask: 'Candidate Zone 1: 178 NM from IMBL (PASS). Zone 4: Overlaps MPA (FAIL: BLOCK).',
    status: 'COMPLETED'
  },
  {
    id: 5,
    name: 'Ocean Analytics & ML Agent (FSI & CPUE)',
    agent_type: 'Predictive ML Engine',
    time: '0.19 ms',
    detail: 'Inferred XGBoost FSI (0.88) and XGBoost Expected CPUE (28.5 kg/hr) with conformal prediction intervals.',
    subtask: 'Computed real-time SHAP feature importance attribution.',
    status: 'COMPLETED'
  },
  {
    id: 6,
    name: 'Routing & Fuel Optimization Agent',
    agent_type: 'A* Graph Router',
    time: '0.11 ms',
    detail: 'Calculated wave-aware, current-assisted A* transit path from Kochi to target sector.',
    subtask: 'Distance: 38.2 NM | Fuel: 22.1 Liters | Current assistance: +0.4 kts northward.',
    status: 'COMPLETED'
  },
  {
    id: 7,
    name: 'Sustainability & Effort Agent',
    agent_type: 'Conservation Evaluator',
    time: '0.05 ms',
    detail: 'Evaluated Global Fishing Watch effort density and juvenile protection seasonality.',
    subtask: 'Fishing Pressure: LOW | Sustainability Rating: EXCELLENT.',
    status: 'COMPLETED'
  },
  {
    id: 8,
    name: 'Evidence & Synthesis Agent (Gemini 3.6 Flash)',
    agent_type: 'Cognitive Synthesizer',
    time: '1420.5 ms',
    detail: 'Synthesized multi-objective ranking, SHAP explanation, and vernacular advisory.',
    subtask: 'Generated structured natural language clearance with TTS audio synthesis.',
    status: 'COMPLETED'
  }
];

export const CANDIDATE_ZONES = INITIAL_CANDIDATE_ZONES;
export const VESSEL_PROFILES = DEFAULT_VESSEL_PROFILES;

export const DEMO_USERS = [
  {
    id: 'user_ramesh',
    name: 'Capt. Ramesh Nair',
    email: 'ramesh.nair@kochi-fisheries.in',
    role: 'fisherman' as const,
    designation: 'Vessel Master (OBM Craft)',
    organization: 'Kochi Marine Fishers Cooperative',
    harbour: 'Kochi Fishing Harbour',
    vesselId: 'artisanal_motorboat',
    avatar: '👨‍✈️'
  },
  {
    id: 'user_ananya',
    name: 'Dr. Ananya Sharma',
    email: 'a.sharma@isro.sac.gov.in',
    role: 'admin' as const,
    designation: 'Lead Oceanographer & Duty Scientist',
    organization: 'ISRO Space Applications Centre (SAC)',
    harbour: 'All Indian Ports',
    avatar: '🛰️'
  },
  {
    id: 'user_rao',
    name: 'Commander V. Rao',
    email: 'ops.mrcc@indiancoastguard.nic.in',
    role: 'officer' as const,
    designation: 'Maritime Operations Officer',
    organization: 'Indian Coast Guard MRCC (1554)',
    harbour: 'Western & Southern Command',
    avatar: '🛡️'
  }
];

export const FLEET_VESSELS = [
  {
    id: 'IND-KL-07-MM-4421',
    name: 'Matsya Sagar IV',
    type: 'Artisanal Motorboat (OBM)',
    captain: 'Capt. Ramesh Nair',
    lat: 9.85,
    lon: 75.82,
    wave: '1.10m',
    waveLimit: '2.20m',
    imblClearance: '174 NM',
    status: 'CLEARED' as const,
    lastPing: '2 mins ago'
  },
  {
    id: 'IND-KA-02-TR-8109',
    name: 'Ocean Pioneer III',
    type: 'Mechanized Gillnetter',
    captain: 'Master S. Bhat',
    lat: 12.72,
    lon: 74.45,
    wave: '1.35m',
    waveLimit: '3.20m',
    imblClearance: '168 NM',
    status: 'CLEARED' as const,
    lastPing: 'Just now'
  },
  {
    id: 'IND-TN-11-TR-9043',
    name: 'Danush Deepsea V',
    type: 'Deep-Sea Trawler',
    captain: 'Capt. K. Murugan',
    lat: 9.18,
    lon: 79.22,
    wave: '1.25m',
    waveLimit: '4.50m',
    imblClearance: '3.8 NM',
    status: 'BUFFER_WARNING' as const,
    lastPing: '1 min ago'
  }
];
