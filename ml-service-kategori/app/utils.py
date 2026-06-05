from tensorflow.keras.preprocessing.sequence import pad_sequences
import tensorflow as tf
import numpy as np

MAX_LEN = 120
BEST_THRESHOLD = 0.3

label_cols = [
    'kategori_infrastruktur',
    'kategori_lingkungan',
    'kategori_air_sanitasi',
    'kategori_bencana',
    'kategori_transportasi',
    'kategori_pelayanan_publik',
    'kategori_ekonomi',
    'kategori_keamanan',
    'kategori_pendidikan',
    'kategori_kesehatan'
]

def predict_text(text, model, tokenizer):

    # preprocessing
    seq = tokenizer.texts_to_sequences([text])

    pad = pad_sequences(
        seq,
        maxlen=MAX_LEN,
        padding='post',
        truncating='post'
    )

    # predict
    pred = model.predict(pad, verbose=0)[0]

    # semua probabilitas
    all_probs = {}

    for i, prob in enumerate(pred):

        all_probs[label_cols[i]] = float(prob)

    # filter threshold
    predictions = []

    for i, prob in enumerate(pred):

        if prob >= BEST_THRESHOLD:
            predictions.append({
                "label": label_cols[i],
                "probability": round(float(prob), 4)
            })

    # urutkan
    predictions = sorted(
        predictions,
        key=lambda x: x["probability"],
        reverse=True
    )

    return {
        "success": True,
        "input_text": text,
        "threshold": BEST_THRESHOLD,
        "predictions": predictions,
        "all_probabilities": all_probs
    }