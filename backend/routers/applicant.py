from datetime import datetime, timedelta
from uuid import uuid4

from fastapi import APIRouter, Depends, Form, HTTPException, Request, UploadFile
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..config.settings import JWT_ALGORITHM, JWT_EXPIRE_MINS, JWT_SECRET
from ..database.connection import AsyncSessionLocal, get_db, get_mongo_db
from ..database.models import (
    ConsentLog,
    ConsentRecord,
    DocumentUploadRecord,
    LoanApplication,
    PipelineCheckpoint,
    User,
)
from ..graph.workflow import build_initial_state, run_pipeline_background
from ..schemas.application import ApplicationResponse, DocumentUploadResponse, LoanApplicationCreate
from ..schemas.auth import LoginRequest, SessionResponse
from ..schemas.pipeline import PipelineRunRequest
from ..services.storage import encrypt_upload

router = APIRouter(prefix="/api", tags=["applicant"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/auth/login", response_model=SessionResponse)
async def login(payload: LoginRequest, request: Request) -> SessionResponse:
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == payload.email))
        user = result.scalars().first()
        if user and user.password_hash and not pwd_context.verify(payload.password, user.password_hash):
            raise HTTPException(status_code=401, detail="invalid credentials")
        if user is None:
            user = User(
                name=payload.email.split("@")[0],
                email=payload.email,
                role="applicant",
                password_hash=pwd_context.hash(payload.password),
            )
            db.add(user)
            await db.flush()

        db.add(
            ConsentLog(
                user_id=user.id,
                applicant_id=payload.dpdp_consent.applicant_id,
                consent_version=payload.dpdp_consent.version,
                purpose=payload.dpdp_consent.purpose,
                timestamp=payload.dpdp_consent.timestamp.replace(tzinfo=None),
                ip_address=request.client.host if request.client else None,
            )
        )
        await db.commit()

    consent = ConsentRecord(
        applicant_id=payload.dpdp_consent.applicant_id,
        email=payload.email,
        version=payload.dpdp_consent.version,
        purpose=payload.dpdp_consent.purpose,
        timestamp=payload.dpdp_consent.timestamp,
    )
    try:
        mongo_db = get_mongo_db()
        if mongo_db is not None:
            await mongo_db.consents.insert_one(consent.model_dump(mode="json"))
    except Exception:
        pass

    expires = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINS)
    token = jwt.encode({"sub": payload.email, "role": user.role, "exp": expires}, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return SessionResponse(access_token=token, role=user.role, applicant_id=payload.dpdp_consent.applicant_id)


@router.post("/applications", response_model=ApplicationResponse)
async def create_application(payload: LoanApplicationCreate, db: AsyncSession = Depends(get_db)) -> ApplicationResponse:
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalars().first()
    if user is None:
        user = User(name=payload.full_name, email=payload.email, mobile=payload.mobile, address=payload.address)
        db.add(user)
        await db.flush()

    pipeline_id = str(uuid4())
    application = LoanApplication(
        user_id=user.id,
        loan_type=payload.loan_type,
        amount=payload.loan_amount,
        purpose=payload.loan_purpose,
        tenure_months=payload.tenure,
        emi=payload.calculated_emi,
        pipeline_id=pipeline_id,
    )
    db.add(application)
    await db.commit()
    await db.refresh(application)
    return ApplicationResponse(id=application.id, pipeline_id=pipeline_id, status="ready_for_upload")


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile,
    docType: str = Form(...),
    pipeline_id: str = Form(...),
    applicant_email: str = Form(""),
) -> DocumentUploadResponse:
    encrypted_path, size = await encrypt_upload(file, pipeline_id)
    record = DocumentUploadRecord(
        pipeline_id=pipeline_id,
        applicant_email=applicant_email,
        doc_type=docType,
        file_name=file.filename or "upload",
        encrypted_path=str(encrypted_path),
        content_type=file.content_type or "application/octet-stream",
        size_bytes=size,
    )
    try:
        mongo_db = get_mongo_db()
        if mongo_db is not None:
            await mongo_db.documents.insert_one(record.model_dump(mode="json"))
    except Exception:
        pass
    return DocumentUploadResponse(
        pipeline_id=pipeline_id,
        filename=file.filename or "upload",
        doc_type=docType,
        status="ready_to_process",
        encrypted_path=str(encrypted_path),
    )


@router.post("/pipeline/run")
async def trigger_pipeline(payload: PipelineRunRequest):
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(LoanApplication, User)
            .join(User, LoanApplication.user_id == User.id)
            .where(LoanApplication.pipeline_id == payload.pipeline_id)
        )
        row = result.first()
        if row is None:
            raise HTTPException(status_code=404, detail="pipeline not found")
        application, user = row

    try:
        mongo_db = get_mongo_db()
        if mongo_db is not None:
            cursor = mongo_db.documents.find({"pipeline_id": payload.pipeline_id})
            docs = [doc async for doc in cursor]
        else:
            docs = []
    except Exception:
        docs = []

    state = build_initial_state(
        pipeline_id=payload.pipeline_id,
        applicant_email=user.email,
        file_paths=[doc["encrypted_path"] for doc in docs if doc.get("encrypted_path")],
        loan_amount=application.amount,
        loan_tenure_months=application.tenure_months,
        loan_purpose=application.purpose or "",
        is_demo=payload.is_demo,
    )
    run_pipeline_background(state)
    return {"status": "started", "pipeline_id": payload.pipeline_id}


@router.get("/pipeline/{pipeline_id}/status")
async def pipeline_status(pipeline_id: str):
    async with AsyncSessionLocal() as db:
        checkpoint = await db.get(PipelineCheckpoint, pipeline_id)
        if checkpoint is None:
            raise HTTPException(status_code=404, detail="checkpoint not found")
        return {"pipeline_id": pipeline_id, "status": checkpoint.status, "state": checkpoint.state_json}
