"""
Aqua Guardian FastAPI Backend (Project ORCA)
ISRO Smart India Hackathon 2026 (PS 26176)

Exposes full REST API across the 6 Topology Planes:
1. Experience & Conversational Plane: POST /api/orchestrate
2. Decision Intelligence Plane: POST /api/decision-matrix, POST /api/what-if
3. Data & Analytics Plane: POST /api/explain-shap
4. Geospatial & Routing Plane: POST /api/simulate-route
5. Trust & Governance Plane: GET /api/provenance
6. Resilience & System Health: GET /api/health
"""

import os
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

# Import domain logic
from agent_graph import run_orchestration, aqua_graph
from decision_engine import (
    evaluate_candidate_zones,
    run_what_if_simulation,
    generate_shap_factors,
    VESSEL_PROFILES
)
from geospatial_engine import calculate_astar_route, HARBOURS
from provenance_engine import get_provenance_audit_trail

app = FastAPI(
    title="Aqua Guardian Multi-Agent API (Project ORCA)",
    description="ISRO SIH 2026 PS 26176 Decision Intelligence & 8-Agent Swarm Backend",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------------------------------------
# PYDANTIC REQUEST & RESPONSE SCHEMAS
# -------------------------------------------------------------

class OrchestrateRequest(BaseModel):
    prompt: str = Field(..., description="Natural language marine query")
    lat: Optional[float] = Field(9.93, description="Latitude in decimal degrees")
    lon: Optional[float] = Field(76.26, description="Longitude in decimal degrees")
    lang: Optional[str] = Field("en", description="Indic language code: en, hi, ml, ta")
    scenario: Optional[str] = Field("normal", description="Scenario mode: normal, high_swell, imbl_violation")
    vessel_id: Optional[str] = Field("artisanal_motorboat", description="Vessel profile identifier")
    apiKey: Optional[str] = Field(None, description="Optional runtime Gemini API key override")


class DecisionMatrixRequest(BaseModel):
    origin_lat: Optional[float] = 9.93
    origin_lon: Optional[float] = 76.26
    vessel_id: Optional[str] = "artisanal_motorboat"
    scenario: Optional[str] = "normal"


class ExplainShapRequest(BaseModel):
    fsi: Optional[float] = 0.88
    sst_grad: Optional[float] = 1.12
    chla: Optional[float] = 2.85
    depth: Optional[float] = 48.0


class RouteSimulateRequest(BaseModel):
    origin_lat: Optional[float] = 9.93
    origin_lon: Optional[float] = 76.26
    target_lat: float
    target_lon: float
    cruising_speed_kts: Optional[float] = 9.5
    burn_rate_lph: Optional[float] = 5.5


class WhatIfRequest(BaseModel):
    species: str = "Yellowfin Tuna"
    max_distance_km: float = 50.0
    fuel_budget_liters: float = 45.0
    risk_tolerance: str = "conservative"
    time_window: str = "tomorrow_morning"
    vessel_id: Optional[str] = "artisanal_motorboat"


# -------------------------------------------------------------
# REST API ENDPOINTS
# -------------------------------------------------------------

@app.get("/api/health")
def get_health():
    """Returns system status, active LangGraph nodes, and geodetic reference datum."""
    return {
        "status": "online",
        "service": "Aqua Guardian Decision Intelligence Core",
        "project": "Project ORCA (ISRO SIH 2026 - PS 26176)",
        "version": "2.0.0",
        "active_graph_nodes": list(aqua_graph.nodes.keys()),
        "vessels_configured": list(VESSEL_PROFILES.keys()),
        "geodetic_datum": "WGS 84 / NavIC",
        "harbours_indexed": list(HARBOURS.keys())
    }


@app.post("/api/orchestrate")
def post_orchestrate(req: OrchestrateRequest):
    """Executes the full 8-agent LangGraph Swarm workflow and returns synthesized advisory."""
    if req.apiKey and len(req.apiKey.strip()) > 5:
        os.environ["GEMINI_API_KEY"] = req.apiKey.strip()

    result = run_orchestration(
        query=req.prompt,
        lat=req.lat if req.lat is not None else 9.93,
        lon=req.lon if req.lon is not None else 76.26,
        lang=req.lang or "en",
        scenario=req.scenario or "normal",
        vessel_id=req.vessel_id or "artisanal_motorboat"
    )
    return result


@app.post("/api/decision-matrix")
def post_decision_matrix(req: DecisionMatrixRequest):
    """Evaluates Top-K candidate fishing zones against Pareto utility and Deterministic Hard Safety Filter."""
    candidates = evaluate_candidate_zones(
        origin_lat=req.origin_lat or 9.93,
        origin_lon=req.origin_lon or 76.26,
        vessel_id=req.vessel_id or "artisanal_motorboat",
        scenario=req.scenario or "normal"
    )
    return {
        "status": "SUCCESS",
        "vessel_id": req.vessel_id,
        "scenario": req.scenario,
        "candidate_count": len(candidates),
        "zones": candidates
    }


@app.post("/api/explain-shap")
def post_explain_shap(req: ExplainShapRequest):
    """Returns dynamic TreeSHAP feature attributions and conformal prediction bounds."""
    factors = generate_shap_factors(
        fsi=req.fsi or 0.88,
        sst_grad=req.sst_grad or 1.12,
        chla=req.chla or 2.85,
        depth=req.depth or 48.0
    )
    return {
        "status": "SUCCESS",
        "model_registry": "FSI-XGBoost-v1.4 & CPUE-XGBoost-v1.2",
        "empirical_interval_coverage": "92.4% Conformal (INCOIS Validation)",
        "shap_factors": factors
    }


@app.post("/api/simulate-route")
def post_simulate_route(req: RouteSimulateRequest):
    """Computes A* current-aware navigational corridor, drift velocity vector, and fuel burn."""
    route = calculate_astar_route(
        origin_lat=req.origin_lat or 9.93,
        origin_lon=req.origin_lon or 76.26,
        target_lat=req.target_lat,
        target_lon=req.target_lon,
        cruising_speed_kts=req.cruising_speed_kts or 9.5,
        burn_rate_lph=req.burn_rate_lph or 5.5
    )
    return {
        "status": "SUCCESS",
        "route_telemetry": route
    }


@app.post("/api/what-if")
def post_what_if(req: WhatIfRequest):
    """Simulates multi-objective re-ranking based on custom operational constraints."""
    result = run_what_if_simulation(
        species=req.species,
        max_distance_km=req.max_distance_km,
        fuel_budget_liters=req.fuel_budget_liters,
        risk_tolerance=req.risk_tolerance,
        time_window=req.time_window,
        vessel_id=req.vessel_id or "artisanal_motorboat"
    )
    return result


@app.get("/api/provenance")
def get_provenance():
    """Returns authoritative sensor lineage, concordance score, and HITL escalation thresholds."""
    return get_provenance_audit_trail()


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3000))
    print(f"Starting Aqua Guardian 8-Agent Swarm Backend on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
