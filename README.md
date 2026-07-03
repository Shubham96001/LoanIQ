# LoanIQ Platform

LoanIQ is a FastAPI + LangGraph platform with a React + Vite frontend for AI-assisted loan intake, document analysis, risk scoring, compliance checks, officer review, and final decision delivery.

## Structure

```text
LoanIQ/
├── frontend/                 # React + Vite applicant/officer UI
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/                  # FastAPI + LangGraph backend
│   ├── config/               # Settings and compliance_rules.yaml
│   ├── database/             # Async SQL/Mongo connection and models
│   ├── graph/                # LangGraph state and workflow
│   ├── routers/              # Applicant and officer API routes
│   ├── schemas/              # Pydantic request/response schemas
│   ├── services/             # Agents, storage, persistence, notification
│   ├── requirements.txt
│   └── main.py
└── docker-compose.yml        # Postgres and MongoDB services
```

## Run

Backend:

```bash
cd backend
python -m venv .venv
# On Windows PowerShell
.\.venv\Scripts\Activate.ps1
# On Unix/macOS
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

This setup installs backend dependencies into a local virtual environment rather than the global Python installation.

Frontend:

```bash
cd frontend
npm install
npm run dev
```

From the repository root, start Postgres and MongoDB with:

```bash
docker compose up -d
```

If your local machine already has PostgreSQL running on port `5432`, Docker uses port `5442` for the container to avoid conflicts.
Set `DATABASE_URL` accordingly before starting the backend:

```bash
set DATABASE_URL=postgresql+asyncpg://user:loaniq_pass@localhost:5442/loaniq
```

## Notes

- `backend/config/settings.py` controls env-driven settings such as JWT, database URLs, AES key, and webhook URL.
- `backend/config/compliance_rules.yaml` is the hot-swappable compliance rule file.
- Uploaded documents are AES-GCM encrypted before writing to `secure_uploads/`.
- The pipeline pauses for officer review before final decision notification.

## Public release guidance

- Demo/test artifacts (e.g. `test_docs/`) have been removed from the public repository. Do not commit sample documents or `secure_uploads/` to source control.
- This project uses two databases in production:
	- PostgreSQL (relational data) — configured via the `DATABASE_URL` env var.
	- MongoDB (unstructured documents/uploads) — configured via `MONGO_URL` and `MONGO_DB`.
- Use `docker compose up -d` to run both Postgres and MongoDB locally (see `docker-compose.yml`).
- If you use OCR, install Tesseract-OCR on your host and set `TESSERACT_PATH` env var (or ensure `tesseract` is on PATH). See `backend/config/settings.py`.
