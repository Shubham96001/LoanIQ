"""
config.py — Centralised environment-driven constants.
All secrets must be injected via environment variables.
Never hard-code credentials here.
"""
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

# ── App ───────────────────────────────────────────────────────────────────────
APP_TITLE       = "LoanIQ API"
APP_VERSION     = "2.0.0"
ALLOWED_ORIGINS = [origin.strip() for origin in os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000",
).split(",") if origin.strip()]

# ── Databases ─────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_SQLITE_DB = BASE_DIR / "loaniq.sqlite3"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite+aiosqlite:///{DEFAULT_SQLITE_DB}")
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
MONGO_DB  = os.getenv("MONGO_DB", "loaniq")

# ── Storage ───────────────────────────────────────────────────────────────────
UPLOAD_DIR = (BASE_DIR / os.getenv("UPLOAD_DIR", "secure_uploads")).resolve()
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
AES_KEY_HEX      = os.getenv("AES_KEY_HEX", "0" * 64)   # 32-byte key as 64-char hex
ALLOWED_MIMETYPES = {"application/pdf", "image/jpeg", "image/png", "image/tiff"}
MAX_FILE_BYTES    = 10 * 1024 * 1024  # 10 MB

# ── Auth / DPDP ───────────────────────────────────────────────────────────────
JWT_SECRET      = os.getenv("JWT_SECRET", "change-me-in-production")
JWT_ALGORITHM   = "HS256"
JWT_EXPIRE_MINS = int(os.getenv("JWT_EXPIRE_MINS", "60"))

# ── Financial rules ───────────────────────────────────────────────────────────
INTEREST_RATE_PA   = 0.1075   # 10.75% p.a. reference rate
MAX_FOIR           = 0.50     # RBI retail lending cap
MIN_DSCR           = 1.25
MIN_CREDIT_SCORE   = 650
EXTRACTION_VARIANCE_THRESHOLD = 0.30   # 30 % variance → low confidence

# ── Compliance rules file ─────────────────────────────────────────────────────
COMPLIANCE_RULES_PATH = Path(__file__).parent / "compliance_rules.yaml"

# ── Mistral / LLM ─────────────────────────────────────────────────────────────
MISTRAL_BASE_URL = os.getenv("MISTRAL_BASE_URL", "http://localhost:11434")
MISTRAL_MODEL    = os.getenv("MISTRAL_MODEL",    "mistral")
# ── OCR / Document Processing ─────────────────────────────────────────────────
TESSERACT_PATH = os.getenv("TESSERACT_PATH", "")  # Path to tesseract.exe (Windows) or tesseract (Linux/Mac)
# If not set, pytesseract will try to find it in system PATH
# Windows example: C:\Program Files\Tesseract-OCR\tesseract.exe
# Linux: /usr/bin/tesseract or just 'tesseract' if in PATH
# ── Webhook ───────────────────────────────────────────────────────────────────
APPLICANT_WEBHOOK_URL = os.getenv("APPLICANT_WEBHOOK_URL", "")
