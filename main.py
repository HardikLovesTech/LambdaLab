from fastapi import FastAPI
from pydantic import BaseModel
from backend.Simulation import HawkesProcess
from backend.FitModel import FitHawkesModel

app = FastAPI()

class SimulationRequest(BaseModel):
    Mu: float
    Alpha: float
    Beta: float
    T: float

@app.post("/simulate")
def SimulateProcess(Request: SimulationRequest):
    Process = HawkesProcess(Request.Mu, Request.Alpha, Request.Beta)
    EventTimes, IntensityTimes, IntensityValues = Process.Simulate(Request.T)

    return {
        "EventTimes": EventTimes,
        "IntensityTimes": IntensityTimes,
        "IntensityValues": IntensityValues
    }
