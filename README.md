# 🚀 AI Applicant Tracking System (ATS) Engine v2.0

A full-stack, cross-service AI platform that shifts resume screening from brittle string matching to context-aware semantic alignment using local deep learning models.

---

## 🏗️ System Architecture

The platform splits computational tasks across three microservices to maintain speed, separation of concerns, and clean runtime execution:

* **Frontend UI (React.js + Vite):** A fluid, full-width dashboard equipped with live concentric ring graphs, split-pane analytics, and a native **Light / Dark / System** theme toggle.
* **API Gateway (Node.js + Express):** Handles multipart form streams, extracts text arrays seamlessly from PDF buffers via `pdf-parse`, and coordinates core system payloads.
* **NLP Service (Python + Flask):** Houses the machine learning pipeline, caching a local Hugging Face **BERT Transformer** (`all-MiniLM-L6-v2`) to run vector-space mathematics.

---

## 📊 Dual-Layer Evaluation Analytics

1.  **BERT Contextual Alignment:** Employs **Cosine Similarity** to compute semantic match scores. It evaluates overall profile intent, identifying contextual matches even if candidates use differing synonyms.
2.  **Hard Skills Matrix:** Runs a clean tokenization checklist across text targets, matching core tools and outputting instant visual badges for identified capabilities and missing profile gaps.

---

## 🛠️ Quick Setup Instructions

Open three separate terminal tabs and run the following sequences:

### 1. Python NLP Service (`:8000`)
```powershell
cd ml-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install torch sentence-transformers flask flask-cors
python parser.py
