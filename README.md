<div align="center">

# 🏦 LoanIQ Platform
**Use AI to speed up and standardize loan decisions by auto-checking documents, risk, and compliance.**

<br>

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

🌍 **Live Demo:** [loan-iq-chi.vercel.app](https://loan-iq-chi.vercel.app)

</div>

---

## 📖 Project Overview

LoanIQ is a comprehensive FastAPI + LangGraph platform paired with a React + Vite frontend. It is designed to automate and assist in the loan origination lifecycle. The platform handles AI-assisted loan intake, secure document analysis, risk scoring, compliance checking, human-in-the-loop officer review, and final decision delivery.

---

## 📂 Repository Structure

```text
📦 LoanIQ
 ┣ 📂 frontend/               # React + Vite applicant/officer UI
 ┃ ┣ 📂 src/
 ┃ ┣ 📂 public/
 ┃ ┣ 📜 package.json
 ┃ ┗ 📜 vite.config.js
 ┣ 📂 backend/                # FastAPI + LangGraph backend
 ┃ ┣ 📂 config/               # Settings and compliance_rules.yaml
 ┃ ┣ 📂 database/             # Async SQL/Mongo connection and models
 ┃ ┣ 📂 graph/                # LangGraph state and workflow
 ┃ ┣ 📂 routers/              # Applicant and officer API routes
 ┃ ┣ 📂 schemas/              # Pydantic request/response schemas
 ┃ ┣ 📂 services/             # Agents, storage, persistence, notification
 ┃ ┣ 📜 requirements.txt
 ┃ ┗ 📜 main.py
 ┗ 📜 docker-compose.yml      # Postgres and MongoDB services

```


## 🚀 Setup & Installation

### 1️⃣ Database Setup (Docker)

This project uses two databases in production:

* **PostgreSQL:** Relational data (configured via the `DATABASE_URL` env var).
* **MongoDB:** Unstructured documents/uploads (configured via `MONGO_URL` and `MONGO_DB`).

From the repository root, start Postgres and MongoDB with:

```bash
docker compose up -d

```

> **Note:** If your local machine already has PostgreSQL running on port 5432, Docker uses port 5442 for the container to avoid conflicts. Set `DATABASE_URL` accordingly before starting the backend:
> ```bash
> set DATABASE_URL=postgresql+asyncpg://user:loaniq_pass@localhost:5442/loaniq
> 
> ```
> 
> 

### 2️⃣ Backend Setup (FastAPI)

This setup installs backend dependencies into a local virtual environment rather than the global Python installation.

```bash
cd backend
python -m venv .venv

# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# On Unix/macOS:
source .venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run the server
uvicorn backend.main:app --reload

```

### 3️⃣ Frontend Setup (React)

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev

```

## ⚙️ Configuration & Architecture Notes

* **Environment Configuration:** `backend/config/settings.py` controls env-driven settings such as JWT, database URLs, AES key, and the webhook URL.
* **Compliance Rules:** `backend/config/compliance_rules.yaml` serves as the hot-swappable compliance rule file.
* **Document Security:** Uploaded documents are **AES-GCM encrypted** before writing to `secure_uploads/`.
* **Workflow Pause:** The LangGraph pipeline intentionally pauses for human officer review before triggering the final decision notification.
* **OCR Support:** If you use OCR capabilities, install Tesseract-OCR on your host and set the `TESSERACT_PATH` environment variable (or ensure `tesseract` is globally available on your system PATH). See `backend/config/settings.py` for details.


## 🔒 Public Release Guidance

* **Data Hygiene:** Demo/test artifacts (e.g., `test_docs/`) have been completely removed from the public repository.
* **Security Warning:** **Do not** commit sample documents, sensitive keys, or the `secure_uploads/` directory to source control.
