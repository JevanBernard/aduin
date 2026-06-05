# Multi Label NLP API

API untuk klasifikasi multi-label teks keluhan/laporan menggunakan Natural Language Processing (NLP) dan Deep Learning berbasis TensorFlow + FastAPI.

API ini dapat mengklasifikasikan satu keluhan ke dalam satu atau lebih kategori sekaligus.

---

# Base URL

https://keluhan-multilabel-classification-api-production.up.railway.app


---

# Tech Stack

- FastAPI
- TensorFlow
- Keras
- NLP
- Multi-label Classification
- Railway Deployment

---

# Available Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API status |
| POST | `/predict` | Predict text categories |

---

# Root Endpoint

## Request

```http
GET /
```

## Response

```json
{
  "message": "Multi Label NLP API Running"
}
```

---

# Predict Endpoint

Endpoint untuk melakukan prediksi kategori pada teks input.

## Endpoint

```http
POST /predict
```

## Full URL

https://keluhan-multilabel-classification-api-production.up.railway.app/predict

---

# Request Body

| Field | Type | Required | Description |
|---|---|---|---|
| text | string | Yes | Teks keluhan/laporan |

## Example Request Body

```json
{
  "text": "tolong kepolisian segera tangkap pelaku pencurian motor di kawasan x"
}
```

---

# Example Using cURL

```bash
curl -X 'POST' \
  'https://keluhan-multilabel-classification-api-production.up.railway.app/predict' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "text": "tolong kepolisian segera tangkap pelaku pencurian motor di kawasan x"
}'
```

---

# Example Response

```json
{
  "success": true,
  "input_text": "tolong kepolisian segera tangkap pelaku pencurian motor di kawasan x",
  "threshold": 0.3,
  "predictions": [
    {
      "label": "kategori_keamanan",
      "probability": 0.9943
    }
  ],
  "all_probabilities": {
    "kategori_infrastruktur": 0.000977160525508225,
    "kategori_lingkungan": 1.5245383622186637e-8,
    "kategori_air_sanitasi": 0.000004558525688480586,
    "kategori_bencana": 0.000013083850717521273,
    "kategori_transportasi": 0.0005465957219712436,
    "kategori_pelayanan_publik": 0.00015118648298084736,
    "kategori_ekonomi": 0.00009934788249665871,
    "kategori_keamanan": 0.9942640662193298,
    "kategori_pendidikan": 0.03578832000494003,
    "kategori_kesehatan": 0.020815109834074974
  }
}
```

---

# Response Explanation

| Field | Description |
|---|---|
| success | Status prediksi berhasil |
| input_text | Teks input dari pengguna |
| threshold | Nilai threshold klasifikasi |
| predictions | Kategori yang lolos threshold |
| all_probabilities | Semua probabilitas kategori |

---

# Available Categories

| Label | Description |
|---|---|
| kategori_infrastruktur | Infrastruktur umum |
| kategori_lingkungan | Lingkungan dan kebersihan |
| kategori_air_sanitasi | Air dan sanitasi |
| kategori_bencana | Bencana alam |
| kategori_transportasi | Transportasi |
| kategori_pelayanan_publik | Pelayanan publik |
| kategori_ekonomi | Ekonomi |
| kategori_keamanan | Keamanan dan kriminalitas |
| kategori_pendidikan | Pendidikan |
| kategori_kesehatan | Kesehatan |

---

# Interactive API Documentation

Swagger UI tersedia di:

https://keluhan-multilabel-classification-api-production.up.railway.app/docs


---

# Project Structure

```text
app/
│
├── main.py
├── model_loader.py
├── utils.py
├── schemas.py
│
model/
│
├── model_cpu.keras
└── tokenizer.pkl
```

---

# Local Development

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Run FastAPI

```bash
uvicorn app.main:app --reload
```

---

# Local API URL

```text
http://127.0.0.1:8000
```

---

# Author
Muhammad Syukron Jazila

Developed for Multi-label NLP Classification Project using TensorFlow and FastAPI.

---


# 📄 License

Licensed under [MIT License](https://github.com/syukronJazila/parkour-ruokrap/blob/main/LICENSE)

Silakan digunakan, dipelajari, dimodifikasi, dan dikembangkan kembali dengan tetap mencantumkan atribusi kepada pembuat proyek.
