from fastapi import FastAPI
from pydantic import BaseModel
from backend.Simulation import HawkesProcess
from backend.FitModel import FitHawkesModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


origins = [
    "https://lambdalab.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
