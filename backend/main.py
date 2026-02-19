"""
FastAPI backend for LambdaLab.

Provides endpoints for simulation, fitting, and model comparison.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from typing import Optional
import io
import base64
import matplotlib.pyplot as plt
from matplotlib.figure import Figure

# Import simulation and fitting modules
import sys
sys.path.insert(0, '/home/c0d3crusad3r/Project/LambdaLab')
from backend.Simulation import PoissonProcess, HawkesProcess

app = FastAPI(title="LambdaLab API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Request/Response Models ---

class SimulateRequest(BaseModel):
    mu: float
    alpha: float
    beta: float
    T: float


class SimulateResponse(BaseModel):
    n_events: int
    events: list
    mean_iat: Optional[float] = None
    std_iat: Optional[float] = None
    peak_intensity: Optional[float] = None
    plot_timeline: Optional[str] = None  # base64 encoded PNG
    plot_intensity: Optional[str] = None  # base64 encoded PNG


# --- Utility Functions ---

def fig_to_base64(fig: Figure) -> str:
    """Convert matplotlib figure to base64 PNG string."""
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight', facecolor='#0a0a0a', edgecolor='none')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)
    return f"data:image/png;base64,{img_base64}"


def plot_timeline(events: np.ndarray, T: float) -> str:
    """Create event timeline plot."""
    try:
        fig, ax = plt.subplots(figsize=(10, 2))
        ax.set_facecolor('#0a0a0a')
        fig.set_facecolor('#0a0a0a')
        
        ax.hlines(1, 0, T, colors='#6b7280', linewidth=1)
        for e in events:
            ax.axvline(float(e), color='#3b82f6', alpha=0.8, linewidth=1.5)
        
        ax.set_xlim(0, T)
        ax.set_ylim(0.5, 1.5)
        ax.set_yticks([])
        ax.set_xlabel('Time', color='#ededed', fontsize=10)
        ax.spines['left'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['top'].set_visible(False)
        ax.tick_params(colors='#ededed')
        
        return fig_to_base64(fig)
    except Exception as e:
        print(f"Error in plot_timeline: {e}")
        plt.close('all')
        return ""


def plot_intensity(times: np.ndarray, intensity: np.ndarray, events: np.ndarray, T: float) -> str:
    """Create intensity curve plot."""
    try:
        fig, ax = plt.subplots(figsize=(10, 4))
        ax.set_facecolor('#0a0a0a')
        fig.set_facecolor('#0a0a0a')
        
        ax.plot(times, intensity, color='#3b82f6', linewidth=1.5, label='Intensity')
        for e in events:
            ax.axvline(float(e), color='#6b7280', alpha=0.3, linewidth=0.8)
        
        ax.set_xlim(0, T)
        ax.set_xlabel('Time', color='#ededed', fontsize=10)
        ax.set_ylabel('Intensity λ(t)', color='#ededed', fontsize=10)
        ax.grid(True, alpha=0.1, color='#6b7280')
        ax.tick_params(colors='#ededed')
        ax.spines['left'].set_color('#6b7280')
        ax.spines['bottom'].set_color('#6b7280')
        ax.spines['right'].set_visible(False)
        ax.spines['top'].set_visible(False)
        
        return fig_to_base64(fig)
    except Exception as e:
        print(f"Error in plot_intensity: {e}")
        plt.close('all')
        return ""


# --- API Endpoints ---

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/simulate")
def simulate(req: SimulateRequest):
    """Simulate a Hawkes process and return events and plots."""
    try:
        # Handle supercritical regime
        T_run = req.T
        if req.beta > 0 and req.alpha / req.beta >= 1.0:
            T_run = min(10.0, req.T)
        
        # Simulate
        h = HawkesProcess(req.mu, req.alpha, req.beta)
        events = h.Simulate(T_run, rng=np.random)
        
        n_events = len(events)
        mean_iat = None
        std_iat = None
        events_list = [float(e) for e in events]  # Convert numpy to list
        
        if n_events >= 2:
            iats = np.diff(events)
            mean_iat = float(np.mean(iats))
            std_iat = float(np.std(iats))
        
        # Compute intensity
        times, intens = h.GetIntensityCurve(T_run, n_points=1000, events=events)
        peak_intensity = float(np.max(intens)) if len(intens) > 0 else None
        
        # Generate plots
        plot_timeline_b64 = plot_timeline(events, T_run)
        plot_intensity_b64 = plot_intensity(times, intens, events, T_run)
        
        return {
            "n_events": n_events,
            "events": events_list,
            "mean_iat": mean_iat,
            "std_iat": std_iat,
            "peak_intensity": peak_intensity,
            "plot_timeline": plot_timeline_b64,
            "plot_intensity": plot_intensity_b64,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
