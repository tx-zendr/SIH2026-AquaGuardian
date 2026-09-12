# Aqua Guardian (Project ORCA) — ISRO SIH 2026 (PS 26176)
> **Ocean Ecosystem Reasoning with Collaborative Agents (LangGraph + Gemini 3.6 Flash)**  
> *"AI Predicts. Deterministic Rules Protect. GIS Constrains. LangGraph Orchestrates."*

---

## 🌟 Presentation Demo Highlights for Judges

1. **Interactive Real GIS Leaflet Map**
   - Click anywhere on the Indian Ocean or coast to drop an animated sonar pin.
   - Spatial coordinates `(Lat, Lon)` are automatically parsed and sent to the **LangGraph Agent Swarm**.
   - Dynamic A* navigational lines are rendered from Kochi Harbour to the target sector.
   - Interactive toggles for:
     - **PFZ Fishing Zones** (Green thermal front polygons with +4.5x catch estimation)
     - **IMBL Border Line** (Red dashed international border with Sri Lanka + 5 NM safety buffer)
     - **MPA Eco Reserves** (Gulf of Mannar protected zones where fishing is constrained)
     - **Cyclone Alerts** (Bay of Bengal active depression zone)
     - **Major Harbours** (Kochi, Mangaluru, Goa, Mumbai High, Rameswaram, Chennai)

2. **A* Trawler Navigational Telemetry (`Simulate Route`)**
   - Click the **"Simulate"** button on the Map Layers panel to view the full NavIC route breakdown:
     - Distance (NM)
     - Estimated Diesel Fuel (Liters)
     - Transit Duration (Hours)
     - Ocean Surface Current Benefit (+0.6 kts northward assistance)
     - Hard Geofence Violation Check: 0% overlap with MPA/IMBL.

3. **Multi-Agent DAG Provenance Chain**
   - Head to the **Agent DAG** tab to see the live **LangGraph StateGraph** topology:
     `Master Supervisor ➔ [Marine Data | Weather Hazards | PFZ ML Engine | Geospatial IMBL] ➔ Gemini Evidence Synthesis`
   - Real-time sub-millisecond execution timestamps for all 5 sub-agents.

4. **Vernacular Voice Synthesizer (Indic Speech)**
   - Select **English**, **हिंदी (Hindi)**, **മലയാളം (Malayalam)**, or **தமிழ் (Tamil)** in the top navigation bar.
   - Click the speaker icon (`🔊`) in the assistant panel — Aqua Guardian speaks the advisory aloud to the judges!

5. **Judge Scenario / Stress-Testing Mode**
   - Switch scenarios in the top navigation bar to demonstrate deterministic safety:
     - 🟢 **Normal Safe Weather**: Voyage cleared with 74.2/100 score.
     - 🟡 **High Swell Alert (3.65m)**: Waves exceed artisanal craft limit (2.5m). The **Deterministic Hard Safety Filter** blocks the AI recommendation, proving that high suitability can NEVER override physical safety!
     - 🔴 **IMBL Border Encroachment Alert**: Target point within 5 NM of international boundary triggers immediate geofence warning.

---

## 🚀 How to Run the Prototype

### 1. Environment Setup (`.env`)
Your Gemini API Key is loaded securely from the root `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 2. Start the LangGraph Python Backend
```powershell
python server.py
```
*Backend runs on `http://localhost:3000`.*

### 3. Run Standalone LangGraph in Terminal (Judges Favorite)
```powershell
python agent_graph.py
```
*Executes the compiled LangGraph StateGraph directly in your console.*

### 4. Start the Frontend
```powershell
npm run dev
```
*Open [http://localhost:5173/](http://localhost:5173/) in your browser.*
