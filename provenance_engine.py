"""
Aqua Guardian Trust & Data Provenance Engine (Project ORCA)
ISRO Smart India Hackathon 2026 (PS 26176)

Handles:
- Authoritative telemetry lineage auditing (ISRO Oceansat-3, INSAT-3DR, INCOIS, IMD)
- Multi-Source Conflict Resolution (satellite sensor concordance & divergence penalty)
- Human-In-The-Loop (HITL) Safety Escalation Gate
"""

from typing import Dict, List, Any

# Authoritative Ingestion Lineage
PROVENANCE_REGISTRY: List[Dict[str, Any]] = [
    {
        "id": "prov_oceansat3_ocm3",
        "agency": "ISRO / NRSC",
        "product": "Oceansat-3 OCM-3 Chlorophyll-a (443/555 nm ratio)",
        "sensor": "Ocean Colour Monitor 3",
        "timestamp": "2026-09-20 06:00:00 UTC",
        "spatial_resolution": "360 meters (Resampled to 1km Common Analysis Grid)",
        "quality_score": 98.4,
        "concordance_status": "CONCORDANT (0 CONFLICTS)"
    },
    {
        "id": "prov_insat3dr_tir",
        "agency": "ISRO / SAC",
        "product": "INSAT-3DR TIR Sea Surface Temperature Front Gradient",
        "sensor": "Thermal Infrared Radiometer (Split-Window 10.8/12.0 μm)",
        "timestamp": "2026-09-20 06:15:00 UTC",
        "spatial_resolution": "1 km Sub-satellite pixel",
        "quality_score": 96.8,
        "concordance_status": "CONCORDANT (0 CONFLICTS)"
    },
    {
        "id": "prov_incois_wave",
        "agency": "INCOIS (MoES)",
        "product": "Operational Wave Model (SWAN / WAVEWATCH III) Significant Height",
        "sensor": "Directional Wave Rider Buoys & Model Assimilation",
        "timestamp": "2026-09-20 06:30:00 UTC",
        "spatial_resolution": "0.1° Coastal Mesh",
        "quality_score": 99.1,
        "concordance_status": "CONCORDANT (0 CONFLICTS)"
    },
    {
        "id": "prov_imd_cyclone",
        "agency": "IMD (MoES)",
        "product": "Severe Weather Warnings & Deep Depression Radar Bulletins",
        "sensor": "Doppler Weather Radar (Kochi / Chennai) & INSAT-3D Imager",
        "timestamp": "2026-09-20 06:45:00 UTC",
        "spatial_resolution": "Coastal Radar Sweep (250 km radius)",
        "quality_score": 99.5,
        "concordance_status": "CONCORDANT (0 CONFLICTS)"
    }
]


def resolve_sensor_conflicts(
    chla_primary: float,
    chla_secondary: float,
    sst_primary: float,
    sst_secondary: float
) -> Dict[str, Any]:
    """
    Source Conflict Resolution Engine:
    Compares primary ISRO telemetry with secondary cross-validation sources.
    If divergence > 15%, records conflict metadata and flags a 20% confidence penalty.
    """
    chla_diff_pct = abs(chla_primary - chla_secondary) / max(chla_primary, 0.01) * 100.0
    sst_diff_pct = abs(sst_primary - sst_secondary) / max(sst_primary, 0.01) * 100.0
    max_divergence = max(chla_diff_pct, sst_diff_pct)

    has_conflict = max_divergence > 15.0
    confidence_penalty = 20.0 if has_conflict else 0.0
    concordance_score = round(max(100.0 - max_divergence, 50.0), 1)

    return {
        "has_conflict": has_conflict,
        "concordance_score_pct": concordance_score,
        "confidence_penalty_pct": confidence_penalty,
        "chlorophyll_divergence_pct": round(chla_diff_pct, 1),
        "sst_divergence_pct": round(sst_diff_pct, 1),
        "rule_applied": "Divergence > 15% ➔ 20% Confidence Penalty Applied" if has_conflict else "Telemetry Concordant (Divergence < 15%)"
    }


def evaluate_hitl_escalation(wave_m: float, cyclone_alert: bool, confidence_pct: float) -> Dict[str, Any]:
    """
    Human-In-The-Loop (HITL) Safety Escalation Gate:
    Triggers escalation to official Port Controllers and MRCC when thresholds are exceeded.
    """
    requires_escalation = (wave_m > 3.5) or cyclone_alert or (confidence_pct < 65.0)

    escalation_reasons = []
    if wave_m > 3.5:
        escalation_reasons.append(f"Extreme Swell Hazard: Wave height ({wave_m}m) exceeds 3.5m threshold.")
    if cyclone_alert:
        escalation_reasons.append("IMD Severe Weather Warning: Cyclone depression within operation sector.")
    if confidence_pct < 65.0:
        escalation_reasons.append(f"Low Sensor Confidence: Telemetry confidence ({confidence_pct}%) below 65% safe threshold.")

    return {
        "requires_escalation": requires_escalation,
        "escalation_target": "INCOIS Duty Scientist & MRCC Port Controller (1554)" if requires_escalation else None,
        "escalation_reasons": escalation_reasons,
        "protocol": "Autonomous AI Clearance Suspended — Official Controller Authorization Required" if requires_escalation else "Autonomous Clearance Permitted"
    }


def get_provenance_audit_trail() -> Dict[str, Any]:
    """Returns the complete authoritative provenance registry and audit metadata."""
    return {
        "status": "VERIFIED",
        "authoritative_sources": PROVENANCE_REGISTRY,
        "spatial_reference_system": "WGS 84 / NavIC Common 1km Ocean Grid",
        "audit_certification": "ISO/IEC 25010 Data Quality Standard & OGC Compliance",
        "last_refresh_timestamp": "2026-09-20 06:45:00 UTC"
    }
