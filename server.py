"""
Aqua Guardian FastAPI Backend
Runs the LangGraph Multi-Agent Engine and serves the REST API
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

from agent_graph import run_orchestration

app = FastAPI(title="Aqua Guardian LangGraph Backend", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    prompt: str
    lat: Optional[float] = 9.93
    lon: Optional[float] = 76.26
    lang: Optional[str] = "en"
    scenario: Optional[str] = "normal"
    apiKey: Optional[str] = None

@app.get("/api/health")
def health():
    return {
        "status": "online",
        "engine": "LangGraph StateGraph",
        "model": "Gemini 1.5 Flash (via .env)",
        "version": "2.0.0"
    }

@app.post("/api/orchestrate")
def orchestrate(req: QueryRequest):
    if req.apiKey and len(req.apiKey) > 5:
        os.environ["GEMINI_API_KEY"] = req.apiKey

    result = run_orchestration(
        query=req.prompt,
        lat=req.lat if req.lat is not None else 9.93,
        lon=req.lon if req.lon is not None else 76.26,
        lang=req.lang or "en",
        scenario=req.scenario or "normal"
    )
    return result

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3000))
    print(f"Starting Aqua Guardian LangGraph Backend on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
