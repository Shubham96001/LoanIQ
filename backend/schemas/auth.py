from datetime import datetime, timedelta
from typing import Literal

from pydantic import BaseModel, EmailStr, field_validator


class DPDPConsentToken(BaseModel):
    applicant_id: str
    timestamp: datetime
    version: Literal["DPDP_ACT_2023_V1"]
    purpose: str

    @field_validator("timestamp")
    @classmethod
    def consent_must_be_recent(cls, value: datetime) -> datetime:
        now = datetime.utcnow().replace(tzinfo=value.tzinfo)
        if value > now + timedelta(minutes=5):
            raise ValueError("consent timestamp cannot be in the future")
        if now - value > timedelta(hours=24):
            raise ValueError("consent token is expired")
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    dpdp_consent: DPDPConsentToken


class SessionResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    role: str
    applicant_id: str
