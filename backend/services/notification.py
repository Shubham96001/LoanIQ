from datetime import datetime
from typing import Any

import httpx
from jose import jwt

from ..config.settings import APPLICANT_WEBHOOK_URL, JWT_ALGORITHM, JWT_SECRET


async def push_decision(payload: dict[str, Any]) -> dict[str, Any]:
    payload = {**payload, "signed_at": datetime.utcnow().isoformat()}
    signed = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    if not APPLICANT_WEBHOOK_URL:
        return {"sent": False, "reason": "APPLICANT_WEBHOOK_URL not configured", "token": signed}

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(APPLICANT_WEBHOOK_URL, json=payload, headers={"X-LoanIQ-Signature": signed})
            response.raise_for_status()
        return {"sent": True, "status_code": response.status_code}
    except Exception as exc:
        return {"sent": False, "reason": str(exc), "token": signed}
