from fastapi import FastAPI

from app.schemas import PredictionRequest

from app.model_loader import (
    model,
    tokenizer
)

from app.utils import predict_text

app = FastAPI(
    title="Multi Label NLP API",
    version="1.0"
)


@app.get("/")
def root():
    return {
        "message": "Multi Label NLP API Running"
    }


@app.post("/predict")
def predict(data: PredictionRequest):

    result = predict_text(
        text=data.text,
        model=model,
        tokenizer=tokenizer
    )

    return result