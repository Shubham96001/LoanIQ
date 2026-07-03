import datetime
import uuid
from typing import Any, Literal

from pydantic import BaseModel, Field
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship

from .connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    mobile = Column(String(20))
    address = Column(String(500))
    aadhaar = Column(String(20))
    pan = Column(String(10))
    role = Column(String(20), default="applicant")
    password_hash = Column(String(128), nullable=False, default="")

    applications = relationship("LoanApplication", back_populates="user", lazy="selectin")
    consents = relationship("ConsentLog", back_populates="user", lazy="selectin")


class LoanApplication(Base):
    __tablename__ = "loan_applications"

    id = Column(String, primary_key=True, default=lambda: f"LIQ-{uuid.uuid4().hex[:5].upper()}")
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    loan_type = Column(String(80), nullable=False)
    amount = Column(Float, nullable=False)
    purpose = Column(String(500))
    tenure_months = Column(Integer, nullable=False)
    emi = Column(Float, default=0.0)
    status = Column(String(50), default="Submitted")
    progress = Column(Integer, default=1)
    pipeline_id = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="applications")


class PipelineCheckpoint(Base):
    __tablename__ = "pipeline_checkpoints"

    pipeline_id = Column(String, primary_key=True)
    state_json = Column(JSON, nullable=False)
    status = Column(String(30), default="running")
    officer_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class ConsentLog(Base):
    __tablename__ = "consent_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    applicant_id = Column(String, nullable=False)
    consent_version = Column(String(50), nullable=False)
    purpose = Column(String(500), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    ip_address = Column(String(50))
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="consents")


class ConsentRecord(BaseModel):
    applicant_id: str
    email: str
    version: Literal["DPDP_ACT_2023_V1"]
    purpose: str
    timestamp: datetime.datetime
    recorded_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)


class DocumentUploadRecord(BaseModel):
    pipeline_id: str
    applicant_email: str
    doc_type: str
    file_name: str
    encrypted_path: str
    content_type: str
    size_bytes: int
    status: Literal["uploaded"] = "uploaded"
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)


class PipelineReportRecord(BaseModel):
    pipeline_id: str
    state: dict[str, Any]
    status: str
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
