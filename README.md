# 🏛️ ADUIN — Analisis Digital Untuk Insight Nusantara

> *"Aduin aja, biar AI yang urus"*

Platform berbasis AI yang mengumpulkan, mengklasifikasi, dan memprioritaskan pengaduan masyarakat secara cerdas untuk pemerintah daerah.

**Tema:** Inclusive & Resilient Communities | **Tim:** CC26-PSU299

## 📁 Struktur Repository

```
aduin/
├── frontend/          → React + Vite (Form Warga + Dashboard Admin)
├── backend/           → Express.js RESTful API + PostgreSQL
├── ml-service/        → FastAPI + TensorFlow NLP Pipeline
├── ds-dashboard/      → Streamlit Analytics Dashboard
└── docs/              → Dokumentasi proyek
```

## 🚀 Quick Start

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && npm install && npx prisma db push && npm run dev

# ML Service
cd ml-service && pip install -r requirements.txt && uvicorn main:app --reload

# DS Dashboard
cd ds-dashboard && pip install -r requirements.txt && streamlit run app.py
```

## 🔀 Branching: main ← develop ← feat/[nama-fitur]
