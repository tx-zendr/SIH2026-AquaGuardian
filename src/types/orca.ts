export type Page = 'home' | 'admin' | 'gis' | 'decision_matrix' | 'explainable_ai' | 'agent_dag' | 'vessel_intel' | 'scenario_studio' | 'trust_provenance' | 'chatbot';

export type UserRole = 'fisherman' | 'admin' | 'officer' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  organization: string;
  harbour?: string;
  vesselId?: string;
  avatar?: string;
}

export type LanguageCode = 'en' | 'hi' | 'ml' | 'ta';

export type ScenarioMode = 'normal' | 'high_swell' | 'imbl_violation' | 'cyclone_alert';

export interface VesselProfile {
  id: string;
  name: string;
  vessel_type: string;
  max_range_km: number;
  cruising_speed_kts: number;
  fuel_capacity_liters: number;
  burn_rate_lph: number;
  max_wave_height_m: number;
  max_wind_speed_kts: number;
  crew_capacity: number;
  color: string;
  description: string;
}

export interface ShapFactor {
  name: string;
  feature_value: string;
  impact_percent: number;
  positive: boolean;
}

export interface CandidateZone {
  id: string;
  rank: number;
  name: string;
  lat: number;
  lon: number;
  fsi: number; // Fishing Suitability Index [0.0 - 1.0]
  expected_cpue: number; // Catch per unit effort (kg/hr)
  cpue_interval: [number, number]; // Prediction interval [min, max]
  confidence_percent: number;
  safety_check: 'PASS' | 'FAIL';
  safety_reason: string;
  wave_height: string;
  wind_speed: string;
  distance_nm: number;
  distance_km: number;
  travel_time_hours: number;
  fuel_liters: number;
  sustainability_rating: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'CONSTRAINED';
  fishing_pressure: 'LOW' | 'MODERATE' | 'HIGH';
  target_species: string;
  optimal_depth_range: string;
  shap_factors: ShapFactor[];
  why_summary: string[];
}

export interface StructuredIntent {
  raw_query: string;
  intent_type: string;
  species: string;
  time_window: string;
  origin_name: string;
  origin_coords: { lat: number; lon: number };
  max_radius_km: number;
  vessel_type: string;
  risk_preference: string;
}

export interface AgentStepTrace {
  id: number;
  name: string;
  agent_type: string;
  time: string;
  detail: string;
  subtask: string;
  status: 'COMPLETED' | 'RUNNING' | 'BLOCKED';
}

export interface DataProvenanceRecord {
  id: string;
  agency: string;
  product: string;
  sensor: string;
  timestamp: string;
  freshness_level: 'OPTIMAL' | 'ACCEPTABLE' | 'STALE';
  quality_score: number;
  resolution: string;
  conflict_detected: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  verdict?: string;
  species?: string;
  imbl?: string;
  timestamp?: string;
  structuredIntent?: StructuredIntent;
}

export interface MaritimeHarbour {
  name: string;
  lat: number;
  lon: number;
  region: string;
  state: string;
}
