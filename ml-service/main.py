from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(
    title="ADUIN ML Service",
    description="NLP Pipeline untuk klasifikasi, sentimen, dan urgensi pengaduan",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    text: str
    kabupaten_kota: Optional[str] = None
    kecamatan: Optional[str] = None


class PredictResponse(BaseModel):
    categories: List[str]
    sentiment: str
    sentiment_score: float
    urgency: str
    urgency_score: float
    priority_score: float
    extracted_location: Optional[str] = None
    cluster_id: Optional[str] = None


@app.get("/health")
def health():
    return {"status": "ok", "service": "ADUIN ML Service"}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    # TODO: Replace with actual model inference
    # This is a placeholder that returns dummy data
    from app.services.predictor import run_prediction
    result = run_prediction(req.text, req.kabupaten_kota, req.kecamatan)
    return result


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
