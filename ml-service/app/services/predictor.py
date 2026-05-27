"""
Predictor service — orchestrates the full NLP pipeline.
Replace dummy logic with actual TensorFlow model inference.
"""
from typing import Optional


def run_prediction(text: str, kabupaten_kota: Optional[str], kecamatan: Optional[str]):
    """
    Full prediction pipeline:
    1. Preprocess text
    2. Run classifier (multi-label, 10 categories)
    3. Run sentiment analysis
    4. Run urgency detection
    5. Extract location via NER
    6. Calculate priority score
    7. Assign cluster
    """
    # TODO: Import and use actual models
    # from app.services.preprocessor import preprocess
    # from app.models.classifier import ClassifierModel
    # from app.models.sentiment import SentimentModel
    # from app.models.urgency import UrgencyModel
    # from app.models.ner_geo import NERGeoModel
    # from app.models.clustering import ClusteringModel

    # Placeholder response
    return {
        "categories": ["infrastruktur"],
        "sentiment": "negatif",
        "sentiment_score": 0.87,
        "urgency": "tinggi",
        "urgency_score": 0.92,
        "priority_score": 88.0,
        "extracted_location": kabupaten_kota or "Unknown",
        "cluster_id": "cluster_12",
    }
