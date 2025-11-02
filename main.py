"""
CodeOptim Platform Backend
Real-time code optimization experiments with Captain + Morph + Metorial
"""

import asyncio
import os
import json
import uuid
from typing import Dict, List, Optional, Any
from datetime import datetime

from fastapi import FastAPI, WebSocket, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.ENV')

# Import our services
from services.captain_service import CaptainService
from services.morph_service import MorphService
from services.metorial_service import MetorialService

app = FastAPI(title="CodeOptim Platform API", version="1.0.0")

# CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global services
captain_service = CaptainService()
morph_service = MorphService()
metorial_service = MetorialService()

# Active experiments storage
active_experiments: Dict[str, Dict] = {}

# Pydantic models
class ExperimentRequest(BaseModel):
    code: str
    language: str
    target: str  # "Performance", "Memory Usage", "Code Readability", "Security"
    variants: int = 50
    iterations: int = 1000
    settings: Optional[Dict] = {}

class ExperimentResponse(BaseModel):
    experiment_id: str
    status: str

@app.get("/")
async def root():
    return {"message": "CodeOptim Platform API", "status": "running"}

@app.post("/api/experiment/start", response_model=ExperimentResponse)
async def start_experiment(
    request: ExperimentRequest,
    background_tasks: BackgroundTasks
):
    """Start a new code optimization experiment"""
    experiment_id = str(uuid.uuid4())
    
    # Initialize experiment state
    experiment_data = {
        "id": experiment_id,
        "status": "initializing",
        "request": request.dict(),
        "created_at": datetime.now().isoformat(),
        "variants": [],
        "results": None,
        "progress": 0
    }
    
    active_experiments[experiment_id] = experiment_data
    
    # Start experiment in background
    background_tasks.add_task(run_experiment, experiment_id, request)
    
    return ExperimentResponse(experiment_id=experiment_id, status="started")

async def run_experiment(experiment_id: str, request: ExperimentRequest):
    """Run the optimization experiment"""
    try:
        experiment = active_experiments[experiment_id]
        experiment["status"] = "analyzing"
        
        # Step 1: Analyze code with Captain
        print(f"🧠 Analyzing code with Captain for experiment {experiment_id}")
        analysis = await captain_service.analyze_code(
            request.code, 
            request.language, 
            request.target
        )
        
        experiment["analysis"] = analysis
        experiment["status"] = "researching"
        
        # Step 2: Research optimization techniques with Metorial + Exa
        print(f"🔍 Researching optimization techniques with Metorial")
        research = await metorial_service.research_optimizations(
            request.language,
            request.target,
            analysis.get("patterns", [])
        )
        
        experiment["research"] = research
        experiment["status"] = "generating"
        
        # Step 3: Generate variants with Morph
        print(f"⚡ Generating {request.variants} variants with Morph")
        variants = []
        
        for i in range(request.variants):
            experiment["progress"] = int((i / request.variants) * 100)
            
            # Generate variant using Morph Fast Apply
            variant = await morph_service.generate_variant(
                request.code,
                analysis,
                research,
                i + 1
            )
            
            # Simulate performance testing
            performance = simulate_performance_test(variant["code"], request.iterations)
            
            variant_data = {
                "id": i + 1,
                "name": variant["name"],
                "code": variant["code"],
                "description": variant["description"],
                "performance": performance,
                "timestamp": datetime.now().isoformat()
            }
            
            variants.append(variant_data)
            experiment["variants"] = variants
            
            # Simulate processing delay
            await asyncio.sleep(0.1)
        
        # Step 4: Find best variant
        best_variant = max(variants, key=lambda v: v["performance"]["improvement_percent"])
        
        experiment["status"] = "completed"
        experiment["progress"] = 100
        experiment["results"] = {
            "best_variant": best_variant,
            "total_variants": len(variants),
            "avg_improvement": sum(v["performance"]["improvement_percent"] for v in variants) / len(variants),
            "completed_at": datetime.now().isoformat()
        }
        
        print(f"✅ Experiment {experiment_id} completed!")
        
    except Exception as e:
        print(f"❌ Experiment {experiment_id} failed: {str(e)}")
        experiment["status"] = "failed"
        experiment["error"] = str(e)

def simulate_performance_test(code: str, iterations: int) -> Dict:
    """Simulate performance testing (replace with real execution later)"""
    import random
    
    # Simulate execution time based on code complexity
    base_time = len(code) * 0.001  # Base time
    variance = random.uniform(0.5, 2.0)  # Random variance
    execution_time = base_time * variance
    
    # Simulate improvement percentage
    improvement = random.uniform(-20, 80)  # -20% to +80% improvement
    
    return {
        "execution_time_ms": round(execution_time, 3),
        "memory_usage_mb": round(random.uniform(1.0, 50.0), 2),
        "improvement_percent": round(improvement, 1),
        "iterations": iterations
    }

@app.get("/api/experiment/{experiment_id}/results")
async def get_experiment_results(experiment_id: str):
    """Get experiment results"""
    if experiment_id not in active_experiments:
        raise HTTPException(status_code=404, detail="Experiment not found")
    
    return active_experiments[experiment_id]

@app.websocket("/api/experiment/stream/{experiment_id}")
async def experiment_stream(websocket: WebSocket, experiment_id: str):
    """WebSocket endpoint for real-time experiment updates"""
    await websocket.accept()
    
    try:
        last_progress = -1
        
        while True:
            if experiment_id not in active_experiments:
                await websocket.send_json({
                    "type": "error",
                    "message": "Experiment not found"
                })
                break
            
            experiment = active_experiments[experiment_id]
            current_progress = experiment.get("progress", 0)
            
            # Send update if progress changed
            if current_progress != last_progress:
                await websocket.send_json({
                    "type": "progress",
                    "experiment_id": experiment_id,
                    "status": experiment["status"],
                    "progress": current_progress,
                    "variants_count": len(experiment.get("variants", [])),
                    "timestamp": datetime.now().isoformat()
                })
                
                last_progress = current_progress
            
            # Send completion
            if experiment["status"] in ["completed", "failed"]:
                await websocket.send_json({
                    "type": "complete",
                    "experiment_id": experiment_id,
                    "status": experiment["status"],
                    "results": experiment.get("results"),
                    "error": experiment.get("error")
                })
                break
            
            await asyncio.sleep(0.5)  # Check every 500ms
            
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)